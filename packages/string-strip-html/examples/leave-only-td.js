/* eslint import/extensions:0 */

// Leave only td tags

import { strict as assert } from "assert";
import stripHtml from "../dist/string-strip-html.esm.js";

const someHtml = `<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td class="col1">
      cell1
    </td>
    <td class="col2">
      cell2
    </td>
  </tr>
  <tr>
    <td class="col3">
      cell3
    </td>
    <td class="col4">
      cell4
    </td>
  </tr>
</table>`;

assert.equal(
  stripHtml(someHtml, {
    onlyStripTags: ["td"],
  }).filteredTagLocations.reduce(
    (acc, [from, to]) => `${acc}${someHtml.slice(from, to)}`,
    ""
  ),
  `<td class="col1"></td><td class="col2"></td><td class="col3"></td><td class="col4"></td>`
);
