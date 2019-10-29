import test from "ava";
import is from "../dist/is-html-tag-opening.esm";

// 01. opening tag
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const s1 = `<a>`;
  t.true(is(s1));
  t.true(is(s1, 0));
});

test(`01.02 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const s2 = `<img>`;
  t.true(is(s2));
  t.true(is(s2, 0));
});

test(`01.03 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const s3 = `<img alt="">`;
  t.true(is(s3));
  t.true(is(s3, 0));
});

test(`01.04 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const s4 = `<img alt="zzz">`;
  t.true(is(s4));
  t.true(is(s4, 0));
});

test(`01.05 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const s5 = `<td nowrap>`;
  t.false(is(s5)); // <---- false because no attributes with equal-quote found
  t.false(is(s5, 0));
});

test(`01.06 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const s6 = `<td class="klm" nowrap>`;
  t.true(is(s6));
  t.true(is(s6, 0));
});

test(`01.07 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const s7 = `<td nowrap class="klm">`;
  t.true(is(s7));
});

test(`01.08 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - tag`, t => {
  const s8 = `<td nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap class="klm"`;
  t.true(is(s8));
});

// 02. closing tag
// -----------------------------------------------------------------------------

test(`02.01 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, t => {
  // closing tag
  const s1 = `</td>`;
  t.true(is(s1));
  t.true(is(s1, 0));
});

test(`02.02 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, t => {
  const s2 = `</ td>`;
  t.true(is(s2));
  t.true(is(s2, 0));
});

test(`02.03 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, t => {
  const s3 = `< / td>`;
  t.true(is(s3));
  t.true(is(s3, 0));
});

test(`02.04 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, t => {
  const s4 = `</ td >`;
  t.true(is(s4));
  t.true(is(s4, 0));
});

test(`02.05 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - closing tag`, t => {
  const s5 = `< / td >`;
  t.true(is(s5));
  t.true(is(s5, 0));
});

// 03. self-closing tag
// -----------------------------------------------------------------------------

test(`03.01 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`, t => {
  const s1 = `<br/>`;
  t.true(is(s1));
  t.true(is(s1, 0));
});

test(`03.02 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`, t => {
  const s2 = `< br/>`;
  t.true(is(s2));
  t.true(is(s2, 0));
});

test(`03.03 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`, t => {
  const s3 = `<br />`;
  t.true(is(s3));
  t.true(is(s3, 0));
});

test(`03.04 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`, t => {
  const s4 = `<br/ >`;
  t.true(is(s4));
  t.true(is(s4, 0));
});

test(`03.05 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`, t => {
  const s5 = `<br / >`;
  t.true(is(s5));
  t.true(is(s5, 0));
});

test(`03.06 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag`, t => {
  const s6 = `< br / >`;
  t.true(is(s6));
  t.true(is(s6, 0));
});

// 04. self-closing with attributes
// -----------------------------------------------------------------------------

test(`04.01 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`, t => {
  const s1 = `<br class="a"/>`;
  t.true(is(s1));
  t.true(is(s1, 0));
});

test(`04.02 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`, t => {
  const s2 = `< br class="a"/>`;
  t.true(is(s2));
  t.true(is(s2, 0));
});

test(`04.03 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`, t => {
  const s3 = `<br class="a" />`;
  t.true(is(s3));
  t.true(is(s3, 0));
});

test(`04.04 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`, t => {
  const s4 = `<br class="a"/ >`;
  t.true(is(s4));
  t.true(is(s4, 0));
});

test(`04.05 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`, t => {
  const s5 = `<br class="a" / >`;
  t.true(is(s5));
  t.true(is(s5, 0));
});

test(`04.06 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`, t => {
  const s6 = `< br class="a" / >`;
  t.true(is(s6));
  t.true(is(s6, 0));
});

test(`04.07 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`, t => {
  const s7 = `< br class = "a"  id ='z' / >`;
  t.true(is(s7));
  t.true(is(s7, 0));
});

test(`04.08 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - self-closing tag with attributes`, t => {
  const s8 = `< br class = "a'  id = "z' / >`;
  t.true(is(s8));
  t.true(is(s8, 0));
});

// 05. ad-hoc
// -----------------------------------------------------------------------------

test(`05.01 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `<a b="ccc"<d>`;
  t.true(is(s1, 0));
  t.false(is(s1, 6));
  t.true(is(s1, 10));
});

test(`05.02 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `a < b`;
  t.false(is(s1, 2));
});

test(`05.03 - ${`\u001b[${32}m${`is()`}\u001b[${39}m`} - ad-hoc`, t => {
  const s1 = `<span>a < b<span>`;
  t.true(is(s1, 0));
  t.false(is(s1, 8));
  t.true(is(s1, 11));
});
