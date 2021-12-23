import esbuild from "esbuild";
import path from "path";
import camelCase from "lodash.camelcase";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const name = path.basename(path.resolve("./"));
const pkg = require(path.join(path.resolve("./"), `package.json`));

// bundle, but set dependencies as external
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

const banner = {
  js: `/**
 * @name ${name}
 * @fileoverview ${pkg.description}
 * @version ${pkg.version}
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/${name}/}
 */
`,
};

// ESM
if (pkg.exports && (typeof pkg.exports === "string" || pkg.exports.default)) {
  esbuild.buildSync({
    entryPoints: [path.join(path.resolve("./"), "src/main.ts")],
    platform: "node",
    format: "esm",
    bundle: true,
    define: { DEV: !!process.env.DEV },
    minify: !process.env.DEV,
    sourcemap: false,
    target: ["esnext"],
    outfile: path.join(path.resolve("./"), `dist/${name}.esm.js`),
    // pure,
    banner,
    external,
  });
}

// IIFE
if (pkg.exports && pkg.exports.script) {
  esbuild.buildSync({
    entryPoints: [path.join(path.resolve("./"), "src/main.ts")],
    format: "iife",
    globalName: camelCase(name),
    bundle: true,
    define: { DEV: !!process.env.DEV },
    minify: !process.env.DEV,
    sourcemap: false,
    target: ["chrome58"],
    outfile: path.join(path.resolve("./"), `dist/${name}.umd.js`),
    // pure,
    banner,
    // no "external" - bundle everything
  });
}
