import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import uglify from "rollup-plugin-uglify";
import strip from "rollup-plugin-strip";
import babel from "rollup-plugin-babel";
import { minify } from "uglify-es";
import pkg from "./package.json";

export default commandLineArgs => {
  const finalConfig = [
    // Builds: CommonJS (for Node) and ES module (for bundlers)
    {
      input: "src/main.js",
      output: [
        { file: pkg.main, format: "cjs" },
        { file: pkg.module, format: "es" }
      ],
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
        babel()
      ]
    },

    // util.js needs transpiling as well:
    {
      input: "src/util.js",
      output: [{ file: "dist/util.cjs.js", format: "cjs" }],
      external: [
        "semver-compare",
        "lodash.clonedeep",
        "is-natural-number",
        "lodash.trim",
        "easy-replace",
        "emoji-regex"
      ],
      plugins: [
        strip({
          sourceMap: false
        }),
        babel()
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
