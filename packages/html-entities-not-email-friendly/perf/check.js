#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { notEmailFriendly } from "../dist/html-entities-not-email-friendly.esm.js";

const callerDir = path.resolve(".");

const testme = () => Object.keys(notEmailFriendly).length;

// action
runPerf(testme, callerDir);
