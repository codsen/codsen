#!/usr/bin/env node

// JSDelivr imposes 100MB limit for all packages.
// If somehow npmignore setup went wrong, some packages
// like detergent would exceed the limit, because stat files
// are huge. This script asserts sizes of all packages.

const fs = require("fs");
const pacote = require("pacote");

function getDirectories(p) {
  return fs.readdirSync(p).filter((file) => {
    return fs.statSync(`${p}/${file}`).isDirectory();
  });
}

(async () => {
  getDirectories("./packages")
    .sort()
    .forEach(async (dirName) => {
      await pacote.manifest(dirName).then((pkg) => {
        // console.log(`\n----\n\n${dirName}\n`);
        // console.log(+pkg.dist.unpackedSize / 1000000);
        // unpackedSize comes in bytes
        if (+pkg.dist.unpackedSize / 1000000 > 5) {
          console.log(
            `${`\u001b[${31}m${`ALERT! ${dirName} is ${Math.floor(
              +pkg.dist.unpackedSize / 1000000
            )}MB size`}\u001b[${39}m`}`
          );
        }
      });
    });
})();
