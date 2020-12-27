### jsx语法
转换jsx语法的babel插件 - @babel/plugin-transform-react-jsx




setState 异步更新不会立马更新组件，批量延迟更新， 包括react控制的事件处理程序（onClick，onChange）生命周期钩子
(componentwillmount钩子执行setState是同步的)
setState同步更新
    原生js绑定的事件，setTimeout


setState有两种形式
一种对象，一种函数形式，对象形式设置不能保证state是最新的，而函数形式可以保证是最新的
