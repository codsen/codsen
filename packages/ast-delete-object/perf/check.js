// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { deleteObj } from "../dist/ast-delete-object.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  deleteObj(
    [
      "elem1",
      {
        key2: "val2",
        key3: "val3",
        key4: "val4",
      },
      "elem4",
    ],
    {
      key2: "val2",
      key3: "val3",
    },
  );

// action
runPerf(testme, callerDir);
