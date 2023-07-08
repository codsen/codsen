// Works even if `<style>` is within `<body>` and there's no `<head>`

import { strict as assert } from "assert";
import { comb } from "../dist/email-comb.esm.js";

const someHtml = `<html>
<body id="unused-1">
  <table class="unused-2 unused-3">
    <tr>
      <td class="unused-4 unused-5">text</td>
    </tr>
  </table>

  <style>
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
  comb(someHtml).result,
  `<html>
<body>
  <table>
    <tr>
      <td>text</td>
    </tr>
  </table>
</body>
</html>`,
);
