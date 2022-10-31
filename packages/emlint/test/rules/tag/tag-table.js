import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";
// import { deepContains } from "ast-deep-contains");

// bails early if structure is messed up
// -----------------------------------------------------------------------------

test(`01 - bails early`, () => {
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
    let messages = verify(not, str, {
      rules: {
        "tag-table": 2,
      },
    });
    equal(applyFixes(str, messages), str, `01.01 - ${str}`);
  });
});

test(`02 - bails when invalid colspan is encountered`, () => {
  // bails because of "z"
  equal(
    verify(
      not,
      `<table>
  <tr>
    <td colspan="z">2</td>
  </tr>
  <tr>
    <td>3</td>
    <td>4</td>
  </tr>
</table>`,
      {
        rules: {
          "tag-table": 2,
        },
      }
    ).length,
    0,
    "02.01"
  );
  // otherwise reports an error
  equal(
    verify(
      not,
      `<table>
  <tr>
    <td colspan="5">2</td>
  </tr>
  <tr>
    <td>3</td>
    <td>4</td>
  </tr>
</table>`,
      {
        rules: {
          "tag-table": 2,
        },
      }
    ).length,
    1,
    "02.02"
  );
});

// colspan issues
// -----------------------------------------------------------------------------

test(`03 - off`, () => {
  let str = `<table>
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
  let messages = verify(not, str, {
    rules: {
      "tag-table": 0,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - one col, two cols`, () => {
  let str = `<table>
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
  let fixed = `<table>
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
  let messages = verify(not, str, {
    rules: {
      "tag-table": 1,
    },
  });
  equal(applyFixes(str, messages), fixed, "04.01");
  equal(messages.length, 1, "04.02");
  compare(
    ok,
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
    "04.03"
  );
});

test(`05 - two cols, three cols`, () => {
  let str = `<table>
  <tr>
    <td>1</td>
    <td>2</td>
  </tr>
  <tr>
    <td>1</td>
    <td>2</td>
    <td>3</td>
  </tr>
</table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-table": 2,
    },
  });
  // can't fix
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages.length, 1, "05.02");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-table",
        idxFrom: 10,
        idxTo: 14,
        message: `Should contain 3 td's.`,
        fix: null,
      },
    ],
    "05.03"
  );
});

test(`06 - 4-2-3`, () => {
  let str = `<table>
  <tr>
    <td>1</td>
    <td>2</td>
    <td>3</td>
    <td>4</td>
  </tr>
  <tr>
    <td>1</td>
    <td>2</td>
  </tr>
  <tr>
    <td>1</td>
    <td>2</td>
    <td>3</td>
  </tr>
</table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-table": 2,
    },
  });
  // can't fix
  equal(applyFixes(str, messages), str, "06.01");
  equal(messages.length, 2, "06.02");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-table",
        idxFrom: 85,
        idxTo: 89,
        message: `Should contain 4 td's.`,
        fix: null,
      },
      {
        ruleId: "tag-table",
        idxFrom: 130,
        idxTo: 134,
        message: `Should contain 4 td's.`,
        fix: null,
      },
    ],
    "06.03"
  );
});

test(`07 - 4-2-1-3 - suggests a fix to one of them`, () => {
  let str = `<table>
  <tr>
    <td>1</td>
    <td>2</td>
    <td>3</td>
    <td>4</td>
  </tr>
  <tr>
    <td>1</td>
    <td>2</td>
  </tr>
  <tr>
    <td style="color:red">1</td>
  </tr>
  <tr>
    <td>1</td>
    <td>2</td>
    <td>3</td>
  </tr>
</table>`;
  let fixed = `<table>
  <tr>
    <td>1</td>
    <td>2</td>
    <td>3</td>
    <td>4</td>
  </tr>
  <tr>
    <td>1</td>
    <td>2</td>
  </tr>
  <tr>
    <td style="color:red" colspan="4">1</td>
  </tr>
  <tr>
    <td>1</td>
    <td>2</td>
    <td>3</td>
  </tr>
</table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-table": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "07.01");
  equal(messages.length, 3, "07.02");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-table",
        idxFrom: 85,
        idxTo: 89,
        message: `Should contain 4 td's.`,
        fix: null,
      },
      {
        ruleId: "tag-table",
        idxFrom: 139,
        idxTo: 161,
        message: `Add a collspan.`,
        fix: {
          ranges: [[160, 160, ` colspan="4"`]],
        },
      },
      {
        ruleId: "tag-table",
        idxFrom: 178,
        idxTo: 182,
        message: `Should contain 4 td's.`,
        fix: null,
      },
    ],
    "07.03"
  );
});

// colspan in play
// -----------------------------------------------------------------------------

test(`08 - fixed a colspan value`, () => {
  let str = `<table>
  <tr>
    <td align="left" colspan="2" class="x">1</td>
  </tr>
  <tr>
    <td>1</td>
    <td>2</td>
  </tr>
  <tr>
    <td>1</td>
    <td>2</td>
    <td>3</td>
  </tr>
</table>`;
  let fixed = `<table>
  <tr>
    <td align="left" colspan="3" class="x">1</td>
  </tr>
  <tr>
    <td>1</td>
    <td>2</td>
  </tr>
  <tr>
    <td>1</td>
    <td>2</td>
    <td>3</td>
  </tr>
</table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-table": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "08.01");
  equal(messages.length, 2, "08.02");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-table",
        idxFrom: 36,
        idxTo: 47,
        message: `Should be colspan="3".`,
        fix: {
          ranges: [[45, 46, "3"]],
        },
      },
      {
        ruleId: "tag-table",
        idxFrom: 75,
        idxTo: 79,
        message: `Should contain 3 td's.`,
        fix: null,
      },
    ],
    "08.03"
  );
});

test(`09 - removed a colspan value`, () => {
  let str = `<table>
  <tr>
    <td align="left" colspan="2" class="x">1</td>
    <td>2</td>
  </tr>
  <tr>
    <td>1</td>
    <td>2</td>
  </tr>
</table>`;
  let fixed = `<table>
  <tr>
    <td align="left" class="x">1</td>
    <td>2</td>
  </tr>
  <tr>
    <td>1</td>
    <td>2</td>
  </tr>
</table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-table": 2,
    },
  });
  equal(applyFixes(str, messages), fixed, "09.01");
  equal(messages.length, 1, "09.02");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-table",
        idxFrom: 36,
        idxTo: 47,
        message: `Remove the colspan.`,
        fix: {
          ranges: [[35, 47]],
        },
      },
    ],
    "09.03"
  );
});

// intra tag text tokens
// -----------------------------------------------------------------------------

test(`10 - text token between table and tr`, () => {
  let str = `<table>.<tr><td>x</td></tr></table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-table": 2,
    },
  });
  equal(applyFixes(str, messages), str, "10.01");
  equal(messages.length, 1, "10.02");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-table",
        idxFrom: 7,
        idxTo: 8,
        message: `Rogue character between tags.`,
        fix: null,
      },
    ],
    "10.03"
  );
});

test(`11 - text token between table and tr`, () => {
  let str = `<table>\ntralala\n<tr><td>x</td></tr></table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-table": 2,
    },
  });
  equal(applyFixes(str, messages), str, "11.01");
  equal(messages.length, 1, "11.02");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-table",
        idxFrom: 7,
        idxTo: 16,
        message: `Rogue characters between tags.`,
        fix: null,
      },
    ],
    "11.03"
  );
});

test(`12 - text token between tr and td`, () => {
  let str = `<table><tr>.<td>x</td></tr></table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-table": 2,
    },
  });
  equal(applyFixes(str, messages), str, "12.01");
  equal(messages.length, 1, "12.02");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-table",
        idxFrom: 11,
        idxTo: 12,
        message: `Rogue character between tags.`,
        fix: null,
      },
    ],
    "12.03"
  );
});

test(`13 - text token between tr and td`, () => {
  let str = `<table><tr>\ntralala\n<td>x</td></tr></table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-table": 2,
    },
  });
  equal(applyFixes(str, messages), str, "13.01");
  equal(messages.length, 1, "13.02");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-table",
        idxFrom: 11,
        idxTo: 20,
        message: `Rogue characters between tags.`,
        fix: null,
      },
    ],
    "13.03"
  );
});

test(`14 - text token between /td and /tr`, () => {
  let str = `<table><tr><td>x</td>.</tr></table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-table": 2,
    },
  });
  equal(applyFixes(str, messages), str, "14.01");
  equal(messages.length, 1, "14.02");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-table",
        idxFrom: 21,
        idxTo: 22,
        message: `Rogue character between tags.`,
        fix: null,
      },
    ],
    "14.03"
  );
});

test(`15 - text token between /td and /tr`, () => {
  let str = `<table><tr><td>x</td>\ntralala\n</tr></table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-table": 2,
    },
  });
  equal(applyFixes(str, messages), str, "15.01");
  equal(messages.length, 1, "15.02");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-table",
        idxFrom: 21,
        idxTo: 30,
        message: `Rogue characters between tags.`,
        fix: null,
      },
    ],
    "15.03"
  );
});

test(`16 - text token between tr and td`, () => {
  let str = `<table><tr><td>x</td></tr>.</table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-table": 2,
    },
  });
  equal(applyFixes(str, messages), str, "16.01");
  equal(messages.length, 1, "16.02");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-table",
        idxFrom: 26,
        idxTo: 27,
        message: `Rogue character between tags.`,
        fix: null,
      },
    ],
    "16.03"
  );
});

test(`17 - text token between tr and td`, () => {
  let str = `<table><tr><td>x</td></tr>\ntralala\n</table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-table": 2,
    },
  });
  equal(applyFixes(str, messages), str, "17.01");
  equal(messages.length, 1, "17.02");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-table",
        idxFrom: 26,
        idxTo: 35,
        message: `Rogue characters between tags.`,
        fix: null,
      },
    ],
    "17.03"
  );
});

// table tag without tr
// -----------------------------------------------------------------------------

test(`18 - table without tr`, () => {
  let str = `<table></table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-table": 2,
    },
  });
  equal(applyFixes(str, messages), str, "18.01");
  equal(messages.length, 1, "18.02");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-table",
        idxFrom: 0,
        idxTo: 7,
        message: `Missing children <tr> tags.`,
        fix: null,
      },
    ],
    "18.03"
  );
});

test(`19 - table without tr`, () => {
  let str = `<table>\n\n\n`;
  let messages = verify(not, str, {
    rules: {
      "tag-table": 2,
    },
  });
  equal(applyFixes(str, messages), str, "19.01");
  equal(messages.length, 1, "19.02");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-table",
        idxFrom: 0,
        idxTo: 7,
        message: `Missing children <tr> tags.`,
        fix: null,
      },
    ],
    "19.03"
  );
});

test(`20 - table without td`, () => {
  let str = `<table><tr></tr></table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-table": 2,
    },
  });
  equal(applyFixes(str, messages), str, "20.01");
  equal(messages.length, 1, "20.02");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-table",
        idxFrom: 0,
        idxTo: 7,
        message: `Missing children <td> tags.`,
        fix: null,
      },
    ],
    "20.03"
  );
});

test(`21 - table without td`, () => {
  let str = `<table><tr>\n\n\n`;
  let messages = verify(not, str, {
    rules: {
      "tag-table": 2,
    },
  });
  equal(applyFixes(str, messages), str, "21.01");
  equal(messages.length, 1, "21.02");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-table",
        idxFrom: 0,
        idxTo: 7,
        message: `Missing children <td> tags.`,
        fix: null,
      },
    ],
    "21.03"
  );
});

// empty td tag
// ------------------------------------------------------------------------------

test(`22 - td is not empty`, () => {
  let str = `<table><tr><td>.</td></tr></table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-table": 2,
    },
  });
  equal(applyFixes(str, messages), str, "22.01");
  equal(messages, [], "22.02");
});

test(`23 - empty td`, () => {
  let str = `<table><tr><td></td></tr></table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-table": 2,
    },
  });
  equal(applyFixes(str, messages), str, "23.01");
  equal(messages.length, 1, "23.02");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-table",
        idxFrom: 11,
        idxTo: 15,
        message: `Empty <td> tag.`,
        fix: null,
      },
    ],
    "23.03"
  );
});

test(`24 - empty td`, () => {
  let str = `<table>\n<tr>\n<td>\n</td>\n</tr>\n</table>`;
  let messages = verify(not, str, {
    rules: {
      "tag-table": 2,
    },
  });
  equal(applyFixes(str, messages), str, "24.01");
  equal(messages.length, 1, "24.02");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "tag-table",
        idxFrom: 13,
        idxTo: 17,
        message: `Empty <td> tag.`,
        fix: null,
      },
    ],
    "24.03"
  );
});

test.run();
