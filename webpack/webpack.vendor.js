var webpack = require("webpack");
const { EsbuildPlugin } = require("esbuild-loader");
const path = require("path");
const rimraf = require("rimraf");

rimraf.rimraf(`${process.cwd()}/dll`);

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  resolve: {
    extensions: [".js"],
  },
  entry: {
    vendor: [
      "@mui/material",
      "@mui/x-data-grid",
      "@mui/base",
      "@mui/system",
      "@mui/utils",
      "@mui/icons-material",
      "@mui/private-theming",
      "@mui/styled-engine",
      "ra-core",
      "ra-ui-materialui",
      "react-admin",
      "react",
      "react-dom",
      "ahooks",
      "axios",
      "lodash",
      "query-string",
      "react-router",
      "react-router-dom",
      "react-redux",
      "@reduxjs/toolkit",
      "@reduxjs/toolkit/query/react",
      "papaparse",
      "react-hook-form",
      "react-dropzone",
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new EsbuildPlugin({
        target: "esnext",
        minify: true,
        css: true,
      }),
    ],
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(process.cwd(), "dll/[name].manifest.json"),
      name: "[name]",
    }),
  ],
  output: {
    path: path.resolve(process.cwd(), "dll"),
    filename: "[name].js",
    library: "[name]",
  },
};
