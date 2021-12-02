// this program compiles all package package.json files into one lump
// we pick only "version" and "description" keys

import fs from "fs";
import path from "path";
import axios from "axios";

async function fetchPackageJson(packageName) {
  return axios
    .get(
      `https://raw.githubusercontent.com/codsen/${packageName}/main/package.json`
    )
    .then((response) => response.data)
    .catch((err) => {
      console.log(
        `016 fetch-webapps-json.js: ${`\u001b[${31}m${`Error in axios fetching ${packageName}!`}\u001b[${39}m`} ${err}`
      );
      process.exit(0);
    });
}
function getDirectories(p) {
  return fs.readdirSync(p).filter((file) => {
    return fs.statSync(`${p}/${file}`).isDirectory();
  });
}
function pickOnlyTheMainEntries(obj) {
  const {
    version = false,
    description = false,
    bin = false,
    lect = false,
  } = obj;
  return {
    version,
    description,
    bin,
    lect,
  };
}

const rowNumPackageJson =
  (await fetchPackageJson("eslint-plugin-row-num")) || {};
const testNumPackageJson =
  (await fetchPackageJson("eslint-plugin-test-num")) || {};

const res = getDirectories("./packages").reduce((acc, curr) => {
  try {
    const {
      name = false,
      version = false,
      description = false,
      bin = false,
      lect = false,
    } = JSON.parse(fs.readFileSync(`./packages/${curr}/package.json`, "utf8"));
    acc[name] = {};
    acc[name].version = version;
    acc[name].description = description;
    acc[name].bin = bin;
    acc[name].lect = lect;
  } catch (error) {
    console.log(
      `${`\u001b[${33}m${`error`}\u001b[${39}m`} = ${JSON.stringify(
        error,
        null,
        4
      )}`
    );
  }
  return acc;
}, {});

if (rowNumPackageJson.name) {
  res[rowNumPackageJson.name] = pickOnlyTheMainEntries(rowNumPackageJson);
}
if (testNumPackageJson.name) {
  res[testNumPackageJson.name] = pickOnlyTheMainEntries(testNumPackageJson);
}

fs.writeFile(
  path.join("stats/packageJsons.json"),
  JSON.stringify(res, null, 0),
  (err) => {
    if (err) {
      throw err;
    }
    console.log(`\u001b[${32}m${`packageJsons.json written OK`}\u001b[${39}m`);
  }
);
