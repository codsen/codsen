// deps
import { strict as assert } from "node:assert";
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { nonEmpty } from "../dist/util-nonempty.esm.js";

const callerDir = path.resolve(".");

const populatedArray = Object.freeze(["value"]);
const emptyArray = Object.freeze([]);
const populatedString = "value";
const emptyString = "";
const populatedObject = Object.freeze({ value: true });
const emptyObject = Object.freeze({});

const testme = () => {
  let populatedCount = 0;
  populatedCount += Number(nonEmpty(populatedArray));
  populatedCount += Number(nonEmpty(emptyArray));
  populatedCount += Number(nonEmpty(populatedString));
  populatedCount += Number(nonEmpty(emptyString));
  populatedCount += Number(nonEmpty(populatedObject));
  populatedCount += Number(nonEmpty(emptyObject));
  return populatedCount;
};

assert.equal(testme(), 3);

// action
runPerf(testme, callerDir);
