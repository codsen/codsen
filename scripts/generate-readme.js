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

**[⬆ back to top](#codsen)**

## 💼 Licence

MIT License

Copyright (c) 2010-${year} Roy Revelt and other contributors

**[⬆ back to top](#codsen)**
`;

fs.writeFile(
  "README.md",
  template
    .replace(/the_link_to_npm/g, "The&nbsp;link&nbsp;to&nbsp;npm")
    .replace(
      /%ISSUELINK%/gm,
      "https://todo.sr.ht/~royston/codsen-issue-tracker"
    )
    .replace(/ - /gm, " — "),
  (err) => {
    if (err) {
      throw err;
    }
    console.log(`\u001b[${32}m${`monorepo readme OK`}\u001b[${39}m`);
  }
);
