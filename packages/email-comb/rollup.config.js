import builtins from "rollup-plugin-node-builtins";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import cleanup from "rollup-plugin-cleanup";
import license from "rollup-plugin-license";
import strip from "rollup-plugin-strip";
import babel from "rollup-plugin-babel";
import pkg from "./package.json";

const licensePiece = `${pkg.name}
${pkg.description}
Version: ${pkg.version}
Author: Roy Revelt, Codsen Ltd
License: ${pkg.license}
Homepage: ${pkg.homepage}`;

export default commandLineArgs => {
  const finalConfig = [
    // browser-friendly UMD build
    {
      input: "src/main.js",
      output: {
        file: pkg.browser,
        format: "umd",
        name: "emailComb"
      },
      plugins: [
        strip({
          sourceMap: false
        }),
        builtins(),
        resolve(),
        commonjs(),
        babel(),
        terser(),
        license({
          banner: licensePiece
        })
      ]
    },

    // CommonJS build (for Node)
    {
      input: "src/main.js",
      output: [{ file: pkg.main, format: "cjs" }],
      external: [
        "array-pull-all-with-glob",
        "ast-is-empty",
        "lodash.intersection",
        "lodash.isplainobject",
        "lodash.pullall",
        "lodash.uniq",
        "matcher",
        "ranges-apply",
        "ranges-push",
        "regex-empty-conditional-comments",
        "string-extract-class-names",
        "string-match-left-right",
        "string-range-expander"
      ],
      plugins: [
        strip({
          sourceMap: false
        }),
        builtins(),
        babel(),
        cleanup(),
        license({
          banner: licensePiece
        })
      ]
    },

    // ES module build (for bundlers)
    {
      input: "src/main.js",
      output: [{ file: pkg.module, format: "es" }],
      external: [
        "array-pull-all-with-glob",
        "ast-is-empty",
        "lodash.intersection",
        "lodash.isplainobject",
        "lodash.pullall",
        "lodash.uniq",
        "matcher",
        "ranges-apply",
        "ranges-push",
        "regex-empty-conditional-comments",
        "string-extract-class-names",
        "string-match-left-right",
        "string-range-expander"
      ],
      plugins: [
        strip({
          sourceMap: false
        }),
        builtins(),
        cleanup(),
        license({
          banner: licensePiece
        })
      ]
    },

    // util.js build:
    {
      input: "src/util.js",
      output: [{ file: "dist/util.esm.js", format: "es" }],
      external: [],
      plugins: [
        strip({
          sourceMap: false
        }),
        builtins(),
        resolve(),
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
