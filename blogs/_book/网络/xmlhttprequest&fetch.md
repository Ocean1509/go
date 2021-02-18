## xmlhttprequest
#### xmlhttprequest使用
xmlhttprequest对象是基础ajax的实现，所有浏览器都有这个构造函数，基础的用法如下：
```
var xml = new XMLHttpRequest()
xml.open("get", "http://examle.com/api")
xml.send()
xml.onreadystatechange = function() {
    if(xml.readyState === 4 && xml.status === 200) {
        console.log('request success')
    } else {
        console.log('request error')
    }
}
```
xml的readyState有五种状态
0: 未初始化，xmlhttprequest对象创建，但是还没有调用open方法
1：已经调用open方法
2：已经调用send方法，请求已经发送
3: 收到部分相应数据
4: 接收到全部数据，连接已经关闭。

这是xmlhttprequest level1的版本，老版本存在几点不足：
1. 只支持文本数据的传送，无法用来读取和上传二进制文件。
2. 传送和接收数据时，没有进度信息，只能提示有没有完成。
3. 受到"同域限制"（Same Origin Policy），只能向同一域名的服务器请求数据。


#### xmlhttprequest level2
支持的功能
1. 可以设置HTTP请求的时限。
2. 可以使用FormData对象管理表单数据。
3. 可以上传文件。
4. 可以请求不同域名下的数据（跨域请求）。
5. 可以获取服务器端的二进制数据。
6. 可以获得数据传输的进度信息。

常用的功能实现

xml.timeout = 1000 // 设置超时时间
xml.abort() // 取消请求
xml.ontimeout = function() {} // 超时回调
xml.onload = function() {} // 传输成功回调
xml.onerror = function() {} // 失败回调
xml.onprogress = function() {}; // 下载进度
xml.onload.onprogress = function() {} // 上传进度
xml.onabort = function() {} // 请求取消回调


#### level 2 兼容性问题
[xmlhttprequest兼容性问题](https://caniuse.com/#search=xmlhttprequest)

onreadystatechange兼容市面上所有的浏览器。

onload, onabort, onerror, onprogress 在IE6-9都不支持

ontimeout, timeout 在IE6-7不兼容

在能兼容的浏览器上，尽量使用level2的标准，支持的功能会更加丰富。


## fetch
#### fetch的特点
1. 400，500错误fetch()返回的promise不会被标记为reject。只会标记为resolve，但是resolve的返回值的ok属性设置为false，只有当网络故障时或者请求被阻止时，才会标记为reject
2. fetch不会接受跨域cookie，无法建立跨域会话
3. fetch默认不会发送cookies，除非使用credentials选项。

#### fetch兼容性
ie11都不支持，且部分低版本浏览器不支持。

#### 使用
```
fetch(url, {
  method: 'POST', // or 'PUT'
  body: JSON.stringify(data), // data can be `string` or {object}!
  headers: new Headers({
    'Content-Type': 'application/json'
  })
}).then(res => res.json())
.catch(error => console.error('Error:', error))
.then(response => console.log('Success:', response));
```

#### 其他
fetch不支持timeout

可以用Promise.race来实现 比较超时函数和请求都promise谁先

type字段的含义

basic： 正常同域的请求，包含所有的header
cors： 合法跨域请求
error： 网络错误，response的status是0
opaque： response从no-cors请求了跨域资源。

