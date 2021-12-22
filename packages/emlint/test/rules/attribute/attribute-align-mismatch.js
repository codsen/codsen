import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { verify } from "../../../t-util/util.js";

test(`01`, () => {
  let str = `<table>
  <tr>
    <td align="left">
      <table align="right">
        <tr>
          <td>
            x
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-align-mismatch": 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-align-mismatch",
        idxFrom: 50,
        idxTo: 63,
        message: `Does not match parent td's "align".`,
        fix: null,
      },
    ],
    "01.01"
  );
  equal(messages.length, 1, "01.02");
});

test(`02 - value vs empty`, () => {
  let str = `<table>
  <tr>
    <td align="left">
      <table align="">
        <tr>
          <td>
            x
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-align-mismatch": 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-align-mismatch",
        idxFrom: 50,
        idxTo: 58,
        message: `Does not match parent td's "align".`,
        fix: null,
      },
    ],
    "02.01"
  );
  equal(messages.length, 1, "02.02");
});

test(`03 - empty vs value`, () => {
  let str = `<table>
  <tr>
    <td align="">
      <table align="left">
        <tr>
          <td>
            x
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-align-mismatch": 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-align-mismatch",
        idxFrom: 46,
        idxTo: 58,
        message: `Does not match parent td's "align".`,
        fix: null,
      },
    ],
    "03.01"
  );
  equal(messages.length, 1, "03.02");
});

test(`04 - empty vs empty`, () => {
  let str = `<table>
  <tr>
    <td align="">
      <table align="">
        <tr>
          <td>
            x
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-align-mismatch": 2,
    },
  });
  equal(messages, [], "04");
});

test(`05 - ESP`, () => {
  let str = `<table>
  <tr>
    <td align="left">
      {% if x %}
      <table align="center">
        <tr>
          <td>
            x
          </td>
        </tr>
      </table>
      {% else %}
      <table align="right">
        <tr>
          <td>
            x
          </td>
        </tr>
      </table>
      {% endif %}
    </td>
  </tr>
</table>`;
  let messages = verify(not, str, {
    rules: {
      "attribute-align-mismatch": 2,
    },
  });
  compare(
    ok,
    messages,
    [
      {
        ruleId: "attribute-align-mismatch",
        idxFrom: 200,
        idxTo: 213,
        message: `Does not match parent td's "align".`,
        fix: null,
      },
      {
        ruleId: "attribute-align-mismatch",
        idxFrom: 67,
        idxTo: 81,
        message: `Does not match parent td's "align".`,
        fix: null,
      },
    ],
    "05.01"
  );
  equal(messages.length, 2, "05.02");
});

test.run();
