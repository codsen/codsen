// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { flattenReferencing } from "../dist/object-flatten-referencing.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  flattenReferencing(
    {
      key1: {
        key2: ["val1", "val2", "val3"],
      },
      key3: {
        key4: ["val4", "val5", "val6"],
      },
    },
    {
      key1: "Contact us",
      key3: {
        key4: ["val4", "val5", "val6"],
      },
    },
    {
      wrapHeadsWith: "%%_",
      wrapTailsWith: "_%%",
      xhtml: false,
    },
  );

// action
runPerf(testme, callerDir);
