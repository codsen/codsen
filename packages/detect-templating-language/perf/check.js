#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { detectLang } from "../dist/detect-templating-language.esm.js";

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
