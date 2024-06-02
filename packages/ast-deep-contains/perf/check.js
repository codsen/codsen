// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { deepContains } from "../dist/ast-deep-contains.esm.js";

const callerDir = path.resolve(".");

const testme = () => {
  let gathered = [];
  let errors = [];
  deepContains(
    { a: "1", b: "2" },
    { a: "1", b: "2", c: "3" },
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    (err) => {
      errors.push(err);
    },
  );
};

// action
runPerf(testme, callerDir);
