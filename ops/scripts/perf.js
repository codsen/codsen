import Benchmark from "benchmark";
import fs from "fs";
import path from "path";
import { sortAllObjectsSync } from "json-comb-core";
import { perfRef, opsPerSec as refOpsPerSec } from "perf-ref";

export const runPerf = async (cb, callerDir) => {
  let logThreshold = 1000;
  let freshlyRanRefOpsPerSec;

  // read historical data
  // ---------------------------------------------------------------------------

  let historicalDataFileContents = fs.readFileSync(
    path.resolve(callerDir, "perf/historical.json"),
    "utf8",
  );
  let historicalData = JSON.parse(historicalDataFileContents);
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

      if (!Object.prototype.hasOwnProperty.call(historicalData, version)) {
        historicalData[version] = normalisedBenchmarkedOpsPerSec;
      }
      historicalData.lastVersion = historicalData[version];

      // housekeeping
      delete historicalData.lastPublished;
      delete historicalData.lastRan;

      if (
        historicalDataFileContents.trim() !==
        JSON.stringify(sortAllObjectsSync(historicalData), null, 2).trim()
      ) {
        fs.writeFile(
          path.resolve(callerDir, "./perf/historical.json"),
          JSON.stringify(sortAllObjectsSync(historicalData), null, 2),
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

      if (
        perc(
          Math.abs(historicalData.lastVersion - normalisedBenchmarkedOpsPerSec),
          historicalData.lastVersion,
        ) <= 2
      ) {
        console.log(
          `${heads}${"⚡️"} ${`\u001b[${32}m${`current code is just as fast as before`}\u001b[${39}m`} ${`\u001b[${90}m${`(was ${round(
            historicalData.lastVersion,
          )} \u2014 now ${round(
            normalisedBenchmarkedOpsPerSec,
          )} ops/sec)`}\u001b[${39}m`}`,
        );
      } else {
        console.log(
          `${heads}${
            historicalData.lastVersion < normalisedBenchmarkedOpsPerSec
              ? "⚡️"
              : "🐌"
          } ${`\u001b[${
            historicalData.lastVersion < normalisedBenchmarkedOpsPerSec
              ? 32
              : 31
          }m${`current code is ${
            historicalData.lastVersion < normalisedBenchmarkedOpsPerSec
              ? "faster"
              : "slower"
          } by ${perc(
            Math.abs(
              historicalData.lastVersion - normalisedBenchmarkedOpsPerSec,
            ),
            historicalData.lastVersion,
          )}%`}\u001b[${39}m`} ${`\u001b[${90}m${`(was ${round(
            historicalData.lastVersion,
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
