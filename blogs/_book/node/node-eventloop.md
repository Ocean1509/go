 ### 浏览器eventloop

异步队列分为宏任务独立和微任务队列
宏任务队列：
    settimeout，setInterval，requestAnimationFrame
微任务队列：
    promise，mutationObserver

 ### node的事件机制和浏览器的事件机制有什么区别？ 
![](https://user-gold-cdn.xitu.io/2019/1/11/1683d81674f076eb?imageslim)
node是以v8作为js的解析引擎，针对IO的处理交给了libuv，libuv是一个基于事件驱动的跨平台抽象层。
具体过程是：
我们写的代码应用application，先经过v8引擎进行编译，之后会调用nodeAPI执行相应事件，而libuv库则负责这一系列api的执行，他内部会将异步任务维持一个event-loop(事件循环)，最终v8引擎会将结果返回给用户。

event-loop有六个阶段
timer: 执行setTimeout,setInterval之类的定时器
pending callback： 处理上个循环阶段少数未执行的IO回调
idle,prepare: 内部阶段调用
poll：
    执行所有异步任务IO回调，当任务完成，
        如果有setTimeout,setInterval的回调需要执行，则跳到timer阶段
        如果没有timer回调，则会进入check阶段，执行setImmediate回调,如果没有setImmediate回调，则会在poll队列中一直等待，但是依旧有个超时限制。
check：执行setImmediate回调

重点关注 timer，poll，check

除此之外，在每个阶段在切换到下个阶段前，会执行process.nextTick


例子：
```
setTimeout(_ => console.log("setTimeout"))
setImmediate(_ => console.log("setImmediate"))
// setImmeidate,setTimeout
// setTimeout,setImmeidate
```
执行结果和机器的性能有关，setTimeout,setImmediate都有执行时间，如果在进入poll阶段时，setTimeout回调已经插入队列，则会先执行setTimeout的回调，再执行setImmediate的回调，相反，会先执行setImmediate后再执行setTimeout

```
const fs = require("fs")
fs.readFile('./test.html', () => {
    setTimeout(_ => console.log("setTimeout"))
    setImmediate(_ => console.log("setImmediate"))
})
```
// setImmediate, setTimeout, 先check，再timer


process.nextTick 的用处？
https://www.cnblogs.com/duhuo/p/4420473.html

### 不同版本下eventloop的不同

node11版本之前
一旦执行一个阶段，会先将这个阶段里的所有任务执行完成之后，才会执行该阶段剩下的微任务

node11版本之后
一旦执行一个阶段里的一个宏任务，就立刻执行对应的微任务队列

注意： process.nextTick虽然也属于微任务队列，但是他比较特殊，会在每个阶段执行前清空process.nextTick的回调。

```

setTimeout(() => {
    console.log("timer1")
    Promise.resolve().then(function() {
        conosle.log("promise1")
    })
}, 0)
setTimeout(() => {
    console.log("timer2")
    Promise.resolve().then(function() {
        conosle.log("promise2")
    })
}, 0)


// node11
// timer1, promise1, timer2, promise2

// node11以前
// timer1, timer2, promise1, promise2
```


### 题目
```
async function async1() {
    console.log('async start');
    await new Promise(resolve => {
        console.log('promise1')
    })
    console.log('async1 success')
    return 'async1 end'
}

console.log('script start')

async1().then(res => console.log(res))

console.log('script end')

// script start
// async start
// promise1
// script end
```

await 会等待promise的执行结果，题目中await new Promsie()没有resolve，reject返回，所有后面都不会执行。



### 题目
```
async function async1() {
    console.log('async1 start', 1)
    return new Promise(resolve => {
        resolve(async2())
    }).then(() => {
        console.log('async1 end', 4)
    })
}

function async2() {
    console.log('async2', 2)
}

setTimeout(function() {
    console.log('settimeout')
})
async1()

new Promise((resolve) => {
    console.log("promise1", 3)
    resolve()
}).then(() => {
    console.log('promise2')
}).then(() => {
    console.log('promise3')
}).then(() => {
    console.log('promsie4')
})

// async1 start, async2, promise1, async1 end , promise2, promise3, promsie4, settimout
```
如果将 `function async3() {}` 改为 `async function async3() {}`输出变为
```
async1 start async2 promise1, promise2, promise3, async1 end promise4
```
resolve参数是promise对象，或者then对象，会进行拆箱。