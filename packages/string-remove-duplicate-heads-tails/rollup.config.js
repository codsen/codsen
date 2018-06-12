import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";
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
        name: "stringRemoveDuplicateHeadsTails"
      },
      plugins: [
        strip({
          sourceMap: false
        }),
        resolve(),
        commonjs(),
        babel(),
        uglify()
      ]
    },

    // CommonJS build (for Node)
    {
      input: "src/main.js",
      output: [{ file: pkg.main, format: "cjs" }],
      external: [
        "arrayiffy-if-string",
        "check-types-mini",
        "lodash.isplainobject",
        "string-match-left-right",
        "string-replace-slices-array",
        "string-slices-array-push",
        "string-trim-spaces-only"
      ],
      plugins: [
        strip({
          sourceMap: false
        }),
        babel()
      ]
    },

    // ES module build (for bundlers)
    {
      input: "src/main.js",
      output: [{ file: pkg.module, format: "es" }],
      external: [
        "arrayiffy-if-string",
        "check-types-mini",
        "lodash.isplainobject",
        "string-match-left-right",
        "string-replace-slices-array",
        "string-slices-array-push",
        "string-trim-spaces-only"
      ],
      plugins: [
        strip({
          sourceMap: false
        })
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
