#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { patcher } from "../dist/html-table-patcher.esm.js";

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
