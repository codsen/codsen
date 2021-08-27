#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { convertAll } from "../dist/string-apostrophes.esm.js";

const testme = () =>
  convertAll(
    `Welcome to Website Name! Company Name, Inc. ('Company Name' or 'Company') recommends that you read the following terms and conditions carefully.`,
    {
      convertApostrophes: 1,
      convertEntities: 0,
    }
  );

// action
runPerf(testme, callerDir);
