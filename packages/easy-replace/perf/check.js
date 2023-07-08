#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { er } from "../dist/easy-replace.esm.js";

const callerDir = path.resolve(".");

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
    "nbsp;",
  );

// action
runPerf(testme, callerDir);
