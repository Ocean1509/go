
### cookie
cookie有哪些属性

name

value

domain: 域名

path: 路径

expires: 过期时间

max-age: 过期时间

httponly: 不允许通过document.cookie获取

secure： 只允许在https中传输

sameSite:是否为同站cookie（strict, lax）


浏览器每个域名下面最多有50个cookie，如果超过浏览器会自动删除



服务器cookie的下发是逐条下发的
![](../imgs/cookie.png)


## token

#### jwt： 
##### 原理
服务端验证完身份后，会利用用户的json对象里的信息，通过签名的算法（algorithm），默认是 HMAC SHA256（写成 HS256），利用自己密钥返回一个签名后的字符串给用户。客户端在收到jwt后，会将他保存在localstorage或者cookie，在下次请求时在authorization字段加上token。后台收到请求后，拿到token会利用同样的算法和密钥将token解析出来，如果是同一个用户则认证成功。
##### 缺点
由于服务器不保留session信息，因此使用过程中无法废止某个token，或者更改token的权限

### 另外一种方式
##### 原理
验证完身份后，后台随机生成一个uuid，之后用md5进行加密，服务器将这个加密后的token和用户关联存储在数据库中，token返回给客户端后，每次请求也同样会在authorization上携带token，后台只要验证token是否为对应用户即可。

##### 缺点
典型的用空间换时间的概念。服务端需要定时更新token。但是相比前者而言，可以废止某个token


    