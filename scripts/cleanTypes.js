#!/usr/bin/env node
/* eslint import/no-extraneous-dependencies: 0 */

const { readdirSync, removeSync, copySync } = require("fs-extra");
const path = require("path");

if (process.argv[2] === "--pt1") {
  //
  //
  //
  // part 1 - clear the types folder
  removeSync(path.resolve("./types"));
} else if (process.argv[2] === "--pt2") {
  //
  //
  //
  // part 2 - move types from deep subfolder to the types folder root
  // 1. copy contents from ./types/packages/<packages-name>/src/ to ./types
  const targetDir = path.join(
    "types/packages",
    readdirSync(`types/packages`)[0],
    "src"
  );
  copySync(targetDir, path.resolve("./types"));

  // 2. delete the ./packages/<package-name>/types/packages/*
  removeSync(path.resolve("./types/packages"));
}
