import { c } from "../test-util/util";
import test from "ava";
// avanotonly

//                                 CDATA TESTS

// 01. wrong letter case
// -----------------------------------------------------------------------------

test(`01.01 - wrong letter case - c`, t =>
  c(
    `<![cDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

test(`01.02 - wrong letter case - d`, t =>
  c(
    `<![CdATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

test(`01.03 - wrong letter case - a`, t =>
  c(
    `<![CDaTA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

test(`01.04 - wrong letter case - t`, t =>
  c(
    `<![CDAtA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

test(`01.05 - wrong letter case - second a`, t =>
  c(
    `<![CDATa[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

test(`01.06 - wrong letter case - two`, t =>
  c(
    `<![CdaTa[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

test(`01.07 - wrong letter case - two`, t =>
  c(
    `<![cDATa[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

test(`01.08 - wrong letter case - all`, t =>
  c(
    `<![cdata[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

// this checks, do CDATA escapes (doNothingUntil) enable and disable themselves
// at exactly right places.
test(`01.09 - wrong letter case - pound`, t =>
  c(
    `£<![CDATA[£]]>£`,
    `&pound;<![CDATA[£]]>&pound;`,
    "bad-character-unencoded-pound",
    t
  ));

// 02. whitespace
// -----------------------------------------------------------------------------

test(`02.01 - whitespace - single, left of excl`, t =>
  c(
    `< ![CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

test(`02.02 - whitespace - excessive, left of excl`, t =>
  c(
    `<    \n ![CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

test(`02.03 - whitespace - single, left of opening bracket`, t =>
  c(
    `<! [CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

test(`02.04 - whitespace - excessive, left of opening bracket`, t =>
  c(
    `<!   \n    [CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

test(`02.05 - whitespace - single, left of C`, t =>
  c(
    `<![ CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

test(`02.06 - whitespace - excessive, left of C`, t =>
  c(
    `<![    \n CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

// 03. missing characters
// -----------------------------------------------------------------------------

test(`03.01 - missing - first opening bracket`, t =>
  c(
    `<!CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

test(`03.02 - missing - second opening bracket, tight`, t =>
  c(
    `<![CDATAsome stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

test(`03.03 - missing - second opening bracket, spaced`, t =>
  c(
    `<![CDATA some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

test(`03.04 - missing - second opening bracket, loose`, t =>
  c(
    `<![CDATA   some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

test(`03.05 - missing - opening bracket and excl mark`, t =>
  c(
    `<CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

test(`03.06 - missing - seriously messed up tag`, t =>
  c(
    `<! C D A t A some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

test(`03.07 - missing - only excl mark`, t =>
  c(
    `<[CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

test(`03.08 - excl mark missing, line break instead`, t =>
  c(
    `<\n[CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

test(`03.09 - missing opening bracket`, t =>
  c(
    `<a>![CDATA[some stuff]]>`,
    `<a><![CDATA[some stuff]]>`,
    "bad-cdata-tag-malformed",
    t
  ));

// 04. repeated
// -----------------------------------------------------------------------------

test(`04.01 - repeated - opening bracket, single`, t =>
  c(
    `<<![CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

test(`04.02 - repeated - opening bracket, multiple`, t =>
  c(
    `<<<<![CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

test(`04.03 - repeated - opening bracket, multiple spaced`, t =>
  c(
    `< << <<< <     <<<< <![CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

test(`04.04 - repeated - excl mark, single`, t =>
  c(
    `<!![CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

test(`04.05 - repeated - excl mark, multiple`, t =>
  c(
    `<!!!!![CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

test(`04.06 - repeated - excl mark, spaced`, t =>
  c(
    `<!    !!!  !  ! ! !!![CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

test(`04.07 - repeated - excl mark, spaced #2`, t =>
  c(
    `<   !    !!!  !  ! ! !!!    [CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed", "html-comment-spaces"],
    t
  ));

test(`04.08 - repeated - opening bracket, single`, t =>
  c(
    `<![[CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

test(`04.09 - repeated - opening bracket, multiple`, t =>
  c(
    `<![[[[[[[CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

test(`04.10 - repeated - opening bracket, multiple, spaced`, t =>
  c(
    `<!  [[[ [ [ [[    CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

test(`04.11 - repeated - all, tight`, t =>
  c(
    `<<<<<<<!!!!!![[[[[[[CDATA[[[[[[[[[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

test(`04.12 - repeated - go crazy - left side only`, t =>
  c(
    `<  << <  << <!! !! ! ! [[[ [ [[]  [ CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

test(`04.13 - repeated - go crazy`, t =>
  c(
    `<![CDATA[some stuff]][]]]] ]  >`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

test(`04.14 - repeated - go crazy`, t =>
  c(
    `<  << <  << <!! !! ! ! [[[ [ [[]  [ C    d  A TA    [ [   [ [ [[[  [ [some stuff]][]]]] ]  >`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

// 05. rogue characters
// -----------------------------------------------------------------------------

test(`05.01 - rogue characters #1`, t =>
  c(
    `<x![CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

test(`05.02 - rogue characters #2`, t =>
  c(
    `<!x[CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

test(`05.03 - rogue characters #3`, t =>
  c(
    `<![xCDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

test(`05.04 - rogue characters #4`, t =>
  c(
    `<![CDATA[some stuff]x]>`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

test(`05.05 - rogue characters #5`, t =>
  c(
    `<![CDATA[some stuff]]x>`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

// 06. single character replaced with rogue
// -----------------------------------------------------------------------------

test(`06.01 - rogue characters instead #1`, t =>
  c(
    `<.[CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

test(`06.02 - rogue characters instead #2`, t =>
  c(
    `<!.CDATA[some stuff]]>`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

test(`06.03 - rogue characters instead #3`, t =>
  c(
    `<![CDATA[some stuff].>`,
    `<![CDATA[some stuff]]>`,
    ["bad-cdata-tag-malformed"],
    t
  ));

// 07. escaped legit CDATA
// -----------------------------------------------------------------------------

test(`07.01 - escaped legit CDATA, simple`, t =>
  c(`&lt;![CDATA[some stuff]]&gt;`, t));

test(`07.02 - escaped legit CDATA, surrounded`, t =>
  c(`<a>&lt;![CDATA[some stuff]]&gt;<b c="d"/>`, t));

test(`07.03 - CDATA does not affect surrounding areas`, t =>
  c(
    `£&lt;![CDATA[some stuff]]&gt;£`,
    `&pound;&lt;![CDATA[some stuff]]&gt;&pound;`,
    ["bad-character-unencoded-pound"],
    t
  ));

// TODO:

// test(`00.00 - adds missing semicolons on html entities`, t =>
//   c(`&pound`, `&pound;`, ["bad-character-unencoded-ampersand"], t));

// test(`??.?? - escaped CDATA + incomplete entity`, t =>
//   c(
//     `&pound&lt;![CDATA[some stuff]]&gt;&pound;`,
//     `&pound;&lt;![CDATA[some stuff]]&gt;&pound;`,
//     ["bad-character-unencoded-ampersand"],
//     t
//   ));
