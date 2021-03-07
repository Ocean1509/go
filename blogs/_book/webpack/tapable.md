### webpack 事件机制
Webpack是基于事件流的插件集合，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是Tapable，Tapable是一个类似Node.js的EventEmitter的库,主要是控制钩子函数的发布与订阅，控制着webpack的插件系统。Webpack中最核心的负责编译的Compiler和负责创建的捆绑包的Compilation都是Tapable实例。
Tapable库暴露很多Hook类，为插件提供挂载的钩子。
```js
const {
	SyncHook,  // 同步钩子
	SyncBailHook, // 同步熔断钩子
	SyncWaterfallHook, // 同步流水钩子
	SyncLoopHook, // 同步循环钩子
	AsyncParallelHook, // 异步并发钩子
	AsyncParallelBailHook, // 异步并发熔断钩子
	AsyncSeriesHook, // 异步串行钩子
	AsyncSeriesBailHook, // 异步串行熔断钩子
	AsyncSeriesWaterfallHook // 异步串行流水钩子
 } = require("tapable");
const hook = new SyncHook(["arg1", "arg2", "arg3"]);
```

Tapable提供了同步和异步绑定钩子的方法，并且他们都有绑定事件以及执行事件对应的方法。

```
Async*
绑定: tapAsync/tapPromise/tap   执行: callAsync/promise
Sync*
绑定: tap                       执行: call
```

使用例子：
```js
const { SyncHook } = require("tapable");
let queue = new SyncHook(['name']); //所有的构造函数都接收一个可选的参数，这个参数是一个字符串的数组。

// 订阅
queue.tap('1', function (name, name2) {// tap 的第一个参数是用来标识订阅的函数的
    console.log(name, name2, 1);
    return'1'
});
queue.tap('2', function (name) {
    console.log(name, 2);
});
queue.tap('3', function (name) {
    console.log(name, 3);
});

// 发布
queue.call('webpack', 'webpack-cli');// 发布的时候触发订阅的函数 同时传入参数

// 执行结果:
/*
webpack undefined 1 // 传入的参数需要和new实例的时候保持一致，否则获取不到多传的参数
webpack 2
webpack 3
*/
```


### webpack实现插件机制大体的方式是：
核心是基于tapable实现对整个构建流程的控制。
1. webpack在其对象内部创建了各种钩子
2. 插件将自己的方法注册到对应的钩子上，交给webpack来处理
3. webpack在编译过程中，会适时的去触发钩子，也因此触发了插件的方法。

