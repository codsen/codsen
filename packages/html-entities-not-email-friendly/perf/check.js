#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { notEmailFriendly } from "../dist/html-entities-not-email-friendly.esm.js";

const testme = () => Object.keys(notEmailFriendly).length;

// action
runPerf(testme, callerDir);
