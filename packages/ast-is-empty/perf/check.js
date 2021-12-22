#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { isEmpty } from "../dist/ast-is-empty.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  isEmpty([
    {
      a: [""],
      b: { c: ["", " ", { d: [""] }] },
    },
  ]);

// action
runPerf(testme, callerDir);
