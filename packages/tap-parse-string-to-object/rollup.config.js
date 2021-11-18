import builtins from "rollup-plugin-node-builtins";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import cleanup from "rollup-plugin-cleanup";
import banner from "rollup-plugin-banner";
import babel from "@rollup/plugin-babel";
import strip from "@rollup/plugin-strip";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
import pkg from "./package.json";
import { resolve } from "path";

const licensePiece = `@name ${pkg.name}
@fileoverview ${pkg.description}
@version ${pkg.version}
@author Roy Revelt, Codsen Ltd
@license ${pkg.license}
{@link ${pkg.homepage}}`;

const extensions = [".mjs", ".js", ".json", ".node", ".ts"];

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join("|")})($|/)`);
  return (id) => pattern.test(id);
};

export default (commandLineArgs = {}) => {
  const finalConfig = [
    // ES
    {
      input: "src/main.ts",
      output: [
        { file: `dist/${pkg.name}.esm.js`, format: "es", indent: false },
      ],
      external: makeExternalPredicate([
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
      ]),
      plugins: [
        builtins(),
        nodeResolve({
          extensions,
        }),
        json(),
        typescript({
          tsconfig: "../../tsconfig.build.json",
          declaration: false,
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

  // clean up this custom "dev" flag, otherwise Rollup will complain
  // https://github.com/rollup/rollup/issues/2694#issuecomment-463915954
  delete commandLineArgs.dev;
  return finalConfig;
};
