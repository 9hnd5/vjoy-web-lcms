var webpack = require("webpack");
const { ESBuildMinifyPlugin } = require("esbuild-loader");
const path = require("path");
// const vendor = [
//   "ahooks",
//   "axios",
//   "lodash",
//   "query-string",
//   "styled-components",
//   "react",
//   "react-admin",
//   "react-dom",
//   "react-router-dom",
//   "react-router",
//   "@mui/material",
//   "@mui/icons-material",
//   "@mui/base",
//   "@mui/utils",
//   "@mui/system",
//   "@mui/styled-engine",
// ];
module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  entry: {
    ahooks: "ahooks",
    axios: "axios",
    lodash: "lodash",
    querystring: "query-string",
    styledcomponents: "styled-components",
    react: ["react", "react-dom"],
    ra: "react-admin",
    router: ["react-router-dom", "react-router"],
    mui: ["@mui/material", "@mui/icons-material", "@mui/base", "@mui/utils", "@mui/system", "@mui/styled-engine"],
    rtk: ["@reduxjs/toolkit", "react-redux"],
  },
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
