1. 变量声明时，函数优先级大于变量，如果函数出现重名，则会以最新的覆盖旧的，如果声明变量时发现重名，则会忽略，不再声明。

2. V8不推荐声明的函数或者变量直接换类型
```
function a() {}
a = 3
// 不推荐
```

3. 代码执行时会创建执行上下文，执行上下文由四部分组成： 变量对象，词法对象，outter，this
this 是函数执行时确定，他是一个动态的概念，而其他都是静态的，所以js也被称为词法作用域(静态作用域) - 后续完善体系

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