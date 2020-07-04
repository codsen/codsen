#!/usr/bin/env node

// Sometimes, by accident, all versions on all package.json's can be set
// wrongly, to a previous version. This script pulls the latest version from
// npm and sets all local versions to that.

const fs = require("fs");
const pacote = require("pacote");
const { set } = require("edit-package-json");

function getDirectories(p) {
  return fs.readdirSync(p).filter((file) => {
    return fs.statSync(`${p}/${file}`).isDirectory();
  });
}

(async () => {
  getDirectories("./packages").forEach(async (dirName) => {
    await pacote.manifest(dirName).then((pkg) => {
      console.log(`\n----\n\n${dirName}\n`);
      const existingPackageJson = fs.readFileSync(
        `./packages/${dirName}/package.json`,
        "utf8"
      );
      fs.writeFileSync(
        `./packages/${dirName}/package.json`,
        set(existingPackageJson, "version", pkg.version)
      );
      //
    });
  });
})();
