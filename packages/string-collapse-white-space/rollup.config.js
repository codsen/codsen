import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";
import cleanup from "rollup-plugin-cleanup";
import banner from "rollup-plugin-banner";
import babel from "@rollup/plugin-babel";
import strip from "@rollup/plugin-strip";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
import pkg from "./package.json";
import { resolve } from "path";

const licensePiece = `${pkg.name}
${pkg.description}
Version: ${pkg.version}
Author: Roy Revelt, Codsen Ltd
License: ${pkg.license}
Homepage: ${pkg.homepage}`;

const extensions = [".mjs", ".js", ".json", ".node", ".ts"];
const babelRuntimeVersion = pkg.dependencies["@babel/runtime"].replace(
  /^[^0-9]*/,
  ""
);

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join("|")})($|/)`);
  return (id) => pattern.test(id);
};

export default (commandLineArgs) => {
  const finalConfig = [
    // UMD Production
    {
      input: "src/main.ts",
      output: {
        file: pkg.browser,
        format: "umd",
        name: "stringCollapseWhiteSpace",
        indent: false,
      },
      plugins: [
        nodeResolve({
          extensions,
        }),
        json(),
        commonjs(),
        typescript({
          tsconfig: "../../tsconfig.build.json",
          declaration: false,
        }),
        babel({
          extensions,
          include: resolve("src", "**", "*.ts"),
          exclude: "node_modules/**",
          rootMode: "upward",
          babelHelpers: "bundled",
        }),
        replace({
          "process.env.NODE_ENV": JSON.stringify("production"),
        }),
        !commandLineArgs.dev &&
          strip({
            sourceMap: false,
            include: ["src/**/*.(js|ts)"],
            functions: ["console.*"],
          }),
        terser({
          compress: {
            pure_getters: true,
            unsafe: false,
            unsafe_comps: false,
            warnings: false,
          },
        }),
        banner(licensePiece),
      ],
    },

    // UMD development
    {
      input: "src/main.ts",
      output: {
        file: `dist/${pkg.name}.dev.umd.js`,
        format: "umd",
        name: "stringCollapseWhiteSpace",
        indent: false,
      },
      plugins: [
        nodeResolve({
          extensions,
        }),
        json(),
        typescript({
          tsconfig: "../../tsconfig.build.json",
          declaration: false,
        }),
        commonjs(),
        babel({
          extensions,
          include: resolve("src", "**", "*.ts"),
          exclude: "node_modules/**",
          rootMode: "upward",
          babelHelpers: "bundled",
        }),
        replace({
          "process.env.NODE_ENV": JSON.stringify("development"),
        }),
        !commandLineArgs.dev &&
          strip({
            sourceMap: false,
            include: ["src/**/*.(js|ts)"],
            functions: ["console.*"],
          }),
        banner(licensePiece),
      ],
    },

    // CommonJS
    {
      input: "src/main.ts",
      output: [
        { dir: "./", entryFileNames: pkg.main, format: "cjs", indent: false },
      ],
      external: makeExternalPredicate([
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
      ]),
      plugins: [
        nodeResolve({
          extensions,
        }),
        json(),
        typescript({
          tsconfig: "../../tsconfig.build.json",
          declaration: false,
        }),
        babel({
          extensions,
          rootMode: "upward",
          plugins: [
            [
              "@babel/plugin-transform-runtime",
              { version: babelRuntimeVersion },
            ],
          ],
          babelHelpers: "runtime",
        }),
        cleanup({ comments: "istanbul", extensions: ["js", "ts"] }),
        !commandLineArgs.dev &&
          strip({
            sourceMap: false,
            include: ["src/**/*.(js|ts)"],
            functions: ["console.*"],
          }),
        banner(licensePiece),
      ],
    },

    // ES
    {
      input: "src/main.ts",
      output: [{ file: pkg.module, format: "es", indent: false }],
      external: makeExternalPredicate([
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
      ]),
      plugins: [
        nodeResolve({
          extensions,
        }),
        json(),
        typescript({
          tsconfig: "../../tsconfig.build.json",
          declaration: false,
        }),
        babel({
          extensions,
          plugins: [
            [
              "@babel/plugin-transform-runtime",
              { version: babelRuntimeVersion, useESModules: true },
            ],
          ],
          babelHelpers: "runtime",
        }),
        cleanup({ comments: "istanbul", extensions: ["js", "ts"] }),
        !commandLineArgs.dev &&
          strip({
            sourceMap: false,
            include: ["src/**/*.(js|ts)"],
            functions: ["console.*"],
          }),
        banner(licensePiece),
      ],
    },

    // Type definitions
    {
      input: "src/main.ts",
      output: [{ file: "types/index.d.ts", format: "es" }],
      plugins: [json(), dts()],
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
