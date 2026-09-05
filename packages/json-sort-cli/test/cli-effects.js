import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { temporaryDirectoryTask } from "tempy";
import { test } from "uvu";
import { equal, match } from "uvu/assert";

const cliPath = path.resolve("cli.js");
const mainUrl = pathToFileURL(path.resolve("cli-main.js")).href;

function runWithEffects(directory, args, effects, setup = "") {
  const environment = { ...process.env, NO_UPDATE_NOTIFIER: "1" };
  delete environment.FORCE_COLOR;
  delete environment.NO_COLOR;
  const wrapper = `
import { main } from ${JSON.stringify(mainUrl)};
process.argv = [process.execPath, ${JSON.stringify(cliPath)}, ...${JSON.stringify(args)}];
${setup}
await main(${effects});
`;
  return spawnSync(
    process.execPath,
    ["--input-type=module", "--eval", wrapper],
    {
      cwd: directory,
      encoding: "utf8",
      env: environment,
      timeout: 5000,
    },
  );
}

test("01 - inaccessible stdin falls back to file discovery", async () => {
  await temporaryDirectoryTask(async (directory) => {
    const result = runWithEffects(
      directory,
      [],
      `{
      statInput() { throw new Error("stdin is unavailable"); },
      findPaths: async () => [],
    }`,
    );

    equal(result.status, 0, "01.01");
    equal(
      result.stdout,
      "✨ json-sort-cli: The inputs don't lead to any JSON files. Exiting.\n",
      "01.02",
    );
    equal(result.stderr, "", "01.03");
  });
});

test("02 - interactive stdin is not inspected and notifier failures are nonfatal", async () => {
  await temporaryDirectoryTask(async (directory) => {
    const file = path.join(directory, "fixture.json");
    writeFileSync(file, '{"z":1,"a":2}');
    const result = runWithEffects(
      directory,
      [],
      `{
      statInput() { throw new Error("TTY stdin must not be inspected"); },
      notify() { throw new Error("notifier is unavailable"); },
    }`,
      "process.stdin.isTTY = true;",
    );

    equal(result.status, 0, "02.01");
    match(result.stdout, /All 1 file sorted/, "02.02");
    equal(result.stderr, "", "02.03");
    equal(readFileSync(file, "utf8"), '{\n  "a": 2,\n  "z": 1\n}\n', "02.04");
  });
});

test("03 - discovery infrastructure errors respect silent mode", async () => {
  await temporaryDirectoryTask(async (directory) => {
    const results = [[], ["--silent"]].map((flags) =>
      runWithEffects(
        directory,
        ["fixture.json", ...flags],
        `{
        findPaths: async () => { throw new Error("discovery unavailable"); },
      }`,
      ),
    );

    equal(
      results.map(({ status }) => status),
      [1, 1],
      "03.01",
    );
    equal(
      results.map(({ stdout }) => stdout),
      ["", ""],
      "03.02",
    );
    equal(
      results.map(({ stderr }) => stderr),
      ["✨ json-sort-cli: Error: discovery unavailable\n", ""],
      "03.03",
    );
  });
});

test("04 - unexpected processing errors respect silent mode", async () => {
  await temporaryDirectoryTask(async (directory) => {
    const results = [[], ["--silent"]].map((flags) =>
      runWithEffects(
        directory,
        ["fixture.json", ...flags],
        `{
        findPaths: async () => ["fixture.json"],
        processSources: async () => { throw new Error("internal processing failure"); },
      }`,
      ),
    );

    equal(
      results.map(({ status }) => status),
      [1, 1],
      "04.01",
    );
    equal(
      results.map(({ stdout }) => stdout),
      ["", ""],
      "04.02",
    );
    equal(
      results.map(({ stderr }) => stderr),
      ["✨ json-sort-cli: Error: internal processing failure\n", ""],
      "04.03",
    );
  });
});

test("05 - stdout formatting reports non-Error failures without partial JSON", async () => {
  await temporaryDirectoryTask(async (directory) => {
    const result = runWithEffects(
      directory,
      ["fixture.json", "--stdout"],
      `{
      findPaths: async () => ["fixture.json"],
      processSources: async () => { throw "formatting unavailable"; },
    }`,
    );

    equal(result.status, 1, "05.01");
    equal(result.stdout, "", "05.02");
    equal(result.stderr, "✨ json-sort-cli: formatting unavailable\n", "05.03");
  });
});

test("06 - terminal status colours honor NO_COLOR", async () => {
  await temporaryDirectoryTask(async (directory) => {
    const results = [false, true].map((disableColour) =>
      runWithEffects(
        directory,
        ["fixture.json", "--ci"],
        `{
        findPaths: async () => ["fixture.json"],
        processSources: async () => ({ successful: ["fixture.json"], unsorted: [] }),
      }`,
        `process.stdout.isTTY = true;
        ${disableColour ? 'process.env.NO_COLOR = "1";' : ""}`,
      ),
    );

    equal(
      results.map(({ status }) => status),
      [0, 0],
      "06.01",
    );
    equal(
      results.map(({ stdout }) => stdout),
      [
        "✨ json-sort-cli: \u001b[37mAll files were already sorted:\u001b[39m\nfixture.json\n",
        "✨ json-sort-cli: All files were already sorted:\nfixture.json\n",
      ],
      "06.02",
    );
    equal(
      results.map(({ stderr }) => stderr),
      ["", ""],
      "06.03",
    );
  });
});

test("07 - mixed outcomes report one success and multiple failures", async () => {
  await temporaryDirectoryTask(async (directory) => {
    writeFileSync(path.join(directory, "good.json"), '{"z":1,"a":2}');
    writeFileSync(path.join(directory, "bad-one.json"), "{");
    writeFileSync(path.join(directory, "bad-two.json"), "[");

    const result = runWithEffects(directory, ["*.json"], "{}");

    equal(result.status, 1, "07.01");
    match(result.stdout, /1 file sorted\n/, "07.02");
    match(
      result.stderr,
      /2 files could not be sorted - bad-one\.json - bad-two\.json\n/,
      "07.03",
    );
    equal(
      readFileSync(path.join(directory, "good.json"), "utf8"),
      '{\n  "a": 2,\n  "z": 1\n}\n',
      "07.04",
    );
    equal(
      readFileSync(path.join(directory, "bad-one.json"), "utf8"),
      "{",
      "07.05",
    );
    equal(
      readFileSync(path.join(directory, "bad-two.json"), "utf8"),
      "[",
      "07.06",
    );
  });
});

test("08 - CI failures still report multiple already-sorted files", async () => {
  await temporaryDirectoryTask(async (directory) => {
    writeFileSync(path.join(directory, "good-one.json"), "{}\n");
    writeFileSync(path.join(directory, "good-two.json"), "[]\n");
    writeFileSync(path.join(directory, "bad.json"), "{");

    const result = runWithEffects(directory, ["*.json", "--ci"], "{}");

    equal(result.status, 1, "08.01");
    equal(
      result.stdout,
      "✨ json-sort-cli: 2 files already sorted:\ngood-one.json\ngood-two.json\n",
      "08.02",
    );
    match(result.stderr, /1 file could not be checked - bad\.json\n/, "08.03");
    equal(
      readFileSync(path.join(directory, "good-one.json"), "utf8"),
      "{}\n",
      "08.04",
    );
    equal(
      readFileSync(path.join(directory, "good-two.json"), "utf8"),
      "[]\n",
      "08.05",
    );
    equal(readFileSync(path.join(directory, "bad.json"), "utf8"), "{", "08.06");
  });
});

test.run();
