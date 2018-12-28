module.exports = {
  baseUrl: '/',
  runtimeCompiler: true,
  configureWebpack: {
    devServer: {
      compress: true,
      // disableHostCheck: true,
      // host: "dashboard-dev.biologichealth.ai",
      // https: true,
      inline: false,
      proxy: 'http://localhost:3000'
    }
  }
  // transpileDependencies: ["vuex-persist"]
};
