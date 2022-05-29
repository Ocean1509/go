### electron-rebuild的作用
electron虽然支持原生模块，但由于和官方node相比使用了不同的V8引擎，如果想编译原生模块，则需要手动设置electron的headers的位置，`electron-rebuild` 包可以重新编译原生模块，它可以识别当前 Electron 版本，帮你自动完成了下载 headers、编译原生模块等步骤。

### electron-builder打包
https://github.com/QDMarkMan/CodeBlog/tree/master/Electron

https://github.com/QDMarkMan/CodeBlog/blob/master/Electron/electron-builder%E6%89%93%E5%8C%85%E8%AF%A6%E8%A7%A3.md