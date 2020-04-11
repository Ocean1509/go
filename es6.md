1. for-of 无法遍历weakSet, weakMap(弱引用)
```
var a = new WeakSet([[1,2], [3,4]])
for(let i of a) {
  console.log(i) // a is not a iterable
}
```


2. es6存在块级作用域，如果在块级作用域内声明函数，函数声明会类似于var，会提升到全局作用域或者函数作用域的头部，实体依旧留在块级作用域内
```
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
```
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

