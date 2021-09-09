#!/usr/bin/env node

import { readdirSync, removeSync, copySync } from "fs-extra";
import path from "path";

if (process.argv[2] === "--pt1") {
  //
  //
  //
  // part 1 - clear the types folder
  try {
    removeSync(path.resolve("./types"));
  } catch (e) {
    console.log(`could not remove "./types"`);
  }
} else if (process.argv[2] === "--pt2") {
  //
  //
  //
  // part 2 - move types from deep subfolder to the types folder root
  // 1. copy contents from ./types/packages/<packages-name>/src/ to ./types
  try {
    const targetDir = path.join(
      "types/packages",
      readdirSync(`types/packages`)[0],
      "src"
    );
    copySync(targetDir, path.resolve("./types"));

    // 2. delete the ./packages/<package-name>/types/packages/*
    removeSync(path.resolve("./types/packages"));
  } catch (e) {
    console.log(`could not find "./types/packages"`);
  }
}
