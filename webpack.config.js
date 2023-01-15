const path = require("path");
const { merge } = require("webpack-merge");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

//Get config base on env build
function getEnvConfig(env) {
  if (env === "prod" || env === "dev") {
    return require(path.join(__dirname, `./webpack.${env}.js`));
  }
}

module.exports = ({ env }) => {
  const envConfig = getEnvConfig(env);

  const envVars = require(`./env.${env}`);

  const commonConfig = {
    entry: path.join(__dirname, "./src/index.tsx"),

    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      modules: [path.join(__dirname, "src"), "node_modules"],
    },

    module: {
      rules: [
        //Loader for typescript(.tsx)
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: "esbuild-loader",
          options: {
            loader: "tsx",
            target: "es2015",
          },
        },
        //Loader for image, icon
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
        //Loader for font
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
      ],
    },

    plugins: [
      new ForkTsCheckerWebpackPlugin(),
      new webpack.DefinePlugin({
        ENV: JSON.stringify(envVars),
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "./src/index.html"),
        favicon: path.join(__dirname, "./src/assets/favicon.ico"),
        title: "LCMS",
      }),
    ],
  };

  const finalConfig = merge(envConfig, commonConfig);

  return finalConfig;
};
