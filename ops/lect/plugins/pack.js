import objectPath from "object-path";
import writeFileAtomic from "write-file-atomic";
import sortPackageJson from "sort-package-json";
import { dequal } from "dequal";
// import omit from "lodash.omit";
// import intersection from "lodash.intersection";

function format(obj) {
  if (typeof obj !== "object") {
    return obj;
  }
  let sortOrder = sortPackageJson.sortOrder
    // 1. delete tap and lect fields
    .filter((field) => !["lect", "tap", "c8", "engines"].includes(field));

  // 2. then, insert both after resolutions, first tap then lect
  // console.log(sortOrder);

  let idxOfResolutions = sortOrder.indexOf("resolutions");
  // console.log(idxOfResolutions);
  // => 63

  sortOrder.splice(idxOfResolutions, 0, "engines", "tap", "c8", "lect");

  // use custom array for sorting order:
  return sortPackageJson(obj, {
    sortOrder,
  });
}

// -----------------------------------------------------------------------------

// writes package.json
// async function packageJson({ state, lectrc, rootPackageJSON }) {
async function packageJson({ state, lectrc }) {
  let content = { ...state.pack };

  // 1. set scripts
  content.scripts = objectPath.get(
    lectrc,
    !state.isRollup ? "scripts.cli" : "scripts.rollup"
  );

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
  // content = omit(content, (val) =>
  //   intersection(
  //     Object.keys(rootPackageJSON.devDependencies),
  //     Object.keys(content.devDependencies || {})
  //   ).includes(val)
  // );

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
