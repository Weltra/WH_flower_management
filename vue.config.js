const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, // 修改成false 就是不检查了
  devServer: {
    port: 8081 // 此处修改你想要的端口号
}
})

