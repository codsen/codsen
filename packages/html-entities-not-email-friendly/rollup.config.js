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
        name: "htmlEntitiesNotEmailFriendly",
      },
      plugins: [
        strip({
          sourceMap: false,
        }),
        resolve(),
        json(),
        commonjs(),
        babel(),
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
        name: "htmlEntitiesNotEmailFriendly",
      },
      plugins: [
        strip({
          sourceMap: false,
        }),
        resolve(),
        json(),
        commonjs(),
        babel(),
        banner(licensePiece),
      ],
    },

    // CommonJS build (for Node)
    {
      input: "src/main.js",
      output: [{ file: pkg.main, format: "cjs" }],
      external: [],
      plugins: [
        strip({
          sourceMap: false,
        }),
        json(),
        babel(),
        cleanup({ comments: "istanbul" }),
        banner(licensePiece),
      ],
    },

    // ES module build (for bundlers)
    {
      input: "src/main.js",
      output: [{ file: pkg.module, format: "es" }],
      external: [],
      plugins: [
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
    // if rollup was called without a --dev flag,
    // dispose of a comment removal, strip():
    finalConfig.forEach((singleConfigVal, i) => {
      finalConfig[i].plugins.shift();
    });
    // https://github.com/rollup/rollup/issues/2694#issuecomment-463915954
    delete commandLineArgs.dev;

    // don't build minified UMD in dev, it takes too long
    finalConfig.shift();
  }
  return finalConfig;
};
