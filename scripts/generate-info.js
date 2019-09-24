#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const dateObj = new Date();
const month = dateObj.getUTCMonth() + 1; //months from 1-12
const day = dateObj.getUTCDate();
const year = dateObj.getUTCFullYear();
const newdate = `${year}-${`${month}`.padStart(2, "0")}-${day}`;

// FUNCTIONS
// =========

function median(values) {
  if (values.length === 0) {
    return 0;
  }

  values.sort((a, b) => {
    return a - b;
  });

  const half = Math.floor(values.length / 2);

  if (values.length % 2) {
    return values[half];
  }

  return (values[half - 1] + values[half]) / 2.0;
}

// READ ALL LIBS
// =============

const allPackages = fs
  .readdirSync(path.resolve("packages"))
  .filter(
    packageName =>
      typeof packageName === "string" &&
      packageName.length &&
      fs.statSync(path.join("packages", packageName)).isDirectory() &&
      fs.statSync(path.join("packages", packageName, "package.json")) &&
      !JSON.parse(
        fs.readFileSync(
          path.join("packages", packageName, "package.json"),
          "utf8"
        )
      ).private
  );

const interdep = [];

// 1. Assemble a JSON of all package and their deps
// -----------------------------------------------------------------------------

// {
//   "name": "detergent",
//   "size": 3938,
//   "imports": [
//     "all-named-html-entities"
//   ]
// },

const allStats = [];

allPackages.map(name => {
  const pack = JSON.parse(
    fs.readFileSync(path.join("packages", name, "package.json"))
  );
  let size;
  if (pack.bin) {
    // cli's
    size = fs.readFileSync(path.join("packages", name, `cli.js`)).length;
  } else {
    try {
      // normal libs
      fs.statSync(path.join("packages", name, "dist", `${name}.esm.js`));
      size = fs.readFileSync(
        path.join("packages", name, "dist", `${name}.esm.js`)
      ).length;
    } catch (e) {
      // gulp plugins etc. don't have "dist/*"
      size = fs.readFileSync(path.join("packages", name, `index.js`)).length;
    }
  }

  interdep.push({
    name,
    size,
    imports: pack.dependencies
      ? Object.keys(pack.dependencies).filter(n => allPackages.includes(n))
      : []
  });

  // compile test stats
  try {
    const obj = JSON.parse(
      fs.readFileSync(path.join("packages", name, "testStats.json"))
    );
    obj.name = name;
    allStats.push(obj);
  } catch (e) {
    console.log(
      `! couldn't read/parse ${path.join("packages", name, "testStats.json")}`
    );
  }
});

const compiledStats = {
  all: {},
  totalPackageCount: allPackages.length,
  totalTestsCount: 0,
  minTestsCount: 999999999999,
  minTestsName: "",
  maxTestsCount: 0,
  maxTestsName: "",
  testsCountMedian: 0,
  testsCountArithmeticMean: 0,
  testsCountGeometricMean: 0
};

allStats.forEach(statsObj => {
  if (statsObj && statsObj.stats && statsObj.stats.passedTests) {
    compiledStats.totalTestsCount += statsObj.stats.passedTests;
    if (statsObj.stats.passedTests > compiledStats.maxTestsCount) {
      compiledStats.maxTestsCount = statsObj.stats.passedTests;
      compiledStats.maxTestsName = statsObj.name;
    }
    if (
      statsObj.stats.passedTests < compiledStats.minTestsCount &&
      statsObj.stats.passedTests > 1
    ) {
      compiledStats.minTestsCount = statsObj.stats.passedTests;
      compiledStats.minTestsName = statsObj.name;
    }
  }
});

compiledStats.testsCountArithmeticMean = Math.round(
  compiledStats.totalTestsCount / allPackages.length
);

compiledStats.testsCountGeometricMean = Math.round(
  Math.pow(
    allStats.reduce((accum, curr) => curr.stats.passedTests * accum, 1),
    1 / allStats.length
  )
);

allStats.forEach(statsObj => {
  compiledStats.all[statsObj.name] = statsObj.stats.passedTests;
});

compiledStats.testsCountMedian = median(
  Object.keys(compiledStats.all).map(
    packageName => compiledStats.all[packageName]
  )
);

// console.log(
//   `109 generate-info.js: ${`\u001b[${33}m${`compiledStats`}\u001b[${39}m`} = ${JSON.stringify(
//     compiledStats,
//     null,
//     4
//   )}`
// );

fs.writeFile(
  path.resolve("stats/interdeps.json"),
  // JSON.stringify(interdep, null, 4),
  JSON.stringify(
    interdep.filter(obj1 => {
      return !(
        !obj1.imports.length &&
        !interdep.some(obj2 => obj2.imports.includes(obj1.name))
      );
    }),
    null,
    4
  ),
  err => {
    if (err) {
      throw err;
    }
    console.log(`\u001b[${32}m${`interdeps.json written OK`}\u001b[${39}m`);
  }
);

fs.writeFile(
  path.resolve("stats/testStatsCompiled.json"),
  JSON.stringify(compiledStats, null, 4),
  err => {
    if (err) {
      throw err;
    }
    console.log(
      `\u001b[${32}m${`testStatsCompiled.json written OK`}\u001b[${39}m`
    );
  }
);

// 3. assemble historical unit test totals
// -----------------------------------------------------------------------------

let oldHistoricTotals;
try {
  oldHistoricTotals = JSON.parse(
    fs.readFileSync(path.join("stats/oldHistoricTotals.json"))
  );
} catch (e) {
  console.log(
    `error white reading/parsing stats/oldHistoricTotals.json!\n${e}`
  );
}

// oldHistoricTotals is array of arrays: [date, total]
// if the last value is not the same, push
if (
  !oldHistoricTotals.length ||
  oldHistoricTotals[oldHistoricTotals.length - 1][1] !==
    compiledStats.totalTestsCount
) {
  oldHistoricTotals.push([newdate, compiledStats.totalTestsCount]);
  fs.writeFileSync(
    path.join("stats/oldHistoricTotals.json"),
    JSON.stringify(oldHistoricTotals, null, 4)
  );
}
