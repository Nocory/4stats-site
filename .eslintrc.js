module.exports = {
  "extends": [
    "eslint:recommended",
    "plugin:vue/essential",
    "plugin:compat/recommended",
  ],
  "parserOptions": {
    "parser": "babel-eslint",
    "ecmaVersion": 8,
    "sourceType": "module"
  },
  "env": {
    "browser": true,
    "node": true
  },
  "rules": {
    "no-console": 1,
    "no-extra-parens": 1,
    "semi": [1, "never"]
  }
}
