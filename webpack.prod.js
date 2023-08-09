const { merge } = require("webpack-merge");
const config = require("./webpack.config.js");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(config, {
  mode: "production",
  plugins: [
    new CssMinimizerPlugin()
  ]
})
