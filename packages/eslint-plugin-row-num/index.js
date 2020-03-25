const path = require("path");
const importModules = require("import-modules");

module.exports = {
  configs: {
    recommended: {
      plugins: ["row-num"],
      rules: {
        "no-console": "off",
        "row-num/correct-row-num": "error",
      },
    },
  },
  rules: importModules(path.resolve(__dirname, "rules"), { camelize: false }),
};
