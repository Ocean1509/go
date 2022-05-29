css next

graphQL



vue技术方案
1. vue2 + ts
vue-class-component
2. vue2-vue3时代(vue3不稳定)
   vue3 beta / vuex beta + ts
   @vue/composition-api + vuex-composition-helper

3. vue3 + vite + 使用typescript增强vuex(不会遇到特别复杂的ts代码)

另外学习 vue-rx  frp(响应式编程)




github 仓库搜索技巧
awesome 语言 github
例如： awesome js github


协议：
MIT ISC BSD


同学分享的经验
https://duanxl.com


脚手架分包策略
command
   - clear
   - init
core
   - cli
   - exec
models
   command
   package
utils
   log
   utils
   format-path
   fx


准备执行阶段
   检查版本号 - 检查node版本 - 检查root启动 - 检查用户目录 - 检查入参 - 检查环境变量 - 检查是否最新版本 - 提示升级脚手架


可参考： 动态加载命令功能
缓存功能
是否执行本地代码，获取缓存目录

yarn npm 都是利用npminstall这个包，所以可以利用这个包单独安装

学习node动态指令

兜底方案，不能随便输入命令，错误终止


集成更多的工具
 mock cli
 upload cli

 思考哪些流程可以优化
 lerna的优缺点