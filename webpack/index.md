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

