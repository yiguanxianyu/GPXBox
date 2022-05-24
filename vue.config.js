const {defineConfig} = require('@vue/cli-service')

module.exports = defineConfig({
    publicPath: '/GPXbox-demo/',
    transpileDependencies: true,
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].title = 'GPXbox';
            return args;
        })
    }
})