# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)


## 配置
--  图片上传oss
### data.json文件
-- securityKey  游戏密钥
-- subkey       设备密钥
-- homeBgImg    首页背景图
   -- src       图片在oss的路径
   -- w         宽度
   -- h         高度
   -- x         左右位移距离
   -- y         上下位移距离
-- homeQrCode   首页二维码
-- answerBgImg  答题背景图
-- verificationCodeBgImg      验证码页面背景图
-- returnHomeBtn              返回首页按钮
-- goAnswerBtn                大屏答题按钮
-- goVerificationCodeBgImgBtn 兑换码输入按钮
-- inputBox                   输入验证码页面兑换码及案按键 的整体位置             
-- inputContainer             输入验证码页面的文字提醒及兑换码的整体位置
-- inputContainerBgImg        输入验证码页面的文字提醒
-- inputCodeList              输入验证码页面的兑换码
-- inputCodeItem              输入验证码页面的兑换码的文字大小、颜色
-- keyboardContainer          键盘的整体位置
   -- padding                 键盘离上下左右的距离
      -- top                  上
      -- right                右
      -- bottom               下
      -- left                 左
-- keyboardItemWrapper        
