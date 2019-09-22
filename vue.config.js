const path = require('path')

function addSassResource(rule) {
  rule
    .use("style-resource")
    .loader("sass-resources-loader")
    .options({
      resources: [path.resolve(__dirname, "./src/assets/styles/var.less")]
    });
}

module.exports = {
  chainWebpack: config => {
    // 自动化导入 例如：less的全局变量common.less文件
    const types = ["vue-modules", "vue", "normal-modules", "normal"];
    types.forEach((type) =>
      addSassResource(config.module.rule("less").oneOf(type))
    );
  },
  devServer: {
    port: 3000,
    proxy: {
      '/api': {
        target: `http://127.0.0.1:7001`,
        // target: `https://www.agilityjin.top`,
        secure: false,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/' // 需要rewrite的, 路径重写
        }
      },
    }
  },
}