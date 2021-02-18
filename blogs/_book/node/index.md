应用开发形态
    1. spa模式
    2. mpa模式 (node + swig)直出
    3. map + spa  (vue + vue-router + node + java)
    4. mpa 和 spa互转   刷新页面用map，页面内部路由跳转用spa
    5. 同构
    

BFF架构

    页面 - 中间层node - 后端

    好处：node更好控制前端路由，且可以过滤数据，node和java之前走ipc通信


相关包：
    scripty：将执行脚本放到script目录，不需要在package.json中写shell脚本
        // package.json 
        {
            scripts: {
                client:dev: scripty,
                client:prod: scripty
            }
        } 
    yargs-parser: 获取命令行参数和环境参数
