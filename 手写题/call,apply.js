// 手写call
Function.prototype.myCall = function (context) {
    context = context || window;
    var fn = Symbol()
    context[fn] = this;
    var args = []
    for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i])
    }
    // args会自动转成string
    var result = eval('context[fn](' + args + ')')
    delete context.fn;
    return result;
}

// 手写apply
Function.prototype.myApply = function (context, args) {
    context = context || window;
    var fn = Symbol();
    context[fn] = this;
    // args会自动转成string
    var result = eval('context[fn](' + args + ')')
    delete context.fn;
    return result;
}

var a = 12
function test(c, d) {
    console.log(c)
    console.log(d)
}
var obj = {
    a: 23
}
test.myCall(obj, 1, 2)
