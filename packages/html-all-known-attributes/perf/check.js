#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { allHtmlAttribs } from "../dist/html-all-known-attributes.esm.js";

const testme = () => allHtmlAttribs.size;

// action
runPerf(testme, callerDir);
