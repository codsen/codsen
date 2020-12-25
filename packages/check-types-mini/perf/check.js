#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { checkTypesMini } = require("..");

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
