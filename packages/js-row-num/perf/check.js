#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { fixRowNums } from "../dist/js-row-num.esm.js";

const callerDir = path.resolve(".");

const source = `
zzz
zzz
zzz
console.log("099 123 something 456")console.log("----\n\n\n0 something")
zzz
zzz
zzz
console.log("099 123 something 456")console.log("----\n\n\n0 something")
console.log("099 123 something 456")console.log("----\n\n\n0 something")
zzz
zzz
zzz
console.log("099 123 something 456")console.log("----\n\n\n0 something")
console.log("099 123 something 456")console.log("----\n\n\n0 something")
zzz
zzz
zzz
console.log("099 123 something 456")console.log("----\n\n\n0 something")
zzz
zzz
zzz
console.log("099 123 something 456")console.log("----\n\n\n0 something")
zzz
zzz
zzz
console.log("099 123 something 456")console.log("----\n\n\n0 something")
zzz
zzz
zzz
console.log("099 123 something 456")console.log("----\n\n\n0 something")
zzz
zzz
zzz
console.log("099 123 something 456")console.log("----\n\n\n0 something")
zzz
zzz
zzz
console.log("099 123 something 456")console.log("----\n\n\n0 something")
zzz
zzz
zzz
console.log("099 123 something 456")console.log("----\n\n\n0 something")
zzz
zzz
zzz
console.log("099 123 something 456")console.log("----\n\n\n0 something")
`;
const testme = () => fixRowNums(source);

// action
runPerf(testme, callerDir);
