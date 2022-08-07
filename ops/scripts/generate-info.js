#!/usr/bin/env node

/* eslint operator-assignment:0 */

import {
  promises as fs,
  F_OK,
  accessSync,
  readdirSync,
  statSync,
  readFileSync,
} from "fs";
import path from "path";
import git from "simple-git";
import { sortAllObjectsSync } from "json-comb-core";
import { prepExampleFileStr } from "../helpers/prepExampleFileStr.js";
import { programClassification } from "@codsen/data";

const isCI = process?.env?.CI || false;

// READ ALL LIBS
// =============

const packagesOutsideMonorepoObj = {
  "eslint-plugin-row-num": {
    description: "ESLint plugin to update row numbers on each console.log",
  },
  "eslint-plugin-test-num": {
    description: "ESLint plugin to update unit test numbers automatically",
  },
  "perf-ref": {
    description: "A mock program to normalise perf scores against it",
  },
  "tsd-extract-noesm": {
    description: "Extract any definition from TS definitions file",
  },
  lect: {
    description: "Maintenance CLI for internal consumption",
  },
};

const deprecated = [
  "bitsausage",
  "chlu",
  "chlu-cli",
  "email-remove-unused-css",
  "eslint-on-airbnb-base-badge",
  "fol",
  "posthtml-ast-compare",
  "posthtml-ast-contains-only-empty-space",
  "posthtml-ast-delete-key",
  "posthtml-ast-delete-object",
  "posthtml-ast-get-object",
  "posthtml-ast-get-values-by-key",
  "posthtml-ast-is-empty",
  "posthtml-ast-loose-compare",
  "posthtml-color-shorthand-hex-to-six-digit",
  "posthtml-email-remove-unused-css",
  "string-replace-slices-array",
  "string-slices-array-push",
];
const packagesOutsideMonorepo = Object.keys(packagesOutsideMonorepoObj);
const allPackages = [...packagesOutsideMonorepo, ...deprecated];
const currentPackages = [...packagesOutsideMonorepo];
const cliPackages = [];
const programPackages = [];
const specialPackages = [];
const scriptAvailable = [];
const packageJSONData = { ...packagesOutsideMonorepoObj };
const examples = {};
const allDTS = {};

// split-list is used on the website, to show lists the libs
// split-list is different from above, one package can be in one category-only
let splitListFlagshipLibs = [];
let splitListRangeLibs = [];
let splitListHtmlLibs = [];
let splitListStringLibs = [];
let splitListObjectOrArrLibs = [];
let splitListLernaLibs = [];
let splitListCliApps = [];
let splitListASTApps = [];
let splitListMiscLibs = [];
// don't show these
const splitListBlackList = [
  "chlu",
  "lect",
  "codsen",
  "helga",
  "tsd-extract-noesm",
];

// -----------------------------------------------------------------------------

// if a package exports "defaults", that value will be
// extracted and written as a string, to this object:
const exportedDefaults = {};

const packageNames = readdirSync(path.resolve("packages")).filter((d) =>
  statSync(path.join("packages", d)).isDirectory()
);

for (let packageName of packageNames) {
  try {
    let packageJsonContents = JSON.parse(
      readFileSync(path.join("packages", packageName, "package.json"), "utf8")
    );
    packageJSONData[packageName] = packageJsonContents;
    if (!packageJsonContents.private) {
      allPackages.push(packageJsonContents.name);
      currentPackages.push(packageJsonContents.name);
    }
    if (packageJsonContents.bin) {
      cliPackages.push(packageJsonContents.name);
    }
    if (packageJsonContents.exports && packageJsonContents.exports.script) {
      scriptAvailable.push(packageJsonContents.name);
    }
    // also present in ./ops/lect/lect.js:
    try {
      accessSync(path.join("packages", packageName, "rollup.config.js"), F_OK);
      // 1. add program to the "programs" list
      programPackages.push(packageJsonContents.name);

      // 2. read its type definitions file .d.ts and push into "allDTS[]"
      let dts = readFileSync(
        path.join("packages", packageName, "types/index.d.ts"),
        "utf8"
      ).trim();
      allDTS[packageName] = dts;

      // 3. extract defaults if they're exported
      try {
        let { defaults } = await import(
          `../../packages/${packageName}/dist/${packageName}.esm.js`
        );
        if (defaults) {
          exportedDefaults[packageName] = JSON.stringify(defaults, null, 2);
        }
      } catch (e) {
        // nothing happens
      }
      if (packageName === "detergent" && !exportedDefaults[packageName]) {
        try {
          let { opts } = await import(
            `../../packages/${packageName}/dist/${packageName}.esm.js`
          );
          if (opts) {
            exportedDefaults[packageName] = JSON.stringify(opts, null, 4);
          }
        } catch (e) {
          // nothing happens
        }
      }

      // 4. compile all examples, including Quick Take
      examples[packageName] = readdirSync(
        path.join("packages", packageName, "examples")
      ).reduce((accumulatedObj, fileName) => {
        let exampleContents = readFileSync(
          path.join("packages", packageName, "examples", fileName),
          "utf-8"
        );
        let title =
          exampleContents
            .split(/(\r?\n)/)
            .find((lineStr) => lineStr.trim().startsWith("//")) || "";
        if (title) {
          // remove "// " part in front of the title
          title = title.slice(3);
        }
        accumulatedObj[fileName] = {
          title,
          code: prepExampleFileStr(exampleContents).str,
        };
        return accumulatedObj;
      }, {});
    } catch (e) {
      // nothing happens
    }

    if (!programPackages.includes(packageName) && !packageJsonContents.bin) {
      specialPackages.push(packageJsonContents.name);
    }
  } catch (error) {
    // nothing happens and we skip it
    console.log(`error! ${error}`);
  }
}

// splits follow
// -----------------------------------------------------------------------------

for (let p of packageNames) {
  if (!splitListBlackList.includes(p)) {
    if (programClassification.flagshipLibsList.includes(p)) {
      splitListFlagshipLibs.push(p);
    } else if (
      programClassification.rangeLibsList.includes(p) ||
      p.startsWith("ranges-")
    ) {
      splitListRangeLibs.push(p);
    } else if (
      programClassification.htmlLibsList.includes(p) ||
      p.startsWith("html-") ||
      p.endsWith("-css")
    ) {
      splitListHtmlLibs.push(p);
    } else if (
      programClassification.stringLibsList.includes(p) ||
      p.startsWith("string-")
    ) {
      splitListStringLibs.push(p);
    } else if (
      programClassification.objectLibsList.includes(p) ||
      p.startsWith("object-") ||
      p.startsWith("array-")
    ) {
      splitListObjectOrArrLibs.push(p);
    } else if (
      programClassification.lernaLibsList.includes(p) ||
      p.startsWith("lerna-")
    ) {
      splitListLernaLibs.push(p);
    } else if (
      programClassification.cliAppsList.includes(p) ||
      p.endsWith("-cli")
    ) {
      splitListCliApps.push(p);
    } else if (
      programClassification.astLibsList.includes(p) ||
      p.startsWith("ast-")
    ) {
      splitListASTApps.push(p);
    } else {
      splitListMiscLibs.push(p);
    }
  }
}

// -----------------------------------------------------------------------------

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

const dependencyStatsTypings = `interface UnknownValueObj {
  [key: string]: number;
}

interface DependencyStats {
  dependencies: UnknownValueObj;
  devDependencies: UnknownValueObj;
  top10ExternalDeps: UnknownValueObj[];
  top10OwnDeps: UnknownValueObj[];
}
`;

const dependencyStats = { dependencies: {}, devDependencies: {} };

for (let i = 0, len = allPackages.length; i < len; i++) {
  let name = allPackages[i];
  if (packagesOutsideMonorepo.includes(name) || deprecated.includes(name)) {
    continue;
  }

  // console.log(
  //   `077 ======== processing ${`\u001b[${35}m${name}\u001b[${39}m`} ========`
  // );
  let pack = JSON.parse(
    readFileSync(path.join("packages", name, "package.json"))
  );

  let size = 0;
  if (pack.bin && !programPackages.includes(name)) {
    // cli's
    size = readFileSync(path.join("packages", name, `cli.js`)).length;
  } else {
    try {
      // normal libs
      statSync(path.join("packages", name, "dist", `${name}.esm.js`));
      size = readFileSync(
        path.join("packages", name, "dist", `${name}.esm.js`)
      ).length;
    } catch (e) {
      try {
        // gulp plugins etc. don't have "dist/*"
        size = readFileSync(path.join("packages", name, `index.js`)).length;
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
  path.resolve("./data/sources/interdeps.ts"),
  // JSON.stringify(interdep, null, 4),
  `export const interdeps = ${JSON.stringify(
    interdep.filter((obj1) => {
      return !(
        !obj1.imports.length &&
        !interdep.some((obj2) => obj2.imports.includes(obj1.name))
      );
    }),
    null,
    4
  )};\n`,
  (err) => {
    if (err) {
      throw err;
    }
    console.log(`\u001b[${32}m${`interdeps.ts written OK`}\u001b[${39}m`);
  }
);

console.log(
  `426 ${`\u001b[${33}m${`splitListHtmlLibs`}\u001b[${39}m`} = ${JSON.stringify(
    splitListHtmlLibs,
    null,
    4
  )}`
);

fs.writeFile(
  path.resolve("./data/sources/packages.ts"),
  `const all = ${JSON.stringify(allPackages.sort(), null, 4)} as const;
const current = ${JSON.stringify(currentPackages.sort(), null, 4)} as const;
const cli = ${JSON.stringify(cliPackages.sort(), null, 4)} as const;
const deprecated = ${JSON.stringify(deprecated.sort(), null, 4)} as const;
const programs = ${JSON.stringify(programPackages.sort(), null, 4)} as const;
const special = ${JSON.stringify(specialPackages.sort(), null, 4)} as const;
const script = ${JSON.stringify(scriptAvailable.sort(), null, 4)} as const;
const packagesOutsideMonorepo = ${JSON.stringify(
    packagesOutsideMonorepo.sort(),
    null,
    4
  )} as const;
const splitListFlagshipLibs = ${JSON.stringify(
    splitListFlagshipLibs,
    null,
    4
  )} as const;
const splitListRangeLibs = ${JSON.stringify(
    splitListRangeLibs,
    null,
    4
  )} as const;
const splitListHtmlLibs = ${JSON.stringify(
    splitListHtmlLibs,
    null,
    4
  )} as const;
const splitListStringLibs = ${JSON.stringify(
    splitListStringLibs,
    null,
    4
  )} as const;
const splitListObjectOrArrLibs = ${JSON.stringify(
    splitListObjectOrArrLibs,
    null,
    4
  )} as const;
const splitListLernaLibs = ${JSON.stringify(
    splitListLernaLibs,
    null,
    4
  )} as const;
const splitListCliApps = ${JSON.stringify(splitListCliApps, null, 4)} as const;
const splitListASTApps = ${JSON.stringify(splitListASTApps, null, 4)} as const;
const splitListMiscLibs = ${JSON.stringify(
    splitListMiscLibs,
    null,
    4
  )} as const;

export type Package = typeof all[number];

export const packages = {
    all,
    current,
    cli,
    deprecated,
    programs,
    special,
    script,
    packagesOutsideMonorepo,
    totalPackageCount: ${allPackages.length},
    currentPackagesCount: ${currentPackages.length},
    cliCount: ${cliPackages.length},
    programsCount: ${programPackages.length},
    specialCount: ${specialPackages.length},
    scriptCount: ${scriptAvailable.length},
    packagesOutsideMonorepoCount: ${packagesOutsideMonorepo.length},
    splitListFlagshipLibs,
    splitListRangeLibs,
    splitListHtmlLibs,
    splitListStringLibs,
    splitListObjectOrArrLibs,
    splitListLernaLibs,
    splitListCliApps,
    splitListASTApps,
    splitListMiscLibs,
};\n`,
  (err) => {
    if (err) {
      throw err;
    }
    console.log(`\u001b[${32}m${`packages.ts written OK`}\u001b[${39}m`);
  }
);

fs.writeFile(
  path.resolve("./data/sources/dependencyStats.ts"),
  `${dependencyStatsTypings}\nexport const dependencyStats: DependencyStats = ${JSON.stringify(
    sortAllObjectsSync(dependencyStats),
    null,
    4
  )};\n`,
  (err) => {
    if (err) {
      throw err;
    }
    console.log(`\u001b[${32}m${`dependencyStats.ts written OK`}\u001b[${39}m`);
  }
);

fs.writeFile(
  path.resolve("./data/sources/packageJSONData.ts"),
  `export const packageJSONData = ${JSON.stringify(
    packageJSONData,
    null,
    4
  )};\n`,
  (err) => {
    if (err) {
      throw err;
    }
    console.log(`\u001b[${32}m${`packageJSONData.ts written OK`}\u001b[${39}m`);
  }
);

fs.writeFile(
  path.resolve("./data/sources/allDTS.ts"),
  `export const allDTS = ${JSON.stringify(allDTS, null, 0)};\n`,
  (err) => {
    if (err) {
      throw err;
    }
    console.log(`\u001b[${32}m${`allDTS.ts written OK`}\u001b[${39}m`);
  }
);

fs.writeFile(
  path.resolve("./data/sources/exportedDefaults.ts"),
  `export const exportedDefaults = ${JSON.stringify(
    exportedDefaults,
    null,
    0
  )};\n`,
  (err) => {
    if (err) {
      throw err;
    }
    console.log(
      `\u001b[${32}m${`exportedDefaults.ts written OK`}\u001b[${39}m`
    );
  }
);

fs.writeFile(
  path.resolve("./data/sources/examples.ts"),
  `export const examples = ${JSON.stringify(examples, null, 0)};\n`,
  (err) => {
    if (err) {
      throw err;
    }
    console.log(`\u001b[${32}m${`examples.ts written OK`}\u001b[${39}m`);
  }
);

// 5. gather git repo info
// ---------------------------------------------------------------------------

// don't run git stats on CI because it won't read all the commits, only ~50
if (!isCI) {
  let commitTotal = null;
  try {
    // git rev-list --count HEAD
    commitTotal = await git(".git").raw(["rev-list", "--count", "HEAD"]);
    fs.writeFile(
      path.join("./data/sources/gitStats.ts"),
      `export const gitStats = ${JSON.stringify(
        { commitTotal: commitTotal.trim() },
        null,
        4
      )}`,
      (err) => {
        if (err) {
          throw err;
        }
        console.log(`\u001b[${32}m${`gitStats.ts written OK`}\u001b[${39}m`);
      }
    );
  } catch (e) {
    throw new Error("generate-info.js: can't access git data for gitStats.ts");
  }
}
