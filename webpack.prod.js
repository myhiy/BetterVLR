const { merge } = require("webpack-merge");
const config = require("./webpack.config.js");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ZipPlugin = require("zip-webpack-plugin");

module.exports = merge(config, {
  mode: "production",
  plugins: [
    new CssMinimizerPlugin(),
    new ZipPlugin({
      path: "../",
      filename: "bettervlr.zip",
    }),
  ],
});
