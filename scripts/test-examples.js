#!/usr/bin/env node

const fs = require("fs");
const util = require("util");
const path = require("path");
const execa = require("execa");

// we don't want to deal with callbacks so let's promisify:
const readdir = util.promisify(fs.readdir);

readdir(path.resolve(`.`, "examples"))
  // filter out *.mjs
  .then((files) =>
    files.filter((file) => [".js", ".mjs"].includes(path.extname(file)))
  )
  .then((files) =>
    Promise.all(
      files.map((file) =>
        execa(`node -r esm ${path.resolve(`.`, "examples", file)}`, {
          shell: true,
          stdio: "inherit",
        })
          .then(() => {
            // log "PASS" on bold, black on green brackground:
            console.log(
              `\u001B[30m\u001B[42m PASS \u001B[49m\u001B[39m examples/${file} ${`\u001b[${32}m${`OK`}\u001b[${39}m`}`
            );
          })
          .catch((err) => {
            console.log(
              `\u001b[${37};${1};${41}m FAIL \u001b[${49}m examples/${file}:\n${err}`
            );
            process.exit(1);
          })
      )
    ).catch((err) => {
      // tests failed:
      console.log(
        `text-examples.js - Unit test failed:\n${`\u001b[${31}m${err}\u001b[${39}m`}`
      );
      process.exit(1);
    })
  )
  .catch(() => {
    // silently exit - examples not found!
    process.exit(0);
  });
