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
  });
  t.end();
});

tap.test(`02 - bails when invalid colspan is encountered`, (t) => {
  // bails because of "z"
  t.strictSame(
    verify(
      t,
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
  t.strictSame(
    verify(
      t,
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
  t.end();
});

// colspan issues
// -----------------------------------------------------------------------------

tap.test(`03 - off`, (t) => {
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
  t.equal(applyFixes(str, messages), str, "03.01");
  t.strictSame(messages, [], "03.02");
  t.end();
});

tap.test(`04 - one col, two cols`, (t) => {
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
  t.equal(applyFixes(str, messages), fixed, "04.01");
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
    "04.02"
  );
  t.equal(messages.length, 1, "04.03");
  t.end();
});

tap.test(`05 - two cols, three cols`, (t) => {
  const str = `<table>
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
  const messages = verify(t, str, {
    rules: {
      "tag-table": 2,
    },
  });
  // can't fix
  t.equal(applyFixes(str, messages), str, "05.01");
  t.match(
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
    "05.02"
  );
  t.equal(messages.length, 1, "05.03");
  t.end();
});

tap.test(`06 - 4-2-3`, (t) => {
  const str = `<table>
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
  const messages = verify(t, str, {
    rules: {
      "tag-table": 2,
    },
  });
  // can't fix
  t.equal(applyFixes(str, messages), str, "06.01");
  t.match(
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
    "06.02"
  );
  t.equal(messages.length, 2, "06.03");
  t.end();
});

tap.test(`07 - 4-2-1-3 - suggests a fix to one of them`, (t) => {
  const str = `<table>
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
  const fixed = `<table>
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
  const messages = verify(t, str, {
    rules: {
      "tag-table": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "07.01");
  t.match(
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
    "07.02"
  );
  t.equal(messages.length, 3, "07.03");
  t.end();
});

// colspan in play
// -----------------------------------------------------------------------------

tap.test(`08 - fixed a colspan value`, (t) => {
  const str = `<table>
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
  const fixed = `<table>
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
  const messages = verify(t, str, {
    rules: {
      "tag-table": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "08.01");
  t.match(
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
    "08.02"
  );
  t.equal(messages.length, 2, "08.03");
  t.end();
});

tap.test(`09 - removed a colspan value`, (t) => {
  const str = `<table>
  <tr>
    <td align="left" colspan="2" class="x">1</td>
    <td>2</td>
  </tr>
  <tr>
    <td>1</td>
    <td>2</td>
  </tr>
</table>`;
  const fixed = `<table>
  <tr>
    <td align="left" class="x">1</td>
    <td>2</td>
  </tr>
  <tr>
    <td>1</td>
    <td>2</td>
  </tr>
</table>`;
  const messages = verify(t, str, {
    rules: {
      "tag-table": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "09.01");
  t.match(
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
    "09.02"
  );
  t.equal(messages.length, 1, "09.03");
  t.end();
});

// intra tag text tokens
// -----------------------------------------------------------------------------

tap.test(`10 - text token between table and tr`, (t) => {
  const str = `<table>.<tr><td>x</td></tr></table>`;
  const messages = verify(t, str, {
    rules: {
      "tag-table": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "10.01");
  t.match(
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
    "10.02"
  );
  t.equal(messages.length, 1, "10.03");
  t.end();
});

tap.test(`11 - text token between table and tr`, (t) => {
  const str = `<table>\ntralala\n<tr><td>x</td></tr></table>`;
  const messages = verify(t, str, {
    rules: {
      "tag-table": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "11.01");
  t.match(
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
    "11.02"
  );
  t.equal(messages.length, 1, "11.03");
  t.end();
});

tap.test(`12 - text token between tr and td`, (t) => {
  const str = `<table><tr>.<td>x</td></tr></table>`;
  const messages = verify(t, str, {
    rules: {
      "tag-table": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "12.01");
  t.match(
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
    "12.02"
  );
  t.equal(messages.length, 1, "12.03");
  t.end();
});

tap.test(`13 - text token between tr and td`, (t) => {
  const str = `<table><tr>\ntralala\n<td>x</td></tr></table>`;
  const messages = verify(t, str, {
    rules: {
      "tag-table": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "13.01");
  t.match(
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
    "13.02"
  );
  t.equal(messages.length, 1, "13.03");
  t.end();
});

tap.test(`14 - text token between /td and /tr`, (t) => {
  const str = `<table><tr><td>x</td>.</tr></table>`;
  const messages = verify(t, str, {
    rules: {
      "tag-table": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "14.01");
  t.match(
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
    "14.02"
  );
  t.equal(messages.length, 1, "14.03");
  t.end();
});

tap.test(`15 - text token between /td and /tr`, (t) => {
  const str = `<table><tr><td>x</td>\ntralala\n</tr></table>`;
  const messages = verify(t, str, {
    rules: {
      "tag-table": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "15.01");
  t.match(
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
    "15.02"
  );
  t.equal(messages.length, 1, "15.03");
  t.end();
});

tap.test(`16 - text token between tr and td`, (t) => {
  const str = `<table><tr><td>x</td></tr>.</table>`;
  const messages = verify(t, str, {
    rules: {
      "tag-table": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "16.01");
  t.match(
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
    "16.02"
  );
  t.equal(messages.length, 1, "16.03");
  t.end();
});

tap.test(`17 - text token between tr and td`, (t) => {
  const str = `<table><tr><td>x</td></tr>\ntralala\n</table>`;
  const messages = verify(t, str, {
    rules: {
      "tag-table": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "17.01");
  t.match(
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
    "17.02"
  );
  t.equal(messages.length, 1, "17.03");
  t.end();
});

// table tag without tr
// -----------------------------------------------------------------------------

tap.test(`18 - table without tr`, (t) => {
  const str = `<table></table>`;
  const messages = verify(t, str, {
    rules: {
      "tag-table": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "18.01");
  t.match(
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
    "18.02"
  );
  t.equal(messages.length, 1, "18.03");
  t.end();
});

tap.test(`19 - table without tr`, (t) => {
  const str = `<table>\n\n\n`;
  const messages = verify(t, str, {
    rules: {
      "tag-table": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "19.01");
  t.match(
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
    "19.02"
  );
  t.equal(messages.length, 1, "19.03");
  t.end();
});

tap.test(`20 - table without td`, (t) => {
  const str = `<table><tr></tr></table>`;
  const messages = verify(t, str, {
    rules: {
      "tag-table": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "20.01");
  t.match(
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
    "20.02"
  );
  t.equal(messages.length, 1, "20.03");
  t.end();
});

tap.test(`21 - table without td`, (t) => {
  const str = `<table><tr>\n\n\n`;
  const messages = verify(t, str, {
    rules: {
      "tag-table": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "21.01");
  t.match(
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
    "21.02"
  );
  t.equal(messages.length, 1, "21.03");
  t.end();
});
