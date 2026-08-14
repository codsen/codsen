import { rmSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import esbuild from "esbuild";
import camelCase from "lodash.camelcase";
import { nodeTargetFromEngineRange } from "../helpers/nodeEngine.js";

const arguments_ = process.argv.slice(2);
if (
  arguments_.length > 1 ||
  (arguments_.length === 1 && arguments_[0] !== "--dev")
) {
  throw new TypeError("Usage: node ops/scripts/esbuild.js [--dev]");
}

const isDevelopment = arguments_[0] === "--dev";
const require2 = createRequire(import.meta.url);
const name2 = path.basename(path.resolve("./"));

const pkg = require2(path.join(path.resolve("./"), "package.json"));
const nodeTarget = nodeTargetFromEngineRange(pkg.engines?.node);

// Builds must not leave output from older compiler layouts behind.
rmSync(path.join(path.resolve("./"), "dist"), {
  recursive: true,
  force: true,
});

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
    define: { DEV: String(isDevelopment) },
    minify: !isDevelopment,
    sourcemap: false,
    target: [nodeTarget],
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
    define: { DEV: String(isDevelopment) },
    minify: !isDevelopment,
    sourcemap: false,
    target: ["chrome58"],
    outfile: path.join(path.resolve("./"), `dist/${name2}.umd.js`),
    // pure,
    banner,
    // no "external" - bundle everything
  });
}
