import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import uglify from "rollup-plugin-uglify";
import strip from "rollup-plugin-strip";
import babel from "rollup-plugin-babel";
import { minify } from "uglify-es";
import pkg from "./package.json";

export default commandLineArgs => {
  const finalConfig = [
    // browser-friendly UMD build
    {
      input: "src/main.js",
      output: {
        file: pkg.browser,
        format: "umd",
        name: "strFindHeadsTails"
      },
      plugins: [
        strip({
          sourceMap: false
        }),
        resolve(), // so Rollup can find deps
        commonjs(), // so Rollup can convert deps to ES modules
        babel(),
        uglify({}, minify)
      ]
    },

    // Builds: CommonJS (for Node) and ES module (for bundlers)
    {
      input: "src/main.js",
      output: [
        { file: pkg.main, format: "cjs" },
        { file: pkg.module, format: "es" }
      ],
      external: [
        "arrayiffy-if-string",
        "check-types-mini",
        "is-natural-number",
        "is-natural-number-string",
        "lodash.includes",
        "lodash.isplainobject",
        "ordinal-number-suffix",
        "string-match-left-right"
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
    // if rollup was called with a --dev flag, remove comment removal, strip():
    finalConfig[0].plugins.shift();
    finalConfig[1].plugins.shift();
  }
  return finalConfig;
};
