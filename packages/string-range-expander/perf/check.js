// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { expander } from "../dist/string-range-expander.esm.js";

const callerDir = path.resolve(".");

const fixture = {
  str: "something>\n\t    zzzz <here",
  from: 16,
  to: 20,
  ifRightSideIncludesThisThenCropTightly: "<",
};

const testme = () => expander(fixture);

// action
runPerf(testme, callerDir);
