# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)


## 配置
--  图片上传oss
--  修改dist文件夹下config文件下的data.json文件里数据
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
   -- padding                 键盘的内边距
      -- top                  上
      -- right                右
      -- bottom               下
      -- left                 左
-- keyboardItemWrapper        键盘按键大小
-- keyboardItem               键盘按键背景
   -- fontSize                字体大小
      -- str                  键盘文字大小
      -- num                  键盘数字大小
   -- color                   字体颜色
-- keyBoardTitle              键盘按键文字的位置
   -- lineHeight              文字行高
-- questionClass              答题题目
   -- letterSpace             字体间距
   -- margin                  外边距
-- questionAnswer             答案整体选项框的大小
-- questionOption             答案选项背景
   -- wrongRedImg             回答错误的gif图（不用替换）
   -- rightRedImg             回答正确gif图（不用替换）
-- answer                     答案文字的框
-- footerBtn                  答题时显示的继续答题&重新答题整体框大小
-- continuerBtn               继续答题
-- restartBtn                 重新答题


### 上传至139.169.240.230服务器
1. 在 D:\wxActivity\other 路径下新建项目文件夹
2. 把 dist 文件夹放到新建的项目文件夹下

### 后台配置路径
1. 后台配置路径
   {
      "AppHomeUrl":"https://m.sensingstore.com/other/（项目名）/dist/index.html",
      "AppReplenishUrl":"https://m.sensingstore.com/v10/app/sample/paiyangji-c.html"
   }
