// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { findMalformed } from "../dist/string-find-malformed.esm.js";

const callerDir = path.resolve(".");

const testme = () => {
  const gathered = [];
  findMalformed(
    "abcabcd.f",
    "abcdef",
    (obj) => {
      gathered.push(obj);
    },
    {
      maxDistance: 2,
    },
  );
  return gathered;
};

// action
runPerf(testme, callerDir);
