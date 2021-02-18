### jsx语法
转换jsx语法的babel插件 - @babel/plugin-transform-react-jsx




setState 异步更新不会立马更新组件，批量延迟更新， 包括react控制的事件处理程序（onClick，onChange）生命周期钩子
(componentwillmount钩子执行setState是同步的)
setState同步更新
    原生js绑定的事件，setTimeout


setState有两种形式
一种对象，一种函数形式，对象形式设置不能保证state是最新的，而函数形式可以保证是最新的



react 和 vue的区别：
    react自由度高，vue2和typescript结合不好，react需要手动做优化


React.Fragment:
    不创建额外dom的条件下，让render()返回多个元素


reactElement对象有一个$$typeof属性，值是一个symbol，目的是防止xss攻击，后端存储会转成string，symbol无法转换，所有返回到前端时，没有$$typeof属性。所以是非法的reactElement对象。无法渲染

父子级是双向链表
同级是单向链表


onclick = {this.setSate();this.setState()};会合并进行批处理，如果不想进行批处理，可以用unBatchUpdate立即执行。默认isBatchUpdate会true，会进行批处理。

