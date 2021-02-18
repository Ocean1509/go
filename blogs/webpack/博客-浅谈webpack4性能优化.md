
> 前言：在现实项目中，我们可能很少需要从头开始去配置一个webpack 项目，特别是webpack4.0发布以后，零配置启动一个项目成为一种标配。正因为零配置的webpack对项目本身提供的“打包”和“压缩”功能已经做了优化，所以实际应用中，我们可以把精力更多专注在业务层面上，而无需分心于项目构建上的优化。然而从学习者的角度，我们需要了解webpack在项目的构建和打包压缩过程中做了哪些的优化，以及在原有默认配置上，还可以做哪些性能方面上的改进。<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;最近在完成vue的单页面应用后萌生了一个想法，抛弃掉vue-cli的构建配置，从零开始进行webpack优化，并将过程中的思路和体会分享在这篇文章中。webpack的初始配置在我之前写的另一篇[手把手教你从零认识webpack4.0](https://www.jianshu.com/p/f931f47cbf75)文章中，以下内容也不对基本的webpack配置做过多阐述。

### 一，优化的方向
#### 1.1 项目开发
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对开发者而言，我们希望webpack这个工具可以给我们带来流畅的开发体验。比如，当不断修改代码时，我们希望代码的变更能及时的通知浏览器刷新页面，而不是手动去刷新页面。更进一步的我们希望，代码的修改只会局部更换某个模块，而不是整个页面的刷新。这样可以使我们不需要在等待刷新中浪费很多时间，大大提高了页面的开发效率。
#### 1.2 项目部署
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;项目部署上线时，性能优化是我们考虑的重点，有两个方向可以作为核心考虑的点，一个是减少HTTP请求，我们知道在网速相同的条件下，下载一个100KB的图片比下载两个50KB的图片要快，因此，我们要求webpack将多个文件打包成一个或者少量个文件；另一个优化的重点是减少单次请求的时间，也就是尽可能减少请求文件的体积大小。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;webpack中在性能优化所做的努力，也大抵围绕着这两个大方向展开。另外在构建项目中，我们也希望能持续的提高构建效率。
### 二, 提升开发效率
#### 2.1 减少体积
开发环境下，我们依然对代码的体积有一定的要求，更小的体积可以让加载速度更快，开发效率更高，当然配置也相对简单。
```
// webpack.dev.js 开发环境webpack配置
module.exports = {
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 9000,
        compress: true, // 代码压缩
      },
}
```

#### 2.2 模块热更新(HMR)
开发过程中，我们希望修改代码的过程中，页面能实时且不需要手动的刷新。因此使用HRM， HMR 既避免了频繁手动刷新页面，也减少了页面刷新时的等待，大幅度提高了开发效率。
```
// webpack.dev.js
module.exports = {
  devServer: {
    compress: true,
    hot: true // 开启配置
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
}
```
### 三，构建体积优化
#### 3.1 生产中的sourcemap 模式
webpack 在构建中提供了不少于7种的sourcemap模式，其中eval模式虽然可以提高构建效率，但是构建后的脚本较大，因此生产上并不适用。而source-map 模式可以通过生成的 .map 文件来追踪脚本文件的 具体位置，进而缩小脚本文件的体积，这是生产模式的首选，并且在生产中，我们需要隐藏具体的脚本信息，因此可以使用 cheap  和module 模式来达到目的。
综上，在生产的webpack devtool选项中，我们使用 ```cheap-module-source-map```的配置
```
// webpack.pro.js 生产webpack配置脚本
module.exports = {
  mode: 'production',
  devtool: 'cheap-module-source-map',  
}

```
#### 3.2 独立css 文件
以单入口文件而论，通常我们会将页面的所有静态资源都打包成一个JS 文件，这已经实现了1.2 中的优化部分，将代码合并成一个静态资源，减少了HTTP 请求。

##### 分离前
![在这里插入图片描述](https://user-gold-cdn.xitu.io/2018/11/21/167354df5acf9b11?w=808&h=145&f=png&s=15509)
但是接下来，我们需要将css代码独立开来，为什么呢？最主要的一点是我们希望更好的利用浏览器的缓存，当单独修改了样式时，独立的css文件可以不需要应用去加载整个的脚本文件，提高效率。并且，当遇到多页面的应用时，可以单独将一些公共部分的样式抽离开来，加载一个页面后，接下来的页面同样可以利用缓存来减少请求。

webpack4.0 中提供了抽离css文件的插件，```mini-css-extract-plugin```,只需要简单的配置便可以将css文件分离开来
```
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    ···
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
            chunkFilename: "[name].[contenthash].css"
        })
    ],
    module: {
        rules: {
            test: /\.(css|scss)$/,
            use: [process.env.NODE_ENV == 'production' ? MiniCssExtractPlugin.loader : 'style-loader', {
              loader: 'css-loader',
              options: {
                sourceMap: true
              },
            }, "sass-loader"]
        }
    }
    ···
}
```
##### 分离后
![在这里插入图片描述](https://user-gold-cdn.xitu.io/2018/11/21/167354df5aba69f5?w=858&h=124&f=png&s=14616)
#### 3.3 压缩js, html, css 文件
要想优化构建后的体积，不断减少静态资源文件的大小，我们希望webpack帮助我们尽可能压缩文件的体积。对于js 脚本文件而言，webpack4.0 在mode 为‘production’时，默认会启动代码的压缩。除此之外，我们需要手动对html和css 进行压缩。</br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;针对html 的压缩，只需要对[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin#options)进行相关配置。
```
// webpack.base.js 

module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
          title: 'minHTML',
          filename: 'index.html',
          template: path.resolve(__dirname, '../index.html'),
          minify: { // 压缩 HTML 的配置
            collapseWhitespace: true,
            removeComments: true,
            useShortDoctype: true
          }
        }),
    ]
}

```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;针对css 的压缩， webpack4.0 使用```optimize-css-assets-webpack-plugin```来压缩单独的css 文件。
```
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
    plugins: [
        new OptimizeCSSAssetsPlugin()
    ],
}
```
![在这里插入图片描述](https://user-gold-cdn.xitu.io/2018/11/21/167354df5ad837ec?w=599&h=50&f=png&s=6551)
![在这里插入图片描述](https://user-gold-cdn.xitu.io/2018/11/21/167354df5abefa48?w=716&h=74&f=png&s=7555)
对比之下，我们可以看到明显的效果，关于压缩css 更多的配置可以参考[optimize-css-assets-webpack-plugin](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin)

#### 3.4. 合并压缩图片
处理完前端的三大块js,html,css后， 接下来优化能想到的是处理图片。前面提到，提升性能的一个重要的条件是降低http请求数，而应用中经常会有大大小小的图片需要处理，对应用中的小图标来说，css sprite 是首选，将各种图标集合成一张大的图片可以很好的减少网络请求数。而对于需要独立开的图片，且大小在合理范围内时，我们可以将图片转换成 base64位编码，内嵌到css 中，同样可以减少请求。

##### 3.4.1 base64 转换
处理图片资源时，webpack 提供了 file-loader 和url-loader 两个loaders供选择，file-loader 和url-loader 的作用，可以用来解析项目中图片文件的url引入问题。两者的区别在于，url-loader 可以将小于指定字节的文件转为DataURL, 大于指定字节 的依旧会使用file-loader 进行解析
```
// webpack.base.js
module.exports = {
    module: {
        rules: [{
            test: /\.(png|jpe?g|gif|svg|ttf|woff2|woff)(\?.*)?$/,
            use: [{
              loader: 'url-loader',
              options: {
                limit: 10000, // 限制大小
              }
            }, 
        ]
  },
}
```

##### 3.4.2 压缩图片
处理完雪碧图和小图片的base64转换后，对于大图片来说，webpack还可以做到对图片进行压缩，推荐使用```image-webpack-loader```,插件提供了多种形式的压缩，详细可以参考[官网文档](https://github.com/tcoopman/image-webpack-loader)

```
// webpack.base.js
module.exports = {
    module: {
        rules: [
            {
              loader: 'image-webpack-loader',
              options: {
                optipng: { // 使用 imagemin-optipng 压缩 png，enable: false 为关闭
                  enabled: true,
                },
                pngquant: { // 使用 imagemin-pngquant 压缩 png
                  quality: '65-90',
                  speed: 4
                },
              }
            }
        ]
    }
}
```

效果对比如下：
![在这里插入图片描述](https://user-gold-cdn.xitu.io/2018/11/21/167354df5d157d6e?w=670&h=84&f=png&s=8256)
![在这里插入图片描述](https://user-gold-cdn.xitu.io/2018/11/21/167354df5adbd299?w=738&h=87&f=png&s=8674)
#### 3.5 依赖库分离
一个中大型应用中，第三方的依赖，庞大得可怕，占据了打包后文件的一半以上。然而，这些依赖模块又是很少变更的资源，和css 代码分离的逻辑相似，分离第三方依赖库，可以更好的利用浏览器缓存，提升应用性能。因此，将依赖模块从业务代码中分离是性能优化重要的一环。
webpack4.0 中，依赖库的分离只需要通过 optimization.splitChunks 进行配置即可。
```
// webpack.pro.js
module.exports = {
    optimization: {
       splitChunks: {
          cacheGroups: {
            vendor: {
              chunks: "initial",
              test: path.resolve(__dirname, "../node_modules"),
              name: "vendor", // 使用 vendor 入口作为公共部分
              enforce: true,
            },
          },
        },
      },
}

```
公共库分离后的结果
![在这里插入图片描述](https://user-gold-cdn.xitu.io/2018/11/21/167354df7a657089?w=660&h=129&f=png&s=13833)
#### 3.6 依赖分析
正如前面所讲，在优化分析中，实际影响体积最大的是 node_modules 的第三方库，这一部分的优化可以大大的减少打包后的体积。这里我们使用最新的```webpack-bundle-analyzer```插件来分析打包好后的模块，它可以将打包后的内容束展示位方便交互的直观树状图，通过它，可以知道项目大致有哪些模块组成，哪个模块占据的体积较大，是否是可替代的。

我们大致可以从几个方向考虑
- 1.判断依赖是否不可或缺，依赖在项目中使用率是否过低。在项目中，可能针对某个运算，某个功能，我们使用了一个庞大的库，这个库在体积上的占比较大，而功能使用却较少。这个时候我们可以寻找体积更小，且功能满足的替换库，或者手动实现某些依赖的功能来替换他。
- 2.大型库是否可以通过定制功能的方式减少体积。明显的一个例子是 echart， echart完全版的依赖压缩后也有几百k 之多，这显示是难以接受的。现实项目中，我们可能只需要少量或者部分的echart 功能，这时我们可以通过制定图表的形式，下载图表用到的功能，达到体积最优化。
- 3.某些不可优化的大型库是否可以通过外部引用的方式减少文件体积。例如像bootstrap，vue这类无法优化的第三方库，通过免费开源的cdn服务不但可以减少文件体积，还可以提高网站的加载速度，也是个优化性能的方法


#### 3.7 按需加载
前面提到依赖分析的方向中，如果大型库不可或缺，而且使用率也不算低的时候，我们可以通过按需加载的形式。这种方式实际上是先把你的代码在一些逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块。这样加快了应用的初始加载速度，减轻了它的总体体积，因为某些代码块可能永远不会被加载。

webpack中利用require.ensure()实现按需加载，在不使用按需加载的情况下，首屏加载时会把所有的脚本同时加载出来，这往往会拖累首屏显示时间，带来不好的用户体验。例子来说。当项目需要使用大型的图表类库，而首页并不需要时，按需加载往往比同时加载在用户体验上好好得多。

当不需要按需加载的时候，我们的代码可能是这样的：
```
import test from './components/test.vue'
import test2 from './components/test2.vue'
```
开启按需加载时，我们的代码修改为：
```
const test = r => require.ensure([], () => r(require('./components/test.vue')), 'chunk1')
const test2 = r => require.ensure([], () => r(require('./components/test2.vue')), 'chunk2')
```
webpack 配置修改为
```
output: {
    ···
    chunkFilename: '[name].[hash].js'
}
```

这时编译出来的文件会从原来的一个，变成了多个小文件。每个路由加载时会去加载不同的资源。特别在首屏的资源加载上进一步优化了应用的体验。

尽管如此，实际中我们需要根据项目的需求来衡量按需加载的可用性，尽管在首屏优化上取得较大的提升，但按需加载毕竟会将大的文件拆分成多个小文件，增加了http 的请求数。这又违背了性能优化的基础。所以实际中需要取舍，更需要权衡。

#### 3.8 删除冗余代码
代码体积优化到这一步，基本可以优化的地方已经优化完毕了。接下来可以抓住一些细节做更细的优化。比如可以删除项目中上下文都未被引用的代码。这就是所谓的 Tree shaking 优化。webpack 4.0中，mode 为production 默认启动这一优化。但是，如果在项目中使用到babel的 话，需要把babel解析语法的功能关掉。只需要
```
// .babelrc

{
  "presets": [["env", { "modules": false }]]
}
```


### 四，构建速度优化
说完如何减少项目构建后的大小后，接下来简单的谈一下如何提高构建的速度。实际上webpack的 构建速度，只需要简单的修改配置便能大幅提高速度。常见的设置如下。
#### 4.1 babel-loader构建时间过长
##### 4.1.1 限定加载器作用范围
由于babel-loader需要将语法进行转换，所耗费的时间较长，所以第一步需要限定babel-loader 作用的范围，让babel-loader 的搜索和转换准确的定位到指定模块。大幅提高构建速度。
例如：
```
// webpack.base.js
module.exports = {
    module:{
        rules: [
            {
                test: /\.js$/,
                include: [resolve('src')],// 限定范围
                use: {
                  loader: 'babel-loader',
                },
            },]
    }
}
```
##### 4.1.2 缓存加载器执行结果
正因为babel-loader在解析转换上耗时太长，所以我们希望能缓存每次执行的结果。webpack的loader中刚好有 cacheDirectory 的选项，默认为false 开启后将使用缓存的执行结果，打包速度明显提升。
```
// webpack.base.js
module.exports = {
    module: {
        rules: [
            {
            test: /\.js$/,
            include: [resolve('src')],
            use: {
              loader: 'babel-loader?cacheDirectory',
            },
        },]
    }
}
```

#### 4.2 resolve 解析优化
webpack 的resolve 做相关的配置后，也可以让项目的构建速度加快。具体看下文的配置：
- 当项目中出现 import 'react' 既不是绝对路径也不是相对路径时，指定好搜索的路径，可以不用过多的查询
- 尽可能少的使用 resolve.alias  来设置路径别名，因为会影响到tree shaking 的优化
- 后缀自动补全尽可能的少。减少路径查询的工作
- 当使用的第三方库过大，并且不包含import require define 的调用。可以使用noParse让库不被loaders 解析

```
// webpack.base.js
module.exports = {
    resolve: {
      modules: [
        path.resolve(__dirname, 'node_modules'),
      ],

      extensions: [".js"], 
    
      // 避免新增默认文件，编码时使用详细的文件路径，代码会更容易解读，也有益于提高构建速度
      mainFiles: ['index'],
    }，
    module: {
        noParse: function(content){
            return /jquery/.test(content)
        }
    }
}

```
### 五，结语
webpack性能优化的瓶颈还是集中在构建时间和构建体积上，作为构建工具业界霸主，webpack一直不停的优化构建打包流程。通过对旧有项目的优化也可以对webpack这个工具以及性能优化的知识有更深的了解。
