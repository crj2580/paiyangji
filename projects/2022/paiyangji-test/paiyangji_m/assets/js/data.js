const data = {
  // 答题背景图
  bg: {
    img: "https://sensingstore.oss-cn-shanghai.aliyuncs.com/paiyangji/bg-above4.png",
    w: "100",
    h: "100",
  },
  // 题目与选项整体位置
  container:{
    w:"",   
    h:"",
    x:"10",
    y:"10",
  },
  // 题目
  questionClass:{
    w:"70",     // 可改变大小更改题目一行显示内容的长短
    h:"",
    fontSize:"4",
    color:"#2a6ab8",
    lineHeight:"3",         // 改变题目行与行之间的距离
    letterSpacing:"0.5",    // 改变题目字与字之间的距离
    margin:{
        top:"3",
        right:"",
        bottom:"",
        left:"7",
    }
  },
  // 所有答案选项内容
  questionAnswer: {
    w: "78",    // 改变选项的宽度同时改变选项框背景的宽度
    h: "",
    color: "#2a6ab8",
    x: "1",
    y: "19",
    questionOption: {
      w: "100",
      h: "7",   // 答案选项框高度
      lineHeight: "",
      margin: {
        top: "",
        right: "",
        bottom: "2",
        left: "",
      },
      // 答案字体间距
      answer:{
        letterSpacing:"1",
      },
      // 选项
      answerOption: {
        fontSize: "4",
        color: "#2a6ab8",
      },
      // 答案内容
      answerContent: {
        fontSize: "4",
        color: "#2a6ab8",
        margin:{
            top: "",
            right:"",
            bottom:"",
            left:"1",
        }
      },
    },
  },

  // 选项框背景图
  answer_white_m: "https://sensingstore.oss-cn-shanghai.aliyuncs.com/paiyangji/answer_white.png",

  // 底部按钮
  footerBtn: {
    w:"100",
    h:"",
    x: "1",
    y: "25",
    // 继续答题按钮
    continuerBtn: {
      img: "https://sensingstore.oss-cn-shanghai.aliyuncs.com/paiyangji/continue.png",
      w: "40",
      h:"",
      margin: {
        top: "",
        right: "9",
        bottom: "",
        left: "",
      },
    },
    // 重新答题按钮
    restartBtn: {
      img: "https://sensingstore.oss-cn-shanghai.aliyuncs.com/paiyangji/restart.png",
      w:"40",
      h:"",
    },
  },
};
