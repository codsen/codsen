import Benchmark from "benchmark";
import fs from "fs";
import path from "path";
import { sortAllObjectsSync } from "../packages/json-comb-core/dist/json-comb-core.esm.js";
import {
  perfRef,
  opsPerSec as refOpsPerSec,
} from "../packages/perf-ref/perf-ref.esm.js";

export const runPerf = async (cb, callerDir) => {
  const logThreshold = 1000;
  let freshlyRanRefOpsPerSec;

  // read historical data
  // ---------------------------------------------------------------------------

  const historicalData = JSON.parse(
    fs.readFileSync(path.resolve(callerDir, "perf/historical.json"))
  );
  const { version, name } = JSON.parse(
    fs.readFileSync(path.resolve(callerDir, "package.json"))
  );

  console.log(
    `${`\u001b[${90}m${`scripts/run-perf.js:`}\u001b[${39}m`}${" ".repeat(
      Math.max(0, name.length - 5)
    )} 📦 ${`\u001b[${33}m${name}\u001b[${39}m`} v${version}`
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
    const x = nStr.split(".");
    let x1 = x[0];
    const x2 = x.length > 1 ? `.${x[1]}` : "";
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
  }

  // add tests
  // ---------------------------------------------------------------------------

  const suite = new Benchmark.Suite();
  const heads = `${`\u001b[${90}m${`${name} perf/check.js:`}\u001b[${39}m`} `;

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
      const normalisedBenchmarkedOpsPerSec =
        (this[0].hz * refOpsPerSec) / freshlyRanRefOpsPerSec;

      if (!Object.prototype.hasOwnProperty.call(historicalData, version)) {
        historicalData[version] = normalisedBenchmarkedOpsPerSec;
        historicalData.lastPublished = normalisedBenchmarkedOpsPerSec;
      }
      historicalData.lastRan = historicalData[version];
      fs.writeFile(
        path.resolve(callerDir, "./perf/historical.json"),
        JSON.stringify(sortAllObjectsSync(historicalData), null, 4),
        (err) => {
          if (err) {
            throw err;
          }
          console.log(`${heads}✅ historical.json written`);
        }
      );

      // evaluation:
      // -----------------------------------------------------------------------

      if (
        perc(
          Math.abs(historicalData.lastRan - normalisedBenchmarkedOpsPerSec),
          historicalData.lastRan
        ) <= 2
      ) {
        console.log(
          `${heads}${"⚡️"} ${`\u001b[${32}m${`current code is just as fast as before`}\u001b[${39}m`} ${`\u001b[${90}m${`(was ${round(
            historicalData.lastRan
          )} \u2014 now ${round(
            normalisedBenchmarkedOpsPerSec
          )} ops/sec)`}\u001b[${39}m`}`
        );
      } else {
        console.log(
          `${heads}${
            historicalData.lastRan < normalisedBenchmarkedOpsPerSec
              ? "⚡️"
              : "🐌"
          } ${`\u001b[${
            historicalData.lastRan < normalisedBenchmarkedOpsPerSec ? 32 : 31
          }m${`current code is ${
            historicalData.lastRan < normalisedBenchmarkedOpsPerSec
              ? "faster"
              : "slower"
          } by ${perc(
            Math.abs(historicalData.lastRan - normalisedBenchmarkedOpsPerSec),
            historicalData.lastRan
          )}%`}\u001b[${39}m`} ${`\u001b[${90}m${`(was ${round(
            historicalData.lastRan
          )} \u2014 now ${round(
            normalisedBenchmarkedOpsPerSec
          )} ops/sec)`}\u001b[${39}m`}`
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

  const refSuite = new Benchmark.Suite();
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
