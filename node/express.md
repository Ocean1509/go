```
app.get('./', () => {
    next()
}, function() {

})
```

中间件的分类
系统级中间件

 app.use
 app.get也是中间件  自动next


路由级中间件
```
var router = express.Router()
router.get('/')
```

错误级中间件




### cookie
中间件
cookie-parser


一个controller对应多个action



log4js

