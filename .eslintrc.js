module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: { project: ["./tsconfig.json"] },
  settings: {
    react: {
      version: "detect",
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
  },
  ignorePatterns: [
    ".eslintrc.js",
    "webpack/",
    "env.*",
    "src/assets",
    "src/*.css",
    "src/*.html",
    "eslint*",
  ],
  extends: [
    "eslint:recommended", //eslint-plugin-import
    "plugin:import/recommended", //eslint-plugin-import
    "plugin:import/typescript", //eslint-plugin-import
    "plugin:react/recommended", //eslint-plugin-react
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended", //eslint-plugin-react-hooks
  ],
  rules: {
    "no-unused-vars": "off",
    "no-empty": "off",
    "import/no-named-as-default-member": "off",
    "import/no-named-as-default": "off",
    "no-redeclare": "off",
    "@typescript-eslint/no-redeclare": ["error"],
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react/prop-types": "off",
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
  },
};
