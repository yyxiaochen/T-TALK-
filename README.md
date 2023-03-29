## 即时聊天软件
**系统采用uni-app框架开发，使用uni-ui组件库，后端使用java语言，springboot框架，mysql数据库，redis缓存服务器以及其他插件**

### 1.登录
操作流程：使用软件功能之前需要进行登录操作，输入邮箱账号接收验证码即可，未注册的用户会自动注册，已注册的用户会直接登录。如下图所示

<img src=".\static\img\登录.png" alt="聊天" style="zoom:35%;" />

### 2.即时聊天模块
在软件首页有在线人数实时显示功能，以及可以点击随机匹配进行匹配操作;匹配成功会进入聊天界面，聊天中可以发送图片和发送语音功能，其他功能暂未开放

<img src=".\static\img\首页.png" alt="首页" style="zoom:35%;" /><img src=".\static\img\聊天界面.png" alt="聊天界面" style="zoom:35%;" />

### 3.动态广场模块
包括查看其他人动态（已通过），查看自己动态（所有），发布动态三个模块组成；同时动态发布可以上传最多6张照片，发布后仍需后台系统进行审核后才能被其他人订阅。

<img src=".\static\img\动态.png" alt="动态" style="zoom:55%;" />
