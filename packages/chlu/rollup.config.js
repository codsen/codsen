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
    // CommonJS build (for Node)
    {
      input: "src/main.js",
      output: [{ file: pkg.main, format: "cjs" }],
      external: [
        "ast-contains-only-empty-space",
        "dehumanize-date",
        "easy-replace",
        "emoji-regex",
        "get-pkg-repo",
        "is-natural-number",
        "just-insert",
        "lodash.clonedeep",
        "lodash.includes",
        "lodash.isplainobject",
        "lodash.min",
        "lodash.reverse",
        "lodash.trim",
        "semver-compare",
        "split-lines"
      ],
      plugins: [
        strip({
          sourceMap: false
        }),
        builtins(),
        json(),
        babel()
      ]
    },

    // ES module build (for bundlers)
    {
      input: "src/main.js",
      output: [{ file: pkg.module, format: "es" }],
      external: [
        "ast-contains-only-empty-space",
        "dehumanize-date",
        "easy-replace",
        "emoji-regex",
        "get-pkg-repo",
        "is-natural-number",
        "just-insert",
        "lodash.clonedeep",
        "lodash.includes",
        "lodash.isplainobject",
        "lodash.min",
        "lodash.reverse",
        "lodash.trim",
        "semver-compare",
        "split-lines"
      ],
      plugins: [
        strip({
          sourceMap: false
        }),
        builtins(),
        json()
      ]
    },

    // util.js build:
    {
      input: "src/util.js",
      output: [{ file: "dist/util.esm.js", format: "es" }],
      external: [
        "easy-replace",
        "emoji-regex",
        "is-natural-number",
        "lodash.clonedeep",
        "lodash.isplainobject",
        "lodash.trim",
        "semver-compare"
      ],
      plugins: [
        strip({
          sourceMap: false
        }),
        builtins(),
        resolve(),
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
