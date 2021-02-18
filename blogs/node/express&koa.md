koa  express 对比

express connect中间件  封装了路由，视图
koa     co中间件   不包含任何中间件 


异步流程
express   callback
koa1      generator
koa2      async


异常捕获
express   callback捕获异常，深层次的异常捕获不了
koa       try catch 更好的解决异常捕获


