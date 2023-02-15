var webpack = require("webpack");
const { ESBuildMinifyPlugin } = require("esbuild-loader");
const path = require("path");
const vendor = [
  "ahooks",
  "axios",
  "lodash",
  "query-string",
  "styled-components",
  "react",
  "react-admin",
  "react-dom",
  "@mui/material",
  "@mui/icons-material",
  "@mui/base",
  "@mui/utils",
  "@mui/system",
  "@mui/styled-engine",
];
module.exports = {
  mode: "production",
  devtool: false,
  entry: {
    vendor,
  },
  optimization: {
    minimizer: [
      // minizier for both css and js
      new ESBuildMinifyPlugin({
        target: "es2015",
        css: true,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "esbuild-loader",
        options: {
          target: "es2015",
        },
      },
    ],
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(process.cwd(), "dist/[name].manifest.json"),
      name: "[name]",
    }),
  ],
  output: {
    path: path.resolve(process.cwd(), "dist"),
    filename: "[name].js",
    library: "[name]",
  },
};
