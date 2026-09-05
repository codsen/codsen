// Nonhistorical, normalized diagnostics for individual public API paths.
// Run: node packages/string-left-right/perf/diagnostics.js [baseline-esm-file] [workload-filter]
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
import Benchmark from "benchmark";
import { opsPerSec, perfRef } from "perf-ref";
import * as current from "../dist/string-left-right.esm.js";

const baseline = process.argv[2]
  ? await import(pathToFileURL(path.resolve(process.argv[2])).href)
  : null;
const workloads = [];
for (const direction of ["left", "right"]) {
  for (const gap of [0, 64, 1024]) {
    const input = `a${" ".repeat(gap)}b`;
    const idx = direction === "left" ? input.length - 1 : 0;
    workloads.push([
      `${direction}: gap ${gap}`,
      (api) => api[direction](input, idx),
    ]);
  }
  const finalInput =
    direction === "right" ? `xa${" ".repeat(65536)}` : `${" ".repeat(65536)}ax`;
  const finalIdx = direction === "right" ? 0 : finalInput.length - 1;
  workloads.push([
    `${direction}Seq: unused remainder`,
    (api) => api[`${direction}Seq`](finalInput, finalIdx, "a"),
  ]);
  const optionalInput =
    direction === "right" ? `x${" ".repeat(4096)}a` : `a${" ".repeat(4096)}x`;
  const optionalIdx = direction === "right" ? 0 : optionalInput.length - 1;
  const optional =
    direction === "right"
      ? [...Array(32).fill("z?"), "a"]
      : ["a", ...Array(32).fill("z?")];
  workloads.push([
    `${direction}Seq: optional gap`,
    (api) => api[`${direction}Seq`](optionalInput, optionalIdx, ...optional),
  ]);
  for (const count of [32, 256, 2048]) {
    const input = "a ".repeat(count);
    const values = Array(count).fill("a");
    const idx = direction === "right" ? -1 : input.length;
    workloads.push([
      `${direction}Seq: ${count} gaps`,
      (api) => api[`${direction}Seq`](input, idx, ...values),
    ]);
  }
  const name = direction === "left" ? "chompLeft" : "chompRight";
  for (const mode of [0, 1, 2, 3]) {
    for (const kind of ["repeated", "tail"]) {
      const middle = kind === "repeated" ? "a b ".repeat(128) : "a b";
      const tail = kind === "tail" ? `${" ".repeat(4096)}\n  ` : "   ";
      const input =
        direction === "right" ? `x${middle}${tail}z` : `z${tail}${middle}x`;
      const idx = direction === "right" ? 0 : input.length - 1;
      workloads.push([
        `${name}: mode ${mode}, ${kind}`,
        (api) => api[name](input, idx, { mode }, "a", "b"),
      ]);
    }
  }
}

function measure(name, fn) {
  return new Promise((resolve, reject) => {
    new Benchmark(name, fn, { minSamples: 8, maxTime: 0.5 })
      .on("error", (event) => reject(event.target.error))
      .on("complete", (event) =>
        resolve({ hz: event.target.hz, rme: event.target.stats.rme }),
      )
      .run({ async: true });
  });
}

const reference = await measure("perf-ref", perfRef);
console.log(
  "workload\tbaseline score\tcurrent score\tchange %\tbaseline/current RME %",
);
for (const [name, workload] of workloads) {
  if (process.argv[3] && !name.includes(process.argv[3])) {
    continue;
  }
  assert.notEqual(
    workload(current),
    null,
    `${name} must exercise a success path`,
  );
  if (baseline) {
    assert.deepEqual(
      workload(current),
      workload(baseline),
      `${name} output parity`,
    );
  }
  if (baseline) {
    // Warm both implementations at the shared call site before comparing them.
    await measure(name, () => {
      workload(baseline);
      workload(current);
    });
  }
  const before = baseline
    ? await measure(name, () => workload(baseline))
    : null;
  const after = await measure(name, () => workload(current));
  const normalize = (rate) => Math.round((rate.hz * opsPerSec) / reference.hz);
  console.log(
    `${name}\t${before === null ? "—" : normalize(before)}\t${normalize(after)}\t${before === null ? "—" : ((after.hz / before.hz - 1) * 100).toFixed(2)}\t${before === null ? "—" : before.rme.toFixed(2)}/${after.rme.toFixed(2)}`,
  );
}
