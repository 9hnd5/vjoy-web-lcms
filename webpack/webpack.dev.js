const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  devServer: {
    hot: true,
    open: true,
    compress: true,
    port: 3000,
    historyApiFallback: true,
    static: path.resolve(process.cwd(), "dist"),
    devMiddleware: {
      writeToDisk: false,
    },
    client: {
      progress: true,
      overlay: true,
      logging: "info",
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
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve(process.cwd(), "dist/vendor.manifest.json")),
    }),
  ],
  output: {
    path: path.join(process.cwd(), "./dist"),
    filename: "main.js",
    assetModuleFilename: "assets/[hash][ext][query]",
  },
};
