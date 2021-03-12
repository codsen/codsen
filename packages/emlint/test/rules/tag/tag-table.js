import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util";
// import { deepContains } from "ast-deep-contains");

// bails early if structure is messed up
// -----------------------------------------------------------------------------

tap.test(`01 - bails early`, (t) => {
  [
    //
    `<table>`,
    `</table>`,
    `<table/>`,
    //
    `<table><table>`,
    `<table></table>`,
    `</table><table>`,
    `</table></table>`,
    //
    `<table> <table>`,
    `<table> </table>`,
    `</table> <table>`,
    `</table> </table>`,
    //
    `<table><tr><table>`,
    `<table><tr></table>`,
    `</table><tr><table>`,
    `</table><tr></table>`,
    //
    `<table></tr><table>`,
    `<table></tr></table>`,
    `</table></tr><table>`,
    `</table></tr></table>`,
    //
    `<table> <tr> <table>`,
    `<table> <tr> </table>`,
    `</table> <tr> <table>`,
    `</table> <tr> </table>`,
    //
    `<table> </tr> <table>`,
    `<table> </tr> </table>`,
    `</table> </tr> <table>`,
    `</table> </tr> </table>`,
    //
    `<table><tr><tr><table>`,
    `<table><tr><tr></table>`,
    `</table><tr><tr><table>`,
    `</table><tr><tr></table>`,
    //
    `<table><tr></tr><table>`,
    `<table><tr></tr></table>`,
    `</table><tr></tr><table>`,
    `</table><tr></tr></table>`,
    //
    `<table><tr><td></tr></table>`,
    `<table><tr></td></tr></table>`,
    //
    `<table><tr><td><td></tr></table>`,
    `<table><tr></td><td></tr></table>`,
    `<table><tr><td></td></tr></table>`,
    `<table><tr></td></td></tr></table>`,
    //
    `<table><tr><td><td></tr></table>`,
    `<table><tr></td><td></tr></table>`,
    `<table><tr><td></td></tr></table>`,
    `<table><tr></td></td></tr></table>`,
    //
    `<table><tr><td></td></tr><tr></table>`,
    `<table><tr><td></td></tr></tr></table>`,
    `<table><tr><td></td></tr><td></table>`,
    `<table><tr><td></td></tr></td></table>`,
    //
    `<table><tr><td></td></tr><tr><td></table>`,
    `<table><tr><td></td></tr></tr></td></table>`,
    `<table><tr><td></td></tr><td><td></table>`,
    `<table><tr><td></td></tr></td></td></table>`,
    //
    `<table>
    </tr><td></td></tr>
    <tr><td></td><td></td></tr>
    </table>`,
    `<table>
    <tr></td></td></tr>
    <tr><td></td><td></td></tr>
    </table>`,
    `<table>
    <tr><td></td></tr>
    </tr><td></td><td></td></tr>
    </table>`,
    `<table>
    <tr><td></td></tr>
    <tr></td></td><td></td></tr>
    </table>`,
    //
    `<table>
    <tr><td><td></tr>
    <tr><td></td><td></td></tr>
    </table>`,
    `<table>
    <tr><td></td><tr>
    <tr><td></td><td></td></tr>
    </table>`,
    `<table>
    <tr><td></td></tr>
    <tr><td><td><td></td></tr>
    </table>`,
    `<table>
    <tr><td></td></tr>
    <tr><td></td><td><td></tr>
    </table>`,
    `<table>
    <tr><td></td></tr>
    <tr><td></td><td></td><tr>
    </table>`,
    //
    `<table>
    <tr><td></td></tr>
    <tr><td></td><td></td></tr>
    <tr>
    </table>`,
    `<table>
    <tr><td></td></tr>
    <tr></td><td></td></tr>
    </table>`,
    `<table>
    <tr><td></td></tr>
    <td></td><td></td></tr>
    </table>`,
    `<table>
    <tr><td><td></tr>
    <tr><td><td><td></td></tr>
    </table>`,
  ].forEach((str) => {
    const messages = verify(t, str, {
      rules: {
        "tag-table": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, `01.01 - ${str}`);
    t.strictSame(messages, [], `01.02 - ${str}`);
  });
  t.end();
});

// colspan issues
// -----------------------------------------------------------------------------

tap.test(`02 - off`, (t) => {
  const str = `<table>
  <tr>
    <td>
      only one td
    </td>
  </tr>
  <tr>
    <td>
      col1
    </td>
    <td>
      col2
    </td>
  </tr>
</table>`;
  const messages = verify(t, str, {
    rules: {
      "tag-table": 0,
    },
  });
  t.equal(applyFixes(str, messages), str, "02.01");
  t.strictSame(messages, [], "02.02");
  t.end();
});

tap.test(`03 - warn`, (t) => {
  const str = `<table>
  <tr>
    <td>
      only one td
    </td>
  </tr>
  <tr>
    <td>
      col1
    </td>
    <td>
      col2
    </td>
  </tr>
</table>`;
  const fixed = `<table>
  <tr>
    <td colspan="2">
      only one td
    </td>
  </tr>
  <tr>
    <td>
      col1
    </td>
    <td>
      col2
    </td>
  </tr>
</table>`;
  const messages = verify(t, str, {
    rules: {
      "tag-table": 1,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "03.01");
  t.match(
    messages,
    [
      {
        ruleId: "tag-table",
        severity: 1,
        idxFrom: 19,
        idxTo: 23,
        message: `Add a collspan.`,
        fix: {
          ranges: [[22, 22, ` colspan="2"`]],
        },
      },
    ],
    "03.02"
  );
  t.end();
});
