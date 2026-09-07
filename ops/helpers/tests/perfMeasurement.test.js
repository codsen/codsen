import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { opsPerSec } from "perf-ref";
import { test } from "uvu";
import { equal, ok } from "uvu/assert";
import { parseHistorical } from "../../scripts/historicalJson.js";
import { runPerf as runDefaultPerf } from "../../scripts/perf.js";
import { measureBenchmark, measurePerf } from "../perfMeasurement.js";

function runPerf(callback, dir, dependencies) {
  return runDefaultPerf(callback, dir, {
    sortHistory: (history) => history,
    ...dependencies,
  });
}

function controlledSuites() {
  const suites = [];
  class Suite {
    constructor() {
      this.events = new Map();
      suites.push(this);
    }

    add(name, callback, ...options) {
      this.name = name;
      this.callback = callback;
      this.options = options;
      return this;
    }

    on(event, callback) {
      this.events.set(event, callback);
      return this;
    }

    run(options) {
      this.runOptions = options;
      return this;
    }

    emit(event, target = this[0]) {
      this.events.get(event)?.({ target });
    }

    complete(hz = 100, stats = { sample: [1, 2, 3], rme: 1.25 }) {
      this[0] = { ...this[0], hz, stats };
      this.emit("complete");
    }
  }
  return { Suite, suites };
}

const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

function startMeasurement(Suite, options = {}) {
  return measurePerf({
    Suite,
    callback: () => {},
    reference: () => {},
    referenceScore: 10,
    ...options,
  });
}

async function withRunnerFixture(callback) {
  const dir = mkdtempSync(path.join(tmpdir(), "perf-measurement-"));
  const historyFile = path.join(dir, "perf/historical.json");
  const original = '{"1.0.0":1000,"lastVersion":1000}\n';
  const logs = [];
  const errors = [];
  const originalLog = console.log;
  const originalError = console.error;
  const originalExitCode = process.exitCode;
  mkdirSync(path.join(dir, "perf"));
  writeFileSync(historyFile, original);
  writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify({ name: "fixture-package", version: "1.0.1" }),
  );
  console.log = (...args) => logs.push(args.join(" "));
  console.error = (...args) => errors.push(args.join(" "));
  process.exitCode = 0;
  try {
    await callback({ dir, errors, historyFile, logs, original });
  } finally {
    console.log = originalLog;
    console.error = originalError;
    process.exitCode = originalExitCode;
    rmSync(dir, { force: true, recursive: true });
  }
}

test("01 - awaits reference and target completion without changing timed work", async () => {
  const { Suite, suites } = controlledSuites();
  const calls = [];
  let settled = false;
  const result = startMeasurement(Suite, {
    callback: () => calls.push("target"),
    reference: () => calls.push("reference"),
  }).then((value) => {
    settled = true;
    return value;
  });
  equal(suites.length, 1, "01.01");
  equal(suites[0].callback(), undefined, "01.02");
  equal(calls, ["reference"], "01.03");
  equal(suites[0].options, [], "01.04");
  equal(suites[0].runOptions, { async: true }, "01.05");
  await flush();
  equal(settled, false, "01.06");
  suites[0].complete(50);
  await flush();
  equal(suites.length, 2, "01.07");
  equal(settled, false, "01.08");
  equal(suites[1].callback(), undefined, "01.09");
  equal(calls, ["reference", "target"], "01.10");
  equal(suites[1].options, [], "01.11");
  suites[1].complete(100);
  equal(
    await result,
    {
      reference: { hz: 50, rme: 1.25, samples: 3 },
      score: 20,
      target: { hz: 100, rme: 1.25, samples: 3 },
    },
    "01.12",
  );
});

test("02 - reference errors and aborts prevent the target from starting", async () => {
  for (const event of ["error", "abort"]) {
    const { Suite, suites } = controlledSuites();
    const outcome = startMeasurement(Suite).catch((error) => error);
    suites[0].emit(event, { error: new Error("reference failed") });
    suites[0].complete();
    ok((await outcome) instanceof Error, "02.01");
    equal(suites.length, 1, "02.02");
  }
});

test("03 - target errors and aborts remain failures after a complete event", async () => {
  for (const event of ["error", "abort"]) {
    const { Suite, suites } = controlledSuites();
    const outcome = startMeasurement(Suite).catch((error) => error);
    suites[0].complete();
    await flush();
    suites[1].emit(event, { error: new Error("target failed") });
    suites[1].complete();
    ok((await outcome) instanceof Error, "03.01");
  }
});

test("04 - rejects invalid rates in either measurement", async () => {
  for (const phase of [0, 1]) {
    for (const hz of [undefined, 0, -1, NaN, Infinity, "100"]) {
      const { Suite, suites } = controlledSuites();
      const outcome = startMeasurement(Suite).catch((error) => error);
      if (phase) {
        suites[0].complete();
        await flush();
      }
      suites[phase][0] = { hz, stats: { sample: [1], rme: 0 } };
      suites[phase].emit("complete");
      const error = await outcome;
      ok(error instanceof Error, "04.01");
      ok(error.message.includes("positive finite rate"), "04.02");
      equal(suites.length, phase + 1, "04.03");
    }
  }
});

test("05 - rejects invalid canonical rates and normalization overflow", async () => {
  const { Suite, suites } = controlledSuites();
  const invalid = await startMeasurement(Suite, { referenceScore: 0 }).catch(
    (error) => error,
  );
  ok(invalid instanceof Error, "05.01");
  equal(suites.length, 0, "05.02");
  const outcome = startMeasurement(Suite).catch((error) => error);
  suites[0].complete(1);
  await flush();
  suites[1].complete(Number.MAX_VALUE);
  const error = await outcome;
  ok(error instanceof Error, "05.03");
  ok(error.message.includes("normalized target"), "05.04");
});

test("06 - rejects missing samples, invalid uncertainty, and setup failures", async () => {
  for (const stats of [
    { sample: [], rme: 0 },
    { sample: [1], rme: NaN },
    { sample: [1], rme: -1 },
    {},
  ]) {
    const { Suite, suites } = controlledSuites();
    const outcome = measureBenchmark(Suite, "fixture", () => {}).catch(
      (error) => error,
    );
    suites[0].complete(100, stats);
    ok((await outcome) instanceof Error, "06.01");
  }
  class BrokenSuite {
    constructor() {
      throw new Error("setup failed");
    }
  }
  const error = await measureBenchmark(BrokenSuite, "fixture", () => {}).catch(
    (failure) => failure,
  );
  equal(error.message, "setup failed", "06.02");
});

test("07 - runner writes once after completion and reports regression successfully", async () => {
  await withRunnerFixture(
    async ({ dir, errors, historyFile, logs, original }) => {
      const { Suite, suites } = controlledSuites();
      let settled = false;
      const result = runPerf(() => {}, dir, { Suite }).then(() => {
        settled = true;
      });
      await flush();
      equal(settled, false, "07.01");
      suites[0].complete(opsPerSec);
      await flush();
      equal(settled, false, "07.02");
      equal(readFileSync(historyFile, "utf8"), original, "07.03");
      suites[1].complete(800);
      await result;
      suites[1].emit("complete");
      equal(process.exitCode, 0, "07.04");
      equal(errors, [], "07.05");
      equal(
        parseHistorical(readFileSync(historyFile, "utf8")),
        {
          "1.0.0": 1000,
          lastSlowerRun: {
            against: 1000,
            score: 800,
            version: "1.0.1",
            worst: 800,
          },
          lastVersion: 1000,
        },
        "07.06",
      );
      equal(
        logs.filter((line) => line.includes("historical.json written")).length,
        1,
        "07.07",
      );
      ok(
        logs.some((line) => line.includes("slower by 20%")),
        "07.08",
      );
      ok(
        logs.some((line) =>
          line.includes(
            "reference: 3 samples, ±1.25% RME; target: 3 samples, ±1.25% RME",
          ),
        ),
        "07.09",
      );
    },
  );
});

test("08 - runner catches either phase failing and preserves history bytes", async () => {
  for (const phase of [0, 1]) {
    for (const failure of ["error", "abort", "invalid-rate", "invalid-stats"]) {
      await withRunnerFixture(
        async ({ dir, errors, historyFile, original }) => {
          const { Suite, suites } = controlledSuites();
          const result = runPerf(() => {}, dir, { Suite });
          if (phase) {
            suites[0].complete(opsPerSec);
            await flush();
          }
          if (failure === "invalid-rate") {
            suites[phase].complete(0);
          } else if (failure === "invalid-stats") {
            suites[phase].complete(100, { sample: [], rme: 0 });
          } else {
            suites[phase].emit(failure, { error: new Error("fixture failed") });
            suites[phase].complete(800);
          }
          await result;
          equal(process.exitCode, 1, "08.01");
          equal(readFileSync(historyFile, "utf8"), original, "08.02");
          equal(errors.length, 1, "08.03");
          ok(errors[0].includes("benchmark failed"), "08.04");
        },
      );
    }
  }
});

test("09 - setup failures are caught even before measurement starts", async () => {
  await withRunnerFixture(async ({ dir, errors, historyFile, original }) => {
    const { Suite, suites } = controlledSuites();
    await runPerf(() => {}, dir, {
      Suite,
      readPolicy: () => {
        throw new Error("policy unreadable");
      },
    });
    equal(process.exitCode, 1, "09.01");
    equal(suites.length, 0, "09.02");
    equal(readFileSync(historyFile, "utf8"), original, "09.03");
    ok(errors[0].includes("policy unreadable"), "09.04");
  });
});

test("10 - successful reporting does not clear an earlier process failure", async () => {
  await withRunnerFixture(async ({ dir }) => {
    const { Suite, suites } = controlledSuites();
    process.exitCode = 7;
    const result = runPerf(() => {}, dir, { Suite });
    suites[0].complete(opsPerSec);
    await flush();
    suites[1].complete(1000);
    await result;
    equal(process.exitCode, 7, "10.01");
  });
});

test.run();
