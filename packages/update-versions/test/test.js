// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { mkdirSync, promises } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { set as setJsonValue } from "edit-package-json";
import { execa } from "execa";
import pMap from "p-map";
import { temporaryDirectory } from "tempy";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
import { UpdateVersionsError, updateVersions } from "../cli.js";

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
  return {
    name,
    version: "9.9.9",
  };
}

async function writeJson(filename, value) {
  await promises.writeFile(filename, JSON.stringify(value, null, 2));
}

async function readJson(filename) {
  return JSON.parse(await promises.readFile(filename, "utf8"));
}

async function captureUpdateError(options) {
  try {
    await updateVersions(options);
  } catch (error) {
    return error;
  }
  return undefined;
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
    promises.writeFile(
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
    promises.writeFile(
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
    promises.writeFile(
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
  await promises.writeFile(packagePath, original);

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

  await promises.writeFile(packagePath, original);
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

test("08 - cwd discovery excludes test package manifests", async () => {
  let tempFolder = temporaryDirectory();
  let testFolder = path.join(tempFolder, "test", "fixture");
  mkdirSync(testFolder, { recursive: true });
  let rootPath = path.join(tempFolder, "package.json");
  let testPath = path.join(testFolder, "package.json");
  let rootContents = JSON.stringify({
    name: "root-fixture",
    dependencies: { alpha: "^1.0.0" },
  });
  let testContents = JSON.stringify({
    name: "test-fixture",
    dependencies: { beta: "^1.0.0" },
  });
  await Promise.all([
    promises.writeFile(rootPath, rootContents),
    promises.writeFile(testPath, testContents),
  ]);

  await updateVersions({
    cwd: tempFolder,
    fetchPackage: async (name) => ({ name, version: "2.0.0" }),
  });

  equal(
    JSON.parse(await promises.readFile(rootPath, "utf8")).dependencies.alpha,
    "^2.0.0",
    "08.01",
  );
  equal(await promises.readFile(testPath, "utf8"), testContents, "08.02");
});

test("09 - object pins update their original dependency sections", async () => {
  let tempFolder = temporaryDirectory();
  let packagePath = path.join(tempFolder, "package.json");
  await writeJson(packagePath, {
    name: "pin-fixture",
    dependencies: { alpha: "^1.0.0" },
    devDependencies: { beta: "^1.0.0" },
  });
  await writeJson(path.join(tempFolder, "upd.config.json"), {
    pin: { alpha: "1.2.3", beta: "4.5.6" },
  });

  let registryCalls = 0;
  let updated = await updateVersions({
    cwd: tempFolder,
    fetchPackage: async () => {
      registryCalls += 1;
      return { name: "unused", version: "9.9.9" };
    },
  });
  let received = await readJson(packagePath);

  equal(received.dependencies.alpha, "1.2.3", "09.01");
  equal(received.devDependencies.beta, "4.5.6", "09.02");
  equal(Object.hasOwn(received.dependencies, "beta"), false, "09.03");
  equal(registryCalls, 0, "09.04");
  equal(updated.alpha, "1.2.3", "09.05");
  equal(updated.beta, "4.5.6", "09.06");
});

test("10 - pins take precedence over no-major-bump rules", async () => {
  let tempFolder = temporaryDirectory();
  let packagePath = path.join(tempFolder, "package.json");
  await writeJson(packagePath, {
    name: "pin-precedence-fixture",
    dependencies: { alpha: "^1.0.0", beta: "^1.0.0" },
  });
  await writeJson(path.join(tempFolder, "upd.config.json"), {
    noMajorBumping: ["alpha", "beta"],
    pin: { alpha: "3.1.4" },
  });

  let updated = await updateVersions({
    cwd: tempFolder,
    fetchPackage: async (name) => ({ name, version: "2.0.0" }),
  });
  let received = await readJson(packagePath);

  equal(received.dependencies.alpha, "3.1.4", "10.01");
  equal(received.dependencies.beta, "^1.0.0", "10.02");
  equal(updated.alpha, "3.1.4", "10.03");
  equal(Object.hasOwn(updated, "beta"), false, "10.04");
});

test("11 - no-major-bump allows same-major updates", async () => {
  let tempFolder = temporaryDirectory();
  let packagePath = path.join(tempFolder, "package.json");
  await writeJson(packagePath, {
    name: "no-major-fixture",
    dependencies: { alpha: "^1.0.0", beta: "^2.0.0" },
  });
  await writeJson(path.join(tempFolder, "upd.config.json"), {
    noMajorBumping: ["alpha", "beta"],
  });

  let updated = await updateVersions({
    cwd: tempFolder,
    fetchPackage: async (name) => ({
      name,
      version: name === "alpha" ? "2.0.0" : "2.5.0",
    }),
  });
  let received = await readJson(packagePath);

  equal(received.dependencies.alpha, "^1.0.0", "11.01");
  equal(received.dependencies.beta, "^2.5.0", "11.02");
  equal(Object.hasOwn(updated, "alpha"), false, "11.03");
  equal(updated.beta, "2.5.0", "11.04");
});

test("12 - workspace protocol selectors retain their semantics", async () => {
  let tempFolder = temporaryDirectory();
  let packagePath = path.join(tempFolder, "package.json");
  await writeJson(packagePath, {
    name: "workspace-fixture",
    dependencies: {
      caret: "workspace:^1.0.0",
      exact: "workspace:1.0.0",
      greater: "workspace:>=1.0.0",
      less: "workspace:<4.0.0",
      "protocol-caret": "workspace:^",
      "protocol-tilde": "workspace:~",
      "protocol-wildcard": "workspace:*",
      tilde: "workspace:~1.0.0",
    },
    devDependencies: {
      "pinned-exact": "workspace:^1.0.0",
      "pinned-range": "workspace:~1.0.0",
    },
  });
  await writeJson(path.join(tempFolder, "upd.config.json"), {
    pin: { "pinned-exact": "7.7.7", "pinned-range": "^8.8.8" },
  });

  await updateVersions({
    cwd: tempFolder,
    fetchPackage: async (name) => ({ name, version: "9.9.9" }),
  });
  let received = await readJson(packagePath);

  equal(received.dependencies.caret, "workspace:^9.9.9", "12.01");
  equal(received.dependencies.tilde, "workspace:~9.9.9", "12.02");
  equal(received.dependencies.exact, "workspace:9.9.9", "12.03");
  equal(received.dependencies["protocol-wildcard"], "workspace:*", "12.04");
  equal(received.dependencies["protocol-caret"], "workspace:^", "12.05");
  equal(received.dependencies["protocol-tilde"], "workspace:~", "12.06");
  equal(received.devDependencies["pinned-exact"], "workspace:7.7.7", "12.07");
  equal(received.devDependencies["pinned-range"], "workspace:^8.8.8", "12.08");
  equal(received.dependencies.greater, "workspace:>=9.9.9", "12.09");
  equal(received.dependencies.less, "workspace:<9.9.9", "12.10");
});

test("13 - no-op pins preserve package bytes and skip writes", async () => {
  let tempFolder = temporaryDirectory();
  let packagePath = path.join(tempFolder, "package.json");
  let original = `${JSON.stringify(
    {
      name: "no-op-fixture",
      dependencies: { alpha: "2.0.0" },
    },
    null,
    4,
  )}\n`;
  await promises.writeFile(packagePath, original);
  await writeJson(path.join(tempFolder, "upd.config.json"), {
    pin: { alpha: "2.0.0" },
  });
  let writes = 0;

  let updated = await updateVersions({
    cwd: tempFolder,
    effects: {
      writeTextFile: async (...args) => {
        writes += 1;
        return promises.writeFile(...args);
      },
    },
  });

  equal(await promises.readFile(packagePath, "utf8"), original, "13.01");
  equal(writes, 0, "13.02");
  equal(updated, {}, "13.03");
});

test("14 - malformed configurations fail before lookup or mutation", async () => {
  let invalidConfigs = [
    "{",
    "[]",
    '{"unknown":true}',
    '{"noMajorBumping":"alpha"}',
    '{"pin":[]}',
    '{"pin":{"alpha":false}}',
  ];

  for (let configSource of invalidConfigs) {
    let tempFolder = temporaryDirectory();
    let packagePath = path.join(tempFolder, "package.json");
    let original = JSON.stringify({
      name: "invalid-config-fixture",
      dependencies: { alpha: "^1.0.0" },
    });
    await promises.writeFile(packagePath, original);
    await promises.writeFile(
      path.join(tempFolder, "upd.config.json"),
      configSource,
    );
    let registryCalls = 0;
    let writes = 0;

    let error = await captureUpdateError({
      cwd: tempFolder,
      effects: {
        writeTextFile: async (...args) => {
          writes += 1;
          return promises.writeFile(...args);
        },
      },
      fetchPackage: async (name) => {
        registryCalls += 1;
        return { name, version: "2.0.0" };
      },
    });

    ok(error instanceof UpdateVersionsError);
    is(error.errors[0].phase, "config validation");
    match(error.errors[0].cause.message, /THROW_ID_0[1-6]/);
    is(registryCalls, 0);
    is(writes, 0);
    is(await promises.readFile(packagePath, "utf8"), original);
  }
});

test("15 - unreadable configuration is not treated as missing", async () => {
  let tempFolder = temporaryDirectory();
  let packagePath = path.join(tempFolder, "package.json");
  let original = JSON.stringify({
    name: "unreadable-config-fixture",
    dependencies: { alpha: "^1.0.0" },
  });
  await promises.writeFile(packagePath, original);
  let registryCalls = 0;

  let error = await captureUpdateError({
    cwd: tempFolder,
    effects: {
      readTextFile: async (filename, encoding) => {
        if (filename.endsWith("upd.config.json")) {
          let readError = new Error("permission denied");
          readError.code = "EACCES";
          throw readError;
        }
        return promises.readFile(filename, encoding);
      },
    },
    fetchPackage: async (name) => {
      registryCalls += 1;
      return { name, version: "2.0.0" };
    },
  });

  ok(error instanceof UpdateVersionsError);
  equal(error.errors[0].phase, "config read", "15.01");
  equal(registryCalls, 0, "15.02");
  equal(await promises.readFile(packagePath, "utf8"), original, "15.03");
});

test("16 - package read failures stop before lookup and writes", async () => {
  let tempFolder = temporaryDirectory();
  let badFolder = path.join(tempFolder, "packages", "bad");
  mkdirSync(badFolder, { recursive: true });
  let rootPath = path.join(tempFolder, "package.json");
  let badPath = path.join(badFolder, "package.json");
  let rootOriginal = JSON.stringify({
    name: "read-root-fixture",
    dependencies: { alpha: "^1.0.0" },
  });
  await promises.writeFile(rootPath, rootOriginal);
  await writeJson(badPath, { name: "read-bad-fixture" });
  let registryCalls = 0;
  let writes = 0;

  let error = await captureUpdateError({
    cwd: tempFolder,
    effects: {
      readTextFile: async (filename, encoding) => {
        if (filename === badPath) {
          throw new Error("injected read failure");
        }
        return promises.readFile(filename, encoding);
      },
      writeTextFile: async (...args) => {
        writes += 1;
        return promises.writeFile(...args);
      },
    },
    fetchPackage: async (name) => {
      registryCalls += 1;
      return { name, version: "2.0.0" };
    },
  });

  ok(error instanceof UpdateVersionsError);
  equal(error.errors[0].phase, "package read", "16.01");
  equal(registryCalls, 0, "16.02");
  equal(writes, 0, "16.03");
  equal(await promises.readFile(rootPath, "utf8"), rootOriginal, "16.04");
});

test("17 - package parse failures stop before lookup and writes", async () => {
  let tempFolder = temporaryDirectory();
  let packagePath = path.join(tempFolder, "package.json");
  let malformed = '{"name":"parse-fixture"';
  await promises.writeFile(packagePath, malformed);
  let registryCalls = 0;
  let writes = 0;

  let error = await captureUpdateError({
    cwd: tempFolder,
    effects: {
      writeTextFile: async (...args) => {
        writes += 1;
        return promises.writeFile(...args);
      },
    },
    fetchPackage: async () => {
      registryCalls += 1;
      return { name: "unused", version: "2.0.0" };
    },
  });

  ok(error instanceof UpdateVersionsError);
  equal(error.errors[0].phase, "package parse", "17.01");
  equal(registryCalls, 0, "17.02");
  equal(writes, 0, "17.03");
  equal(await promises.readFile(packagePath, "utf8"), malformed, "17.04");
});

test("18 - partial registry failure leaves every package unchanged", async () => {
  let tempFolder = temporaryDirectory();
  let packagePath = path.join(tempFolder, "package.json");
  let original = JSON.stringify({
    name: "registry-fixture",
    dependencies: { alpha: "^1.0.0", beta: "^1.0.0" },
  });
  await promises.writeFile(packagePath, original);

  let error = await captureUpdateError({
    cwd: tempFolder,
    fetchPackage: async (name) => {
      if (name === "beta") {
        throw new Error("registry unavailable for beta");
      }
      return { name, version: "2.0.0" };
    },
  });

  ok(error instanceof UpdateVersionsError);
  equal(error.errors.length, 1, "18.01");
  equal(error.errors[0].phase, "registry lookup", "18.02");
  equal(await promises.readFile(packagePath, "utf8"), original, "18.03");
});

test("19 - mixed transform failures report only committed updates", async () => {
  let tempFolder = temporaryDirectory();
  let badFolder = path.join(tempFolder, "packages", "bad");
  mkdirSync(badFolder, { recursive: true });
  let goodPath = path.join(tempFolder, "package.json");
  let badPath = path.join(badFolder, "package.json");
  let goodOriginal = JSON.stringify({
    name: "good-transform-fixture",
    dependencies: { "good-dependency": "^1.0.0" },
  });
  let badOriginal = JSON.stringify({
    name: "bad-transform-fixture",
    dependencies: { "bad-dependency": "^1.0.0" },
  });
  await Promise.all([
    promises.writeFile(goodPath, goodOriginal),
    promises.writeFile(badPath, badOriginal),
  ]);

  let error = await captureUpdateError({
    cwd: tempFolder,
    effects: {
      setJsonValue: (source, key, value) => {
        if (source.includes('"name":"bad-transform-fixture"')) {
          throw new Error("injected transform failure");
        }
        return setJsonValue(source, key, value);
      },
    },
    fetchPackage: async (name) => ({ name, version: "2.0.0" }),
  });

  ok(error instanceof UpdateVersionsError);
  equal(error.errors[0].phase, "package transform", "19.01");
  equal(error.updatedFiles.length, 1, "19.02");
  equal(error.updatedPackages["good-dependency"], "2.0.0", "19.03");
  equal(Object.hasOwn(error.updatedPackages, "bad-dependency"), false, "19.04");
  equal(
    (await readJson(goodPath)).dependencies["good-dependency"],
    "^2.0.0",
    "19.05",
  );
  equal(await promises.readFile(badPath, "utf8"), badOriginal, "19.06");
});

test("20 - mixed write failures report only committed updates", async () => {
  let tempFolder = temporaryDirectory();
  let badFolder = path.join(tempFolder, "packages", "bad");
  mkdirSync(badFolder, { recursive: true });
  let goodPath = path.join(tempFolder, "package.json");
  let badPath = path.join(badFolder, "package.json");
  let goodOriginal = JSON.stringify({
    name: "good-write-fixture",
    dependencies: { "good-dependency": "^1.0.0" },
  });
  let badOriginal = JSON.stringify({
    name: "bad-write-fixture",
    dependencies: { "bad-dependency": "^1.0.0" },
  });
  await Promise.all([
    promises.writeFile(goodPath, goodOriginal),
    promises.writeFile(badPath, badOriginal),
  ]);

  let error = await captureUpdateError({
    cwd: tempFolder,
    effects: {
      writeTextFile: async (filename, contents) => {
        if (filename === badPath) {
          throw new Error("injected write failure");
        }
        return promises.writeFile(filename, contents);
      },
    },
    fetchPackage: async (name) => ({ name, version: "2.0.0" }),
  });

  ok(error instanceof UpdateVersionsError);
  equal(error.errors[0].phase, "package write", "20.01");
  equal(error.updatedFiles.length, 1, "20.02");
  equal(error.updatedPackages["good-dependency"], "2.0.0", "20.03");
  equal(Object.hasOwn(error.updatedPackages, "bad-dependency"), false, "20.04");
  equal(
    (await readJson(goodPath)).dependencies["good-dependency"],
    "^2.0.0",
    "20.05",
  );
  equal(await promises.readFile(badPath, "utf8"), badOriginal, "20.06");
});

test("21 - CLI exits nonzero without success wording on malformed config", async () => {
  let tempFolder = temporaryDirectory();
  let packagePath = path.join(tempFolder, "package.json");
  let original = JSON.stringify({ name: "cli-failure-fixture" });
  await promises.writeFile(packagePath, original);
  await promises.writeFile(path.join(tempFolder, "upd.config.json"), "{");
  let cliError;

  try {
    await execa(path.join(__dirname2, "../", "cli.js"), { cwd: tempFolder });
  } catch (error) {
    cliError = error;
  }

  equal(cliError.exitCode, 1, "21.01");
  match(cliError.stderr, /config validation/);
  match(cliError.stderr, /THROW_ID_01/);
  not.match(cliError.stdout, /all updated|up-to-date/i);
  equal(await promises.readFile(packagePath, "utf8"), original, "21.02");
});

test("22 - module mode blocks major updates for module packages", async () => {
  let tempFolder = temporaryDirectory();
  let packagePath = path.join(tempFolder, "package.json");
  let original = JSON.stringify({
    name: "module-mode-fixture",
    dependencies: { alpha: "^1.0.0" },
  });
  await promises.writeFile(packagePath, original);

  let updated = await updateVersions({
    cwd: tempFolder,
    fetchPackage: async (name) => ({
      name,
      type: "module",
      version: "2.0.0",
    }),
    moduleMode: true,
  });

  equal(await promises.readFile(packagePath, "utf8"), original, "22.01");
  equal(updated, {}, "22.02");
});

test("23 - CLI reports an accurate transform-failure summary", async () => {
  let tempFolder = temporaryDirectory();
  let packagePath = path.join(tempFolder, "package.json");
  let original = JSON.stringify({
    name: "cli-transform-failure-fixture",
    dependencies: { alpha: 123 },
  });
  await promises.writeFile(packagePath, original);
  let cliError;

  try {
    await execa(path.join(__dirname2, "../", "cli.js"), { cwd: tempFolder });
  } catch (error) {
    cliError = error;
  }

  equal(cliError.exitCode, 1, "23.01");
  match(cliError.stdout, /completed with 1 failure; 0 updated, 0 unchanged/);
  not.match(cliError.stdout, /all updated|up-to-date/i);
  match(cliError.stderr, /package transform/);
  match(
    cliError.stderr,
    /update-versions\/updateVersions\(\): \[THROW_ID_07\]/,
  );
  equal(await promises.readFile(packagePath, "utf8"), original, "23.02");
});

test("24 - workspace aliases and relative paths retain their targets", async () => {
  let tempFolder = temporaryDirectory();
  let packagePath = path.join(tempFolder, "package.json");
  await writeJson(packagePath, {
    name: "workspace-target-fixture",
    dependencies: {
      "external-alias": "workspace:actual-package@^1.0.0",
      "scoped-alias": "workspace:@scope/actual@~1.0.0",
      "generic-alias": "workspace:generic-target@*",
      "blocked-alias": "workspace:blocked-target@^1.0.0",
      "relative-parent": "workspace:../package2",
      "relative-current": "workspace:./vendor3/package4",
    },
    devDependencies: {
      "pinned-alias": "workspace:pinned-target@^1.0.0",
      "pinned-workspace-alias": "workspace:pinned-workspace-target@~1.0.0",
      "pinned-path": "workspace:../pinned5",
    },
  });
  await writeJson(path.join(tempFolder, "upd.config.json"), {
    noMajorBumping: ["blocked-alias"],
    pin: {
      "pinned-alias": "2.3.4",
      "pinned-workspace-alias": "workspace:^5.6.7",
      "pinned-path": "9.9.9",
    },
  });
  let registryCalls = [];

  await updateVersions({
    cwd: tempFolder,
    fetchPackage: async (name) => {
      registryCalls.push(name);
      return {
        name,
        version: name === "actual-package" ? "3.0.0" : "2.0.0",
      };
    },
  });
  let received = await readJson(packagePath);

  equal(
    received.dependencies["external-alias"],
    "workspace:actual-package@^3.0.0",
    "24.01",
  );
  equal(
    received.dependencies["scoped-alias"],
    "workspace:@scope/actual@~2.0.0",
    "24.02",
  );
  equal(
    received.dependencies["generic-alias"],
    "workspace:generic-target@*",
    "24.03",
  );
  equal(
    received.dependencies["blocked-alias"],
    "workspace:blocked-target@^1.0.0",
    "24.04",
  );
  equal(
    received.dependencies["relative-parent"],
    "workspace:../package2",
    "24.05",
  );
  equal(
    received.dependencies["relative-current"],
    "workspace:./vendor3/package4",
    "24.06",
  );
  equal(
    received.devDependencies["pinned-alias"],
    "workspace:pinned-target@2.3.4",
    "24.07",
  );
  equal(
    received.devDependencies["pinned-workspace-alias"],
    "workspace:pinned-workspace-target@^5.6.7",
    "24.08",
  );
  equal(
    received.devDependencies["pinned-path"],
    "workspace:../pinned5",
    "24.09",
  );
  equal(
    registryCalls.sort(),
    ["@scope/actual", "actual-package", "blocked-target", "generic-target"],
    "24.10",
  );
});

test("25 - workspace aliases resolve local target package versions", async () => {
  let tempFolder = temporaryDirectory();
  let localFolder = path.join(tempFolder, "packages", "foo");
  mkdirSync(localFolder, { recursive: true });
  let packagePath = path.join(tempFolder, "package.json");
  await writeJson(packagePath, {
    name: "local-alias-root",
    dependencies: { bar: "workspace:foo@^1.0.0" },
  });
  await writeJson(path.join(localFolder, "package.json"), {
    name: "foo",
    version: "4.0.0",
  });
  let registryCalls = 0;

  await updateVersions({
    cwd: tempFolder,
    fetchPackage: async (name) => {
      registryCalls += 1;
      return { name, version: "9.0.0" };
    },
  });

  equal(
    (await readJson(packagePath)).dependencies.bar,
    "workspace:foo@^4.0.0",
    "25.01",
  );
  equal(registryCalls, 0, "25.02");
});

test("26 - CLI reports successful metadata-only cleanup", async () => {
  let tempFolder = temporaryDirectory();
  let packagePath = path.join(tempFolder, "package.json");
  await writeJson(packagePath, {
    name: "metadata-cleanup-fixture",
    version: "1.0.0",
    gitHead: "abcdef",
  });

  let result = await execa(path.join(__dirname2, "../", "cli.js"), {
    cwd: tempFolder,
  });
  let received = await readJson(packagePath);

  equal(result.exitCode, 0, "26.01");
  match(
    result.stdout,
    /1 package\.json file updated \(metadata cleanup only\)/,
  );
  not.match(result.stdout, /everything was already up-to-date/);
  equal(Object.hasOwn(received, "gitHead"), false, "26.02");
});

test("27 - non-object package manifests use the ordered throw prefix", async () => {
  let tempFolder = temporaryDirectory();
  let packagePath = path.join(tempFolder, "package.json");
  await promises.writeFile(packagePath, "[]");
  let registryCalls = 0;
  let writes = 0;

  let error = await captureUpdateError({
    cwd: tempFolder,
    effects: {
      writeTextFile: async (...args) => {
        writes += 1;
        return promises.writeFile(...args);
      },
    },
    fetchPackage: async (name) => {
      registryCalls += 1;
      return { name, version: "2.0.0" };
    },
  });

  ok(error instanceof UpdateVersionsError);
  equal(error.errors[0].phase, "package parse", "27.01");
  match(
    error.errors[0].cause.message,
    /^update-versions\/updateVersions\(\): \[THROW_ID_08\]/,
  );
  equal(registryCalls, 0, "27.02");
  equal(writes, 0, "27.03");
  equal(await promises.readFile(packagePath, "utf8"), "[]", "27.04");
});

test("28 - no-major rules read digit-bearing alias selectors", async () => {
  let tempFolder = temporaryDirectory();
  let packagePath = path.join(tempFolder, "package.json");
  await writeJson(packagePath, {
    name: "digit-alias-fixture",
    dependencies: {
      "same-alias": "workspace:foo2.same@^1.0.0",
    },
    devDependencies: {
      "blocked-alias": "workspace:foo2.blocked@^1.0.0",
    },
  });
  await writeJson(path.join(tempFolder, "upd.config.json"), {
    noMajorBumping: ["same-alias", "blocked-alias"],
  });

  await updateVersions({
    cwd: tempFolder,
    fetchPackage: async (name) => ({
      name,
      version: name === "foo2.same" ? "1.5.0" : "2.0.0",
    }),
  });
  let received = await readJson(packagePath);

  equal(
    received.dependencies["same-alias"],
    "workspace:foo2.same@^1.5.0",
    "28.01",
  );
  equal(
    received.devDependencies["blocked-alias"],
    "workspace:foo2.blocked@^1.0.0",
    "28.02",
  );
});

test("29 - configuration rejects padded names and pin values", async () => {
  let invalidConfigs = [
    {
      expectedThrowId: "THROW_ID_04",
      value: { noMajorBumping: [" alpha"] },
    },
    {
      expectedThrowId: "THROW_ID_06",
      value: { pin: { "alpha ": "1.2.3" } },
    },
    {
      expectedThrowId: "THROW_ID_06",
      value: { pin: { alpha: " 1.2.3 " } },
    },
  ];

  for (let { expectedThrowId, value } of invalidConfigs) {
    let tempFolder = temporaryDirectory();
    let packagePath = path.join(tempFolder, "package.json");
    let original = JSON.stringify({
      name: "padded-config-fixture",
      dependencies: { alpha: "^1.0.0" },
    });
    await promises.writeFile(packagePath, original);
    await writeJson(path.join(tempFolder, "upd.config.json"), value);
    let registryCalls = 0;
    let writes = 0;

    let error = await captureUpdateError({
      cwd: tempFolder,
      effects: {
        writeTextFile: async (...args) => {
          writes += 1;
          return promises.writeFile(...args);
        },
      },
      fetchPackage: async (name) => {
        registryCalls += 1;
        return { name, version: "2.0.0" };
      },
    });

    ok(error instanceof UpdateVersionsError);
    is(error.errors[0].phase, "config validation");
    match(error.errors[0].cause.message, new RegExp(expectedThrowId));
    is(registryCalls, 0);
    is(writes, 0);
    is(await promises.readFile(packagePath, "utf8"), original);
  }
});

test.run();
