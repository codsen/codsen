#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { deleteObj } from "../dist/ast-delete-object.esm.js";

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
    { matchKeysStrictly: true, hungryForWhitespace: false }
  );

// action
runPerf(testme, callerDir);
