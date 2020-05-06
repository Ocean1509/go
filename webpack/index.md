### webpack vs rollup
Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码，可以将你的代码进行标准化格式，指定规范进行模块打包，例如：commonjs, amd, cmd, systemjs

对于应用使用 webpack，对于类库使用 Rollup

这不是一个绝对的规则 – 事实上有许多 网站 和 应用程序使用 Rollup 构建，同样的也有大量的库使用了 webpack 构建。但是，对于应用使用 webpack，对于类库使用 Rollup 是一个很好的经验法则。

如果你需要代码拆分(Code Splitting)，或者你有很多静态资源需要处理，再或者你构建的项目需要引入很多CommonJS模块的依赖，那么 webpack 是个很不错的选择。如果您的代码库是基于 ES2015 模块的，而且希望你写的代码能够被其他人直接使用，你需要的打包工具可能是 Rollup 。

