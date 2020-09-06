// vue.config.js
module.exports = {
	lintOnSave: false,
	publicPath: './',
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title= '高雄旅遊資訊頁面'
        return args
      })
  }
}