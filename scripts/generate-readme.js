#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const lectrc = JSON.parse(fs.readFileSync("./packages/.lectrc.json"));
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

> A lerna monorepo for our ${allPackages.length} npm libraries 📦📦📦

## 📚 Documentation

Please [visit our documentation](https://codsen.com/os/) for an overview and a full documentation of all packages.

## 🤝 Contributing
${lectrc.contributing.restofit}

**[⬆ back to top](#codsen)**

## 💼 Licence

MIT License

Copyright (c) 2015-${year} Roy Revelt and other contributors

**[⬆ back to top](#codsen)**
`;

fs.writeFile(
  "README.md",
  template
    .replace(/the_link_to_npm/g, "The&nbsp;link&nbsp;to&nbsp;npm")
    .replace(
      /%ISSUELINK%/gm,
      "https://gitlab.com/codsen/codsen/issues/new?title=put%20package%20name%20here%20-%20put%20issue%20title%20here"
    )
    .replace(/ - /gm, " — "),
  (err) => {
    if (err) {
      throw err;
    }
    console.log(`\u001b[${32}m${`monorepo readme OK`}\u001b[${39}m`);
  }
);
