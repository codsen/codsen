#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { cparser } = require("..");

const testme = () => {
  const gathered = [];
  cparser(`<a>"something"<span>'here'</span></a>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
};

// action
runPerf(testme, callerDir);
