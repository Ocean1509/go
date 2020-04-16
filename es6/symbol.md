### 基础理解
1.  symbol 是es6提出的一种新的原始数据类型，它代表一个独一无二的值。但是它不能使用new命令去创建。
2. symbol类型的值无法在请求中携带，传输过程会忽略symbol类型的值。
3. Symbol()创建symbol，可以携带参数，参数的意义仅在于对这个实例的描述。Symbol(foo).toString() === 'Symbol(foo)' 
4. Symbol不能与其他类型进行运算，也就是不会进行隐式转换。但是可以显示的转换，例如：toString()，Number()

### symbol作为对象属性时，不能使用.修饰符
```
const s = Symbol();

const a = {}
a.s = 'hello world'
a[mySymbol] = undefined
a['mySymbol'] = 'hello world'
```
原因： 点修饰符导致a的属性名实际上是一个字符串，而不是一个Symbol值。同理，对象内部定义Symbol属性时，Symbol也必须在方括号中。



### 遍历对象的Symbol类型的属性
for in , for of 无法遍历对象Symbol类型，同时也不会被Object.keys(), Object.getOwnPropertyNames(), JSON.stringify()返回。

要想得到Symbol类型的属性，可以使用Object.getOwnPropertySymbols()

```
var obj = {
    [Symbol('foo')]: 1,
    a: 2
}

for(let i in ojb) {
    console.log(i)
}
// a

Object.getOwnPropertySymbols(obj)
[Symbol('foo')]
```

要想获取所有的属性可以使用Reflect.ownKeys()来获取

```
var obj = {
    [Symbol('foo')]: 1,
    a: 2
}

Reflect.ownKeys(obj)
// ["a", Symbol(foo)]
```
### Symbol.for
```
Symbol.for("bar") === Symbol.for("bar")
// true

Symbol("bar") === Symbol("bar")
// false
```

Symbol.for()与Symbol()这两种写法，都会生成新的 Symbol。它们的区别是，前者会被登记在全局环境中供搜索，后者不会。Symbol.for()不会每次调用就返回一个新的 Symbol 类型的值，而是会先检查给定的key是否已经存在，如果不存在才会新建一个值。

### 不能通过instanceof找到原型(基础类型都不能用instanceof找到原型)
```
var a = Symbol('a')
console.log(a instanceOf Symbol) //  false
```
```
Symbol.__proto === Function.prototype // true
```

### Symbol参数为对象时，会调用对象的toString方法，再产生symbol值
```
var obj = {
    a: 12
}
var b = Symbol(obj)
// Symbol([object Object])

var obj = {
    a: 12,
    toString() {
        return 23
    }
}
var b = Symbol(obj)
// Symbol('23')
```

### Symbol的应用 - 单例模式


### 三个重要内置的方法
#### Symbol.toPrimite
对象的Symbol.toPrimitive属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值
例子：
实现以下操作:
```
if(a == 1 && a == 2 && a == 3) {
    console.log(true) // true
}
```
解析：
```
var a = {
    [Symbol.toPrimitive]:((i) => () => ++i)(0)
}
if (a == 1 && a == 2 && a == 3) {
    console.log(true) // true
}
```

#### Symbol.hasInstance 

对象的Symbol.hasInstance属性，指向一个内部方法。当其他对象使用instanceof运算符，判断是否为该对象的实例时，会调用这个方法。比如，foo instanceof Foo在语言内部，实际调用的是Foo[Symbol.hasInstance](foo)。

```
class MyClass {
  [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }
}

[1, 2, 3] instanceof new MyClass() // true
```
注意，instanceof右边表达式原来只能是构造函数，由于[Symbol.hasInstance]的存在右边表达式可以为对象。只要对象部署了这个属性。



#### Symbol.iterator   

指向对象的遍历器方法

**什么是迭代器/遍历器/Iterator** 对象具有next()方法，每次调用next()都会返回一个结果对象，该对象有两个属性， value为当前值，done表示是否遍历结束。

而任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）即 使用for-of进行数据结构遍历

拥有该数据结构的数据类型分别为：
- 数组
- Set 
- Map
- 类数组，arguments对象， DOM NodeList对象
- Generator 对象
- 字符串

```
var a = [1, 2, 3]
console.log(Object.getOwnPropertySymbols(a.__proto__)) // 获取部署在Array原型上的Symbol属性
// [Symbol(Symbol.iterator), Symbol(Symbol.unscopables)] // 拥有两个Symbol类型的属性
console.log(a[Object.getOwnPropertySymbols(a.__proto__)[0]]) // 拿到iterator
// ƒ values() { [native code] }


var iterator = a[Object.getOwnPropertySymbols(a.__proto__)[0]]();  // 执行iterator接口，返回一个遍历器，该遍历器具有next方法
console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next()) // { value: 2, done: false }
console.log(iterator.next()) // { value: 3, done: false }
console.log(iterator.next()) // { value: undefined, done: true }

```
执行iterator定义的values方法会返回一个遍历器，而遍历器就是上面说的概念，具有next方法。

首先模拟返回一个遍历器

```
var obj = {
      a: 1,
      b: 2
    }

var aIterator = makeIterator(obj)
function makeIterator(o) {
  var obj = Object.keys(o);
  var i = 0;
  return {
    next: function() {
      return {
        value: obj[i++],
        done: i - 1 >= obj.length ? true : false
      }
    }
  }
}
console.log(aIterator.next()) // { value: a, done: false }
console.log(aIterator.next()) // { value: b, done: false }
console.log(aIterator.next()) // { value: undefined, done: true }
```

为了让数据结构部署迭代器，需要部署数据结构的Symbol.iterator属性，也就是说如果想用for-of去遍历数据结构，需要有Symbol.iterator，他在执行for-of时会自动去执行Symbol.iterator返回一个遍历器。

```
var obj = {
  a: 1,
  b: 2
}

for(let i of obj) {
  console.log(i)  // Uncaught TypeError: aIterator is not iterable
}


obj[Symbol.iterator] = function() {
  return makeIterator(obj) // 部署Symbol.iterator属性，使得在用for-of遍历过程中，执行makeIterator方法返回遍历器
}

for(let i of obj) {
  console.log(i)  // a, b
}
```

如何模拟for-of方法

```
function forOf(obj, cb) {
  let iterable, result;

  if (typeof obj[Symbol.iterator] !== "function")
    throw new TypeError(result + " is not iterable");
  if (typeof cb !== "function") throw new TypeError("cb must be callable");

  iterable = obj[Symbol.iterator]();

  result = iterable.next();
  while (!result.done) {
    cb(result.value);
    result = iterable.next();
  }
}
```



```
var a = {
  d: 1,
  b: 2,
}

for(let i of a) {
  console.log(i)  // Uncaught TypeError: a is not iterable
}


var a = {
  d: 1,
  b: 2,
  [Symbol.iterator]: function*() {
    yield 1
    yield 2
  }
}

for(let i of a) {
  console.log(i) // 1, 2
}
```