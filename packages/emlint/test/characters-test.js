import { lint } from "../dist/emlint.esm";
import apply from "ranges-apply";
import { c } from "../test-util/util";
import test from "ava";

// 02. rule "bad-character-*"
// -----------------------------------------------------------------------------

const charactersToTest = [
  "null",
  "start-of-heading",
  "start-of-text",
  "end-of-text",
  "end-of-transmission",
  "enquiry",
  "acknowledge",
  "bell",
  "backspace",
  "character-tabulation",
  "line-feed",
  "line-tabulation",
  "form-feed",
  "carriage-return",
  "shift-out",
  "shift-in",
  "data-link-escape",
  "device-control-one",
  "device-control-two",
  "device-control-three",
  "device-control-four",
  "negative-acknowledge",
  "synchronous-idle",
  "end-of-transmission-block",
  "cancel",
  "end-of-medium",
  "substitute",
  "escape",
  "information-separator-four",
  "information-separator-three",
  "information-separator-two",
  "information-separator-one"
];

test(`82.XX - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - ASCII 0-31`, t => {
  charactersToTest.forEach((characterStr, idx) => {
    if (idx !== 9 && idx !== 10 && idx !== 13) {
      // 9 = tab, 10 = LF, 13 = CR
      const bad1 = String.fromCharCode(idx);
      const res1 = lint(bad1);
      t.is(
        res1.issues[0].name,
        `bad-character-${characterStr}`,
        `02.${String(idx).length === 1 ? `0${idx}` : idx}.01`
      );
      t.deepEqual(
        res1.issues[0].position,
        [[0, 1]],
        `02.${String(idx).length === 1 ? `0${idx}` : idx}.02`
      );
      t.is(
        apply(bad1, res1.fix),
        "",
        `02.${String(idx).length === 1 ? `0${idx}` : idx}.03`
      );

      const bad2 = `aaaaa\n\n\n${bad1}bbb`;
      const res2 = lint(bad2);
      t.is(
        res2.issues[0].name,
        `bad-character-${characterStr}`,
        `02.${String(idx).length === 1 ? `0${idx}` : idx}.04`
      );
      t.deepEqual(
        res2.issues[0].position,
        [[8, 9]],
        `02.${String(idx).length === 1 ? `0${idx}` : idx}.05`
      );
      t.is(
        apply(bad2, res2.fix),
        "aaaaa\n\n\nbbb",
        `02.${String(idx).length === 1 ? `0${idx}` : idx}.06`
      );
    }
  });
});

const c1CharactersToTest = [
  "delete",
  "padding",
  "high-octet-preset",
  "break-permitted-here",
  "no-break-here",
  "index",
  "next-line",
  "start-of-selected-area",
  "end-of-selected-area",
  "character-tabulation-set",
  "character-tabulation-with-justification",
  "line-tabulation-set",
  "partial-line-forward",
  "partial-line-backward",
  "reverse-line-feed",
  "single-shift-two",
  "single-shift-three",
  "device-control-string",
  "private-use-1",
  "private-use-2",
  "set-transmit-state",
  "cancel-character",
  "message-waiting",
  "start-of-protected-area",
  "end-of-protected-area",
  "start-of-string",
  "single-graphic-character-introducer",
  "single-character-intro-introducer",
  "control-sequence-introducer",
  "string-terminator",
  "operating-system-command",
  "private-message",
  "application-program-command"
];

test(`82.YY - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - Unicode 127-159`, t => {
  c1CharactersToTest.forEach((characterStr, idx) => {
    const bad1 = String.fromCharCode(idx + 127);
    const res1 = lint(bad1);
    t.is(
      res1.issues[0].name,
      `bad-character-${characterStr}`,
      `02.${String(idx).length === 1 ? `0${idx}` : idx}.01`
    );
    t.deepEqual(
      res1.issues[0].position,
      [[0, 1]],
      `02.${String(idx).length === 1 ? `0${idx}` : idx}.02`
    );
    t.is(
      apply(bad1, res1.fix),
      "",
      `02.${String(idx).length === 1 ? `0${idx}` : idx}.03`
    );

    const bad2 = `aaaaa\n\n\n${bad1}bbb`;
    const res2 = lint(bad2);
    t.is(
      res2.issues[0].name,
      `bad-character-${characterStr}`,
      `02.${String(idx).length === 1 ? `0${idx}` : idx}.04`
    );
    t.deepEqual(
      res2.issues[0].position,
      [[8, 9]],
      `02.${String(idx).length === 1 ? `0${idx}` : idx}.05`
    );
    t.is(
      apply(bad2, res2.fix),
      "aaaaa\n\n\nbbb",
      `02.${String(idx).length === 1 ? `0${idx}` : idx}.06`
    );
  });
});

test(`82.01 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - DELETE character (control)`, t => {
  t.is(lint(`\u007F`).issues[0].name, "bad-character-delete", "02.01");
});

test(`82.02 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - ETX character, tight`, t =>
  c(`first\u0003second`, `firstsecond`, "bad-character-end-of-text", t));

test(`82.03 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - ETX character, spaced`, t =>
  c(`first \u0003second`, `first second`, "bad-character-end-of-text", t));

test(`82.04 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - ETX character, spaced`, t =>
  c(`first \u0003 second`, `first second`, "bad-character-end-of-text", t));

test(`82.05 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - ETX character, spaced with line breaks`, t =>
  c(`first \u0003\nsecond`, `first\nsecond`, "bad-character-end-of-text", t));

// https://www.fileformat.info/info/unicode/char/200b/index.htm
test(`82.06 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - zero width space`, t =>
  c("a\u200Bb", `ab`, "bad-character-zero-width-space", t));

// https://en.wikipedia.org/wiki/Non-breaking_space
// http://www.fileformat.info/info/unicode/char/00a0/browsertest.htm
test(`82.07 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - unencoded non-breaking space - between letters`, t =>
  c("a\xA0b", `a&nbsp;b`, "bad-character-unencoded-non-breaking-space", t));

// when raw non-breaking spaces are copy pasted into code editor:
test(`82.08 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - unencoded non-breaking space - among indentations`, t =>
  c(
    `
\xA0  <!--[if gte mso 9]>
\xA0  <xml>
  \xA0  <o:Z>
  \xA0  <o:AA/>
  \xA0  <o:P>96</o:P>
  \xA0  </o:Z>
\xA0  </xml>
\xA0  <![endif]-->`,
    `
&nbsp;  <!--[if gte mso 9]>
&nbsp;  <xml>
  &nbsp;  <o:Z>
  &nbsp;  <o:AA/>
  &nbsp;  <o:P>96</o:P>
  &nbsp;  </o:Z>
&nbsp;  </xml>
&nbsp;  <![endif]-->`,
    "bad-character-unencoded-non-breaking-space",
    t
  ));

test(`82.09 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - unencoded grave accent`, t =>
  c("a`b", `a&#x60;b`, "bad-character-grave-accent", t));

// line separator character
// https://www.fileformat.info/info/unicode/char/2028/index.htm
test(`82.10 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - unencoded line separator`, t =>
  c("a\u2028b", `a\nb`, "bad-character-line-separator", t));

test(`82.11 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - unencoded pound`, t =>
  c("a\xA3b", `a&pound;b`, "bad-character-unencoded-pound", t));

test(`82.12 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - unencoded euro`, t =>
  c("a\u20ACb", `a&euro;b`, "bad-character-unencoded-euro", t));

test(`82.13 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - unencoded cent`, t =>
  c("a\xA2b", `a&cent;b`, "bad-character-unencoded-cent", t));

test(`82.14 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - generic bad characters`, t =>
  c("a\u0378b", `ab`, "bad-character-generic", t));

// https://www.fileformat.info/info/unicode/char/2000/index.htm
test(`82.15 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - en quad`, t =>
  c("a\u2000b", `a b`, "bad-character-en-quad", t));

test(`82.16 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - em quad`, t =>
  c("a\u2001b", `a b`, "bad-character-em-quad", t));

test(`82.17 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - en space`, t =>
  c("a\u2002b", `a b`, "bad-character-en-space", t));

test(`82.18 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - em space`, t =>
  c("a\u2003b", `a b`, "bad-character-em-space", t));

// three-per-em space:
// https://www.fileformat.info/info/unicode/char/2004/index.htm
test(`82.19 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - three-per-em space`, t =>
  c("a\u2004b", `a b`, "bad-character-three-per-em-space", t));

// four-per-em space:
// https://www.fileformat.info/info/unicode/char/2005/index.htm
test(`82.20 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - four-per-em space`, t =>
  c("a\u2005b", `a b`, "bad-character-four-per-em-space", t));

// six-per-em space:
// https://www.fileformat.info/info/unicode/char/2006/index.htm
test(`82.21 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - six-per-em space`, t =>
  c("a\u2006b", `a b`, "bad-character-six-per-em-space", t));

// figure space:
// https://www.fileformat.info/info/unicode/char/2007/index.htm
test(`82.22 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - figure space`, t =>
  c("a\u2007b", `a b`, "bad-character-figure-space", t));

// punctuation space:
// https://www.fileformat.info/info/unicode/char/2008/index.htm
test(`82.23 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - punctuation space`, t =>
  c("a\u2008b", `a b`, "bad-character-punctuation-space", t));

// thin space:
// https://www.fileformat.info/info/unicode/char/2009/index.htm
test(`82.24 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - thin space`, t =>
  c("a\u2009b", `a b`, "bad-character-thin-space", t));

// hair space:
// https://www.fileformat.info/info/unicode/char/200a/index.htm
test(`82.25 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - hair space`, t =>
  c("a\u200ab", `a b`, "bad-character-hair-space", t));

// narrow no-break space:
// https://www.fileformat.info/info/unicode/char/202f/index.htm
test(`82.26 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - narrow no-break space`, t =>
  c("a\u202Fb", `a b`, "bad-character-narrow-no-break-space", t));

// line separator:
// https://www.fileformat.info/info/unicode/char/2028/index.htm
test(`82.27 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - line separator`, t =>
  c("a\u2028b", `a\nb`, "bad-character-line-separator", t));

// paragraph separator:
// https://www.fileformat.info/info/unicode/char/2029/index.htm
test(`82.28 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - paragraph separator`, t =>
  c("a\u2029b", `a\nb`, "bad-character-paragraph-separator", t));

// medium mathematical space:
// https://www.fileformat.info/info/unicode/char/205f/index.htm
test(`82.29 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - medium mathematical space`, t =>
  c("a\u205fb", `a b`, "bad-character-medium-mathematical-space", t));

// ideographic space:
// https://www.fileformat.info/info/unicode/char/3000/index.htm
test(`82.30 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - ideographic space`, t =>
  c("a\u3000b", `a b`, "bad-character-ideographic-space", t));

// ogham space mark:
// https://www.fileformat.info/info/unicode/char/1680/index.htm
test(`82.31 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - ogham space mark`, t =>
  c("a\u1680b", `a b`, "bad-character-ogham-space-mark", t));
