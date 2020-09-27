/* eslint import/extensions:0, no-unused-vars:0 */

// Quick Take

import { strict as assert } from "assert";
import { patcher } from "../dist/html-table-patcher.esm";

assert.equal(
  patcher(
    `<table>
{% if customer.details.hasAccount %}
<tr>
  <td>
    variation #1
  </td>
</tr>
{% else %}
<tr>
  <td>
    variation #2
  </td>
</tr>
{% endif %}
</table>`
  ).result,
  `<table>

<tr>
  <td>
    {% if customer.details.hasAccount %}
  </td>
</tr>

<tr>
  <td>
    variation #1
  </td>
</tr>

<tr>
  <td>
    {% else %}
  </td>
</tr>

<tr>
  <td>
    variation #2
  </td>
</tr>

<tr>
  <td>
    {% endif %}
  </td>
</tr>

</table>`
);
