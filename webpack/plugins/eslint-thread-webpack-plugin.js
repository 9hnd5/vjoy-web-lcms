/** @typedef {import('webpack').Compiler} Compiler */
/** @typedef {import('webpack').Compilation} Compilation */
const Piscina = require("piscina");
const path = require("path");
const fs = require("fs/promises");
const chalk = require("chalk");

const worker = new Piscina({
  filename: path.join(__dirname, "eslint-thread-webpack-plugin.worker.js"),
});

class ESLintThreadWebpackPlugin {
  initialized = false;
  done = false;
  apply(/** @type {Compiler} */ compiler) {
    const name = ESLintThreadWebpackPlugin.name;
    const hooks = compiler.hooks;

    const errorHandle = (/** @type {Compilation} */ compilation) => {
      return async (errors) => {
        if (errors.length) {
          const t = setInterval(() => {
            if (!this.done) return;
            //Log error to console
            errors.forEach((e) => {
              console.log(e);
            });
            console.log(
              `Found ${chalk.red(errors.length, `error`)} in ${
                worker.runTime.min
              } ms`
            );
            //Report to devServer
            if (this.devServerDoneTap) {
              compilation.errors.push(...errors);
              this.devServerDoneTap.fn(compilation.getStats());
            }
            //Remove dist folder if any invalid
            fs.rm(path.join(process.cwd(), "dist"), {
              recursive: true,
              force: true,
            }).then(() => {});

            this.done = false;
            clearInterval(t);
          }, 10);
        }
      };
    };

    hooks.done.intercept({
      register: (tap) => {
        if (tap.name === "webpack-dev-server" && tap.type === "sync") {
          this.devServerDoneTap = tap;
        }
        return tap;
      },
    });

    hooks.run.tap(name, () => {
      hooks.compilation.tap(name, (compilation) => {
        if (compilation.compiler !== compiler) return;
        worker
          .run({}, { name: "checkTSX" })
          .then(errorHandle.apply(this, [compilation]));
        return;
      });

      //Determine final log was emited by webpack using this hooks.
      //So we can guarantee our error message will be the last
      hooks.infrastructureLog.tap(name, (name, type, args) => {
        if (
          name === "webpack-cli" &&
          type === "log" &&
          args[0] === "Compiler finished"
        ) {
          this.done = true;
        }
      });
    });

    //Register hook for webpack dev server
    hooks.watchRun.tap(name, (c) => {
      if (!this.initialized) {
        this.initialized = true;
        hooks.compilation.tap(name, (compilation) => {
          if (compilation.compiler !== c) return;
          this.done = false;
          //Start worker for checking issue
          worker
            .run({}, { name: "checkTSX" })
            .then(errorHandle.apply(this, [compilation]));
          return;
        });

        //Determine final log was emited by webpack using this hooks.
        //So we can guarantee our error message will be the last
        hooks.infrastructureLog.tap(name, (name, type, args) => {
          if (
            name === "webpack-cli" &&
            type === "log" &&
            args[0] === "Compiler is watching files for updates..."
          ) {
            this.done = true;
          }
        });
      }
    });

    hooks.done.tap(name, (stats) => {
      //Prevent webpack log error to console
      stats.compilation.errors.length = 0;
    });
  }
}

module.exports = ESLintThreadWebpackPlugin;
