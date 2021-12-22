#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { patcher } from "../dist/html-table-patcher.esm.js";

const callerDir = path.resolve(".");

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
