const webpack = require("webpack");
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    // __dirname是node.js中的全局变量它指向当前执行脚本所在的目录
    entry: __dirname + '/app/main.js', // 已多次提及的唯一入口文件
    output: {
        path: __dirname + '/build', // 打包后文件存放的地方
        filename: 'bundle-[hash].js' // 打包后输出文件的文件名--迭代升级版带上hash值，至于后面引用的方法参考文章HtmlWebpackPlugin部分
    },

    devtool: 'eval-source-map', // 调试工具，实际开发中都是false或者‘null’

    devServer: { // 作用是让浏览器监听代码，进行实时刷新
        contentBase: "./public", // 本地服务器所加载的页面所在的目录
        historyApiFallback: true, // 不跳转
        inline: true // 实时刷新
    },
    /*
        babel：其实是一个编译JavaScript的平台，它可以编译代码以达到以下目的：
            1、让你能使用最新的JavaScript代码（ES6、ES7……），而不用管新标准是否被当前使用的浏览器完全支持
            2、让你能使用基于JavaScript进行了拓展的语言，比如React的JSX
        本质是几个模块化的包，其核心功能位于称为babel-core的npm包里，
        webpack可以把其不同的包整合在一起使用，对于每一个你需要的功能或者拓展，都需要安装单独的包
        用的最多的是解析ES6的babel-env-preset包和解析JSX的babel-preset-react包
    */

    /*
        现在是loader的配置，需要搭配babel一起食用
        通过使用不同的loader，webpack有能力调用外部的脚本或工具，实现对不同文件的处理，比如SCSS转CSS，
        或者把下一代的JS文件（ES6、ES7）转换为现代浏览器兼容的JS文件，对React的开发而言，
        合适的Loaders可以把React中用到的JSX文件转为JS文件
    */
    module: {
        rules: [
            { // 处理js/jsx文件
                test: /(\.jsx|\.js)$/, // 一个用以匹配loaders所处理文件的拓展名的正则表达式（必须）
                use: {
                    loader: 'babel-loader', // loader的名称（必须）
                    /*
                    这个在.babelrc文件中配置了
                    options: {
                        presets: [
                            "env", "react"
                        ]
                    }
                    */
                },
                exclude: /node_modules/ // include/exclude 手动添加必须处理的文件（文件夹）/ 屏蔽不需要处理的文件（文件夹）（可选）
            },
            { // 处理css文件
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader' // style-loader将计算后的样式加入页面中，二者组合在一起使你能把样式表嵌入在webpack打包后的JS文件
                    },
                    {
                        loader: 'css-loader', // css-loader是你能够使用类似@import和url()的方法实现require()的功能
                        options: {
                            // modules: { // 注意注意！！！！参考文档这里不应该写成下面注释的结构，要写成当前使用的结构
                            //     localIdentName: '[name]__[local]--[hash:base64:5]' // 这里的作用可以看页面生成后引用cssname的变化
                            // }


                            modules: true, // 指定启用css modules 跟上面的modules写法任取其一（用localIdentName就不需要下面的postcss-loader)
                            // localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css类名格式
                        }
                    },
                    { // 多介绍一种处理css的平台
                        loader: 'postcss-loader' // 另一种处理css方法，搭配postcss.config.js文件一起食用  跟css-loader任取其一即可
                    }
                ]
            }
        ]
    },
    /*
        插件plugins：
        用来拓展webpack功能的，他们会在整个构建过程中生效，执行相关的任务。
        Loaders是在打包构建过程中用来处理源文件的（JSX、SCSS、LESS……）一次处理一个，
        Plugins并不直接操作单个文件，他直接对整个构建过程起作用
     */
    plugins: [
        new webpack.BannerPlugin('©版权所有，翻版必究'), // 这个是给打包后的代码添加版权声明的插件
        // new webpack.HotModuleReplacementPlugin()//热加载插件
        new webpack.optimize.OccurrenceOrderPlugin(), // 为组建分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
        // new webpack.optimize.UglifyJsPlugin(), //  压缩JS代码
        new ExtractTextPlugin("style.css"), // 分离CSS和JS文件
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.tmpl.html"//new 一个这个插件的实例，并传入相关的参数
        }),
        new CleanWebpackPlugin() // 因为每次打包输出文件带上hash值后文件都不一样，所以会出现居多打包文件，故用这个文件来删除没用的文件
        /*
            这里是旧版
            new CleanWebpackPlugin(['build/*.*'], {
                root: __dirname,
                verbose: true,
                dry: false
            })
        */
    ]
}