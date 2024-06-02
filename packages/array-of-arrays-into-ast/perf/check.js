// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { generateAst } from "../dist/array-of-arrays-into-ast.esm.js";

const callerDir = path.resolve(".");

const testme = () => generateAst([[5], [1, 2, 3], [1, 2]]);

// action
runPerf(testme, callerDir);
