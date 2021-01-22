1. 变量声明时，函数优先级大于变量，如果函数出现重名，则会以最新的覆盖旧的，如果声明变量时发现重名，则会忽略，不再声明。

2. V8不推荐声明的函数或者变量直接换类型
```
function a() {}
a = 3
// 不推荐
```

3. 代码执行时会创建执行上下文，执行上下文由四部分组成： 变量对象，词法对象，outter，this
this 是函数执行时确定，他是一个动态的概念，而其他都是静态的，所以js也被称为词法作用域(静态作用域)
如何证明js时静态作用域呢？
```
var value = 1;
function foo() {
  console.log(value);
}

function bar() {
  var value = 2;
  foo();
}

bar();

```
•假设JavaScript采用静态作用域，让我们分析下执行过程：

￮执行 foo 函数，先从 foo 函数内部查找是否有局部变量 value，如果没有，就根据书写的位置，查找上面一层的代码，也就是 value 等于 1，所以结果会打印 1。

•假设JavaScript采用动态作用域，让我们分析下执行过程：

￮执行 foo 函数，依然是从 foo 函数内部查找是否有局部变量 value。如果没有，就从调用函数的作用域，也就是 bar 函数内部查找 value 变量，所以结果会打印 2。

而执行结果是1，所以js是词法作用域，也就是静态作用域

4. 字符串转数组
尽可能不要使用split来处理，因为split不支持处理特殊的一些编码， 例如：var a = 'a🍎b'
```
var a = 'a🍎b'
a.split('') // ["a", "�", "�", "b"]
```
正确的做法，可以使用 Array.from，扩展运算符，for of

```
var a = 'a🍎b'
Array.from(a) // ["a", "🍎", "b"]
[...a] // ["a", "🍎", "b"]
for(let i of a) {
  console.log(i) // "a", "🍎", "b"
}

```

5. 函数的length属性会返回函数的参数个数，如果参数有默认值，length会受到影响
```
function test(a, b) {}
console.log(test.length) // 2
function test1(a, b, c = 1) {}
console.log(test.length) // 2
function test2(a = 1, b, c) {}
console.log(test.length) // 0
```

6. 关于正则test的坑，如果正则表达式设置了全局标志，test() 的执行会改变正则表达式lastIndex属性。连续的执行test()方法，后续的执行将会从 lastIndex 处开始匹配字符串，(exec() 同样改变正则本身的 lastIndex属性值)
```
var regex = /foo/g;

// regex.lastIndex is at 0
regex.test('foo'); // true

// regex.lastIndex is now at 3
regex.test('foo'); // false

// regex.lastIndex is now at 0
regex.test('foo'); // true
```

```
var arr = ['foo', 'food', 'foods'] 
var narr = []
var reg = /foo/g;
arr.forEach(v => {
    var flag = reg.test(v)
    console.log(reg.lastIndex) // 3, 0, 3
    if(flag) {
        narr.push(v)
    }
})   
console.log(narr) // ['foo','foods']
```

7. es6的继承会把父类的静态属性也继承
```
class Car {
    constructor(color, price) {
      this.color = color
      this.price = price
    }
    static age = 10
    say() {
      console.log(`${this.color}and${this.price}`)
    }
  }

  class Cruze extends Car {
    constructor(color, price) {
      super(color, price)
    }
  }

  let cruze = new Cruze('红色', 140000)
  console.log(cruze)
```
es5实现时，除了标准的寄生组合继承外，还需要遍历类的静态属性，拷贝一份到子类中。
```
function Car(color) {
  this.color = color
}
Car.prototype.say = function() {}

function Cruze(color) {
  Car.call(this, color)
}

Cruze.prototype = Object.create(Car.prototype, {
  constructor: {
    value: Cruze
  }
})
// 或者
Cruze.prototype = Object.create(Car.prototype)
Cruze.prototype.construtor = Cruze


for (let [key, value] of Object.entries(Car)) {
  Cruze[key] = value
}
```
8. 块级作用域的提升
题型1:
```
function test(){
    test = 2
    console.log(typeof test) // number
}
test()
console.log(test) // 2
```
全局作用域声明了test，在test的函数作用域内，由于函数作用域没有test, 所以test=2会作用到全局的test中。

提型2：
```
{
  function test(){
    test = 2
    console.log(typeof test) // number
  }
}
test()
console.log(test) // function test() {}

```
和上面的区别在于function test在一个块级作用域里面。块级作用域的函数声明会先把test的声明提升到块级作用域外，但是是变量声明。
```
var test = undefined
{
  function test() {

  }
}
```
test()执行期间,test = 2是在块级作用域中赋值，所以不会影响到最外层test的值。

题型3：
```
{
    function test() {
        test = 2
        console.log(typeof test) // number
    }
    test() // 
    console.log(test) // 2
}

console.log(test) // function test
```
解析过程和题型2相同，核心在于块级作用域的函数变量另赋值，并不会影响到外部的值。


题型4：
```
var b
{
    
    function test() {
        b = 3
    }
    test()
}
console.log(b) // 3
```
var的变量声明和函数声明不同，块级作用域变量的赋值会影响到外部。

题型5：
```
var test = function test1() {
  test1 = 2
  console.log(test1) // test function
}
```

函数表达式中可以指定另外的函数名，且这个函数名称受保护，不能被修改。如果在函数内部去修改函数名时，修改不会生效


9. with的弊端
- 容易导致数据的泄露，如果with作用域下赋值不存在的属性，会在全局创建该属性。
- 性能下降：
原因是 JavaScript 引擎会在编译阶段进行数项的性能优化。其中有些优化依赖于能够根据代码的词法进行静态分析(词法作用域)，并预先确定所有变量和函数的定义位置，才能在执行过程中快速找到标识符。

但如果引擎在代码中发现了 with，它只能简单地假设关于标识符位置的判断都是无效的，因为无法知道传递给 with 用来创建新词法作用域的对象的内容到底是什么。

最悲观的情况是如果出现了 with ，所有的优化都可能是无意义的。因此引擎会采取最简单的做法就是完全不做任何优化。如果代码大量使用 with 或者 eval()，那么运行起来一定会变得非常慢。无论引擎多聪明，试图将这些悲观情况的副作用限制在最小范围内，也无法避免如果没有这些优化，代码会运行得更慢的事实。


10. window.length

window.length 返回 iframe 数量


11. eval会产生闭包
题目：判断变量a是否被gc回收？
```
function test() {
  var a = 'test'
  return function() {
    eval("")
  }
}
test()()
```
不会，eval执行的时候，由于无法判断变量a是否会被引用，所有会以闭包的形式保留a的值，所以a不会被gc回收。同样的trycatch  with 也不会

tip: 1. 闭包是保留在堆中，所以会一直存在,直到外部空间销毁
     2. 如何在chrome操作gc： chrome -> memory
     3. 为什么webpack里是eval封装，因为eval快，调试快
      
      带eval的模式能把每个模块的生成代码单独打在一行里，并且都以DataUrl的形式添加sourcemap，这样它在rebuild时会对每一个模块进行检查，如果没有发生改动，他就直接使用之前的SourceMap，所以它只需要为改动的模块重新生成SourceMap；而非eval的构建模式下生成代码是“原生”排列下来的，不管有任何模块作出修改，都会影响到最后bundle文件整体的行列格式，所以它每次都要重新生成整体的SourceMap，rebuild的速度会很慢。并且eval对代码转换较少。




```
function test() {
  var a = 'test'
  return function() {
    window.eval("")
  }
}
test()()
```
此时gc会被回收，因为此时eval的作用域在window

12. 元编程
简单理解： 改变或者扩充js原始的能力
Symbol,Reflect,Proxy,reflect-metadata
具体看es相关笔记

13. regenerator-runtime


14. es5中怎么模拟块级作用域

trycatch,with,eval都可以模拟，但是with会延长作用域链

```
try {
  throw 1
} catch(a) {
  a = 1
}

/// 类似于
{
  let a = 1
}
```

15. eval 和 new Function的区别

两个场景：
  vue2中用到了new Function 和 with，with用来绑定this作用域，new Function用来生成渲染函数
  webpack中用到eval，devtool有eval模式，少了将原生代码的转换，模块字符串用eval包裹，如果模块没有发生改变，不需要重新生成，加快编译

```
// template模板
<div id="app" style="color: red;background: blue;"><p>hello {{name}}</p>{{msg}}</div>

// 解析模板生成一段字符串,即渲染函数要执行的字符串
let code = _c("div", {id: "app",style: {"color":" red","background":" blue"}},_c("p", undefined,_v("hello"+_s(name))),_v(_s(msg)))

// 将渲染函数要执行的字符串传入new Function()生成渲染函数
let renderFn = new Function(`with(this) {return ${code}}`);

```

区别：

**eval中的代码执行时的作用域为当前作用域。它可以访问到函数中的局部变量。
new Function中的代码执行时的作用域为全局作用域，不论它的在哪个地方调用的，它访问的都是全局变量。**

```
let foo = "foo";
function bar() {
    let foo = "bar";
    eval("console.log(foo)"); // 输出bar
    new Function("console.log(foo)")(); // 输出foo
}
bar();
```