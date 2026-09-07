import fs from "node:fs";
import path from "node:path";
import Benchmark from "benchmark";
import { perfRef, opsPerSec as refOpsPerSec } from "perf-ref";
import { measurePerf } from "../helpers/perfMeasurement.js";
import {
  baselineOf,
  classifyPerfRun,
  nextHistoricalData,
  readPerfPolicy,
  resolvePerfPolicy,
} from "../helpers/perfPolicy.js";
import { parseHistorical, stringifyHistorical } from "./historicalJson.js";

export const runPerf = async (
  cb,
  callerDir,
  { Suite = Benchmark.Suite, readPolicy = readPerfPolicy, sortHistory } = {},
) => {
  try {
    let logThreshold = 1000;

    // read historical data
    // ---------------------------------------------------------------------------

    let historicalDataFileContents = fs.readFileSync(
      path.resolve(callerDir, "perf/historical.json"),
      "utf8",
    );
    let historicalData = parseHistorical(historicalDataFileContents);
    let { version, name } = JSON.parse(
      fs.readFileSync(path.resolve(callerDir, "package.json")),
    );
    let resolvedPolicy = resolvePerfPolicy(readPolicy(), name);
    // Keep helper tests independent of generated package builds. The real
    // sorter is loaded before timing starts and retains the existing format.
    const sortHistoryData =
      sortHistory ??
      (await import("../../packages/json-comb-core/dist/json-comb-core.esm.js"))
        .sortAllObjectsSync;

    console.log(
      `${`\u001b[${90}m${`scripts/run-perf.js:`}\u001b[${39}m`}${" ".repeat(
        Math.max(0, name.length - 5),
      )} 📦 ${`\u001b[${33}m${name}\u001b[${39}m`} v${version}`,
    );

    // functions
    // ---------------------------------------------------------------------------

    function round(num) {
      return num > logThreshold
        ? addCommas(Math.floor(num))
        : Math.round(num * 100) / 100;
    }

    function addCommas(nStr) {
      nStr += "";
      let x = nStr.split(".");
      let x1 = x[0];
      let x2 = x.length > 1 ? `.${x[1]}` : "";
      let rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
      }
      return x1 + x2;
    }

    const heads = `${`\u001b[${90}m${`${name} perf/check.js:`}\u001b[${39}m`} `;
    const measurement = await measurePerf({
      Suite,
      callback: cb,
      reference: perfRef,
      referenceScore: refOpsPerSec,
    });
    const normalisedBenchmarkedOpsPerSec = measurement.score;
    console.log(
      `${heads}reference: ${measurement.reference.samples} samples, ±${measurement.reference.rme.toFixed(2)}% RME; target: ${measurement.target.samples} samples, ±${measurement.target.rme.toFixed(2)}% RME`,
    );

    // what we compare against — read it before recording anything
    let baseline = baselineOf(historicalData, version);

    // Judge the run first, then record it. A materially slower run keeps the
    // baseline it lost against, so the next run still has a truthful
    // comparison point instead of the regressed figure.
    let { changePercent, verdict } = classifyPerfRun({
      baseline,
      resolvedPolicy,
      score: normalisedBenchmarkedOpsPerSec,
    });

    let newHistoricalDataFileContents = `${stringifyHistorical(
      sortHistoryData(
        nextHistoricalData({
          baseline,
          historicalData,
          score: normalisedBenchmarkedOpsPerSec,
          verdict,
          version,
        }),
      ),
    )}\n`;

    if (
      historicalDataFileContents.trim() !== newHistoricalDataFileContents.trim()
    ) {
      // Both measurements completed successfully before recording this result.
      fs.writeFileSync(
        path.resolve(callerDir, "./perf/historical.json"),
        newHistoricalDataFileContents,
      );
      console.log(`${heads}✅ historical.json written`);
    }

    // evaluation:
    // -----------------------------------------------------------------------

    if (verdict === "regression") {
      console.log(
        `${heads}🐌 ${`${`current code is slower by ${Math.abs(
          changePercent,
        )}%, beyond the ${
          resolvedPolicy.regressionThresholdPercent
        }% regression threshold`}`} ${`${`(was ${round(baseline)} — now ${round(
          normalisedBenchmarkedOpsPerSec,
        )} ops/sec; the baseline is kept)`}`}`,
      );
      if (resolvedPolicy.waiverReason) {
        console.log(
          `${heads}📝 ${`${`waived: ${resolvedPolicy.waiverReason}`}`}`,
        );
      }
    } else if (verdict === "baseline") {
      console.log(
        `${heads}🆕 no previous record, this run becomes the baseline (${round(
          normalisedBenchmarkedOpsPerSec,
        )} ops/sec)`,
      );
    } else if (verdict === "unchanged") {
      console.log(
        `${heads}${"⚡️"} ${`\u001b[${32}m${`current code is just as fast as before`}\u001b[${39}m`} ${`\u001b[${90}m${`(was ${round(
          baseline,
        )} \u2014 now ${round(
          normalisedBenchmarkedOpsPerSec,
        )} ops/sec)`}\u001b[${39}m`}`,
      );
    } else {
      console.log(
        `${heads}${verdict === "faster" ? "⚡️" : "🐌"} ${`\u001b[${
          verdict === "faster" ? 32 : 31
        }m${`current code is ${verdict} by ${Math.abs(changePercent)}%`}\u001b[${39}m`} ${`\u001b[${90}m${`(was ${round(
          baseline,
        )} \u2014 now ${round(
          normalisedBenchmarkedOpsPerSec,
        )} ops/sec)`}\u001b[${39}m`}`,
      );
    }

    if (verdict === "slower" || verdict === "regression") {
      console.log(
        `${heads}📌 ${`the baseline is kept; this run is recorded as lastSlowerRun, and the perf analyser reports it as a pending regression`}`,
      );
    }
  } catch (error) {
    // Package checks historically call runPerf() without awaiting its Promise.
    // Handle failures here so both direct and awaited callers get a failed run.
    process.exitCode = 1;
    console.error(
      `perf/check.js (${callerDir}): benchmark failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};
