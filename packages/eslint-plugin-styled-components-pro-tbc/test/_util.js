import plugin from "../dist/eslint-plugin-styled-components-pro.esm.js";
import { lint } from "../../../ops/helpers/linter.js";

// these two wrappers simplify the API, so that we don't need to pass the args
export const verifyAndFix = (str) =>
  lint(
    "verifyAndFix",
    str,
    {
      plugins: {
        "styled-components-pro": plugin,
      },
      rules: { "styled-components-pro/parses-ok": "error" },
    },
    "skipParserComparison",
  );

export const verify = (str) =>
  lint(
    "verify",
    str,
    {
      plugins: {
        "styled-components-pro": plugin,
      },
      rules: { "styled-components-pro/parses-ok": "error" },
    },
    "skipParserComparison",
  );
