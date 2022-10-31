import objectPath from "object-path";
import writeFileAtomic from "write-file-atomic";
import sortPackageJson, { sortOrder } from "sort-package-json";
import { dequal } from "dequal";
import omit from "lodash.omit";
import intersection from "lodash.intersection";

function format(obj) {
  if (typeof obj !== "object") {
    return obj;
  }
  let newSortOrder = sortOrder
    // 1. delete tap and lect fields
    .filter((field) => !["lect", "tap", "c8", "engines"].includes(field));

  // 2. then, insert both after resolutions, first tap then lect
  // console.log(sortOrder);

  let idxOfResolutions = newSortOrder.indexOf("resolutions");
  // console.log(idxOfResolutions);
  // => 63

  newSortOrder.splice(idxOfResolutions, 0, "engines", "tap", "c8", "lect");

  // use custom array for sorting order:
  return sortPackageJson(obj, {
    sortOrder: newSortOrder,
  });
}

// -----------------------------------------------------------------------------

// writes package.json
async function packageJson({ state, lectrc, rootPackageJSON }) {
  let content = { ...state.pack };

  // 1. set scripts
  if (state.isCJS) {
    content.scripts = objectPath.get(lectrc, "scripts.cjs");
  } else if (!state.isRollup) {
    content.scripts = objectPath.get(lectrc, "scripts.cli");
  } else {
    content.scripts = objectPath.get(lectrc, "scripts.rollup");
  }

  // if perf script mentions "skip", don't change it
  if (
    objectPath.get(state.pack.scripts.perf) &&
    typeof state.pack.scripts.perf === "string" &&
    state.pack.scripts.perf.includes("skip")
  ) {
    content.scripts.perf = state.pack.scripts.perf;
  }

  // 2. append any add-ons from .lectrc.json > "scripts_extras"
  if (objectPath.get(lectrc, `scripts_extras.${state.pack.name}`)) {
    let extras = objectPath.get(lectrc, `scripts_extras.${state.pack.name}`);
    if (extras) {
      Object.keys(extras).forEach((key) => {
        // append the extra script
        content.scripts[key] = `${objectPath.get(content.scripts, key)} && ${
          extras[key]
        }`;
      });
    }
  }

  content.homepage = `https://codsen.com/os/${content.name}`;

  // 3. write adhoc keys
  let lectKeysHardWrite = objectPath.get(lectrc, "package_keys.write") || {};
  Object.keys(lectKeysHardWrite).forEach((key) => {
    if (!dequal(content[key], lectKeysHardWrite[key])) {
      content[key] = lectKeysHardWrite[key];
      console.log(`lect: wrote key ${key} to package.json`);
    }
  });

  // 4. delete adhoc keys
  let lectKeysDelete = objectPath.get(lectrc, "package_keys.delete") || [];
  lectKeysDelete.forEach((key) => {
    if (objectPath.has(content, key)) {
      console.log(`lect: deleted key "${key}" from package.json`);
      objectPath.del(content, key);
    }
  });

  // 5. capitalise first letter in description
  if (
    content.description &&
    content.description.length &&
    content.description[0].toLowerCase() !==
      content.description[0].toUpperCase() &&
    content.description[0] !== content.description[0].toUpperCase()
  ) {
    content.description = `${content.description[0].toUpperCase()}${content.description.slice(
      1
    )}`;
  }

  // 6. remove devdeps from this package.json which are already present
  // in root package.json devdeps
  if (Object.keys(content.devDependencies || {}).length) {
    content.devDependencies = omit(
      content.devDependencies,
      intersection(
        Object.keys(rootPackageJSON.devDependencies),
        Object.keys(content.devDependencies || {})
      )
    );
  }

  if (!Object.keys(content.devDependencies || {}).length) {
    objectPath.del(content, "devDependencies");
  }

  /* set the "types" also inside the exports to cater TS >=4.7
  if (state.isRollup) {
    // beware, the "exports" value might be string, in case the package
    // has no UMD - see tap-parse-string-to-object:
    // "exports": "./dist/tap-parse-string-to-object.esm.js",

    if (typeof content.exports === "string") {
      content.exports = {
        types: "./types/index.d.ts",
        default: content.exports,
      };
    } else {
      // push types to be the first key
      let newExports = { ...content.exports }; // clone it
      delete newExports.types; // remove the "types"
      content.exports = {
        types: "./types/index.d.ts", // set it as the first key
        ...newExports,
      };
    }
  } */

  // 6. write
  try {
    await writeFileAtomic(
      "package.json",
      `${JSON.stringify(format(content), null, 2)}\n`
    );
    // console.log(`lect package.json ${`\u001b[${32}m${`OK`}\u001b[${39}m`}`);

    return Promise.resolve(null);
  } catch (err) {
    console.log(
      `lect: ${`\u001b[${31}m${`ERROR`}\u001b[${39}m`} could not write package.json - ${err}`
    );
    return Promise.reject(err);
  }
}

export default packageJson;
