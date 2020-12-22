const objectPath = require("object-path");
const camelCase = require("lodash.camelcase");
const writeFileAtomic = require("write-file-atomic");

// writes rollup.config.js
async function rollupConfig({ state }) {
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
        nodeResolve({
          extensions,
        })${
          state.pack.devDependencies["rollup-plugin-node-builtins"]
            ? ",\n        builtins()"
            : ""
        }${
      state.pack.devDependencies["rollup-plugin-node-globals"]
        ? ",\n        globals()"
        : ""
    }${
      state.pack.devDependencies["@rollup/plugin-json"]
        ? ",\n        json()"
        : ""
    },
        commonjs(),
        typescript({
          tsconfig: "../../tsconfig.build.json",
          declaration: false,
        }),
        babel({
          extensions,
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
            unsafe: true,
            unsafe_comps: true,
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
        nodeResolve({
          extensions,
        })${
          state.pack.devDependencies["rollup-plugin-node-builtins"]
            ? ",\n        builtins()"
            : ""
        }${
      state.pack.devDependencies["rollup-plugin-node-globals"]
        ? ",\n        globals()"
        : ""
    }${
      state.pack.devDependencies["@rollup/plugin-json"]
        ? ",\n        json()"
        : ""
    },
        typescript({
          tsconfig: "../../tsconfig.build.json",
          declaration: false,
        }),
        commonjs(),
        babel({
          extensions,
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
        nodeResolve({
          extensions,
        })${
          state.pack.devDependencies["rollup-plugin-node-builtins"]
            ? ",\n        builtins()"
            : ""
        }${
      state.pack.devDependencies["rollup-plugin-node-globals"]
        ? ",\n        globals()"
        : ""
    }${
      state.pack.devDependencies["@rollup/plugin-json"]
        ? ",\n        json()"
        : ""
    },
        typescript({
          tsconfig: "../../tsconfig.build.json",
          declaration: true,
          declarationDir: "./types",
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
        cleanup({ comments: "istanbul" }),
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
        nodeResolve({
          extensions,
        })${
          state.pack.devDependencies["rollup-plugin-node-builtins"]
            ? ",\n        builtins()"
            : ""
        }${
      state.pack.devDependencies["rollup-plugin-node-globals"]
        ? ",\n        globals()"
        : ""
    }${
      state.pack.devDependencies["@rollup/plugin-json"]
        ? ",\n        json()"
        : ""
    },
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
        cleanup({ comments: "istanbul" }),
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
        nodeResolve({
          extensions,
        })${
          state.pack.devDependencies["rollup-plugin-node-builtins"]
            ? ",\n        builtins()"
            : ""
        }${
      state.pack.devDependencies["rollup-plugin-node-globals"]
        ? ",\n        globals()"
        : ""
    }${
      state.pack.devDependencies["@rollup/plugin-json"]
        ? ",\n        json()"
        : ""
    },
        replace({
          "process.env.NODE_ENV": JSON.stringify("production"),
        }),
        typescript({
          tsconfig: "../../tsconfig.build.json",
          declaration: false,
        }),
        babel({
          extensions,
          exclude: "node_modules/**",
          babelHelpers: "bundled",
        }),
        !commandLineArgs.dev &&
          strip({
            sourceMap: false,
            include: ["src/**/*.(js|ts)"],
            functions: ["console.*"],
          }),
        cleanup({ comments: "istanbul" }),
        terser({
          compress: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            warnings: false,
          },
        }),
        banner(licensePiece),
      ],
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
}import pkg from "./package.json";

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
  const finalConfig = [${defaultUmdBit}${defaultDevUmdBit}${defaultCommonJSBit}${defaultESMBit}${defaultESBrowsersBit}  ];

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
