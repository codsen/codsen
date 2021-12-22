#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { checkTypesMini } from "../dist/check-types-mini.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  checkTypesMini(
    {
      aaa: {
        bbb: "a",
      },
      ccc: {
        bbb: "d",
      },
    },
    {
      aaa: {
        bbb: true,
      },
      ccc: {
        bbb: "",
      },
    },
    {
      msg: "msg",
      optsVarName: "OPTS",
      ignorePaths: ["aaa.bbb"],
    }
  );

// action
runPerf(testme, callerDir);
