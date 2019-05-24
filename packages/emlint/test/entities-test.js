// avanotonly

import { c, c2 } from "../test-util/util";
import test from "ava";

const RAWAMP = `&`;
const RAWNBSP = `\xA0`;
// const RAWSUP = `\u2283`;
// const RAWZWNJ = `\u200C`;

//                                 HTML ENTITY TESTS

// 00. raw
// -----------------------------------------------------------------------------

// single raw, recognised

test(`00.01 - ${`\u001b[${33}m${`raw`}\u001b[${39}m`} - minimal isolated, raw amp`, t =>
  c(RAWAMP, `&amp;`, ["bad-character-unencoded-ampersand"], t));

test(`00.02 - ${`\u001b[${33}m${`raw`}\u001b[${39}m`} - minimal isolated, raw amp`, t =>
  c(RAWNBSP, `&nbsp;`, ["bad-character-unencoded-non-breaking-space"], t));

// single raw, unrecognised

// TODO - implement all character encoding
// test(`00.03 - ${`\u001b[${33}m${`raw`}\u001b[${39}m`} - minimal isolated, raw amp`, t =>
//   c(RAWSUP, `&sup;`, ["z"], t));

// TODO - implement all character encoding
// test(`00.04 - ${`\u001b[${33}m${`raw`}\u001b[${39}m`} - minimal isolated, raw amp`, t =>
//   c(RAWZWNJ, `&zwnj;`, ["z"], t));

// three repeated raw

test(`00.05 - ${`\u001b[${33}m${`raw`}\u001b[${39}m`} - three, raw amp`, t =>
  c(
    `${RAWAMP}${RAWAMP}${RAWAMP}`,
    `&amp;&amp;&amp;`,
    ["bad-character-unencoded-ampersand"],
    t
  ));

test(`00.06 - ${`\u001b[${33}m${`raw`}\u001b[${39}m`} - minimal isolated, raw amp`, t =>
  c(
    `${RAWNBSP}${RAWNBSP}${RAWNBSP}`,
    `&nbsp;&nbsp;&nbsp;`,
    ["bad-character-unencoded-non-breaking-space"],
    t
  ));

// TODO - implement all character encoding
// test(`00.07 - ${`\u001b[${33}m${`raw`}\u001b[${39}m`} - minimal isolated, raw amp`, t =>
//   c(`${RAWSUP}${RAWSUP}${RAWSUP}`, `&sup;&sup;&sup;`, ["z"], t));

// TODO - implement all character encoding
// test(`00.08 - ${`\u001b[${33}m${`raw`}\u001b[${39}m`} - minimal isolated, raw amp`, t =>
//   c(`${RAWZWNJ}${RAWZWNJ}${RAWZWNJ}`, `&zwnj;&zwnj;&zwnj;`, ["z"], t));

// 01. ALL OK
// -----------------------------------------------------------------------------

// isolated

test(`01.01 - ${`\u001b[${31}m${`all OK`}\u001b[${39}m`} - minimal isolated, named amp`, t =>
  c(`&amp;`, t));

test(`01.02 - ${`\u001b[${31}m${`all OK`}\u001b[${39}m`} - minimal isolated, named nbsp`, t =>
  c(`&nbsp;`, t));

test(`01.03 - ${`\u001b[${31}m${`all OK`}\u001b[${39}m`} - minimal isolated, named sup`, t =>
  c(`&sup;`, t));

test(`01.04 - ${`\u001b[${31}m${`all OK`}\u001b[${39}m`} - minimal isolated, named zwnj`, t =>
  c(`&zwnj;`, t));

// sandwiched

test(`01.05 - ${`\u001b[${31}m${`all OK`}\u001b[${39}m`} - minimal sandwiched, named amp`, t =>
  c(`a&amp;b`, t));

test(`01.06 - ${`\u001b[${31}m${`all OK`}\u001b[${39}m`} - minimal sandwiched, named nbsp`, t =>
  c(`a&nbsp;b`, t));

test(`01.07 - ${`\u001b[${31}m${`all OK`}\u001b[${39}m`} - minimal sandwiched, named sup`, t =>
  c(`a&sup;b`, t));

test(`01.08 - ${`\u001b[${31}m${`all OK`}\u001b[${39}m`} - minimal sandwiched, named zwnj`, t =>
  c(`a&zwnj;b`, t));

// 02. ampersand missing
// -----------------------------------------------------------------------------

// isolated

test(`02.01 - ${`\u001b[${32}m${`missing amp`}\u001b[${39}m`} - minimal isolated, named, amp`, t =>
  c(`amp;`, `&amp;`, "bad-named-html-entity-malformed-amp", t));

test(`02.02 - ${`\u001b[${32}m${`missing amp`}\u001b[${39}m`} - minimal not isolated, named, amp`, t =>
  c(`abc amp; def`, `abc &amp; def`, "bad-named-html-entity-malformed-amp", t));

test(`02.03 - ${`\u001b[${32}m${`missing amp`}\u001b[${39}m`} - minimal isolated, named, nbsp`, t =>
  c(`nbsp;`, `&nbsp;`, "bad-named-html-entity-malformed-nbsp", t));

test(`02.04 - ${`\u001b[${32}m${`missing amp`}\u001b[${39}m`} - minimal isolated, named, sup`, t =>
  c(`sup;`, `&sup;`, "bad-named-html-entity-malformed-sup", t));

test(`02.05 - ${`\u001b[${32}m${`missing amp`}\u001b[${39}m`} - minimal isolated, named, zwnj`, t =>
  c(`zwnj;`, `&zwnj;`, "bad-named-html-entity-malformed-zwnj", t));

// sandwiched

test(`02.06 - ${`\u001b[${32}m${`missing amp`}\u001b[${39}m`} - minimal sandwiched, named, amp`, t =>
  c2(
    `xamp;y`,
    {
      issues: []
    },
    t
  ));

test(`02.07 - ${`\u001b[${32}m${`missing amp`}\u001b[${39}m`} - minimal sandwiched, named, nbsp`, t =>
  c(`xnbsp;y`, `x&nbsp;y`, "bad-named-html-entity-malformed-nbsp", t));

test(`02.08 - ${`\u001b[${32}m${`missing amp`}\u001b[${39}m`} - minimal sandwiched, named, sup`, t =>
  c(`xsup;y`, `x&sup;y`, "bad-named-html-entity-malformed-sup", t));

test(`02.09 - ${`\u001b[${32}m${`missing amp`}\u001b[${39}m`} - minimal sandwiched, named, zwnj`, t =>
  c(`xzwnj;y`, `x&zwnj;y`, "bad-named-html-entity-malformed-zwnj", t));

// spaced

test(`02.10 - ${`\u001b[${32}m${`missing amp`}\u001b[${39}m`} - minimal spaced, named, amp`, t =>
  c(`x amp; y`, `x &amp; y`, "bad-named-html-entity-malformed-amp", t));

test(`02.11 - ${`\u001b[${32}m${`missing amp`}\u001b[${39}m`} - minimal spaced, named, nbsp`, t =>
  c(`x nbsp; y`, `x &nbsp; y`, "bad-named-html-entity-malformed-nbsp", t));

test(`02.12 - ${`\u001b[${32}m${`missing amp`}\u001b[${39}m`} - minimal spaced, named, sup`, t =>
  c(`x sup; y`, `x &sup; y`, "bad-named-html-entity-malformed-sup", t));

test(`02.13 - ${`\u001b[${32}m${`missing amp`}\u001b[${39}m`} - minimal spaced, named, zwnj`, t =>
  c(`x zwnj; y`, `x &zwnj; y`, "bad-named-html-entity-malformed-zwnj", t));

// linebreaked

test(`02.14 - ${`\u001b[${32}m${`missing amp`}\u001b[${39}m`} - minimal linebreaked, named, amp`, t =>
  c(`x\namp;\ny`, `x\n&amp;\ny`, "bad-named-html-entity-malformed-amp", t));

test(`02.15 - ${`\u001b[${32}m${`missing amp`}\u001b[${39}m`} - minimal linebreaked, named, nbsp`, t =>
  c(`x\nnbsp;\ny`, `x\n&nbsp;\ny`, "bad-named-html-entity-malformed-nbsp", t));

test(`02.16 - ${`\u001b[${32}m${`missing amp`}\u001b[${39}m`} - minimal linebreaked, named, sup`, t =>
  c(`x\nsup;\ny`, `x\n&sup;\ny`, "bad-named-html-entity-malformed-sup", t));

test(`02.17 - ${`\u001b[${32}m${`missing amp`}\u001b[${39}m`} - minimal linebreaked, named, zwnj`, t =>
  c(`x\nzwnj;\ny`, `x\n&zwnj;\ny`, "bad-named-html-entity-malformed-zwnj", t));

// 03. semicolon missing
// -----------------------------------------------------------------------------

// isolated

test(`03.01 - ${`\u001b[${36}m${`missing semicol`}\u001b[${39}m`} - minimal isolated, named, amp`, t =>
  c(`&amp`, `&amp;`, "bad-named-html-entity-malformed-amp", t));

test(`03.02 - ${`\u001b[${36}m${`missing semicol`}\u001b[${39}m`} - minimal isolated, named, nbsp`, t =>
  c(`&nbsp`, `&nbsp;`, "bad-named-html-entity-malformed-nbsp", t));

test(`03.03 - ${`\u001b[${36}m${`missing semicol`}\u001b[${39}m`} - minimal isolated, named, sup`, t =>
  c(`&sup`, `&sup;`, "bad-named-html-entity-malformed-sup", t));

test(`03.04 - ${`\u001b[${36}m${`missing semicol`}\u001b[${39}m`} - minimal isolated, named, zwnj`, t =>
  c(`&zwnj`, `&zwnj;`, "bad-named-html-entity-malformed-zwnj", t));

// sandwiched

test(`03.05 - ${`\u001b[${36}m${`missing semicol`}\u001b[${39}m`} - minimal sandwiched, named, amp`, t =>
  c(`x&ampy`, `x&amp;y`, "bad-named-html-entity-malformed-amp", t));

test(`03.06 - ${`\u001b[${36}m${`missing semicol`}\u001b[${39}m`} - minimal sandwiched, named, nbsp`, t =>
  c(`x&nbspy`, `x&nbsp;y`, "bad-named-html-entity-malformed-nbsp", t));

test(`03.07 - ${`\u001b[${36}m${`missing semicol`}\u001b[${39}m`} - minimal sandwiched, named, sup`, t =>
  c(`x&supy`, `x&sup;y`, "bad-named-html-entity-malformed-sup", t));

test(`03.08 - ${`\u001b[${36}m${`missing semicol`}\u001b[${39}m`} - minimal sandwiched, named, zwnj`, t =>
  c(`x&zwnjy`, `x&zwnj;y`, "bad-named-html-entity-malformed-zwnj", t));

// spaced

test(`03.09 - ${`\u001b[${36}m${`missing semicol`}\u001b[${39}m`} - minimal spaced, named, amp`, t =>
  c(`x &amp y`, `x &amp; y`, "bad-named-html-entity-malformed-amp", t));

test(`03.10 - ${`\u001b[${36}m${`missing semicol`}\u001b[${39}m`} - minimal spaced, named, nbsp`, t =>
  c(`x &nbsp y`, `x &nbsp; y`, "bad-named-html-entity-malformed-nbsp", t));

test(`03.11 - ${`\u001b[${36}m${`missing semicol`}\u001b[${39}m`} - minimal spaced, named, sup`, t =>
  c(`x &sup y`, `x &sup; y`, "bad-named-html-entity-malformed-sup", t));

test(`03.12 - ${`\u001b[${36}m${`missing semicol`}\u001b[${39}m`} - minimal spaced, named, zwnj`, t =>
  c(`x &zwnj y`, `x &zwnj; y`, "bad-named-html-entity-malformed-zwnj", t));

// linebreaked

test(`03.13 - ${`\u001b[${36}m${`missing semicol`}\u001b[${39}m`} - minimal linebreaked, named, amp`, t =>
  c(`x\n&amp\ny`, `x\n&amp;\ny`, "bad-named-html-entity-malformed-amp", t));

test(`03.14 - ${`\u001b[${36}m${`missing semicol`}\u001b[${39}m`} - minimal linebreaked, named, nbsp`, t =>
  c(`x\n&nbsp\ny`, `x\n&nbsp;\ny`, "bad-named-html-entity-malformed-nbsp", t));

test(`03.15 - ${`\u001b[${36}m${`missing semicol`}\u001b[${39}m`} - minimal linebreaked, named, sup`, t =>
  c(`x\n&sup\ny`, `x\n&sup;\ny`, "bad-named-html-entity-malformed-sup", t));

test(`03.16 - ${`\u001b[${36}m${`missing semicol`}\u001b[${39}m`} - minimal linebreaked, named, zwnj`, t =>
  c(`x\n&zwnj\ny`, `x\n&zwnj;\ny`, "bad-named-html-entity-malformed-zwnj", t));
