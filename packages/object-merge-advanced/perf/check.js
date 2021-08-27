#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { mergeAdvanced } from "../dist/object-merge-advanced.esm.js";

const testme = () =>
  mergeAdvanced(
    {
      a: [
        {
          b: "b",
          c: false,
          d: [
            {
              e: false,
              f: false,
            },
          ],
        },
      ],
      g: false,
      h: [
        {
          i: "i",
        },
      ],
      j: "j",
    },
    {
      a: [
        {
          b: {
            b2: "b2",
          },
          c: false,
          d: [
            {
              e: false,
              f: false,
            },
          ],
        },
      ],
      g: false,
      h: [
        {
          i: "i",
        },
      ],
      j: "j",
    }
  );

// action
runPerf(testme, callerDir);
