const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    open: false,
    proxy: {
      '/admin': {
        target: 'http://localhost:3002',
        changeOrigin: true
      }
    }
  }
})
