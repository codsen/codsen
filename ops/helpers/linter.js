import { Linter } from "eslint";
import { equal } from "uvu/assert";
import * as parser from "@typescript-eslint/parser";

export function lint(method, str, config, skipParserComparison = false) {
  if (typeof str !== "string") {
    throw new TypeError(
      "ops/helpers/linter.js/main(): first arg must be string!",
    );
  }
  let { rules, plugins } = config;
  let linter = new Linter({
    configType: "flat",
  });

  // ensure that TS parser's result is the same
  if (!skipParserComparison && method === "verifyAndFix") {
    equal(
      linter.verifyAndFix(
        str,
        {
          plugins,
          rules,
          languageOptions: {
            parser,
          },
        },
        { filename: "foo.js" },
      ),
      linter.verifyAndFix(
        str,
        {
          plugins,
          rules,
        },
        { filename: "foo.js" },
      ),
      `${method}(): the output of ESLint on TS parser is not the same as native esprima's!`,
    );

    // now just return the output
    return linter.verifyAndFix(
      str,
      {
        plugins,
        rules,
        languageOptions: {
          parser,
        },
      },
      { filename: "foo.js" },
    );
  } else {
    if (!skipParserComparison) {
      equal(
        linter.verify(
          str,
          {
            plugins,
            rules,
            languageOptions: {
              parser,
            },
          },
          { filename: "foo.js" },
        ).output,
        linter.verify(
          str,
          {
            plugins,
            rules,
          },
          { filename: "foo.js" },
        ).output,
        `${method}(): the output of ESLint on TS parser is not the same as native esprima's!`,
      );
    }

    // now just return the output
    return linter.verify(
      str,
      {
        plugins,
        rules,
        languageOptions: {
          parser,
        },
      },
      { filename: "foo.js" },
    );
  }
}
