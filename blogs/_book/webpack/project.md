speed-measure-webpack-plugin

构建分析

50s

由于 speed-measure-webpack-plugin 对于 webpack 的升级还不够完善，目前（就笔者书写本文的时候）还存在一个 BUG，就是无法与你自己编写的挂载在 html-webpack-plugin 提供的 hooks 上的自定义 Plugin （add-asset-html-webpack-plugin 就是此类）共存，因此，在你需要打点之前，如果存在这类 Plugin，请先移除，否则会产生如我这篇 issue 所提到的问题。


html-webpack-plugin 从3版本升级到4


babel缓存

babel-loader  21s

