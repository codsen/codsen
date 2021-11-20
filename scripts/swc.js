#!/usr/bin/env node

import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { execaCommandSync } from "execa";
const pkgJson = require(path.join(path.resolve("./"), `package.json`));

const packagesRoot = path.resolve("./");
const rootSwcConfig = path.resolve("../../.swcrc");

const command = `spack`;

// console.log(`pkgJson.name: ${pkgJson.name}`);
console.log(`015 command: ${command}`);
console.log(execaCommandSync(command).stdout);
