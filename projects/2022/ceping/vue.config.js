module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        // '@': 'src' 默认配置了
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
      }
    },
  },
}