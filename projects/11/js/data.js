const data = {
  // 背景图
  bg: "./img/photo/bg.png",
  // pic为单独的拍照图片；card为加背景的整个图片
  photoStyle: "pic",
  // 拍照图片以及屏保图片的大小位置
  container:{
    w:"78",
    h:"24",
    x:"5",
    y:"31",
  },
  // 前景图
  foregroundPicture: {
    isShow: true,
    w:"36",
    x:"59",
    y:"-6",
    img: "./img/photo/tree.png",
  },
  // 无拍照图片时显示屏保 
  temp: "./img/photo/temp.png",
  // 提示文字
  tip: "./img/photo/tip.png",
  // 最后需要保存的图片的大小位置 
  resultCanvas:{
    w:"78",
    h:"24",
    x:"10.5",
    y:"33"
  }
};
