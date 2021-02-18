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

12. Promsie.race 的实现
```
class MyPromse {
  static race(promiseArray) {
    return MyPromsie((resolve, reject) => {
        for(let i = 0;i<arr.length;i++) {
            promiseArray[i].then(data => {
                resolve(data)
            }).catch(err => {
              reject(err)
            })
        }
    })
  }
}
```

13. Promsie.allSettled 的实现

Promise.allSettled()方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只有等到所有这些参数实例都返回结果，不管是fulfilled还是rejected，包装实例才会结束。fulfilled时，对象有value属性，rejected时有reason属性，对应两种状态的返回值。

例子：
```
const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);

const allSettledPromise = Promise.allSettled([resolved, rejected]);

allSettledPromise.then(function (results) {
  console.log(results);
});
// [
//    { status: 'fulfilled', value: 42 },
//    { status: 'rejected', reason: -1 }
// ]
```

实现:
```
class MyPromise {
  allSellted(promiseArray) {
    return new MyPromsie((resolve) => {
      let arr = [];
      let idx = 0
      for(let i = 0; i<promiseArray.length;i++) {
        promiseArray[i].then(data => {
          idx++;
          arr.push({
            status: 'fullfilled',
            value: data
          })
        }).catch(err => {
          idx++;
          arr.push({
            status: 'rejected',
            reason: err
          })
        }).finally(() => {
          if(idx === promiseArray.length) {
            resolve(arr)
          }
        })
      }
    })
  }
}
```

14. promsie.any的实现

与上面类似，一个fullfilled则resolve，所有的都rejected则返回rejected


15. promise.resolve
promise.resolve会将对象转化为promise对象，`promise.resolve('foo')`等价于 `new Promise((resolve) => resolve('foo'))`

特别注意，promise.resolve的参数是一个promsie实例时，promise.resolve将不做任何修改，原封不动的返回这个实例

```
var p = Promise.resolve(1)
var p1 = Promise.resolve(p)

p === p1


```



16. resolve会拆箱，reject不会拆箱
```
var p1 = new Promise(function(resolve, reject){
  resolve(Promise.resolve('resolve'));
});

var p2 = new Promise(function(resolve, reject){
  resolve(Promise.reject('reject'));
});

var p3 = new Promise(function(resolve, reject){
  reject(Promise.resolve('resolve'));
});

p1.then(
  function fulfilled(value){
    console.log('fulfilled: ' + value);
  }, 
  function rejected(err){
    console.log('rejected: ' + err);
  }
);

p2.then(
  function fulfilled(value){
    console.log('fulfilled: ' + value);
  }, 
  function rejected(err){
    console.log('rejected: ' + err);
  }
);

p3.then(
  function fulfilled(value){
    console.log('fulfilled: ' + value);
  }, 
  function rejected(err){
    console.log('rejected: ' + err);
  }
);

```
```
p3 rejected: [object Promise]
p1 fulfilled: resolve
p2 rejected: reject
```
Promise回调函数中的第一个参数resolve，会对Promise执行"拆箱"动作。即当resolve的参数是一个Promise对象时，resolve会"拆箱"获取这个Promise对象的状态和值，但这个过程是异步的。p1"拆箱"后，获取到Promise对象的状态是resolved，因此fulfilled回调被执行；p2"拆箱"后，获取到Promise对象的状态是rejected，因此rejected回调被执行。但Promise回调函数中的第二个参数reject不具备”拆箱“的能力，reject的参数会直接传递给then方法中的rejected回调。因此，即使p3 reject接收了一个resolved状态的Promise，then方法中被调用的依然是rejected，并且参数就是reject接收到的Promise对象。



```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>promise规范</title>
</head>

<body>
  <script>
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
        try {
          fn(resolve, reject);
        } catch (error) {
          reject(error)          
        }
      }
      // 静态方法all的实现
      static all(promiseArray) {
        return new MyPromise((resolve, reject) => {
          let successCount = 0;
          let arr = []
          for (let i = 0; i < promiseArray.length; i++) {
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
      then(onFullfilled = val => val, onRejected = err => {
        throw new Error(err)
      }) {
        let promise2;
        if (this.state === FULLFILLED) {
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
      catch (onRejected) {
        return this.then(null, onRejected)
      }
    }

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
  </script>
  <script>
    MyPromise.all([
      new MyPromise(resolve => {
        resolve(1);
      }),
      new MyPromise(resolve => {
        resolve(2);
      })
    ]).then(dataList => {
      console.log(dataList);
    });
  </script>
</body>

</html>
```