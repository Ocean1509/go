### webpack vs rollup
Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码，可以将你的代码进行标准化格式，指定规范进行模块打包，例如：commonjs, amd, cmd, systemjs

对于应用使用 webpack，对于类库使用 Rollup

这不是一个绝对的规则 – 事实上有许多 网站 和 应用程序使用 Rollup 构建，同样的也有大量的库使用了 webpack 构建。但是，对于应用使用 webpack，对于类库使用 Rollup 是一个很好的经验法则。

如果你需要代码拆分(Code Splitting)，或者你有很多静态资源需要处理，再或者你构建的项目需要引入很多CommonJS模块的依赖，那么 webpack 是个很不错的选择。如果您的代码库是基于 ES2015 模块的，而且希望你写的代码能够被其他人直接使用，你需要的打包工具可能是 Rollup 。



常用的几种打包优化
1. 入口配置：entry 入口  webpack.ProvidePlugin
2. 抽取公共代码： splitChunks  和webpack3  commonChunk的区别
3. 动态加载： 按需加载，懒加载   import  webpackchunkname   @babel/plugin-syntax-dynamic-import



js压缩会被css压缩所影响 terser-webpack-plugin




rollup



操作系统的意义在于进程的调度
时间片轮转

并不是核数越多效率就越高，对于cpu密集型的应用而言，它还可以分为并行和串行，并行可以利用多核提高效率，串行则只能依赖于单核的性能。
 



 fork(同样的代码复制多份出来)  和   exec(程序不一样，另一个程序依赖于另一个程序)


多进程共享数据：
 消息，共享内存

