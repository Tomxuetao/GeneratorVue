// vue.config.js
const path = require('path')
// 是否为生产环境
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    publicPath: './',
    filenameHashing: false,
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    chainWebpack: config => {
        if (isProd) {
            // 为生产环境修改配置...
        } else {
            // 为开发环境修改配置...
        }
        // 移除 preload 插件
        config.plugins.delete('preload')
        // 移除 prefetch 插件
        config.plugins.delete('prefetch')
        const svgRule = config.module.rule('svg')
        // 清除已有的所有 loader。
        // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
        svgRule.uses.clear()
        svgRule
            .test(/\.svg$/)
            .include.add(path.resolve(__dirname, './src/icons'))
            .end()
            .use('svg-sprite')
            .loader('svg-sprite-loader')
            .options({
                symbolId: '[name]'
            })
        const fileRule = config.module.rule('file')
        fileRule.uses.clear()
        fileRule
            .test(/\.svg$/)
            .exclude.add(path.resolve(__dirname, './src/icons'))
            .end()
            .use('file-loader')
            .loader('file-loader')
        config
            .plugin('html')
            .tap(args => {
                args[0].title = '高锦代码生成器'
                args[0].favicon = 'public/favicon.ico'
                return args
            })
        // 打包分析工具
        config
            .plugin('webpack-bundle-analyzer')
            .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
        // 别名配置
        // config.resolve.alias.set('@style', path.resolve(__dirname, './src/assets/scss'))
    },
    css: {
        // 启用 CSS modules for all css / pre-processor files.
        modules: false,
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {}
    }
}
