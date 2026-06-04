// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { emptyCondCommentRegex } from "../dist/regex-empty-conditional-comments.esm.js";

const callerDir = path.resolve(".");

const testme = () => emptyCondCommentRegex();

// action
runPerf(testme, callerDir);
