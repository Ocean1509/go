### 参考内容
[webpack externals深入理解](https://segmentfault.com/a/1190000012113011)
### 概念的理解
如果想引入一个库，但是又不想让webpack打包，并且又不影响我们在程序中以cmd,amd,或者window/global全局方式使用，那么可以配置externals

例如，lodash想通过外部引用，避免打包过大。

```
{
  externals: {
    "lodash": {
      commonjs: "lodash",// 运行在nodejs环境
      commonjs2: "lodash", // 运行在nodejs环境，且方式为module.export.default = lodash
      amd: "lodash", // 使用requirejs加载的方式，amd
      root: "_" // 浏览器使用，需要提供一个全局变量"_",例如script标签引入全局变量 _
    }
  }
}
```

配置需要根据你的代码最终的运行环境来，默认是global


### external 和 libraryTarget的关系

libraryTarget配置如果暴露，如果不设置libraryTarget，相当于是一个自执行函数。

externals决定是某种形式加载所引入的额外的包

libraryTarget决定了你的library运行在哪个环境，哪个环境也就决定了你哪种模式去加载引入的额外的包。
也就是说，externals应该和libraryTarget保持一致。library运行在浏览器中，设置的external的模式为commonjs，那代码就运行不了。

如果是应用程序开发，一般运行在浏览器环境libraryTarget可以不设置，external模式默认为global，也就是全局变量模式加载所引入外部的库。

```{ root, amd, commonjs, ... }```只允许使用的对象```libraryTarget: 'umd'```。不允许其他库目标使用。


