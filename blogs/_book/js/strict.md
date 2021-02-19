### 严格模式
#### 为什么会有严格模式
严格模式消除了javascript语法的一些不合理，不严谨的行为，减少怪异行为，并且提高了编译的效率
#### 严格模式下的限制
##### 1.无法使用未声明的变量
```js
<script>
"use strict"
a = 1 // Reference error: a is not defined 
</script>
```

##### 2.不能使用eval，with语句
```html
<script>
    "use strict";
    eval('var a =223')
    console.log(a) // Reference error: a is not defined 
    with(o) {
        console.log(p)
    } // SyntaxError: Strict mode code may not include a with statement
    
</script>
```

##### 3.对象属性在对象内部不能重复声明，es6环境下已经修复
```html
<script>
"use strict"
var o = {
    a: 1,
    a: 2 // error
}
</script>
```

##### 4.不支持八进制
```html
<script>
"use strict"
var a = 010; // Uncaught SyntaxError: Octal literals are not allowed in strict mode.
</script>
```
补充八进制和十六进制，八进制是以0为开头的数字，而十六进制为0X开头的数组

##### 5.删除变量或者函数会报错
js本身无法删除变量和函数，在严格模式下会报错
```html
<script>
"use strict"
var x = 2
delete x // Uncaught SyntaxError: Delete of an unqualified identifier in strict mode.
</script>
```

##### 6.无法使用arguments作为变量
```html
<script>
"use strict"
var arguments = 2 //Syntax error
</script>
```

###### 7.禁止this指向全局对象

关于严格模式下this的指向汇总
- 1.
```js
'use strict'
console.log(this) // window
```
全局环境下，严格模式的this依旧为window

- 2.
```js
function test() {
  'use strict'
  console.log(this) // undefined
}
test()
```
函数作用域下定义严格模式，内部ths指向是undefined

- 3.
```js
'use strict'
function test() {
  console.log(this)
}
test() // undefined
window.test() // window
```
全局环境下的严格模式，如果没有指定window下调用函数，函数内部的this指向为undefined，非严格模式下会自动指向window

- 4.
```js
function test() {
  console.log(this) // window
}

(function() {
  'use strict'
  test()
}())
```

```js

(function() {
  'use strict'
  function test() {
    console.log(this) // undefined
  }
  test()
}())
```

函数定义在非严格模式下，但是在严格模式的环境下调用，此时函数内部this指向为window，原因是**在严格模式下，this会保持他进入执行上下文时的值**。

- 5.
严格模式下如果使用call，bind，apply去绑定this，如果绑定的值不存在，此时不会默认指向window，如果不是引用类型，也不会自动转成引用类型
```js
"use strict";
function fun() { return this; }
console.log(fun());
console.log(fun.call(2)); // 2  typeof number
console.log(fun.apply(null)); // null
console.log(fun.call(undefined)); // undefined typeof undefined
console.log(fun.bind(true)()); // true typeof boolean
```