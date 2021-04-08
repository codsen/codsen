import tap from "tap";
import { verify } from "../../../t-util/util";

tap.test(`01`, (t) => {
  const str = `<table>
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
  const messages = verify(t, str, {
    rules: {
      "attribute-align-mismatch": 2,
    },
  });
  t.match(
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
  t.equal(messages.length, 1, "01.02");
  t.end();
});

tap.test(`02 - value vs empty`, (t) => {
  const str = `<table>
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
  const messages = verify(t, str, {
    rules: {
      "attribute-align-mismatch": 2,
    },
  });
  t.match(
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
  t.equal(messages.length, 1, "02.02");
  t.end();
});

tap.test(`03 - empty vs value`, (t) => {
  const str = `<table>
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
  const messages = verify(t, str, {
    rules: {
      "attribute-align-mismatch": 2,
    },
  });
  t.match(
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
  t.equal(messages.length, 1, "03.02");
  t.end();
});

tap.test(`04 - empty vs empty`, (t) => {
  const str = `<table>
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
  const messages = verify(t, str, {
    rules: {
      "attribute-align-mismatch": 2,
    },
  });
  t.strictSame(messages, [], "04");
  t.end();
});

tap.test(`05 - ESP`, (t) => {
  const str = `<table>
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
  const messages = verify(t, str, {
    rules: {
      "attribute-align-mismatch": 2,
    },
  });
  t.match(
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
  t.equal(messages.length, 2, "05.02");
  t.end();
});
