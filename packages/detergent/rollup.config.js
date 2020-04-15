import builtins from "rollup-plugin-node-builtins";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import cleanup from "rollup-plugin-cleanup";
import banner from "rollup-plugin-banner";
import strip from "@rollup/plugin-strip";
import babel from "rollup-plugin-babel";
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
        name: "detergent",
      },
      plugins: [
        strip({
          sourceMap: false,
        }),
        builtins(),
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
        name: "detergent",
      },
      plugins: [
        strip({
          sourceMap: false,
        }),
        builtins(),
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
      external: [
        "all-named-html-entities",
        "ansi-regex",
        "he",
        "html-entities-not-email-friendly",
        "ranges-apply",
        "ranges-invert",
        "ranges-process-outside",
        "ranges-push",
        "string-apostrophes",
        "string-collapse-white-space",
        "string-fix-broken-named-entities",
        "string-left-right",
        "string-range-expander",
        "string-remove-widows",
        "string-strip-html",
        "string-trim-spaces-only",
      ],
      plugins: [
        strip({
          sourceMap: false,
        }),
        builtins(),
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
      external: [
        "all-named-html-entities",
        "ansi-regex",
        "he",
        "html-entities-not-email-friendly",
        "ranges-apply",
        "ranges-invert",
        "ranges-process-outside",
        "ranges-push",
        "string-apostrophes",
        "string-collapse-white-space",
        "string-fix-broken-named-entities",
        "string-left-right",
        "string-range-expander",
        "string-remove-widows",
        "string-strip-html",
        "string-trim-spaces-only",
      ],
      plugins: [
        strip({
          sourceMap: false,
        }),
        builtins(),
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
