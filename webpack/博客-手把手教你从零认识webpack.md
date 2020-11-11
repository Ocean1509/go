> 前言： 作为一个现代javascript 应用程序的静态模块打包器，webpack能将各种资源，如js，css， 图片等作为模块来处理，是当下前端工程化的一个很受欢迎的工具，webpack目前最新的版本是4.0，文章将在4.0 的基础上，从使用者的角度，一步步教你认识并搭建一个简单的webpack配置项目，当然webpack的配置和使用较为丰富且复杂，更多的内容需要参考[webpack官网](https://webpack.js.org/concepts/)

## 1. 两个基本的依赖：
首先webpack 项目的两个核心基础模块是webpack 和webpack-cli，这是webpack项目构建的前提
    
```
npm install --save-dev webpack webpack-cli
```

## 2. 运行webpack
默认情况下，webpack 运行构建指令默认 以项目文件夹下的  src/index.js 作为入口文件， 运行 ```webpack```指令会执行默认的webpack 配置文件。

而在一般情况下，需要构建符合项目要求的配置文件，可在package.json  中同过```--config```配置webpack的执行文件(如下)

```
"script":
    {
        "build": "webpack --config ./config/webpack.base.js"
    }
```

## 3. webpack 配置文件的设置
通过指定配置文件后，接下来的工作是根据需要配置执行的配置文件

```
// webpack.base.js

module.exports = {
    
}
```

##### 3.1 入口文件
指定项目的入口文件
```
module.exports = {
    entry: "./****", // 指定入口文件
}
```

##### 3.1 出口文件
```
module.exports = {
    entry: "./****", // 指定入口文件
    output: {
        path: path.resolve(__dirname, ....),// 输出路径，一般为绝对路径
        filename: '****', // 输出文件名  [hash]可以用来每次以hash值的区别生成文件
        publicPath: 'static', //输出url的前缀
    },
    chunkFilename: '***'
}
```

注意:
```
// publicPath 的解释
比如 publicPath  设置为static 之后，html 页面中引用的url 会自动加上static

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>test</title>
</head>
<body>
<script type="text/javascript" src="static/bundle.67c249f5bcf3681ab97e.js"></script></body>
</html>
```

tips: 如何理解chunkFileName: 
    chunkname 是未被列入entry 中， 却又需要被打包出来的文件命名配置，例如，某些公共模块需要单独的抽离出来，这些公共模块就可以用chunkname 来命名
可以见下面的代码分离部分

##### 3.2 配置多个入口文件

```
{
  entry: {
    app: './src/app.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  }
}

// 写入到硬盘：./dist/app.js, ./dist/search.js
```


##### 3.3 clean-webpack-plugin

不断运行 webpack 的指令，每次都会生成不同的不同hash 值的js 脚本，因此，我们需要一个插件，每次构建项目之前，将原先的构建完成的文件夹删除，首选 clean-webpack-plugin 的插件 配置相关如下

```
 const CleanWebpackPlugin = require('clean-webpack-plugin');

 module.exports = {
     plugins: [
        new CleanWebpackPlugin(['dist'], {
            {
                root: '', // 删除文件夹的根路径
                verbose: true, // 是否打开日志
            }
        }) //  第一个参数为删除的文件夹数组
     ]
     
 }
```
相关参数配置[clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin)


##### 3.4 html-webpack-plugin
webpack 构建项目时， 通过指定的入口文件，会将所有的js css 等以依赖模块的形式打包成一个或多个的脚本文件，通常情况下，脚本文件会附属于html 文件运行，这时候需要将 打包好的脚本文件，注入到html 中， html-webpack-plugin 插件的目的是， 以一个html 为模板， 将打包好的脚本注入到模板中， 相关的配置如下

```
const HtmlWebpackPlugin = require('html-webpack-plugin');

new HtmlWebpackPlugin()  // 不带任何配置时， 默认会以一个内置普通的html 作为模板html

new HtmlWebpackPlugin({
    title: 'title', // 给模板中的html 注入标题， 需要在模板的html 中指明配置， <%= htmlWebpackPlugin.options.title %>
    filename: '', // 指定转换后的html 文件名
    template: './',// 模板文件的路径
    chunk: ['main']// chunk 指定了该模板导入的模块，在多页面的配置中，可以在该属性中配置多个入口中的一个或者多个脚本文件
})
```


## 4. mode  模式

所谓模式，webpack4.0默认的模式是 'production',可以通过 mode 来更改模式为'development'

```
module.exports = {
    mode: 'development' // 会将  process.env.NODE_ENV === 'development'
    mode: 'production' // 会将 process.env.NODE_ENV === 'production'
}
```
[相关文章](https://segmentfault.com/a/1190000013712229)


## 5. webpack-dev-server
#### 5.1 生产配置/ 开发配置


- 生产模式下的要求： 注重模块的大小
    
- 开发模式下的要求： 调试， 热更新

在生产环境中，默认会进行脚本的压缩。

webpack --watch // 检测文件改动会重新打包

在开发环境中，我们需要快速的调试代码，因此需要有一个本地的服务器环境，用于访问 webpack 构建好的静态文件，webpack-dev-server 是 webpack 官方提供的一个工具，可以基于当前的 webpack 构建配置快速启动一个静态服务。当 mode 为 development 时，会具备 hot reload 的功能，即当源码文件变化时，会即时更新当前页面，以便你看到最新的效果。

根据需要，需要将配置文件抽离成生产配置和开发配置，并留一个共同的配置文件

使用 webpack-merge 来合并对象
```
npm i --save-dev webpack-dev-server
```

```
// package.json
{
    "name": "development",
    "version": "1.0.0",
    "description": "",
    "main": "webpack.config.js",
    "scripts": {
     "dev": "webpack-dev-server --open", // webpack-dev-server 启动
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
  }
```
```
webpack.dev.js
    
    const merge = require('webpack-merge')
    
    module.exports = merge(base, {
        devtool: "cheap-module-eval-source-map"  
        devServer: {
            port: 8088,
            compress: true,
            ...
        }
    })
    
    
```

讲讲webpack-dev-server 的配置，webpack-dev-server 的配置比较多，具体可以参考[webpack-dev-server官方文档](https://webpack.js.org/configuration/dev-server/#src/components/Sidebar/Sidebar.jsx)

常见的配置：
    
- public： 指定静态服务的域名，当你使用 Nginx 来做反向代理时，应该就需要使用该配置来指定 Nginx 配置使用的服务域名
- port ： 指定端口号
- openPage： 指定初次访问的页面
- publicPath：指定构建好的静态文件在浏览器中用什么路径去访问，默认是 /，比如设为 static 时， 默认访问静态的路径变成 http://localhost:8080/static/bundle.js
- proxy 用于配置 webpack-dev-server 将特定 URL 的请求代理到另外一台服务器上。当你有单独的后端开发服务器用于请求 API 时，这个配置相当有用
```
proxy: {
  '/api': {
    target: "http://localhost:3000", // 将 URL 中带有 /api 的请求代理到本地的 3000 端口的服务上
    pathRewrite: { '^/api': '' }, // 把 URL 中 path 部分的 `api` 移除掉
  },
}...

```




devtool 的各种模式会有另一篇文章进行讲解，敬请期待。。。

## 6. loader
webpack 中提供一种处理多种文件格式的机制，便是使用 loader。我们可以把 loader 理解为是一个转换器，负责把某种文件格式的内容转换成 webpack 可以支持打包的模块。

举个例子，在没有添加额外插件的情况下，webpack 会默认把所有依赖打包成 js 文件，如果入口文件依赖一个 .hbs 的模板文件以及一个 .css 的样式文件，那么我们需要 handlebars-loader 来处理 .hbs 文件，需要 css-loader 来处理 .css 文件（这里其实还需要 style-loader，后续详解），最终把不同格式的文件都解析成 js 代码，以便打包后在浏览器中运行。...

##### 6.1 css-loader
css-loader 负责解析 CSS 代码，主要是为了处理 CSS 中的依赖，例如 @import 和 url() 等引用外部文件的声明
##### 6.2 style-loader
style-loader 会将 css-loader 解析的结果转变成 JS 代码，运行时动态插入 style 标签来让 CSS 代码生效。
##### 6.3 file-loader
file-loader 用来处理jpg/png/gif 等文件格式

##### 6.4 sass-loader node-sass
这两个loader 用于解析scss 文件
```
module.exports = {
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: [
                  process.env.NODE ? 'style-loader' : MiniCssExtractPlugin.loader,
                  'css-loader',
                  'sass-loader'
                ]
          }
        ]
    }
}
```
##### 6.5 babel 相关
为什么要使用babel， 目前低版本的部分浏览器，并不支持es6的相关语法，babel 的目的就是为了讲es6 的相关语法，转换成es5 的语法
```
npm install -D babel-loader @babel/core @babel/preset-env
```
webpack 4中需要安装这三个loader
配置如下：
```
module.exports = {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
            }
        }
      }
    ]
}

```
babel的三个loader 可以解决 箭头函数这类es6 语法， 但是无法解决promise， symbol  这类新增的内建对象，
因此需要引入 ``` babel-polyfill ```来进行全局的转换

ps：  babel-polyfill 需要放在生产依赖中， 即``` npm i --save babel-polyfill ```
并且需要配置 entry 
```
module.exports = {
  entry: ['babel-polyfill', './src/main.js'],
  ···
}
```

使用前
```
main.f66bf9d8d1fd5b0f62ae.css   88 bytes       0  [emitted]  main
bundle.f66bf9d8d1fd5b0f62ae.js   66.6 KiB       0  [emitted]  main
main.f66bf9d8d1fd5b0f62ae.css.map  194 bytes       0  [emitted]  main
bundle.f66bf9d8d1fd5b0f62ae.js.map    219 KiB       0  [emitted]  main
```

使用后
```
main.0c090c129f1d9d4804b0.css   88 bytes       0  [emitted]  main
bundle.0c090c129f1d9d4804b0.js    154 KiB       0  [emitted]  main
main.0c090c129f1d9d4804b0.css.map  194 bytes       0  [emitted]  main
bundle.0c090c129f1d9d4804b0.js.map    219 KiB       0  [emitted]  main
```

tips: 
可以很明显的发现，打包后的bundle会比之前要大大概100k 左右，原因是， babel-polyfill 会对全局进行改写，这样其实坏处是污染了全局的环境，并且增加了打包后的文件大小,这也是要进行安装在dependency 而不是 devDependency的原因


因此， webpack4.0 提供了另外的 plugin-transform-runtime

```
npm install --save-dev @babel/plugin-transform-runtime

npm install --save @babel/runtime


{
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
      plugins: ['@babel/plugin-transform-runtime']
    }
  }
}
```
#### babel-polyfill vs plugin-transform-runtime

@babel/polyfill是全局的方式引入，改变原型prototype，所以会污染全局变量，而@babel/plugin-transform-runtime是以闭包的形式注入，保证了全局环境不被污染。

另外两者的核心都是core-js，目前上面默认使用的都是core-js@2, 但是作者已经封锁了分支，并将新的特性添加到core-js@3中，所以使用时需要手动配置core3

corejs有两个核心的文件夹，分别是 library 和 modules。@babel/runtime-corejs2 使用 library 这个文件夹，@babel/polyfill 使用 modules 这个文件夹。通过文件的不同去区分局部实现和全局污染。


babel-polyfill 的useBuiltIns参数：

  1. useBuiltIns设置为entry比较不错，推荐使用。
  
  在js代码第一行import '@babel/polyfill'，或在webpack的入口entry中写入模块@babel/polyfill，会将browserslist环境不支持的所有垫片都导入；能够覆盖到‘hello‘.includes(‘h‘)这种句法，足够安全且代码体积不是特别大！

  2. useBuiltIns设置为usage
  项目里不用主动import，会自动将代码里已使用到的、且browserslist环境不支持的垫片导入；相对安全且打包的js体积不大，但是，通常我们转译都会排除node_modules/目录，如果使用到的第三方包有个别未做好ES6转译，有遇到bug的可能性，并且检测不到‘hello‘.includes(‘h‘)这种句法。代码书写规范，且信任第三方包的时候，可以使用！(按需使用)

  3. useBuiltIns设置为false比较不错。
  在js代码第一行import '@babel/polyfill'，或在webpack的入口entry中写入模块@babel/polyfill，会将@babel/polyfill整个包全部导入；最安全，但打包体积会大一些，一般不选用。


如何选择：
  如果是自身的项目，可以使用polyfill，但是如果是开发类库，ui组件为了避免全局变量的污染，建议使用runtime


配置：
```
{
  "@babel/preset-env": {
    useBuiltIns: "usage", // 按需引入
    corejs: 3 // 像类似Array.flat()的新特性只能在3中支持。
  }
}
```


## 7.其他plugin
在 webpack 的构建流程中，plugin 用于处理更多其他的一些构建任务。可以这么理解，模块代码转换的工作由 loader 来处理，除此之外的其他任何工作都可以交由 plugin 来完成

##### 7.1 uglifyjs-webpack-plugin
uglifyjs-webpack-plugin 是用来对js 代码进行压缩体积用的，在webpack4.0中， 默认的配置是进行压缩，可以通过 mode 模式的 development 来设置成不进行压缩，默认模式是production

其他的默认配置可以参考：
    [uglifyjs-webpack-plugin](https://webpack.js.org/plugins/uglifyjs-webpack-plugin/)
```
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  //...
  optimization: {
    minimizer: [
      new UglifyJsPlugin()
    ]
  }
}
```

##### 7.2 DefinePlugin
DefinePlugin 是 webpack 内置的插件，可以使用 webpack.DefinePlugin 直接获取。
这个插件用于创建一些在编译时可以配置的全局常量，这些常量的值我们可以在 webpack 的配置中去指定，例如：

```
module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true), // const PRODUCTION = true
      VERSION: JSON.stringify('5fa3b9'), // const VERSION = '5fa3b9'
      BROWSER_SUPPORTS_HTML5: true, // const BROWSER_SUPPORTS_HTML5 = 'true'
      TWO: '1+1', // const TWO = 1 + 1,
      CONSTANTS: {
        APP_VERSION: JSON.stringify('1.1.2') // const CONSTANTS = { APP_VERSION: '1.1.2' }
      }
    }),
  ],
}...

```

有了上面的配置，就可以在应用代码文件中，访问配置好的变量了，如：

```
console.log("Running App version " + VERSION);

if(!BROWSER_SUPPORTS_HTML5) require("html5shiv");
```

##### 7.3 copy-webpack-plugin
这个插件看名字就知道它有什么作用，没错，就是用来复制文件的。

我们一般会把开发的所有源码和资源文件放在 src/ 目录下，构建的时候产出一个 build/ 目录，通常会直接拿 build 中的所有文件来发布。有些文件没经过 webpack 处理，但是我们希望它们也能出现在 build 目录下，这时就可以使用 CopyWebpackPlugin 来处理了。

我们来看下如何配置这个插件：...

```
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  // ...
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/file.txt', to: 'build/file.txt', }, // 顾名思义，from 配置来源，to 配置目标路径
      { from: 'src/*.ico', to: 'build/*.ico' }, // 配置项可以使用 glob
      // 可以配置很多项复制规则
    ]),
  ],
}...

```

##### 7.4 extract-text-webpack-plugin
extract-text-webpack-plugin 是在webpack4.0 之前用来把 依赖的css 分离出来成为单独的文件，可以让脚本文件变得更小， 
webpack 4.0 不再使用extra-text-webpack-plugin来分离css  转而使用mini-css-extract-plugin 

##### 7.5 mini-css-extract-plugin
mini-css-extract-plugin 既需要配置plugin 也需要配置loader
```
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
    plugins: [
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: "[name].[contenthash].css",
			chunkFilename: "[id].css"
		})
	],
	module: {
		rules: [{
			test: /\.(css|scss)$/,
			include: [path.resolve(__dirname, '../src')],
			use: [
				MiniCssExtractPlugin.loader,
				'css-loader'
			]
		}, ]
	}
}
```
tips: 这个插件一般在生产环境中使用，并且使用时不能使用style-loader==
ps: contenthash 和 hash 的区别 见第八部分


##### 7.5 IgnorePlugin
IgnorePlugin 和 ProvidePlugin 一样，也是一个 webpack 内置的插件，可以直接使用 webpack.IgnorePlugin 来获取。

这个插件用于忽略某些特定的模块，让 webpack 不把这些指定的模块打包进去。例如我们使用 moment.js，直接引用后，里边有大量的 i18n 的代码，导致最后打包出来的文件比较大，而实际场景并不需要这些 i18n 的代码，这时我们可以使用 IgnorePlugin 来忽略掉这些代码文件，配置如下：...

```
module.exports = {
  // ...
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
}
```

IgnorePlugin 配置的参数有两个，第一个是匹配引入模块路径的正则表达式，第二个是匹配模块的对应上下文，即所在目录名。


## 8 分离代码文件
为了实现减小打包后代码的体积，利用缓存来加速静态资源访问，需要将不同，且相互不影响的代码块分离出来， 在plugin 中介绍过```mini-css-extract-plugin``` 来对css 文件进行分离， 除此之外， 还建议 公共使用的第三方类库显式地配置为公共的部分，因为第三方库在实际开发中，改变的频率比较小，可以避免因公共 chunk 的频繁变更而导致缓存失效。


```
module.exports = {
  entry: {
    vendor: ["react", "lodash", "angular", ...], // 指定公共使用的第三方类库
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "initial",
          test: "vendor",
          name: "vendor", // 使用 vendor 入口作为公共部分
          enforce: true,
        },
      },
    },
  },
  // ... 其他配置
}

// 或者
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /react|angluar|lodash/, // 直接使用 test 来做路径匹配
          chunks: "initial",
          name: "vendor",
          enforce: true,
        },
      },
    },
  },
}

// 或者
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "initial",
          test: path.resolve(__dirname, "node_modules") // 路径在 node_modules 目录下的都作为公共部分
          name: "vendor", // 使用 vendor 入口作为公共部分
          enforce: true,
        },
      },
    },
  },
}...

```

ps： 在次基础上， 需要在配置的output 中设置 chunkFilename 来配置打包后这些第三方库的名字

```
module.exports = {
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'bundle.[hash].js',
        chunkFilename: 'vendor.[chunkhash].js'
    },
}
```

ps:   hash  和  chunkhash, contenthash 的区别==

- hash 在每次构建的时候都会重新全部生成 ，所有的文件的hash 都是同一个值， 无论是否修改了文件，所有的文件都将重新生成， 起不到缓存的效果； chunkhash根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值,比如我们将一些公共模块，或者第三方依赖包独立开来，接着用chunkhash 生成哈希值，只要不改变公共代码，就不需要重新构建；
然而当chunkhash 用在css 中时， 由于css 和js 用了同一个chunkhash，所以当只改变js 时，css 文件也会重新生成， 所以css 中我们使用contenthash==



## 9 其他一些常用配置
resolve

##### resolve.alias
配置常用模块的相对路径
```
module.exports = {
  //...
  resolve: {
    alias: {
      Util: path.resolve(__dirname, 'src/util/'),
    }
  }
};

实际引用中
imoprt uitl from 'Util/sss'
原始：
import util from './src/util/sss'

```
##### resolve.extensions
这个配置可以定义在进行模块路径解析时，webpack 会尝试帮你补全那些后缀名来进行查找

```
resolve: {
    extensions: [".js", ".vue"],
  },
```

