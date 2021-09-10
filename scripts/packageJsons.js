// this program compiles all package package.json files into one lump
// we pick only "version" and "description" keys

import fs from "fs";
import path from "path";

function getDirectories(p) {
  return fs.readdirSync(p).filter((file) => {
    return fs.statSync(`${p}/${file}`).isDirectory();
  });
}

const res = getDirectories("./packages").reduce((acc, curr) => {
  try {
    const { name, version, description } = JSON.parse(
      fs.readFileSync(`./packages/${curr}/package.json`, "utf8")
    );
    acc[name] = {};
    acc[name].version = version;
    acc[name].description = description;
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
