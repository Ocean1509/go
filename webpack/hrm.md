### HMR hot module replacement
模块热更新，更改某个模块时，不需要全部刷新页面，只修改指定模块。

### 开启热更新步骤
- 使用webpack-dev-server作为服务器启动
- devServer配置中 hot：true
- plugins hotModuleReplacementPlugin
- js代码中添加module.hot.accept 增加hmr代码

