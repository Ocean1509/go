### 作用

#### 1. 测试网速

一般用1*1像素的图片，大约为3kb

```
    var s = Date.now();
    var image = new Image();
    image.crossOrigin = 'anonymous'
    image.src = '.....png' //4kb
    image.onload = function() {
        var end = Date.now();
        var w = 4 / (end-s) // 详细需要用开普勒测试
    }
```

#### 2. 数据上报

将数据通过get请求用图片的形式请求到后台。

`http://xxx.gif?a=1&b2`
后台定时将xxx.gif的请求过滤出来，拿到所有的信息

**统计不能用ajax，ajax有实时性，需要返回值，img不需要处理返回，等待定时拿请求信息就可以了**