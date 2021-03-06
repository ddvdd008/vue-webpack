/**
 * 生成环境配置 - 预发环境
 */

var webpack = require('webpack'),
    fs = require('fs'),
    config = require('./webpack.base.config'),
    PATHS = require('./PATHS'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

//config
config.output.publicPath = '/dist/'; // 资源路径
var chunks = Object.keys(config.entry);

//replace-loader
config.module.loaders.push({
    test: /config.js$/,
    loader: 'string-replace',
    query: {
        multiple: [{//更换接口域名 - sh
            search: "rootPath = rootPathConf",
            replace: 'rootPath = "http://beta.sh.jd.com/prices"'
        },{//更换接口域名 - bj
            search: "rootPathCore = rootPathCoreConf",
            replace: 'rootPathCore = "http://beta.bj.jd.com/api"'
        },{//更换接口调用方式
            search: "env = envConfig",
            replace: 'env = "beta"' 
        }]
    },
    include: PATHS.SERVICES.join('xhr')
});

//plugins
config.plugins = (config.plugins || []).concat([
    // 提取公共模块
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendors' // 公共模块的名称
        // chunks: chunks, // chunks 是需要提取的模块
        // minChunks: chunks.length
    }),
    new ExtractTextPlugin("css/[name].css"), // 提取CSS
    new webpack.optimize.UglifyJsPlugin({ // 压缩文件
        compress: {
            warnings: false
        }
    })
]);

//html files
config.methods.generateHtml(config, PATHS.ROOT.join('dist/pages/'));



// 写入环境变量
fs.open(PATHS.ROOT.join('/config/ENV.js'), 'w', function(err, fd) {
    var buf = 'export default "beta";';
    fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
});

module.exports = config;