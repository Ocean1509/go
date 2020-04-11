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
for (let [key, value] of Object.entries(Car)) {
  Cruze[key] = value
}
```

8. 使用函数表达式去声明函数时，可以指定另外的函数名，例如
```
var test = function test1() {}

```
但如果在函数内部去修改函数名时，修改不会生效
```
var test = function test1() {
  test1 = 2
  console.log(test1) // test function
}
```


9. with的弊端
- 容易导致数据的泄露，如果with作用域下赋值不存在的属性，会在全局创建该属性。
- 性能下降：
原因是 JavaScript 引擎会在编译阶段进行数项的性能优化。其中有些优化依赖于能够根据代码的词法进行静态分析(词法作用域)，并预先确定所有变量和函数的定义位置，才能在执行过程中快速找到标识符。

但如果引擎在代码中发现了 with，它只能简单地假设关于标识符位置的判断都是无效的，因为无法知道传递给 with 用来创建新词法作用域的对象的内容到底是什么。

最悲观的情况是如果出现了 with ，所有的优化都可能是无意义的。因此引擎会采取最简单的做法就是完全不做任何优化。如果代码大量使用 with 或者 eval()，那么运行起来一定会变得非常慢。无论引擎多聪明，试图将这些悲观情况的副作用限制在最小范围内，也无法避免如果没有这些优化，代码会运行得更慢的事实。


10. window.length
window.length 返回 iframe 数量