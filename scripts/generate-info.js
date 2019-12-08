#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const {
  sortAllObjectsSync
} = require("../packages/json-comb-core/dist/json-comb-core.cjs");

const dateObj = new Date();
const month = dateObj.getUTCMonth() + 1; //months from 1-12
const day = dateObj.getUTCDate();
const year = dateObj.getUTCFullYear();
const newdate = `${year}-${`${month}`.padStart(2, "0")}-${`${day}`.padStart(
  2,
  "0"
)}`;

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

// 1. Assemble a JSON of all packages and their deps
// -----------------------------------------------------------------------------

// {
//   "name": "detergent",
//   "size": 3938,
//   "imports": [
//     "all-named-html-entities"
//   ]
// },

const allStats = [];
const dependencyStats = { dependencies: {}, devDependencies: {} };

allPackages.map(name => {
  const pack = JSON.parse(
    fs.readFileSync(path.join("packages", name, "package.json"))
  );
  let size;
  if (pack.bin && !pack.lect.special) {
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
    // const obj = { name };
    // const fileContents = fs.readFileSync(
    //   path.join("packages", name, "testStats.md"),
    //   "utf8"
    // );
    // let parsedRes;
    // const p = new Parser(results => {
    //   parsedRes = results;
    // });
    // console.log(
    //   `${`\u001b[${33}m${`parsedRes`}\u001b[${39}m`} = ${JSON.stringify(
    //     parsedRes,
    //     null,
    //     4
    //   )}`
    // );
    //
    // const res = fileContents.match(reg);
    // if (res.length) {
    //   obj.suites = Number.parseInt(res[0].slice(0, -7));
    //   obj.asserts = Number.parseInt(res[1].slice(0, -7));
    // }
    // allStats.push(obj);
  } catch (e) {
    console.log(
      `! couldn't read/parse ${path.join("packages", name, "testStats.md")}`
    );
  }

  // compile dependency stats
  if (Object.prototype.hasOwnProperty.call(pack, "dependencies")) {
    // has deps
    Object.keys(pack.dependencies).forEach(dep => {
      // if dependency's name doesn't exist in compiled obj., create key
      if (
        !Object.prototype.hasOwnProperty.call(dependencyStats.dependencies, dep)
      ) {
        dependencyStats.dependencies[dep] = 1;
      } else {
        dependencyStats.dependencies[dep] =
          dependencyStats.dependencies[dep] + 1;
      }
    });
  }
  if (Object.prototype.hasOwnProperty.call(pack, "devDependencies")) {
    // has deps
    Object.keys(pack.devDependencies).forEach(dep => {
      // if devdependency's name doesn't exist in compiled obj., create key
      if (
        !Object.prototype.hasOwnProperty.call(
          dependencyStats.devDependencies,
          dep
        )
      ) {
        dependencyStats.devDependencies[dep] = 1;
      } else {
        dependencyStats.devDependencies[dep] =
          dependencyStats.devDependencies[dep] + 1;
      }
    });
  }
});

const compiledStats = {
  all: {},
  totalPackageCount: allPackages.length,
  totalAssertsCount: 0,
  minAssertsCount: 999999999999,
  minAssertsName: "",
  maxAssertsCount: 0,
  maxAssertsName: "",
  assertsCountMedian: 0,
  assertsCountArithmeticMean: 0,
  assertsCountGeometricMean: 0
};

allStats.forEach(statsObj => {
  // console.log(
  //   `${`\u001b[${33}m${`statsObj`}\u001b[${39}m`} = ${JSON.stringify(
  //     statsObj,
  //     null,
  //     4
  //   )}`
  // );
  if (
    typeof statsObj === "object" &&
    statsObj !== null &&
    statsObj.asserts &&
    Number.isInteger(statsObj.asserts)
  ) {
    compiledStats.totalAssertsCount += statsObj.asserts;
    if (statsObj.asserts > compiledStats.maxAssertsCount) {
      compiledStats.maxAssertsCount = statsObj.asserts;
      compiledStats.maxAssertsName = statsObj.name;
    }
    if (
      statsObj.asserts < compiledStats.minAssertsCount &&
      statsObj.asserts > 1
    ) {
      compiledStats.minAssertsCount = statsObj.asserts;
      compiledStats.minAssertsName = statsObj.name;
    }
  }
});

compiledStats.assertsCountArithmeticMean = Math.round(
  compiledStats.totalAssertsCount / allPackages.length
);

compiledStats.assertsCountGeometricMean = Math.round(
  Math.pow(
    allStats.reduce((accum, curr) => curr.asserts * accum, 1),
    1 / allStats.length
  )
);

allStats.forEach(statsObj => {
  compiledStats.all[statsObj.name] = statsObj.asserts;
});

compiledStats.assertsCountMedian = median(
  Object.keys(compiledStats.all).map(
    packageName => compiledStats.all[packageName]
  )
);

// console.log(
//   `202 generate-info.js: ${`\u001b[${33}m${`compiledStats`}\u001b[${39}m`} = ${JSON.stringify(
//     compiledStats,
//     null,
//     4
//   )}`
// );

// 3. compile top 10 of own and external deps and devdeps
// -----------------------------------------------------------------------------

const top10OwnDeps = [];
const top10ExternalDeps = [];
// there are no devdeps statistics because all devdeps are the same

let foundOwnMax;
let foundExternalMax;
for (let i = 0; i < 10; i++) {
  // reset
  foundOwnMax = null;
  foundExternalMax = null;

  // iterate
  Object.keys(dependencyStats.dependencies).forEach(depName => {
    if (
      (!foundOwnMax ||
        dependencyStats.dependencies[depName] >
          dependencyStats.dependencies[foundOwnMax]) &&
      allPackages.includes(depName) &&
      !top10OwnDeps.some(obj =>
        Object.prototype.hasOwnProperty.call(obj, depName)
      )
    ) {
      foundOwnMax = depName;
    }

    if (
      (!foundExternalMax ||
        dependencyStats.dependencies[depName] >
          dependencyStats.dependencies[foundExternalMax]) &&
      !allPackages.includes(depName) &&
      !top10ExternalDeps.some(obj =>
        Object.prototype.hasOwnProperty.call(obj, depName)
      )
    ) {
      foundExternalMax = depName;
    }
  });
  if (foundOwnMax) {
    top10OwnDeps.push({
      [foundOwnMax]: dependencyStats.dependencies[foundOwnMax]
    });
  }
  if (foundExternalMax) {
    top10ExternalDeps.push({
      [foundExternalMax]: dependencyStats.dependencies[foundExternalMax]
    });
  }
}

dependencyStats.top10OwnDeps = top10OwnDeps;
dependencyStats.top10ExternalDeps = top10ExternalDeps;

// 4. write files
// -----------------------------------------------------------------------------

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

fs.writeFile(
  path.resolve("stats/dependencyStats.json"),
  JSON.stringify(sortAllObjectsSync(dependencyStats), null, 4),
  err => {
    if (err) {
      throw err;
    }
    console.log(
      `\u001b[${32}m${`dependencyStats.json written OK`}\u001b[${39}m`
    );
  }
);

// 5. assemble historical unit test totals
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
    compiledStats.totalAssertsCount
) {
  let findingIdx;
  if (
    oldHistoricTotals.some((arr, i) => {
      if (arr[0] === newdate) {
        findingIdx = i;
        return true;
      }
      return false;
    })
  ) {
    // edit old if it was on the same date, today
    oldHistoricTotals[findingIdx][1] = compiledStats.totalAssertsCount;
  } else {
    // push new
    oldHistoricTotals.push([newdate, compiledStats.totalAssertsCount]);
  }
  fs.writeFile(
    path.join("stats/oldHistoricTotals.json"),
    JSON.stringify(oldHistoricTotals, null, 4),
    err => {
      if (err) {
        throw err;
      }
      console.log(
        `\u001b[${32}m${`oldHistoricTotals.json written OK`}\u001b[${39}m`
      );
    }
  );
}
