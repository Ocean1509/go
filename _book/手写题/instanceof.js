// 手写instanceof
function instanceofs(left, right) {
    left = left.__proto__;
    right = right.prototype;
    while(true) {
        if(left === right) {
            return true
        }
        if(left === null) {
            return false
        }
        left = left.__proto__;
    }
}
console.log(instanceofs([], Object))

console.log(instanceofs([], RegExp))