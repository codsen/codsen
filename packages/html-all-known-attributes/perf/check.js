// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { allHtmlAttribs } from "../dist/html-all-known-attributes.esm.js";

const callerDir = path.resolve(".");

const testme = () => allHtmlAttribs.size;

// action
runPerf(testme, callerDir);
