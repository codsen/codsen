import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { test } from "uvu";
import { equal as assertEqual, is, match, throws } from "uvu/assert";

import { glob, globSync, version } from "../dist/codsen-glob.esm.js";

const fixture = mkdtempSync(path.join(tmpdir(), "codsen-glob-"));

function equal(actual, expected, message) {
  assertEqual(
    Array.isArray(actual) ? [...actual].sort() : actual,
    Array.isArray(expected) ? [...expected].sort() : expected,
    message,
  );
}

function add(relativePath, contents = "") {
  const absolutePath = path.join(fixture, relativePath);
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, contents);
}

function removingSignal(location) {
  let reads = 0;
  return {
    get aborted() {
      if (++reads === 2) {
        rmSync(location, { force: true, recursive: true });
      }
      return false;
    },
  };
}

function unreadableSignal(location) {
  let reads = 0;
  return {
    get aborted() {
      if (++reads === 2) {
        chmodSync(location, 0o000);
      }
      return false;
    },
  };
}

add("README.md");
add("alpha.js");
add("beta.ts");
add("data-1.json");
add("data-2.json");
add("data-3.json");
add("UPPER.JSON");
add(".hidden.json");
add("nested/one.js");
add("nested/two.ts");
add("nested/.dot/deep.json");
add("nested/deeper/three.js");
add("padded/01.txt");
add("padded/02.txt");
add("padded/03.txt");
add("padded/-01.txt");
add("padded/-02.txt");
add("ext/foo.ext-test");
add("ext/bar.ext-test");
add("ext/baz.ext-test");
add("ext/foobar.ext-test");
add("unreadable/file.js");
add("node_modules/pkg/index.js");
add("test/fixture.js");

test.after(() => {
  rmSync(fixture, { force: true, recursive: true });
});

test("01 - exposes its version and handles escaped patterns", () => {
  is(version, "1.0.0");
  equal(globSync("alpha.js\\", { cwd: fixture }), [], "01.01");
});

test("02 - matches literals, stars, question marks, and classes", () => {
  equal(globSync("*.js", { cwd: fixture }), ["alpha.js"], "02.01");
  equal(
    globSync("data-?.json", { cwd: fixture }),
    ["data-1.json", "data-2.json", "data-3.json"],
    "02.02",
  );
  equal(
    globSync("data-[12].json", { cwd: fixture }),
    ["data-1.json", "data-2.json"],
    "02.03",
  );
  equal(
    globSync("data-[!1].json", { cwd: fixture }),
    ["data-2.json", "data-3.json"],
    "02.04",
  );
  equal(globSync("data-[.json", { cwd: fixture }), [], "02.05");
  equal(
    globSync("data-[^1].json", { cwd: fixture }),
    ["data-2.json", "data-3.json"],
    "02.06",
  );
  equal(
    globSync("**/**/**.js", { cwd: fixture }),
    [
      "alpha.js",
      "nested/deeper/three.js",
      "nested/one.js",
      "node_modules/pkg/index.js",
      "test/fixture.js",
      "unreadable/file.js",
    ],
    "02.07",
  );
  equal(globSync("[[:alpha:]]*.js", { cwd: fixture }), ["alpha.js"], "02.08");
});

test("03 - implements globstar and dot-file rules", async () => {
  equal(
    await glob("**/*.js", { cwd: fixture }),
    [
      "alpha.js",
      "nested/deeper/three.js",
      "nested/one.js",
      "node_modules/pkg/index.js",
      "test/fixture.js",
      "unreadable/file.js",
    ],
    "03.01",
  );
  equal(
    await glob("**/*.json", { cwd: fixture }),
    ["data-1.json", "data-2.json", "data-3.json"],
    "03.02",
  );
  equal(
    await glob("**/*.json", { cwd: fixture, dot: true }),
    [
      ".hidden.json",
      "data-1.json",
      "data-2.json",
      "data-3.json",
      "nested/.dot/deep.json",
    ],
    "03.03",
  );
  equal(
    await glob("nested/**", { cwd: fixture }),
    ["nested/deeper/three.js", "nested/one.js", "nested/two.ts"],
    "03.04",
  );
  is(
    (await glob("**", { cwd: fixture })).includes("nested/.dot/deep.json"),
    false,
  );
  equal(
    await glob("nested/.dot/**/*.json", { cwd: fixture }),
    ["nested/.dot/deep.json"],
    "03.05",
  );
});

test("04 - supports brace choices, ranges, and nested braces", () => {
  equal(
    globSync("*.{js,ts}", { cwd: fixture }),
    ["alpha.js", "beta.ts"],
    "04.01",
  );
  equal(
    globSync("{alpha,nested/one}.js", { cwd: fixture }),
    ["alpha.js", "nested/one.js"],
    "04.02",
  );
  equal(
    globSync("data-{1..3..2}.json", { cwd: fixture }),
    ["data-1.json", "data-3.json"],
    "04.03",
  );
  equal(
    globSync("data-{3..1..2}.json", { cwd: fixture }),
    ["data-1.json", "data-3.json"],
    "04.04",
  );
  equal(
    globSync("data-{3..1}.json", { cwd: fixture }),
    ["data-1.json", "data-2.json", "data-3.json"],
    "04.05",
  );
  equal(
    globSync("{alpha,{beta,nested/two}}.{js,ts}", { cwd: fixture }),
    ["alpha.js", "beta.ts", "nested/two.ts"],
    "04.06",
  );
  equal(globSync("data-{1..3..0}.json", { cwd: fixture }), [], "04.07");
  equal(globSync("data-{a..c..0}.json", { cwd: fixture }), [], "04.08");
  equal(globSync("data-{1}.json", { cwd: fixture }), [], "04.09");
  equal(globSync("data-{1.json", { cwd: fixture }), [], "04.10");
  equal(globSync(String.raw`data-\{1,2}.json`, { cwd: fixture }), [], "04.11");
  equal(
    globSync("padded/{01..03}.txt", { cwd: fixture }),
    ["padded/01.txt", "padded/02.txt", "padded/03.txt"],
    "04.12",
  );
  equal(
    globSync("padded/{-01..-02}.txt", { cwd: fixture }),
    ["padded/-01.txt", "padded/-02.txt"],
    "04.13",
  );
});

test("05 - supports common extglobs and escaped metacharacters", () => {
  equal(
    globSync("@(alpha|missing).js", { cwd: fixture }),
    ["alpha.js"],
    "05.01",
  );
  equal(globSync("+(alpha).js", { cwd: fixture }), ["alpha.js"], "05.02");
  equal(globSync("?(alpha).js", { cwd: fixture }), ["alpha.js"], "05.03");
  equal(globSync("*(alpha).js", { cwd: fixture }), ["alpha.js"], "05.04");
  equal(globSync("!(beta).js", { cwd: fixture }), [], "05.05");
  equal(
    globSync(String.raw`alpha\.js`, { cwd: fixture }),
    ["alpha.js"],
    "05.06",
  );
  equal(
    globSync("@(alpha.js|nested/one.js)", { cwd: fixture }),
    ["alpha.js"],
    "05.07",
  );
  equal(globSync("@(alpha.js|nested/one.js", { cwd: fixture }), [], "05.08");
  equal(globSync("@(alpha|beta", { cwd: fixture }), [], "05.09");
  equal(globSync("[alpha.js", { cwd: fixture }), [], "05.10");
  equal(globSync("{alpha.js", { cwd: fixture }), [], "05.11");
  equal(
    globSync("**.js", { cwd: fixture }),
    [
      "alpha.js",
      "nested/deeper/three.js",
      "nested/one.js",
      "node_modules/pkg/index.js",
      "test/fixture.js",
      "unreadable/file.js",
    ],
    "05.12",
  );
  equal(globSync("{a..c}lpha.js", { cwd: fixture }), ["alpha.js"], "05.13");
  equal(globSync("{c..a}lpha.js", { cwd: fixture }), ["alpha.js"], "05.14");
  equal(globSync("{a..c..2}lpha.js", { cwd: fixture }), ["alpha.js"], "05.15");
  equal(
    globSync("**/!(test).js", { cwd: fixture }),
    [
      "alpha.js",
      "nested/deeper/three.js",
      "nested/one.js",
      "node_modules/pkg/index.js",
      "test/fixture.js",
      "unreadable/file.js",
    ],
    "05.16",
  );
  equal(
    globSync("@(alpha|(beta|missing)).js", { cwd: fixture }),
    ["alpha.js"],
    "05.17",
  );
  equal(
    globSync("{alpha,{beta,gamma}}.js", { cwd: fixture }),
    ["alpha.js"],
    "05.18",
  );
  equal(
    globSync("@(alpha|be{ta,gamma}).js", { cwd: fixture }),
    ["alpha.js"],
    "05.19",
  );
  equal(
    globSync(String.raw`@(alpha\|beta|missing).js`, { cwd: fixture }),
    [],
    "05.20",
  );
  equal(
    globSync("ext/!(foo|bar).ext-test", { cwd: fixture }),
    ["ext/baz.ext-test"],
    "05.21",
  );
  equal(
    globSync("**/@(one.js|deeper/three.js)", { cwd: fixture }),
    ["nested/deeper/three.js", "nested/one.js"],
    "05.22",
  );
  equal(globSync("***.js", { cwd: fixture }), ["alpha.js"], "05.23");
  equal(
    globSync("**.*", { cwd: fixture }),
    [
      "README.md",
      "UPPER.JSON",
      "alpha.js",
      "beta.ts",
      "data-1.json",
      "data-2.json",
      "data-3.json",
    ],
    "05.24",
  );
  add("negative/alpha.js");
  add("negative/alpha.ts");
  add("negative/foo.js.map");
  add("negative/package.json");
  add("negative/testing.js");
  equal(
    globSync("negative/!(*.js)", { cwd: fixture }),
    ["negative/alpha.ts", "negative/foo.js.map", "negative/package.json"],
    "05.25",
  );
  equal(
    globSync("negative/!(*test).js", { cwd: fixture }),
    ["negative/alpha.js", "negative/testing.js"],
    "05.26",
  );
  rmSync(path.join(fixture, "negative"), { force: true, recursive: true });
});

test("06 - negatives are ordered and ignore always vetoes", async () => {
  equal(
    await glob(["**/*.js", "!**/node_modules/**"], { cwd: fixture }),
    [
      "alpha.js",
      "nested/deeper/three.js",
      "nested/one.js",
      "test/fixture.js",
      "unreadable/file.js",
    ],
    "06.01",
  );
  equal(
    await glob(["*.js", "!alpha.js", "alpha.js"], { cwd: fixture }),
    ["alpha.js"],
    "06.02",
  );
  equal(
    await glob("**/*.js", {
      cwd: fixture,
      ignore: ["**/node_modules/**", "**/test/**"],
    }),
    [
      "alpha.js",
      "nested/deeper/three.js",
      "nested/one.js",
      "unreadable/file.js",
    ],
    "06.03",
  );
  equal(await glob("*.js", { cwd: fixture, ignore: "alpha.js" }), [], "06.04");
  is(
    globSync("**/*.js", { cwd: fixture, ignore: "alpha.js" }).includes(
      "alpha.js",
    ),
    false,
  );
  equal(
    await glob("*.js", {
      cwd: fixture,
      ignore: path.join(fixture, "alpha.js"),
    }),
    [],
    "06.05",
  );
  equal(await glob(["!*.js"]), [], "06.06");
  equal(await glob([]), [], "06.07");
  equal(globSync(["!*.js"]), [], "06.08");
  equal(globSync([]), [], "06.09");
  is(
    (
      await glob(["**/*.js", "!nested"], {
        cwd: fixture,
      })
    ).includes("nested/one.js"),
    false,
  );
  equal(await glob("*.js", { cwd: fixture, ignore: "!alpha.js" }), [], "06.10");
  equal(globSync(["*.js", "!*.js", "*.js"], { cwd: fixture }), [], "06.11");
  is(
    globSync(["**/*.json", "README.md", "!**/node_modules/**"], {
      cwd: fixture,
    }).includes("README.md"),
    true,
  );
  equal(globSync("*.js", { cwd: fixture, ignore: "!alpha.js" }), [], "06.12");
});

test("07 - supports case control, absolute patterns, and absolute output", () => {
  equal(
    globSync("*.json", { cwd: fixture }),
    ["data-1.json", "data-2.json", "data-3.json"],
    "07.01",
  );
  equal(
    globSync("*.json", { caseSensitiveMatch: false, cwd: fixture }),
    ["data-1.json", "data-2.json", "data-3.json", "UPPER.JSON"],
    "07.02",
  );
  equal(
    globSync(path.join(fixture, "*.js")),
    [path.join(fixture, "alpha.js")],
    "07.03",
  );
  equal(
    globSync("*.js", { absolute: true, cwd: fixture }),
    [path.join(fixture, "alpha.js")],
    "07.04",
  );
  is(
    globSync(["**/*.json", "!**/node_modules/**"], {
      absolute: true,
      cwd: fixture,
    }).every((file) => path.isAbsolute(file)),
    true,
  );
  equal(
    globSync([
      path.join(fixture, "**/*.js"),
      `!${path.join(fixture, "test/**")}`,
    ]),
    [
      path.join(fixture, "alpha.js"),
      path.join(fixture, "nested/deeper/three.js"),
      path.join(fixture, "nested/one.js"),
      path.join(fixture, "node_modules/pkg/index.js"),
      path.join(fixture, "unreadable/file.js"),
    ],
    "07.05",
  );
});

test("08 - expands literal directories with configurable file filters", async () => {
  equal(
    await glob("nested", { cwd: fixture }),
    ["nested/deeper/three.js", "nested/one.js", "nested/two.ts"],
    "08.01",
  );
  equal(
    await glob("nested", {
      cwd: fixture,
      expandDirectories: { files: ["*.js"] },
    }),
    ["nested/deeper/three.js", "nested/one.js"],
    "08.02",
  );
  equal(
    await glob("nested", {
      cwd: fixture,
      expandDirectories: { extensions: ["ts"] },
    }),
    ["nested/two.ts"],
    "08.03",
  );
  equal(
    await glob("nested", {
      cwd: fixture,
      expandDirectories: { extensions: ["js", "ts"], files: ["*"] },
    }),
    ["nested/deeper/three.js", "nested/one.js", "nested/two.ts"],
    "08.04",
  );
  equal(
    await glob("nested", {
      cwd: fixture,
      expandDirectories: ["*.ts"],
    }),
    ["nested/two.ts"],
    "08.05",
  );
  equal(
    await glob("nested", { cwd: fixture, expandDirectories: false }),
    [],
    "08.06",
  );
  equal(
    globSync("nested", {
      cwd: fixture,
      expandDirectories: { files: ["*.js"] },
    }),
    ["nested/deeper/three.js", "nested/one.js"],
    "08.07",
  );
  equal(
    await glob("nested", {
      cwd: fixture,
      expandDirectories: false,
      onlyDirectories: true,
    }),
    ["nested"],
    "08.08",
  );
  equal(
    globSync("nested", {
      cwd: fixture,
      expandDirectories: false,
      onlyDirectories: true,
    }),
    ["nested"],
    "08.09",
  );
  equal(
    await glob(path.join(fixture, "alpha.js")),
    [path.join(fixture, "alpha.js")],
    "08.10",
  );
  equal(
    globSync(path.join(fixture, "alpha.js")),
    [path.join(fixture, "alpha.js")],
    "08.11",
  );
  add("dying-async/file.js");
  equal(
    await glob("dying-async/**/*.js", {
      cwd: fixture,
      signal: removingSignal(path.join(fixture, "dying-async")),
    }),
    [],
    "08.12",
  );
  add("dying-sync/file.js");
  equal(
    globSync("dying-sync/**/*.js", {
      cwd: fixture,
      signal: removingSignal(path.join(fixture, "dying-sync")),
    }),
    [],
    "08.13",
  );
  add("blocked-async/file.js");
  await glob("blocked-async/**/*.js", {
    cwd: fixture,
    signal: unreadableSignal(path.join(fixture, "blocked-async")),
  }).then(
    () => {
      throw new Error("expected a rejection");
    },
    (error) => is(error.code, "EACCES"),
  );
  chmodSync(path.join(fixture, "blocked-async"), 0o700);
  rmSync(path.join(fixture, "blocked-async"), { force: true, recursive: true });
  add("blocked-sync/file.js");
  throws(
    () =>
      globSync("blocked-sync/**/*.js", {
        cwd: fixture,
        signal: unreadableSignal(path.join(fixture, "blocked-sync")),
      }),
    /EACCES|permission denied/,
  );
  chmodSync(path.join(fixture, "blocked-sync"), 0o700);
  rmSync(path.join(fixture, "blocked-sync"), { force: true, recursive: true });
});

test("09 - can return directories as well as files", async () => {
  equal(
    globSync("nested/*", { cwd: fixture, onlyDirectories: true }),
    ["nested/deeper"],
    "09.01",
  );
  equal(
    globSync("nested/*", { cwd: fixture, onlyFiles: false }),
    ["nested/deeper", "nested/one.js", "nested/two.ts"],
    "09.02",
  );
  equal(
    await glob("nested/*", { cwd: fixture, onlyFiles: false }),
    ["nested/deeper", "nested/one.js", "nested/two.ts"],
    "09.03",
  );
  equal(
    globSync(["*", "!**/node_modules/**"], {
      cwd: fixture,
      onlyDirectories: true,
    }),
    ["ext", "nested", "padded", "test", "unreadable"],
    "09.04",
  );
});

test("10 - follows symlinks by default and avoids cycles", async () => {
  try {
    symlinkSync(
      path.join(fixture, "nested"),
      path.join(fixture, "linked"),
      "dir",
    );
    symlinkSync(
      path.join(fixture, "alpha.js"),
      path.join(fixture, "linked.js"),
    );
    symlinkSync(
      path.join(fixture, "nested"),
      path.join(fixture, "nested", "cycle"),
      "dir",
    );
    symlinkSync(path.join(fixture, "missing"), path.join(fixture, "broken"));
  } catch (error) {
    if (process.platform === "win32") {
      return;
    }
    throw error;
  }

  equal(
    await glob("linked/**/*.js", { cwd: fixture }),
    ["linked/deeper/three.js", "linked/one.js"],
    "10.01",
  );
  equal(
    await glob(["linked.js", "broken"], { cwd: fixture }),
    ["linked.js"],
    "10.02",
  );
  equal(
    await glob(path.join(fixture, "linked.js")),
    [path.join(fixture, "linked.js")],
    "10.03",
  );
  equal(
    await glob(path.join(fixture, "linked.js"), { onlyDirectories: true }),
    [],
    "10.04",
  );
  equal(
    await glob(path.join(fixture, "linked.js"), {
      followSymbolicLinks: false,
    }),
    [],
    "10.05",
  );
  equal(
    globSync(path.join(fixture, "linked.js")),
    [path.join(fixture, "linked.js")],
    "10.06",
  );
  equal(
    globSync(path.join(fixture, "linked.js"), { onlyDirectories: true }),
    [],
    "10.07",
  );
  equal(
    globSync(path.join(fixture, "linked.js"), {
      followSymbolicLinks: false,
    }),
    [],
    "10.08",
  );
  equal(
    await glob("linked", {
      cwd: fixture,
      expandDirectories: false,
      onlyDirectories: true,
    }),
    ["linked"],
    "10.09",
  );
  equal(
    await glob("linked/**/*.js", {
      cwd: fixture,
      followSymbolicLinks: false,
    }),
    ["linked/deeper/three.js", "linked/one.js"],
    "10.10",
  );
  equal(
    globSync("linked/**/*.js", { cwd: fixture }),
    ["linked/deeper/three.js", "linked/one.js"],
    "10.11",
  );
  equal(
    globSync(["linked.js", "broken"], { cwd: fixture }),
    ["linked.js"],
    "10.12",
  );
  equal(
    globSync("linked", {
      cwd: fixture,
      expandDirectories: false,
      onlyDirectories: true,
    }),
    ["linked"],
    "10.13",
  );
  equal(
    globSync("linked/**/*.js", {
      cwd: fixture,
      followSymbolicLinks: false,
    }),
    ["linked/deeper/three.js", "linked/one.js"],
    "10.14",
  );
  is((await glob("**/*.js", { cwd: fixture })).includes("linked/one.js"), true);
  is(globSync("**/*.js", { cwd: fixture }).includes("linked/one.js"), true);
  is(
    (
      await glob("**/*", {
        cwd: fixture,
        onlyFiles: false,
      })
    ).includes("linked"),
    true,
  );
  is(
    (
      await glob("*", {
        cwd: fixture,
        onlyFiles: false,
      })
    ).includes("broken"),
    true,
  );
  is(
    (
      await glob("*", {
        cwd: fixture,
        onlyFiles: false,
      })
    ).includes(""),
    false,
  );
  is(
    globSync("**/*", { cwd: fixture, onlyFiles: false }).includes("linked"),
    true,
  );
  is(
    globSync("*", { cwd: fixture, onlyFiles: false }).includes("broken"),
    true,
  );
  is(
    globSync("**", { cwd: fixture, onlyDirectories: true }).includes(""),
    false,
  );
});

test("11 - accepts URL working directories and missing roots", async () => {
  equal(
    await glob("*.js", { cwd: pathToFileURL(`${fixture}/`) }),
    ["alpha.js", "linked.js"],
    "11.01",
  );
  equal(await glob("missing/**/*.js", { cwd: fixture }), [], "11.02");
  equal(globSync("missing/**/*.js", { cwd: fixture }), [], "11.03");
  equal(
    await glob("*.js", { cwd: path.join(fixture, "missing-cwd") }),
    [],
    "11.04",
  );
  equal(
    globSync("*.js", { cwd: path.join(fixture, "missing-cwd") }),
    [],
    "11.05",
  );
  equal(
    await glob("*.js", { cwd: path.join(fixture, "alpha.js", "child") }),
    [],
    "11.06",
  );
  equal(
    globSync("*.js", { cwd: path.join(fixture, "alpha.js", "child") }),
    [],
    "11.07",
  );
});

test("12 - rejects invalid input with stable identifiers", async () => {
  throws(() => globSync(123), /\[THROW_ID_01\]/);
  throws(() => globSync(["*.js", 123]), /\[THROW_ID_01\]/);
  throws(() => globSync("*.js", { cwd: 123 }), /\[THROW_ID_02\]/);
  throws(() => globSync("*.js", { ignore: 123 }), /\[THROW_ID_03\]/);
  throws(() => globSync("*.js", { ignore: [123] }), /\[THROW_ID_03\]/);
  throws(
    () => globSync("*.js", { cwd: path.join(fixture, "alpha.js") }),
    /codsen-glob\/globSync\(\): \[THROW_ID_04\]/,
  );
  throws(
    () => globSync("*.js", { cwd: "\0" }),
    /null bytes|without null bytes/,
  );
  throws(
    () => globSync("\0", { cwd: fixture }),
    /null bytes|without null bytes/,
  );
  await glob(123).then(
    () => {
      throw new Error("expected a rejection");
    },
    (error) => match(error.message, /\[THROW_ID_01\]/),
  );
  await glob("*.js", { cwd: path.join(fixture, "alpha.js") }).then(
    () => {
      throw new Error("expected a rejection");
    },
    (error) => match(error.message, /codsen-glob\/glob\(\): \[THROW_ID_04\]/),
  );
  await glob("*.js", { cwd: "\0" }).then(
    () => {
      throw new Error("expected a rejection");
    },
    (error) => match(error.message, /null bytes|without null bytes/),
  );
  await glob("\0", { cwd: fixture }).then(
    () => {
      throw new Error("expected a rejection");
    },
    (error) => match(error.message, /null bytes|without null bytes/),
  );
});

test("13 - honours pre-aborted signals", async () => {
  const controller = new AbortController();
  controller.abort();
  throws(
    () => globSync("**/*.js", { cwd: fixture, signal: controller.signal }),
    /aborted/,
  );
  await glob("**/*.js", { cwd: fixture, signal: controller.signal }).then(
    () => {
      throw new Error("expected a rejection");
    },
    (error) => is(error.name, "AbortError"),
  );
});

test("14 - preserves traversal, pattern, and re-inclusion order", async () => {
  assertEqual(
    await glob(["nested/**/*.js", "alpha.js"], { cwd: fixture }),
    ["nested/one.js", "nested/deeper/three.js", "alpha.js"],
    "14.01",
  );
  assertEqual(
    globSync(["*.json", "!data-1.json", "data-1.json"], { cwd: fixture }),
    ["data-2.json", "data-3.json", "data-1.json"],
    "14.02",
  );
});

test.run();
