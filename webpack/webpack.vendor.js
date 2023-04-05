var webpack = require("webpack");
const { EsbuildPlugin } = require("esbuild-loader");
const path = require("path");
module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  entry: {
    // ahooks: "ahooks",
    // axios: "axios",
    // lodash: "lodash",
    // querystring: "query-string",
    // react: ["react", "react-dom"],
    // ra: "react-admin",
    // router: ["react-router-dom", "react-router"],
    // mui: ["@mui/material", "@mui/icons-material", "@mui/base", "@mui/utils", "@mui/system", "@mui/styled-engine"],
    // rtk: ["@reduxjs/toolkit", "react-redux"],
  },
  // optimization: {
  //   minimize: true,
  //   moduleIds: "deterministic",
  //   removeAvailableModules: true,
  //   removeEmptyChunks: true,
  //   concatenateModules: true,
  //   flagIncludedChunks: true,
  //   innerGraph: true,
  //   mangleExports: "deterministic",
  //   mergeDuplicateChunks: true,
  //   runtimeChunk: "single",
  //   minimizer: [
  //     // minizier for both css and js
  //     new EsbuildPlugin({
  //       target: "es2015",
  //       css: true,
  //     }),
  //   ],
  // },
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
