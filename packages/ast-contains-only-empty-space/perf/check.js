// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { empty } from "../dist/ast-contains-only-empty-space.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  empty([
    "   ",
    {
      key2: "   ",
      key3: "   \n   ",
      key4: "   \t   ",
    },
    "\n\n\n\n\n\n   \t   ",
  ]);

// action
runPerf(testme, callerDir);
