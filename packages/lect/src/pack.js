const objectPath = require("object-path");
const writeFileAtomic = require("write-file-atomic");
const sortPackageJson = require("sort-package-json");
// const decodeContent = require("./decodeContent");
// const arrayiffy = require("./arrayiffy");

// writes package.json
async function packageJson({ state, lectrc }) {
  const programDevDeps = [
    "rollup",
    "@rollup",
    "@types",
    "babel",
    "@babel",
    "typings",
    "tsd",
    "typescript",
  ];
  const cliDevDeps = ["execa", "tempy", "tap"];
  const content = { ...state.pack };

  function format(obj) {
    if (typeof obj !== "object") {
      return obj;
    }
    const sortOrder = sortPackageJson.sortOrder
      // 1. delete tap and lect fields
      .filter((field) => !["lect", "tap"].includes(field));

    // 2. then, insert both after resolutions, first tap then lect
    // console.log(sortOrder);

    const idxOfResolutions = sortOrder.indexOf("resolutions");
    // console.log(idxOfResolutions);
    // => 63

    sortOrder.splice(idxOfResolutions, 0, "tap", "lect");

    // use custom array for sorting order:
    return sortPackageJson(obj, {
      sortOrder,
    });
  }

  // 1. set scripts
  content.scripts = objectPath.get(
    lectrc,
    state.isCLI ? "scripts.cli" : "scripts.rollup"
  );

  const whitelistedDevDeps =
    objectPath.get(content, "lect.various.devDependencies") || [];
  const lectDevDeps = objectPath.get(lectrc, "package.devDependencies") || {};

  // 2. delete dev deps
  Object.keys(content.devDependencies).forEach((devDep) => {
    if (
      // if package has a devdep which doesn't exist in .lectrc.package.devDependencies
      // and it's not whitelisted via package.json key
      (!lectDevDeps[devDep] &&
        !whitelistedDevDeps.includes(devDep) &&
        // either it's not a CLI so we don't care
        (!state.isCLI ||
          // dependency is not whitelisted
          !cliDevDeps.includes(devDep))) ||
      // if it's a CLI
      (state.isCLI &&
        // and it's a rogue, a program-specific devdep
        programDevDeps.some((dep) => devDep.startsWith(dep)))
    ) {
      console.log(`071 ██ deleted devDependencies.${devDep}`);
      objectPath.del(content, `devDependencies.${devDep}`);
    }
  });

  // 3. add dev deps
  Object.keys(lectDevDeps).forEach((devDep) => {
    if (
      // it's in lectrc but not among package's devdeps
      !content.devDependencies[devDep] &&
      // it's not a CLI-specific
      // either it's a program so we don't care
      (!state.isCLI ||
        // or it's not among known program-specific devdeps
        !programDevDeps.some((dep) => devDep.startsWith(dep)))
    ) {
      console.log(`087 ██ add ${devDep}`);
      content.devDependencies[devDep] = lectDevDeps[devDep];
    }
  });

  // 4. write adhoc keys
  const lectKeysHardWrite =
    objectPath.get(lectrc, "package_keys.write_hard") || {};
  Object.keys(lectKeysHardWrite).forEach((key) => {
    if (content[key] !== lectKeysHardWrite[key]) {
      content[key] = lectKeysHardWrite[key];
      console.log(`098 ██ write key ${key} to package.json`);
    }
  });

  // 5. delete adhoc keys
  const lectKeysDelete = objectPath.get(lectrc, "package_keys.delete") || [];
  lectKeysDelete.forEach((key) => {
    if (content[key]) {
      console.log(`106 ██ deleted key "${key}" from package.json`);
      objectPath.del(content, key);
    }
  });

  // 6. set various keys
  objectPath.set(content, "main", `dist/${state.pack.name}.cjs.js`);
  objectPath.set(content, "module", `dist/${state.pack.name}.esm.js`);
  objectPath.set(content, "browser", `dist/${state.pack.name}.umd.js`);

  // 7. capitalise first letter in description
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

  // WRITE IT

  try {
    await writeFileAtomic(
      "package.json",
      JSON.stringify(format(content), null, 2)
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

module.exports = packageJson;
