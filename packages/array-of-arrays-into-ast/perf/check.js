#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { generateAst } from "../dist/array-of-arrays-into-ast.esm.js";

const testme = () => generateAst([[5], [1, 2, 3], [1, 2]]);

// action
runPerf(testme, callerDir);
