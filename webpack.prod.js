const path = require("path");
const { ESBuildMinifyPlugin } = require("esbuild-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  //Optimization build for production
  optimization: {
    minimize: true,
    moduleIds: "deterministic",
    removeAvailableModules: true,
    removeEmptyChunks: true,
    concatenateModules: true,
    flagIncludedChunks: true,
    innerGraph: true,
    mangleExports: "deterministic",
    mergeDuplicateChunks: true,
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
    minimizer: [
      // minizier for both css and js
      new ESBuildMinifyPlugin({
        target: "es2015",
        css: true,
      }),
    ],
  },
  //Turnoff dev tool for best performance
  devtool: false,
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "esbuild-loader",
            options: {
              loader: "css",
              minify: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[id].[name].[contenthash].css",
    }),
  ],
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "[id].[name].[contenthash].js",
    clean: true,
  },
};
