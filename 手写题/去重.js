// 数组扁平化去重
//编写一个程序将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组
var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];


function fattern(arr) {
    return arr.reduce((pre, next) => {
        return pre.concat(Array.isArray(next) ? fattern(next) : next)
    }, [])
}
function test(arr) {
    return [...new Set(fattern(arr))].sort((a, b) => a - b)
}

console.log(test(arr))