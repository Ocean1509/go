// 手写map
Array.prototype.myMap = function (fn, thisArg) {
    let arr = this;
    let newArr = []
    let context = thisArg || window;
    for (let i = 0; i < arr.length; i++) {
        newArr.push(fn.call(context, arr[i], i, arr))
    }
    return newArr
}


// console.log([1, 2, 3].myMap(function (s, i) {
// return s * 2
// }))

// 手写reduce
Array.prototype.myReduce = function (callback, initialValue) {
    let arr = this;
    if (initialValue === void 0) initialValue = 0;
    let result = initialValue;
    for (let i = 0; i < arr.length; i++) {
        result = callback(result, arr[i], i, arr)
    }
    return result;
}

console.log([1, 2, 3, 4, 5, 6].myReduce((current, pre, preindex, arr) => {
    return current = current + pre;
}))