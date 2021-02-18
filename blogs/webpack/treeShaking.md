### treeshaking的设置

通过 package.json 的 "sideEffects" 属性，来告诉webpack，包里所有的代码没有副作用，可以支持tree-shaking

### babel-loader导致Tree-shaking失效
Tree-shaking实现的前提是必须要使用ES Modules去组织我们的代码，也就是说由webpack打包的代码必须使用ESM。
webpack在打包所有模块之前，先是将模块根据配置交给不同的loader去处理，最后再将所有loader处理过后的结果打包到一起。
为了转换代码中的ECMAScript新特性，很多时候我们都会选择babel-loader去处理我们的js文件。而在babel转换我们的代码时，就有可能处理掉我们代码中的ES Modules把它们转换成CommonJS，这取决于我们有没有使用转换ESM的插件。

我们所使用的preset-env插件集合，它里面就有这么一个插件，所以当preset-env这个插件集合开始工作的时候，我们代码中ESM的部分就应该会被转换成CommonJS的方式，webpack打包时拿到的代码就是以CommonJS组织的代码，所以Tree-shaking就不能生效。

可以通过babelrc设置modules: false 让tree-shaking重新生效

```
presets:[ 
	// 注意，这里的结构，还是一个数组
	// 如果想要转CommonJS，可以设置成modules: "commonjs"
    ['@babel/preset-env', { modules: false }]
]
```