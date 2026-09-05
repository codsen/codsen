import { spawnSync } from "node:child_process";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { temporaryDirectoryTask } from "tempy";
import { test } from "uvu";
import { equal, match, ok } from "uvu/assert";
import { discoverFiles } from "../discover-files.js";
import { formatTime, ProcessingError, processFiles } from "../process-files.js";

const cliPath = fileURLToPath(new URL("../cli.js", import.meta.url));
const { version } = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);

function runCli(cwd, ...args) {
  const env = { ...process.env, NO_UPDATE_NOTIFIER: "1" };
  delete env.FORCE_COLOR;
  delete env.NO_COLOR;
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    env,
    encoding: "utf8",
    timeout: 10000,
  });
}

test("01 - help takes precedence over file operands", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    const filename = path.join(cwd, "changelog.md");
    await writeFile(filename, "original");
    for (const flag of ["-h", "--help"]) {
      const result = runCli(cwd, flag, "changelog.md");
      equal(result.status, 0, "01.01");
      match(result.stdout, /Usage/, "01.02");
      equal(result.stderr, "", "01.03");
      equal(await readFile(filename, "utf8"), "original", "01.04");
    }
  });
});

test("02 - version takes precedence over file operands", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    for (const flag of ["-v", "--version"]) {
      const result = runCli(cwd, flag, "missing.md");
      equal(result.status, 0, "02.01");
      equal(result.stdout.trim(), version, "02.02");
      equal(result.stderr, "", "02.03");
      equal(await readdir(cwd), [], "02.04");
    }
  });
});

test("03 - empty default search and non-changelog operands report no matches", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    await writeFile(path.join(cwd, "notes.md"), "original");
    for (const args of [[], ["notes.md"], ["missing.md"]]) {
      const result = runCli(cwd, ...args);
      equal(result.status, 0, "03.01");
      match(result.stdout, /no changelogs found/, "03.02");
      equal(result.stderr, "", "03.03");
      equal(
        await readFile(path.join(cwd, "notes.md"), "utf8"),
        "original",
        "03.04",
      );
      equal(await readdir(cwd), ["notes.md"], "03.05");
    }
  });
});

test("04 - invalid paths report discovery errors and exit nonzero", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    const result = runCli(cwd, `${"a".repeat(1024)}.md`);
    equal(result.status, 1, "04.01");
    match(result.stdout, /Could not process the requested changelogs/, "04.02");
    equal(result.stdout.includes("no changelogs found"), false, "04.03");
    equal(await readdir(cwd), [], "04.04");
  });
});

test("05 - discovery preserves ordering, deduplicates and tolerates missing results", async () => {
  const calls = [];
  const results = [
    ["one/changelog.md", "notes.md"],
    undefined,
    ["one/changelog.md", "two/CHANGELOG.md"],
  ];
  const result = await discoverFiles(["one", "missing", "two"], {
    findFiles: async (...args) => {
      calls.push(args);
      return results.shift();
    },
  });
  equal(result, ["one/changelog.md", "two/CHANGELOG.md"], "05.01");
  equal(
    calls,
    [
      [["one", "!**/node_modules/**"]],
      [["missing", "!**/node_modules/**"]],
      [["two", "!**/node_modules/**"]],
    ],
    "05.02",
  );
});

test("06 - default discovery is case-insensitive and excludes dependencies", async () => {
  for (const input of [[], undefined]) {
    const calls = [];
    const result = await discoverFiles(input, {
      findFiles: async (...args) => {
        calls.push(args);
        return ["CHANGELOG.md"];
      },
    });
    equal(result, ["CHANGELOG.md"], "06.01");
    equal(
      calls,
      [
        [
          ["**/changelog.md", "!**/node_modules/**"],
          { caseSensitiveMatch: false },
        ],
      ],
      "06.02",
    );
  }
});

test("07 - elapsed time switches from milliseconds to rounded seconds", () => {
  equal(formatTime(0), "0ms", "07.01");
  equal(formatTime(999), "999ms", "07.02");
  equal(formatTime(1000), "1s", "07.03");
  equal(formatTime(1499), "1s", "07.04");
  equal(formatTime(1500), "2s", "07.05");
});

test("08 - invalid transform results are classified without writing", async () => {
  for (const result of [undefined, null, { res: 123 }]) {
    const logs = [];
    const writes = [];
    let failure;
    try {
      await processFiles(["changelog.md"], {
        read: async () => "original",
        transform: () => result,
        write: async (...args) => writes.push(args),
        logger: (message) => logs.push(message),
      });
    } catch (error) {
      failure = error;
    }
    ok(failure instanceof ProcessingError, "08.01");
    equal(failure.failures[0].stage, "transform", "08.02");
    equal(
      failure.failures[0].error.message,
      "The changelog transform did not return text",
      "08.03",
    );
    equal(failure.successful, [], "08.04");
    equal(writes, [], "08.05");
    match(logs.join("\n"), /1 failed \(changelog\.md\)/, "08.06");
  }
});

test("09 - empty and unchanged transformations skip writes", async () => {
  for (const result of ["", "original"]) {
    const writes = [];
    const logs = [];
    const outcome = await processFiles(["changelog.md"], {
      read: async () => "original",
      transform: () => ({ res: result }),
      write: async (...args) => writes.push(args),
      logger: (message) => logs.push(message),
    });
    equal(
      outcome,
      { failures: [], skipped: ["changelog.md"], successful: [] },
      "09.01",
    );
    equal(writes, [], "09.02");
    match(logs.join("\n"), /1 skipped/, "09.03");
  }
});

test("10 - atomic writes create a missing destination without temporary debris", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    const filename = path.join(cwd, "changelog.md");
    const outcome = await processFiles([filename], {
      read: async () => "original",
      transform: () => ({ res: "cleaned" }),
      logger: () => {},
    });
    equal(
      outcome,
      { failures: [], skipped: [], successful: [filename] },
      "10.01",
    );
    equal(await readFile(filename, "utf8"), "cleaned", "10.02");
    equal(await readdir(cwd), ["changelog.md"], "10.03");
  });
});

test("11 - failed atomic replacement removes its temporary file", async () => {
  await temporaryDirectoryTask(async (cwd) => {
    const filename = path.join(cwd, "changelog.md");
    await mkdir(filename);
    let failure;
    try {
      await processFiles([filename], {
        read: async () => "original",
        transform: () => ({ res: "cleaned" }),
        logger: () => {},
      });
    } catch (error) {
      failure = error;
    }
    ok(failure instanceof ProcessingError, "11.01");
    equal(failure.failures[0].path, filename, "11.02");
    equal(failure.failures[0].stage, "write", "11.03");
    equal(failure.successful, [], "11.04");
    equal((await stat(filename)).isDirectory(), true, "11.05");
    equal(await readdir(cwd), ["changelog.md"], "11.06");
  });
});

test("12 - multiple non-Error failures are normalized in the aggregate", async () => {
  const logs = [];
  let failure;
  try {
    await processFiles(["one/changelog.md", "two/changelog.md"], {
      read: async () => {
        throw "read rejected";
      },
      logger: (message) => logs.push(message),
    });
  } catch (error) {
    failure = error;
  }
  ok(failure instanceof ProcessingError, "12.01");
  equal(failure.message, "2 changelogs could not be cleaned", "12.02");
  equal(
    failure.errors.map((error) => error.message),
    ["read rejected", "read rejected"],
    "12.03",
  );
  equal(failure.successful, [], "12.04");
  equal(failure.skipped, [], "12.05");
  match(
    logs.join("\n"),
    /2 failed \(one\/changelog\.md, two\/changelog\.md\)/,
    "12.06",
  );
});

test("13 - an empty programmatic batch succeeds without file operations", async () => {
  const logs = [];
  const result = await processFiles([], {
    logger: (message) => logs.push(message),
  });
  equal(result, { failures: [], skipped: [], successful: [] }, "13.01");
  equal(logs.length, 1, "13.02");
  equal(logs[0].includes("failed"), false, "13.03");
});

test.run();
