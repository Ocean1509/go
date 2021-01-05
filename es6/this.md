### 箭头函数和普通函数this的区别
1. 箭头函数没有this，它的this指向定义时对象，而不是使用时的对象。最外层的有效this

2. settimeout中this的区别

```
function Timer() {
  this.s1 = 0;
  this.s2 = 0;
  // 箭头函数 this指向定义时的有效对象，timer
  setInterval(() => this.s1++, 1000);
  // 普通函数， this指向window对象
  setInterval(function () {
    this.s2++;
  }, 1000);
}

var timer = new Timer();

setTimeout(() => console.log('s1: ', timer.s1), 3100);
setTimeout(() => console.log('s2: ', timer.s2), 3100);
// s1: 3
// s2: 0
```

3. 事件绑定中this的区别

```
// 箭头函数的this指向window对象
document.addEventListener('click', (event) => {
    console.log(this)
})

// 普通函数的this指向document
document.addEventListener('click', function() {
    console.log(this)
})
```


4. 对象属性不适用箭头函数,此时this不指向ojb，而是指向window对象， 因为对象不构成单独的作用域。
```
var obj = {
    test: () => {
        console.log(this)
    }
}
```


```
var handler = {
  id: '123456',

  init: function() {
      // this指向最外层的handler
    document.addEventListener('click',
      event => this.doSomething(event.type), false);
  },

  doSomething: function(type) {
    console.log('Handling ' + type  + ' for ' + this.id);
  }
};
```
