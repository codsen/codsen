import esbuild from "esbuild";
import path from "path";
import camelCase from "lodash.camelcase";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const mode = process.env.MODE;
const name = path.basename(path.resolve("./"));
const pkg = require(path.join(path.resolve("./"), `package.json`));

// pure here means they can be removed if unused (if minifying is on, of course)
const pure =
  mode === "dev"
    ? []
    : ["console.log", "console.time", "console.timeEnd", "console.timeLog"];

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

// CJS
if (pkg.main) {
  esbuild.buildSync({
    entryPoints: [path.join(path.resolve("./"), "src/main.ts")],
    format: "cjs",
    bundle: true,
    minify: !mode,
    sourcemap: false,
    target: ["node10.4"],
    outfile: path.join(path.resolve("./"), `dist/${name}.cjs.js`),
    pure,
    banner,
    external,
  });
}

// ESM
if (pkg.module) {
  esbuild.buildSync({
    entryPoints: [path.join(path.resolve("./"), "src/main.ts")],
    format: "esm",
    bundle: true,
    minify: !mode,
    sourcemap: false,
    target: ["esnext"],
    outfile: path.join(path.resolve("./"), `dist/${name}.esm.js`),
    pure,
    banner,
    external,
  });
}

// dev IIFE
if (pkg.browser) {
  esbuild.buildSync({
    entryPoints: [path.join(path.resolve("./"), "src/main.ts")],
    format: "iife",
    globalName: camelCase(name),
    bundle: true,
    minify: !mode,
    sourcemap: false,
    target: ["chrome58"],
    outfile: path.join(path.resolve("./"), `dist/${name}.dev.umd.js`),
    pure,
    banner,
    // no "external" - bundle everything
  });
}
