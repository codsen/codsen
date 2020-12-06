#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { stri } = require("..");

const testme = () =>
  stri(`<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Title here</title>
  </head>
  <body>
    {% if something %}foo{% else %}bar{% endif %}
  </body>
</html>`);

// action
runPerf(testme, callerDir);
