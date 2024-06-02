// deps
import path from "path";

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
    { matchKeysStrictly: true, hungryForWhitespace: false },
  );

// action
runPerf(testme, callerDir);
