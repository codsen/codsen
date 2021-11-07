import { promises as fs } from "fs";
import path from "path";
import objectPath from "object-path";
import camelCase from "lodash.camelcase";
import writeFileAtomic from "write-file-atomic";

// writes rollup.config.js
async function rollupConfig({ state }) {
  // bail early if it's a CLI
  if (!state.isRollup) {
    fs.unlink(path.resolve("rollup.config.js"))
      .then(() => {
        console.log(
          `lect rollup.config.js ${`\u001b[${31}m${"DELETED"}\u001b[${39}m`}`
        );
      })
      .catch(() => Promise.resolve(null));
    fs.unlink(path.resolve("tsconfig.json"))
      .then(() => {
        console.log(
          `lect tsconfig.json ${`\u001b[${31}m${"DELETED"}\u001b[${39}m`}`
        );
      })
      .catch(() => Promise.resolve(null));

    return Promise.resolve(null);
  }

  let defaultUmdBit = "";
  if (objectPath.has(state.pack, "exports.script")) {
    defaultUmdBit = `
    // UMD Production
    {
      input: "src/main.ts",
      output: {
        file: \`dist/$\{pkg.name}.umd.js\`,
        format: "umd",
        name: "${camelCase(state.pack.name)}",
        indent: false,
      },
      plugins: [
        ${
          state.pack.devDependencies["rollup-plugin-node-builtins"]
            ? "builtins(),\n        "
            : ""
        }nodeResolve({
          extensions,
        })${
          state.pack.devDependencies["rollup-plugin-node-globals"]
            ? ",\n        globals()"
            : ""
        }${
      state.pack.devDependencies["@rollup/plugin-json"]
        ? ",\n        json()"
        : ""
    }${
      state.pack.devDependencies["rollup-plugin-node-polyfills"]
        ? ",\n        nodePolyfills()"
        : ""
    },
        commonjs(),
        typescript({
          ${
            state.pack.devDependencies["ts-transformer-keys"] ||
            state.pack.dependencies["ts-transformer-keys"]
              ? `transformers: {
            before: [
              {
                type: "program",
                factory: (program) => {
                  return keysTransformer(program);
                },
              },
            ],
            after: [],
          },
              `
              : ""
          }tsconfig: "../../tsconfig.build.json",
          declaration: false,
        }),
        babel({
          extensions,
          include: resolve("src", "**", "*.ts"),
          exclude: "node_modules/**",
          rootMode: "upward",
          babelHelpers: "bundled",
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
`;
  }

  let defaultESMBit = "";
  if (objectPath.has(state.pack, "exports")) {
    defaultESMBit = `
    // ES
    {
      input: "src/main.ts",
      output: [{ file: \`dist/$\{pkg.name}.esm.js\`, format: "es", indent: false }],
      external: makeExternalPredicate([
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
      ]),
      plugins: [
        ${
          state.pack.devDependencies["rollup-plugin-node-builtins"]
            ? "builtins(),\n        "
            : ""
        }nodeResolve({
          extensions,
        })${
          state.pack.devDependencies["rollup-plugin-node-globals"]
            ? ",\n        globals()"
            : ""
        }${
      state.pack.devDependencies["@rollup/plugin-json"]
        ? ",\n        json()"
        : ""
    },
        typescript({
          ${
            state.pack.devDependencies["ts-transformer-keys"] ||
            state.pack.dependencies["ts-transformer-keys"]
              ? `transformers: {
            before: [
              {
                type: "program",
                factory: (program) => {
                  return keysTransformer(program);
                },
              },
            ],
            after: [],
          },
              `
              : ""
          }tsconfig: "../../tsconfig.build.json",
          declaration: false,
        }),
        babel({
          extensions,
          plugins: [
            [
              "@babel/plugin-transform-runtime",
              { useESModules: true },
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
`;
  }

  let defaultDefinitions = "";
  if (objectPath.has(state.pack, "exports")) {
    defaultDefinitions = `
    // Type definitions
    {
      input: "src/main.ts",
      output: [{ file: "types/index.d.ts", format: "es" }],
      plugins: [${
        state.pack.devDependencies["@rollup/plugin-json"] ? "json(), " : ""
      }dts()],
    },
`;
  }

  const newRollupConfig = `${
    state.pack.devDependencies["rollup-plugin-node-builtins"]
      ? `import builtins from "rollup-plugin-node-builtins";\n`
      : ""
  }${
    state.pack.devDependencies["rollup-plugin-node-globals"]
      ? `import globals from "rollup-plugin-node-globals";\n`
      : ""
  }${
    state.pack.devDependencies["rollup-plugin-node-polyfills"]
      ? `import nodePolyfills from "rollup-plugin-node-polyfills";\n`
      : ""
  }${
    state.pack.devDependencies["ts-transformer-keys"] ||
    state.pack.dependencies["ts-transformer-keys"]
      ? `import keysTransformer from "ts-transformer-keys/transformer";\n`
      : ""
  }import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import cleanup from "rollup-plugin-cleanup";
import banner from "rollup-plugin-banner";
import babel from "@rollup/plugin-babel";
import strip from "@rollup/plugin-strip";
${
  state.pack.devDependencies["@rollup/plugin-json"]
    ? `import json from "@rollup/plugin-json";\n`
    : ""
}import dts from "rollup-plugin-dts";
import pkg from "./package.json";
import { resolve } from "path";

const licensePiece = \`@name \${pkg.name}
@fileoverview \${pkg.description}
@version \${pkg.version}
@author Roy Revelt, Codsen Ltd
@license \${pkg.license}
{@link \${pkg.homepage}}\`;

const extensions = [".mjs", ".js", ".json", ".node", ".ts"];

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(\`^(\${externalArr.join("|")})($|/)\`);
  return (id) => pattern.test(id);
};

export default (commandLineArgs = {}) => {
  const finalConfig = [${defaultUmdBit}${defaultESMBit}${defaultDefinitions}  ];

  // clean up this custom "dev" flag, otherwise Rollup will complain
  // https://github.com/rollup/rollup/issues/2694#issuecomment-463915954
  delete commandLineArgs.dev;
  return finalConfig;
};
`;

  try {
    await writeFileAtomic("rollup.config.js", newRollupConfig);
    return Promise.resolve(null);
  } catch (err) {
    console.log(`lect: could not write rollup.config.js - ${err}`);
    return Promise.reject(err);
  }
}

export default rollupConfig;
