#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { getObj } from "../dist/ast-get-object.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  getObj(
    [
      {
        tag: "meta",
        content: "UTF-8",
        something: "else",
      },
      {
        tag: "title",
        attrs: "Text of the title",
      },
    ],
    {
      tag: "meta",
    }
  );

// action
runPerf(testme, callerDir);
