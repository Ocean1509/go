### Scope Hoisting(作用域提升)
需要使用es6的import export语法，以便进行静态分析。

```
// 使用
module.exports = {
  plugins: [
    // 开启 Scope Hoisting 功能
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}
```

当不开启scope hoisting时，每个函数对应一个作用域，这样体积会很大，而开启后，webpack会静态分析函数的作用域，减少函数声明。例如将其中一个函数声明注入到另一个作用域中。这样做的好处： 

- 代码体积会变小，因为函数声明语句会产生大量代码，但是第二个没有函数声明。
- 代码在运行时因为创建的函数作用域减少了，所以内存开销就变小了。