#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { patcher } = require("..");

const source = `<table>
<tr>
<td>
  something
</td>
</tr>
zzz
<tr>
<td>
  else
</td>
</tr>
</table>`;
const testme = () => patcher(source);

// action
runPerf(testme, callerDir);
