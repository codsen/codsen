import { rmSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import esbuild from "esbuild";
import {
  IIFE_BROWSER_POLICY,
  iifeGlobalName,
} from "../helpers/browserCompatibility.js";
import { devLogOriginsPlugin } from "../helpers/devLogOrigins.js";
import { nodeTargetFromEngineRange } from "../helpers/nodeEngine.js";
import { libraryEntries } from "../helpers/packageEntries.js";

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
const entries = libraryEntries(pkg);

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

// Prepends `<path-within-package>:<line> ` to the debug logging the --dev
// build keeps, which is also why the builds below use the asynchronous API:
// esbuild rejects plugins passed to buildSync.
//
// The production build has nothing to prefix - minification has already
// removed every DEV-guarded log - and running the rewrite there anyway would
// not be free. Esbuild picks minified names by character frequency over the
// whole input, so injected text it goes on to discard still renames variables
// in the published bundle.
const plugins = isDevelopment ? [devLogOriginsPlugin(path.resolve("./"))] : [];

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
for (const entry of entries.filter((item) => item.default)) {
  await esbuild.build({
    entryPoints: [path.resolve(entry.source)],
    platform: "node",
    format: "esm",
    bundle: true,
    define: { DEV: String(isDevelopment) },
    minify: !isDevelopment,
    sourcemap: false,
    target: [nodeTarget],
    outfile: path.resolve(entry.default),
    // pure,
    banner,
    external: external2,
    plugins,
  });
}

// IIFE
for (const entry of entries.filter((item) => item.script)) {
  await esbuild.build({
    entryPoints: [path.resolve(entry.source)],
    format: "iife",
    globalName: iifeGlobalName(name2),
    bundle: true,
    define: { DEV: String(isDevelopment) },
    minify: !isDevelopment,
    sourcemap: false,
    target: [IIFE_BROWSER_POLICY.esbuildTarget],
    outfile: path.resolve(entry.script),
    // pure,
    banner,
    // no "external" - bundle everything
    plugins,
  });
}
