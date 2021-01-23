node14之前不支持多线程，如果想充分利用cpu的核心数处理并发，需要使用多进程。

### node创建进程

node提供了child_process模块用于创建子进程，有四种方式创建

* child_process.spawn()：适用于返回大量数据，例如图像处理，二进制数据处理。(父子通信：管道，事件监听)
* child_process.exec()：适用于小量数据，maxBuffer 默认值为 200 * 1024 超出这个默认值将会导致程序崩溃，数据量过大可采用 spawn。
* child_process.fork()： 衍生新的进程，进程之间是相互独立的，每个进程都有自己的 V8 实例、内存，系统资源是有限的，不建议衍生太多的子进程出来，通长根据系统 CPU 核心数设置。父子进程通过IPC通信。(充分利用cpu资源)
* child_process.execFile(): 类似 child_process.exec()，区别是不能通过 shell 来执行，不支持像 I/O 重定向和文件查找这样的行为

### 如何利用多进程

##### 主进程

* 创建一个 server 并监听 3000 端口。
* 根据系统cpu开启多个子进程，每个子进程为相同的应用脚本
* 主进程通过send像子进程发送消息
* 主进程对所有子进程进行管理

``` 
// app.js

const { fork } = require('child_process')
const net = require('net')
const cpu = require('os').cpus()

// 系统可利用的cpu核数，对应子进程数
const cpuLength = cpu.length

// 主进程基于TCP建立服务，监听3002端口
const server = net.createServer().listen(3002)

// 子进程管理
const workers = {}

console.log('父进程', process.pid)
const createServer = function() {
  // 创建子进程
  const worker = fork('./main.js')
  // 像子进程发送tcp服务
  worker.send('server', server);
  // 子进程退出监听
  worker.on('exit', (code, msg) => {
    // dosomething
  })

  workers[worker.pid] = worker
}

// 根据cpu数创建子进程
for(let i = 0; i < cpuLength - 1; i++) {
  createServer()
}
```

##### 子进程

* 创建server对象，但是不对端口进行监听
* 通过 message 事件接收主进程 send 方法发送的消息
* 监听 uncaughtException 事件，捕获未处理的异常，发送错误信息给主进程进行处理

``` 
const http = require('http')
console.log('子', process.pid, '父', process.ppid)

// 创建server对象
const server = http.createServer((req, res) => {
  res.end('end')
})

let worker;
process.on('message', (message, sendHandle) => {
  // 接收主进程send发送的信息
  if (message === 'server') {
    worker = sendHandle;
    worker.on('connection', (socket) => {
      // 子进程可以通过socket监听父进程相同的端口
      server.emit('connection', socket);
    });
  }
});

process.on('uncaughtException', (err) => {
  // 异常处理
  process.send()
})
```

### 进程守护

进程守护可以利用主进程对子进程进行管理。如果子进程出现错误，进程杀死，父进程可以通过监听子进程的exit事件知晓，并做处理，可以重新fork一个进程。这是最核心的原理。

### cluster

node中有原生的cluster模块启动多进程管理，是一种更方便的实现思路

``` 
// 主进程app.js
const cluster = require('cluster')
const cpu = require('os').cpus()
if (cluster.isMaster) {
  console.log('父进程', process.pid)
  for (let i = 0; i < cpu.length - 1; i++) {
    const child = cluster.fork()
    child.on('exit', (code, msg) => {
    })
  }
} else {
  require('./main.js')
}
```

``` 
// 子进程
const http = require('http')
console.log('子进程: ', process.pid)

http.createServer((req, res) => {
  res.end('end')
}).listen(3002)
```

### cluster创建多进程为什么不会出现端口冲突

当父子进程之间建立 IPC 通道之后，通过子进程对象的 send 方法发送消息，第二个参数 sendHandle 就是句柄，可以是 TCP套接字、TCP服务器、UDP套接字等。

所谓ipc通信(Inter-process communication) ，即进程间通信技术，由于每个进程创建之后都有自己的独立地址空间，实现 IPC 的目的就是为了进程之间资源共享访问，实现 IPC 的方式有多种：管道、消息队列、信号量、Domain Socket，Node.js 通过 pipe 来实现。

看一下 Demo，未使用 IPC 的情况

``` 
// pipe.js
const spawn = require('child_process').spawn;
const child = spawn('node', ['worker.js'])
console.log(process.pid, child.pid); // 主进程id3243 子进程3244
```

``` 
// worker.js
console.log('I am worker, PID: ', process.pid);
```

控制台执行 node pipe.js，输出主进程id、子进程id，但是子进程 worker.js 的信息并没有在控制台打印，原因是新创建的子进程有自己的stdio 流。
结果：

``` 
41948 41949
```

创建一个父进程和子进程之间传递消息的 IPC 通道实现输出信息

修改 pipe.js 让子进程的 stdio 和当前进程的 stdio 之间建立管道链接，还可以通过 spawn() 方法的 stdio 选项建立 IPC 机制。

``` 
// pipe.js
const spawn = require('child_process').spawn;
const child = spawn('node', ['worker.js'])
child.stdout.pipe(process.stdout);
console.log(process.pid, child.pid);
```

### 集群方式

集群模式实现通常有两种方案：

方案一：1 个 Node 实例开启多个端口，通过反向代理服务器向各端口服务进行转发
方案二：1 个 Node 实例开启多个进程监听同一个端口，通过负载均衡技术分配请求（Master->Worker）

首先第一种方案存在的一个问题是占用多个端口，造成资源浪费，由于多个实例是独立运行的，进程间通信不太好做，好处是稳定性高，各实例之间无影响。

第二个方案多个 Node 进程去监听同一个端口，好处是进程间通信相对简单、减少了端口的资源浪费，但是这个时候就要保证服务进程的稳定性了，特别是对 Master 进程稳定性要求会更高，编码也会复杂。

在 Nodejs 中自带的 Cluster 模块正是采用的第二种方案。



### fork 和cluster

fork是指fork主线程
cluster是利用多核