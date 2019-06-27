#!/usr/bin/env node

const Benchmark = require("benchmark");
const i = require("../dist/array-includes-with-glob.cjs");
const { version, name } = require("../package.json");
const fs = require("fs");
const path = require("path");
const historicalData = JSON.parse(
  fs.readFileSync(path.resolve("./perf/historical.json"))
);

// add tests

function perc(amount, total) {
  return Math.round(((amount * 100) / total) * 100) / 100;
}

const suite = new Benchmark.Suite({
  minTime: 20
});
const heads = `${`\u001b[${90}m${`${name} perf/check.js:`}\u001b[${39}m`} ⚡️`;

suite
  .add("t1", () =>
    i(["something", "anything", "everything"], ["*thing", "zzz"])
  )
  .on("complete", function() {
    const optsPerSec = this[0].hz;
    // console.log(`${heads} ops/sec.: ${optsPerSec}`);

    if (Object.prototype.hasOwnProperty.call(historicalData, version)) {
      // console.log(`${heads} current version has been already recorded`);
    } else {
      // console.log(`${heads} current version hasn't been recorded yet`);
      historicalData[version] = optsPerSec;
      historicalData["last"] = historicalData[version];
      fs.writeFile(
        path.resolve("./perf/historical.json"),
        JSON.stringify(historicalData, null, 4),
        err => {
          if (err) {
            throw err;
          }
          console.log(`${heads} the file has been written!`);
        }
      );
    }

    // evaluation:
    if (perc(historicalData.last - optsPerSec, historicalData.last) <= 1) {
      console.log(
        `${heads} ${`\u001b[${32}m${`current code is just as fast as before`}\u001b[${39}m`} ${`\u001b[${90}m${`(was ${historicalData.last} now ${optsPerSec} opts/sec)`}\u001b[${39}m`}`
      );
    } else if (historicalData.last > optsPerSec) {
      console.log(
        `${heads} ${`\u001b[${32}m${`current code is faster by ${perc(
          historicalData.last - optsPerSec,
          historicalData.last
        )}%`}\u001b[${39}m`} ${`\u001b[${90}m${`(was ${historicalData.last} now ${optsPerSec} opts/sec)`}\u001b[${39}m`}`
      );
    } else {
      console.log(
        `${heads} ${`\u001b[${31}m${`current code is slower by ${perc(
          optsPerSec - historicalData.last,
          historicalData.last
        )}%`}\u001b[${39}m`} ${`\u001b[${90}m${`(was ${historicalData.last} now ${optsPerSec} opts/sec)`}\u001b[${39}m`}`
      );
    }
  })
  // run async
  .run({ async: true });
