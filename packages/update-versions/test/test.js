// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { mkdirSync, promises } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execa } from "execa";
import pMap from "p-map";
import { temporaryDirectory } from "tempy";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
import writeFileAtomic from "write-file-atomic";
import { updateVersions } from "../cli.js";

const clone = structuredClone;

const require2 = createRequire(import.meta.url);
const pack = require2("../package.json");

const __filename2 = fileURLToPath(import.meta.url);
const __dirname2 = path.dirname(__filename2);

// -----------------------------------------------------------------------------

// # Here's the test file/folder tree which will be written temporarily:

// Test #1. Monorepo.
// ==================

// •
// ├── packages/
// │   ├── lib1/
// │   │   └── package.json
// │   └── lib2/
// │       └── package.json
// ├── node_modules/
// │   └── lib3
// │       └── package.json
// └── package.json

// The point of the test is to make sure lib1/package.json and lib2/package.json
// are updated, but also that the node_modules/lib3/package.json is not touched.
// Also, the package.json in the root should be updated as well.

// Test #2. Single repo
// ====================

// •
// ├── node_modules/
// │   └── lib3
// │       └── package.json
// └── package.json

// In normal, single repo scenario, package.json in the root should be updated
// but also that node_modules/lib1/package.json should not be touched.

const test1FilePaths = [
  "packages/lib1/package.json",
  "packages/lib2/package.json",
  "node_modules/lib3/package.json",
  "package.json",
];

const test2FilePaths = ["node_modules/lib3/package.json", "package.json"];

// Contents
// -----------------------------------------------------------------------------

const packBefore = {
  name: "codsen-monorepo",
  version: "0.0.0-ignore",
  description: "Monorepo of all our npm libraries",
  dependencies: {},
  devDependencies: {
    "@pectin/cli": "^3.0.1",
    commitizen: "*", // notice glob flag asterisk
    slfjdlkjglkdflgjdlkjljf: "^1.0.0",
    "cz-conventional-changelog": "workspace:^2.1.0",
    eslint: "^5.12.1",
    "eslint-config-prettier": "^3.6.0",
    "eslint-plugin-import": "^2.15.0",
    "eslint-plugin-no-unsanitized": "^3.0.2",
    "eslint-plugin-prettier": "^3.0.1",
    husky: "latest", // notice "latest" is not legal in Lerna
    prettier: "1.16.1", // notice there's no ^
  },
};

// test1: packages/lib1/package.json
const packTest1Lib1 = clone(packBefore);
packTest1Lib1.dependencies["check-types-mini"] = "^4.0.0";

// test1: packages/lib2/package.json
const packTest1Lib2 = clone(packBefore);
packTest1Lib2.dependencies["check-types-mini"] = "latest";

// test1/test2: node_modules/lib3/package.json
const packTest12Lib3 = clone(packBefore);
packTest12Lib3.dependencies["check-types-mini"] = "*";

// test1/test2: ./package.json (root)
const rootPack = clone(packBefore);
rootPack.dependencies.detergent = "^1.0.0";

// !IMPORTANT!
// array below coordinates with array "test1FilePaths" / "test2FilePaths"
const test1FileContents = [
  packTest1Lib1,
  packTest1Lib2,
  packTest12Lib3,
  rootPack,
];

const test2FileContents = [packTest12Lib3, rootPack];

async function fetchPackageFixture(name) {
  if (name === "slfjdlkjglkdflgjdlkjljf") {
    throw new Error("Package does not exist");
  }
  return {
    name,
    version: "9.9.9",
  };
}

// Unit tests
// -----------------------------------------------------------------------------

test("01 - monorepo", async () => {
  // const tempFolder = "temp";
  let tempFolder = temporaryDirectory();

  // 1. The temp folder needs subfolders. Those have to be in place before we start
  // writing the files:
  mkdirSync(path.join(tempFolder, "packages/lib1"), { recursive: true });
  mkdirSync(path.join(tempFolder, "packages/lib2"), { recursive: true });
  mkdirSync(path.join(tempFolder, "node_modules/lib3"), { recursive: true });

  // 2. asynchronously write all test files

  await pMap(test1FilePaths, (oneOfTestFilePaths, testIndex) =>
    writeFileAtomic(
      path.join(tempFolder, oneOfTestFilePaths),
      JSON.stringify(test1FileContents[testIndex], null, 2),
    ),
  );
  await updateVersions({ cwd: tempFolder, fetchPackage: fetchPackageFixture });
  let receivedContents = await pMap(test1FilePaths, (oneOfPaths) =>
    promises.readFile(path.join(tempFolder, oneOfPaths), "utf8"),
  );
  // array comes in, but each JSON inside in unparsed and in string format:
  let contents = receivedContents.map((arr) => JSON.parse(arr));

  // lib1:
  match(contents[0].dependencies["check-types-mini"], /\^\d+\.\d+\.\d+/);
  match(contents[0].devDependencies.husky, /\^\d+\.\d+\.\d+/);
  match(contents[0].devDependencies.commitizen, /\^\d+\.\d+\.\d+/);
  match(contents[0].devDependencies.prettier, /\^\d+\.\d+\.\d+/);
  // lib2:
  match(contents[1].dependencies["check-types-mini"], /\^\d+\.\d+\.\d+/);
  match(contents[1].devDependencies.husky, /\^\d+\.\d+\.\d+/);
  match(contents[1].devDependencies.commitizen, /\^\d+\.\d+\.\d+/);
  match(contents[1].devDependencies.prettier, /\^\d+\.\d+\.\d+/);

  // workspace: should be retained
  match(
    contents[1].devDependencies["cz-conventional-changelog"],
    /workspace:\^\d+\.\d+\.\d+/,
  );

  // lib3 in node_modules should be intact:
  equal(contents[2].dependencies["check-types-mini"], "*", "01.01");
  equal(contents[2].devDependencies.husky, "latest", "01.02");
  equal(contents[2].devDependencies.commitizen, "*", "01.03");
  equal(contents[2].devDependencies.prettier, "1.16.1", "01.04");

  // root package.json:
  ok(contents[3].dependencies.detergent === "^9.9.9");
});

test("02 - normal repo", async () => {
  let tempFolder = temporaryDirectory();

  // 1. create folders:
  mkdirSync(path.join(tempFolder, "node_modules/lib3"), { recursive: true });

  // asynchronously write all test files

  await pMap(test2FilePaths, (oneOfTestFilePaths, testIndex) =>
    writeFileAtomic(
      path.join(tempFolder, oneOfTestFilePaths),
      JSON.stringify(test2FileContents[testIndex], null, 2),
    ),
  );
  await updateVersions({ cwd: tempFolder, fetchPackage: fetchPackageFixture });
  let incomingContents = await pMap(test2FilePaths, (oneOfPaths) =>
    promises.readFile(path.join(tempFolder, oneOfPaths), "utf8"),
  );
  // array comes in, but each JSON inside in unparsed and in string format:
  let contents = incomingContents.map((arr) => JSON.parse(arr));

  // node_modules/lib3/package.json:
  equal(contents[0].dependencies["check-types-mini"], "*", "02.01");
  equal(contents[0].devDependencies.husky, "latest", "02.02");
  equal(contents[0].devDependencies.commitizen, "*", "02.03");
  equal(contents[0].devDependencies.prettier, "1.16.1", "02.04");

  // root package.json:
  match(contents[1].dependencies.detergent, /\^\d+\.\d+\.\d+/);
  match(contents[1].devDependencies.husky, /\^\d+\.\d+\.\d+/);
  match(contents[1].devDependencies.commitizen, /\^\d+\.\d+\.\d+/);
  match(contents[1].devDependencies.prettier, /\^\d+\.\d+\.\d+/);
});

test("03 - deletes deps from dev-deps if they are among normal deps", async () => {
  let tempFolder = temporaryDirectory();

  // 0. We need to add redundant deps onto normal deps key in package.json:
  let tweakedContents = clone(test2FileContents);
  tweakedContents[1].dependencies.commitizen = "*";
  // it will contain commitizen on both deps and dev deps

  // 1. create folders:
  mkdirSync(path.join(tempFolder, "node_modules/lib3"), { recursive: true });

  // asynchronously write all test files

  await pMap(test2FilePaths, (oneOfTestFilePaths, testIndex) =>
    writeFileAtomic(
      path.join(tempFolder, oneOfTestFilePaths),
      JSON.stringify(tweakedContents[testIndex], null, 2),
    ),
  );
  await updateVersions({ cwd: tempFolder, fetchPackage: fetchPackageFixture });
  let incomingContents = await pMap(test2FilePaths, (oneOfPaths) =>
    promises.readFile(path.join(tempFolder, oneOfPaths), "utf8"),
  );
  // array comes in, but each JSON inside in unparsed and in string format:
  let contents = incomingContents.map((arr) => JSON.parse(arr));
  // root package.json dev-deps should not contain the commitizen:
  ok(!Object.keys(contents[1].devDependencies).includes("commitizen"));
});

test("04 - version output mode", async () => {
  let reportedVersion1 = await execa("./cli.js", ["-v"]);
  equal(reportedVersion1.stdout, pack.version, "04.01");

  let reportedVersion2 = await execa("./cli.js", ["--version"]);
  equal(reportedVersion2.stdout, pack.version, "04.02");
});

test("05 - help output mode", async () => {
  let reportedVersion1 = await execa("./cli.js", ["-h"]);
  match(reportedVersion1.stdout, /Usage/, "05.01");
  match(reportedVersion1.stdout, /Options/, "05.02");

  let reportedVersion2 = await execa("./cli.js", ["--help"]);
  match(reportedVersion2.stdout, /Usage/, "05.03");
  match(reportedVersion2.stdout, /Options/, "05.04");
});

test("06 - no files found in the given directory", async () => {
  let tempFolder = temporaryDirectory();
  // create folder:
  mkdirSync(path.resolve(tempFolder), { recursive: true });

  // call execa on that empty folder
  let stdOutContents = await execa(path.join(__dirname2, "../", "cli.js"), {
    cwd: tempFolder,
  });

  // CLI should exit with a non-error code zero:
  equal(stdOutContents.exitCode, 0, "06.01");
});

test("07 - resolves registry metadata before writing", async () => {
  let tempFolder = temporaryDirectory();
  let packagePath = path.join(tempFolder, "package.json");
  let original = JSON.stringify(
    {
      name: "fixture",
      version: "1.0.0",
      dependencies: {
        alpha: "^1.0.0",
        beta: "^1.0.0",
      },
    },
    null,
    2,
  );
  await writeFileAtomic(packagePath, original);

  let releaseBeta;
  let betaMetadata = new Promise((resolve) => {
    releaseBeta = resolve;
  });
  let updatePromise = updateVersions({
    cwd: tempFolder,
    fetchPackage: (name) =>
      name === "alpha"
        ? Promise.resolve({ name, version: "2.0.0" })
        : betaMetadata,
  });

  await new Promise((resolve) => setImmediate(resolve));
  equal(await promises.readFile(packagePath, "utf8"), original, "07.01");

  releaseBeta({ name: "beta", version: "3.0.0" });
  await updatePromise;
  let updated = JSON.parse(await promises.readFile(packagePath, "utf8"));
  equal(updated.dependencies.alpha, "^2.0.0", "07.02");
  equal(updated.dependencies.beta, "^3.0.0", "07.03");

  await writeFileAtomic(packagePath, original);
  let receivedError;
  try {
    await updateVersions({
      cwd: tempFolder,
      fetchPackage: async () => {
        throw new Error("registry unavailable");
      },
    });
  } catch (error) {
    receivedError = error;
  }
  match(receivedError.message, /Nothing was written/);
  equal(await promises.readFile(packagePath, "utf8"), original, "07.04");
});

test.run();
