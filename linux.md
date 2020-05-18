linux 基础指令

查看yum安装过包
```rpm -qa```
```rpm -qa | grep java```
删除安装过的包
```rpm -e --nodeps XXXXX```
nodeps表示不检查依赖，直接删除


复制本地文件到远程服务器
```scp 文件 服务器:/路径```

