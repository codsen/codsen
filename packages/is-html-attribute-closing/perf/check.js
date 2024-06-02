// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { isAttrClosing } from "../dist/is-html-attribute-closing.esm.js";

const callerDir = path.resolve(".");

const testme = () => {
  isAttrClosing('<a href="zzz" target="_blank" style="color: black;">', 21, 28);
};

// action
runPerf(testme, callerDir);
