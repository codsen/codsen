import testNum from "../dist/eslint-plugin-test-num.esm.js";
import { lint } from "../../../ops/helpers/linter.js";

// these two wrappers simplify the API, so that we don't need to pass the args

export const verifyAndFix = (str) =>
  lint("verifyAndFix", str, {
    rules: { "test-num/correct-test-num": "error" },
    plugins: {
      "test-num": testNum,
    },
  });

export const verify = (str) =>
  lint("verify", str, {
    rules: { "test-num/correct-test-num": "error" },
    plugins: {
      "test-num": testNum,
    },
  });
