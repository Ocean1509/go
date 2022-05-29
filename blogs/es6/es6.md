### 1. for-of 无法遍历weakSet, weakMap(弱引用)
```js
var a = new WeakSet([[1,2], [3,4]])
for(let i of a) {
  console.log(i) // a is not a iterable
}
```


### 2. es6存在块级作用域，如果在块级作用域内声明函数，函数声明会类似于var，会提升到全局作用域或者函数作用域的头部，实体依旧留在块级作用域内

```js
// es6
function f() { console.log('I am outside!'); }

(function () {
  if (false) {
    // 重复声明一次函数f
    function f() { console.log('I am inside!'); }
  }

  f();
}());
```
过程类似于

```js
function f() { console.log('I am outside!'); }

(function() {
  var f = undefined;
  if(false) {
    // 重复声明一次函数f
    function f() { console.log('I am inside!'); }
  }
  f() // f is not a function
})()
```


```js
// es5:  function test() {}
// es6:  undefined
console.log(test)

if(true) { // es6有块级作用域函数声明提前，但是函数体留在块级作用域里
  function test() {
    return 'test'
  }
}

console.log(test) // function test() {} 

```


函数虽然不会跟let，const一样，外部无法拿到块级作用域的声明，但是受到块级作用域的影响，函数依然会被保护，内部修改了函数名，不会影响到外部
```js
{
  function test() {
    test = 1;
    consol.log('内部test', test) // 1
  }
  test()
  console.log('外部test', test) // 1
}
console.log('外部test', test) // function test(){}
```


### map和object的其中一个区别
map是有序的，object是无序的