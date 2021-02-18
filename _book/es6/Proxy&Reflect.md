### Proxy
#### 概念理解
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
**receiver是代理的对象本身，即proxy实例**

#### Proxy支持拦截的操作有13种之多
[es6-proxy](https://es6.ruanyifeng.com/#docs/proxy)

#### 深层递归为每个属性做代理
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


#### Reflect
Reflect简单的理解是，将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上。

特点：Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。

当我们用proxy做代理，定义get方法时，如果返回原对象的属性值，会不断的触发get方法，导致死循环。所以可以借助Relect对象的方法去获取默认的行为，而不经过定义的get方法。

```
// 陷入死循环
var handler = {
  get(target, value, receiver) {
    return target.value
  }
}
var obj = {
  a: 1
}
var proxyObj = new Proxy(obj, handler)

// 利用reflect
var handler = {
  get(target, value, receiver) {
    return Reflect.get(target, value)
  }
}
```