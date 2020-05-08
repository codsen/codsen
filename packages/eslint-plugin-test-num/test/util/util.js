import fs from "fs";

// we need to escape to prevent accidental "fixing" of this file through
// build scripts
const letterC = "\x63";
const backtick = "\x60";
const dollar = "\x24";
const backslash = "\x24";

// a common config for linter.verifyAndFix()
const c = {
  parserOptions: { ecmaVersion: 11 },
  rules: {
    "test-num/correct-test-num": "error",
  },
};

const read = (what) => {
  return fs.readFileSync(`test/fixtures/${what}.zz`, "utf8");
};

export { c, read, letterC, backtick, dollar, backslash };
