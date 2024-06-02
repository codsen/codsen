// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { overlap } from "../dist/string-overlap-one-on-another.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  overlap("123", "b", { offset: 5, offsetFillerCharacter: "" });

// action
runPerf(testme, callerDir);
