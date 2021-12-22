import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isAttrClosing as isCl } from "../dist/is-html-attribute-closing.esm.js";
// const BACKSLASH = "\u005C";
const doubleQuotes = `\u0022`;

// -----------------------------------------------------------------------------

const str1 = `<span width="${doubleQuotes}100">`;
test(`01 - double opening, space`, () => {
  not.ok(isCl(str1, 12, 13), "01");
});

test(`02 - double opening, space`, () => {
  ok(isCl(str1, 12, 17), "02");
});

// -----------------------------------------------------------------------------

const str2 = `<span width="${doubleQuotes} 100">`;
test(`03 - double opening, space`, () => {
  not.ok(isCl(str2, 12, 13), "03");
});

test(`04 - double opening, space`, () => {
  ok(isCl(str2, 12, 18), "04");
});

// -----------------------------------------------------------------------------

const str3 = `<span width="${doubleQuotes}100" height="200">`;
// <span width=""100" height="200">
test(`05 - double opening, tight`, () => {
  not.ok(isCl(str3, 12, 13), "05");
});

test(`06 - double opening, tight`, () => {
  ok(isCl(str3, 12, 17), "06"); // <---
});

test(`07 - double opening, tight`, () => {
  not.ok(isCl(str3, 12, 26), "07");
});

test(`08 - double opening, tight`, () => {
  not.ok(isCl(str3, 12, 30), "08");
});

// -----------------------------------------------------------------------------

const str4 = `<span width="${doubleQuotes} 100" height="200">`;
// <span width="" 100" height="200">
test(`09 - double opening, space`, () => {
  not.ok(isCl(str4, 12, 13), "09");
});

test(`10 - double opening, space`, () => {
  ok(isCl(str4, 12, 18), "10"); // <---
});

test(`11 - double opening, space`, () => {
  not.ok(isCl(str4, 12, 27), "11");
});

test(`12 - double opening, space`, () => {
  not.ok(isCl(str4, 12, 31), "12");
});

// -----------------------------------------------------------------------------

const str5 = `<span width="${doubleQuotes} 100" height='200'>`;
// <span width="" 100" height="200">
test(`13 - double opening, space, single quotes attr`, () => {
  not.ok(isCl(str5, 12, 13), "13");
});

test(`14 - double opening, space, single quotes attr`, () => {
  ok(isCl(str5, 12, 18), "14"); // <---
});

test(`15 - double opening, space, single quotes attr`, () => {
  not.ok(isCl(str5, 12, 27), "15");
});

test(`16 - double opening, space, single quotes attr`, () => {
  not.ok(isCl(str5, 12, 31), "16");
});

test.run();
