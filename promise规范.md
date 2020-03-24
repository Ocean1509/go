完全遵循Promsie/A+规范的实现

1. 基本用法
```
var p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 2000)
})
p.then((data) => {
  console.log(data)
})
```
Promise构造器接受一个函数作为参数，参数有两个内部自定义的方法，一个resolve,一个reject，异步执行成功时调用resolve。
Promise实例有个then方法，异步成功后执行then中传递的函数。

基本实现
```
class MyPromise {
  constructor(fn) {
    // 处理结果的返回值
    this.value = undefined;
    // then执行fullfill方法合集
    this.resolvedCallbacks = [];
    const resolve = value => {
      this.value = value;
      this.resolvedCallbacks.map(r => r(this.value))
    }
    const reject = () => {

    }
    fn(resolve, reject);
  }
  then(fn) {
    this.resolvedCallbacks.push(fn)
  }
}
```

2. promise状态一旦确定，无法被修改，即resolve,reject只能执行一次

原生promise结果
```
var p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
    resolve('success1')
  }, 2000)
})
p.then((data) => {
  console.log(data) // 只会执行一次success，success1不会执行
})
```
规范中Promise内部维护一个当前态，等待态（Pending）、执行态（Fulfilled）和拒绝态（Rejected）。一旦确定状态无法修改
```
// 内部三个状态
const PENDING = 'PENDING'
const FULLFILLED = 'FULLFILLED'
const REJECTED = 'REJECTED'
class MyPromise {
  constructor(fn) {
    // 处理结果的返回值
    this.value = undefined;
    // then执行fullfill方法合集
    this.resolvedCallbacks = [];
    // 初始为pending，等待状态
    this.state = PENDING;
    const resolve = value => {
      if(this.state === PENDING) {
        this.value = value;
        this.state = FULLFILLED;
        this.resolvedCallbacks.map(r => r(this.value))
      }
    }
    ...
  }
}
```
3. 如果是同步promise，需要直接resolve
```
var p = new MyPromise((resolve, reject) => {
  resolve('success')
}).then((data) => {
  console.log(data)
})
```
实现时在执行resolve时，用setTimeout模拟一个异步行为
```
class MyPromise {
  constructor(fn) {
    ...
    const resolve = value => {
      // setTimout模拟异步行为，让同步时then的表现一致
      setTimeout(() => {
        if (this.state === PENDING) {
          this.value = value;
          this.state = FULLFILLED;
          this.resolvedCallbacks.map(r => r(this.value))
        }
      });
    }
    const reject = () => {

    }
    fn(resolve, reject);
  }
  then(fn) {
    if (this.state === PENDING) { // pending状态才能添加回调
      this.resolvedCallbacks.push(fn)
    }
  }
}
```
4. then方法返回是一个promise，以支持链式调用
原生promise表现
```
var p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 2000)
}).then((data) => {
  console.log(data)
  return 'success1'
}).then(data => {
  console.log(data)
})
```
实现MyPromise时，then方法要返回一个新的MyPromise对象
```
class MyPromise {
  constructor() {}
  then(fn) {
    if (this.state === PENDING) {
      // then 返回一个新的promise
      return new MyPromise((resolve, reject) => {
        this.resolvedCallbacks.push(() => {
          // 除了执行fn外，还需要将结果resolve出去
          let result = fn(this.value)
          resolve(result)
        })
      })
    }
  }
}
```

5. promise执行空的then

原生promise表现
```
var p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 2000)
}).then().then(data => {
  console.log(data)
})
```
实现上如果不传递参数，则默认为一个空函数
```
class MyPromise {
  constructor() {}
  then(onFullfilled = val => val) {
    if (this.state === PENDING) {
      // then 返回一个新的promise
      return new MyPromise((resolve, reject) => {
        this.resolvedCallbacks.push(() => {
          // 除了执行fn外，还需要将结果resolve出去
          let result = fn(this.value)
          resolve(result)
        })
      })
    }
  }
}
```

6. promsie支持 then 传递 thenable 对象。
原生promsie表现
```
var p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 2000)
}).then((data) => {
  console.log(data)
  return {
    then: function (resolve, reject) {
      resolve('success1')
    }
  }
}).then(data => {
  console.log(data)
})
// success, success1
```
利用一个中间函数去处理then函数返回值的类型，如果有对象或者函数拥有then方法，则将resolve放到thenable中处理
```
function promiseResolutionProcedure(result, resolve, reject) {
  if ((typeof result === "object" || typeof result === "function") && result !== null) {
    if (typeof result.then === "function") {
      result.then(resolve, reject);
    } else {
      resolve(result);
    }
  } else {
    resolve(result);
  }
}

class MyPromise {
  constructor() {}
  then(onFullfilled = val => val) {
    if (this.state === PENDING) {
      // then 返回一个新的promise
      return new MyPromise((resolve, reject) => {
        this.resolvedCallbacks.push(() => {
          // 除了执行fn外，还需要将结果resolve出去
          let result = onFullfilled(this.value)
          // 返回值处理
          promiseResolutionProcedure(result, resolve, reject);
        })
      })
    }
  }
}
```

7. promise对象支持then传递promise对象
```
var p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 2000)
}).then((data) => {
  console.log(data)
  return new Promise((r, j) => {
    setTimeout(() => {
      r('success1')
    }, 1000);
  })
}).then(data => {
  console.log(data)
})
// success //两秒后显示
// success1  //再过一秒显示
```

实现上依旧在promiseResolutionProcedure中处理

```
function promiseResolutionProcedure(result, resolve, reject) {
  if (result instanceof MyPromise) {
    if (result.state === PENDING) {
      result.then(resolve, reject);
    } else {
      result.state === FULFILLED && resolve(result.value);
      result.state === REJECTED && reject(result.value);
    }
  }
  if ((typeof result === "object" || typeof result === "function") && result !== null) {
    if (typeof result.then === "function") {
      result.then(resolve, reject);
    } else {
      resolve(result);
    }
  } else {
    resolve(result);
  }
}

```

8. 处理then中循环引用promise
```
const promise = new Promise((resolve, reject) => {
  resolve("success");
});
const promise1 = promise.then(data => {
  return promise1;
});
// Uncaught (in promise) TypeError: Chaining cycle detected for promise #<Promise>
```

在promiseResolutionProcedure函数中添加多一个参数，参数为then中返回的promsie，判断该promise是否和then返回的promise一致，抛出异常
```
function promiseResolutionProcedure(result, resolve, reject, originPromise) {
  if (originPromise === result) {
    throw new Error("循环引用 promise");
  }
  if (result instanceof MyPromise) {
    if (result.state === PENDING) {
      result.then(resolve, reject);
    } else {
      result.state === FULLFILLED && resolve(result.value);
      result.state === REJECTED && reject(result.value);
    }
  }
  if ((typeof result === "object" || typeof result === "function") && result !== null) {
    if (typeof result.then === "function") {
      result.then(resolve, reject);
    } else {
      resolve(result);
    }
  } else {
    resolve(result);
  }
}

class MyPromise {
  constructor() {}
  then(onFullfilled = val => val) {
    if (this.state === PENDING) {
      // then 返回一个新的promise2
      let promise2 = new MyPromise((resolve, reject) => {
        this.resolvedCallbacks.push(() => {
          // 除了执行fn外，还需要将结果resolve出去
          let result = onFullfilled(this.value)

          promiseResolutionProcedure(result, resolve, reject, promise2);
        })
      })
      return promise2
    }
  }
}
```

9. promise支持reject，同时被then的第二个函数捕获
原生promise表现
```
const promise = new Promise((resolve, reject) => {
  reject("error");
});
const promise1 = promise.then(data => {
  console.log('success: ' + data);
}, err => {
  console.log('error' + err)
}); // errorerror
```

实现过程与resolve类似，不做过多阐述
```
 class MyPromise {
      constructor(fn) {
        // 处理结果的返回值
        this.value = undefined;
        // then执行fullfill方法合集
        this.resolvedCallbacks = [];
        // then执行reject方法合集
        this.rejectedCallbacks = []
        // 初始为pending，等待状态
        this.state = PENDING;
        const resolve = value => {
          // setTimout模拟异步行为，让同步时then的表现一致
          setTimeout(() => {
            if (this.state === PENDING) {
              this.value = value;
              this.state = FULLFILLED;
              this.resolvedCallbacks.map(r => r(this.value))
            }
          });
        }
        const reject = err => {
          setTimeout(() => {
            if (this.state === PENDING) {
              this.value = err;
              this.state = REJECTED;
              this.rejectedCallbacks.map(r => r(this.value))
            }
          });
        }
        fn(resolve, reject);
      }
      then(onFullfilled = val => val, onRejected = err => {
        throw new Error(err)
      }) {
        if (this.state === PENDING) {
          // then 返回一个新的promise
          let promise2 = new MyPromise((resolve, reject) => {
            this.resolvedCallbacks.push(() => {
              // 除了执行fn外，还需要将结果resolve出去
              let result = onFullfilled(this.value)

              promiseResolutionProcedure(result, resolve, reject, promise2);
            })
            this.rejectedCallbacks.push(() => {
              // 除了执行fn外，还需要将结果resolve出去
              let result = onRejected(this.value)

              promiseResolutionProcedure(result, resolve, reject, promise2);
            })
          })
          return promise2
        }
      }
    }
```

10. then支持处理完成态或失败态的then
```
class MyPromise {
  then(onFullfilled = val => val, onRejected = err => {
    throw new Error(err)
  }) {
    let promise2;
    if (this.state === FULFILLED) {
      promise2 = new MyPromise((resolve, reject) => {
        let result = onFullfilled(this.value);
        promiseResolutionProcedure(result, resolve, reject, promise2);
      });
    }

    // 处理已经完成的promise
    if (this.state === REJECTED) {
      promise2 = new MyPromise((resolve, reject) => {
        let result = onRejected(this.value);
        promiseResolutionProcedure(result, resolve, reject, promise2);
      });
    }
    if (this.state === PENDING) {
      // then 返回一个新的promise
      promise2 = new MyPromise((resolve, reject) => {
        this.resolvedCallbacks.push(() => {
          // 除了执行fn外，还需要将结果resolve出去
          let result = onFullfilled(this.value)

          promiseResolutionProcedure(result, resolve, reject, promise2);
        })
        this.rejectedCallbacks.push(() => {
          // 除了执行fn外，还需要将结果resolve出去
          let result = onRejected(this.value)

          promiseResolutionProcedure(result, resolve, reject, promise2);
        })
      })
      return promise2
    }
  }
}
```

11. Promise.all 的实现
```
class MyPromise {
  // 静态方法all的实现
  static all(promiseArray) {
    return new MyPromise((resolve, reject) => {
      let successCount = 0;
      let arr = []
      for (let i = 0; i < promiseArray.length; i++) {
        console.log(promiseArray[i])
        promiseArray[i].then(data => {
          successCount++;
          arr.push(data)
          if (successCount === promiseArray.length) {
            resolve(arr)
          }
        }, err => {
          reject(err)
        })
      }
    })
  }
}
```