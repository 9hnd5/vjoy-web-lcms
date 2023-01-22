const path = require("path");
const { merge } = require("webpack-merge");
const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintThreadWebpackPlugin = require("./plugins/eslint-thread-webpack-plugin");

//Get config base on env build
function getEnvConfig(env) {
  if (env === "prod" || env === "dev") {
    return require(path.join(__dirname, `./webpack.${env}.js`));
  } else {
    return require(path.join(__dirname, `./webpack.prod.js`));
  }
}

module.exports = ({ env }) => {
  const envConfig = getEnvConfig(env);

  const envVars = require(path.join(process.cwd(), `env/${env}`));

  const commonConfig = {
    entry: path.join(process.cwd(), "src/index.tsx"),

    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      modules: [path.join(process.cwd(), "src"), "node_modules"],
    },
    performance: {
      hints: false,
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
          test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
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
      new webpack.DefinePlugin({
        ENV: JSON.stringify(envVars),
      }),
      new HtmlWebpackPlugin({
        template: path.join(process.cwd(), "src/index.html"),
        favicon: path.join(process.cwd(), "src/assets/favicon.ico"),
        title: "LCMS",
      }),
      new ForkTsCheckerWebpackPlugin(),
      new ESLintThreadWebpackPlugin(),
      new webpack.ProgressPlugin({ profile: true }),
    ],
  };

  const finalConfig = merge(envConfig, commonConfig);

  return finalConfig;
};
