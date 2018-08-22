import builtins from "rollup-plugin-node-builtins";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import cleanup from "rollup-plugin-cleanup";
import strip from "rollup-plugin-strip";
import babel from "rollup-plugin-babel";
import json from "rollup-plugin-json";
import pkg from "./package.json";

export default commandLineArgs => {
  const finalConfig = [
    // browser-friendly UMD build
    {
      input: "src/main.js",
      output: {
        file: pkg.browser,
        format: "umd",
        name: "rangesEntDecode"
      },
      plugins: [
        strip({
          sourceMap: false
        }),
        builtins(),
        resolve(),
        json(),
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
        "check-types-mini",
        "he",
        "lodash.isplainobject",
        "ranges-merge"
      ],
      plugins: [
        strip({
          sourceMap: false
        }),
        builtins(),
        json(),
        babel(),
        cleanup()
      ]
    },

    // ES module build (for bundlers)
    {
      input: "src/main.js",
      output: [{ file: pkg.module, format: "es" }],
      external: [
        "check-types-mini",
        "he",
        "lodash.isplainobject",
        "ranges-merge"
      ],
      plugins: [
        strip({
          sourceMap: false
        }),
        builtins(),
        json(),
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
