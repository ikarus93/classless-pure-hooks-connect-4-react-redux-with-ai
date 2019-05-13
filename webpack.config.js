//const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path")
module.exports = {
    entry: {
        main: "./src/index.js"
    },
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(scss|css)$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            }
        ]
    },
    plugins: [ /*
        new HtmlWebPackPlugin({
            template: "./dist/index.html",
            filename: "./index.html"
        }) */
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
            react: path.resolve(path.join(__dirname, './node_modules/react')),
        }
    }
};
