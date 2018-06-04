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
        name: "jsonCombCore"
      },
      plugins: [
        strip({
          sourceMap: false
        }),
        resolve(),
        commonjs(), // so Rollup can convert deps to ES modules
        babel(),
        uglify()
      ]
    },

    // CommonJS build (for Node)
    {
      input: "src/main.js",
      output: [{ file: pkg.main, format: "cjs" }],
      external: [
        "check-types-mini",
        "lodash.clonedeep",
        "lodash.includes",
        "object-fill-missing-keys",
        "object-flatten-all-arrays",
        "object-merge-advanced",
        "object-no-new-keys",
        "object-set-all-values-to",
        "p-map",
        "p-one",
        "p-reduce",
        "sort-keys",
        "type-detect"
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
        "check-types-mini",
        "lodash.clonedeep",
        "lodash.includes",
        "object-fill-missing-keys",
        "object-flatten-all-arrays",
        "object-merge-advanced",
        "object-no-new-keys",
        "object-set-all-values-to",
        "p-map",
        "p-one",
        "p-reduce",
        "sort-keys",
        "type-detect"
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
