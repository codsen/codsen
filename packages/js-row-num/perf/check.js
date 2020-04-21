#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

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
const testme = () => f(source);

// action
runPerf(testme, callerDir);
