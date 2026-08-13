import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import objectPath from "object-path";
import writeFileAtomic from "write-file-atomic";
import { PACKAGE_KINDS } from "../helpers/packageKinds.js";
import { readPackageKindResolver } from "../helpers/packageKindsFile.js";
import { prepExampleFileStr } from "../helpers/prepExampleFileStr.js";
import { getLicenceContents } from "./common/getLicenceContents.js";
import allContrib from "./plugins/allContributors.js";
import hardDelete from "./plugins/hardDelete.js";
import hardWrite from "./plugins/hardWrite.js";
import licence from "./plugins/licence.js";
import pack from "./plugins/pack.js";
// import tasks:
import readme from "./plugins/readme.js";
// import npmIgnore from "./plugins/npmIgnore.js";
import rollupConfig from "./plugins/rollupConfig.js";
import tsconfig from "./plugins/tsconfig.js";

const __dirname2 = path.dirname(fileURLToPath(import.meta.url));

// SETUP
// -----------------------------------------------------------------------------

const state = {
  isBin: false,
  packageKind: null,
  pack: { name: null, version: null, description: null },
  originalLectrc: {},
  currentYear: new Date().getFullYear(),
};

// 1. Read package.json in the root where this script was called

const packageJson = JSON.parse(await fs.readFile("package.json", "utf8"));
const rootPackageJSON = JSON.parse(
  await fs.readFile(path.resolve("../../package.json"), "utf8"),
);
state.pack = packageJson;
state.root = path.resolve("./");

// 2. Resolve the package's declared primary kind. Runtime capabilities such as
// a bin entry remain independent manifest properties.
const packageKinds = readPackageKindResolver(path.resolve(__dirname2, "../.."));
state.packageKind = packageKinds.kindFor(packageJson.name);
if (state.packageKind === PACKAGE_KINDS.GENERATED_DATA) {
  throw new Error(
    `lect does not maintain generated-data workspace ${packageJson.name}`,
  );
}

state.isBin = objectPath.has(packageJson, "bin");

const lectrc = JSON.parse(
  await fs.readFile(path.join(__dirname2, ".lectrc.json"), "utf8"),
);
const coveragePolicy = JSON.parse(
  await fs.readFile(path.join(__dirname2, "../coverage-policy.json"), "utf8"),
);
state.originalLectrc = { ...lectrc };

let quickTakeExample;
try {
  quickTakeExample = prepExampleFileStr(
    await fs.readFile(path.join(state.root, "examples/_quickTake.js"), "utf8"),
  ).str;
} catch (_error) {
  // console.log(`079 lect: ${`\u001b[${31}m${`no examples`}\u001b[${39}m`}`);
}

// ACTION
// -----------------------------------------------------------------------------

await Promise.all([
  // write README.md
  Promise.resolve(readme({ state, quickTakeExample, lectrc })),
  // write new files
  Promise.resolve(hardWrite({ lectrc })),
  // delete bad files
  Promise.resolve(hardDelete({ lectrc })),
  // write package.json
  Promise.resolve(pack({ state, lectrc, rootPackageJSON, coveragePolicy })),
  // write .npmignore
  // Promise.resolve(npmIgnore({ state, lectrc })),
  // write rollup.config.js
  Promise.resolve(rollupConfig({ state })),
  // write tsconfig.json
  Promise.resolve(tsconfig({ state })),
  // write .all-contributorsrc
  Promise.resolve(allContrib({ state })),
  // write LICENCE
  Promise.resolve(licence({ state })),
]).catch((e) => {
  console.log(`111 lect: ${`\u001b[${31}m${`failure`}\u001b[${39}m`}: ${e}`);
  process.exit(1);
});

// also write the root LICENSE
await writeFileAtomic(
  path.join(path.resolve("../../"), "LICENSE"),
  getLicenceContents(state.currentYear),
);
