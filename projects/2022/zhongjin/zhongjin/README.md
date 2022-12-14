# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)


## 运行项目
- npm run dev

## 打包项目
- npm run build

## 答题流程
- 1. 首页 -> 点击大屏答题 -> 答题(全部回答正确) -> 答题后扫码领奖页面 -> 扫码后跳转成功页面 
- 2. 首页 -> 点击大屏答题 -> 答题(第一次答错) -> 显示继续答题和重新答题按钮,若继续答题 -> 跳到下一题接着作答 -> 全部回答完成显示重新答题  
- 3. 首页 -> 点击大屏答题 -> 答题(第一次答错) -> 显示继续答题和重新答题按钮,若重新答题 -> 重新选题并回到第一题(中间回答错误走第二个流程,无则走第一个流程)
- 4. 首页 -> 手机扫描二维码 -> 手机答题 -> 回答错误走流程二中的错误流程
- 5. 首页 -> 手机扫描二维码 -> 手机答题 -> 全部回答正确最后显示兑换码
- 6. 首页 -> 点击兑换码输入 -> 输入手机答题获取的兑换码 -> 兑换码第一次使用成功调货,再次使用提示卷码不存在或已使用