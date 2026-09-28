// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { crush } from "../dist/html-crush.esm.js";
import { m } from "./util/util.js";

// opts.breakToTheLeftOf
// -----------------------------------------------------------------------------

test(`01 - opts.breakToTheLeftOf - breaks based on breakpoints (no whitespace involved)`, () => {
  equal(
    m(equal, "<m><n><o>", {
      removeLineBreaks: false,
    }).result,
    "<m><n><o>",
    "01.01",
  );
  equal(
    m(equal, "<m><n><o>", {
      removeLineBreaks: true,
    }).result,
    "<m><n><o>",
    "01.02",
  );
  equal(
    m(equal, "<m><n><o>", {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<n"],
    }).result,
    "<m>\n<n><o>",
    "01.03",
  );
  equal(
    m(equal, "<m><n><o>", {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<n", "<o"],
    }).result,
    "<m>\n<n>\n<o>",
    "01.04",
  );
  equal(
    m(equal, "<m><n><o>", {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<z", "<n", "<o"],
    }).result,
    "<m>\n<n>\n<o>",
    "01.05",
  );
  equal(
    m(equal, "\n   \t   \t   <m><n><o>", {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<m", "<n", "<o"],
    }).result,
    "<m>\n<n>\n<o>",
    "01.06",
  );
  equal(
    m(equal, "<m><n><o>", {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<x", "<y", "<z"],
    }).result,
    "<m><n><o>",
    "01.07",
  );
  equal(
    m(equal, "<m><n><o>", {
      removeLineBreaks: true,
      breakToTheLeftOf: [],
    }).result,
    "<m><n><o>",
    "01.08",
  );
  equal(
    m(equal, "\n<m>\n  <n>\n  <o>", {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<x", "<y", "<z"],
    }).result,
    "<m><n><o>",
    "01.09",
  );
  equal(
    m(equal, "   \t\n  <m>   <n> \n\t     <o>", {
      removeLineBreaks: true,
      breakToTheLeftOf: [],
    }).result,
    "<m><n><o>",
    "01.10",
  );
});

test(`02 - opts.breakToTheLeftOf - breaks based on breakpoints (whitespace involved)`, () => {
  equal(
    m(equal, "<a>\n<b><c>", {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<b"],
    }).result,
    "<a>\n<b><c>",
    "02.01",
  );
  equal(
    m(equal, "<a> <b><c>", {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<b"],
    }).result,
    "<a>\n<b><c>",
    "02.02",
  );
  equal(
    m(equal, "<a>  <b><c>", {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<b"],
    }).result,
    "<a>\n<b><c>",
    "02.03",
  );
  equal(
    m(equal, "<a> \n   \t\t\t   \n <b><c>", {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<b"],
    }).result,
    "<a>\n<b><c>",
    "02.04",
  );
  equal(
    m(equal, "<a>\n<b><c>", {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<b", "<c"],
    }).result,
    "<a>\n<b>\n<c>",
    "02.05",
  );
  equal(
    m(equal, "<a> <b><c>", {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<b", "<c"],
    }).result,
    "<a>\n<b>\n<c>",
    "02.06",
  );
  equal(
    m(equal, "<a>  <b><c>", {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<b", "<c"],
    }).result,
    "<a>\n<b>\n<c>",
    "02.07",
  );
  equal(
    m(equal, "<a> \n   \t\t\t   \n <b><c>", {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<b", "<c"],
    }).result,
    "<a>\n<b>\n<c>",
    "02.08",
  );
  equal(
    m(equal, "<a>\n<b><c>", {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<x", "y"],
    }).result,
    "<a> <b><c>",
    "02.09",
  );
  equal(
    m(equal, "<m>\n<n><o>", {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<x", "y"],
    }).result,
    "<m><n><o>",
    "02.10",
  );
});

// degenerate opts.breakToTheLeftOf lists - these bypass the grouped lookup and
// fall back to matchRightIncl()
// -----------------------------------------------------------------------------

test(`03 - opts.breakToTheLeftOf - degenerate lists`, () => {
  // an empty entry alongside a real one is simply never matched
  equal(
    m(equal, "<a>\n<b>", {
      removeLineBreaks: true,
      breakToTheLeftOf: ["", "<b"],
    }).result,
    "<a>\n<b>",
    "03.01",
  );
  // a lone empty entry leaves nothing to break on
  equal(
    m(equal, "<a>\n<b>", {
      removeLineBreaks: true,
      breakToTheLeftOf: [""],
    }).result,
    "<a> <b>",
    "03.02",
  );
  // a lone whitespace-only entry reaches matchRightIncl(), which reads it as
  // "match by callback alone" and objects that no callback was given
  throws(
    () => {
      crush("<a>\n<b>", {
        removeLineBreaks: true,
        breakToTheLeftOf: [" "],
      });
    },
    /THROW_ID_06/,
    "03.03",
  );
});

// tag names, the doctype and CSS at-rules are all ASCII case-insensitive
// -----------------------------------------------------------------------------

test(`04 - opts.breakToTheLeftOf - default breakpoints match in any ASCII case`, () => {
  equal(
    m(equal, "<TD>a</TD> <TD>b</TD>", {
      removeLineBreaks: true,
    }).result,
    "<TD>a\n</TD><TD>b\n</TD>",
    "04.01",
  );
  equal(
    m(equal, "<!DOCTYPE html><HTML><HEAD></HEAD></HTML>", {
      removeLineBreaks: true,
    }).result,
    "<!DOCTYPE html>\n<HTML>\n<HEAD>\n</HEAD>\n</HTML>",
    "04.02",
  );
  equal(
    m(equal, "<!doctype html><html><head></head></html>", {
      removeLineBreaks: true,
    }).result,
    "<!doctype html>\n<html>\n<head>\n</head>\n</html>",
    "04.03",
  );
  equal(
    m(equal, "<STYLE>@MEDIA x{.a{b:c}}</STYLE>", {
      removeLineBreaks: true,
    }).result,
    "<STYLE>\n@MEDIA x{.a{b:c} }\n</STYLE>",
    "04.04",
  );
});

test(`05 - opts.breakToTheLeftOf - configured breakpoints match in any ASCII case`, () => {
  equal(
    m(equal, "<td>a</td> <td>b</td>", {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<TD"],
    }).result,
    "<td>a</td>\n<td>b</td>",
    "05.01",
  );
  equal(
    m(equal, "<TD>a</TD> <Td>b</Td>", {
      removeLineBreaks: true,
      breakToTheLeftOf: ["<td"],
    }).result,
    "<TD>a</TD>\n<Td>b</Td>",
    "05.02",
  );
});

test(`06 - opts.breakToTheLeftOf - no break inside a revealed conditional tail`, () => {
  equal(
    m(equal, "a <!--<![endif]--> b", {
      removeLineBreaks: true,
    }).result,
    "a\n<!--<![endif]--> b",
    "06.01",
  );
  equal(
    m(equal, "a <!--<![ENDIF]--> b", {
      removeLineBreaks: true,
    }).result,
    "a\n<!--<![ENDIF]--> b",
    "06.02",
  );
});

test.run();
