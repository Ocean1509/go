// 手写bind
Function.prototype.myBind = function(context) {
    context = context || window
    var fn = this;
    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
        var argument = Array.prototype.slice.call(arguments, 1)
        return fn.apply(context, args.concat(argument))
    }
}

var a = 23
var b = 11
function test(b) {
    console.log(this.a)
}

var obj = {
    a: 1,
    b: 13
}
console.log(test(22))