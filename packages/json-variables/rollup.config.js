import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import cleanup from "rollup-plugin-cleanup";
import strip from "rollup-plugin-strip";
import babel from "rollup-plugin-babel";
import pkg from "./package.json";

export default commandLineArgs => {
  const finalConfig = [
    // browser-friendly UMD build
    {
      input: "src/main.js",
      output: {
        file: pkg.browser,
        format: "umd",
        name: "jsonVariables"
      },
      plugins: [
        strip({
          sourceMap: false
        }),
        resolve(),
        commonjs(),
        babel(),
        terser()
      ]
    },

    // CommonJS build (for Node)
    {
      input: "src/main.js",
      output: [{ file: pkg.main, format: "cjs" }],
      external: [
        "arrayiffy-if-string",
        "ast-get-values-by-key",
        "ast-monkey-traverse",
        "check-types-mini",
        "lodash.clonedeep",
        "lodash.isplainobject",
        "matcher",
        "object-path",
        "ranges-apply",
        "ranges-push",
        "string-find-heads-tails",
        "string-match-left-right",
        "string-remove-duplicate-heads-tails"
      ],
      plugins: [
        strip({
          sourceMap: false
        }),
        babel(),
        cleanup()
      ]
    },

    // ES module build (for bundlers)
    {
      input: "src/main.js",
      output: [{ file: pkg.module, format: "es" }],
      external: [
        "arrayiffy-if-string",
        "ast-get-values-by-key",
        "ast-monkey-traverse",
        "check-types-mini",
        "lodash.clonedeep",
        "lodash.isplainobject",
        "matcher",
        "object-path",
        "ranges-apply",
        "ranges-push",
        "string-find-heads-tails",
        "string-match-left-right",
        "string-remove-duplicate-heads-tails"
      ],
      plugins: [
        strip({
          sourceMap: false
        }),
        cleanup()
      ]
    }
  ];

  if (commandLineArgs.dev) {
    // if rollup was called without a --dev flag,
    // dispose of a comment removal, strip():
    finalConfig.forEach((singleConfigVal, i) => {
      finalConfig[i].plugins.shift();
    });
  }
  return finalConfig;
};
