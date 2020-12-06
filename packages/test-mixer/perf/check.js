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
