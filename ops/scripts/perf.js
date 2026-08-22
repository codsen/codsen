import fs from "node:fs";
import path from "node:path";
import Benchmark from "benchmark";
import { perfRef, opsPerSec as refOpsPerSec } from "perf-ref";
import { sortAllObjectsSync } from "../../packages/json-comb-core/dist/json-comb-core.esm.js";
import {
  baselineOf,
  classifyPerfRun,
  nextHistoricalData,
  readPerfPolicy,
  resolvePerfPolicy,
} from "../helpers/perfPolicy.js";
import { parseHistorical, stringifyHistorical } from "./historicalJson.js";

export const runPerf = async (cb, callerDir) => {
  let logThreshold = 1000;
  let freshlyRanRefOpsPerSec;

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
  let resolvedPolicy = resolvePerfPolicy(readPerfPolicy(), name);

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

  // add tests
  // ---------------------------------------------------------------------------

  let suite = new Benchmark.Suite();
  let heads = `${`\u001b[${90}m${`${name} perf/check.js:`}\u001b[${39}m`} `;

  // create a suite but don't trigger it
  suite
    .add("t1", () => {
      cb();
    })
    .on("complete", function () {
      //                                  |
      //                                  |
      //                                  |
      //                                  |
      //                               \  |  /
      //                                \ | /
      //                                 \|/
      //                                  V
      let normalisedBenchmarkedOpsPerSec =
        (this[0].hz * refOpsPerSec) / freshlyRanRefOpsPerSec;

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
        sortAllObjectsSync(
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
        historicalDataFileContents.trim() !==
        newHistoricalDataFileContents.trim()
      ) {
        // written synchronously: the file is being changed from a benchmark
        // completion handler, and a callback write only adds an ordering hazard
        fs.writeFileSync(
          path.resolve(callerDir, "./perf/historical.json"),
          newHistoricalDataFileContents,
        );
        console.log(`${heads}✅ historical.json written`);
      }

      // evaluation:
      // -----------------------------------------------------------------------

      if (verdict === "regression") {
        if (resolvedPolicy.failOnRegression) {
          process.exitCode = 1;
        }
        console.log(
          `${heads}🐌 ${`[${31}m${`current code is slower by ${Math.abs(
            changePercent,
          )}%, beyond the ${
            resolvedPolicy.regressionThresholdPercent
          }% regression threshold`}[${39}m`} ${`[${90}m${`(was ${round(
            baseline,
          )} — now ${round(
            normalisedBenchmarkedOpsPerSec,
          )} ops/sec; the baseline is kept)`}[${39}m`}`,
        );
        if (resolvedPolicy.waiverReason) {
          console.log(
            `${heads}📝 ${`[${90}m${`waived: ${resolvedPolicy.waiverReason}`}[${39}m`}`,
          );
        }
      } else if (verdict === "baseline") {
        console.log(
          `${heads}🆕 ${`\u001b[${33}m${`no previous record, this run becomes the baseline`}\u001b[${39}m`} ${`\u001b[${90}m${`(${round(
            normalisedBenchmarkedOpsPerSec,
          )} ops/sec)`}\u001b[${39}m`}`,
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
          `${heads}📌 ${`[${90}m${`the baseline is kept; this run is recorded as lastSlowerRun, and the perf analyser reports it as a pending regression`}[${39}m`}`,
        );
      }

      //                                  ^
      //                                 /|\
      //                                / | \
      //                               /  |  \
      //                                  |
      //                                  |
      //                                  |
      //                                  |
    });

  // first, run the reference program to get the values to normalise
  // ---------------------------------------------------------------------------

  let refSuite = new Benchmark.Suite();
  await refSuite
    .add("perfRef", () => {
      perfRef();
    })
    .on("complete", function () {
      freshlyRanRefOpsPerSec = this[0].hz;
      // trigger the real benchmark
      suite.run({ async: true });
    })
    .run({ async: true });
};
