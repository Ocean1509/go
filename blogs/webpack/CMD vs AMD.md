### AMD 和 CMD的区别
AMD规范的实现是requirejs，CMD规范的实现的seajs

两者的区别不在于加载的时机，而在于执行处理时机。

```js
// amd
define("main", ["a.js", "b.js"], function() {
  // 
})

// cmd
define("main", function(){
  const a = require("a")
  const b = require("b")
})

```
两者都是异步加载，原理利用script标签的async属性。amd通过第二个参数可以优先知道需要的依赖，而cmd会利用像正则匹配的方式，在执行先预先知道需要下载的依赖。两者都是在加载完毕后才会执行模块的回调。

核心的区别在于，amd在执行回调前会先执行所有的依赖，而cmd在脚本使用时才执行。

这就是网上所说的，AMD推崇依赖前置，而CMD推崇就近依赖。本质上是执行时机的不同。但是都是异步加载模块。


### commonjs为什么不能用在浏览器端
commonjs是同步的，在服务端require引入都文件都在硬盘中，同步加载的时间就是硬盘读取的时间，这个时间很短。而浏览器端不能采取同步的方式，网络io的时间远远比本地文件读取时间长，所以会造成阻塞。

