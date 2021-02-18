// 防抖节流
function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        if(timer) {
            clearTimeout(timer)
            timer = setTimeout(() => {
                fn.apply(this, args)
            }, delay)
        }
    }
}


// 节流函数
function throttle(fn, delay) {
    let flag = false;
    return function(...args) {
        if(!flag) {
            flag = true;
            setTimeout(() => {
                fn.apply(this, args)
                flag = false
            }, delay)
        }
    }
}