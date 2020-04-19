tip: node 不适合操作mysql，因为为了提高mysql效率，必须有连接池，而node并不方便

完美支持对象数据库-mongond


热部署：
    部署过程中用户的请求不受影响。


### 系统文件常识

linux 查看文件权限 ls -al

权限分配    文件所有者(自己)   文件所属组(家人)   其他用户(陌生人)
权限项      读 写 执行
字符表示    r  w  x
数字        4  2  1 



![](../imgs/node01.png)
d   目录文件
p   管道文件
l   连接文件
-   普通文件


window 默认可读可写不可执行   666


### node读取大文件
fs.readFile 不适合读取大文件，因为文件的读取是要将读取的内容放到缓存中的，所以大文件会占用比较大的空间。可以使用fs.read()来操作



fs.open, fs.read ? 


### stream
起点终点
逐段读取，适合大数据，大文件
传统： 一次性读取完毕，再处理

好处：
    内存效率
    时间效率
```
const fs = require('fs')
const rs = fs.createReadStream('data.txt')
let data = ""
rs.on('data', chunk => {
    // chunk 二进制buffer
    data += chunk
})
rs.on('end', () => {
    console.log('读取成功')
})
```


读取大文件写入时，可读流和可写流有可能数据不一致，导致数据的丢失，所以需要引入管道


pipe是可读流的方法，保证读写速度，防止数据丢失




node中流的类型
    4种类型：
        可读流
        可写流
        duplex: 双工流    net.socket
        transform: 转换流
    stream对象都是EventEmitter的实例
        data
        end
        error


如何使用
可读流:
    有两种模式，一种是自动流动flowing模式，另一种是手动流动paused模式
    1. rs.on('data', () => {})
    2. rs.on('readalbe', () => {
        while((chunk = rs.read())!== null) {
            data += chunk
        }
    })

可写流:
    write

双工流：
    duplex
    net.socket
    read
    write

转换流：


node中的文件操作都是基于流的，而
