#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const f = require("..");

const testme = () =>
  f(`<div>
<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      placeholder
    </td>
  </tr>
</table>
{% if something %}x{% else %}y{% endif %}
<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      placeholder
    </td>
  </tr>
</table>
</div>`);

// action
runPerf(testme, callerDir);
