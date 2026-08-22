import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import git from "simple-git";
import { programClassification } from "../../data/sources/programClassification.ts";
import { writeGeneratedFile } from "../helpers/generatedFiles.js";
import { missingPackageBuildArtifacts } from "../helpers/packageBuildArtifacts.js";
import { PACKAGE_KINDS } from "../helpers/packageKinds.js";
import { readPackageKindResolver } from "../helpers/packageKindsFile.js";
import { prepExampleFileStr } from "../helpers/prepExampleFileStr.js";
import { topDependencies } from "../helpers/topDependencies.js";

const arguments_ = process.argv.slice(2);
if (
  arguments_.some(
    (argument) => !new Set(["--check", "--git-stats"]).has(argument),
  )
) {
  throw new Error(
    `generate-info.js: unsupported argument(s): ${arguments_.join(", ")}`,
  );
}
if (arguments_.includes("--check") && arguments_.includes("--git-stats")) {
  throw new Error(
    "generate-info.js: --check and --git-stats cannot be combined",
  );
}
const mode = arguments_.includes("--check") ? "check" : "write";
const shouldGenerateGitStats = arguments_.includes("--git-stats");
const packageKinds = readPackageKindResolver(path.resolve("."));

// READ ALL LIBS
// =============

const packagesOutsideMonorepoObj = {
  "perf-ref": {
    description: "A mock program to normalise perf scores against it",
  },
  "tsd-extract-noesm": {
    description: "Extract any definition from TS definitions file",
  },
  lect: {
    description: "Maintenance CLI for internal consumption",
  },
  emlint: {
    description: "Pluggable email template code linter",
  },
  "array-of-arrays-into-ast": {
    description:
      "Turns an array of arrays of data into a nested tree of plain objects",
  },
  "array-of-arrays-sort-by-col": {
    description:
      "Sort array of arrays by column, rippling the sorting outwards from that column",
  },
  "bitbucket-slug": {
    description:
      "Generate BitBucket readme header anchor slug URLs. Unofficial, covers whole ASCII and a bit beyond",
  },
  "codsen-parser": {
    description: "Parser aiming at broken or mixed code, especially HTML & CSS",
  },
  "codsen-tokenizer": {
    description:
      "HTML and CSS lexer aimed at code with fatal errors, accepts mixed coding languages",
  },
  "easy-replace": {
    description:
      "Replace strings with optional lookarounds, but without regexes",
  },
  "email-homey": {
    description:
      "Generate homepage in the BrowserSync root with links/screenshots to all your email templates",
  },
  "gulp-email-remove-unused-css": {
    description:
      "Gulp plugin to remove unused CSS classes/id's from styles in HTML HEAD and inline within BODY",
  },
  helga: {
    description: "Your next best friend when editing complex nested code",
  },
  "lerna-link-dep": {
    description:
      "Like lerna add but does just the symlinking, works on CLI bins too",
  },
  "line-column-mini": {
    description: "Convert string index to line-column position",
  },
  "ranges-offset": {
    description: "Increment or decrement each index in every range",
  },
  "seo-editor": {
    description: "Copywriting keyword to-do list automation",
  },
  "string-bionic-split": {
    description:
      "Calculate a word string split position index for later highlighting",
  },
  "string-overlap-one-on-another": {
    description: "Lay one string on top of another, with an optional offset",
  },
  "string-truncator": {
    description: "Over-engineered string truncation for web UI's",
  },
  stristri: {
    description:
      "Extracts or deletes HTML, CSS, text and/or templating tags from string",
  },
  "tap-parse-string-to-object": {
    description:
      "Parses raw Tap: string-to-object or stream-to-a-promise-of-an-object",
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

const packageNames = readdirSync(path.resolve("packages"))
  .filter((d) => statSync(path.join("packages", d)).isDirectory())
  .sort();

const missingBuildArtifacts = missingPackageBuildArtifacts(packageNames, {
  packageKinds,
});

if (missingBuildArtifacts.length) {
  throw new Error(
    `generate-info.js: package build prerequisites are missing: ${missingBuildArtifacts.join(
      ", ",
    )}. Run "npm run build:packages" before generating repository data.`,
  );
}

const [{ det }, { sortAllObjectsSync }] = await Promise.all(
  ["detergent", "json-comb-core"].map(
    (name) =>
      import(
        pathToFileURL(path.resolve("packages", name, "dist", `${name}.esm.js`))
          .href
      ),
  ),
);

for (let packageName of packageNames) {
  try {
    let packageJsonContents = JSON.parse(
      readFileSync(path.join("packages", packageName, "package.json"), "utf8"),
    );
    let name = packageJsonContents.name;
    if (packagesOutsideMonorepo.includes(name)) {
      throw new Error(
        `generate-info.js: current workspace ${name} is still listed as outside the monorepo`,
      );
    }

    packageJSONData[name] = packageJsonContents;
    if (packageJSONData[name].description) {
      // fix typography
      packageJSONData[name].description = det(
        packageJSONData[name].description,
        {
          fixBrokenEntities: true,
          removeWidows: false,
          convertEntities: false,
          convertDashes: true,
          convertApostrophes: true,
          replaceLineBreaks: false,
          removeLineBreaks: false,
          useXHTML: true,
          dontEncodeNonLatin: true,
          addMissingSpaces: false,
          convertDotsToEllipsis: true,
          stripHtml: false,
        },
      ).res;
    }

    if (!packageJsonContents.private) {
      allPackages.push(name);
      currentPackages.push(name);
    }
    if (packageJsonContents.bin) {
      cliPackages.push(name);
    }
    if (packageJsonContents.exports?.script) {
      scriptAvailable.push(name);
    }
    // also present in ./ops/lect/lect.js:
    if (packageKinds.kindFor(name) === PACKAGE_KINDS.TYPESCRIPT_LIBRARY) {
      // 1. add program to the "programs" list
      programPackages.push(name);

      // 2. read its type definitions file .d.ts and push into "allDTS[]"
      let dts = readFileSync(
        path.join("packages", name, "types/index.d.ts"),
        "utf8",
      ).trim();
      allDTS[name] = dts;

      // 3. extract defaults if they're exported
      let packageExports;
      try {
        packageExports = await import(
          `../../packages/${name}/dist/${name}.esm.js`
        );
      } catch (error) {
        throw new Error(
          `generate-info.js: could not import the built ${name} package`,
          { cause: error },
        );
      }

      if (packageExports.defaults) {
        exportedDefaults[name] = JSON.stringify(
          packageExports.defaults,
          null,
          2,
        );
      }
      if (name === "detergent" && !exportedDefaults[name]) {
        if (packageExports.opts) {
          exportedDefaults[name] = JSON.stringify(packageExports.opts, null, 2);
        }
      }

      // 4. compile all examples, including Quick Take
      examples[name] = readdirSync(path.join("packages", name, "examples"))
        .sort()
        .reduce((accumulatedObj, fileName) => {
          let exampleContents = readFileSync(
            path.join("packages", name, "examples", fileName),
            "utf-8",
          );
          let { str, title } = prepExampleFileStr(exampleContents);
          if (!title) {
            throw new Error(
              `generate-info.js: packages/${name}/examples/${fileName} has no title. Every example file must open with a "// Title" comment - the website renders it as the example's label.`,
            );
          }
          accumulatedObj[fileName] = {
            title,
            code: str,
          };
          return accumulatedObj;
        }, {});
    }

    if (!programPackages.includes(name) && !packageJsonContents.bin) {
      specialPackages.push(name);
    }
  } catch (error) {
    throw new Error(
      `generate-info.js: could not collect data for ${packageName}`,
      { cause: error },
    );
  }
}

// splits follow
// -----------------------------------------------------------------------------

for (let packageName of packageNames) {
  let p = packageName;
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
  allExternalDeps: string[];
  allOwnDeps: string[];
}
`;

const dependencyStats = { dependencies: {}, devDependencies: {} };

for (let i = 0, len = allPackages.length; i < len; i++) {
  let packageName = allPackages[i];
  if (
    packagesOutsideMonorepo.includes(packageName) ||
    deprecated.includes(packageName)
  ) {
    continue;
  }

  // console.log(
  //   `077 ======== processing ${`\u001b[${35}m${name}\u001b[${39}m`} ========`
  // );
  let pack = JSON.parse(
    readFileSync(path.join("packages", packageName, "package.json")),
  );

  let size = 0;
  if (packageKinds.kindFor(packageName) === PACKAGE_KINDS.CLI) {
    // cli's
    size = readFileSync(path.join("packages", packageName, "cli.js")).length;
  } else {
    try {
      // normal libs
      statSync(
        path.join("packages", packageName, "dist", `${packageName}.esm.js`),
      );
      size = readFileSync(
        path.join("packages", packageName, "dist", `${packageName}.esm.js`),
      ).length;
    } catch (_e) {
      try {
        // gulp plugins etc. don't have "dist/*"
        size = readFileSync(
          path.join("packages", packageName, "index.js"),
        ).length;
      } catch (_error) {
        // let's ignore all other unique ad-hoc packages like perf-ref
      }
    }
  }

  interdep.push({
    name: packageName,
    size,
    imports: pack.dependencies
      ? Object.keys(pack.dependencies).filter((n) => allPackages.includes(n))
      : [],
  });

  // compile dependency stats
  if (Object.hasOwn(pack, "dependencies")) {
    // has deps
    Object.keys(pack.dependencies).forEach((dep) => {
      // if dependency's name doesn't exist in compiled obj., create key
      if (!Object.hasOwn(dependencyStats.dependencies, dep)) {
        dependencyStats.dependencies[dep] = 1;
      } else {
        dependencyStats.dependencies[dep] =
          dependencyStats.dependencies[dep] + 1;
      }
    });
  }
  if (Object.hasOwn(pack, "devDependencies")) {
    // has deps
    Object.keys(pack.devDependencies).forEach((dep) => {
      // if dev-dependency's name doesn't exist in compiled obj., create key
      if (!Object.hasOwn(dependencyStats.devDependencies, dep)) {
        dependencyStats.devDependencies[dep] = 1;
      } else {
        dependencyStats.devDependencies[dep] =
          dependencyStats.devDependencies[dep] + 1;
      }
    });
  }
}

// 3. compile top 10 of own and external deps and dev-deps
// -----------------------------------------------------------------------------

const allOwnDeps = new Set();
const allExternalDeps = new Set();

for (let depName in dependencyStats.dependencies) {
  if (allPackages.includes(depName)) {
    // it's one of ours
    allOwnDeps.add(depName);
  } else {
    // it's external
    allExternalDeps.add(depName);
  }
}

dependencyStats.top10OwnDeps = topDependencies(
  dependencyStats.dependencies,
  (depName) => allPackages.includes(depName),
);
dependencyStats.top10ExternalDeps = topDependencies(
  dependencyStats.dependencies,
  (depName) => !allPackages.includes(depName),
);
dependencyStats.allOwnDeps = [...allOwnDeps].sort();
dependencyStats.allExternalDeps = [...allExternalDeps].sort();

// 4. write files
// -----------------------------------------------------------------------------

await writeGeneratedFile({
  contents:
    // JSON.stringify(interdep, null, 2),
    `export const interdeps = ${JSON.stringify(
      interdep.filter((obj1) => {
        return !(
          !obj1.imports.length &&
          !interdep.some((obj2) => obj2.imports.includes(obj1.name))
        );
      }),
      null,
      2,
    )};\n`,
  filename: path.resolve("./data/sources/interdeps.ts"),
  fixCommand: "npm run ci:generate:info",
  mode,
});

await writeGeneratedFile({
  contents: `const all = ${JSON.stringify(allPackages.sort(), null, 2)} as const;
const current = ${JSON.stringify(currentPackages.sort(), null, 2)} as const;
const cli = ${JSON.stringify(cliPackages.sort(), null, 2)} as const;
const deprecated = ${JSON.stringify(deprecated.sort(), null, 2)} as const;
const programs = ${JSON.stringify(programPackages.sort(), null, 2)} as const;
const special = ${JSON.stringify(specialPackages.sort(), null, 2)} as const;
const script = ${JSON.stringify(scriptAvailable.sort(), null, 2)} as const;
const packagesOutsideMonorepo = ${JSON.stringify(
    packagesOutsideMonorepo.sort(),
    null,
    2,
  )} as const;
const splitListFlagshipLibs = ${JSON.stringify(
    splitListFlagshipLibs,
    null,
    2,
  )} as const;
const splitListRangeLibs = ${JSON.stringify(
    splitListRangeLibs,
    null,
    2,
  )} as const;
const splitListHtmlLibs = ${JSON.stringify(
    splitListHtmlLibs,
    null,
    2,
  )} as const;
const splitListStringLibs = ${JSON.stringify(
    splitListStringLibs,
    null,
    2,
  )} as const;
const splitListObjectOrArrLibs = ${JSON.stringify(
    splitListObjectOrArrLibs,
    null,
    2,
  )} as const;
const splitListLernaLibs = ${JSON.stringify(
    splitListLernaLibs,
    null,
    2,
  )} as const;
const splitListCliApps = ${JSON.stringify(splitListCliApps, null, 2)} as const;
const splitListASTApps = ${JSON.stringify(splitListASTApps, null, 2)} as const;
const splitListMiscLibs = ${JSON.stringify(
    splitListMiscLibs,
    null,
    2,
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
  filename: path.resolve("./data/sources/packages.ts"),
  fixCommand: "npm run ci:generate:info",
  mode,
});

await writeGeneratedFile({
  contents: `${dependencyStatsTypings}\nexport const dependencyStats: DependencyStats = ${JSON.stringify(
    sortAllObjectsSync(dependencyStats),
    null,
    2,
  )};\n`,
  filename: path.resolve("./data/sources/dependencyStats.ts"),
  fixCommand: "npm run ci:generate:info",
  mode,
});

await writeGeneratedFile({
  contents: `export const packageJSONData = ${JSON.stringify(
    packageJSONData,
    null,
    2,
  )};\n`,
  filename: path.resolve("./data/sources/packageJSONData.ts"),
  fixCommand: "npm run ci:generate:info",
  mode,
});

await writeGeneratedFile({
  contents: `export const allDTS = ${JSON.stringify(allDTS, null, 0)};\n`,
  filename: path.resolve("./data/sources/allDTS.ts"),
  fixCommand: "npm run ci:generate:info",
  mode,
});

await writeGeneratedFile({
  contents: `export const exportedDefaults = ${JSON.stringify(
    exportedDefaults,
    null,
    0,
  )};\n`,
  filename: path.resolve("./data/sources/exportedDefaults.ts"),
  fixCommand: "npm run ci:generate:info",
  mode,
});

await writeGeneratedFile({
  contents: `export const examples = ${JSON.stringify(examples, null, 0)};\n`,
  filename: path.resolve("./data/sources/examples.ts"),
  fixCommand: "npm run ci:generate:info",
  mode,
});

// 5. gather git repo info
// ---------------------------------------------------------------------------

// Release preparation opts in after checking out the complete history. Later
// release jobs preserve that prepared value because their synthetic PR/merge
// commits were not part of the package changes being measured.
if (shouldGenerateGitStats) {
  let commitTotal = null;
  try {
    // git rev-list --count HEAD
    commitTotal = await git(".git").raw(["rev-list", "--count", "HEAD"]);
    await writeGeneratedFile({
      contents: `export const gitStats = ${JSON.stringify(
        { commitTotal: commitTotal.trim() },
        null,
        2,
      )}\n`,
      filename: path.join("./data/sources/gitStats.ts"),
      fixCommand: "npm run ci:generate:info -- --git-stats",
      mode,
    });
  } catch (_e) {
    throw new Error("generate-info.js: can't access git data for gitStats.ts");
  }
}
