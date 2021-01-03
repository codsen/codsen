#!/usr/bin/env node

/* eslint operator-assignment:0 */

const fs = require("fs");
const path = require("path");

(async () => {
  const allPackages = fs
    .readdirSync(path.resolve("packages"))
    .filter(
      (packageName) =>
        typeof packageName === "string" &&
        packageName.length &&
        fs.statSync(path.join("packages", packageName)).isDirectory() &&
        fs.statSync(path.join("packages", packageName, "package.json"))
    )
    .map((package) => {
      return JSON.parse(
        fs.readFileSync(path.join("packages", package, "package.json"), "utf8")
      );
    })
    .filter(
      (packageJson) =>
        !packageJson.bin &&
        packageJson.name &&
        !packageJson.name.startsWith("gulp-")
    );

  const tbcPackages = allPackages
    .filter((packageJson) => {
      try {
        fs.statSync(path.join("packages", packageJson.name, "types/main.d.ts"));
        return false;
      } catch (error) {
        return true;
      }
    })
    .map((p) => p.name);
  console.log(
    `${`\u001b[${33}m${`${tbcPackages.length}/${
      allPackages.length
    } (${Math.floor(
      (tbcPackages.length * 100) / allPackages.length
    )}%) packages left:`}\u001b[${39}m`}\n\n${tbcPackages.join("\n")}`
  );
})();
