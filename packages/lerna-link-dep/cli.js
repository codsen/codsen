#!/usr/bin/env node

/* eslint no-empty:0 */

// VARS
// -----------------------------------------------------------------------------

import meow from "meow";
import path from "path";
import fs from "fs-extra";
import { execaSync } from "execa";
import { createRequire } from "module";
import updateNotifier from "update-notifier";

const require1 = createRequire(import.meta.url);
const pkg = require1("./package.json");

const { log } = console;

const messagePrefix = `\u001b[${90}m${"✨ lerna-link-dep: "}\u001b[${39}m`;

const cli = meow(
  `
  Usage
    $ deplink <name of another package from monorepo>
    $ deplink email-remove-unused-css
    $ deplink detergent

  Options
    -d, --dev           Adds dependency as devDependency in package.json
    -h, --help          Shows this help
    -v, --version       Shows the current installed version

  The package you requested must be in a neighbour folder to the
  one you're at currently.
`,
  {
    importMeta: import.meta,
    flags: {
      dev: {
        type: "boolean",
        shortFlag: "d",
        default: false,
      },
      help: {
        type: "boolean",
        shortFlag: "h",
        default: false,
      },
      version: {
        type: "boolean",
        shortFlag: "v",
        default: false,
      },
    },
  },
);
updateNotifier({ pkg }).notify();

// Step #0. take care of -v and -h flags that are left out in meow.
// -----------------------------------------------------------------------------

if (cli.flags.version) {
  log(pkg.version);
  process.exit(0);
} else if (cli.flags.help) {
  log(cli.help);
  process.exit(0);
}

// Step #1. gather the to-do list of files.
// -----------------------------------------------------------------------------

// console.log(
//   `069 ${`\u001b[${33}m${`cli.input`}\u001b[${39}m`} = ${JSON.stringify(
//     cli.input,
//     null,
//     4
//   )}`
// );

// console.log(`current dir:\n${path.resolve()}`);
// console.log(`resolved dir:\n${path.resolve("./")}`);
// console.log(`up from current dir:\n${path.resolve(path.resolve(), "../")}`);

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
  let requestedPackageJsonContents;

  // also contents of the asker package's package.json:
  let askerPackageJsonContents;

  let check;
  try {
    check = fs.statSync(path.resolve("../", cli.input[i]));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    console.log(
      `${messagePrefix} ${`\u001b[${31}m${'[ERROR_01] Error! A package with name "'}\u001b[${39}m`}${`\u001b[${33}m${cli.input[i]}\u001b[${39}m`}${`\u001b[${31}m${'" not found!'}\u001b[${39}m`}`,
    );
    continue;
  }

  if (check?.isDirectory()) {
    // check the existence of package.json in the asking folder
    // -------------------------------------------------------------------------
    try {
      fs.statSync(path.resolve("package.json"));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      console.log(
        `${messagePrefix} ${`\u001b[${31}m${"[ERROR_02] Error! A package.json doesn't exist at:\n"}\u001b[${39}m`}${`\u001b[${33}m${path.resolve(
          path.resolve(),
          "../",
          cli.input[i],
          "package.json",
        )}\u001b[${39}m`}`,
      );
      continue;
    }

    // check the existence of package.json within the requested package's folder
    // -------------------------------------------------------------------------
    try {
      fs.statSync(path.resolve("../", cli.input[i], "package.json"));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      console.log(
        `${messagePrefix} ${`\u001b[${31}m${"[ERROR_03] Error! A package.json doesn't exist at:\n"}\u001b[${39}m`}${`\u001b[${33}m${path.resolve(
          path.resolve(),
          "../",
          cli.input[i],
          "package.json",
        )}\u001b[${39}m`}`,
      );
      continue;
    }

    // console.log(
    //   `${messagePrefix} ${`\u001b[${32}m${`OK: package.json exists at:`}\u001b[${39}m`}\n${`\u001b[${33}m${path.resolve(
    //     path.resolve(),
    //     "../",
    //     cli.input[i],
    //     "package.json"
    //   )}\u001b[${39}m`}`
    // );

    // read the asker package's package.json:
    // -------------------------------------------------------------------------

    try {
      askerPackageJsonContents = fs.readJsonSync(
        path.resolve("package.json"),
        "utf8",
      );
    } catch (e1) {
      console.log(
        `${messagePrefix} ${`\u001b[${31}m${"[ERROR_04] Something went wrong trying to read package.json at path:"}\u001b[${39}m`}\n${path.resolve(
          "package.json",
        )}\n\n${`\u001b[${31}m${"error:"}\u001b[${39}m`}\n${e1}`,
      );
      continue;
    }

    // read the requested package's package.json:
    // -------------------------------------------------------------------------
    try {
      requestedPackageJsonContents = fs.readJsonSync(
        path.resolve("../", cli.input[i], "package.json"),
        "utf8",
      );

      // if it's normal dep:
      if (
        typeof requestedPackageJsonContents === "object" &&
        Object.prototype.hasOwnProperty.call(
          requestedPackageJsonContents,
          "main",
        )
      ) {
        isNormalDep = true;

        // check if symlink already exists
        try {
          if (fs.statSync(path.resolve("./", "node_modules", cli.input[i]))) {
            console.log(
              `${messagePrefix} ${`\u001b[${33}m${"[ERROR_05] Skipped! A symlink already exists:"}\u001b[${39}m`}\n${`\u001b[${90}m${path.resolve(
                "./",
                "node_modules",
                cli.input[i],
              )}\u001b[${39}m`}`,
            );
            continue;
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {}
      }

      // if it'a a CLI:
      if (
        typeof requestedPackageJsonContents === "object" &&
        Object.prototype.hasOwnProperty.call(
          requestedPackageJsonContents,
          "bin",
        ) &&
        Object.keys(requestedPackageJsonContents.bin).length
      ) {
        isCLI = Object.keys(requestedPackageJsonContents.bin);
      }
    } catch (e1) {
      console.log(
        `${messagePrefix} ${`\u001b[${31}m${"[ERROR_06] Something went wrong trying to read package.json at path:"}\u001b[${39}m`}\n${path.resolve(
          path.resolve(),
          "../",
          cli.input[i],
          "package.json",
        )}\n\n${`\u001b[${31}m${"error:"}\u001b[${39}m`}\n${e1}`,
      );
      continue;
    }

    // create symlinks:
    // -------------------------------------------------------------------------
    if (isNormalDep) {
      // run the query using execa:
      try {
        execaSync(
          `ln -s ${path.resolve("../", cli.input[i])} ${path.resolve(
            "./",
            "node_modules",
            cli.input[i],
          )}`,
          {
            shell: true,
          },
        );

        console.log(
          `${messagePrefix} ${`\u001b[${32}m${"Success! Package"}\u001b[${39}m`} ${`\u001b[${33}m${cli.input[i]}\u001b[${39}m`} ${`\u001b[${32}m${"linked!"}\u001b[${39}m`}\n${`\u001b[${90}mNew symlink created at: ${path.resolve(
            "./",
            "node_modules",
            cli.input[i],
          )}\u001b[${39}m`}`,
        );
      } catch (err) {
        console.log(
          `${messagePrefix} ${`\u001b[${31}m${"[ERROR_07] Execa failed when running shell command to create a symlink:"}\u001b[${39}m`}\n${err}`,
        );
        continue;
      }
    } else if (isCLI.length) {
      // if CLI dependency

      for (let y = 0, len2 = isCLI.length; y < len2; y++) {
        let binName = isCLI[y];
        console.log(
          `${messagePrefix} processing ${`\u001b[${33}m${binName}\u001b[${39}m`} bin entry of a ${`\u001b[${35}m${cli.input[i]}\u001b[${39}m`} (${
            y + 1
          }/${isCLI.length})`,
        );
        // 1. check does the symlink exist already
        // check if symlink already exists
        try {
          if (
            fs.statSync(path.resolve("./", "node_modules", ".bin", binName))
          ) {
            console.log(
              `${messagePrefix} ${`\u001b[${33}m${`[ERROR_08] Skipped! A symlink ${path.resolve(
                "./",
                "node_modules",
                ".bin",
                binName,
              )} already exists!`}\u001b[${39}m`}`,
            );
            continue;
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {}

        // 2. write the symlink
        try {
          // console.log(
          //   `COMMAND:\n\nln -s\n${path.resolve(
          //     "../",
          //     cli.input[i],
          //     requestedPackageJsonContents.bin[binName]
          //   )}\n${path.resolve("./", "node_modules", ".bin", binName)}`
          // );
          execaSync(
            `ln -s ${path.resolve(
              "../",
              cli.input[i],
              requestedPackageJsonContents.bin[binName],
            )} ${path.resolve("./", "node_modules", ".bin", binName)}`,
            {
              shell: true,
            },
          );

          console.log(
            `${messagePrefix} ${`\u001b[${32}m${"Success! Package's"}\u001b[${39}m`} ${`\u001b[${33}m${cli.input[i]}\u001b[${39}m`} ${`\u001b[${32}m${"bin entry"}\u001b[${39}m`} ${`\u001b[${33}m"${binName}"\u001b[${39}m`} ${`\u001b[${32}m${"was linked!"}\u001b[${39}m`}\n${`\u001b[${90}mNew symlink created at: ${path.resolve(
              "./",
              "node_modules",
              ".bin",
              binName,
            )}\u001b[${39}m`}`,
          );
        } catch (e2) {
          console.log(
            `${messagePrefix} ${`\u001b[${31}m${"[ERROR_09] Execa failed when running shell command to create a symlink:"}\u001b[${39}m`}\n${e2}`,
          );
        }
      }
    } else if (!isNormalDep && !isCLI.length) {
      console.log(
        `${messagePrefix} ${`\u001b[${31}m${`[ERROR_10] The package.json of the package "${cli.input[i]}" didn't have any of the keys: "main", "module", "browser" or "bin"`}\u001b[${39}m`}`,
      );
      continue;
    }

    // if this point was reached, symlink was created successfully.
    // add entry in the asker's package.json

    //
    // write the asker package's package.json:
    // -------------------------------------------------------------------------
    if (
      (isNormalDep || isCLI.length) &&
      ((cli.flags.dev &&
        !askerPackageJsonContents.devDependencies?.[cli.input[i]]) ||
        (!cli.flags.dev &&
          !askerPackageJsonContents.dependencies?.[cli.input[i]]))
    ) {
      try {
        if (cli.flags.dev) {
          // user wants dev dep added in package.json
          if (!askerPackageJsonContents.devDependencies) {
            askerPackageJsonContents.devDependencies = {};
          }
          askerPackageJsonContents.devDependencies[cli.input[i]] =
            `^${requestedPackageJsonContents.version}`;
          fs.writeJsonSync(
            path.resolve("package.json"),
            askerPackageJsonContents,
            { spaces: 2 },
          );
        } else {
          // user wants normal dep added in package.json
          if (!askerPackageJsonContents.dependencies) {
            askerPackageJsonContents.dependencies = {};
          }
          askerPackageJsonContents.dependencies[cli.input[i]] =
            `^${requestedPackageJsonContents.version}`;
          fs.writeJsonSync(
            path.resolve("package.json"),
            askerPackageJsonContents,
            { spaces: 2 },
          );
        }
      } catch (e1) {
        console.log(
          `${messagePrefix} ${`\u001b[${31}m${"[ERROR_11] Something went wrong trying to write package.json at path:"}\u001b[${39}m`}\n${path.resolve(
            "package.json",
          )}\n\n${`\u001b[${31}m${"error:"}\u001b[${39}m`}\n${e1}`,
        );
        continue;
      }
    }
  } else {
    console.log(
      `${messagePrefix} ${`\u001b[${31}m${'[ERROR_12] Error! A package with name "'}\u001b[${39}m`}${`\u001b[${33}m${cli.input[i]}\u001b[${39}m`}${`\u001b[${31}m${'" not found!'}\u001b[${39}m`}`,
    );
    continue;
  }
}
