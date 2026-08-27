// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { collWhitespace } from "../dist/string-collapse-leading-whitespace.esm.js";

const callerDir = path.resolve(".");

const source = "\n \r\n \n  content with inner  spacing  \n \r\n \n";

const testme = () => collWhitespace(source, 2);

// action
runPerf(testme, callerDir);
