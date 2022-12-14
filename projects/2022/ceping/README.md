# 测评 + 拍照互动软件


## 业务流程说明及接口简介


1.  初始化本地配置（先从SenisngStoreCLoud建立相应的活动，获取活动游戏的SecurityKey，[详细参考文档](https://docs.troncell.com)） 
2.  从SensingStoreCloud平台获取，答题数据，进行答题 
  答题完成后，提交答题数据至云平台
3.  进行拍照，拍照完成后，上传照片到云服务器，并获取相下载二维码
4.  用户微信手机扫码访问下载照片页面

![业务流程图](https://raw.githubusercontent.com/troncell/WebDeveloperTraining/e956fa834ca38a20a323f26eaf8f8c8618f00224/02-Bussiness/assests/QA_Photing_flow.png)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm start
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
