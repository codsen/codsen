#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { checkTypesMini } from "../dist/check-types-mini.esm.js";

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
