const { merge } = require("webpack-merge");
const config = require("./webpack.config.js");
const ZipPlugin = require("zip-webpack-plugin");

module.exports = merge(config, {
  mode: "development",
  devtool: "inline-source-map",
  plugins: [
    new ZipPlugin({
      path: "../",
      filename: "bettervlr.zip",
    })
  ]
})
