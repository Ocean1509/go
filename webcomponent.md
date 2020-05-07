### web components前端组件化

#### 构成
Custome Elements
Html Imports
Html Templates
Shadow DOM



#### 简单实例
```
<body>
  <user-card></user-card>
  <script>

    class UserCard extends HTMLElement {
      constructor() {
        super()
        const div = document.createElement("div")
        div.innerText = "web components"
        this.append(div)
      }
    }

    customElements.define('user-card', UserCard)

  </script>
</body>
```

利用template模板进行编写
```
<user-card></user-card>
<template id="userCardTemplate">
  <div>
    test
  </div>
</template>
<script>
  class UserCard extends HTMLElement {
    constructor() {
      super();

      var templateElem = document.getElementById('userCardTemplate');
      var content = templateElem.content.cloneNode(true);
      this.appendChild(content);
    }
  }
  window.customElements.define('user-card', UserCard);
</script>
```


### 三个基于web components实现的库
X-TAG (fireFox), PolymerJS (chrome), omi(tencent)

