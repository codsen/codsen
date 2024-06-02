// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { cparser } from "../dist/codsen-parser.esm.js";

const callerDir = path.resolve(".");

const testme = () => {
  let gathered = [];
  cparser("<a>\"something\"<span>'here'</span></a>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
};

// action
runPerf(testme, callerDir);
