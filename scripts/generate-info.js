#!/usr/bin/env node

/* eslint operator-assignment:0 */

import fs from "fs";
import path from "path";
import git from "simple-git";
import { sortAllObjectsSync } from "../packages/json-comb-core/dist/json-comb-core.esm.js";

// READ ALL LIBS
// =============

const allPackages = [];
const cliPackages = [];
const programPackages = [];

fs.readdirSync(path.resolve("packages"))
  .filter((d) => fs.statSync(path.join("packages", d)).isDirectory())
  .forEach((packageName) => {
    try {
      const packageJsonContents = JSON.parse(
        fs.readFileSync(
          path.join("packages", packageName, "package.json"),
          "utf8"
        )
      );
      if (!packageJsonContents.private) {
        allPackages.push(packageJsonContents.name);
      }
      if (packageJsonContents.bin) {
        cliPackages.push(packageJsonContents.name);
      }
      if (packageJsonContents.devDependencies.rollup) {
        programPackages.push(packageJsonContents.name);
      }
    } catch (error) {
      // nothing happens and we skip it
    }
  });

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

for (let i = 0, len = allPackages.length; i < len; i++) {
  const name = allPackages[i];

  // console.log(
  //   `077 ======== processing ${`\u001b[${35}m${name}\u001b[${39}m`} ========`
  // );
  const pack = JSON.parse(
    fs.readFileSync(path.join("packages", name, "package.json"))
  );
  let size = 0;
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
      try {
        // gulp plugins etc. don't have "dist/*"
        size = fs.readFileSync(path.join("packages", name, `index.js`)).length;
      } catch (error) {
        // let's ignore all other unique ad-hoc packages like perf-ref
      }
    }
  }

  interdep.push({
    name,
    size,
    imports: pack.dependencies
      ? Object.keys(pack.dependencies).filter((n) => allPackages.includes(n))
      : [],
  });

  // compile dependency stats
  if (Object.prototype.hasOwnProperty.call(pack, "dependencies")) {
    // has deps
    Object.keys(pack.dependencies).forEach((dep) => {
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
    Object.keys(pack.devDependencies).forEach((dep) => {
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
}

const packages = {
  all: allPackages,
  cli: cliPackages,
  programs: programPackages,
  totalPackageCount: allPackages.length,
  cliCount: cliPackages.length,
  programsCount: programPackages.length,
};

allStats.forEach((statsObj) => {
  console.log(
    `${`\u001b[${33}m${`statsObj`}\u001b[${39}m`} = ${JSON.stringify(
      statsObj,
      null,
      4
    )}`
  );
});

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
  Object.keys(dependencyStats.dependencies).forEach((depName) => {
    if (
      (!foundOwnMax ||
        dependencyStats.dependencies[depName] >
          dependencyStats.dependencies[foundOwnMax]) &&
      allPackages.includes(depName) &&
      !top10OwnDeps.some((obj) =>
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
      !top10ExternalDeps.some((obj) =>
        Object.prototype.hasOwnProperty.call(obj, depName)
      )
    ) {
      foundExternalMax = depName;
    }
  });
  if (foundOwnMax) {
    top10OwnDeps.push({
      [foundOwnMax]: dependencyStats.dependencies[foundOwnMax],
    });
  }
  if (foundExternalMax) {
    top10ExternalDeps.push({
      [foundExternalMax]: dependencyStats.dependencies[foundExternalMax],
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
    interdep.filter((obj1) => {
      return !(
        !obj1.imports.length &&
        !interdep.some((obj2) => obj2.imports.includes(obj1.name))
      );
    }),
    null,
    4
  ),
  (err) => {
    if (err) {
      throw err;
    }
    console.log(`\u001b[${32}m${`interdeps.json written OK`}\u001b[${39}m`);
  }
);

fs.writeFile(
  path.resolve("stats/packages.json"),
  JSON.stringify(packages, null, 4),
  (err) => {
    if (err) {
      throw err;
    }
    console.log(`\u001b[${32}m${`packages.json written OK`}\u001b[${39}m`);
  }
);

fs.writeFile(
  path.resolve("stats/dependencyStats.json"),
  JSON.stringify(sortAllObjectsSync(dependencyStats), null, 4),
  (err) => {
    if (err) {
      throw err;
    }
    console.log(
      `\u001b[${32}m${`dependencyStats.json written OK`}\u001b[${39}m`
    );
  }
);

// 5. gather git repo info
// ---------------------------------------------------------------------------

let commitTotal = null;
try {
  // git rev-list --count HEAD
  commitTotal = await git(".git").raw(["rev-list", "--count", "HEAD"]);
  fs.writeFile(
    path.join("stats/gitStats.json"),
    JSON.stringify({ commitTotal: commitTotal.trim() }, null, 4),
    (err) => {
      if (err) {
        throw err;
      }
      console.log(`\u001b[${32}m${`gitStats.json written OK`}\u001b[${39}m`);
    }
  );
} catch (e) {
  throw new Error("generate-info.js: can't access git data for gitStats.json");
}
