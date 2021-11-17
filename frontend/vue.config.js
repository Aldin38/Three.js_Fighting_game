// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('fbx')
      .test(/\.fbx$/)
      .use('fbx')
      .loader('file-loader')
      .end()
      .use('fbx')
      .loader('file-loader')
    // Any options could be set here
    // .options(...)
      .end();
  },
};
