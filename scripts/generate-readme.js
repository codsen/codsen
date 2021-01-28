#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// const lectrc = JSON.parse(fs.readFileSync("./packages/.lectrc.json"));
const today = new Date();
const year = today.getFullYear();

// READ ALL LIBS
// =============

const allPackages = fs
  .readdirSync(path.resolve("packages"))
  .filter(
    (packageName) =>
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

// ASSEMBLE THE TEMPLATE
// =====================

const template = `# Codsen

> A lerna monorepo for our ${allPackages.length} npm packages 📦📦📦

## 📚 Documentation

Please [visit codsen.com](https://codsen.com/os/) for an overview and full documentation of all packages.

## 🐛 Issue Tracker

For bugs, feature requests and so on use the [Issue Tracker](https://github.com/codsen/codsen/issues/new/choose).

## 💼 Licence

MIT License

Copyright (c) 2010-${year} Roy Revelt and other contributors
`;

fs.writeFile("README.md", template, (err) => {
  if (err) {
    throw err;
  }
});
