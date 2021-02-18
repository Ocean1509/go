react hook是在16.8新增的特性，他可以让state在函数组件中使用，以前只能在类组件中使用。

好处：
    代码简洁
    上手简单
    不需要高阶组件
    redux不再是必需品，mobx上手简单


Hook核心概念与应用
    useState
        以前的函数组件，每次状态变化，会触发重新渲染，重新渲染会让函数重新执行，而函数每次执行完毕后，所有的内存都会被释放掉。
        hook的usestate的底层原理相当于在函数内部建立闭包，保留了状态，并提供了一个修改状态的方法。
        state的改变是异步的
        useState 可以在一个组件中使用多次

    useEffect
        由于有状态的存在，所以函数组件从原来的纯函数，，固定输入只有固定输出，变成了一个有副作用的函数。
        比如： ajax请求，访问原生dom对象，定时器等。
        有hook之前，副作用是不被允许的。

        useEffect相当于componentDidMount，componentDidUpdate 在组件渲染到屏幕后才执行。 useEffect(fn) 返回一个清除副作用的函数(1. componentWillUnmount, 2. 下一个useEffect前)，或者不返回。和前面两个相比，他不会阻塞浏览器的渲染。

        一般不需要同步，如果需要同步可以使用useLayoutEffect

        需要有第二个参数，否则会进入无限循环。副作用执行过程中，由于修改了state专改，会引发重新渲染，导致无限循环。第二个参数确定比较值，告诉react不依赖于props，state

    useContext
        context 爷孙组件的传值
        context 和 useContext 组件之间的状态共享问题，可以不用redux
    

    useReducer
        和redux使用几乎一样
        useState内部就是靠useReducer实现的
        useSteate的替代方案  (state, action) => newState

        接收三个参数，state，配套的dispatch

    useRef
        Object.createRed 创建ref的方法
        访问dom节点，useEffect去操作dom

    useMemo && useCallbak
        useMemo 把创建函数和依赖项数组作为参数传入useMemo (记忆函数)
    
        useCallback
        接收一个内联回调函数和一个依赖项数组(记忆函数)

    自定义hook  
        逻辑功能相同的片段 -》封装成单独的函数来使用
        自定义hook 函数
        自定义hook中可以调用官方提供的hook 命名一般是use开头
        复用状态逻辑的方式，而不是复用state本身，事实上hooks每次调用都有一个独立的state
    
Hook使用规则
    1. 只能在最顶层使用hook 不要魂环，嵌套函数中调用hook
    2. 只在react函数中调用hook

