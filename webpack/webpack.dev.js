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
    // watchFiles: ["src/**/*"],
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
      manifest: require(path.resolve(process.cwd(), "dll/ahooks.manifest.json")),
    }),
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve(process.cwd(), "dll/axios.manifest.json")),
    }),
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve(process.cwd(), "dll/lodash.manifest.json")),
    }),
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve(process.cwd(), "dll/querystring.manifest.json")),
    }),
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve(process.cwd(), "dll/styledcomponents.manifest.json")),
    }),
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve(process.cwd(), "dll/react.manifest.json")),
    }),
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve(process.cwd(), "dll/ra.manifest.json")),
    }),
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve(process.cwd(), "dll/router.manifest.json")),
    }),
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve(process.cwd(), "dll/mui.manifest.json")),
    }),
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve(process.cwd(), "dll/rtk.manifest.json")),
    }),
  ],
  output: {
    path: path.join(process.cwd(), "./dist"),
    filename: "main.js",
    assetModuleFilename: "assets/[hash][ext][query]",
  },
};
