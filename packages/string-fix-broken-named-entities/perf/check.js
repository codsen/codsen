// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";
import { fastPath, mixedDocument, repeatedEntities } from "./fixtures.js";

const callerDir = path.resolve(".");

// Keep common repairs alongside fuzzy inference and entity-heavy decoding.
const testme = () => [
  fixEnt(fastPath),
  fixEnt(mixedDocument),
  fixEnt(repeatedEntities, { decode: true }),
];

// action
runPerf(testme, callerDir);
