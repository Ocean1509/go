// 手写bind
Function.prototype.myBind = function(context) {
    if (typeof this !== 'function') {
        throw TypeError("not function")
    }
    context = context || window
    var fn = this;
    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
        var argument = Array.prototype.slice.call(arguments, 1)
        return fn.apply(context, args.concat(argument))
    }
}