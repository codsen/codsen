import Benchmark from "benchmark";
import fs from "fs";
import path from "path";
import { sortAllObjectsSync } from "../packages/json-comb-core/dist/json-comb-core.esm.js";

export const runPerf = (cb, callerDir) => {
  const BENCH = false;
  const logThreshold = 1000;

  // read historical data
  // ---------------------------------------------------------------------------

  const historicalData = JSON.parse(
    fs.readFileSync(path.resolve(callerDir, "perf/historical.json"))
  );
  const { version, name } = JSON.parse(
    fs.readFileSync(path.resolve(callerDir, "package.json"))
  );

  if (!BENCH) {
    console.log(
      `${`\u001b[${90}m${`scripts/run-perf.js:`}\u001b[${39}m`}${" ".repeat(
        Math.max(0, name.length - 5)
      )} 📦 ${`\u001b[${33}m${name}\u001b[${39}m`} v${version}`
    );
  }

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
      const opsPerSec = this[0].hz;
      // historicalData = {};
      if (opsPerSec) {
        if (!Object.prototype.hasOwnProperty.call(historicalData, version)) {
          historicalData[version] = opsPerSec;
          historicalData.lastPublished = opsPerSec;
        }
        historicalData.lastRan = historicalData[version];
        fs.writeFile(
          path.resolve(callerDir, "./perf/historical.json"),
          JSON.stringify(sortAllObjectsSync(historicalData), null, 4),
          (err) => {
            if (err) {
              throw err;
            }
            if (!BENCH) {
              console.log(`${heads}✅ historical.json written`);
            }
          }
        );
      }

      // evaluation:
      // -----------------------------------------------------------------------

      if (
        perc(
          Math.abs(historicalData.lastRan - opsPerSec),
          historicalData.lastRan
        ) <= 2
      ) {
        if (!BENCH) {
          console.log(
            `${heads}${"⚡️"} ${`\u001b[${32}m${`current code is just as fast as before`}\u001b[${39}m`} ${`\u001b[${90}m${`(was ${round(
              historicalData.lastRan
            )} \u2014 now ${round(opsPerSec)} ops/sec)`}\u001b[${39}m`}`
          );
        }
      } else if (!BENCH) {
        console.log(
          `${heads}${
            historicalData.lastRan < opsPerSec ? "⚡️" : "🐌"
          } ${`\u001b[${
            historicalData.lastRan < opsPerSec ? 32 : 31
          }m${`current code is ${
            historicalData.lastRan < opsPerSec ? "faster" : "slower"
          } by ${perc(
            Math.abs(historicalData.lastRan - opsPerSec),
            historicalData.lastRan
          )}%`}\u001b[${39}m`} ${`\u001b[${90}m${`(was ${round(
            historicalData.lastRan
          )} \u2014 now ${round(opsPerSec)} ops/sec)`}\u001b[${39}m`}`
        );
      }

      if (BENCH) {
        console.log(`${name},${opsPerSec}`);
      }

      //                                  ^
      //                                 /|\
      //                                / | \
      //                               /  |  \
      //                                  |
      //                                  |
      //                                  |
      //                                  |
    })
    // run async
    .run({ async: true });
};
