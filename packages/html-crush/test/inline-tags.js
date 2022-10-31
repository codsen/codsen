import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { m } from "./util/util.js";

// HTML Inline tags
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - style on sup #1`, () => {
  equal(
    m(equal, `<sup style="">word, here`, {
      removeLineBreaks: true,
    }).result,
    `<sup style="">word, here`,
    "01.01"
  );
});

test(`02 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - style on sup #2`, () => {
  equal(
    m(equal, `<sup style=" ">word, here`, {
      removeLineBreaks: true,
    }).result,
    `<sup style="">word, here`,
    "02.01"
  );
});

test(`03 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - two spans with space - space retained`, () => {
  equal(
    m(equal, `<span>a</span> <span>b</span>`, {
      removeLineBreaks: true,
    }).result,
    `<span>a</span> <span>b</span>`,
    "03.01"
  );
});

test(`04 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - two spans without space - fine`, () => {
  equal(
    m(equal, `<span>a</span><span>b</span>`, {
      removeLineBreaks: true,
    }).result,
    `<span>a</span><span>b</span>`,
    "04.01"
  );
});

test(`05 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - inside tag`, () => {
  equal(
    m(equal, `</b >`, {
      removeLineBreaks: true,
    }).result,
    `</b>`,
    "05.01"
  );
});

test(`06 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - nameless attr`, () => {
  equal(
    m(equal, `x<a b="c" >y`, {
      removeLineBreaks: true,
    }).result,
    `x<a b="c">y`,
    "06.01"
  );
  equal(
    m(equal, `x<a b="c" />y`, {
      removeLineBreaks: true,
    }).result,
    `x<a b="c"/>y`,
    "06.02"
  );
});

test(`07 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - style attr`, () => {
  equal(
    m(equal, `x<span style="a: b;" >y`, {
      removeLineBreaks: true,
    }).result,
    `x<span style="a:b;">y`,
    "07.01"
  );
  equal(
    m(equal, `x<span style="a: b;" >y`, {
      removeLineBreaks: true,
      lineLengthLimit: 0,
    }).result,
    `x<span style="a:b;">y`,
    "07.02"
  );
});

test(`08 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - two spans`, () => {
  equal(
    m(
      equal,
      `<span style="abc: def;" >a</span> <span style="abc: def;" >b</span>`,
      {
        removeLineBreaks: true,
      }
    ).result,
    `<span style="abc:def;">a</span> <span style="abc:def;">b</span>`,
    "08.01"
  );
  equal(
    m(
      equal,
      `<span style="abc: def;" />a</span> <span style="abc: def;" />b</span>`,
      {
        removeLineBreaks: true,
      }
    ).result,
    `<span style="abc:def;"/>a</span> <span style="abc:def;"/>b</span>`,
    "08.02"
  );
  equal(
    m(
      equal,
      `<span style="abc: def;" />a</span> <span style="abc: def;" />b</span>`,
      {
        removeLineBreaks: true,
        lineLengthLimit: 0,
      }
    ).result,
    `<span style="abc:def;"/>a</span> <span style="abc:def;"/>b</span>`,
    "08.03"
  );
});

test(`09 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - span + sup`, () => {
  equal(
    m(equal, `<span style="abc: def;">a</span> <sup>1</sup>`, {
      removeLineBreaks: true,
    }).result,
    `<span style="abc:def;">a</span> <sup>1</sup>`,
    "09.01"
  );
  equal(
    m(equal, `<span style="abc: def;">a</span> <sup>1</sup>`, {
      removeLineBreaks: true,
      lineLengthLimit: 0,
    }).result,
    `<span style="abc:def;">a</span> <sup>1</sup>`,
    "09.02"
  );
});

test(`10 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - won't line break between two inline tags`, () => {
  for (let i = 1; i < 37; i++) {
    equal(
      m(equal, `<span>a</span><span style="z">b</span>`, {
        lineLengthLimit: i,
        removeLineBreaks: true,
      }).result,
      `<span>a</span><span\nstyle="z">b</span>`,
      `09.11.0${i} - limit = ${i}`
    );
  }
});

test(`11 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - 012 pt.2`, () => {
  equal(
    m(equal, `<i><span>a</span><span style="z">b</span></i>`, {
      lineLengthLimit: 22,
      removeLineBreaks: true,
    }).result,
    `<i><span>a</span><span\nstyle="z">b</span></i>`,
    "11.01"
  );
});

test(`12 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - will line break between mixed #1`, () => {
  equal(
    m(equal, `<i>a</i><span>b</span>`, {
      lineLengthLimit: 9, // <--- asking to break after /i
      removeLineBreaks: true,
    }).result,
    `<i>a</i><span>b</span>`,
    "12.01"
  );
  equal(
    m(equal, `<i>a</i><y>b</y>`, {
      lineLengthLimit: 9, // <--- asking to break after /i
      removeLineBreaks: true,
    }).result,
    `<i>a</i>\n<y>b</y>`,
    "12.02"
  );
});

test(`13 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - will line break between mixed, #2`, () => {
  equal(
    m(equal, `<span>a</span><div>b</div>`, {
      lineLengthLimit: 15, // <--- asking to break after div
      removeLineBreaks: true,
    }).result,
    `<span>a</span>\n<div>b</div>`,
    "13.01"
  );
});

test(`14 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - will line break between mixed, space, #1`, () => {
  equal(
    m(equal, `<span>a</span> <div>b</div>`, {
      lineLengthLimit: 15,
      removeLineBreaks: true,
    }).result,
    `<span>a</span>\n<div>b</div>`,
    "14.01"
  );
  equal(
    m(equal, `<span>a</span> <div>b</div>`, {
      lineLengthLimit: 0,
      removeLineBreaks: true,
    }).result,
    `<span>a</span><div>b</div>`,
    "14.02"
  );
});

test(`15 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - will line break between mixed, space, #2`, () => {
  equal(
    m(equal, `<div>a</div> <span>b</span>`, {
      lineLengthLimit: 12,
      removeLineBreaks: true,
    }).result,
    `<div>a</div>\n<span>b</span>`,
    "15.01"
  );
  equal(
    m(equal, `<div>a</div> <span>b</span>`, {
      lineLengthLimit: 13,
      removeLineBreaks: true,
    }).result,
    `<div>a</div>\n<span>b</span>`,
    "15.02"
  );
  equal(
    m(equal, `<div>a</div> <span>b</span>`, {
      lineLengthLimit: 14,
      removeLineBreaks: true,
    }).result,
    `<div>a</div>\n<span>b</span>`,
    "15.03"
  );
  equal(
    m(equal, `<div>a</div> <span>b</span>`, {
      lineLengthLimit: 15,
      removeLineBreaks: true,
    }).result,
    `<div>a</div>\n<span>b</span>`,
    "15.04"
  );
  equal(
    m(equal, `123456789012 <span>b</span>`, {
      lineLengthLimit: 15,
      removeLineBreaks: true,
    }).result,
    `123456789012\n<span>b</span>`,
    "15.05"
  );
});

test(`16 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - space between inline tags`, () => {
  equal(
    m(equal, `<b>x</b> <i>y</i>`, {
      lineLengthLimit: 6,
      removeLineBreaks: true,
    }).result,
    `<b>x</b>\n<i>y</i>`,
    "16.01"
  );
  equal(
    m(equal, `<b>x</b> <i>y</i>`, {
      lineLengthLimit: 7,
      removeLineBreaks: true,
    }).result,
    `<b>x</b>\n<i>y</i>`,
    "16.02"
  );
  equal(
    m(equal, `<b>x</b> <i>y</i>`, {
      lineLengthLimit: 8,
      removeLineBreaks: true,
    }).result,
    `<b>x</b>\n<i>y</i>`,
    "16.03"
  );
  equal(
    m(equal, `<b>x</b> <i>y</i>`, {
      lineLengthLimit: 9,
      removeLineBreaks: true,
    }).result,
    `<b>x</b>\n<i>y</i>`,
    "16.04"
  );
  equal(
    m(equal, `<b>x</b> <i>y</i>`, {
      lineLengthLimit: 10,
      removeLineBreaks: true,
    }).result,
    `<b>x</b>\n<i>y</i>`,
    "16.05"
  );
  equal(
    m(equal, `<b>x</b> <i>y</i>`, {
      lineLengthLimit: 11,
      removeLineBreaks: true,
    }).result,
    `<b>x</b>\n<i>y</i>`,
    "16.06"
  );
  equal(
    m(equal, `<b>x</b> <i>y</i>`, {
      lineLengthLimit: 12,
      removeLineBreaks: true,
    }).result,
    `<b>x</b>\n<i>y</i>`,
    "16.07"
  );
});

test(`17 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - excessive whitespace between inline tags #1`, () => {
  equal(
    m(equal, `<i>a</i>     <sup>b</sup>`, {
      removeLineBreaks: true,
    }).result,
    `<i>a</i> <sup>b</sup>`,
    "17.01"
  );
  equal(
    m(equal, `<i>a</i>     <sup>b</sup>`, {
      lineLengthLimit: 6,
      removeLineBreaks: true,
    }).result,
    `<i>a</i>\n<sup>b</sup>`,
    "17.02"
  );
  equal(
    m(equal, `<i>a</i>     <sup>b</sup>`, {
      lineLengthLimit: 7,
      removeLineBreaks: true,
    }).result,
    `<i>a</i>\n<sup>b</sup>`,
    "17.03"
  );
  equal(
    m(equal, `<i>a</i>     <sup>b</sup>`, {
      lineLengthLimit: 8,
      removeLineBreaks: true,
    }).result,
    `<i>a</i>\n<sup>b</sup>`,
    "17.04"
  );
  equal(
    m(equal, `<i>a</i>     <sup>b</sup>`, {
      lineLengthLimit: 9,
      removeLineBreaks: true,
    }).result,
    `<i>a</i>\n<sup>b</sup>`,
    "17.05"
  );
  equal(
    m(equal, `<i>a</i>     <sup>b</sup>`, {
      lineLengthLimit: 10,
      removeLineBreaks: true,
    }).result,
    `<i>a</i>\n<sup>b</sup>`,
    "17.06"
  );
  equal(
    m(equal, `<i>a</i>     <sup>b</sup>`, {
      lineLengthLimit: 12,
      removeLineBreaks: true,
    }).result,
    `<i>a</i>\n<sup>b</sup>`,
    "17.07"
  );
  equal(
    m(equal, `<i>a</i>     <sup>b</sup>`, {
      lineLengthLimit: 13,
      removeLineBreaks: true,
    }).result,
    `<i>a</i>\n<sup>b</sup>`,
    "17.08"
  );
  equal(
    m(equal, `<i>a</i>     <sup>b</sup>`, {
      lineLengthLimit: 14,
      removeLineBreaks: true,
    }).result,
    `<i>a</i>\n<sup>b</sup>`,
    "17.09"
  );
  equal(
    m(equal, `<i>a</i>     <sup>b</sup>`, {
      lineLengthLimit: 15,
      removeLineBreaks: true,
    }).result,
    `<i>a</i>\n<sup>b</sup>`,
    "17.10"
  );
});

test(`18 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - div and sup`, () => {
  equal(
    m(equal, `<div>a</div>     <sup>b</sup>`, {
      removeLineBreaks: true,
    }).result,
    `<div>a</div> <sup>b</sup>`,
    "18.01"
  );
  equal(
    m(equal, `<div>a</div><sup>b</sup>`, {
      removeLineBreaks: true,
    }).result,
    `<div>a</div><sup>b</sup>`,
    "18.02"
  );
});

test(`19 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - div and sup, escessive whitespace`, () => {
  equal(
    m(equal, `<div>a</div>     <sup>b</sup>`, {
      lineLengthLimit: 10,
      removeLineBreaks: true,
    }).result,
    `<div>a</div>\n<sup>b</sup>`,
    "19.01"
  );
});

test(`20 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - div and sup, escessive whitespace`, () => {
  for (let i = 10; i < 25; i++) {
    equal(
      m(equal, `<div>a</div>     <sup>b</sup>`, {
        lineLengthLimit: i,
        removeLineBreaks: true,
      }).result,
      `<div>a</div>\n<sup>b</sup>`,
      `09.21.01 - limit = ${i}`
    );
  }
  equal(
    m(equal, `<div>a</div>     <sup>b</sup>`, {
      lineLengthLimit: 99,
      removeLineBreaks: true,
    }).result,
    `<div>a</div> <sup>b</sup>`,
    "20.01"
  );
  equal(
    m(equal, `<div>a</div>     <sup>b</sup>`, {
      lineLengthLimit: 0,
      removeLineBreaks: true,
    }).result,
    `<div>a</div> <sup>b</sup>`,
    "20.02"
  );
});

test(`21 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - multiple wrapped inline tags`, () => {
  let source = `<span><a href="z"><b>a</b><i>b</i><a><span>`;
  let res = `<span><a\nhref="z"><b>a</b><i>b</i><a><span>`;
  equal(
    m(equal, source, {
      removeLineBreaks: false,
    }).result,
    source,
    "21.01"
  );
  equal(
    m(equal, source, {
      removeLineBreaks: true,
    }).result,
    source,
    "21.02"
  );
  for (let i = 1; i < 42; i++) {
    equal(
      m(equal, source, {
        lineLengthLimit: i,
        removeLineBreaks: true,
      }).result,
      res,
      `09.22.03* - lineLengthLimit: i = ${i}`
    );
  }
});

test(`22 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - first tag name letters resemble legit inline tags`, () => {
  equal(
    m(equal, `<az>123</az> <by>456</by> <see>789</see> <in></in>`, {
      removeLineBreaks: true,
    }).result,
    `<az>123</az><by>456</by><see>789</see><in></in>`,
    "22.01"
  );
  equal(
    m(equal, `<az>123</az> <by>456</by> <see>789</see> <in></in>`, {
      removeLineBreaks: true,
      lineLengthLimit: 0,
    }).result,
    `<az>123</az><by>456</by><see>789</see><in></in>`,
    "22.02"
  );
});

test(`23 - ${`\u001b[${32}m${`inline tags`}\u001b[${39}m`} - spanner is not span`, () => {
  equal(
    m(equal, `<span>1</span> <span>2</span> <span>3</span>`, {
      removeLineBreaks: true,
    }).result,
    `<span>1</span> <span>2</span> <span>3</span>`,
    "23.01"
  );
  equal(
    m(equal, `<spanner>1</spanner> <spanner>2</spanner> <spanner>3</spanner>`, {
      removeLineBreaks: true,
    }).result,
    `<spanner>1</spanner><spanner>2</spanner><spanner>3</spanner>`,
    "23.02"
  );
  equal(
    m(equal, `<spa n="m">1</spa> <spa n="m">2</spa> <spa n="m">3</spa>`, {
      removeLineBreaks: true,
    }).result,
    `<spa n="m">1</spa><spa n="m">2</spa><spa n="m">3</spa>`,
    "23.03 - insurance against whitespace-hungry matching components"
  );
});

test.run();
