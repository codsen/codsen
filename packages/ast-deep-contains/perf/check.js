// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { deepContains } from "../dist/ast-deep-contains.esm.js";

const callerDir = path.resolve(".");

const reference = [
  { c: "2" },
  { a: "1", b: "2", c: "3" },
  { x: "8", y: "9", z: "0" },
];

const structureToMatch = [
  { a: "1", b: "2", c: "3" },
  { x: "8", y: "9" },
];

const testme = () => {
  const gathered = [];
  const errors = [];
  deepContains(
    reference,
    structureToMatch,
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    (err) => {
      errors.push(err);
    },
  );
  return { gathered, errors };
};

// action
runPerf(testme, callerDir);
