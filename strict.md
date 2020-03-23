关于严格模式下this的指向汇总
1.
```
'use strict'
console.log(this) // window
```
全局环境下，严格模式的this依旧为window

2.
```
function test() {
  'use strict'
  console.log(this) // undefined
}
test()
```
函数作用域下定义严格模式，内部ths指向是undefined

3.
```
'use strict'
function test() {
  console.log(this)
}
test() // undefined
window.test() // window
```
全局环境下的严格模式，如果没有指定window下调用函数，函数内部的this指向为undefined，非严格模式下会自动指向window

4.
```
function test() {
  console.log(this) // window
}

(function() {
  'use strict'
  test()
}())
```

```

(function() {
  'use strict'
  function test() {
    console.log(this) // undefined
  }
  test()
}())
```

函数定义在非严格模式下，但是在严格模式的环境下调用，此时函数内部this指向为window，原因是**在严格模式下，this会保持他进入执行上下文时的值**。

5.
严格模式下如果使用call，bind，apply去绑定this，如果绑定的值不存在，此时不会默认指向window，如果不是引用类型，也不会自动转成引用类型
```
"use strict";
function fun() { return this; }
console.log(fun());
console.log(fun.call(2)); // 2  typeof number
console.log(fun.apply(null)); // null
console.log(fun.call(undefined)); // undefined typeof undefined
console.log(fun.bind(true)()); // true typeof boolean
```