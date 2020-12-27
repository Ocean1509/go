### css安全

css也有xss攻击风险,典型的`backaground：url`, url如果请求的跨域地址有执行脚本，也会注入执行。

```
    .test {
        background: url('javascript:alert(111)') // 攻击脚本
    }
```


```
.test::after {
    content: url() //脚本
}
```