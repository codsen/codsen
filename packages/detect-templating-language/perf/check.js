// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { detectLang } from "../dist/detect-templating-language.esm.js";

const callerDir = path.resolve(".");

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
