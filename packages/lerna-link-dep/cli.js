#!/usr/bin/env node

/* eslint no-empty:0 */

// VARS
// -----------------------------------------------------------------------------

const fs = require("fs");
const { log } = console;
const meow = require("meow");
const path = require("path");
const updateNotifier = require("update-notifier");
const execa = require("execa");
const messagePrefix = `\u001b[${90}m${"✨ lerna-link-dep: "}\u001b[${39}m`;

const cli = meow(
  `
  Usage
    $ deplink <name of another package from monorepo>
    $ deplink email-remove-unused-css
    $ deplink detergent

  Options
    -h, --help          Shows this help
    -v, --version       Shows the current installed version

  The package you requested must be in a neighbour folder to the
  one you're at currently.
`
);
updateNotifier({ pkg: cli.pkg }).notify();

// Step #0. take care of -v and -h flags that are left out in meow.
// -----------------------------------------------------------------------------

if (cli.flags.v) {
  log(cli.pkg.version);
  process.exit(0);
} else if (cli.flags.h) {
  log(cli.help);
  process.exit(0);
}

// Step #1. gather the to-do list of files.
// -----------------------------------------------------------------------------

// console.log(
//   `048 ${`\u001b[${33}m${`cli.input`}\u001b[${39}m`} = ${JSON.stringify(
//     cli.input,
//     null,
//     4
//   )}`
// );

// console.log(`current dir:\n${__dirname}`);
// console.log(`resolved dir:\n${path.resolve("./")}`);
// console.log(`up from current dir:\n${path.resolve(__dirname, "../")}`);

// first, check does the package folder at sibling folder level with such name exists:
for (let i = 0, len = cli.input.length; i < len; i++) {
  // is it a normal dependency? In technical language, are any of the fields
  // "main", "module", "browser" set in package.json?
  let isNormalDep = false;

  // is it also a CLI? In technical language, are there any keys under key "bin"
  // in package.json?
  let isCLI = [];

  // contents of package.json of the new requested package will be put here
  // the main consideration is different actions depending is it a CLI or normal dep
  let packageJsonContents;

  let check;
  try {
    check = fs.statSync(path.resolve("../", cli.input[i]));
  } catch (e) {
    console.log(
      `${messagePrefix} ${`\u001b[${31}m${`[ERROR_01] Error! A package with name "`}\u001b[${39}m`}${`\u001b[${33}m${
        cli.input[i]
      }\u001b[${39}m`}${`\u001b[${31}m${`" not found!`}\u001b[${39}m`}`
    );
    continue;
  }

  if (check && check.isDirectory()) {
    try {
      fs.statSync(path.resolve("../", cli.input[i], "package.json"));
    } catch (e) {
      console.log(
        `${messagePrefix} ${`\u001b[${31}m${`[ERROR_02] Error! A package.json doesn't exist at:\n`}\u001b[${39}m`}${`\u001b[${33}m${path.resolve(
          __dirname,
          "../",
          cli.input[i],
          "package.json"
        )}\u001b[${39}m`}`
      );
      continue;
    }

    // console.log(
    //   `${messagePrefix} ${`\u001b[${32}m${`OK: package.json exists at:`}\u001b[${39}m`}\n${`\u001b[${33}m${path.resolve(
    //     __dirname,
    //     "../",
    //     cli.input[i],
    //     "package.json"
    //   )}\u001b[${39}m`}`
    // );

    try {
      packageJsonContents = JSON.parse(
        fs.readFileSync(
          path.resolve("../", cli.input[i], "package.json"),
          "utf8"
        )
      );
      // if it's normal dep:
      if (
        typeof packageJsonContents === "object" &&
        Object.prototype.hasOwnProperty.call(packageJsonContents, "main")
      ) {
        isNormalDep = true;

        // check if symlink already exists
        try {
          if (fs.statSync(path.resolve("./", "node_modules", cli.input[i]))) {
            console.log(
              `${messagePrefix} ${`\u001b[${33}m${`[ERROR_03] Skipped! A symlink already exists:`}\u001b[${39}m`}\n${`\u001b[${90}m${path.resolve(
                "./",
                "node_modules",
                cli.input[i]
              )}\u001b[${39}m`}`
            );
            continue;
          }
        } catch (e) {}
      }

      // if it'a a CLI:
      if (
        typeof packageJsonContents === "object" &&
        Object.prototype.hasOwnProperty.call(packageJsonContents, "bin") &&
        Object.keys(packageJsonContents.bin).length
      ) {
        isCLI = Object.keys(packageJsonContents.bin);
      }
    } catch (e1) {
      console.log(
        `${messagePrefix} ${`\u001b[${31}m${`[ERROR_04] Something went wrong trying to read package.json at path:`}\u001b[${39}m`}\n${path.resolve(
          __dirname,
          "../",
          cli.input[i],
          "package.json"
        )}\n\n${`\u001b[${31}m${`error:`}\u001b[${39}m`}\n${e1}`
      );
      continue;
    }

    if (isNormalDep) {
      // run the query using execa:
      try {
        execa.sync(
          `ln -s ${path.resolve("../", cli.input[i])} ${path.resolve(
            "./",
            "node_modules",
            cli.input[i]
          )}`,
          {
            shell: true
          }
        );

        console.log(
          `${messagePrefix} ${`\u001b[${32}m${`Success! Package`}\u001b[${39}m`} ${`\u001b[${33}m${
            cli.input[i]
          }\u001b[${39}m`} ${`\u001b[${32}m${`linked!`}\u001b[${39}m`}\n${`\u001b[${90}mNew symlink created at: ${path.resolve(
            "./",
            "node_modules",
            cli.input[i]
          )}\u001b[${39}m`}`
        );
      } catch (err) {
        console.log(
          `${messagePrefix} ${`\u001b[${31}m${`[ERROR_05] Execa failed when running shell command to create a symlink:`}\u001b[${39}m`}\n${err}`
        );
        continue;
      }
    } else if (isCLI.length) {
      // if CLI dependency

      for (let y = 0, len = isCLI.length; y < len; y++) {
        const binName = isCLI[y];
        console.log(
          `${messagePrefix} processing ${`\u001b[${33}m${binName}\u001b[${39}m`} bin entry of a ${`\u001b[${35}m${
            cli.input[i]
          }\u001b[${39}m`} (${y + 1}/${isCLI.length})`
        );
        // 1. check does the symlink exist already
        // check if symlink already exists
        try {
          if (
            fs.statSync(path.resolve("./", "node_modules", ".bin", binName))
          ) {
            console.log(
              `${messagePrefix} ${`\u001b[${33}m${`[ERROR_06] Skipped! A symlink ${path.resolve(
                "./",
                "node_modules",
                ".bin",
                binName
              )} already exists!`}\u001b[${39}m`}`
            );
            continue;
          }
        } catch (e) {}

        // 2. write the symlink
        try {
          // console.log(
          //   `COMMAND:\n\nln -s\n${path.resolve(
          //     "../",
          //     cli.input[i],
          //     packageJsonContents.bin[binName]
          //   )}\n${path.resolve("./", "node_modules", ".bin", binName)}`
          // );
          execa.sync(
            `ln -s ${path.resolve(
              "../",
              cli.input[i],
              packageJsonContents.bin[binName]
            )} ${path.resolve("./", "node_modules", ".bin", binName)}`,
            {
              shell: true
            }
          );

          console.log(
            `${messagePrefix} ${`\u001b[${32}m${`Success! Package's`}\u001b[${39}m`} ${`\u001b[${33}m${
              cli.input[i]
            }\u001b[${39}m`} ${`\u001b[${32}m${`bin entry`}\u001b[${39}m`} ${`\u001b[${33}m"${binName}"\u001b[${39}m`} ${`\u001b[${32}m${`was linked!`}\u001b[${39}m`}\n${`\u001b[${90}mNew symlink created at: ${path.resolve(
              "./",
              "node_modules",
              ".bin",
              binName
            )}\u001b[${39}m`}`
          );
        } catch (e2) {
          console.log(
            `${messagePrefix} ${`\u001b[${31}m${`[ERROR_07] Execa failed when running shell command to create a symlink:`}\u001b[${39}m`}\n${e2}`
          );
        }
      }
    } else if (!isNormalDep && !isCLI.length) {
      console.log(
        `${messagePrefix} ${`\u001b[${31}m${`[ERROR_08] The package.json of the package "${cli.input[i]}" didn't have any of the keys: "main", "module", "browser" or "bin"`}\u001b[${39}m`}`
      );
      continue;
    }
  } else {
    console.log(
      `${messagePrefix} ${`\u001b[${31}m${`[ERROR_09] Error! A package with name "`}\u001b[${39}m`}${`\u001b[${33}m${
        cli.input[i]
      }\u001b[${39}m`}${`\u001b[${31}m${`" not found!`}\u001b[${39}m`}`
    );
    continue;
  }
}
