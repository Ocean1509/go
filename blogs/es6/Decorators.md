# Decorators
### 类的修饰
类修饰器一般用来修改、增加类的静态属性，方法,或者添加实例方法,装饰器的参数是这个类构造器
```js
@sex
@getname
class Student {
  constructor() {
    this.name = "test"
  }
}
function sex(target) {
  target.sex = "man"
}

function getname(target) {
  target.prototype.hasName = true
}

const s = new Student()
s.getname() // true
Student.sex; // man
```

支持参数
```js
@glasses(true)
class Student{
  constructor() {
    this.name = "test"
  }
}

function glasses(bool) {
  return function(target) {
    target.glasses = bool
  }
}

Student.glasses // true
```

类修饰器的原理很简单，相当于将类传递给一个函数作为参数，在函数内部修改类的属性方法。

```js
sex(Student)
```


### 方法的修饰
装饰器不仅可以装饰类，还可以改变实例执行的方法
```js
class Student {
  constructor() {
    this.name = "test"
  }
  @logs
  @readonly
  getName() {
    return this.name
  }
}


function readonly(target, value, descriptor) {
  descriptor.writable = false
  return descriptor
}


function logs(target, value, descriptor){
  // 保存旧方法
  let oldValue = descriptor.value;
  // 重写新方法(加入日志，保留旧方法执行)
  descriptor.value = function(...args) {
    console.log('输出日志')
    oldValue.apply(this, args)
  }
  return descriptor
}


const s = new Student()
console.log(s.getName = 123) // 方法无法被重写
console.log(s.getName()) // 输出日志
```

方法修饰器的原理：利用了Object.defineProperty()

```js
class Student {
  constructor() {
    this.name = "test"
  }
  getName() {
    return this.name
  }
}

// 原始的descriptor
var handler = {
  value: function() {
    return this.name
  },
  enumerable: true,
  configurable: true,
  writable: true 
}

descriptor = log(Student.prototype, 'getName', descriptor)
Object.defineProperty(Student.prototype, 'getName', descriptor)

```


#### Reflect.metadata


初步理解概念，后续需要更加深入

reflect.metadata 的经典例子 ioc(控制反转) DI(依赖注入)

https://juejin.im/post/5bd07377e51d457a58075974