const path = require("path");

module.exports = {
  mode: "development",
  devServer: {
    hot: true,
    open: true,
    compress: true,
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
    path: path.join(process.cwd(), "./dist"),
    filename: "main.js",
    assetModuleFilename: "assets/[hash][ext][query]",
  },
};
