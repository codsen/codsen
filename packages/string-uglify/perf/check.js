#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { uglifyArr } = require("..");

const testme = () =>
  uglifyArr([
    ".class1",
    ".class2",
    ".class3",
    ".class4",
    ".class5",
    ".class6",
    ".class7",
    ".class8",
    ".class9",
    ".class10",
    "#id1",
    "#id2",
    "#id3",
    "#id4",
    "#id5",
    "#id6",
    "#id7",
    "#id8",
    "#id9",
    "#id10",
  ]);

// action
runPerf(testme, callerDir);
