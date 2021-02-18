npx 想要解决的主要问题，就是调用项目内部安装的模块,例如webpack，如果需要在项目脚本中调用webpack命令，需要将webapck安装在全局，或者在package.json中的script中指定。现在npm并不建议安装全局模块，所以npx的出现，很好的解决了这个问题。npx 的原理很简单，就是运行的时候，会到node_modules/.bin路径和环境变量$PATH里面，检查命令是否存在。

而由于 npx 会检查环境变量$PATH，所以系统命令也可以调用。


例如： 
```
npx create-react-app my-react-app
```
上面代码运行时，npx 将create-react-app下载到一个临时目录，使用以后再删除。所以，以后再次执行上面的命令，会重新下载create-react-app。