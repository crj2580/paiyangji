module.exports = {
  devServer: {
    open: true,
  },
  // 这里是配置上线读取当前目录，默认是根路径，如 /js, /css 等，具体根据项目来
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  outputDir: process.env.VUE_APP_THEME == "Portrait" ? "dist-p" : "dist",
};
