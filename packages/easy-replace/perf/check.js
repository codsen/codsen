#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { er } from "../dist/easy-replace.esm.js";

const testme = () =>
  er(
    "&nbsp;&nbsp&nbsp",
    {
      leftOutsideNot: "",
      leftOutside: "",
      leftMaybe: "",
      searchFor: "nbsp",
      rightMaybe: "",
      rightOutside: "",
      rightOutsideNot: ";",
    },
    "nbsp;"
  );

// action
runPerf(testme, callerDir);
