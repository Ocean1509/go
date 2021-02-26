### forEach中使用async,await

```js
var getData = function (count) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(count)
            resolve(count)
        }, 1000)
    })
}

var lists = [1, 2, 3, 4];

lists.forEach(async e => {
    let data = await getData(e);
    console.log(e + ' end')
});
```
这时候的结果会同时打出来，达不到按顺序执行的目的。原因在于forEach的底层是通过while做封装，大致如下所示：

```js
Array.prototype.customerArray = function (callback) {
    let arr = this;
    let len = arr.length;
    let i = 0;
    while(i < len - 1) {
        callback(arr[i++])
    }
}

```
while循环会直接执行完所有的callback,此时达不到异步等待一个个顺序执行的目的。所以一般情况下，为了达到顺序执行的目的，使用的是原生的for循环

```js
(async () => {
    for (let i = 0; i < lists.length; i++) {
        let data = await getData(lists[i]);
        console.log(data + 'end')
    }
})()
```


while循环同样可以达到目的：
```js
Array.prototype.customerArray = async function (callback) {
    let arr = this;
    let len = arr.length;
    let i = 0;
    while(i < len - 1) {
        await callback(arr[i++])
    }
}
```