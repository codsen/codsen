import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import objectPath from "object-path";

import { GENERATION_MODES } from "../helpers/generatedFiles.js";
import { PACKAGE_KINDS } from "../helpers/packageKinds.js";
import { readPackageKindResolver } from "../helpers/packageKindsFile.js";
import { prepExampleFileStr } from "../helpers/prepExampleFileStr.js";
import allContrib from "./plugins/allContributors.js";
import hardDelete from "./plugins/hardDelete.js";
import hardWrite from "./plugins/hardWrite.js";
import licence from "./plugins/licence.js";
import pack from "./plugins/pack.js";
import readme from "./plugins/readme.js";
import rollupConfig from "./plugins/rollupConfig.js";
import tsconfig from "./plugins/tsconfig.js";

const repositoryRootFromFile = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const defaultOperations = {
  allContrib,
  hardDelete,
  hardWrite,
  licence,
  pack,
  readme,
  rollupConfig,
  tsconfig,
};

async function readJson(filename) {
  return JSON.parse(await fs.readFile(filename, "utf8"));
}

async function readQuickTakeExample(filename) {
  let source;
  try {
    source = await fs.readFile(filename, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return undefined;
    }
    throw error;
  }
  return prepExampleFileStr(source).str;
}

async function runLectPhases({
  coveragePolicy,
  lectrc,
  operations = defaultOperations,
  mode = GENERATION_MODES.WRITE,
  quickTakeExample,
  rootPackageJSON,
  state,
}) {
  await operations.hardDelete({ lectrc, mode, root: state.root });
  await operations.hardWrite({ lectrc, mode, root: state.root });
  state.pack = await operations.pack({
    coveragePolicy,
    lectrc,
    rootPackageJSON,
    state,
    mode,
  });
  await operations.rollupConfig({ mode, state });
  await operations.tsconfig({ mode, state });
  await operations.allContrib({ mode, state });
  await operations.licence({ mode, state });
  await operations.readme({ mode, quickTakeExample, state });
  return state;
}

async function runLect({
  currentYear = new Date().getFullYear(),
  mode = GENERATION_MODES.WRITE,
  operations = defaultOperations,
  packageRoot = process.cwd(),
  repositoryRoot = repositoryRootFromFile,
} = {}) {
  const absolutePackageRoot = path.resolve(packageRoot);
  const packageJson = await readJson(
    path.join(absolutePackageRoot, "package.json"),
  );
  const rootPackageJSON = await readJson(
    path.join(repositoryRoot, "package.json"),
  );
  const packageKinds = readPackageKindResolver(repositoryRoot);
  const packageKind = packageKinds.kindFor(packageJson.name);
  if (packageKind === PACKAGE_KINDS.GENERATED_DATA) {
    throw new Error(
      `lect does not maintain generated-data workspace ${packageJson.name}`,
    );
  }

  const state = {
    currentYear,
    isBin: objectPath.has(packageJson, "bin"),
    packageKind,
    pack: packageJson,
    repositoryRoot,
    root: absolutePackageRoot,
  };
  const lectrc = await readJson(
    path.join(repositoryRoot, "ops/lect/.lectrc.json"),
  );
  const coveragePolicy = await readJson(
    path.join(repositoryRoot, "ops/coverage-policy.json"),
  );
  const quickTakeExample = await readQuickTakeExample(
    path.join(absolutePackageRoot, "examples/_quickTake.js"),
  );

  return runLectPhases({
    coveragePolicy,
    lectrc,
    operations,
    mode,
    quickTakeExample,
    rootPackageJSON,
    state,
  });
}

export { readQuickTakeExample, runLect, runLectPhases };
