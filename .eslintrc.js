module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:vue/recommended",
    "plugin:compat/recommended",
    "plugin:prettier/recommended",
    "@vue/prettier"
  ],
  //extends: ["eslint:recommended", "plugin:vue/recommended", "@vue/prettier"],
  //extends: ["eslint:recommended", "plugin:vue/essential", "plugin:compat/recommended"],
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 10,
    sourceType: "module"
  },
  env: {
    browser: true,
    node: true
  },
  rules: {
    "no-console": 1
    //"no-extra-parens": 1,
    //semi: [1, "never"],
    //"prettier/prettier": "warn"
    //indent: ["warn", "tab"]
  }
}
