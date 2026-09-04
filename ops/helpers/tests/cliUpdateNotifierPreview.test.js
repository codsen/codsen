import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, match, throws } from "uvu/assert";

import {
  compareSemver,
  formatCliUpdateNotification,
} from "../../lect/common/cliUpdateNotifier.js";
import {
  createFakeScenarios,
  createSeededRandom,
  parseArguments,
  previewCliUpdateNotifications,
  run,
  USAGE,
} from "../../scripts/preview-cli-update-notifier.js";

const PREVIEW_SCRIPT = fileURLToPath(
  new URL("../../scripts/preview-cli-update-notifier.js", import.meta.url),
);

function makeOutput() {
  return {
    chunks: [],
    write(chunk) {
      this.chunks.push(String(chunk));
      return true;
    },
  };
}

function updateKind({ currentVersion, latestVersion }) {
  if (currentVersion.includes("-")) {
    return "prerelease";
  }
  const current = currentVersion.split(".").map(Number);
  const latest = latestVersion.split(".").map(Number);
  if (latest[0] > current[0]) {
    return "major";
  }
  return latest[1] > current[1] ? "minor" : "patch";
}

test("01 - parses defaults, values, and help", () => {
  equal(
    parseArguments([]),
    { count: 12, delay: 150, help: false, seed: null },
    "01.01",
  );
  equal(
    parseArguments(["--count", "3", "--delay=0", "--seed", "42"]),
    { count: 3, delay: 0, help: false, seed: 42 },
    "01.02",
  );
  equal(parseArguments(["-h"]).help, true, "01.03");
});

test("02 - rejects unknown, missing, and out-of-range options", () => {
  throws(() => parseArguments(["--wat"]), /Unknown option "--wat"/, "02.01");
  throws(
    () => parseArguments(["--count"]),
    /--count must be an integer from 1 to 100/,
    "02.02",
  );
  throws(
    () => parseArguments(["--delay=-1"]),
    /--delay must be an integer from 0 to 60000/,
    "02.03",
  );
  throws(
    () => parseArguments(["--seed=4294967296"]),
    /--seed must be an integer from 0 to 4294967295/,
    "02.04",
  );
});

test("03 - creates deterministic valid update scenarios", () => {
  const firstRandom = createSeededRandom(1234);
  const secondRandom = createSeededRandom(1234);
  const first = createFakeScenarios(20, firstRandom);
  const second = createFakeScenarios(20, secondRandom);
  equal(first, second, "03.01");
  equal(
    first.map(({ currentVersion, latestVersion }) =>
      compareSemver(latestVersion, currentVersion),
    ),
    Array(20).fill(1),
    "03.02",
  );
  equal(
    new Set(first.slice(0, 9).map(({ packageName }) => packageName)).size,
    9,
    "03.03",
  );
  equal(
    [...new Set(first.slice(0, 4).map(updateKind))].sort(),
    ["major", "minor", "patch", "prerelease"],
    "03.04",
  );
  equal(
    createFakeScenarios(4, createSeededRandom(42)),
    [
      {
        currentVersion: "8.18.12",
        latestVersion: "10.0.0",
        packageName: "lerna-clean-changelogs-cli",
      },
      {
        currentVersion: "5.17.25",
        latestVersion: "5.17.26",
        packageName: "csv-sort-cli",
      },
      {
        currentVersion: "4.20.2",
        latestVersion: "4.26.0",
        packageName: "json-sort-cli",
      },
      {
        currentVersion: "0.6.2-beta.10",
        latestVersion: "0.6.2",
        packageName: "email-all-chars-within-ascii-cli",
      },
    ],
    "03.05",
  );
});

test("04 - previews the production format with no real delay", async () => {
  const stderr = makeOutput();
  const stdout = makeOutput();
  const delays = [];
  const result = await previewCliUpdateNotifications(
    { count: 3, delay: 7, seed: 42 },
    {
      stderr,
      stdout,
      wait(milliseconds) {
        delays.push(milliseconds);
      },
    },
  );
  equal(result.seed, 42, "04.01");
  equal(result.scenarios.length, 3, "04.02");
  equal(delays, [7, 7], "04.03");
  equal(
    stdout.chunks.join(""),
    "Previewing 3 fictional CLI update notifications (seed 42).\nThe notification blocks below are the exact production format.\n",
    "04.04",
  );
  equal(
    stderr.chunks,
    result.scenarios.map(formatCliUpdateNotification),
    "04.05",
  );
});

test("05 - prints help and reports argument errors", async () => {
  const helpStderr = makeOutput();
  const helpStdout = makeOutput();
  equal(
    await run(["--help"], { stderr: helpStderr, stdout: helpStdout }),
    true,
    "05.01",
  );
  equal(helpStdout.chunks.join(""), USAGE, "05.02");
  equal(helpStderr.chunks, [], "05.03");

  const errorStderr = makeOutput();
  const errorStdout = makeOutput();
  equal(
    await run(["--unknown"], {
      stderr: errorStderr,
      stdout: errorStdout,
    }),
    false,
    "05.04",
  );
  equal(errorStdout.chunks, [], "05.05");
  equal(
    errorStderr.chunks.join(""),
    'Could not preview CLI update notifications: Unknown option "--unknown"\nRun with --help to see the available options.\n',
    "05.06",
  );
});

test("06 - executes as a script and returns meaningful exit codes", () => {
  const success = spawnSync(
    process.execPath,
    [PREVIEW_SCRIPT, "--count=1", "--delay=0", "--seed=42"],
    { encoding: "utf8" },
  );
  equal(success.status, 0, "06.01");
  match(
    success.stdout,
    /Previewing 1 fictional CLI update notification \(seed 42\)\./,
    "06.02",
  );
  match(success.stderr, /Update available for /, "06.03");

  const failure = spawnSync(process.execPath, [PREVIEW_SCRIPT, "--unknown"], {
    encoding: "utf8",
  });
  equal(failure.status, 1, "06.04");
  equal(failure.stdout, "", "06.05");
  match(failure.stderr, /Unknown option "--unknown"/, "06.06");
});

test.run();
