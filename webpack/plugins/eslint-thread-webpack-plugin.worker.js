const { ESLint } = require("eslint");
const { codeFrameColumns } = require("@babel/code-frame");
const chalk = require("chalk");
const path = require("path");

async function checkTSX() {
  // 1. Create an instance with the `fix` option.
  const eslint = new ESLint({ fix: true });

  // 2. Lint files. This doesn't modify target files.
  const results = await eslint.lintFiles(
    path.join(process.cwd(), "src/**/*.{ts,tsx}")
  );

  // 3. Modify the files with the fixed code.
  // await ESLint.outputFixes(results);

  // 4. Format the results.
  const resultText = formatter(results);

  return resultText;
}

async function checkTS() {
  // 1. Create an instance with the `fix` option.
  const eslint = new ESLint({ fix: true });

  // 2. Lint files. This doesn't modify target files.
  const results = await eslint.lintFiles(
    path.join(process.cwd(), "src/**/*.ts")
  );

  // 3. Modify the files with the fixed code.
  // await ESLint.outputFixes(results);

  // 4. Format the results.
  const resultText = formatter(results);

  return resultText;
}
module.exports = {
  checkTS,
  checkTSX,
};

function formatter(/** @type {ESLint.LintResult[]} */ lintResults) {
  const results = [];
  for (const lintResult of lintResults) {
    if (!lintResult.errorCount) continue;

    lintResult.messages.forEach((item) => {
      const message =
        chalk.red(`ERROR in`) +
        " " +
        `${lintResult.filePath}` +
        "\n" +
        `${item.message}` +
        "\n" +
        codeFrameColumns(
          lintResult.source,
          {
            start: { line: item.line, column: item.column },
          },
          { forceColor: true }
        );
      results.push(message);
    });
  }

  return results;
}
