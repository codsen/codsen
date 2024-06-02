// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { genAtomic } from "../dist/generate-atomic-css.esm.js";

const callerDir = path.resolve(".");

const source = `111
222
/*
GENERATE-ATOMIC-CSS-CONFIG-STARTS
| .pt$$$ { padding-top: $$$px !important; }|0|3|

| .mt$$$ { margin-top: $$$px !important; }|0|3|
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS
GENERATE-ATOMIC-CSS-CONTENT-ENDS
*/
333
444
`;
const testme = () => genAtomic(source);

// action
runPerf(testme, callerDir);
