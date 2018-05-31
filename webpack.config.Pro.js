const path = require('path');
const glob = require("glob");
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// # 入口配置（js babel 合并 map 压缩 重命名）
// # 自由配置（过去的目录结构）（统一个文件里）
let files = glob.sync(__dirname +'/develop/app/**/*.js');
let newEntries = {};
files.forEach(function (f) {
    const label =  f.match(/.+\/app\/([\s\S]*)\.js$/)[1];
    newEntries[label] =  f;
});

module.exports = {
    entry: newEntries,
    output: {
        filename: "[name].min.js",
        path: path.resolve(__dirname + '/build/'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/, // 跳过exclude中的文件
                loader: 'babel-loader'
            },
        ]
    },
    plugins: [
        // # 压缩和生产Map
        new UglifyJsPlugin({
            exclude: /\/includes/,
            cache: true,
            sourceMap: true,
            uglifyOptions:{
                ie8: false,
                ecma: 6,
            }
        }),
    ],
    // 生成map，详情见配置文档
    // devtool: 'source-map',
    // 监听变化，详情见配置文档
    watch: true,
    // 控制台提示信息输出
    stats: {
        // 增加资源信息?
        assets: false,
        // 增加子级的信息?
        children: false,
        // 增加提示?
        warnings: false,
    },
}