#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { stripHtml } from "../dist/string-strip-html.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  stripHtml(`<html><head>
<style type="text/css">#outlook a{ padding:0;}
.ExternalClass, .ReadMsgBody{ background-color:#ffffff; width:100%;}
@media only screen and (max-width: 660px){
.wbr-h{ display:none !important;}
}
</style></head>
<body>aaa</body>
</html>`);

// action
runPerf(testme, callerDir);
