### 理解
serverless其实是一个产品，server + less 首先有server服务,然后把服务搬到云上(阿里云)，不需要自己自己买服务器维护，比如阿里云会提供api，只要照着api写，最后把程序放到云上就可以运行。


### 云计算的发展

物理机托管(Bare Metal) -> 云主机(Laas) -> 容器平台(Paas) -> 云函数(Faas)

Faas Function as a service
函数即服务，每一个函数都是一个服务，函数可以由任何语言编写，除此之外不需要关心任何运维细节，比如：计算资源，弹性扩容而且可以按量计费，且支持事件驱动
Bass Backtend as a service
后端即服务，集成了很多中间件技术，可以无视环境调用服务，比如数据即服务（数据库服务），缓存服务等，组成Serverless概念的只有FASS + BASS
Pass Platform as a service 
平台即服务，用户只要上传源代码就可以自动持续集成并享受高可用服务，如果速度足够快，可以认为类似ServerLess，但是随着Docker为代表的容器技术兴起，以容器为粒度的PASS部分逐渐成为主流，是最常用的部署应用方式，比如中间件，数据库，操作系统等
Data as a service
数据即服务，将数据采集，治理，聚合，服务打包起来提供出去

BFF -> SFF(serviceless for frontend)


### serverless优缺点
优点：无需管理，自动负载，监控，快速上线，快速开发，无语言障碍
缺点：学习成本，迁移成本，冷启动的把控，紧紧的拥抱了某个云

serverless 需要解决node_modules的问题
node_modules有最高执行权限，安装node_modules相当于在系统安装了exe,如果node_modules出现脏包，会出现严重的安全性问题 

一般云厂商会给node_modules做多一层类似沙箱的东西。node_modules执行空间只能在封装层内部


### cloudFlare
不是纯粹的云厂商

AWS serverLess？

### IPFS
什么是IPFS，可以理解为一个百度网盘，连接了中心化和去中心化

### workbox

pwa 
serviceWorker(数据缓存)