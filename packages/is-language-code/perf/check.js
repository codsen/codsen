// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { isLangCode } from "../dist/is-language-code.esm.js";

const callerDir = path.resolve(".");

const testme = () => isLangCode("zh-Hans-CN");

// action
runPerf(testme, callerDir);
