#!/usr/bin/env node

import fs from "fs";
// import path from "path";
import { sync as write } from "write-file-atomic";

const rollupBinContents = fs
  .readFileSync("node_modules/rollup/dist/bin/rollup", "utf8")
  .replace(
    "runRollup(command);",
    "runRollup(command).then(() => process.exit());"
  );
write("node_modules/rollup/dist/bin/rollup", rollupBinContents);
