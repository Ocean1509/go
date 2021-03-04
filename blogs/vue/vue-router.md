### vue-router遗漏点补充

#### this.$router.push 和 this.$router.replace的不同
replace不会向history添加新纪录

vue-router的编程式和浏览器本身对history的操作一致

push -> window.location.pushState()
replace -> window.location.replaceState()
go ->  window.history.go()


#### 导航守卫

**参数或查询的改变并不会触发进入/离开的导航守卫。你可以通过观察 $route 对象来应对这些变化，或使用 beforeRouteUpdate 的组件内守卫。**

全局守卫
    beforeEach  (权限认证)
    beforeResolve
    beforeAfter
独享路由守卫
    beforeEnter
组件守卫
    beforeRouteEnter
    beforeRouteUpdate (参数改变)
    beforeRouteLeave

##### 完整的导航解析流程
1. 导航被触发。
2. 在失活的组件里调用 beforeRouteLeave 守卫。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。
#### 路由模式有三种
hash，history，abstract(非浏览器环境，通过一个栈来模拟浏览器历史调用栈的行为)

### 原理大致思路

hash模式
    导航栏改变 -> window.addEventListener('hashChange', 修改视图)  ->  更新视图
    页面路由跳转 -> router push ->  window.location.hash = 'xxx'  ->  更新视图
                -> router replace -> window.location.replace   ->  更新视图
history模式
    页面路由跳转 -> router push
