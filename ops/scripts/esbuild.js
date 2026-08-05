import { createRequire } from "node:module";
import path from "node:path";
import esbuild from "esbuild";
import camelCase from "lodash.camelcase";

const require2 = createRequire(import.meta.url);
const name2 = path.basename(path.resolve("./"));

const pkg = require2(path.join(path.resolve("./"), "package.json"));

// bundle, but set dependencies as external
const external2 = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

const banner = {
  js: `/**
 * @name ${name2}
 * @fileoverview ${pkg.description}
 * @version ${pkg.version}
 * @author Roy Revelt
 * @license MIT
 * {@link https://codsen.com/os/${name2}/}
 */
`,
};

// ESM
if (
  (pkg.exports && (typeof pkg.exports === "string" || pkg.exports.default)) ||
  !pkg.type
) {
  esbuild.buildSync({
    entryPoints: [path.join(path.resolve("./"), "src/main.ts")],
    platform: "node",
    format: "esm",
    bundle: true,
    define: { DEV: String(!!process.env.DEV) },
    minify: !process.env.DEV,
    sourcemap: false,
    target: ["node20"],
    outfile: path.join(path.resolve("./"), `dist/${name2}.esm.js`),
    // pure,
    banner,
    external: external2,
  });
}

// IIFE
if (pkg.exports?.script) {
  esbuild.buildSync({
    entryPoints: [path.join(path.resolve("./"), "src/main.ts")],
    format: "iife",
    globalName: camelCase(name2),
    bundle: true,
    define: { DEV: String(!!process.env.DEV) },
    minify: !process.env.DEV,
    sourcemap: false,
    target: ["chrome58"],
    outfile: path.join(path.resolve("./"), `dist/${name2}.umd.js`),
    // pure,
    banner,
    // no "external" - bundle everything
  });
}
