// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { stripHtml } from "../dist/string-strip-html.esm.js";

const callerDir = path.resolve(".");

// One row of an email template, repeated into an input of the size users
// actually send this package. The fixture is deliberately several kilobytes:
// a few hundred bytes cannot show how the program scales with input length,
// and scaling is where this package's cost lives.
const row = `<tr>
  <td class="pad" style="padding:10px 20px;">
    <a href="https://codsen.com/os/string-strip-html">Read more</a>
    <span>about <b>stripping</b> HTML</span>
  </td>
</tr>
`;

const emailTemplate = `<html><head>
<style type="text/css">#outlook a{ padding:0;}
.ExternalClass, .ReadMsgBody{ background-color:#ffffff; width:100%;}
@media only screen and (max-width: 660px){
.wbr-h{ display:none !important;}
}
</style></head>
<body>
<table role="presentation" width="100%">
<tbody>
${row.repeat(40)}</tbody>
</table>
</body>
</html>`;

const testme = () => stripHtml(emailTemplate);

// action
runPerf(testme, callerDir);
