import esbuild from "esbuild";
import path from "path";
import camelCase from "lodash.camelcase";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
let name = path.basename(path.resolve("./"));
// CJS packages will have "-tbc" appended, so remove that
if (name.endsWith("-tbc")) {
  name = name.slice(0, -4);
}

const pkg = require(path.join(path.resolve("./"), `package.json`));

const isCJS = (str) => typeof str === "string" && str.endsWith(".cjs.js");

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
if (
  (pkg.exports && (typeof pkg.exports === "string" || pkg.exports.default)) ||
  !pkg.type ||
  isCJS(pkg.main)
) {
  esbuild.buildSync({
    entryPoints: [path.join(path.resolve("./"), "src/main.ts")],
    platform: "node",
    format: "esm",
    bundle: true,
    define: { DEV: String(!!process.env.DEV) },
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
    define: { DEV: String(!!process.env.DEV) },
    minify: !process.env.DEV,
    sourcemap: false,
    target: ["chrome58"],
    outfile: path.join(path.resolve("./"), `dist/${name}.umd.js`),
    // pure,
    banner,
    // no "external" - bundle everything
  });
}

// CJS (used in eslint plugins)
if (isCJS(pkg.main)) {
  esbuild.buildSync({
    entryPoints: [path.join(path.resolve("./"), "src/main.ts")],
    platform: "node",
    format: "cjs",
    bundle: true,
    define: { DEV: String(!!process.env.DEV) },
    // minify: !process.env.DEV,
    sourcemap: false,
    target: ["esnext"],
    outfile: path.join(path.resolve("./"), `dist/${name}.cjs.js`),
    // pure,
    banner,
    // no "external" - bundle everything
  });
}
