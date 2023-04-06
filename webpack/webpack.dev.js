const path = require("path");
const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
  mode: "development",
  devServer: {
    hot: true,
    open: true,
    compress: true,
    port: 3000,
    historyApiFallback: true,
    static: path.resolve(process.cwd(), "dll"),
    devMiddleware: {
      writeToDisk: false,
    },
    client: {
      progress: true,
      overlay: true,
      logging: "error",
    },
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve(process.cwd(), "dll/vendor.manifest.json")),
    }),
  ],
  output: {
    path: path.join(process.cwd(), "./dist"),
    filename: "main.js",
    assetModuleFilename: "assets/[hash][ext][query]",
  },
};
