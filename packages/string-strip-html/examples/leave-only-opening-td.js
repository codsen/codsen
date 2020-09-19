/* eslint import/extensions:0, no-unused-vars:0 */

// Leave only opening td tags

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

// the first way
// -----------------------------------------------------------------------------

assert.equal(
  stripHtml(someHtml, {
    // notice there's no: onlyStripTags: ["td"]
    // we operate purely via callback
    cb: ({ tag, deleteFrom, deleteTo, insert, rangesArr, proposedReturn }) => {
      if (tag.name === "td" && !tag.slashPresent) {
        rangesArr.push(proposedReturn);
      }
    },
  }).ranges.reduce(
    (acc, [from, to]) => `${acc}${someHtml.slice(from, to).trim()}`,
    ""
  ),
  `<td class="col1"><td class="col2"><td class="col3"><td class="col4">`
);

// the second way:
// -----------------------------------------------------------------------------

let resultStr = "";
// notice we don't even assign stripHtml() output to anything - we rely only
// on the callback, it mutates the "resultStr" in the upper scope
stripHtml(someHtml, {
  // notice there's no: onlyStripTags: ["td"]
  // we operate purely via callback
  cb: ({ tag, deleteFrom, deleteTo, insert, rangesArr, proposedReturn }) => {
    if (tag.name === "td" && !tag.slashPresent) {
      resultStr += someHtml.slice(deleteFrom, deleteTo).trim();
    }
  },
});
assert.equal(
  resultStr,
  `<td class="col1"><td class="col2"><td class="col3"><td class="col4">`
);
