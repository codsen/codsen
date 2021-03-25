const fs = require("fs").promises;
const path = require("path");
const objectPath = require("object-path");
const camelCase = require("lodash.camelcase");
const writeFileAtomic = require("write-file-atomic");

// writes rollup.config.js
async function rollupConfig({ state }) {
  // bail early if it's a CLI
  if (state.isCLI) {
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
  if (objectPath.has(state.pack, "browser")) {
    defaultUmdBit = `
    // UMD Production
    {
      input: "src/main.ts",
      output: {
        file: pkg.browser,
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
`;
  }

  // notice terser() is absent:
  let defaultDevUmdBit = "";
  if (objectPath.has(state.pack, "browser")) {
    defaultDevUmdBit = `
    // UMD development
    {
      input: "src/main.ts",
      output: {
        file: \`dist/\${pkg.name}.dev.umd.js\`,
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
`;
  }

  // Partial solution to put definitions into types/ folder:
  // https://github.com/rollup/plugins/issues/61#issuecomment-597090769
  // tldr: use "dir" and "entryFileNames" instead of usual "file"
  let defaultCommonJSBit = "";
  if (objectPath.has(state.pack, "main")) {
    defaultCommonJSBit = `
    // CommonJS
    {
      input: "src/main.ts",
      output: [{ dir: "./", entryFileNames: pkg.main, format: "cjs", indent: false }],
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
`;
  }

  let defaultESMBit = "";
  if (objectPath.has(state.pack, "module")) {
    defaultESMBit = `
    // ES
    {
      input: "src/main.ts",
      output: [{ file: pkg.module, format: "es", indent: false }],
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
`;
  }

  let defaultESBrowsersBit = "";
  if (objectPath.has(state.pack, "module")) {
    defaultESBrowsersBit = `
    // ES for Browsers
    {
      input: "src/main.ts",
      output: [{ file: \`dist/\${pkg.name}.mjs\`, format: "es", indent: false }],
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
    }${
      state.pack.devDependencies["rollup-plugin-node-polyfills"]
        ? ",\n        nodePolyfills()"
        : ""
    },
        replace({
          "process.env.NODE_ENV": JSON.stringify("production"),
        }),
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
          babelHelpers: "bundled",
        }),
        !commandLineArgs.dev &&
          strip({
            sourceMap: false,
            include: ["src/**/*.(js|ts)"],
            functions: ["console.*"],
          }),
        cleanup({ comments: "istanbul", extensions: ["js", "ts"] }),
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

  let defaultDefinitions = "";
  if (objectPath.has(state.pack, "module")) {
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
import replace from "@rollup/plugin-replace";
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

const licensePiece = \`\${pkg.name}
\${pkg.description}
Version: \${pkg.version}
Author: Roy Revelt, Codsen Ltd
License: \${pkg.license}
Homepage: \${pkg.homepage}\`;

const extensions = [".mjs", ".js", ".json", ".node", ".ts"];
const babelRuntimeVersion = pkg.dependencies["@babel/runtime"].replace(
  /^[^0-9]*/,
  ""
);

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(\`^(\${externalArr.join("|")})($|/)\`);
  return (id) => pattern.test(id);
};

export default (commandLineArgs) => {
  const finalConfig = [${defaultUmdBit}${defaultDevUmdBit}${defaultCommonJSBit}${defaultESMBit}${defaultESBrowsersBit}${defaultDefinitions}  ];

  if (commandLineArgs.dev) {
    // don't build minified UMD in dev, it takes too long
    finalConfig.shift();
  }

  // clean up this custom "dev" flag, otherwise Rollup will complain
  // https://github.com/rollup/rollup/issues/2694#issuecomment-463915954
  delete commandLineArgs.dev;
  return finalConfig;
};
`;

  try {
    await writeFileAtomic("rollup.config.js", newRollupConfig);
    // console.log(`lect rollup.config.js ${`\u001b[${32}m${`OK`}\u001b[${39}m`}`);
    // happy path end - resolve
    return Promise.resolve(null);
  } catch (err) {
    console.log(`lect: could not write rollup.config.js - ${err}`);
    return Promise.reject(err);
  }
}

module.exports = rollupConfig;
