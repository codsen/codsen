import objectPath from "object-path";
import writeFileAtomic from "write-file-atomic";
import sortPackageJson from "sort-package-json";
import pacote from "pacote";

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

  // common, optional Rollup devdeps are permanently whitelisted
  const devDepsWhitelist = [
    "@rollup/plugin-json",
    "rollup-plugin-node-builtins",
    "rollup-plugin-node-globals",
  ];

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
    !state.isRollup ? "scripts.cli" : "scripts.rollup"
  );
  // then append any add-ons from .lectrc.json > "scripts_extras"
  if (objectPath.get(lectrc, `scripts_extras.${state.pack.name}`)) {
    // console.log(`060 ███████████████████████████████████████`);
    const extras = objectPath.get(lectrc, `scripts_extras.${state.pack.name}`);
    if (extras) {
      Object.keys(extras).forEach((key) => {
        // console.log(
        //   `${`\u001b[${33}m${`key`}\u001b[${39}m`} = ${JSON.stringify(
        //     key,
        //     null,
        //     4
        //   )}`
        // );
        // append the extra script
        content.scripts[key] = `${objectPath.get(content.scripts, key)} && ${
          extras[key]
        }`;
      });
    }
  }

  const officialDevDeps =
    objectPath.get(content, "lect.various.devDependencies") || [];
  const lectDevDeps = objectPath.get(lectrc, "package.devDependencies") || {};

  // 2. delete dev deps
  Object.keys(content.devDependencies).forEach((devDep) => {
    if (
      // it's not a whitelisted dev dependency
      (!devDepsWhitelist.includes(devDep) &&
        // if package has a devdep which doesn't exist in .lectrc.package.devDependencies
        // and it's not whitelisted via package.json key
        !lectDevDeps[devDep] &&
        !officialDevDeps.includes(devDep) &&
        // it's not a type definition
        !devDep.startsWith("@types") &&
        // either it's not a CLI so we don't care
        (!!state.isRollup ||
          // dependency is not whitelisted
          !cliDevDeps.includes(devDep))) ||
      // if it's a CLI
      (!state.isRollup &&
        // and it's a rogue, a program-specific devdep
        programDevDeps.some((dep) => devDep.startsWith(dep)))
    ) {
      console.log(`lect: deleted devDependencies.${devDep}`);
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
      (!!state.isRollup ||
        // or it's not among known program-specific devdeps
        !programDevDeps.some((dep) => devDep.startsWith(dep)))
    ) {
      console.log(`lect: added devdep ${devDep}`);
      content.devDependencies[devDep] = lectDevDeps[devDep];
    }
  });

  // 4. write adhoc keys
  const lectKeysHardWrite =
    objectPath.get(lectrc, "package_keys.write_hard") || {};
  Object.keys(lectKeysHardWrite).forEach((key) => {
    if (content[key] !== lectKeysHardWrite[key]) {
      content[key] = lectKeysHardWrite[key];
      console.log(`lect: wrote key ${key} to package.json`);
    }
  });

  // 5. delete adhoc keys
  const lectKeysDelete = objectPath.get(lectrc, "package_keys.delete") || [];
  lectKeysDelete.forEach((key) => {
    if (objectPath.has(content, key)) {
      console.log(`lect: deleted key "${key}" from package.json`);
      objectPath.del(content, key);
    }
  });

  // 6. set various keys
  objectPath.set(content, "engines", {
    node: "^12.20.0 || ^14.13.1 || >=16.0.0",
  });

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

  // 8. remove whitelisted devdeps from package.json lect key dev deps ignore
  if (objectPath.get(content, `lect.various.devDependencies`)) {
    objectPath.set(
      content,
      `lect.various.devDependencies`,
      objectPath.get(content, `lect.various.devDependencies`).filter(
        (devDep) =>
          // if it's among whitelisted-ones, don't keep it
          !devDepsWhitelist.includes(devDep) &&
          // if it's abandoned, not in the devdeps list in package.json, don't keep it
          Object.keys(content.devDependencies).includes(devDep)
      )
    );
  }

  // 9. if there are any lodash deps, add the latest corresponding types
  const lodashDeps = Object.keys(content.dependencies).filter((dep) =>
    dep.startsWith("lodash.")
  );

  for (let i = 0, len = lodashDeps.length; i < len; i++) {
    if (!content.devDependencies[`@types/${lodashDeps[i]}`]) {
      const pkg = await pacote.manifest(`@types/${lodashDeps[i]}`);
      if (pkg.version) {
        console.log(`@types/${lodashDeps[i]}: ^${pkg.version}`);
        content.devDependencies[`@types/${lodashDeps[i]}`] = `^${pkg.version}`;
      }

      // add it to lect devdep whitelist
      if (
        !content.lect.various.devDependencies.includes(
          `@types/${lodashDeps[i]}`
        )
      ) {
        content.lect.various.devDependencies.push(`@types/${lodashDeps[i]}`);
      }
    }
  }

  // 10. leave only used dev deps in lect devdep whitelist, plus sort the result
  if (
    content.lect &&
    content.lect.various &&
    content.lect.various.devDependencies &&
    Array.isArray(content.lect.various.devDependencies)
  ) {
    content.lect.various.devDependencies = content.lect.various.devDependencies
      .filter((val) => val !== "benchmark")
      .sort();
  }

  // 11. ensure "req" template uses named exports
  // doesn't apply to eslint-* plugins
  if (
    !!state.isRollup &&
    !content.name.startsWith("eslint-") &&
    (!content ||
      !content.lect ||
      !content.lect.req ||
      !content.lect.req.includes("{"))
  ) {
    console.log(
      `lect: ${`\u001b[${31}m${`ERROR`}\u001b[${39}m`} req does not use named exports: ${JSON.stringify(
        content.lect.req,
        null,
        0
      )}`
    );
    return Promise.reject(
      `lect: ${`\u001b[${31}m${`ERROR`}\u001b[${39}m`} req does not use named exports: ${JSON.stringify(
        content.lect.req,
        null,
        0
      )}`
    );
  }

  // WRITE IT

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
