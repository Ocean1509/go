 // ⼿写⼀个new操作符
 function MyNew(target) {
    const obj = Object.create(null);
    let args = Array.prototype.slice.call(arguments, 1)
    Object.setPrototypeOf(obj, target.prototype)
    const result = target.apply(obj, args)
    // result结果为对象，函数时，返回result结果
    return result instanceof Object && result !== null ? result : obj
 }
 function Car(color, money) {
     this.color = color;
     this.money = money
     return function() {
         console.log('111')
     }
 }
 Car.prototype.sell = function() {
     console.log(this.color)
 }
 var car = MyNew(Car, 'yellow', 12)
// var car = new Car('yellow', 12)
console.log(car)
// car.sell()