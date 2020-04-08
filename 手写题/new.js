 // ⼿写⼀个new操作符
 // new过程：
 // 它创建了一个全新的对象。
 // 它会被执行[[Prototype]]（也就是__proto__）链接。
 // 它使this指向新创建的对象。。
 // 通过new创建的每个对象将最终被[[Prototype]]链接到这个函数的prototype对象上。
 // 如果函数没有返回对象类型Object(包含Functoin, Array, Date, RegExg, Error)，
 // 那么new表达式中的函数调用将返回该对象引用。
 
 function MyNew(target) {
     const obj = Object.create(null);
     let args = Array.prototype.slice.call(arguments, 1)
     if (target.prototype !== null) {
         Object.setPrototypeOf(obj, target.prototype)
     }
     const result = target.apply(obj, args)
     // result结果为对象，函数时，返回result结果
     return result instanceof Object && result !== null ? result : obj
 }




 function Car(color, money) {
     this.color = color;
     this.money = money
     return function () {
         console.log('111')
     }
 }
 Car.prototype.sell = function () {
     console.log(this.color)
 }
 var car = MyNew(Car, 'yellow', 12)
 // var car = new Car('yellow', 12)
 console.log(car)
 // car.sell()