// 使用settimeout模拟setinterval

// setInterval(() => console.log(1), 1000)


function simInterval(fn, delay) {
    setTimeout(() => {
        fn.call(this);
        simInterval(fn, delay)
    }, delay)
}

simInterval(() => console.log(1), 1000)