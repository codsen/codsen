#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { genAtomic } from "../dist/generate-atomic-css.esm.js";

const source = `111
222
/*
GENERATE-ATOMIC-CSS-CONFIG-STARTS
| .pt$$$ { padding-top: $$$px !important; }|0|3|

| .mt$$$ { margin-top: $$$px !important; }|0|3|
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS
GENERATE-ATOMIC-CSS-CONTENT-ENDS
*/
333
444
`;
const testme = () => genAtomic(source);

// action
runPerf(testme, callerDir);
