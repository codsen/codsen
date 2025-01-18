// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
// eslint-disable-next-line @typescript-eslint/no-redeclare
import { find } from "../dist/ast-monkey.esm.js";

const callerDir = path.resolve(".");

// find()
const testme = () =>
  find(
    {
      a: {
        b: "c1",
      },
      k: {
        b: "c2",
      },
      z: {
        x: "y",
      },
    },
    {
      key: null,
      val: { b: "c*" },
    },
  );

// action
runPerf(testme, callerDir);
