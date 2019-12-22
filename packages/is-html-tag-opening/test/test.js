const t = require("tap");
const is = require("../dist/is-html-tag-opening.cjs");
const BACKSLASH = "\u005C";

// 01. opening tag
// -----------------------------------------------------------------------------

t.test(`01.01 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const s1 = `<a>`;
  t.ok(is(s1));
  t.ok(is(s1, 0));
  t.end();
});

t.test(`01.02 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const s2 = `<img>`;
  t.ok(is(s2));
  t.ok(is(s2, 0));
  t.end();
});

t.test(`01.03 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const s3 = `<img alt="">`;
  t.ok(is(s3));
  t.ok(is(s3, 0));
  t.end();
});

t.test(`01.04 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const s4 = `<img alt="zzz">`;
  t.ok(is(s4));
  t.ok(is(s4, 0));
  t.end();
});

t.test(`01.05 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const s5 = `<td nowrap>`;
  t.ok(is(s5)); // <---- true because tag name was recognised
  t.ok(is(s5, 0));
  t.end();
});

t.test(`01.06 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const s5 = `<zzz nowrap>`;
  t.false(is(s5)); // <---- false because tag name was not recognised and there were no attrs
  t.false(is(s5, 0));
  t.end();
});

t.test(`01.07 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const s6 = `<td class="klm" nowrap>`;
  t.ok(is(s6));
  t.ok(is(s6, 0));
  t.end();
});

t.test(`01.08 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const s7 = `<td nowrap class="klm">`;
  t.ok(is(s7));
  t.end();
});

t.test(`01.09 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const s8 = `<td nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap class="klm"`;
  t.ok(is(s8));
  t.end();
});

// 02. closing tag
// -----------------------------------------------------------------------------

t.test(`02.01 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, t => {
  // closing tag
  const s1 = `</td>`;
  t.ok(is(s1));
  t.ok(is(s1, 0));
  t.end();
});

t.test(`02.02 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, t => {
  const s2 = `</ td>`;
  t.ok(is(s2));
  t.ok(is(s2, 0));
  t.end();
});

t.test(`02.03 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, t => {
  const s3 = `< / td>`;
  t.ok(is(s3));
  t.ok(is(s3, 0));
  t.end();
});

t.test(`02.04 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, t => {
  const s4 = `</ td >`;
  t.ok(is(s4));
  t.ok(is(s4, 0));
  t.end();
});

t.test(`02.05 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, t => {
  const s5 = `< / td >`;
  t.ok(is(s5));
  t.ok(is(s5, 0));
  t.end();
});

// 03. self-closing tag
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`,
  t => {
    const s1 = `<br/>`;
    t.ok(is(s1));
    t.ok(is(s1, 0));
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`,
  t => {
    const s2 = `< br/>`;
    t.ok(is(s2));
    t.ok(is(s2, 0));
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`,
  t => {
    const s3 = `<br />`;
    t.ok(is(s3));
    t.ok(is(s3, 0));
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`,
  t => {
    const s4 = `<br/ >`;
    t.ok(is(s4));
    t.ok(is(s4, 0));
    t.end();
  }
);

t.test(
  `03.05 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`,
  t => {
    const s5 = `<br / >`;
    t.ok(is(s5));
    t.ok(is(s5, 0));
    t.end();
  }
);

t.test(
  `03.06 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`,
  t => {
    const s6 = `< br / >`;
    t.ok(is(s6));
    t.ok(is(s6, 0));
    t.end();
  }
);

// 04. self-closing with attributes
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  t => {
    const s1 = `<br class="a"/>`;
    t.ok(is(s1));
    t.ok(is(s1, 0));
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  t => {
    const s2 = `< br class="a"/>`;
    t.ok(is(s2));
    t.ok(is(s2, 0));
    t.end();
  }
);

t.test(
  `04.03 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  t => {
    const s3 = `<br class="a" />`;
    t.ok(is(s3));
    t.ok(is(s3, 0));
    t.end();
  }
);

t.test(
  `04.04 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  t => {
    const s4 = `<br class="a"/ >`;
    t.ok(is(s4));
    t.ok(is(s4, 0));
    t.end();
  }
);

t.test(
  `04.05 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  t => {
    const s5 = `<br class="a" / >`;
    t.ok(is(s5));
    t.ok(is(s5, 0));
    t.end();
  }
);

t.test(
  `04.06 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  t => {
    const s6 = `< br class="a" / >`;
    t.ok(is(s6));
    t.ok(is(s6, 0));
    t.end();
  }
);

t.test(
  `04.07 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  t => {
    const s7 = `< br class = "a"  id ='z' / >`;
    t.ok(is(s7));
    t.ok(is(s7, 0));
    t.end();
  }
);

t.test(
  `04.08 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`,
  t => {
    const s8 = `< br class = "a'  id = "z' / >`;
    t.ok(is(s8));
    t.ok(is(s8, 0));
    t.end();
  }
);

// 05. ad-hoc
// -----------------------------------------------------------------------------

t.test(`05.01 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `<a b="ccc"<d>`;
  t.ok(is(s1, 0));
  t.false(is(s1, 6));
  t.ok(is(s1, 10));
  t.end();
});

t.test(`05.02 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `a < b`;
  t.false(is(s1, 2));
  t.end();
});

t.test(`05.03 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `<span>a < b<span>`;
  t.ok(is(s1, 0));
  t.false(is(s1, 8));
  t.ok(is(s1, 11));
  t.end();
});

t.test(`05.04 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `\n<table`;
  t.ok(is(s1, 1));
  t.end();
});

t.test(`05.05 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `<br${BACKSLASH}>`;
  t.ok(is(s1, 0));
  t.end();
});

t.test(`05.06 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `< ${BACKSLASH} br ${BACKSLASH} >`;
  t.ok(is(s1, 0));
  t.end();
});

t.test(`05.07 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `<\t${BACKSLASH}///\t${BACKSLASH}${BACKSLASH}${BACKSLASH} br ${BACKSLASH} >`;
  t.ok(is(s1, 0));
  t.end();
});

t.test(`05.08 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `let's say that a < b and c > d.`;
  t.false(is(s1, 17));
  t.end();
});

t.test(`05.14 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `<zzz accept="utf-8" yyy>`;
  t.ok(is(s1, 0));
  t.end();
});

t.test(`05.15 - ${`\u001b[${36}m${`ad-hoc`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `<zzz accept-charset="utf-8" yyy>`;
  t.ok(is(s1, 0));
  t.end();
});

// 06. broken code
// -----------------------------------------------------------------------------

// rogue space cases

t.test(
  `06.01 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - spaces around`,
  t => {
    const s1 = `< p >`;
    t.ok(is(s1, 0));
    t.end();
  }
);

t.test(
  `06.02 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - spaces around`,
  t => {
    const s1 = `< / p >`;
    t.ok(is(s1, 0));
    t.end();
  }
);

t.test(
  `06.03 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - spaces around`,
  t => {
    const s1 = `< b / >`;
    t.ok(is(s1, 0));
    t.end();
  }
);

t.test(
  `06.04 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - spaces around`,
  t => {
    const s1 = `< ${BACKSLASH} b / >`;
    t.ok(is(s1, 0));
    t.end();
  }
);

t.test(
  `06.05 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - spaces around`,
  t => {
    const s1 = `</td nowrap yo yo/>`;
    t.ok(is(s1, 0));
    t.end();
  }
);

// missing bits cases

t.test(
  `06.06 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - quotes missing`,
  t => {
    const s1 = `<abc de=fg hi="jkl">`;
    t.ok(is(s1, 0));
    t.end();
  }
);
