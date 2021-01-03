#!/usr/bin/env node

const fs = require("fs").promises;
const objectPath = require("object-path");

// import tasks:
const readme = require("./src/readme");
const examples = require("./src/examples");
const hardWrite = require("./src/hardWrite");
const hardDelete = require("./src/hardDelete");
const pack = require("./src/pack");
const npmIgnore = require("./src/npmIgnore");
const rollupConfig = require("./src/rollupConfig");
const tsconfig = require("./src/tsconfig");

(async () => {
  //

  // Lect gets called within each monorepo package's root.
  // Premise is that all packages are of two kinds:
  // 1. programs - processed by Rollup, source in TS/ES
  // 2. CLI's - no rollup or TS, source in CommonJS

  // Programs with CLI ("bin") count as programs. For example, program emlint
  // will have a CLI embedded too.

  // SETUP
  // -----------------------------------------------------------------------------

  const state = {
    isCLI: false,
    pack: { name: null, version: null, description: null },
    originalLectrc: {},
  };

  // ACTION
  // -----------------------------------------------------------------------------

  // Read package.json - it's blocking, we need to detect is package CLI or not
  const packageJson = JSON.parse(await fs.readFile("package.json", "utf8"));
  state.pack = packageJson;

  // Primary flag which distinguishes between the two types of ours
  state.isCLI = !objectPath.has(packageJson, "devDependencies.rollup");

  await Promise.all([
    examples({ state }),
    fs.readFile("../.lectrc.json", "utf8"),
  ])
    .then((received) => {
      const lectrc = JSON.parse(received[1]);
      // we make a copy of lectrc just in case somewhere we'd mutate it
      // let's try to prevent futile overwrites, we'll try to compare
      // original vs. what's at the end of the pipeline.
      // For the record, npm ignores are being updated in lectrc via inquirer.
      state.originalLectrc = { ...lectrc };

      // return Promise.all([
      //   // write README.md
      //   readme({ state, examples: received[0], lectrc }),
      //   // write new files
      //   hardWrite({ lectrc }),
      //   // delete bad files
      //   hardDelete({ lectrc }),
      //   // write package.json
      //   pack({ state, lectrc }),
      //   // write .npmignore
      //   npmIgnore({ state, lectrc }),
      //   // write rollup.config.js
      //   rollupConfig({ state }),
      //   // write tsconfig.json
      //   tsconfig({ state }),
      // ]);

      // write README.md
      readme({ state, examples: received[0], lectrc });
      // write new files
      hardWrite({ lectrc });
      // delete bad files
      hardDelete({ lectrc });
      // write package.json
      pack({ state, lectrc });
      // write .npmignore
      npmIgnore({ state, lectrc });
      // write rollup.config.js
      rollupConfig({ state });
      // write tsconfig.json
      tsconfig({ state });
    })
    .catch((e) => {
      console.log(
        `092 lect: ${`\u001b[${31}m${`failure`}\u001b[${39}m`}: ${JSON.stringify(
          Object.keys(e),
          null,
          4
        )}`
      );
      process.exit(1);
    });
})();
