自定义广告页页面数据用一个JSON对象保存,分为basicData和itemList两个属性
以下文档中带`()`括号的内容为编辑时所用属性,对显示时无影响
# basicData 
页面的基础信息
* "name":string 页面的名称
* "type":string 固定为"basic"

# itemList 
一个数组,通过键值对的方式存储页面上各个组件的信息


### 通用属性
* "show":bool 组件是否显示
* ("lock"):bool 组件是否锁定
* ("selected"): bool 当前是否被选中
* "type": string 组件类型
  * "canvas" : 画布
  * "button" : 热区
  * "image" : 图片
  * "text" : 文本
  * "media" : 视频
  * "swiper" : 轮播
  * "html" : 网页
  * "qrcode" : 二维码
* "width":number 宽度
* "height":number 高度
* "left":number 坐边距
* "top":number 上边距
* "rotate": number 旋转角度
* "extensionData":string 额外信息
* "zIndex":number 显示优先级
* "transformScale": string 翻转方式
  * "" : 无翻转
  * "scaleX(-1)" : 水平翻转
  * "scaleY(-1)" : 垂直翻转
  * "scale(-1)" : 完全翻转

### canvas
* "displayName": string 页面名称
* "canvasSize": string 页面大小
  * "" : 自定义
  * "1" : width: 1920, height: 1080
  * "2" : width: 1080, height: 1920
  * "3" : width: 375, height: 600
* "backgroundColor": string 背景十六进制颜色 
* "backgroundImage": string 背景图
* "backgroundOpacity": number 图片透明度
* "backgroundSize":string 背景图大小
  * "" : 无
  * "cover" : 覆盖
  * "contain" : 填充
  * "100% 100%" : 拉伸至撑满
* "backgroundRepeat": string 背景重复方式
  * "repeat" : 平铺
  * "no-repeat" : 无重复
  * "repeat-x" : 水平平铺
  * "repeat-y" : 垂直平铺

### button/image 
* "borderRadius": number 圆角
* "backgroundColor": string 背景十六进制颜色 
* "backgroundImage": string 背景图
* "backgroundOpacity": number 图片透明度
* "backgroundSize":string 背景图大小
  * "" : 无
  * "cover" : 覆盖
  * "contain" : 填充
  * "100% 100%" : 拉伸至撑满
* "backgroundRepeat": string 背景重复方式
  * "repeat" : 平铺
  * "no-repeat" : 无重复
  * "repeat-x" : 水平平铺
  * "repeat-y" : 垂直平铺

### text
* "color": string 文本十六进制颜色 
* "fontSize" : number 文字大小
* "letterSpacing" : number 文字间距
* "fontWeight": bool 文字是否用加粗
* "fontStyle": bool 文字是否用斜体
* "textIndent": number 文字缩进
* "lineHeight": number 行高
* "textAlign": string 文字对齐方式
  * "left" 居左
  * "right" 居右
  * "center" 居中
* "whiteSpace": string 文字间隙
  * "normal" : 正常
  * "pre" : 所见即所得
  * "nowrap" : 禁止换行
* "textContent": string 文字内容

### media
* "autoplay": bool 自动播放
* "loop": bool 循环播放
* "controls": bool 显示操作面板
* "muted": bool 静音
* "resource" : string 资源url
* "poster" : string 封面url

### swiper
* (resourceListIndex):number 轮播组件编号
* resourceList :array 轮播资源列表,其中每一项包含如下特有属性。其他属性同`media`和`image`
  * ("showDetail") :bool 是否显示细节
  * "type" : string 媒体类型
    * "image" : 图片
    * "media" : 视频
  * "resource" :string 资源url

### html
 * "resource" :string 资源url
 * "downloadMode" : string 下载模式
  * "" : 不下载
  * "self" : 仅下载html
  * "all" : 完全下载

### qrcode
* "qrcodeUrl" : string 二维码链接
* "qrcodeType" : string 二维码类型
  * "normal" : 普通二维码
  * "activity" : 活动
* "activityId" : 活动Id
* "gameId" : 游戏Id
* "gameList" : 游戏列表(在数据传输中总是为[])



### product 
* "productId" : 商品Id
* "optList" : 商品列表(在数据传输中总是为[])
* "productName" : 商品名(在数据传输中总是为"")
* "picUrl" : 商品图片(在数据传输中总是为"")
