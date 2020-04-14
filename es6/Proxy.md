### 概念理解
Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。可以理解为代理

```
var obj = {
  a: 12
}

var proxyObj = new Proxy(obj, {
  get(target, key, receiver) {
    return 12
  }
  set(target, key, value, receiver) {
    console.log('set: ', value)
    return Reflect.set(target, key, 'test', receiver)
  }
})

console.log(proxyObj);
//Proxy{
//  [[Handler]]: { // 代理拦截的方法
//    get(){},
//    set(){}
//  },
//  [[Target]]: { // 目标对象
//    a: obj
//  },
//  [[IsRevoked]]: false
//}
console.log(obj)
// { a: 12 }
```
proxyobj是我们操作的proxy代理对象，对代理对象的操作会反应到真实的obj上。这是和Object.defineProperty本质上的区别。后者是直接操作目标对象。

```
Object.defineProperty(obj, {
  get() {},
  set() {}
})
```


### Proxy支持拦截的操作有13种之多
[es6-proxy](https://es6.ruanyifeng.com/#docs/proxy)

### 深层递归为每个属性做代理
```
var handler = {
  get(target, key, receiver) {
    console.log("get")
    return Reflect.get(target, key)
  },
  set(target, key, value, receiver) {
    console.log('set: ', value)
    return Reflect.set(target, key, value, receiver)
  }
}
var proxyObj = new Proxy(obj, handler)

var obj = {
  a: 12,
  b: {
    c: 121,
    d: 1234
  }
}
console.log(proxyObj.b.c)
```
此时无法为深层对象设置代理，这时候可以可以使用递归代理

```
var handler = {
  get(target, key, receiver) {
    console.log("get")
    if(typeof target[key] === 'object') {
      return new Proxy(target[key], handler) // 如果属性值为对象，则进行递归代理
    }
    return Reflect.get(target, key)
  },
  set(target, key, value, receiver) {
    console.log('set: ', value)
    return Reflect.set(target, key, value, receiver)
  }
}
```

