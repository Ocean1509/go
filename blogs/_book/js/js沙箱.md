### js沙箱
概念的理解：
    沙箱sandbox，让程序跑在一个隔离的环境下，不对外界的其他程序造成影响，典型的使用场景就是微前端。每个微应用需要进行沙箱隔离，子应用操作的window对象不会相互影响且卸载后不影响全局。


### node.js vm
node原生模块中的vm可以实现沙箱隔离，看官网的例子
```js
const vm = require('vm');

const x = 1;

const context = { x: 2 };
vm.createContext(context); // 上下文隔离化对象。

const code = 'x += 40; var y = 17;';
// `x` and `y` 是上下文中的全局变量。
// 最初，x 的值为 2，因为这是 context.x 的值。
vm.runInContext(code, context);

console.log(context.x); // 42
console.log(context.y); // 17

console.log(x); // 1; y 没有定义。
```

### iframe
iframe是天然的沙箱环境

### qiankun 沙箱的处理方式
#### 方式一： 快照
思想是记录沙箱环境中变化的全局js变量，在退出沙箱时还原，需要有三个map来记录，一个是记录新增的全局变量，一个是记录更新的全局变量，保留改变前的值，方便更新，最后一个记录沙箱期间不停改变的全局变量
```js
class LegacySandbox {
    // 沙箱内新增的全局变量
    addedPropsMapInSandbox = new Map();
    // 沙箱内更新的全局变量,保留改变前的值，方便恢复
    modifyPropsMapInSandbox = new Map();
    // 记录沙箱期间不停改变的全局变量(新增修改)
    currentUpdatedPropsValueMap = new Map()
    sandbox = null;
    constructor() {
        const originWindow = window;
        const self = this;
        const fakeWindow = Object.create(null);
        const { addedPropsMapInSandbox, modifyPropsMapInSandbox, currentUpdatedPropsValueMap } = this;
        this.sandbox = new Proxy(fakeWindow, {
            get: function(target, p) {
                // 获取时直接取window对象上的值
                return originWindow[p]
            },
            // 做不到深层对象的代理，例如window.ioc.env
            set: function(target, p, value) {
                // 如果设置的值在window对象上不存在，则需要在新增的map中记录
                if(!originWindow.hasOwnProperty(p)) {
                    addedPropsMapInSandbox.set(p, value)
                } else if(!modifyPropsMapInSandbox.has(p)) {
                    // 沙箱内部没更新过变量
                    const originalValue = originWindow[p];
                    // 把改变前的值记录下来，退出沙箱时可以恢复。
                    modifyPropsMapInSandbox.set(p, originalValue);
                }
                currentUpdatedPropsValueMap.set(p, value);
                console.log(addedPropsMapInSandbox, modifyPropsMapInSandbox,currentUpdatedPropsValueMap)
                // 设置全局变量值
                originWindow[p] = value;
                return true
            }
        })
    }
    // 激活应用时，要恢复之前设置的全局变量
    active() {
        console.log('active');
        this.currentUpdatedPropsValueMap.forEach((v, p) => this.setWindowProp(p, v));
    }
    // 卸载应用时，之前设置的全局变量要恢复到原始值
    inactive() {
        console.log('inactive')
        // 恢复旧的全局变量
        this.modifyPropsMapInSandbox.forEach((v, p) => this.setWindowProp(p, v));
        // 删掉沙箱内添加的全局变量
        this.addedPropsMapInSandbox.forEach((_, p) => this.setWindowProp(p, undefined, true));

    }
    // 设置删除windows属性
    setWindowProp(prop, value, toDelete) {
        if (value === undefined && toDelete) {
            delete window[prop];
        } else if (this.isPropConfigurable(window, prop) && typeof prop !== 'symbol') {
            Object.defineProperty(window, prop, { writable: true, configurable: true });
            window[prop] = value;
        }
    }
    isPropConfigurable(target, prop) {
        const descriptor = Object.getOwnPropertyDescriptor(target, prop);
        return descriptor ? descriptor.configurable : true;
    }
};
let sanboxProxy = new LegacySandbox();



// 业务代码
eval(function (sandbox, window) {
    
    var vm = new Vue({
        el: "#app",
        template: "<div>vue</div>",
        mounted() {
            sandbox.active();
            console.log('----')
        },
        beforeDestroy() {
            console.log('====')
        },
        destroyed() {
            sandbox.inactive();
            console.log('destroy')
        }
    })
    window.ddd = 123123;
    // 多层对象无法拦截，proxy需要做进一步处理
    window.ioc.d = 12321
    // 调用destoryVue时会销毁组件
    window.destroyVue = function () {
        vm.$destroy();
        vm.$el.innerHTML = ''
    };
    console.log(window)
}(sanboxProxy, sanboxProxy.sandbox));
```

缺陷： 快照的方式只能针对单实例，如果需要同时运行多个实例时，由于每个都是直接修改window对象，所以这种方式不适用。


#### 方式二：沙箱状态池
对window对象的操作不再直接操作到window上，而是作用于沙箱池，取值时优先从沙箱状态池中获取，没有再从window对象上拿

```js
class ProxySandbox {
    // 沙箱状态池
    updatedValueSet = new Map();
    constructor() {
        const { updatedValueSet } = this; 
        const originWindow = window;
        const fakeWindow = Object.create(null);
        this.sandbox = new Proxy(fakeWindow, {
            get(target, p) {
                return updatedValueSet.get(p) || originWindow[p]
            },
            set(target, p, value) {
                updatedValueSet.set(p, value);
            }
        })
    }
}
```

#### 方式3： 基于不支持proxy浏览器的处理
当浏览器不支持proxy时，只能通过间接记录每个window可遍历属性的状态达到隔离的目的

 思路： 沙箱被激活时，记录当前window下的可遍历属性，把上次沙箱卸载变化的属性赋值到当前的window对象上。
       卸载时，当前window对象和激活时记录的window对象进行对比。将当前window对象恢复到记录的window对象中，同时记录差异变化的属性，供下次激活使用

```js
class SnapshotSandbox {
    windowSnapshot = {};
    modifyPropsMap = {};
    active() {
        // 记录当时window状态
        this.windowSnapshot = {};
        for(let i in window) {
            if(window.hasOwnProperty(i)) {
                this.windowSnapshot = window[i]
            }
        }
        // 前一次卸载保留的记录，恢复到window对象
        for(let i in modifyPropsMap) {
            window[i] = modifyPropsMap[i]
        }

    }
    inactive() {
        for(let i in windowSnapshot) {
            if(windowSnapshot.hasOwnProperty(i)) {
                // 拿激活阶段的保留的快照和当前的window对比，不同的则为沙箱中操作变更的全局变量。
                // 将不同的记录下来。
                // 恢复window对象为快照阶段。
                if(windowSnapshot[i] !== window[i]) {
                    this.modifyPropsMap = window[i];
                    window[i] = windowSnapshot[i];
                }
            }
        }
    }
}

```