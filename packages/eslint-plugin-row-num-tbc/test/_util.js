import rowNum from "../dist/eslint-plugin-row-num.esm.js";
import { lint } from "../../../ops/helpers/linter.js";

// these two wrappers simplify the API, so that we don't need to pass the args

export const verifyAndFix = (str) =>
  lint("verifyAndFix", str, {
    rules: { "row-num/correct-row-num": "error" },
    plugins: {
      "row-num": rowNum,
    },
  });

export const verify = (str) =>
  lint("verify", str, {
    rules: { "row-num/correct-row-num": "error" },
    plugins: {
      "row-num": rowNum,
    },
  });
