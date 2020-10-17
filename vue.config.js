module.exports = {
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false
    },
    electronBuilder: {
      chainWebpackRendererProcess(config) {
        config.plugins.delete('workbox')
        config.plugins.delete('pwa')
      }
    }
  }
};
