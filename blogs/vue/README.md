## Vue
### vue生命周期的描述
beforeCreated,created,beforeMount(有挂载元素),mounted,beforeUpdated,updated,beforeDestory,destoryed,activated,deactivated,errorCaptured
全局错误捕获：errorHandler
### 为什么data需要是一个函数
组件是复用的，如果data是对象，改变对象的值其他组件的data值也会改变，所以需要用一个函数每次创建一个data副本。

### computed 和 watch的区别

### 响应式原理
Object.defineProperty

### vue3响应式
proxy

### 运行时 和 编译加运行


### v-model的原理
1. props + @input
2. 组件：父子组件通信的语法糖  :value + @input

### 如何解决中文输入
监听compositionStart，compositionEnd

### 事件的原理
原生：在生成真实dom节点时绑定事件
组件：发布订阅模式 $on  $emit


### 组件通信
props, 事件， $parents, $children, $listener, provide inject, eventBus, vuex

### extends
创建子类构造器

### 全局注册组件和局部注册组件的区别

### minxin混入
混入一些生命周期钩子


### 动态组件is


### 有没有写过directive
v-enter



### Vite


### 模板编译

### nexttick原理

### diff算法

1. 节点的比较从跨级对比变成同层对比，复杂度从o3变成on
2. 同层比较是通过两个指针的移动对比。新旧对比过程是通过头头，尾尾，头尾的方式
3. 如果四个对比都没有相同节点，则会通过key存的map值去找，然后移动位置
   



### 为什么用with
with的作用域和模板的作用域正好契合。简化编译流程








### react和vue的区别
运行时优化和编译时优化
vue: template约束，静态节点标记，数据依赖收集

react: 不做模板约束，写法自由，不知道哪些数据发生变化，需要对整个dom进行dom diff，这个时候会有阻塞，所以强调运行时优化，引入fiber架构，可中断

### react diff 和vue diff的区别



### 说一下vuex

### vue-Router

