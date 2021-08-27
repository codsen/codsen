import tap from "tap";
import { isAttrClosing as is } from "../dist/is-html-attribute-closing.esm.js";
// const BACKSLASH = "\u005C";
const doubleQuotes = `\u0022`;

// -----------------------------------------------------------------------------

const str1 = `<span width="${doubleQuotes}100">`;
tap.test(`01 - double opening, space`, (t) => {
  t.false(is(str1, 12, 13), "01");
  t.end();
});

tap.test(`02 - double opening, space`, (t) => {
  t.true(is(str1, 12, 17), "02");
  t.end();
});

// -----------------------------------------------------------------------------

const str2 = `<span width="${doubleQuotes} 100">`;
tap.test(`03 - double opening, space`, (t) => {
  t.false(is(str2, 12, 13), "03");
  t.end();
});

tap.test(`04 - double opening, space`, (t) => {
  t.true(is(str2, 12, 18), "04");
  t.end();
});

// -----------------------------------------------------------------------------

const str3 = `<span width="${doubleQuotes}100" height="200">`;
// <span width=""100" height="200">
tap.test(`05 - double opening, tight`, (t) => {
  t.false(is(str3, 12, 13), "05");
  t.end();
});

tap.test(`06 - double opening, tight`, (t) => {
  t.true(is(str3, 12, 17), "06"); // <---
  t.end();
});

tap.test(`07 - double opening, tight`, (t) => {
  t.false(is(str3, 12, 26), "07");
  t.end();
});

tap.test(`08 - double opening, tight`, (t) => {
  t.false(is(str3, 12, 30), "08");
  t.end();
});

// -----------------------------------------------------------------------------

const str4 = `<span width="${doubleQuotes} 100" height="200">`;
// <span width="" 100" height="200">
tap.test(`09 - double opening, space`, (t) => {
  t.false(is(str4, 12, 13), "09");
  t.end();
});

tap.test(`10 - double opening, space`, (t) => {
  t.true(is(str4, 12, 18), "10"); // <---
  t.end();
});

tap.test(`11 - double opening, space`, (t) => {
  t.false(is(str4, 12, 27), "11");
  t.end();
});

tap.test(`12 - double opening, space`, (t) => {
  t.false(is(str4, 12, 31), "12");
  t.end();
});

// -----------------------------------------------------------------------------

const str5 = `<span width="${doubleQuotes} 100" height='200'>`;
// <span width="" 100" height="200">
tap.test(`13 - double opening, space, single quotes attr`, (t) => {
  t.false(is(str5, 12, 13), "13");
  t.end();
});

tap.test(`14 - double opening, space, single quotes attr`, (t) => {
  t.true(is(str5, 12, 18), "14"); // <---
  t.end();
});

tap.test(`15 - double opening, space, single quotes attr`, (t) => {
  t.false(is(str5, 12, 27), "15");
  t.end();
});

tap.test(`16 - double opening, space, single quotes attr`, (t) => {
  t.false(is(str5, 12, 31), "16");
  t.end();
});
