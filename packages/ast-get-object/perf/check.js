#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { getObj } from "../dist/ast-get-object.esm.js";

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
