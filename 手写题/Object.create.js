// 实现object.create
function myCreate(target) {
    function Fn() {}
    Fn.prototype = target;
    return new Fn()
}