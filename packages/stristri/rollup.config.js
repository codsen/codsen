import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import cleanup from "rollup-plugin-cleanup";
import banner from "rollup-plugin-banner";
import babel from "@rollup/plugin-babel";
import strip from "@rollup/plugin-strip";
import json from "@rollup/plugin-json";
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
        name: "stristri",
      },
      plugins: [
        !commandLineArgs.dev &&
          strip({
            sourceMap: false,
          }),
        resolve(),
        json(),
        commonjs(),
        babel({
          rootMode: "upward",
        }),
        terser(),
        banner(licensePiece),
      ],
    },

    // browser-friendly UMD build, non-minified, for dev purposes
    {
      input: "src/main.js",
      output: {
        file: `dist/${pkg.name}.dev.umd.js`,
        format: "umd",
        name: "stristri",
      },
      plugins: [
        !commandLineArgs.dev &&
          strip({
            sourceMap: false,
          }),
        resolve(),
        json(),
        commonjs(),
        babel({
          rootMode: "upward",
        }),
        banner(licensePiece),
      ],
    },

    // CommonJS build (for Node)
    {
      input: "src/main.js",
      output: [{ file: pkg.main, format: "cjs" }],
      external: [
        "codsen-tokenizer",
        "detect-templating-language",
        "ranges-apply",
        "ranges-merge",
        "string-collapse-white-space",
      ],
      plugins: [
        !commandLineArgs.dev &&
          strip({
            sourceMap: false,
          }),
        json(),
        babel({
          rootMode: "upward",
        }),
        cleanup({ comments: "istanbul" }),
        banner(licensePiece),
      ],
    },

    // ES module build (for bundlers)
    {
      input: "src/main.js",
      output: [{ file: pkg.module, format: "es" }],
      external: [
        "codsen-tokenizer",
        "detect-templating-language",
        "ranges-apply",
        "ranges-merge",
        "string-collapse-white-space",
      ],
      plugins: [
        !commandLineArgs.dev &&
          strip({
            sourceMap: false,
          }),
        json(),
        cleanup({ comments: "istanbul" }),
        banner(licensePiece),
      ],
    },
  ];

  if (commandLineArgs.dev) {
    // don't build minified UMD in dev, it takes too long
    finalConfig.shift();
  }

  // clean up this custom "dev" flag, otherwise Rollup will complain
  // https://github.com/rollup/rollup/issues/2694#issuecomment-463915954
  delete commandLineArgs.dev;
  return finalConfig;
};
