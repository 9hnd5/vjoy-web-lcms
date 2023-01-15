const path = require("path");

module.exports = {
  mode: "development",
  devServer: {
    hot: true,
    open: true,
    compress: true,
    static: {
      directory: path.join(__dirname, "dist"),
      publicPath: "http://localhost:3000",
    },
    port: 3000,
    historyApiFallback: true,
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
  plugins: [],
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "main.js",
    clean: true,
  },
};
