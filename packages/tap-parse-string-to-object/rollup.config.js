import builtins from "rollup-plugin-node-builtins";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import cleanup from "rollup-plugin-cleanup";
import banner from "rollup-plugin-banner";
import strip from "@rollup/plugin-strip";
import babel from "rollup-plugin-babel";
import pkg from "./package.json";

const licensePiece = `${pkg.name}
${pkg.description}
Version: ${pkg.version}
Author: Roy Revelt, Codsen Ltd
License: ${pkg.license}
Homepage: ${pkg.homepage}`;

export default (commandLineArgs) => {
  const finalConfig = [
    // browser-friendly UMD build
    {
      input: "src/main.js",
      output: {
        file: pkg.browser,
        format: "umd",
        name: "tapParseStringToObject",
      },
      plugins: [
        strip({
          sourceMap: false,
        }),
        builtins(),
        resolve(),
        commonjs(),
        babel(),
        terser(),
        banner(licensePiece),
      ],
    },

    // CommonJS build (for Node)
    {
      input: "src/main.js",
      output: [{ file: pkg.main, format: "cjs" }],
      external: ["isstream", "split2", "through2"],
      plugins: [
        strip({
          sourceMap: false,
        }),
        builtins(),
        babel(),
        cleanup({ comments: "istanbul" }),
        banner(licensePiece),
      ],
    },

    // ES module build (for bundlers)
    {
      input: "src/main.js",
      output: [{ file: pkg.module, format: "es" }],
      external: ["isstream", "split2", "through2"],
      plugins: [
        strip({
          sourceMap: false,
        }),
        builtins(),
        cleanup({ comments: "istanbul" }),
        banner(licensePiece),
      ],
    },

    // util.js build:
    {
      input: "src/util.js",
      output: [{ file: "dist/util.cjs.js", format: "cjs" }],
      external: [],
      plugins: [
        strip({
          sourceMap: false,
        }),
        builtins(),
        resolve(),
        cleanup({ comments: "istanbul" }),
      ],
    },
  ];

  if (commandLineArgs.dev) {
    // if rollup was called without a --dev flag,
    // dispose of a comment removal, strip():
    finalConfig.forEach((singleConfigVal, i) => {
      finalConfig[i].plugins.shift();
    });
    // https://github.com/rollup/rollup/issues/2694#issuecomment-463915954
    delete commandLineArgs.dev;
  }
  return finalConfig;
};
