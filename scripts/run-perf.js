const Benchmark = require("benchmark");
const fs = require("fs");
const path = require("path");
const { sortAllObjectsSync } = require("../packages/json-comb-core");

function runPerf(cb, callerDir) {
  const logThreshold = 1000;

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
      const optsPerSec = this[0].hz;
      // historicalData = {};
      if (optsPerSec) {
        if (!Object.prototype.hasOwnProperty.call(historicalData, version)) {
          historicalData[version] = optsPerSec;
          historicalData.lastPublished = optsPerSec;
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
      }

      // evaluation:
      // -----------------------------------------------------------------------

      if (
        perc(
          Math.abs(historicalData.lastRan - optsPerSec),
          historicalData.lastRan
        ) <= 2
      ) {
        console.log(
          `${heads}${"⚡️"} ${`\u001b[${32}m${`current code is just as fast as before`}\u001b[${39}m`} ${`\u001b[${90}m${`(was ${round(
            historicalData.lastRan
          )} \u2014 now ${round(optsPerSec)} opts/sec)`}\u001b[${39}m`}`
        );
      } else {
        console.log(
          `${heads}${
            historicalData.lastRan < optsPerSec ? "⚡️" : "🐌"
          } ${`\u001b[${
            historicalData.lastRan < optsPerSec ? 32 : 31
          }m${`current code is ${
            historicalData.lastRan < optsPerSec ? "faster" : "slower"
          } by ${perc(
            Math.abs(historicalData.lastRan - optsPerSec),
            historicalData.lastRan
          )}%`}\u001b[${39}m`} ${`\u001b[${90}m${`(was ${round(
            historicalData.lastRan
          )} \u2014 now ${round(optsPerSec)} opts/sec)`}\u001b[${39}m`}`
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
    })
    // run async
    .run({ async: true });
}

module.exports = runPerf;
