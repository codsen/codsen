// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { convertAll } from "../dist/string-apostrophes.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  convertAll(
    "Welcome to Website Name! Company Name, Inc. ('Company Name' or 'Company') recommends that you read the following terms and conditions carefully.",
    {
      convertApostrophes: true,
      convertEntities: false,
    },
  );

// action
runPerf(testme, callerDir);
