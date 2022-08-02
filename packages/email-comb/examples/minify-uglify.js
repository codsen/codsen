// Minifies and uglifies

import { strict as assert } from "assert";
import { comb } from "../dist/email-comb.esm.js";

const someHtml = `<html>
<body id="used-1">
  <table class="unused-2 unused-3">
    <tr>
      <td class="unused-4 unused-5">text</td>
    </tr>
  </table>

  <style>
    #used-1 {
      color: #ccc;
    }
    .unused-6 {
      display: block;
    }
    #unused-7 {
      height: auto;
    }
  </style>
</body>
</html>`;

assert.equal(
  comb(someHtml, {
    uglify: true,
    htmlCrushOpts: {
      removeLineBreaks: true,
    },
  }).result,
  `<html>
<body id="q">
<table><tr><td>text
</td></tr></table>
<style>#q{color:#ccc;}
</style>
</body>
</html>`
);
