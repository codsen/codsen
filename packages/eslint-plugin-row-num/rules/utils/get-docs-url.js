const path = require("path");
const packageJson = require("../../package");

const repoUrl = "https://gitlab.com/codsen/codsen/eslint-plugin-row-num";

module.exports = filename => {
  const ruleName = path.basename(filename, ".js");
  return `${repoUrl}/blob/v${packageJson.version}/docs/rules/${ruleName}.md`;
};
