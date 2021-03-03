##### 为什么vue源码中用了with
作者的解释：
作者：尤雨溪
链接：https://www.zhihu.com/question/49929356/answer/118534768
来源：知乎


为啥呢，因为没有什么太明显的坏处（经测试性能影响几乎可以忽略），但是 with 的作用域和模板的作用域正好契合，可以极大地简化模板编译过程。Vue 1.x 使用的正则替换 identifier path 是一个本质上 unsound 的方案，不能涵盖所有的 edge case；而走正经的 parse 到 AST 的路线会使得编译器代码量爆炸。虽然 Vue 2 的编译器是可以分离的，但凡是可能跑在浏览器里的部分，还是要考虑到尺寸问题。用 with 代码量可以很少，而且把作用域的处理交给 js 引擎来做也更可靠。用 with 的主要副作用是生成的代码不能在 strict mode / ES module 中运行，但直接在浏览器里编译的时候因为用了 new Function()，等同于 eval，不受这一点影响。当然，最理想的情况还是可以把 with 去掉，所以在使用预编译的时候（vue-loader 或 vueify），会自动把第一遍编译生成的代码进行一次额外处理，用完整的 AST 分析来处理作用域，把 with 拿掉，顺便支持模板中的 ES2015 语法。也就是说如果用 webpack + vue 的时候，最终生成的代码是没有 with 的。



### Vue和react的区别

Vue是在编译时优化，react是运行时优化，所有react代码比较大。而vue为了编译更好，必须按照他给定的模板编写，react更加灵活





vue1中一个指令对应一个watcher，```{{test}}```属于```v-html```指令。所以vue1不需要dom diff，但是内存中需要维护多分watcher，所以会出现卡顿。
```<div v-if="test">{{test}}</div>```
而vue2用一个组件对应一个watcher（一个组件对应一个render，一个render对应一个watcher），并引入dom diff(组件层面的diff)。所以vue做的是编译时优化。 给没有变化的节点打静态节点标签，下次dom diff时不需要diff

react不知道哪些数据发生变化，因为他没有vue中对数据依赖的收集，所以需要对整个dom的dom diff,这个时候会出现阻塞，所以react强调的是运行时优化。(fiber,可中断机制)



vue3在编译优化上除了做静态节点标签优化外，还进行block tree


vue2编译过程是正则匹配机制，正则匹配有个缺点就是匹配越长，性能越差(递归回溯)


### vue2 和 vue3 的区别
vue2是options api
vue3是composition api
### vue挂载补充

挂载过程是先父后子，即render是先父后子(生成vnode)，而update对组件实例化的过程是先子后父。
