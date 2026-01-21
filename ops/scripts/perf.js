import fs from "node:fs";
import path from "node:path";
import Benchmark from "benchmark";
import { sortAllObjectsSync } from "json-comb-core";
import { perfRef, opsPerSec as refOpsPerSec } from "perf-ref";
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

  function perc(amount, total) {
    return Math.round(((amount * 100) / total) * 100) / 100;
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

      // what we compare against — grab it before we overwrite anything below
      let baseline = historicalData.lastVersion ?? historicalData[version];

      historicalData[version] = normalisedBenchmarkedOpsPerSec;
      historicalData.lastVersion = normalisedBenchmarkedOpsPerSec;

      // housekeeping
      delete historicalData.lastPublished;
      delete historicalData.lastRan;

      let newHistoricalDataFileContents = `${stringifyHistorical(
        sortAllObjectsSync(historicalData),
      )}\n`;

      if (
        historicalDataFileContents.trim() !==
        newHistoricalDataFileContents.trim()
      ) {
        fs.writeFile(
          path.resolve(callerDir, "./perf/historical.json"),
          newHistoricalDataFileContents,
          (err) => {
            if (err) {
              throw err;
            }
            console.log(`${heads}✅ historical.json written`);
          },
        );
      }

      // evaluation:
      // -----------------------------------------------------------------------

      if (typeof baseline !== "number") {
        console.log(
          `${heads}🆕 ${`\u001b[${33}m${`no previous record, this run becomes the baseline`}\u001b[${39}m`} ${`\u001b[${90}m${`(${round(
            normalisedBenchmarkedOpsPerSec,
          )} ops/sec)`}\u001b[${39}m`}`,
        );
      } else if (
        perc(Math.abs(baseline - normalisedBenchmarkedOpsPerSec), baseline) <= 2
      ) {
        console.log(
          `${heads}${"⚡️"} ${`\u001b[${32}m${`current code is just as fast as before`}\u001b[${39}m`} ${`\u001b[${90}m${`(was ${round(
            baseline,
          )} \u2014 now ${round(
            normalisedBenchmarkedOpsPerSec,
          )} ops/sec)`}\u001b[${39}m`}`,
        );
      } else {
        console.log(
          `${heads}${
            baseline < normalisedBenchmarkedOpsPerSec ? "⚡️" : "🐌"
          } ${`\u001b[${
            baseline < normalisedBenchmarkedOpsPerSec ? 32 : 31
          }m${`current code is ${
            baseline < normalisedBenchmarkedOpsPerSec ? "faster" : "slower"
          } by ${perc(
            Math.abs(baseline - normalisedBenchmarkedOpsPerSec),
            baseline,
          )}%`}\u001b[${39}m`} ${`\u001b[${90}m${`(was ${round(
            baseline,
          )} \u2014 now ${round(
            normalisedBenchmarkedOpsPerSec,
          )} ops/sec)`}\u001b[${39}m`}`,
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
