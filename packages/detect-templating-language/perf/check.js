#!/usr/bin/env node

// deps
const path = require("path");

const callerDir = path.resolve(".");
const runPerf = require("../../../scripts/run-perf.js");

// setup
const { detectLang } = require("..");

const testme = () =>
  detectLang(`<div>
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
