#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// FUNCTIONS
// =========

//

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

// 1. Assemble a JSON of all package and their deps
// -----------------------------------------------------------------------------

// {
//   "name": "detergent",
//   "size": 3938,
//   "imports": [
//     "all-named-html-entities"
//   ]
// },

allPackages.map(name => {
  const pack = JSON.parse(
    fs.readFileSync(path.join("packages", name, "package.json"))
  );
  let size;
  if (pack.bin) {
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
});

fs.writeFile(
  path.resolve("stats/interdeps.json"),
  JSON.stringify(interdep, null, 4),
  err => {
    if (err) {
      throw err;
    }
    console.log(`\u001b[${32}m${`stats written OK`}\u001b[${39}m`);
  }
);
