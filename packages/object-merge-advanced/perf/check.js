#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const testme = () =>
  f(
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
