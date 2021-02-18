function limitRequest(limit, requestArray, callback) {
    let promiseA = [];
    let allP = []
    for (let i = 0; i < requestArray.length; i++) {
        if (promiseA.length < limit) {
            promiseA.push(requestArray[i]);
            if (promiseA.length === limit) {
                allP.push(promiseA);
                promiseA = []
            }
        }
    }
    allP.push(promiseA)
    let toFetch = function (promise) {
        if (promise.length) {
            let r = promise.shift();
            return Promise.allSettled(r.map(d => fetchData(d))).then((res) => {
                callback(res)
                toFetch(promise)
            });
        }
    }

    return toFetch(allP)
}

// 模拟请求
const fetchData = function (num) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(num)
            }, num * 500)
        })
}


limitRequest(2, [1,2,3,4,5,6,7,8,9], function(res) {
    console.log(res)
})

// 进阶
// 最大化利用空闲通道
// 每个接口请求时间不同，有块有慢，所以最大化利用空闲通道本质上是动态增补。

function limitRequest2() {

}

limitRequest2(2, [1,2,4,6,3,5,7,8,9], function(res) {
    console.log(res)
})