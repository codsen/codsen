#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { mixer } from "../dist/test-mixer.esm.js";

const testme = () =>
  mixer(
    {
      foo: true,
    },
    {
      foo: true,
      bar: false,
      baz: {
        a: {
          b: {
            c: 9,
          },
        },
      },
    }
  );

// action
runPerf(testme, callerDir);
