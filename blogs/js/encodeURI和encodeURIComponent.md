### encodeURI和encodeURIComponent的区别
encodeURI()和encodeURIComponent()方法可以对URI进行编码，以便发送给浏览器。有效的URI中不能包含某些字符，例如空格。而这URI编码方法就可以对URI进行编码，它们用特殊的UTF-8编码替换所有无效的字 符，从而让浏览器能够接受和理解。

encodeURI()不会对本身属于URI的特殊字符进行编码，例如冒号、正斜杠、问号和井字号；而encodeURIComponent()则会对它发现的任何非标准字符进行编码

```js
var url = 'http://www.baidu.com?d=ab c'

encodeURI(url) // "http://www.baidu.com?d=ab%20c"
encodeURIComponent(url) // http%3A%2F%2Fwww.baidu.com%3Fd%3Dab%20c"
```