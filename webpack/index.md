amd 和 cmd的区别

tree shaking
loader执行顺序，从下到上，从右到左
postcss-loader  
    options: autoprefixer


多入口配置：
    通过占位符

    publicPath   输出url的前缀

sourcemap


webpack --watch   // 检测文件改动，重新打包

HMR hot module replacement


@babel/polyfill 全局变量的形式将方法引入，开发类库，ui组件时，全局变量的污染  配置cors3js

@babel/plugin-transform-runtime  以闭包方式注入，保证全局环境不被污染 配合@babel/runtime-corejs3


生产环境
    tree shaking

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

