import builtins from "rollup-plugin-node-builtins";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";
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
        name: "stringStripHtml"
      },
      plugins: [
        strip({
          sourceMap: false
        }),
        builtins(),
        resolve(), // so Rollup can find deps
        json(),
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
        "ent",
        "lodash.isplainobject",
        "lodash.trim",
        "string-replace-slices-array",
        "string-slices-array-push"
      ],
      plugins: [
        strip({
          sourceMap: false
        }),
        json(),
        babel()
      ]
    },

    // ES module build (for bundlers)
    {
      input: "src/main.js",
      output: [{ file: pkg.module, format: "es" }],
      external: [
        "check-types-mini",
        "ent",
        "lodash.isplainobject",
        "lodash.trim",
        "string-replace-slices-array",
        "string-slices-array-push"
      ],
      plugins: [
        strip({
          sourceMap: false
        }),
        json()
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
