import test from "ava";
import { lint } from "../dist/emlint.esm";
import apply from "ranges-apply";
// import errors from "../src/errors.json";
import {
  withinTagInnerspace,
  attributeOnTheRight,
  findClosingQuote,
  tagOnTheRight,
  onlyTheseLeadToThat
} from "../dist/util.esm";

function getUniqueIssueNames(issues) {
  return issues.reduce((accum, curr) => {
    if (!accum.includes(curr.name)) {
      return accum.concat([curr.name]);
    }
    return accum;
  }, []);
}

// 00. Insurance
// -----------------------------------------------------------------------------

test(`00.01 - ${`\u001b[${33}m${`arg. validation`}\u001b[${39}m`} - 1st input arg wrong`, t => {
  const error1 = t.throws(() => {
    lint(true);
  });
  t.regex(error1.message, /THROW_ID_01/);
});

test(`00.02 - ${`\u001b[${33}m${`arg. validation`}\u001b[${39}m`} - 2nd input arg wrong`, t => {
  const error1 = t.throws(() => {
    lint("a", true);
  });
  t.regex(error1.message, /THROW_ID_02/);
});

test(`00.03 - ${`\u001b[${33}m${`arg. validation`}\u001b[${39}m`} - opts.line_endings_CR_LF_CRLF wrong`, t => {
  // 1. easy error - wrong type (not string/falsey)
  const error1 = t.throws(() => {
    lint("zzz", {
      style: {
        line_endings_CR_LF_CRLF: true
      }
    });
  });
  t.regex(error1.message, /THROW_ID_03\*/);

  // 2. more difficult error - wrong type (not string/falsey)
  const error2 = t.throws(() => {
    lint("zzz", {
      style: {
        line_endings_CR_LF_CRLF: "aa"
      }
    });
  });
  t.regex(error2.message, /THROW_ID_04/);

  // 3. various messed up capitalisation cases don't throw:
  t.notThrows(() => {
    lint("zzz", {
      style: {
        line_endings_CR_LF_CRLF: "Cr"
      }
    });
  });
  t.notThrows(() => {
    lint("zzz", {
      style: {
        line_endings_CR_LF_CRLF: "lF"
      }
    });
  });
  t.notThrows(() => {
    lint("zzz", {
      style: {
        line_endings_CR_LF_CRLF: "cRlF"
      }
    });
  });
  t.notThrows(() => {
    lint("zzz", {
      style: {
        line_endings_CR_LF_CRLF: "crLf"
      }
    });
  });
});

test(`00.04 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - empty input`, t => {
  const inp = ``;
  const res1 = lint(inp);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["file-empty"],
    "00.04.01"
  );
  // we can't fix this rule, create some content for you
  t.deepEqual(res1.fix, [], "00.04.02");
});

// 01. rule "tag-space-after-opening-bracket"
// -----------------------------------------------------------------------------
test(`01.00 - ${`\u001b[${35}m${`space between the tag name and opening bracket`}\u001b[${39}m`} - all fine (control)`, t => {
  t.is(lint("<table>").issues.length, 0, "01.00.01");
});

test(`01.02 - ${`\u001b[${35}m${`space between the tag name and opening bracket`}\u001b[${39}m`} - single space`, t => {
  const bad = "< table>";
  const res = lint(bad);
  const good = "<table>";
  // there's only one issue:
  t.is(apply(bad, res.fix), good, "01.02.01");
  t.deepEqual(
    res.issues,
    [
      {
        name: "tag-space-after-opening-bracket",
        position: [[1, 2]]
      }
    ],
    "01.02.02"
  );
});

test(`01.03 - ${`\u001b[${35}m${`space between the tag name and opening bracket`}\u001b[${39}m`} - multiple spaces`, t => {
  const bad = "<    table>";
  const res = lint(bad);
  const good = "<table>";
  t.is(apply(bad, res.fix), good, "01.03.01");
  t.deepEqual(
    res.issues,
    [
      {
        name: "tag-space-after-opening-bracket",
        position: [[1, 5]]
      }
    ],
    "01.03.02"
  );
});

test(`01.04 - ${`\u001b[${35}m${`space between the tag name and opening bracket`}\u001b[${39}m`} - multiple spaces with tabs`, t => {
  const bad1 = "< \n\n\n\t\t\t   table>";
  const good1 = `<table>`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-character-character-tabulation", "tag-space-after-opening-bracket"],
    "01.04.01"
  );
  t.is(apply(bad1, res1.fix), good1, "01.04.02");
});

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

test(`02.XX - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - ASCII 0-31`, t => {
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

test(`02.YY - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - Unicode 127-159`, t => {
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

test(`02.01 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - DELETE character (control)`, t => {
  t.is(lint(`\u007F`).issues[0].name, "bad-character-delete", "02.01");
});

test(`02.02 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - ETX character, tight`, t => {
  const bad1 = `first\u0003second`;
  const good1 = `firstsecond`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-character-end-of-text"],
    "02.02.01"
  );
  t.is(apply(bad1, res1.fix), good1, "02.02.02");
});

test(`02.03 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - ETX character, spaced`, t => {
  const bad1 = `first \u0003second`;
  const good1 = `first second`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-character-end-of-text"],
    "02.03.01"
  );
  t.is(apply(bad1, res1.fix), good1, "02.03.02");
});

test(`02.04 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - ETX character, spaced`, t => {
  const bad1 = `first \u0003 second`;
  const good1 = `first second`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-character-end-of-text"],
    "02.04.01"
  );
  t.is(apply(bad1, res1.fix), good1, "02.04.02");
});

test(`02.05 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - ETX character, spaced with line breaks`, t => {
  const bad1 = `first \u0003\nsecond`;
  const good1 = `first\nsecond`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-character-end-of-text"],
    "02.05.01"
  );
  t.is(apply(bad1, res1.fix), good1, "02.05.02");
});

// https://www.fileformat.info/info/unicode/char/200b/index.htm
test(`02.06 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - zero width space`, t => {
  const bad1 = "a\u200Bb";
  const good1 = `ab`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-character-zero-width-space"],
    "02.06.01"
  );
  t.is(apply(bad1, res1.fix), good1, "02.06.02");
});

// https://en.wikipedia.org/wiki/Non-breaking_space
// http://www.fileformat.info/info/unicode/char/00a0/browsertest.htm
test(`02.06 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - unencoded non-breaking space - between letters`, t => {
  const bad1 = "a\xA0b";
  const good1 = `a&nbsp;b`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-character-unencoded-non-breaking-space"],
    "02.06.01"
  );
  t.is(apply(bad1, res1.fix), good1, "02.06.02");
});

// when raw non-breaking spaces are copy pasted into code editor:
test(`02.07 - ${`\u001b[${36}m${`raw bad characters`}\u001b[${39}m`} - unencoded non-breaking space - among indentations`, t => {
  const bad1 = `
\xA0  <!--[if gte mso 9]>
\xA0  <xml>
  \xA0  <o:OfficeDocumentSettings>
  \xA0  <o:AllowPNG/>
  \xA0  <o:PixelsPerInch>96</o:PixelsPerInch>
  \xA0  </o:OfficeDocumentSettings>
\xA0  </xml>
\xA0  <![endif]-->`;
  const good1 = `
&nbsp;  <!--[if gte mso 9]>
&nbsp;  <xml>
  &nbsp;  <o:OfficeDocumentSettings>
  &nbsp;  <o:AllowPNG/>
  &nbsp;  <o:PixelsPerInch>96</o:PixelsPerInch>
  &nbsp;  </o:OfficeDocumentSettings>
&nbsp;  </xml>
&nbsp;  <![endif]-->`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-character-unencoded-non-breaking-space"],
    "02.07.01"
  );
  t.is(apply(bad1, res1.fix), good1, "02.07.02");
});

test(`02.08 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - unencoded grave accent`, t => {
  const bad1 = "a`b";
  const good1 = `a&#x60;b`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-character-grave-accent"],
    "02.08.01"
  );
  t.is(apply(bad1, res1.fix), good1, "02.08.02");
});

// line separator character
// https://www.fileformat.info/info/unicode/char/2028/index.htm
test(`02.09 - ${`\u001b[${31}m${`raw bad characters`}\u001b[${39}m`} - unencoded line separator`, t => {
  const bad1 = "a\u2028b";
  const good1 = `ab`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-character-line-separator"],
    "02.09.01"
  );
  t.is(apply(bad1, res1.fix), good1, "02.09.02");
});

// 03. rule "tag-name-lowercase"
// -----------------------------------------------------------------------------
test(`03.00 - ${`\u001b[${36}m${`tag-name-lowercase`}\u001b[${39}m`} - all fine (control)`, t => {
  t.is(lint("<table>").issues.length, 0, "03.00.01");
});

test(`03.01 - ${`\u001b[${36}m${`tag-name-lowercase`}\u001b[${39}m`} - one tag with capital letter`, t => {
  const bad = "<Table>";
  const good = "<table>";
  const res = lint(bad);

  // there's only one issue:
  t.is(res.issues.length, 1, "03.01.01");
  t.is(res.issues[0].name, "tag-name-lowercase", "03.01.02");
  t.deepEqual(res.issues[0].position, [[1, 2, "t"]], "03.01.03");

  // fixing:
  t.is(apply(bad, res.fix), good, "03.01.04");
});

test(`03.02 - ${`\u001b[${36}m${`tag-name-lowercase`}\u001b[${39}m`} - few tags with capital letters`, t => {
  const bad = "<tAbLE><tR><TD>";
  const good = "<table><tr><td>";
  const res = lint(bad);

  // there's only one issue:
  t.is(res.issues.length, 6, "03.02.01");
  t.is(res.issues[0].name, "tag-name-lowercase", "03.02.02");
  t.deepEqual(
    getUniqueIssueNames(res.issues),
    ["tag-name-lowercase"],
    "03.02.03"
  );
  t.deepEqual(
    res.fix,
    [[2, 3, "a"], [4, 6, "le"], [9, 10, "r"], [12, 14, "td"]],
    "03.02.04"
  );

  // fixing:
  t.is(apply(bad, res.fix), good, "03.02.05");
});

// 04. rule "file-wrong-type-line-ending-*"
// -----------------------------------------------------------------------------
test(`04.01 - ${`\u001b[${34}m${`file-wrong-type-line-ending-*`}\u001b[${39}m`} - consistent line endings given, no desired option set`, t => {
  // desired line endings are not defined but they are consistent
  // 1. all CR
  t.is(lint("\r").issues.length, 0, "04.01.01");
  t.is(lint("aaaaaa\rbbbbbbbb\r\rcccccc").issues.length, 0, "04.01.02");
  t.is(lint("aaaaaa\rbbbbbbbb\r\rcccccc\r").issues.length, 0, "04.01.03");
  // 2. all LF
  t.is(lint("\n").issues.length, 0, "04.01.04");
  t.is(lint("aaaaaa\nbbbbbbbb\n\ncccccc").issues.length, 0, "04.01.05");
  t.is(lint("aaaaaa\nbbbbbbbb\n\ncccccc\n").issues.length, 0, "04.01.06");
  // 3. all CRLF
  t.is(lint("\r\n").issues.length, 0, "04.01.04");
  t.is(lint("aaa\r\nbbb\r\n\r\nccc").issues.length, 0, "04.01.05");
  t.is(lint("aaa\r\nbbb\r\n\r\nccc\r\n").issues.length, 0, "04.01.06");
});

test(`04.02 - ${`\u001b[${34}m${`file-wrong-type-line-ending-*`}\u001b[${39}m`} - consistent line endings given, matching the desired option set`, t => {
  // desired line endings are not defined but they are consistent
  // 1. all CR
  t.is(
    lint("\r", {
      style: {
        line_endings_CR_LF_CRLF: "CR"
      }
    }).issues.length,
    0,
    "04.02.01"
  );
  t.is(
    lint("aaaaaa\rbbbbbbbb\r\rcccccc", {
      style: {
        line_endings_CR_LF_CRLF: "CR"
      }
    }).issues.length,
    0,
    "04.02.02"
  );
  t.is(
    lint("aaaaaa\rbbbbbbbb\r\rcccccc\r", {
      style: {
        line_endings_CR_LF_CRLF: "CR"
      }
    }).issues.length,
    0,
    "04.02.03"
  );
  // 2. all LF
  t.is(
    lint("\n", {
      style: {
        line_endings_CR_LF_CRLF: "LF"
      }
    }).issues.length,
    0,
    "04.02.04"
  );
  t.is(
    lint("aaaaaa\nbbbbbbbb\n\ncccccc", {
      style: {
        line_endings_CR_LF_CRLF: "LF"
      }
    }).issues.length,
    0,
    "04.02.05"
  );
  t.is(
    lint("aaaaaa\nbbbbbbbb\n\ncccccc\n", {
      style: {
        line_endings_CR_LF_CRLF: "LF"
      }
    }).issues.length,
    0,
    "04.02.06"
  );
  // 3. all CRLF
  t.is(
    lint("\r\n", {
      style: {
        line_endings_CR_LF_CRLF: "CRLF"
      }
    }).issues.length,
    0,
    "04.02.04"
  );
  t.is(
    lint("aaa\r\nbbb\r\n\r\nccc", {
      style: {
        line_endings_CR_LF_CRLF: "CRLF"
      }
    }).issues.length,
    0,
    "04.02.05"
  );
  t.is(
    lint("aaa\r\nbbb\r\n\r\nccc\r\n", {
      style: {
        line_endings_CR_LF_CRLF: "CRLF"
      }
    }).issues.length,
    0,
    "04.02.06"
  );
});

test(`04.03 - ${`\u001b[${34}m${`file-wrong-type-line-ending-*`}\u001b[${39}m`} - all ${`\u001b[${33}m${`LF`}\u001b[${39}m`}   - requesting ${`\u001b[${31}m${`CR`}\u001b[${39}m`}`, t => {
  // desired line endings are defined and are consistent, but different ending
  // is required via options.

  const bad1 = "\n";
  const good1 = "\r";
  const res1 = lint(bad1, {
    style: {
      line_endings_CR_LF_CRLF: "CR"
    }
  });
  t.deepEqual(
    res1.issues,
    [
      {
        name: "file-wrong-type-line-ending-LF",
        position: [[0, 1, "\r"]]
      }
    ],
    "04.03.01"
  );
  t.is(apply(bad1, res1.fix), good1, "04.03.02");

  // ================

  const bad2 = "aaaaaa\nbbbbbbbb\n\ncccccc";
  const good2 = "aaaaaa\rbbbbbbbb\r\rcccccc";
  const res2 = lint(bad2, {
    style: {
      line_endings_CR_LF_CRLF: "CR"
    }
  });
  t.deepEqual(res2.issues.length, 3, "04.03.03");
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["file-wrong-type-line-ending-LF"],
    "04.03.04"
  );
  t.is(apply(bad2, res2.fix), good2, "04.03.05");

  // ================

  const bad3 = "aaaaaa\nbbbbbbbb\n\ncccccc\n";
  const good3 = "aaaaaa\rbbbbbbbb\r\rcccccc\r";
  const res3 = lint(bad3, {
    style: {
      line_endings_CR_LF_CRLF: "CR"
    }
  });
  t.deepEqual(res3.issues.length, 4, "04.03.06");
  t.deepEqual(
    getUniqueIssueNames(res3.issues),
    ["file-wrong-type-line-ending-LF"],
    "04.03.07"
  );
  t.is(apply(bad3, res3.fix), good3, "04.03.08");
});

test(`04.04 - ${`\u001b[${34}m${`file-wrong-type-line-ending-*`}\u001b[${39}m`} - all ${`\u001b[${32}m${`CRLF`}\u001b[${39}m`} - requesting ${`\u001b[${31}m${`CR`}\u001b[${39}m`}`, t => {
  // desired line endings are defined and are consistent, but different ending
  // is required via options.

  const bad1 = "\r\n";
  const good1 = "\r";
  const res1 = lint(bad1, {
    style: {
      line_endings_CR_LF_CRLF: "CR"
    }
  });
  t.deepEqual(
    res1.issues,
    [
      {
        name: "file-wrong-type-line-ending-CRLF",
        position: [[0, 2, "\r"]]
      }
    ],
    "04.04.01"
  );
  t.is(apply(bad1, res1.fix), good1, "04.04.02");

  // ================

  const bad2 = "aaa\r\nbbb\r\n\r\nccc";
  const good2 = "aaa\rbbb\r\rccc";
  const res2 = lint(bad2, {
    style: {
      line_endings_CR_LF_CRLF: "CR"
    }
  });
  t.deepEqual(res2.issues.length, 3, "04.04.03");
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["file-wrong-type-line-ending-CRLF"],
    "04.04.04"
  );
  t.is(apply(bad2, res2.fix), good2, "04.04.05");

  // ================

  const bad3 = "aaaaaa\r\nbbbbbbbb\r\n\r\ncccccc\r\n";
  const good3 = "aaaaaa\rbbbbbbbb\r\rcccccc\r";
  const res3 = lint(bad3, {
    style: {
      line_endings_CR_LF_CRLF: "CR"
    }
  });
  t.deepEqual(res3.issues.length, 4, "04.04.06");
  t.deepEqual(
    getUniqueIssueNames(res3.issues),
    ["file-wrong-type-line-ending-CRLF"],
    "04.04.07"
  );
  t.is(apply(bad3, res3.fix), good3, "04.04.08");
});

test(`04.05 - ${`\u001b[${34}m${`file-wrong-type-line-ending-*`}\u001b[${39}m`} - all ${`\u001b[${31}m${`CR`}\u001b[${39}m`}   - requesting ${`\u001b[${33}m${`LF`}\u001b[${39}m`}`, t => {
  // desired line endings are defined and are consistent, but different ending
  // is required via options.

  const bad1 = "\r";
  const good1 = "\n";
  const res1 = lint(bad1, {
    style: {
      line_endings_CR_LF_CRLF: "LF"
    }
  });
  t.deepEqual(
    res1.issues,
    [
      {
        name: "file-wrong-type-line-ending-CR",
        position: [[0, 1, "\n"]]
      }
    ],
    "04.05.01"
  );
  t.is(apply(bad1, res1.fix), good1, "04.05.02");

  // ================

  const bad2 = "aaaaaa\rbbbbbbbb\r\rcccccc";
  const good2 = "aaaaaa\nbbbbbbbb\n\ncccccc";
  const res2 = lint(bad2, {
    style: {
      line_endings_CR_LF_CRLF: "LF"
    }
  });
  t.deepEqual(res2.issues.length, 3, "04.05.03");
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["file-wrong-type-line-ending-CR"],
    "04.05.04"
  );
  t.is(apply(bad2, res2.fix), good2, "04.05.05");

  // ================

  const bad3 = "aaaaaa\rbbbbbbbb\r\rcccccc\r";
  const good3 = "aaaaaa\nbbbbbbbb\n\ncccccc\n";
  const res3 = lint(bad3, {
    style: {
      line_endings_CR_LF_CRLF: "LF"
    }
  });
  t.deepEqual(res3.issues.length, 4, "04.05.06");
  t.deepEqual(
    getUniqueIssueNames(res3.issues),
    ["file-wrong-type-line-ending-CR"],
    "04.05.07"
  );
  t.is(apply(bad3, res3.fix), good3, "04.05.08");
});

test(`04.06 - ${`\u001b[${34}m${`file-wrong-type-line-ending-*`}\u001b[${39}m`} - all ${`\u001b[${32}m${`CRLF`}\u001b[${39}m`} - requesting ${`\u001b[${33}m${`LF`}\u001b[${39}m`}`, t => {
  // desired line endings are defined and are consistent, but different ending
  // is required via options.

  const bad1 = "\r\n";
  const good1 = "\n";
  const res1 = lint(bad1, {
    style: {
      line_endings_CR_LF_CRLF: "LF"
    }
  });
  t.deepEqual(
    res1.issues,
    [
      {
        name: "file-wrong-type-line-ending-CRLF",
        position: [[0, 2, "\n"]]
      }
    ],
    "04.06.01"
  );
  t.is(apply(bad1, res1.fix), good1, "04.06.02");

  // ================

  const bad2 = "aaa\r\nbbb\r\n\r\nccc";
  const good2 = "aaa\nbbb\n\nccc";
  const res2 = lint(bad2, {
    style: {
      line_endings_CR_LF_CRLF: "LF"
    }
  });
  t.deepEqual(res2.issues.length, 3, "04.06.03");
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["file-wrong-type-line-ending-CRLF"],
    "04.06.04"
  );
  t.is(apply(bad2, res2.fix), good2, "04.06.05");

  // ================

  const bad3 = "aaaaaa\r\nbbbbbbbb\r\n\r\ncccccc\r\n";
  const good3 = "aaaaaa\nbbbbbbbb\n\ncccccc\n";
  const res3 = lint(bad3, {
    style: {
      line_endings_CR_LF_CRLF: "LF"
    }
  });
  t.deepEqual(res3.issues.length, 4, "04.06.06");
  t.deepEqual(
    getUniqueIssueNames(res3.issues),
    ["file-wrong-type-line-ending-CRLF"],
    "04.06.07"
  );
  t.is(apply(bad3, res3.fix), good3, "04.06.08");
});

test(`04.07 - ${`\u001b[${34}m${`file-wrong-type-line-ending-*`}\u001b[${39}m`} - all ${`\u001b[${33}m${`LF`}\u001b[${39}m`}   - requesting ${`\u001b[${32}m${`CRLF`}\u001b[${39}m`}`, t => {
  // desired line endings are defined and are consistent, but different ending
  // is required via options.

  const bad1 = "\n";
  const good1 = "\r\n";
  const res1 = lint(bad1, {
    style: {
      line_endings_CR_LF_CRLF: "CRLF"
    }
  });
  t.deepEqual(
    res1.issues,
    [
      {
        name: "file-wrong-type-line-ending-LF",
        position: [[0, 1, "\r\n"]]
      }
    ],
    "04.07.01"
  );
  t.is(apply(bad1, res1.fix), good1, "04.07.02");

  // ================

  const bad2 = "aaaaaa\nbbbbbbbb\n\ncccccc";
  const good2 = "aaaaaa\r\nbbbbbbbb\r\n\r\ncccccc";
  const res2 = lint(bad2, {
    style: {
      line_endings_CR_LF_CRLF: "CRLF"
    }
  });
  t.deepEqual(res2.issues.length, 3, "04.07.03");
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["file-wrong-type-line-ending-LF"],
    "04.07.04"
  );
  t.is(apply(bad2, res2.fix), good2, "04.07.05");

  // ================

  const bad3 = "aaaaaa\nbbbbbbbb\n\ncccccc\n";
  const good3 = "aaaaaa\r\nbbbbbbbb\r\n\r\ncccccc\r\n";
  const res3 = lint(bad3, {
    style: {
      line_endings_CR_LF_CRLF: "CRLF"
    }
  });
  t.deepEqual(res3.issues.length, 4, "04.07.06");
  t.deepEqual(
    getUniqueIssueNames(res3.issues),
    ["file-wrong-type-line-ending-LF"],
    "04.07.07"
  );
  t.is(apply(bad3, res3.fix), good3, "04.07.08");
});

test(`04.08 - ${`\u001b[${34}m${`file-wrong-type-line-ending-*`}\u001b[${39}m`} - all ${`\u001b[${31}m${`CR`}\u001b[${39}m`}   - requesting ${`\u001b[${32}m${`CRLF`}\u001b[${39}m`}`, t => {
  // desired line endings are defined and are consistent, but different ending
  // is required via options.

  const bad1 = "\r";
  const good1 = "\r\n";
  const res1 = lint(bad1, {
    style: {
      line_endings_CR_LF_CRLF: "CRLF"
    }
  });
  t.deepEqual(
    res1.issues,
    [
      {
        name: "file-wrong-type-line-ending-CR",
        position: [[0, 1, "\r\n"]]
      }
    ],
    "04.08.01"
  );
  t.is(apply(bad1, res1.fix), good1, "04.08.02");

  // ================

  const bad2 = "aaaaaa\rbbbbbbbb\r\rcccccc";
  const good2 = "aaaaaa\r\nbbbbbbbb\r\n\r\ncccccc";
  const res2 = lint(bad2, {
    style: {
      line_endings_CR_LF_CRLF: "CRLF"
    }
  });
  t.deepEqual(res2.issues.length, 3, "04.08.03");
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["file-wrong-type-line-ending-CR"],
    "04.08.04"
  );
  t.is(apply(bad2, res2.fix), good2, "04.08.05");

  // ================

  const bad3 = "aaaaaa\rbbbbbbbb\r\rcccccc\r";
  const good3 = "aaaaaa\r\nbbbbbbbb\r\n\r\ncccccc\r\n";
  const res3 = lint(bad3, {
    style: {
      line_endings_CR_LF_CRLF: "CRLF"
    }
  });
  t.deepEqual(res3.issues.length, 4, "04.08.06");
  t.deepEqual(
    getUniqueIssueNames(res3.issues),
    ["file-wrong-type-line-ending-CR"],
    "04.08.07"
  );
  t.is(apply(bad3, res3.fix), good3, "04.08.08");
});

test(`04.09 - ${`\u001b[${34}m${`file-wrong-type-line-ending-*`}\u001b[${39}m`} -   ${`\u001b[${36}m${`mixed`}\u001b[${39}m`}  - requesting ${`\u001b[${33}m${`LF`}\u001b[${39}m`}`, t => {
  const bad = "aaaaaa\rbbbbbbbb\n\r\nccccc\nc\r";
  const good = "aaaaaa\nbbbbbbbb\n\nccccc\nc\n";
  const res = lint(bad, {
    style: {
      line_endings_CR_LF_CRLF: "LF"
    }
  });
  t.is(res.issues.length, 3, "04.09.01");
  t.deepEqual(
    getUniqueIssueNames(res.issues).sort(),
    ["file-wrong-type-line-ending-CR", "file-wrong-type-line-ending-CRLF"],
    "04.09.02"
  );
  t.is(apply(bad, res.fix), good, "04.09.03");
});

test(`04.10 - ${`\u001b[${33}m${`file-mixed-line-endings-file-is-*-mainly`}\u001b[${39}m`} - ${`\u001b[${34}m${`no EOL specified in opts`}\u001b[${39}m`} - ${`\u001b[${31}m${`CR`}\u001b[${39}m`} clearly prevalent`, t => {
  const bad = "aaaaaa\rbbbbbbbb\r\r\nccccc\nc\r";
  const good = "aaaaaa\rbbbbbbbb\r\rccccc\rc\r";
  const res = lint(bad, {
    style: null
  });
  const res2 = lint(bad, {
    style: undefined
  });
  const res3 = lint(bad, {});
  const res4 = lint(bad);
  t.is(res.issues.length, 2, "04.10.01");
  t.deepEqual(
    getUniqueIssueNames(res.issues),
    ["file-mixed-line-endings-file-is-CR-mainly"],
    "04.10.02"
  );
  t.is(apply(bad, res.fix), good, "04.10.03");
  // different missing opts yield the same:
  t.deepEqual(res, res2, "04.10.04");
  t.deepEqual(res, res3, "04.10.05");
  t.deepEqual(res, res4, "04.10.06");
});

test(`04.11 - ${`\u001b[${33}m${`file-mixed-line-endings-file-is-*-mainly`}\u001b[${39}m`} - ${`\u001b[${34}m${`no EOL specified in opts`}\u001b[${39}m`} - ${`\u001b[${33}m${`LF`}\u001b[${39}m`} clearly prevalent`, t => {
  const bad = "aaaaaa\nbbbbbbbb\n\r\nccccc\nc\r";
  const good = "aaaaaa\nbbbbbbbb\n\nccccc\nc\n";
  const res = lint(bad, {
    style: null
  });
  const res2 = lint(bad, {
    style: undefined
  });
  const res3 = lint(bad, {});
  const res4 = lint(bad);
  t.is(res.issues.length, 2, "04.11.01");
  t.deepEqual(
    getUniqueIssueNames(res.issues),
    ["file-mixed-line-endings-file-is-LF-mainly"],
    "04.11.02"
  );
  t.is(apply(bad, res.fix), good, "04.11.03");
  // different missing opts yield the same:
  t.deepEqual(res, res2, "04.11.04");
  t.deepEqual(res, res3, "04.11.05");
  t.deepEqual(res, res4, "04.11.06");
});

test(`04.12 - ${`\u001b[${33}m${`file-mixed-line-endings-file-is-*-mainly`}\u001b[${39}m`} - ${`\u001b[${34}m${`no EOL specified in opts`}\u001b[${39}m`} - ${`\u001b[${32}m${`CRLF`}\u001b[${39}m`} clearly prevalent`, t => {
  const bad = "aaaaaa\r\nbbbbbbbb\r\r\nccccc\nc\r\n";
  const good = "aaaaaa\r\nbbbbbbbb\r\n\r\nccccc\r\nc\r\n";
  const res = lint(bad, {
    style: null
  });
  const res2 = lint(bad, {
    style: undefined
  });
  const res3 = lint(bad, {});
  const res4 = lint(bad);
  t.is(res.issues.length, 2, "04.12.01");
  t.deepEqual(
    getUniqueIssueNames(res.issues),
    ["file-mixed-line-endings-file-is-CRLF-mainly"],
    "04.12.02"
  );
  t.is(apply(bad, res.fix), good, "04.12.03");
  // different missing opts yield the same:
  t.deepEqual(res, res2, "04.12.04");
  t.deepEqual(res, res3, "04.12.05");
  t.deepEqual(res, res4, "04.12.06");
});

test(`04.13 - ${`\u001b[${33}m${`file-mixed-line-endings-file-is-*-mainly`}\u001b[${39}m`} - ${`\u001b[${34}m${`no EOL specified in opts`}\u001b[${39}m`} - ${`\u001b[${36}m${`same amount of each type of EOL`}\u001b[${39}m`}`, t => {
  const bad = "aaaaaa\rbbbbbbbb\r\nccccc\nc";
  const good = "aaaaaa\nbbbbbbbb\nccccc\nc";
  const res = lint(bad, {
    style: null
  });
  const res2 = lint(bad, {
    style: undefined
  });
  const res3 = lint(bad, {});
  const res4 = lint(bad);
  t.is(res.issues.length, 2, "04.13.01");
  t.deepEqual(
    getUniqueIssueNames(res.issues),
    ["file-mixed-line-endings-file-is-LF-mainly"],
    "04.13.02"
  );
  t.is(apply(bad, res.fix), good, "04.13.03");
  // different missing opts yield the same:
  t.deepEqual(res, res2, "04.13.04");
  t.deepEqual(res, res3, "04.13.05");
  t.deepEqual(res, res4, "04.13.06");
});

test(`04.14 - ${`\u001b[${33}m${`file-mixed-line-endings-file-is-*-mainly`}\u001b[${39}m`} - ${`\u001b[${34}m${`no EOL specified in opts`}\u001b[${39}m`} - ${`\u001b[${31}m${`CR`}\u001b[${39}m`} & ${`\u001b[${32}m${`CRLF`}\u001b[${39}m`} are prevalent over ${`\u001b[${33}m${`LF`}\u001b[${39}m`}`, t => {
  const bad = "aaaaaa\r\r\nbbbbbbbb\r\r\nccccc\nc\r\r\n";
  const good = "aaaaaa\r\n\r\nbbbbbbbb\r\n\r\nccccc\r\nc\r\n\r\n";
  const res = lint(bad, {
    style: null
  });
  const res2 = lint(bad, {
    style: undefined
  });
  const res3 = lint(bad, {});
  const res4 = lint(bad);
  t.is(res.issues.length, 4, "04.14.01");
  t.deepEqual(
    getUniqueIssueNames(res.issues),
    ["file-mixed-line-endings-file-is-CRLF-mainly"],
    "04.14.02"
  );
  t.is(apply(bad, res.fix), good, "04.14.03");
  // different missing opts yield the same:
  t.deepEqual(res, res2, "04.14.04");
  t.deepEqual(res, res3, "04.14.05");
  t.deepEqual(res, res4, "04.14.06");
});

test(`04.15 - ${`\u001b[${33}m${`file-mixed-line-endings-file-is-*-mainly`}\u001b[${39}m`} - ${`\u001b[${34}m${`no EOL specified in opts`}\u001b[${39}m`} - ${`\u001b[${33}m${`LF`}\u001b[${39}m`} && ${`\u001b[${32}m${`CRLF`}\u001b[${39}m`} are prevalent over ${`\u001b[${31}m${`CR`}\u001b[${39}m`}`, t => {
  const bad = "aaaaaa\n\r\nbbbbbbbb\n\r\nccccc\rc\n\r\n";
  const good = "aaaaaa\n\nbbbbbbbb\n\nccccc\nc\n\n";
  const res = lint(bad, {
    style: null
  });
  const res2 = lint(bad, {
    style: undefined
  });
  const res3 = lint(bad, {});
  const res4 = lint(bad);
  t.is(res.issues.length, 4, "04.15.01");
  t.deepEqual(
    getUniqueIssueNames(res.issues),
    ["file-mixed-line-endings-file-is-LF-mainly"],
    "04.15.02"
  );
  t.is(apply(bad, res.fix), good, "04.15.03");
  // different missing opts yield the same:
  t.deepEqual(res, res2, "04.15.04");
  t.deepEqual(res, res3, "04.15.05");
  t.deepEqual(res, res4, "04.15.06");
});

test(`04.16 - ${`\u001b[${33}m${`file-mixed-line-endings-file-is-*-mainly`}\u001b[${39}m`} - ${`\u001b[${34}m${`no EOL specified in opts`}\u001b[${39}m`} - ${`\u001b[${33}m${`LF`}\u001b[${39}m`} && ${`\u001b[${31}m${`CR`}\u001b[${39}m`} are prevalent over ${`\u001b[${32}m${`CRLF`}\u001b[${39}m`}`, t => {
  const bad = "aaaaaa\n\rbbbbbbbb\n\rccccc\r\nc\n\r";
  const good = "aaaaaa\n\nbbbbbbbb\n\nccccc\nc\n\n";
  const res = lint(bad, {
    style: null
  });
  const res2 = lint(bad, {
    style: undefined
  });
  const res3 = lint(bad, {});
  const res4 = lint(bad);
  t.is(res.issues.length, 4, "04.16.01");
  t.deepEqual(
    getUniqueIssueNames(res.issues),
    ["file-mixed-line-endings-file-is-LF-mainly"],
    "04.16.02"
  );
  t.is(apply(bad, res.fix), good, "04.16.03");
  // different missing opts yield the same:
  t.deepEqual(res, res2, "04.16.04");
  t.deepEqual(res, res3, "04.16.05");
  t.deepEqual(res, res4, "04.16.06");
});

test(`04.17 - ${`\u001b[${33}m${`file-mixed-line-endings-file-is-*-mainly`}\u001b[${39}m`} - ${`\u001b[${34}m${`no EOL specified in opts`}\u001b[${39}m`} - ${`\u001b[${36}m${`no line breaks at all`}\u001b[${39}m`}`, t => {
  const input = "aaaaaa";
  const res = lint(input, {
    style: null
  });
  const res2 = lint(input, {
    style: undefined
  });
  const res3 = lint(input, {});
  const res4 = lint(input);
  t.is(res.issues.length, 0, "04.17.01");
  // different missing opts yield the same:
  t.deepEqual(res, res2, "04.16.02");
  t.deepEqual(res, res3, "04.16.03");
  t.deepEqual(res, res4, "04.16.04");
});

// 05. rule "tag-attribute-space-between-name-and-equals"
// -----------------------------------------------------------------------------

test(`05.01 - ${`\u001b[${31}m${`tag-attribute-space-between-name-and-equals`}\u001b[${39}m`} - all OK (control)`, t => {
  const input1 = `<zzz>`;
  const res1 = lint(input1);
  t.is(res1.issues.length, 0, "05.01.01");

  const input2 = `<zzz yyy="qqq">`;
  const res2 = lint(input2);
  t.is(res2.issues.length, 0, "05.01.02");
});

test(`05.02 - ${`\u001b[${31}m${`tag-attribute-space-between-name-and-equals`}\u001b[${39}m`} - spaces`, t => {
  // 1. single space

  const bad1 = `<zzz yyy ="qqq">`;
  const good1 = `<zzz yyy="qqq">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-space-between-name-and-equals"],
    "05.02.01"
  );
  t.is(apply(bad1, res1.fix), good1, "05.02.02");

  // 2. multiple spaces

  const bad2 = `<zzz yyy      ="qqq">`;
  const good2 = `<zzz yyy="qqq">`;
  const res2 = lint(bad2);
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-attribute-space-between-name-and-equals"],
    "05.02.03"
  );
  t.is(apply(bad2, res2.fix), good2, "05.02.04");
});

// 06. rule "tag-excessive-whitespace-inside-tag"
// -----------------------------------------------------------------------------

test(`06.01 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - control, no excessive gaps`, t => {
  const input1 = `<aaa bbb="ccc" ddd="eee">`;
  const res1 = lint(input1);
  t.is(res1.issues.length, 0, "06.01.01");

  const input2 = `<aaa bbb="ccc" ddd="eee"/>`;
  const res2 = lint(input2);
  t.is(res2.issues.length, 0, "06.01.02");
});

test(`06.02 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - single space between tag name and attr`, t => {
  const bad1 = `<aaa  bbb="ccc" ddd="eee">`;
  const good1 = `<aaa bbb="ccc" ddd="eee">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-excessive-whitespace-inside-tag"],
    "06.02.01"
  );
  t.is(apply(bad1, res1.fix), good1, "06.02.02");
});

test(`06.03 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - more substantial whitespace`, t => {
  const bad2 = `<aaa \n bbb="ccc" ddd="eee">`;
  const good2 = `<aaa bbb="ccc" ddd="eee">`;
  const res2 = lint(bad2);
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-excessive-whitespace-inside-tag"],
    "06.03.01"
  );
  t.is(apply(bad2, res2.fix), good2, "06.03.02");
});

test(`06.04 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - double space between attributes, once`, t => {
  const bad1 = `<aaa bbb="ccc"  ddd="eee">`;
  const good1 = `<aaa bbb="ccc" ddd="eee">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-excessive-whitespace-inside-tag"],
    "06.04.01"
  );
  t.is(apply(bad1, res1.fix), good1, "06.04.02");
});

test(`06.05 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - multiple chunks, both larger`, t => {
  const bad1 = `<aaa bbb="ccc"  ddd="eee"       fff="ggg">`;
  const good1 = `<aaa bbb="ccc" ddd="eee" fff="ggg">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-excessive-whitespace-inside-tag"],
    "06.05.01"
  );
  t.is(apply(bad1, res1.fix), good1, "06.05.02");
});

test(`06.06 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - attribute with no equals and value`, t => {
  const bad3 = `<aaa bbb  ddd="eee">`;
  const good3 = `<aaa bbb ddd="eee">`;
  const res3 = lint(bad3);
  t.deepEqual(
    getUniqueIssueNames(res3.issues),
    ["tag-excessive-whitespace-inside-tag"],
    "06.06.01"
  );
  t.is(apply(bad3, res3.fix), good3, "06.06.02");
});

test(`06.07 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - single space before closing slash`, t => {
  const bad1 = `<aaa bbb="ccc" ddd="eee" />`;
  const good1 = `<aaa bbb="ccc" ddd="eee"/>`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-excessive-whitespace-inside-tag"],
    "06.07.01"
  );
  t.is(apply(bad1, res1.fix), good1, "06.07.02");
});

test(`06.08 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - multiple spaces before the closing slash`, t => {
  const bad2 = `<aaa bbb="ccc" ddd="eee"    />`;
  const good2 = `<aaa bbb="ccc" ddd="eee"/>`;
  const res2 = lint(bad2);
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-excessive-whitespace-inside-tag"],
    "06.08.01"
  );
  t.is(apply(bad2, res2.fix), good2, "06.08.02");
});

test(`06.09 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - spaces attr and closing slash - fake case`, t => {
  const bad1 = `<aaa bbb="ccc" / ddd="eee"/>`;
  //                          ^
  //   this gap will be recognised as not closing slash

  const res1 = lint(bad1);
  t.false(
    getUniqueIssueNames(res1.issues).includes(
      "tag-excessive-whitespace-inside-tag"
    ),
    "06.09.01"
  );
  // PS. in theory error should be raised but not with this rule...
});

test(`06.10 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - multiple issues`, t => {
  const bad2 = `<aaa bbb = "  ccc = "ddd">`;
  const good2 = `<aaa bbb="" ccc="ddd">`;
  const res2 = lint(bad2);
  t.deepEqual(
    getUniqueIssueNames(res2.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-space-between-equals-and-opening-quotes",
      "tag-attribute-space-between-name-and-equals",
      "tag-excessive-whitespace-inside-tag"
    ],
    "06.10.01"
  );
  t.is(apply(bad2, res2.fix), good2, "06.10.02");
});

test(`06.11 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - excessive whitespace leading to a missing closing bracket`, t => {
  const bad1 = `<a alt="yo"   /<a>`;
  const good1 = `<a alt="yo"/><a>`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-excessive-whitespace-inside-tag", "tag-missing-closing-bracket"],
    "06.11.01"
  );
  t.is(apply(bad1, res1.fix), good1, "06.11.02");
});

// 07. rule "tag-attribute-space-between-equals-and-opening-quotes"
// -----------------------------------------------------------------------------

test(`07.01 - ${`\u001b[${34}m${`tag-attribute-space-between-equals-and-opening-quotes`}\u001b[${39}m`} - spaces between equal and double quote`, t => {
  // 1. double quote:
  const bad1 = `<aaa bbb= "ccc">`;
  const good1 = `<aaa bbb="ccc">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-space-between-equals-and-opening-quotes"],
    "07.01.01"
  );
  t.is(apply(bad1, res1.fix), good1, "07.01.02");
});

test(`07.02 - ${`\u001b[${34}m${`tag-attribute-space-between-equals-and-opening-quotes`}\u001b[${39}m`} - spaces between equal and single quote`, t => {
  // 2. single quote:
  const bad2 = `<aaa bbb= 'ccc'>`;
  const good2 = `<aaa bbb='ccc'>`;
  const res2 = lint(bad2);
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-attribute-space-between-equals-and-opening-quotes"],
    "07.02.01"
  );
  t.is(apply(bad2, res2.fix), good2, "07.02.02");
});

// 08. rule "tag-whitespace-closing-slash-and-bracket"
// -----------------------------------------------------------------------------

test(`08.01 - ${`\u001b[${36}m${`tag-whitespace-closing-slash-and-bracket`}\u001b[${39}m`} - all OK`, t => {
  // there is no whitespace or slash at all
  const good1 = `<aaa>`;
  const res1 = lint(good1);
  t.false(
    getUniqueIssueNames(res1.issues).includes(
      "tag-attribute-space-between-equals-and-opening-quotes"
    ),
    "08.01.01"
  );

  // there is no whitespace at all
  const good2 = `<aaa/>`;
  const res2 = lint(good2);
  t.false(
    getUniqueIssueNames(res2.issues).includes(
      "tag-attribute-space-between-equals-and-opening-quotes"
    ),
    "08.01.02"
  );

  // whitespace IS there but it's a different issue
  const good3 = `<aaa />`;
  const res3 = lint(good3);
  t.false(
    getUniqueIssueNames(res3.issues).includes(
      "tag-attribute-space-between-equals-and-opening-quotes"
    ),
    "08.01.03"
  );
  t.true(
    getUniqueIssueNames(res3.issues).includes(
      "tag-excessive-whitespace-inside-tag"
    ),
    "08.01.04"
  );
});

test(`08.02 - ${`\u001b[${36}m${`tag-whitespace-closing-slash-and-bracket`}\u001b[${39}m`} - spaces between equal and quote`, t => {
  // 1. single space:
  const bad1 = `<aaa/ >`;
  const good1 = `<aaa/>`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-whitespace-closing-slash-and-bracket"],
    "08.02.01"
  );
  t.is(apply(bad1, res1.fix), good1, "08.02.02");

  // 2. more whitespace:
  const bad2 = `<aaa/    \n >`;
  const good2 = `<aaa/>`;
  const res2 = lint(bad2);
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-whitespace-closing-slash-and-bracket"],
    "08.02.03"
  );
  t.is(apply(bad2, res2.fix), good2, "08.02.04");
});

// 09. rule "tag-attribute-left-double-quotation-mark"
// -----------------------------------------------------------------------------

test(`09.01 - ${`\u001b[${35}m${`tag-attribute-left-double-quotation-mark`}\u001b[${39}m`} - left double opening, double closing`, t => {
  // 1. single double quote on the right
  // const bad1 = `<aaa bbb=“ccc">`;
  const bad1 = `<aaa bbb=\u201Cccc">`;
  const good1 = `<aaa bbb="ccc">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-left-double-quotation-mark"],
    "09.01.01"
  );
  t.is(apply(bad1, res1.fix), good1, "09.01.02");
});

test(`09.02 - ${`\u001b[${35}m${`tag-attribute-left-double-quotation-mark`}\u001b[${39}m`} - left double opening, single closing`, t => {
  // 2. single straight quote on the right
  // const bad1 = `<aaa bbb=“ccc'>`;
  const bad2 = `<aaa bbb=\u201Cccc'>`;
  const good2 = `<aaa bbb="ccc">`;
  const res2 = lint(bad2);
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    [
      "tag-attribute-left-double-quotation-mark",
      "tag-attribute-mismatching-quotes-is-single"
    ],
    "09.02.01"
  );
  t.is(apply(bad2, res2.fix), good2, "09.02.02");
});

test(`09.03 - ${`\u001b[${35}m${`tag-attribute-left-double-quotation-mark`}\u001b[${39}m`} - left double opening, right double closing`, t => {
  // const bad1 = `<abc def=“ghi”>`;
  const bad1 = `<abc def=\u201Cghi\u201D>`;
  const good1 = `<abc def="ghi">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-left-double-quotation-mark",
      "tag-attribute-right-double-quotation-mark"
    ],
    "09.03.01"
  );
  t.is(apply(bad1, res1.fix), good1, "09.03.02");
});

test(`09.04 - ${`\u001b[${35}m${`tag-attribute-left-double-quotation-mark`}\u001b[${39}m`} - left double closing, normal opening`, t => {
  // const bad1 = `<aaa bbb="ccc“>`;
  const bad1 = `<aaa bbb="ccc\u201C>`;
  const good1 = `<aaa bbb="ccc">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-left-double-quotation-mark"],
    "09.04.01"
  );
  t.is(apply(bad1, res1.fix), good1, "09.04.02");
});

test(`09.05 - ${`\u001b[${35}m${`tag-attribute-left-double-quotation-mark`}\u001b[${39}m`} - both left doubles`, t => {
  // const bad1 = `<aaa bbb=“ccc“>`;
  const bad1 = `<aaa bbb=\u201Cccc\u201C>`;
  const good1 = `<aaa bbb="ccc">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-left-double-quotation-mark"],
    "09.05.01"
  );
  t.is(apply(bad1, res1.fix), good1, "09.05.02");
});

// 10. rule "tag-attribute-right-double-quotation-mark"
// -----------------------------------------------------------------------------

test(`10.01 - ${`\u001b[${33}m${`tag-attribute-right-double-quotation-mark`}\u001b[${39}m`} - right double opening, normal closing`, t => {
  // const bad1 = `<aaa bbb=“ccc">`;
  const bad1 = `<aaa bbb=\u201Dccc">`;
  const good1 = `<aaa bbb="ccc">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-right-double-quotation-mark"],
    "10.01.01"
  );
  t.is(apply(bad1, res1.fix), good1, "10.01.02");
});

test(`10.02 - ${`\u001b[${33}m${`tag-attribute-right-double-quotation-mark`}\u001b[${39}m`} - attribute is enclosed in curly quotation marks`, t => {
  // 1. pair:
  // const bad1 = `<aaa bbb=“ccc”>`;
  const bad1 = `<aaa bbb=\u201Cccc\u201D>`;
  const good1 = `<aaa bbb="ccc">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-left-double-quotation-mark",
      "tag-attribute-right-double-quotation-mark"
    ],
    "10.02.01"
  );
  t.is(apply(bad1, res1.fix), good1, "10.02.02");
});

test(`10.03 - ${`\u001b[${33}m${`tag-attribute-right-double-quotation-mark`}\u001b[${39}m`} - right double closing, normal opening`, t => {
  // const bad1 = `<aaa bbb="ccc“>`;
  const bad1 = `<aaa bbb="ccc\u201D>`;
  const good1 = `<aaa bbb="ccc">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-right-double-quotation-mark"],
    "10.03.01"
  );
  t.is(apply(bad1, res1.fix), good1, "10.03.02");
});

test(`10.04 - ${`\u001b[${33}m${`tag-attribute-right-double-quotation-mark`}\u001b[${39}m`} - both right doubles`, t => {
  // const bad1 = `<aaa bbb=“ccc“>`;
  const bad1 = `<aaa bbb=\u201Dccc\u201D>`;
  const good1 = `<aaa bbb="ccc">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-right-double-quotation-mark"],
    "10.04.01"
  );
  t.is(apply(bad1, res1.fix), good1, "10.04.02");
});

// 11. rule tag-attribute-quote-and-onwards-missing
// -----------------------------------------------------------------------------

test(`11.01 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, normal whitespace around`, t => {
  const bad = `<abc def="ghi" jkl= mno="pqr"/>`;
  const good = `<abc def="ghi" mno="pqr"/>`;
  const res = lint(bad);
  t.is(apply(bad, res.fix), good, "11.01.01");
  t.deepEqual(
    getUniqueIssueNames(res.issues),
    ["tag-attribute-quote-and-onwards-missing"],
    "11.01.02"
  );
});

test(`11.02 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, extra whitespace follows, HTML`, t => {
  const ba1 = `<abc def="ghi" jkl=  mno="pqr">`;
  const good1 = `<abc def="ghi" mno="pqr">`;
  const res1 = lint(ba1);
  t.is(apply(ba1, res1.fix), good1, "11.02.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-quote-and-onwards-missing"],
    "11.02.02"
  );
});

test(`11.03 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, extra whitespace follows, XHTML`, t => {
  const bad2 = `<abc def="ghi" jkl=  mno="pqr"/>`;
  const good2 = `<abc def="ghi" mno="pqr"/>`;
  const res2 = lint(bad2);
  t.is(apply(bad2, res2.fix), good2, "11.03.01");
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-attribute-quote-and-onwards-missing"],
    "11.03.02"
  );
});

test(`11.04 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, end of tag follows - XHTML - loose`, t => {
  const bad1 = `<abc def="ghi" jkl=  />`;
  const good1 = `<abc def="ghi"/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "11.04.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-quote-and-onwards-missing"],
    "11.04.02"
  );
});

test(`11.05 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, end of tag follows - XHTML - tight`, t => {
  const bad2 = `<abc def="ghi" jkl=/>`;
  const good2 = `<abc def="ghi"/>`;
  const res2 = lint(bad2);
  t.is(apply(bad2, res2.fix), good2, "11.05.01");
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-attribute-quote-and-onwards-missing"],
    "11.05.02"
  );
});

test(`11.06 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, end of tag follows - HTML - loose`, t => {
  const bad3 = `<abc def="ghi" jkl=  >`;
  const good3 = `<abc def="ghi">`;
  const res3 = lint(bad3);
  t.is(apply(bad3, res3.fix), good3, "11.06.01");
  t.deepEqual(
    getUniqueIssueNames(res3.issues),
    ["tag-attribute-quote-and-onwards-missing"],
    "11.06.02"
  );
});

test(`11.07 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, end of tag follows - HTML - tight`, t => {
  const bad4 = `<abc def="ghi" jkl=>`;
  const good4 = `<abc def="ghi">`;
  const res4 = lint(bad4);
  t.is(apply(bad4, res4.fix), good4, "11.07.01");
  t.deepEqual(
    getUniqueIssueNames(res4.issues),
    ["tag-attribute-quote-and-onwards-missing"],
    "11.07.02"
  );
});

test(`11.08 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, normal whitespace around - HTML`, t => {
  const ba1 = `<img ab cd=>`;
  const goo1 = `<img ab>`;
  const res1 = lint(ba1);
  t.is(apply(ba1, res1.fix), goo1, "11.08.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-quote-and-onwards-missing"],
    "11.08.02"
  );
});

test(`11.09 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, end of tag follows - XHTML`, t => {
  const bad2 = `<img ab cd=/>`;
  const good2 = `<img ab/>`;
  const res2 = lint(bad2);
  t.is(apply(bad2, res2.fix), good2, "11.09.01");
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-attribute-quote-and-onwards-missing"],
    "11.09.02"
  );
});

test(`11.10 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - excessive whitespace - XHTML`, t => {
  const bad2 = `<img ab cd=   /    >`;
  const good2 = `<img ab/>`;
  const res2 = lint(bad2);
  t.is(apply(bad2, res2.fix), good2, "11.10.01");
  t.deepEqual(
    getUniqueIssueNames(res2.issues).sort(),
    [
      "tag-attribute-quote-and-onwards-missing",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    "11.10.02"
  );
});

// 12. rule tag-attribute-mismatching-quotes-is-single
// -----------------------------------------------------------------------------

test(`12.01 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - non-empty value, no attr follows`, t => {
  const bad1 = `<aaa bbb="ccc'/>`;
  const good1 = `<aaa bbb="ccc"/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "12.01.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-mismatching-quotes-is-single"],
    "12.01.02"
  );
});

test(`12.02 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - non-empty value, other attr follows`, t => {
  const bad1 = `<aaa bbb="ccc' ddd="eee"/>`;
  const good1 = `<aaa bbb="ccc" ddd="eee"/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "12.02.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-mismatching-quotes-is-single"],
    "12.02.02"
  );
});

test(`12.03 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - non-empty value, other attr follows (no value)`, t => {
  const bad1 = `<aaa bbb="ccc' ddd/>`;
  const good1 = `<aaa bbb="ccc" ddd/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "12.03.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-mismatching-quotes-is-single"],
    "12.03.02"
  );
});

test(`12.04 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - non-empty value, other attr follows (different quotes)`, t => {
  const bad1 = `<aaa bbb="ccc' ddd='eee'/>`;
  const good1 = `<aaa bbb="ccc" ddd='eee'/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "12.04.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-mismatching-quotes-is-single"],
    "12.04.02"
  );
});

test(`12.05 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - non-empty value, opposite pair of mismatching attrs`, t => {
  const bad1 = `<aaa bbb="ccc' ddd='eee"/>`;
  const good1 = `<aaa bbb="ccc" ddd='eee'/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "12.05.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-mismatching-quotes-is-double",
      "tag-attribute-mismatching-quotes-is-single"
    ],
    "12.05.02"
  );
});

test(`12.06 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - legit single quote within double quotes`, t => {
  const good1 = `<img alt="someone's">`;
  const res1 = lint(good1);
  t.deepEqual(res1.issues, [], "12.06.01");

  const bad2 = `<img alt='single double: "'>`;
  const good2 = `<img alt='single double: &quot;'>`;
  const res2 = lint(bad2);
  t.is(apply(bad2, res2.fix), good2, "12.06.02");
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["bad-character-unencoded-double-quotes"],
    "12.06.03"
  );
});

test(`12.07 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - mismatching quotes followed by boolean attribute - HTML, minimal`, t => {
  const bad1 = `<td alt="a b' something>`;
  const good1 = `<td alt="a b" something>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "12.07.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-mismatching-quotes-is-single"],
    "12.07.02"
  );
});

test(`12.08 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - mismatching quotes followed by boolean attribute - HTML, real life #1`, t => {
  const bad1 = `<td alt="a b' something><a href="zzz">aaa</a></td>`;
  const good1 = `<td alt="a b" something><a href="zzz">aaa</a></td>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "12.08.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-mismatching-quotes-is-single"],
    "12.08.02"
  );
});

test(`12.09 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - mismatching quotes followed by boolean attribute - HTML, real life #2`, t => {
  const bad1 = `<td alt="a b' something>\n    tralala\n    <a href="zzz">aaa</a></td>`;
  const good1 = `<td alt="a b" something>\n    tralala\n    <a href="zzz">aaa</a></td>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "12.09.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-mismatching-quotes-is-single"],
    "12.09.02"
  );
});

test(`12.10 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - mismatching quotes followed by boolean attribute - XHTML`, t => {
  const bad1 = `<td alt="a b' something/>`;
  const good1 = `<td alt="a b" something/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "12.10.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-mismatching-quotes-is-single"],
    "12.10.02"
  );
});

test(`12.11 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - mismatching quotes followed by boolean attribute - XHTML, real life #1`, t => {
  const bad1 = `<td alt="a b' something><a href="zzz">aaa</a></td>`;
  const good1 = `<td alt="a b" something><a href="zzz">aaa</a></td>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "12.11.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-mismatching-quotes-is-single"],
    "12.11.02"
  );
});

test(`12.12 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - mismatching quotes followed by boolean attribute - XHTML, real life #2`, t => {
  const bad1 = `<td alt="a b' something>\n    tralala\n    <a href="zzz">aaa</a></td>`;
  const good1 = `<td alt="a b" something>\n    tralala\n    <a href="zzz">aaa</a></td>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "12.12.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-mismatching-quotes-is-single"],
    "12.12.02"
  );
});

// 13. rule "tag-attribute-left-single-quotation-mark"
// -----------------------------------------------------------------------------

test(`13.01 - ${`\u001b[${35}m${`tag-attribute-left-single-quotation-mark`}\u001b[${39}m`} - left single opening, normal closing - closing single straight quote`, t => {
  // const bad1 = `<aaa bbb=‘ccc'>`;
  const bad1 = `<aaa bbb=\u2018ccc'>`;
  const good1 = `<aaa bbb='ccc'>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "13.01.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-left-single-quotation-mark"],
    "13.01.02"
  );
});

test(`13.02 - ${`\u001b[${35}m${`tag-attribute-left-single-quotation-mark`}\u001b[${39}m`} - left single opening, normal closing - closing double straight quote`, t => {
  // const bad1 = `<aaa bbb=‘ccc">`;
  const bad1 = `<aaa bbb=\u2018ccc">`;
  const good1 = `<aaa bbb='ccc'>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "13.01.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-left-single-quotation-mark",
      "tag-attribute-mismatching-quotes-is-double"
    ],
    "13.02.02"
  );
});

test(`13.03 - ${`\u001b[${35}m${`tag-attribute-left-single-quotation-mark`}\u001b[${39}m`} - left single opening, right single closing`, t => {
  // const bad1 = `<aaa bbb=‘ccc’>`;
  const bad1 = `<aaa bbb=\u2018ccc\u2019>`;
  const good1 = `<aaa bbb='ccc'>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "13.03.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-left-single-quotation-mark",
      "tag-attribute-right-single-quotation-mark"
    ],
    "13.03.02"
  );
});

test(`13.04 - ${`\u001b[${35}m${`tag-attribute-left-single-quotation-mark`}\u001b[${39}m`} - left single closing, normal opening`, t => {
  // const bad1 = `<aaa bbb='ccc‘>`;
  const bad1 = `<aaa bbb='ccc\u2018>`;
  const good1 = `<aaa bbb='ccc'>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "13.04.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-left-single-quotation-mark"],
    "13.04.02"
  );
});

test(`13.05 - ${`\u001b[${35}m${`tag-attribute-left-single-quotation-mark`}\u001b[${39}m`} - both left single quotes`, t => {
  // const bad1 = `<aaa bbb=‘ccc‘>`;
  const bad1 = `<aaa bbb=\u2018ccc\u2018>`;
  const good1 = `<aaa bbb='ccc'>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "13.05.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-left-single-quotation-mark"],
    "13.05.02"
  );
});

// 14. rule "tag-attribute-right-single-quotation-mark"
// -----------------------------------------------------------------------------

test(`14.01 - ${`\u001b[${33}m${`tag-attribute-right-single-quotation-mark`}\u001b[${39}m`} - right single opening, normal closing`, t => {
  // const bad1 = `<aaa bbb=’ccc'>`;
  const bad1 = `<aaa bbb=\u2019ccc'>`;
  const good1 = `<aaa bbb='ccc'>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "14.01.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-right-single-quotation-mark"],
    "14.01.02"
  );
});

test(`14.02 - ${`\u001b[${33}m${`tag-attribute-right-single-quotation-mark`}\u001b[${39}m`} - attribute is enclosed in curly quotation marks`, t => {
  // 1. pair:
  // const bad1 = `<aaa bbb=‘ccc’>`;
  const bad1 = `<aaa bbb=\u2018ccc\u2019>`;
  const good1 = `<aaa bbb='ccc'>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "14.02.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-left-single-quotation-mark",
      "tag-attribute-right-single-quotation-mark"
    ],
    "14.02.02"
  );
});

test(`14.03 - ${`\u001b[${33}m${`tag-attribute-right-single-quotation-mark`}\u001b[${39}m`} - right single closing, normal opening`, t => {
  // const bad1 = `<aaa bbb='ccc’>`;
  const bad1 = `<aaa bbb='ccc\u2019>`;
  const good1 = `<aaa bbb='ccc'>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "14.03.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-right-single-quotation-mark"],
    "14.03.02"
  );
});

test(`14.04 - ${`\u001b[${33}m${`tag-attribute-right-single-quotation-mark`}\u001b[${39}m`} - both right single quotes`, t => {
  // const bad1 = `<aaa bbb=’ccc’>`;
  const bad1 = `<aaa bbb=\u2019ccc\u2019>`;
  const good1 = `<aaa bbb='ccc'>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "14.04.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-right-single-quotation-mark"],
    "14.04.02"
  );
});

// 15. rule tag-attribute-closing-quotation-mark-missing
// -----------------------------------------------------------------------------

test(`15.01 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark at a tag ending - HTML, tight`, t => {
  // HTML, tight
  const bad1 = `<zzz alt="><img alt="">`;
  const good1 = `<zzz alt=""><img alt="">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "15.01.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-closing-quotation-mark-missing"],
    "15.01.02"
  );
});

test(`15.02 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark at a tag ending - XHTML, tight`, t => {
  const bad2 = `<zzz alt="/>`;
  const good2 = `<zzz alt=""/>`;
  const res2 = lint(bad2);
  t.is(apply(bad2, res2.fix), good2, "15.02.01");
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-attribute-closing-quotation-mark-missing"],
    "15.02.02"
  );
});

test(`15.03 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark at a tag ending - HTML, loose`, t => {
  // HTML, loose
  const bad3 = `<zzz alt=" >`;
  const good3 = `<zzz alt="">`;
  const res3 = lint(bad3);
  t.is(apply(bad3, res3.fix), good3, "15.03.01");
  t.deepEqual(
    getUniqueIssueNames(res3.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag"
    ],
    "15.03.02"
  );
});

test(`15.04 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark at a tag ending - XHTML, loose`, t => {
  // XHTML, loose
  const bad4 = `<zzz alt=" / >`;
  const good4 = `<zzz alt=""/>`;
  const res4 = lint(bad4);
  t.is(apply(bad4, res4.fix), good4, "15.04.01");
  t.deepEqual(
    getUniqueIssueNames(res4.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    "15.04.02"
  );
});

test(`15.05 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark at a tag ending - XHTML, very loose`, t => {
  // XHTML, very loose
  const bad5 = `<xyz abc="  /  >`;
  const good5 = `<xyz abc=""/>`;
  const res5 = lint(bad5);
  t.is(apply(bad5, res5.fix), good5, "15.05.01");
  t.deepEqual(
    getUniqueIssueNames(res5.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    "15.05.02"
  );
});

test(`15.06 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark, tight, attrs follow`, t => {
  // HTML, tight
  const bad1 = `<xyz abc="def="ghi">`;
  const good1 = `<xyz abc="" def="ghi">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "15.06.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-missing-space-before-attribute"
    ],
    "15.06.02"
  );
});

test(`15.07 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark, spaced, attrs follow - HTML`, t => {
  // HTML, spaced
  const bad1 = `<xyz abc=" def="ghi">`;
  const good1 = `<xyz abc="" def="ghi">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "15.07.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-closing-quotation-mark-missing"],
    "15.07.02"
  );
});

test(`15.08 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark, spaced, attrs follow - HTML`, t => {
  const bad2 = `<xyz abc="  def="ghi">`;
  const good2 = `<xyz abc="" def="ghi">`;
  const res2 = lint(bad2);
  t.is(apply(bad2, res2.fix), good2, "15.08.01");
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag"
    ],
    "15.08.02"
  );
});

test(`15.09 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - sequence of two tags`, t => {
  // HTML, spaced
  const bad1 = `<abc def="><z >`;
  const good1 = `<abc def=""><z>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "15.09.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag"
    ],
    "15.09.02"
  );
});

test(`15.10 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - false positives`, t => {
  const bad1 = `<abc def=">">`;
  const good1 = `<abc def="&gt;">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "15.10.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-character-unencoded-closing-bracket"],
    "15.10.02"
  );

  const bad2 = `<abc def=">"/>`;
  const good2 = `<abc def="&gt;"/>`;
  const res2 = lint(bad2);
  t.is(apply(bad2, res2.fix), good2, "15.10.03");
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["bad-character-unencoded-closing-bracket"],
    "15.10.04"
  );

  const bad3 = `<abc def='>'>`;
  const good3 = `<abc def='&gt;'>`;
  const res3 = lint(bad3);
  t.is(apply(bad3, res3.fix), good3, "15.10.05");
  t.deepEqual(
    getUniqueIssueNames(res3.issues),
    ["bad-character-unencoded-closing-bracket"],
    "15.10.06"
  );

  const bad4 = `<abc def='>'/>`;
  const good4 = `<abc def='&gt;'/>`;
  const res4 = lint(bad4);
  t.is(apply(bad4, res4.fix), good4, "15.10.07");
  t.deepEqual(
    getUniqueIssueNames(res4.issues),
    ["bad-character-unencoded-closing-bracket"],
    "15.10.08"
  );
});

test(`15.11 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - unencoded bracket within double quotes`, t => {
  const bad1 = `<abc def=" '>' ">`;
  const good1 = `<abc def=" '&gt;' ">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "15.11.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-character-unencoded-closing-bracket"],
    "15.11.02"
  );
});

test(`15.12 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - unencoded bracket within single quotes`, t => {
  const bad2 = `<abc def=' ">" '>`;
  const good2 = `<abc def=' &quot;&gt;&quot; '>`;
  const res2 = lint(bad2);
  t.is(apply(bad2, res2.fix), good2, "15.12.01");
  t.deepEqual(
    getUniqueIssueNames(res2.issues).sort(),
    [
      "bad-character-unencoded-closing-bracket",
      "bad-character-unencoded-double-quotes"
    ],
    "15.12.02"
  );
});

test(`15.13 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - unencoded bracket within attribute - HTML`, t => {
  // HTML
  const bad1 = `<xyz def="a > b">`;
  const good1 = `<xyz def="a &gt; b">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "15.13.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-character-unencoded-closing-bracket"],
    "15.13.02"
  );
});

test(`15.14 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - unencoded bracket within attribute - XHTML`, t => {
  // XHTML
  const bad2 = `<xyz def="a > b"/>`;
  const good2 = `<xyz def="a &gt; b"/>`;
  const res2 = lint(bad2);
  t.is(apply(bad2, res2.fix), good2, "15.14.01");
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["bad-character-unencoded-closing-bracket"],
    "15.14.02"
  );
});

test(`15.15 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark at a tag ending - HTML, tight`, t => {
  // HTML, tight
  const bad1 = `<xyz abc="def><ghi jkl="">`;
  const good1 = `<xyz abc="def"><ghi jkl="">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "15.15.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-closing-quotation-mark-missing"],
    "15.15.02"
  );
});

test(`15.16 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - excessive whitespace instead of closing quotes`, t => {
  const bad1 = `<a alt="yo\n><a>`;
  const good1 = `<a alt="yo"><a>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "15.16.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-closing-quotation-mark-missing"],
    "15.16.02"
  );

  const bad2 = `<a alt='yo\n><a>`;
  const good2 = `<a alt='yo'><a>`;
  const res2 = lint(bad2);
  t.is(apply(bad2, res2.fix), good2, "15.16.03");
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-attribute-closing-quotation-mark-missing"],
    "15.16.04"
  );
});

test(`15.17 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - XHTML-style tag with slash`, t => {
  const bad1 = `<a alt="yo/><a>`;
  const good1 = `<a alt="yo"/><a>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "15.17.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-closing-quotation-mark-missing"],
    "15.17.02"
  );
});

test(`15.18 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - XHTML-style tag with space then slash instead of closing bracket`, t => {
  const bad1 = `<a alt="yo   /><a>`;
  const good1 = `<a alt="yo"/><a>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "15.18.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-closing-quotation-mark-missing"],
    "15.18.02"
  );
});

test(`15.19 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - missing closing quote, space, slash, space and closing bracket`, t => {
  const bad1 = `<a alt="yo  /  ><a>`;
  const good1 = `<a alt="yo"/><a>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "15.19.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    "15.19.02"
  );
});

// test(`15.20 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - two consecutive attributes with closing quotes missing`, t => {
//   const bad1 = `<abc def="0 ghi="1>`;
//   const good1 = `<abc def="0" ghi="1">`;
//   const res1 = lint(bad1);
//   t.is(apply(bad1, res1.fix), good1, "15.20.01");
//   t.deepEqual(
//     getUniqueIssueNames(res1.issues).sort(),
//     ["tag-attribute-closing-quotation-mark-missing"],
//     "15.20.02"
//   );
// });

// 16. rule tag-attribute-missing-equal
// -----------------------------------------------------------------------------

test(`16.01 - ${`\u001b[${32}m${`tag-attribute-missing-equal`}\u001b[${39}m`} - one tag, double quotes`, t => {
  // HTML, tight
  const bad1 = `<img alt"">`;
  const good1 = `<img alt="">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "16.01.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-missing-equal"],
    "16.01.02"
  );

  // XHTML, tight
  const bad2 = `<img alt""/>`;
  const good2 = `<img alt=""/>`;
  const res2 = lint(bad2);
  t.is(apply(bad2, res2.fix), good2, "16.01.03");
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-attribute-missing-equal"],
    "16.01.04"
  );
});

test(`16.02 - ${`\u001b[${32}m${`tag-attribute-missing-equal`}\u001b[${39}m`} - one tag, single quotes`, t => {
  // HTML, tight
  const bad1 = `<img alt''>`;
  const good1 = `<img alt=''>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "16.02.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-missing-equal"],
    "16.02.02"
  );

  // XHTML, tight
  const bad2 = `<img alt''/>`;
  const good2 = `<img alt=''/>`;
  const res2 = lint(bad2);
  t.is(apply(bad2, res2.fix), good2, "16.02.03");
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-attribute-missing-equal"],
    "16.02.04"
  );
});

test(`16.03 - ${`\u001b[${32}m${`tag-attribute-missing-equal`}\u001b[${39}m`} - combo of missing equal and mismatching quotes #1`, t => {
  // HTML, tight
  const bad1 = `<img alt'">`;
  const good1 = `<img alt=''>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "16.03.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-mismatching-quotes-is-double",
      "tag-attribute-missing-equal"
    ],
    "16.03.02"
  );

  // XHTML, tight
  const bad2 = `<img alt'"/>`;
  const good2 = `<img alt=''/>`;
  const res2 = lint(bad2);
  t.is(apply(bad2, res2.fix), good2, "16.03.03");
  t.deepEqual(
    getUniqueIssueNames(res2.issues).sort(),
    [
      "tag-attribute-mismatching-quotes-is-double",
      "tag-attribute-missing-equal"
    ],
    "16.03.04"
  );
});

test(`16.04 - ${`\u001b[${32}m${`tag-attribute-missing-equal`}\u001b[${39}m`} - combo of missing equal and mismatching quotes #2`, t => {
  const bad1 = `<img alt"" yo=something"/>`;
  const good1 = `<img alt="" yo="something"/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "16.04.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-missing-equal",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    "16.04.02"
  );
});

test(`16.05 - ${`\u001b[${32}m${`tag-attribute-missing-equal`}\u001b[${39}m`} - combo with mismatching quotes`, t => {
  // HTML, tight
  const bad1 = `<img alt"'>`;
  const good1 = `<img alt="">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "16.05.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-mismatching-quotes-is-single",
      "tag-attribute-missing-equal"
    ],
    "16.05.02"
  );
});

// 17. rule tag-attribute-opening-quotation-mark-missing
// -----------------------------------------------------------------------------

test(`17.01 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark at a tag ending - one tag`, t => {
  const bad1 = `<zzz alt=zzz">`;
  const good1 = `<zzz alt="zzz">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "17.01.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-opening-quotation-mark-missing"],
    "17.01.02"
  );
});

test(`17.02 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark at a tag ending - two tags`, t => {
  const bad1 = `<zzz alt=zzz"><img alt=yyy'>`;
  const good1 = `<zzz alt="zzz"><img alt='yyy'>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "17.02.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-opening-quotation-mark-missing"],
    "17.02.02"
  );
});

test(`17.03 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - quotes within quotes are ${`\u001b[${33}m${`double`}\u001b[${39}m`} - 1 tag #1`, t => {
  const bad1 = `<ab cd=Efg, "hij"'>`;
  const good1 = `<ab cd='Efg, &quot;hij&quot;'>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "17.03.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "bad-character-unencoded-double-quotes",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    "17.03.02"
  );
});

test(`17.04 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - quotes within quotes are ${`\u001b[${33}m${`double`}\u001b[${39}m`} - 1 tag #2`, t => {
  const bad1 = `<zzz alt=Them, "specialists" behold'>`;
  const good1 = `<zzz alt='Them, &quot;specialists&quot; behold'>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "17.04.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "bad-character-unencoded-double-quotes",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    "17.04.02"
  );
});

test(`17.05 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - quotes within quotes are ${`\u001b[${33}m${`double`}\u001b[${39}m`} - 2 tags`, t => {
  const bad1 = `<zzz alt=So, "a" > "b"'>\ntext <img>`;
  const good1 = `<zzz alt='So, &quot;a&quot; &gt; &quot;b&quot;'>\ntext <img>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "17.05.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "bad-character-unencoded-closing-bracket",
      "bad-character-unencoded-double-quotes",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    "17.05.02"
  );
});

test(`17.06 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - quotes within quotes are ${`\u001b[${33}m${`double`}\u001b[${39}m`} - 1 tag #3`, t => {
  const bad1 = `<zzz alt=Just quotes: "'>`;
  const good1 = `<zzz alt='Just quotes: &quot;'>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "17.06.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "bad-character-unencoded-double-quotes",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    "17.06.02"
  );
});

test(`17.07 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - quotes within quotes are ${`\u001b[${33}m${`double`}\u001b[${39}m`} - 1 tag #4`, t => {
  const bad1 = `<zzz alt=Just quotes " here'>`;
  const good1 = `<zzz alt='Just quotes &quot; here'>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "17.07.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "bad-character-unencoded-double-quotes",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    "17.07.02"
  );
});

test(`17.08 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - quotes within quotes are ${`\u001b[${33}m${`double`}\u001b[${39}m`} - no equal`, t => {
  // quotes but no equal
  const bad1 = `<zzz alt'So, "a" > "b"'>\ntext <img>`;
  const good1 = `<zzz alt='So, &quot;a&quot; &gt; &quot;b&quot;'>\ntext <img>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "17.08.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "bad-character-unencoded-closing-bracket",
      "bad-character-unencoded-double-quotes",
      "tag-attribute-missing-equal"
    ],
    "17.08.02"
  );
});

test(`17.09 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - quotes within quotes are ${`\u001b[${31}m${`single`}\u001b[${39}m`} - with equal`, t => {
  const bad1 = `<zzz alt=Them, 'specialists'">`;
  const good1 = `<zzz alt="Them, 'specialists'">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "17.09.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-opening-quotation-mark-missing"],
    "17.09.02"
  );
});

test(`17.10 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - quotes within quotes are ${`\u001b[${31}m${`single`}\u001b[${39}m`} - spaced out`, t => {
  const bad1 = `<zzz alt=Them, 'specialists' behold">`;
  const good1 = `<zzz alt="Them, 'specialists' behold">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "17.10.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-opening-quotation-mark-missing"],
    "17.10.02"
  );
});

test(`17.11 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - quotes within quotes are ${`\u001b[${31}m${`single`}\u001b[${39}m`} - trailing single`, t => {
  const bad1 = `<zzz alt=Just quotes: '">`;
  const good1 = `<zzz alt="Just quotes: '">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "17.11.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-opening-quotation-mark-missing"],
    "17.11.02"
  );
});

test(`17.12 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - quotes within quotes are ${`\u001b[${31}m${`single`}\u001b[${39}m`} - spaced single`, t => {
  const bad1 = `<zzz alt=Just quotes ' here">`;
  const good1 = `<zzz alt="Just quotes ' here">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "17.12.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-opening-quotation-mark-missing"],
    "17.12.02"
  );
});

test(`17.13 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - text after tag, double quotes`, t => {
  const bad1 = `<a bc=de"> fg`;
  const good1 = `<a bc="de"> fg`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "17.13.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-opening-quotation-mark-missing"],
    "17.13.02"
  );
});

test(`17.14 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - text after tag, single quotes`, t => {
  const bad1 = `<a bc=de'> fg`;
  const good1 = `<a bc='de'> fg`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "17.14.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-opening-quotation-mark-missing"],
    "17.14.02"
  );
});

// 18. rule tag-attribute-mismatching-quotes-is-double
// -----------------------------------------------------------------------------

test(`18.01 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-double`}\u001b[${39}m`} - followed by boolean attribute - HTML`, t => {
  const bad1 = `<td alt='a b" something>`;
  const good1 = `<td alt='a b' something>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "18.01.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-mismatching-quotes-is-double"],
    "18.01.02"
  );
});

test(`18.02 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-double`}\u001b[${39}m`} - followed by boolean attribute - XHTML`, t => {
  const bad1 = `<td alt='a b" something/>`;
  const good1 = `<td alt='a b' something/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "18.02.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-mismatching-quotes-is-double"],
    "18.02.02"
  );
});

test(`18.03 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-double`}\u001b[${39}m`} - followed by boolean attribute, followed by normal attribute`, t => {
  const bad1 = `<td alt='a b" cde="fgh">`;
  const good1 = `<td alt='a b' cde="fgh">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "18.03.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-mismatching-quotes-is-double"],
    "18.03.02"
  );
});

test(`18.04 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-double`}\u001b[${39}m`} - followed by boolean attribute, preceded by normal attribute`, t => {
  const bad1 = `<td cde="fgh" alt='a b">`;
  const good1 = `<td cde="fgh" alt='a b'>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "18.04.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-mismatching-quotes-is-double"],
    "18.04.02"
  );
});

test(`18.05 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-double`}\u001b[${39}m`} - followed by boolean attribute, surrounded by normal attributes`, t => {
  const bad1 = `<td cde="fgh" alt='a b" ijk="lmn">`;
  const good1 = `<td cde="fgh" alt='a b' ijk="lmn">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "18.05.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-mismatching-quotes-is-double"],
    "18.05.02"
  );
});

test(`18.06 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-double`}\u001b[${39}m`} - mix of different type mismatches separated by boolean attribute`, t => {
  const bad1 = `<td abc='d e" fgh ijk="klm'/>`;
  const good1 = `<td abc='d e' fgh ijk="klm"/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "18.06.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-mismatching-quotes-is-double",
      "tag-attribute-mismatching-quotes-is-single"
    ],
    "18.06.02"
  );
});

// 19. rule "bad-character-unencoded-closing-bracket"
// -----------------------------------------------------------------------------

test(`19.01 - ${`\u001b[${33}m${`bad-character-unencoded-closing-bracket`}\u001b[${39}m`} - minimal example`, t => {
  const bad1 = `a > b`;
  const good1 = `a &gt; b`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "19.01.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-character-unencoded-closing-bracket"],
    "19.01.02"
  );
});

test(`19.02 - ${`\u001b[${33}m${`bad-character-unencoded-closing-bracket`}\u001b[${39}m`} - more resembling real life, surrounded by tags`, t => {
  const bad1 = `<a href="yz">mn ></a>`;
  const good1 = `<a href="yz">mn &gt;</a>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "19.02.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-character-unencoded-closing-bracket"],
    "19.02.02"
  );
});

test(`19.03 - ${`\u001b[${33}m${`bad-character-unencoded-closing-bracket`}\u001b[${39}m`} - unencoded greater than character within attribute's value, tight`, t => {
  const bad1 = `<img alt=">">`;
  const good1 = `<img alt="&gt;">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "19.03.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-character-unencoded-closing-bracket"],
    "19.03.02"
  );
});

test(`19.04 - ${`\u001b[${33}m${`bad-character-unencoded-closing-bracket`}\u001b[${39}m`} - unencoded greater than character within attribute's value, spaced`, t => {
  const bad2 = `<img alt="a > b">`;
  const good2 = `<img alt="a &gt; b">`;
  const res2 = lint(bad2);
  t.is(apply(bad2, res2.fix), good2, "19.04.01");
  t.deepEqual(
    getUniqueIssueNames(res2.issues).sort(),
    ["bad-character-unencoded-closing-bracket"],
    "19.04.02"
  );
});

// 20. rule "bad-character-unencoded-opening-bracket"
// -----------------------------------------------------------------------------

test(`20.01 - ${`\u001b[${33}m${`bad-character-unencoded-opening-bracket`}\u001b[${39}m`} - no HTML`, t => {
  const bad1 = `a < b`;
  const good1 = `a &lt; b`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "20.01.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-character-unencoded-opening-bracket"],
    "20.01.02"
  );
});

test(`20.02 - ${`\u001b[${33}m${`bad-character-unencoded-opening-bracket`}\u001b[${39}m`} - more resembling real life, surrounded by tags`, t => {
  const bad1 = `<a bc="de">< gh</a>`;
  const good1 = `<a bc="de">&lt; gh</a>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "20.02.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-character-unencoded-opening-bracket"],
    "20.02.02"
  );
});

test(`20.03 - ${`\u001b[${33}m${`bad-character-unencoded-opening-bracket`}\u001b[${39}m`} - actually, an unclosed tag`, t => {
  const bad1 = `<a bc="de">< gh ij="kl" mn="op"</a>`;
  const good1 = `<a bc="de"><gh ij="kl" mn="op"></a>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "20.03.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-missing-closing-bracket", "tag-space-after-opening-bracket"],
    "20.03.02"
  );
});

// 21. rule "tag-missing-closing-bracket"
// -----------------------------------------------------------------------------

test(`21.01 - ${`\u001b[${34}m${`tag-missing-closing-bracket`}\u001b[${39}m`} - attribute with value, no bracket`, t => {
  // There must be at least one attribute with equals-quotes pattern for it to
  // be considered a tag
  const bad1 = `<a b="ccc"<d>`;
  const good1 = `<a b="ccc"><d>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "21.01.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-missing-closing-bracket"],
    "21.01.02"
  );
});

test(`21.02 - ${`\u001b[${34}m${`tag-missing-closing-bracket`}\u001b[${39}m`} - attribute without value, no bracket`, t => {
  // There must be at least one attribute with equals-quotes pattern for it to
  // be considered a tag. After that, boolean attributes can follow.
  const bad1 = `<a b="ccc" ddd<e>`;
  const good1 = `<a b="ccc" ddd><e>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "21.02.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-missing-closing-bracket"],
    "21.02.02"
  );
});

test(`21.03 - ${`\u001b[${34}m${`tag-missing-closing-bracket`}\u001b[${39}m`} - only attribute without value, no bracket`, t => {
  // if there is not at least one attribute with equal-quotes pattern, it's not
  // considered to be a tag but rather inline unencoded bracket
  const bad1 = `<a bbb<c>`;
  const good1 = `&lt;a bbb<c>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "21.03.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-character-unencoded-opening-bracket"],
    "21.03.02"
  );
});

test(`21.04 - ${`\u001b[${34}m${`tag-missing-closing-bracket`}\u001b[${39}m`} - unclosed tag, EOF, tight`, t => {
  const bad1 = `<a b="ccc"`;
  const good1 = `<a b="ccc">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "21.04.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-missing-closing-bracket"],
    "21.04.02"
  );
});

test(`21.05 - ${`\u001b[${34}m${`tag-missing-closing-bracket`}\u001b[${39}m`} - unclosed tag, EOF, loose`, t => {
  const bad1 = `<a b="ccc" \t `;
  const good1 = `<a b="ccc">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "21.05.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-character-character-tabulation", "tag-missing-closing-bracket"],
    "21.05.02"
  );
});

test(`21.06 - ${`\u001b[${34}m${`tag-missing-closing-bracket`}\u001b[${39}m`} - whitespace before added bracket`, t => {
  // There must be at least one attribute with equals-quotes pattern for it to
  // be considered a tag. After that, boolean attributes can follow.
  const bad1 = `<a b="ccc" ddd         <e>`;
  const good1 = `<a b="ccc" ddd><e>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "21.06.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-missing-closing-bracket"],
    "21.06.02"
  );
});

// 22. Both quotes missing around attributes
// -----------------------------------------------------------------------------

test(`22.01 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - one tag`, t => {
  const bad1 = `<a bcd=ef>`;
  const good1 = `<a bcd="ef">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.01.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    "22.01.02"
  );
});

test(`22.02 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - multiple tags`, t => {
  const bad1 = `<a bcd=ef ghj=kl  >`;
  const good1 = `<a bcd="ef" ghj="kl">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.02.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag"
    ],
    "22.02.02"
  );
});

test(`22.03 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - boolean attributes #1`, t => {
  const bad1 = `<a bcd efg=hi>`;
  const good1 = `<a bcd efg="hi">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.03.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    "22.03.02"
  );
});

test(`22.04 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - boolean attributes #2`, t => {
  const bad4 = `<a bcd efg=hi jkl=mn   >`;
  const good4 = `<a bcd efg="hi" jkl="mn">`;
  const res4 = lint(bad4);
  t.is(apply(bad4, res4.fix), good4, "22.04.01");
  t.deepEqual(
    getUniqueIssueNames(res4.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag"
    ],
    "22.04.02"
  );
});

test(`22.05 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - boolean attributes - one unrecognised`, t => {
  const bad1 = `<a bcd=ef ghi>`;
  const good1 = `<a bcd="ef ghi">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.05.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    "22.05.02"
  );
});

test(`22.06 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - boolean attributes - one attr recognised`, t => {
  const bad1 = `<a bcd=ef nowrap>`;
  const good1 = `<a bcd="ef" nowrap>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.06.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    "22.06.02"
  );
});

test(`22.07 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - boolean attributes - many recognised, ends with overkill`, t => {
  const bad1 = `<a bcd=ef gh     nowrap     noresize    reversed   >`;
  const good1 = `<a bcd="ef gh" nowrap noresize reversed>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.07.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag"
    ],
    "22.07.02"
  );
});

test(`22.08 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - boolean attributes - many recognised, sandwitched overkill`, t => {
  const bad1 = `<a bcd=ef gh nowrap noresize reversed ghi=jkl>`;
  const good1 = `<a bcd="ef gh" nowrap noresize reversed ghi="jkl">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.08.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    "22.08.02"
  );
});

test(`22.09 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - boolean attributes #4 (XHTML)`, t => {
  const bad1 = `<a bcd=ef ghi/>`;
  const good1 = `<a bcd="ef ghi"/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.09.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    "22.09.02"
  );
});

test(`22.10 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - boolean attributes #5 (XHTML)`, t => {
  const bad1 = `<a bcd=ef ghi=jk lmn/>`;
  const good1 = `<a bcd="ef" ghi="jk lmn"/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.10.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    "22.10.02"
  );
});

test(`22.11 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - boolean attributes #6 (existing neighbour attrs)`, t => {
  const bad1 = `<a bcd=ef ghi='jk' lmn>`;
  const good1 = `<a bcd="ef" ghi='jk' lmn>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.11.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    "22.11.02"
  );
});

test(`22.12 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - boolean attributes #7 (existing neighbour attrs)`, t => {
  const bad1 = `<a bcd=ef ghi='jk'>`;
  const good1 = `<a bcd="ef" ghi='jk'>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.12.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    "22.12.02"
  );
});

test(`22.13 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - no value and quotes, followed by tag with a quote-less value - HTML - #1`, t => {
  const bad1 = `<a bcd= ef=gh>`;
  const good1 = `<a ef="gh">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.13.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-attribute-quote-and-onwards-missing"
    ],
    "22.13.02"
  );
});

test(`22.14 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - no value and quotes, followed by tag with a quote-less value - HTML - #2`, t => {
  const bad1 = `<a bcd= ef=gh><i jkl= mn=op><q rst= uv=wxyz>`;
  const good1 = `<a ef="gh"><i mn="op"><q uv="wxyz">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.14.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-attribute-quote-and-onwards-missing"
    ],
    "22.14.02"
  );
});

test(`22.15 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - no value and quotes, followed by tag with a quote-less value - messy XHTML`, t => {
  const bad1 = `<a bcd= ef=gh   /   >`;
  const good1 = `<a ef="gh"/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.15.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-attribute-quote-and-onwards-missing",
      "tag-excessive-whitespace-inside-tag",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    "22.15.02"
  );
});

test(`22.16 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - no value and quotes, followed by tag with a quote-less value - real XHTML`, t => {
  const bad1 = `<img src=abc.jpg width=123 height=456 border=0 style=display:block; alt=xyz/>`;
  const good1 = `<img src="abc.jpg" width="123" height="456" border="0" style="display:block;" alt="xyz"/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.16.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    "22.16.02"
  );
});

test(`22.17 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - combo of various issues #1-1`, t => {
  const bad1 = `<a bcd = ef ghi = jk lmn / >`;
  const good1 = `<a bcd="ef" ghi="jk lmn"/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.17.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-attribute-space-between-name-and-equals",
      "tag-excessive-whitespace-inside-tag",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    "22.17.02"
  );
});

test(`22.18 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - combo of various issues #1-2`, t => {
  //
  // notice "nowrap" is a recognised boolean attribute:
  //
  const bad1 = `<a bcd = ef ghi = jk nowrap / >`;
  const good1 = `<a bcd="ef" ghi="jk" nowrap/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.18.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-attribute-space-between-name-and-equals",
      "tag-excessive-whitespace-inside-tag",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    "22.18.02"
  );
});

test(`22.19 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - unquoted sentence #1`, t => {
  const bad1 = `<a bcd = ef ghi = Something, resembling text / >`;
  const good1 = `<a bcd="ef" ghi="Something, resembling text"/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.19.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-attribute-space-between-name-and-equals",
      "tag-excessive-whitespace-inside-tag",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    "22.19.02"
  );
});

test(`22.20 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - unquoted sentence #2`, t => {
  const bad1 = `<a bcd = ef ghi = Jkl, mno pq jkl = mno/ >`;
  const good1 = `<a bcd="ef" ghi="Jkl, mno pq" jkl="mno"/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.20.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-attribute-space-between-name-and-equals",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    "22.20.02"
  );
});

test(`22.21 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - chopped off file`, t => {
  const bad1 = `<a bcd=`;
  const good1 = `<a bcd=`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.21.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["file-missing-ending"],
    "22.21.02"
  );
});

test(`22.22 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - chopped off file + CRLF`, t => {
  const bad1 = `<a bcd=\r\n`;
  const good1 = `<a bcd=\r\n`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.22.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["file-missing-ending"],
    "22.22.02"
  );
});

test(`22.23 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - zeros`, t => {
  const bad1 = `<a bcd=0 ghj=0>`;
  const good1 = `<a bcd="0" ghj="0">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.23.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    "22.23.02"
  );
});

test(`22.24 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - sequence of tags`, t => {
  const bad1 = `<a bcd=ef ghj=kl mnop="rst uvw = xyz" nowrap abc=def>`;
  const good1 = `<a bcd="ef" ghj="kl" mnop="rst uvw = xyz" nowrap abc="def">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.24.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    "22.24.02"
  );

  // const bad2 = `<a bcd=ef ghj=kl mnop="rst uvw = xyz" nowrap abc=def>\n<b cde="fgh" ijklm=0 abc="defgh ijkl">`;
  // const good2 = `<a bcd="ef" ghj="kl" mnop="rst uvw = xyz" nowrap abc="def">\n<b cde="fgh" ijklm="0" abc="defgh ijkl">`;
  // const res2 = lint(bad2);
  // t.is(apply(bad2, res2.fix), good2, "22.24.03");
  // t.deepEqual(
  //   getUniqueIssueNames(res2.issues).sort(),
  //   [
  //     "tag-attribute-closing-quotation-mark-missing",
  //     "tag-attribute-opening-quotation-mark-missing"
  //   ],
  //   "22.24.04"
  // );
});

test(`22.25 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - closing bracket as content within unquotes attr value`, t => {
  const bad1 = `<a bcd= ef=gh > ij>`;
  const good1 = `<a ef="gh &gt; ij">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.25.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "bad-character-unencoded-closing-bracket",
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-attribute-quote-and-onwards-missing"
    ],
    "22.25.02"
  );
});

test(`22.26 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - closing bracket as content within unquotes attr value, more tags`, t => {
  const bad1 = `<a bcd= ef=gh > ij><img src=zzz alt="">`;
  const good1 = `<a ef="gh &gt; ij"><img src="zzz" alt="">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.26.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "bad-character-unencoded-closing-bracket",
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-attribute-quote-and-onwards-missing"
    ],
    "22.26.02"
  );
});

test(`22.27 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - an unencoded closing bracket is whole value`, t => {
  const bad1 = `<a bc=>><de fg=hi jk="">`;
  const good1 = `<a bc="&gt;"><de fg="hi" jk="">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.27.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "bad-character-unencoded-closing-bracket",
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    "22.27.02"
  );
});

// test(`22.28 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - attr quotes missing, value begins with unencoded bracket #1`, t => {
//   const bad1 = `<a bc= > defg>`;
//   const good1 = `<a bc="&gt; defg">`;
//   const res1 = lint(bad1);
//   t.is(apply(bad1, res1.fix), good1, "22.28.01");
//   t.deepEqual(
//     getUniqueIssueNames(res1.issues).sort(),
//     [
//       "bad-character-unencoded-closing-bracket",
//       "tag-attribute-closing-quotation-mark-missing",
//       "tag-attribute-opening-quotation-mark-missing"
//     ],
//     "22.28.02"
//   );
// });
//
// test(`22.29 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - attr quotes missing, value begins with unencoded bracket #2`, t => {
//   const bad1 = `<a bc= "> defg>`;
//   const good1 = `<a bc="&gt; defg">`;
//   const res1 = lint(bad1);
//   t.is(apply(bad1, res1.fix), good1, "22.29.01");
//   t.deepEqual(
//     getUniqueIssueNames(res1.issues).sort(),
//     [
//       "bad-character-unencoded-closing-bracket",
//       "tag-attribute-closing-quotation-mark-missing"
//     ],
//     "22.29.02"
//   );
// });

test(`22.30 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - attr quotes missing, value begins with unencoded bracket #3`, t => {
  const bad1 = `<a bc= > defg">`;
  const good1 = `<a bc="&gt; defg">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.30.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "bad-character-unencoded-closing-bracket",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    "22.30.02"
  );
});

// test(`22.31 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - attr quotes missing, value begins with unencoded bracket #4`, t => {
//   // now repeated, to ensure consistency across many tags:
//   const bad2 = `<a bc= > defg hij><k lm= > nopr stuvwxyz>`;
//   const good2 = `<a bc="> defg hij"><k lm="> nopr stuvwxyz">`;
//   const res2 = lint(bad2);
//   t.is(apply(bad2, res2.fix), good2, "22.31.01");
//   t.deepEqual(
//     getUniqueIssueNames(res2.issues).sort(),
//     [
//       "bad-character-unencoded-closing-bracket",
//       "tag-attribute-closing-quotation-mark-missing",
//       "tag-attribute-opening-quotation-mark-missing"
//     ],
//     "22.31.02"
//   );
// });

test(`22.32 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - closing bracket as content within unquoted attr value`, t => {
  const bad1 = `<a bcd= ef=gh > ij \n klmn`;
  const good1 = `<a ef="gh"> ij \n klmn`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "22.32.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-attribute-quote-and-onwards-missing",
      "tag-excessive-whitespace-inside-tag"
    ],
    "22.32.02"
  );
});

// 23. rule "tag-attribute-repeated-equal"
// -----------------------------------------------------------------------------

test(`23.01 - ${`\u001b[${36}m${`repeated equal`}\u001b[${39}m`} - one tag, one double equal`, t => {
  const bad1 = `<a bcd=="ef">`;
  const good1 = `<a bcd="ef">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "23.01.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-repeated-equal"],
    "23.01.02"
  );
});

test(`23.02 - ${`\u001b[${36}m${`repeated equal`}\u001b[${39}m`} - few equals in a sequence, no spaces`, t => {
  const bad1 = `<a bcd==="ef">`;
  const good1 = `<a bcd="ef">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "23.02.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-repeated-equal"],
    "23.02.02"
  );
});

test(`23.03 - ${`\u001b[${36}m${`repeated equal`}\u001b[${39}m`} - few spaced out equals`, t => {
  const bad1 = `<a bcd = = = "ef">`;
  const good1 = `<a bcd="ef">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "23.03.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-repeated-equal",
      "tag-attribute-space-between-equals-and-opening-quotes",
      "tag-attribute-space-between-name-and-equals"
    ],
    "23.03.02"
  );
});

test(`23.04 - ${`\u001b[${36}m${`repeated equal`}\u001b[${39}m`} - two consecutive, one spaced after`, t => {
  const bad1 = `<a bcd== ="ef">`;
  const good1 = `<a bcd="ef">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "23.04.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-attribute-repeated-equal"],
    "23.04.02"
  );
});

test(`23.05 - ${`\u001b[${36}m${`repeated equal`}\u001b[${39}m`} - excessive example`, t => {
  const bad1 = `<a bcd === == \t== =\n = 'ef'>`;
  const good1 = `<a bcd='ef'>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "23.05.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-repeated-equal",
      "tag-attribute-space-between-equals-and-opening-quotes",
      "tag-attribute-space-between-name-and-equals"
    ],
    "23.05.02"
  );
});

test(`23.06 - ${`\u001b[${36}m${`repeated equal`}\u001b[${39}m`} - few equals in a sequence, EOF`, t => {
  const bad1 = `<a bcd===\n`;
  const good1 = `<a bcd=\n`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "23.06.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["file-missing-ending", "tag-attribute-repeated-equal"],
    "23.06.02"
  );
});

// 24. rule "tag-stray-character"
// -----------------------------------------------------------------------------

test(`24.01 - ${`\u001b[${32}m${`tag-stray-character`}\u001b[${39}m`} - stray quote before attr. name`, t => {
  const bad1 = `<a "bcd="ef"/>`;
  const good1 = `<a bcd="ef"/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "24.01.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-stray-character"],
    "24.01.02"
  );
});

test(`24.02 - ${`\u001b[${32}m${`tag-stray-character`}\u001b[${39}m`} - many stray quotes before attr. name`, t => {
  const bad1 = `<a """"bcd="ef"/>`;
  const good1 = `<a bcd="ef"/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "24.02.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-stray-character"],
    "24.02.02"
  );
});

test(`24.03 - ${`\u001b[${32}m${`tag-stray-character`}\u001b[${39}m`} - stray quote instead of a space`, t => {
  const bad1 = `<a"bcd="ef"/>`;
  const good1 = `<a bcd="ef"/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "24.03.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-stray-character"],
    "24.03.02"
  );
});

test(`24.04 - ${`\u001b[${32}m${`tag-stray-character`}\u001b[${39}m`} - stray quote instead of a space`, t => {
  const bad1 = `<a"'"'"'"'bcd="ef"/>`;
  const good1 = `<a bcd="ef"/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "24.04.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-stray-character"],
    "24.04.02"
  );
});

test(`24.05 - ${`\u001b[${34}m${`tag-stray-character`}\u001b[${39}m`} - stray equal after attr. name`, t => {
  const bad1 = `<a=bcd="ef"/>`;
  const good1 = `<a bcd="ef"/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "24.05.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-stray-character"],
    "24.05.02"
  );
});

test(`24.06 - ${`\u001b[${34}m${`tag-stray-character`}\u001b[${39}m`} - stray equal and quotes after attr. name`, t => {
  const bad1 = `<a="bcd="ef"/>`;
  const good1 = `<a bcd="ef"/>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "24.06.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-stray-character"],
    "24.06.02"
  );
});

// 25. rules coming from package "string-fix-broken-named-entities"
// -----------------------------------------------------------------------------

test(`25.01 - ${`\u001b[${31}m${`string-fix-broken-named-entities`}\u001b[${39}m`} - one malformed nbsp`, t => {
  const bad1 = `<div>&nbbsp;</div><div>&nbbsp;</div>`;
  const good1 = `<div>&nbsp;</div><div>&nbsp;</div>`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "25.01.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["bad-named-html-entity-malformed-nbsp"],
    "25.01.02"
  );
});

// 26. rule "tag-missing-space-before-attribute"
// -----------------------------------------------------------------------------

test(`26.01 - ${`\u001b[${33}m${`tag-missing-space-before-attribute`}\u001b[${39}m`} - space between two attributes`, t => {
  const bad1 = `<a b="c"d="e">`;
  const good1 = `<a b="c" d="e">`;
  const res1 = lint(bad1);
  t.is(apply(bad1, res1.fix), good1, "26.01.01");
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    ["tag-missing-space-before-attribute"],
    "26.01.02"
  );
});

// 99. Util Unit tests
// -----------------------------------------------------------------------------

test(`99.01 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - no offset`, t => {
  // R1 - xhtml tag ending that follows straight away
  t.true(withinTagInnerspace(`/  >`));
  t.true(withinTagInnerspace(`/>`));
  t.true(withinTagInnerspace(`/> `));
  t.true(withinTagInnerspace(`/> \t`));

  t.true(withinTagInnerspace(` /  >`));
  t.true(withinTagInnerspace(` />`));
  t.true(withinTagInnerspace(` /> `));
  t.true(withinTagInnerspace(` /> \t`));

  t.true(withinTagInnerspace(` \n /  >`));
  t.true(withinTagInnerspace(` \n />`));
  t.true(withinTagInnerspace(` \n /> `));
  t.true(withinTagInnerspace(` \n /> \t`));
  //
  // R2 - pt1. HTML ending and there's at least one atribute with equal+quotes
  t.true(withinTagInnerspace(` z="">`));
  t.true(withinTagInnerspace(` z="'>`));
  t.true(withinTagInnerspace(` z='">`));
  t.true(withinTagInnerspace(` z=''>`));

  t.true(withinTagInnerspace(` z="  ">`));
  t.true(withinTagInnerspace(` z='  ">`));
  t.true(withinTagInnerspace(` z="  '>`));
  t.true(withinTagInnerspace(` z='  '>`));

  t.true(withinTagInnerspace(` z=" /> ">`));
  t.true(withinTagInnerspace(` z=' /> ">`));
  t.true(withinTagInnerspace(` z=" /> '>`));
  t.true(withinTagInnerspace(` z=' /> '>`));

  t.true(withinTagInnerspace(` z=""/>`));
  t.true(withinTagInnerspace(` z='"/>`));
  t.true(withinTagInnerspace(` z="'/>`));
  t.true(withinTagInnerspace(` z=''/>`));

  t.true(withinTagInnerspace(` z="  "/>`));
  t.true(withinTagInnerspace(` z='  "/>`));
  t.true(withinTagInnerspace(` z="  '/>`));
  t.true(withinTagInnerspace(` z='  '/>`));

  t.true(withinTagInnerspace(` z=" /> "/>`));
  t.true(withinTagInnerspace(` z=' /> "/>`));
  t.true(withinTagInnerspace(` z=" /> '/>`));
  t.true(withinTagInnerspace(` z=' /> '/>`));

  t.true(withinTagInnerspace(` z=""/>`));
  t.true(withinTagInnerspace(` z='"/>`));
  t.true(withinTagInnerspace(` z="'/>`));
  t.true(withinTagInnerspace(` z=''/>`));

  t.true(withinTagInnerspace(` alt=""/>`));
  t.true(withinTagInnerspace(` alt='"/>`));
  t.true(withinTagInnerspace(` alt="'/>`));
  t.true(withinTagInnerspace(` alt=''/>`));
  //
  // R2 - pt2. there can be boolean attributes, no worries:
  t.true(withinTagInnerspace(` alt="" yoyo>`));
  t.true(withinTagInnerspace(` alt='" yoyo>`));
  t.true(withinTagInnerspace(` alt="' yoyo>`));
  t.true(withinTagInnerspace(` alt='' yoyo>`));

  t.true(withinTagInnerspace(` alt="" yoyo/>`));
  t.true(withinTagInnerspace(` alt='" yoyo/>`));
  t.true(withinTagInnerspace(` alt="' yoyo/>`));
  t.true(withinTagInnerspace(` alt='' yoyo/>`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop>`));
  t.true(withinTagInnerspace(` abc='def" ghi="jkl" mnop>`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl" mnop>`));
  t.true(withinTagInnerspace(` abc='def' ghi="jkl" mnop>`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop>`));
  t.true(withinTagInnerspace(` abc='def" ghi='jkl" mnop>`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl' mnop>`));
  t.true(withinTagInnerspace(` abc='def' ghi='jkl' mnop>`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop/>`));
  t.true(withinTagInnerspace(` abc='def" ghi="jkl" mnop/>`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl" mnop/>`));
  t.true(withinTagInnerspace(` abc='def' ghi="jkl" mnop/>`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop/>`));
  t.true(withinTagInnerspace(` abc='def" ghi='jkl" mnop/>`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl' mnop/>`));
  t.true(withinTagInnerspace(` abc='def' ghi='jkl' mnop/>`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop />`));
  t.true(withinTagInnerspace(` abc='def" ghi="jkl" mnop />`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl" mnop />`));
  t.true(withinTagInnerspace(` abc='def' ghi="jkl" mnop />`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop />`));
  t.true(withinTagInnerspace(` abc='def" ghi='jkl" mnop />`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl' mnop />`));
  t.true(withinTagInnerspace(` abc='def' ghi='jkl' mnop />`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop / >`));
  t.true(withinTagInnerspace(` abc='def" ghi="jkl" mnop / >`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl" mnop / >`));
  t.true(withinTagInnerspace(` abc='def' ghi="jkl" mnop / >`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop / >`));
  t.true(withinTagInnerspace(` abc='def" ghi='jkl" mnop / >`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl' mnop / >`));
  t.true(withinTagInnerspace(` abc='def' ghi='jkl' mnop / >`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop/ >`));
  t.true(withinTagInnerspace(` abc='def" ghi="jkl" mnop/ >`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl" mnop/ >`));
  t.true(withinTagInnerspace(` abc='def' ghi="jkl" mnop/ >`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop/ >`));
  t.true(withinTagInnerspace(` abc='def" ghi='jkl" mnop/ >`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl' mnop/ >`));
  t.true(withinTagInnerspace(` abc='def' ghi='jkl' mnop/ >`));

  // R3 - pt.1 html tag ending that follows straight away, with a tag that follows
  t.true(withinTagInnerspace(` ><a>`));
  t.true(withinTagInnerspace(` ><a/>`));
  t.true(withinTagInnerspace(` ></a>`));

  t.true(withinTagInnerspace(` ><a bcd="ef">`));
  t.true(withinTagInnerspace(` ><a bcd='ef">`));
  t.true(withinTagInnerspace(` ><a bcd="ef'>`));
  t.true(withinTagInnerspace(` ><a bcd='ef'>`));

  t.true(withinTagInnerspace(` ><a bcd="ef"/>`));
  t.true(withinTagInnerspace(` ><a bcd='ef"/>`));
  t.true(withinTagInnerspace(` ><a bcd="ef'/>`));
  t.true(withinTagInnerspace(` ><a bcd='ef'/>`));

  t.true(withinTagInnerspace(` ><a bcd="ef" gh/>`));
  t.true(withinTagInnerspace(` ><a bcd='ef" gh/>`));
  t.true(withinTagInnerspace(` ><a bcd="ef' gh/>`));
  t.true(withinTagInnerspace(` ><a bcd='ef' gh/>`));

  t.true(withinTagInnerspace(` ><a bcd="ef" ghi="jkl">`));
  t.true(withinTagInnerspace(` ><a bcd="ef" ghi="jkl"/>`));
  t.true(withinTagInnerspace(` ><a bcd='ef' ghi='jkl'/>`));
  //
  // R3 - pt2. text in between
  t.true(withinTagInnerspace(` >xyz<a>`));

  t.true(withinTagInnerspace(` >img<img alt=""`));
  t.true(withinTagInnerspace(` >img<img alt='"`));
  t.true(withinTagInnerspace(` >img<img alt="'`));
  t.true(withinTagInnerspace(` >img<img alt=''`));

  t.true(withinTagInnerspace(` >xyz<a<`)); // unclosed tag "<a"
  t.true(withinTagInnerspace(` > xyz<a/>`));
  t.true(withinTagInnerspace(` >\nxyz</a>`));

  t.true(withinTagInnerspace(` >\txyz<a bcd="ef">`));
  t.true(withinTagInnerspace(` >\txyz<a bcd='ef">`));
  t.true(withinTagInnerspace(` >\txyz<a bcd="ef'>`));
  t.true(withinTagInnerspace(` >\txyz<a bcd='ef'>`));

  t.true(withinTagInnerspace(` >\n\nxyz\n<a bcd="ef"/>`));
  t.true(withinTagInnerspace(` >\n\nxyz\n<a bcd='ef"/>`));
  t.true(withinTagInnerspace(` >\n\nxyz\n<a bcd="ef'/>`));
  t.true(withinTagInnerspace(` >\n\nxyz\n<a bcd='ef'/>`));

  t.true(withinTagInnerspace(` >\nxyz\n<a bcd="ef" gh/>`));
  t.true(withinTagInnerspace(` >\nxyz\n<a bcd='ef" gh/>`));
  t.true(withinTagInnerspace(` >\nxyz\n<a bcd="ef' gh/>`));
  t.true(withinTagInnerspace(` >\nxyz\n<a bcd='ef' gh/>`));

  t.true(withinTagInnerspace(` > xyz\t<a bcd="ef" ghi="jkl">`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd='ef" ghi="jkl">`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd="ef' ghi="jkl">`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd='ef' ghi="jkl">`));

  t.true(withinTagInnerspace(` > xyz\t<a bcd="ef" ghi='jkl'/>`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd='ef" ghi="jkl'/>`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd="ef' ghi='jkl"/>`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd='ef' ghi="jkl"/>`));

  t.true(withinTagInnerspace(` > xyz\t<a bcd='ef' ghi="jkl"/>`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd="ef' ghi='jkl"/>`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd='ef" ghi="jkl'/>`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd="ef" ghi='jkl'/>`));
  //
  // R3 - pt3. various
  t.true(withinTagInnerspace(` /><a>`));

  t.true(withinTagInnerspace(` z=""><a>`));
  t.true(withinTagInnerspace(` z='"><a>`));
  t.true(withinTagInnerspace(` z="'><a>`));
  t.true(withinTagInnerspace(` z=''><a>`));
  t.true(withinTagInnerspace(` z=""/><a>`));
  t.true(withinTagInnerspace(` z='"/><a>`));
  t.true(withinTagInnerspace(` z="'/><a>`));
  t.true(withinTagInnerspace(` z=''/><a>`));

  t.true(withinTagInnerspace(` z=""><a/>`));
  t.true(withinTagInnerspace(` z='"><a/>`));
  t.true(withinTagInnerspace(` z="'><a/>`));
  t.true(withinTagInnerspace(` z=''><a/>`));
  t.true(withinTagInnerspace(` z=""/><a/>`));
  t.true(withinTagInnerspace(` z='"/><a/>`));
  t.true(withinTagInnerspace(` z="'/><a/>`));
  t.true(withinTagInnerspace(` z=''/><a/>`));

  t.true(withinTagInnerspace(` z=""><a />`));
  t.true(withinTagInnerspace(` z='"><a />`));
  t.true(withinTagInnerspace(` z="'><a />`));
  t.true(withinTagInnerspace(` z=''><a />`));
  t.true(withinTagInnerspace(` z=""/><a />`));
  t.true(withinTagInnerspace(` z='"/><a />`));
  t.true(withinTagInnerspace(` z="'/><a />`));
  t.true(withinTagInnerspace(` z=''/><a />`));

  t.true(withinTagInnerspace(` z=""><a/ >`));
  t.true(withinTagInnerspace(` z='"><a/ >`));
  t.true(withinTagInnerspace(` z="'><a/ >`));
  t.true(withinTagInnerspace(` z=''><a/ >`));
  t.true(withinTagInnerspace(` z=""/><a/ >`));
  t.true(withinTagInnerspace(` z='"/><a/ >`));
  t.true(withinTagInnerspace(` z="'/><a/ >`));
  t.true(withinTagInnerspace(` z=''/><a/ >`));

  t.true(withinTagInnerspace(` z=""><a / >`));
  t.true(withinTagInnerspace(` z='"><a / >`));
  t.true(withinTagInnerspace(` z="'><a / >`));
  t.true(withinTagInnerspace(` z=''><a / >`));
  t.true(withinTagInnerspace(` z=""/><a / >`));
  t.true(withinTagInnerspace(` z='"/><a / >`));
  t.true(withinTagInnerspace(` z="'/><a / >`));
  t.true(withinTagInnerspace(` z=''/><a / >`));

  t.true(withinTagInnerspace(` alt=""/><a>`));
  t.true(withinTagInnerspace(` alt="'/><a>`));
  t.true(withinTagInnerspace(` alt='"/><a>`));
  t.true(withinTagInnerspace(` alt=''/><a>`));

  t.true(withinTagInnerspace(` >\n   <b>`));
  t.true(withinTagInnerspace(` />\n   <b>`));

  t.true(withinTagInnerspace(` z="">\n   <b>`));
  t.true(withinTagInnerspace(` z='">\n   <b>`));
  t.true(withinTagInnerspace(` z="'>\n   <b>`));
  t.true(withinTagInnerspace(` z=''>\n   <b>`));
  t.true(withinTagInnerspace(` z=""/>\n   <b>`));
  t.true(withinTagInnerspace(` z='"/>\n   <b>`));
  t.true(withinTagInnerspace(` z="'/>\n   <b>`));
  t.true(withinTagInnerspace(` z=''/>\n   <b>`));

  t.true(withinTagInnerspace(` z="" >\n   <b>`));
  t.true(withinTagInnerspace(` z='" >\n   <b>`));
  t.true(withinTagInnerspace(` z="' >\n   <b>`));
  t.true(withinTagInnerspace(` z='' >\n   <b>`));
  t.true(withinTagInnerspace(` z="" />\n   <b>`));
  t.true(withinTagInnerspace(` z='" />\n   <b>`));
  t.true(withinTagInnerspace(` z="' />\n   <b>`));
  t.true(withinTagInnerspace(` z='' />\n   <b>`));

  t.true(withinTagInnerspace(` z="" / >\n   <b>`));
  t.true(withinTagInnerspace(` z='" / >\n   <b>`));
  t.true(withinTagInnerspace(` z="' / >\n   <b>`));
  t.true(withinTagInnerspace(` z='' / >\n   <b>`));
  t.true(withinTagInnerspace(` z="" /  >\n   <b>`));
  t.true(withinTagInnerspace(` z='" /  >\n   <b>`));
  t.true(withinTagInnerspace(` z="' /  >\n   <b>`));
  t.true(withinTagInnerspace(` z='' /  >\n   <b>`));

  t.true(withinTagInnerspace(` alt=""/>\n   <b>`));
  t.true(withinTagInnerspace(` alt='"/>\n   <b>`));
  t.true(withinTagInnerspace(` alt="'/>\n   <b>`));
  t.true(withinTagInnerspace(` alt=''/>\n   <b>`));

  t.true(withinTagInnerspace(` alt="" xyz \n/>\n   <b>`));
  t.true(withinTagInnerspace(` alt='" xyz \n/>\n   <b>`));
  t.true(withinTagInnerspace(` alt="' xyz \n/>\n   <b>`));
  t.true(withinTagInnerspace(` alt='' xyz \n/>\n   <b>`));

  t.true(withinTagInnerspace(` alt="" xyz \n/ >\n   <b>`));
  t.true(withinTagInnerspace(` alt='" xyz \n/ >\n   <b>`));
  t.true(withinTagInnerspace(` alt="' xyz \n/ >\n   <b>`));
  t.true(withinTagInnerspace(` alt='' xyz \n/ >\n   <b>`));

  t.true(withinTagInnerspace(` alt="" xyz \n >\n   <b>`));
  t.true(withinTagInnerspace(` alt='" xyz \n >\n   <b>`));
  t.true(withinTagInnerspace(` alt="' xyz \n >\n   <b>`));
  t.true(withinTagInnerspace(` alt='' xyz \n >\n   <b>`));

  t.true(withinTagInnerspace(` alt="" klm xyz \n >\n   <b>`));
  t.true(withinTagInnerspace(` alt='" klm xyz \n >\n   <b>`));
  t.true(withinTagInnerspace(` alt="' klm xyz \n >\n   <b>`));
  t.true(withinTagInnerspace(` alt='' klm xyz \n >\n   <b>`));

  t.true(withinTagInnerspace(` alt="" klm xyz \n >\n nop  <b>`));
  t.true(withinTagInnerspace(` alt='" klm xyz \n >\n nop  <b>`));
  t.true(withinTagInnerspace(` alt="' klm xyz \n >\n nop  <b>`));
  t.true(withinTagInnerspace(` alt='' klm xyz \n >\n nop  <b>`));
  //
  // R4 - boolean attribute followed by slash followed by closing bracket
  t.true(withinTagInnerspace(` abc/>`));
  // R5 - full attribute with matching quotes:
  t.true(withinTagInnerspace(` abc="" def="">`));
  t.true(withinTagInnerspace(` abc='" def="">`));
  t.true(withinTagInnerspace(` abc="' def="">`));
  t.true(withinTagInnerspace(` abc='' def="">`));

  t.true(withinTagInnerspace(` abc="" def=""/>`));
  t.true(withinTagInnerspace(` abc='" def=""/>`));
  t.true(withinTagInnerspace(` abc="' def=""/>`));
  t.true(withinTagInnerspace(` abc='' def=""/>`));

  t.true(withinTagInnerspace(` abc="" def="" />`));
  t.true(withinTagInnerspace(` abc='" def="" />`));
  t.true(withinTagInnerspace(` abc="' def="" />`));
  t.true(withinTagInnerspace(` abc='' def="" />`));

  t.true(withinTagInnerspace(` abc="" def=""/ >`));
  t.true(withinTagInnerspace(` abc='" def=""/ >`));
  t.true(withinTagInnerspace(` abc="' def=""/ >`));
  t.true(withinTagInnerspace(` abc='' def=""/ >`));

  t.true(withinTagInnerspace(` abc="" def="" / >`));
  t.true(withinTagInnerspace(` abc='" def="" / >`));
  t.true(withinTagInnerspace(` abc="' def="" / >`));
  t.true(withinTagInnerspace(` abc='' def="" / >`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij">`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij">`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij">`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij">`));

  t.true(withinTagInnerspace(` abc="de" fgh='ij'>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij">`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij'>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij">`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij"/>`));

  t.true(withinTagInnerspace(` abc="de" fgh='ij'/>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij"/>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij'/>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij"/>`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij" />`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij" />`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij" />`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" />`));

  t.true(withinTagInnerspace(` abc="de" fgh='ij' />`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij" />`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij' />`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" />`));

  t.true(withinTagInnerspace(` abc=' def='>`));
  t.true(withinTagInnerspace(` abc=" def='>`));
  t.true(withinTagInnerspace(` abc=' def=">`));
  t.true(withinTagInnerspace(` abc=" def=">`));

  t.true(withinTagInnerspace(` abc=' def='/>`));
  t.true(withinTagInnerspace(` abc=" def='/>`));
  t.true(withinTagInnerspace(` abc=' def="/>`));
  t.true(withinTagInnerspace(` abc=" def="/>`));

  t.true(withinTagInnerspace(` abc=' def=' />`));
  t.true(withinTagInnerspace(` abc=" def=' />`));
  t.true(withinTagInnerspace(` abc=' def=" />`));
  t.true(withinTagInnerspace(` abc=" def=" />`));

  t.true(withinTagInnerspace(` abc=' def='/ >`));
  t.true(withinTagInnerspace(` abc=" def='/ >`));
  t.true(withinTagInnerspace(` abc=' def="/ >`));
  t.true(withinTagInnerspace(` abc=" def="/ >`));

  t.true(withinTagInnerspace(` abc=' def=' / >`));
  t.true(withinTagInnerspace(` abc=" def=' / >`));
  t.true(withinTagInnerspace(` abc=' def=" / >`));
  t.true(withinTagInnerspace(` abc=" def=" / >`));

  t.true(withinTagInnerspace(` abc='de' fgh='ij'>`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij'>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij'>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij'>`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij">`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij">`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij">`));
  t.true(withinTagInnerspace(` abc="de" fgh="ij">`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij">`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij">`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij'>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij'>`));

  t.true(withinTagInnerspace(` abc='de' fgh='ij'/>`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij'/>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij'/>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij'/>`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc="de" fgh="ij"/>`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij"/>`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij'/>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij'/>`));

  t.true(withinTagInnerspace(` abc='de' fgh='ij' />`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij' />`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij' />`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' />`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij" />`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij" />`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij" />`));
  t.true(withinTagInnerspace(` abc="de" fgh="ij" />`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij" />`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij" />`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij' />`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' />`));

  t.true(withinTagInnerspace(` abc='de' fgh='ij'/ >`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij'/ >`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij'/ >`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij'/ >`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij"/ >`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij"/ >`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij"/ >`));
  t.true(withinTagInnerspace(` abc="de" fgh="ij"/ >`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij" / >`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij" / >`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij' / >`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' / >`));

  t.true(withinTagInnerspace(` abc='de' fgh='ij' / >`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij' / >`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij' / >`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' / >`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij" /\n>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij" /\n>`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij" /\n>`));
  t.true(withinTagInnerspace(` abc="de" fgh="ij" /\n>`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij" /\n>`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij" /\n>`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij' /\n>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' /\n>`));

  // various
  t.true(withinTagInnerspace(` abc="de" fgh="ij" klm= >nop<r>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' klm= >nop<r>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij" klm= >nop<r>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij' klm= >nop<r>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" klm= >nop<r>`));
  t.true(withinTagInnerspace(` abc='de' fgh='ij' klm= >nop<r>`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij" klm= />nop<r>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' klm= />nop<r>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij" klm= />nop<r>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij' klm= />nop<r>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" klm= />nop<r>`));
  t.true(withinTagInnerspace(` abc='de' fgh='ij' klm= />nop<r>`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij" klm= / >nop<r>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' klm= / >nop<r>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij" klm= / >nop<r>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij' klm= / >nop<r>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" klm= / >nop<r>`));
  t.true(withinTagInnerspace(` abc='de' fgh='ij' klm= / >nop<r>`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij" klm= / >nop</r>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' klm= / >nop</r>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij" klm= / >nop</r>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij' klm= / >nop</r>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" klm= / >nop</r>`));
  t.true(withinTagInnerspace(` abc='de' fgh='ij' klm= / >nop</r>`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij" klm= / >nop<r/>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' klm= / >nop<r/>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij" klm= / >nop<r/>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij' klm= / >nop<r/>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" klm= / >nop<r/>`));
  t.true(withinTagInnerspace(` abc='de' fgh='ij' klm= / >nop<r/>`));
  // false:
  t.false(withinTagInnerspace(`tralala"/>\n   <b>`));
  t.false(withinTagInnerspace(`tralala'/>\n   <b>`));

  t.true(withinTagInnerspace(`tralala/>\n   <b>`));
  t.false(withinTagInnerspace(`= ef>`));
  t.false(withinTagInnerspace(`= ef>\n   <b>`));
  t.false(withinTagInnerspace(`= ef/>\n   <b>`));
  t.false(withinTagInnerspace(` = ef>`));
  t.false(withinTagInnerspace(` = ef>\n   <b>`));
  t.false(withinTagInnerspace(` = ef/>\n   <b>`));
  t.false(withinTagInnerspace(`=ef>`));
  t.false(withinTagInnerspace(`=ef>\n   <b>`));
  t.false(withinTagInnerspace(`=ef/>\n   <b>`));
});

test(`99.02 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - with offset`, t => {
  const source1 = `<img src="zzz.jpg" alt=" height="100" border="0" style="display:block;"/>`;
  t.true(withinTagInnerspace(source1, 24), "99.02.01");
  t.true(withinTagInnerspace(source1, 25), "99.02.02");

  const source2 = `<img src="zzz.jpg" alt=" zzz" border="0" style="display:block;" alt=""/>`;
  t.false(withinTagInnerspace(source2, 24), "99.02.03");
  t.false(withinTagInnerspace(source2, 25), "99.02.04");

  const source3 = `<img src="zzz.jpg" alt=" <--- zzz" border="0" style="display:block;" alt=""/>`;
  t.false(withinTagInnerspace(source3, 24), "99.02.05");
  t.false(withinTagInnerspace(source3, 25), "99.02.06");

  // but this is within inner tag space:
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt="border="0" style="display:block;" alt=""/>`,
      24
    ),
    "99.02.07 - missing space and closing quote"
  );
  t.true(withinTagInnerspace(`<img src="zzz.jpg" alt=">`, 24), "99.02.08");
  t.true(withinTagInnerspace(`<img src="zzz.jpg" alt="/>`, 24), "99.02.09");
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt=">\n`,
      //                       ^
      24
    ),
    "99.02.05-2"
  );
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt=">a`,
      //                       ^
      24
    ),
    "99.02.05-3"
  );
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt="><`,
      //                       ^
      24
    ),
    "99.02.05-4"
  );
  t.false(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt=">a"`,
      //                       ^
      24
    ),
    "99.02.05-3"
  );

  // nobody puts /> at the beginning of a comment! It's a positive case.
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt="/>`,
      //                       ^
      24
    ),
    "99.02.06"
  );
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt="><aaa`,
      //                       ^
      24
    ),
    "99.02.07"
  );
});

test(`99.03 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - broken code case #1`, t => {
  t.true(withinTagInnerspace(` alt= >aaa<b>`), "99.03.01");
  t.true(withinTagInnerspace(` alt= ><b>`), "99.03.02");
});

test(`99.04 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - broken code case #2`, t => {
  const code = `<td abc='d e" fgh ijk="klm'/>`;
  //  -->                    ^
  t.true(withinTagInnerspace(code, 13), "99.04");
});

test(`99.05 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - attributes without quotes follow`, t => {
  const code = `<a bcd= ef=gh>zyx<i jkl= mn=op>`;
  //  -->              ^^
  t.true(withinTagInnerspace(code, 7), "99.05.01");
  t.true(withinTagInnerspace(code, 8), "99.05.02");
});

test(`99.06 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - attributes without quotes follow`, t => {
  const code = `<a bcd = ef ghi = jk lmn / >`;
  t.true(withinTagInnerspace(code, 2), "99.06.01");
  t.false(withinTagInnerspace(code, 6), "99.06.02");
  t.false(withinTagInnerspace(code, 8), "99.06.03");
  t.true(withinTagInnerspace(code, 11), "99.06.04");
  t.false(withinTagInnerspace(code, 15), "99.06.05");
  t.false(withinTagInnerspace(code, 17), "99.06.06");
  t.true(withinTagInnerspace(code, 20), "99.06.07");
  t.true(withinTagInnerspace(code, 24), "99.06.08");
});

test(`99.07 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - attributes without quotes follow`, t => {
  const code = `<a bcd=ef ghi='jk' lmn>`;
  t.false(withinTagInnerspace(code, 6), "99.07.01");
  t.false(withinTagInnerspace(code, 7), "99.07.02");
  t.true(withinTagInnerspace(code, 9), "99.07.03");
  t.true(withinTagInnerspace(code, 10), "99.07.04");
  t.false(withinTagInnerspace(code, 13), "99.07.05");
  t.false(withinTagInnerspace(code, 14), "99.07.06");
  t.false(withinTagInnerspace(code, 15), "99.07.07");
  t.false(withinTagInnerspace(code, 17), "99.07.09");
  t.true(withinTagInnerspace(code, 18), "99.07.10");
  t.true(withinTagInnerspace(code, 19), "99.07.11");
});

test(`99.11 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`attributeOnTheRight()`}\u001b[${39}m`} - positive cases`, t => {
  t.true(!!attributeOnTheRight(`"">`), "99.11.01");
  t.true(!!attributeOnTheRight(`"" >`), "99.11.02");
  t.true(!!attributeOnTheRight(`""/>`), "99.11.03");
  t.true(!!attributeOnTheRight(`"" />`), "99.11.04");
  t.true(!!attributeOnTheRight(`"" / >`), "99.11.05");
  t.true(!!attributeOnTheRight(`""/ >`), "99.11.06");

  // ends with EOF
  t.true(!!attributeOnTheRight(`""`), "99.11.07");
  t.true(!!attributeOnTheRight(`"" `), "99.11.08");
  t.true(!!attributeOnTheRight(`"" \n`), "99.11.09");

  // attr without value follows
  t.true(!!attributeOnTheRight(`"" nowrap>`), "99.11.10");
  t.true(!!attributeOnTheRight(`"" nowrap/>`), "99.11.11");

  const s1 = `<img alt="sometext < more text = other/text" anotherTag="zzz"/><img alt="sometext < more text = other text"/>`;
  t.true(!!attributeOnTheRight(s1, 9), "99.11.12");
});

test(`99.12 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`attributeOnTheRight()`}\u001b[${39}m`} - negative cases`, t => {
  t.false(attributeOnTheRight(`" attr1 atr2><img>`), "99.12.01");
  t.false(attributeOnTheRight(`">`), "99.12.02");
  t.false(attributeOnTheRight(`"/>`), "99.12.03");
  t.false(attributeOnTheRight(`" attr=""/>`), "99.12.04");
  t.false(attributeOnTheRight(`" attr1 attr2=""/>`), "99.12.05");
  t.false(attributeOnTheRight(`" attr1 attr/>`), "99.12.06");
  t.false(attributeOnTheRight(`" attr1 attr />`), "99.12.07");

  // single quote
  t.false(attributeOnTheRight(`' attr1 atr2><img>`), "99.12.08");
  t.false(attributeOnTheRight(`'>`), "99.12.09");
  t.false(attributeOnTheRight(`'/>`), "99.12.10");
  t.false(attributeOnTheRight(`' attr=""/>`), "99.12.11");
  t.false(attributeOnTheRight(`' attr=''/>`), "99.12.12");
  t.false(attributeOnTheRight(`' attr1 attr2=""/>`), "99.12.13");
  t.false(attributeOnTheRight(`' attr1 attr2=''/>`), "99.12.14");
  t.false(attributeOnTheRight(`' attr1 attr/>`), "99.12.15");
  t.false(attributeOnTheRight(`' attr1 attr />`), "99.12.16");
});

test(`99.13 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`attributeOnTheRight()`}\u001b[${39}m`} - negative cases`, t => {
  const s1 = `<img alt="sometext < more text = other/text" anotherTag="zzz"/><img alt="sometext < more text = other text"/>`;
  t.true(!!attributeOnTheRight(s1, 9), "99.13.01");
  t.false(attributeOnTheRight(s1, 43), "99.13.02");
  t.true(!!attributeOnTheRight(s1, 56), "99.13.03");
  t.false(attributeOnTheRight(s1, 60), "99.13.04");
});

test(`99.14 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`attributeOnTheRight()`}\u001b[${39}m`} - mismatching quotes`, t => {
  // mismatching quotes, minimal example:
  const s1 = `<a b="c' d="e"/><f g="h"/>`;
  t.true(!!attributeOnTheRight(s1, 5), "99.14.01");
  t.false(attributeOnTheRight(s1, 7), "99.14.02");
  t.true(!!attributeOnTheRight(s1, 11), "99.14.03");
  t.false(attributeOnTheRight(s1, 13), "99.14.04");
  t.true(!!attributeOnTheRight(s1, 21), "99.14.05");
  t.false(attributeOnTheRight(s1, 23), "99.14.06");

  const s2 = `<img alt="sometext < more text = other/text' anotherTag="zzz"/><img alt="sometext < more text = other text"/>`;
  t.true(!!attributeOnTheRight(s2, 9), "99.14.07");
  t.false(attributeOnTheRight(s2, 43), "99.14.08");
  t.true(!!attributeOnTheRight(s2, 56), "99.14.09");
  t.false(attributeOnTheRight(s2, 60), "99.14.10");
});

test(`99.15 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`findClosingQuote()`}\u001b[${39}m`} - finds closing quote`, t => {
  const code1 = `<zzz alt=So, "a" > "b"'>\ntext <img>`;
  t.is(findClosingQuote(code1, 9), 22, "99.15.01");

  const code2 = `<zzz alt=">`;
  t.is(findClosingQuote(code2, 9), 10, "99.15.02");

  const code3 = `<zzz alt="/>`;
  t.is(findClosingQuote(code3, 9), 10, "99.15.03");

  const code4 = `<zzz alt=" />`;
  t.is(findClosingQuote(code4, 9), 10, "99.15.04");

  const code5 = `<zzz alt="><img alt="">`;
  t.is(findClosingQuote(code5, 9), 10, "99.15.05");

  const code6 = `<zzz alt="/><img alt="">`;
  t.is(findClosingQuote(code6, 9), 10, "99.15.06");

  const code7 = `<zzz alt=" /><img alt="">`;
  t.is(findClosingQuote(code7, 9), 10, "99.15.07");
});

test(`99.16 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`findClosingQuote()`}\u001b[${39}m`} - mismatching quotes in attributes`, t => {
  const code1 = `<aaa bbb="ccc' ddd="eee"/>`;
  t.is(findClosingQuote(code1, 9), 13, "99.16.01");

  const code2 = `<aaa bbb='ccc" ddd="eee"/>`;
  t.is(findClosingQuote(code2, 9), 13, "99.16.02");

  const code3 = `<aaa bbb='ccc" ddd='eee'/>`;
  t.is(findClosingQuote(code3, 9), 13, "99.16.03");
});

test(`99.17 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`findClosingQuote()`}\u001b[${39}m`} - mismatching quotes in attributes`, t => {
  const code1 = `<aaa bbb="ccc" ddd= eee="fff"/>`;
  t.is(findClosingQuote(code1, 9), 13, "99.17.01");
  t.is(findClosingQuote(code1, 25), 28, "99.17.02");
});

test(`99.18 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`findClosingQuote()`}\u001b[${39}m`} - unclosed quote`, t => {
  const code = `<zzz alt="nnn="mmm">`;
  t.is(findClosingQuote(code, 9), 10, "99.18.01");
});

test(`99.19 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`findClosingQuote()`}\u001b[${39}m`} - quotes missing`, t => {
  const code = `<a bcd=ef ghi='jk' lmn>`;
  t.is(findClosingQuote(code, 7), 9, "99.19.01");
  t.is(findClosingQuote(code, 14), 17, "99.19.02");
});

// test(`99.20 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`findClosingQuote()`}\u001b[${39}m`} - three quote-less attributes`, t => {
//   const code = `<a bcd=ef ghj=kl mno=pqrs>`;
//   t.is(findClosingQuote(code, 7), 9, "99.20.01");
//   t.is(findClosingQuote(code, 14), 16, "99.20.02");
//   t.is(findClosingQuote(code, 21), 25, "99.20.03");
// });

test(`99.40 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`tagOnTheRight()`}\u001b[${39}m`} - normal tag`, t => {
  const s1 = `<a>`;
  t.true(tagOnTheRight(s1), "99.40.01");
  t.true(tagOnTheRight(s1, 0), "99.40.02");

  const s2 = `<img>`;
  t.true(tagOnTheRight(s2), "99.40.03");
  t.true(tagOnTheRight(s2, 0), "99.40.04");

  const s3 = `<img alt="">`;
  t.true(tagOnTheRight(s3), "99.40.05");
  t.true(tagOnTheRight(s3, 0), "99.40.06");

  const s4 = `<img alt="zzz">`;
  t.true(tagOnTheRight(s4), "99.40.07");
  t.true(tagOnTheRight(s4, 0), "99.40.08");

  const s5 = `<td nowrap>`;
  t.false(tagOnTheRight(s5), "99.40.09"); // <---- false because no attributes with equal-quote found
  t.false(tagOnTheRight(s5, 0), "99.40.10");

  const s6 = `<td class="klm" nowrap>`;
  t.true(tagOnTheRight(s6), "99.40.11");
  t.true(tagOnTheRight(s6, 0), "99.40.12");

  const s7 = `<td nowrap class="klm">`;
  t.true(tagOnTheRight(s7), "99.40.13");

  const s8 = `<td nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap class="klm"`;
  t.true(tagOnTheRight(s8), "99.40.14");
});

test(`99.41 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`tagOnTheRight()`}\u001b[${39}m`} - closing tag`, t => {
  // closing tag
  const s1 = `</td>`;
  t.true(tagOnTheRight(s1), "99.41.01");
  t.true(tagOnTheRight(s1, 0), "99.41.02");

  const s2 = `</ td>`;
  t.true(tagOnTheRight(s2), "99.41.03");
  t.true(tagOnTheRight(s2, 0), "99.41.04");

  const s3 = `< / td>`;
  t.true(tagOnTheRight(s3), "99.41.05");
  t.true(tagOnTheRight(s3, 0), "99.41.06");

  const s4 = `</ td >`;
  t.true(tagOnTheRight(s4), "99.41.07");
  t.true(tagOnTheRight(s4, 0), "99.41.08");

  const s5 = `< / td >`;
  t.true(tagOnTheRight(s5), "99.41.09");
  t.true(tagOnTheRight(s5, 0), "99.41.10");
});

test(`99.42 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`tagOnTheRight()`}\u001b[${39}m`} - self-closing tag`, t => {
  const s1 = `<br/>`;
  t.true(tagOnTheRight(s1), "99.42.01");
  t.true(tagOnTheRight(s1, 0), "99.42.02");

  const s2 = `< br/>`;
  t.true(tagOnTheRight(s2), "99.42.03");
  t.true(tagOnTheRight(s2, 0), "99.42.04");

  const s3 = `<br />`;
  t.true(tagOnTheRight(s3), "99.42.05");
  t.true(tagOnTheRight(s3, 0), "99.42.06");

  const s4 = `<br/ >`;
  t.true(tagOnTheRight(s4), "99.42.07");
  t.true(tagOnTheRight(s4, 0), "99.42.08");

  const s5 = `<br / >`;
  t.true(tagOnTheRight(s5), "99.42.09");
  t.true(tagOnTheRight(s5, 0), "99.42.10");

  const s6 = `< br / >`;
  t.true(tagOnTheRight(s6), "99.42.11");
  t.true(tagOnTheRight(s6, 0), "99.42.12");
});

test(`99.43 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`tagOnTheRight()`}\u001b[${39}m`} - self-closing tag with attributes`, t => {
  const s1 = `<br class="a"/>`;
  t.true(tagOnTheRight(s1), "99.43.01");
  t.true(tagOnTheRight(s1, 0), "99.43.02");

  const s2 = `< br class="a"/>`;
  t.true(tagOnTheRight(s2), "99.43.03");
  t.true(tagOnTheRight(s2, 0), "99.43.04");

  const s3 = `<br class="a" />`;
  t.true(tagOnTheRight(s3), "99.43.05");
  t.true(tagOnTheRight(s3, 0), "99.43.06");

  const s4 = `<br class="a"/ >`;
  t.true(tagOnTheRight(s4), "99.43.07");
  t.true(tagOnTheRight(s4, 0), "99.43.08");

  const s5 = `<br class="a" / >`;
  t.true(tagOnTheRight(s5), "99.43.09");
  t.true(tagOnTheRight(s5, 0), "99.43.10");

  const s6 = `< br class="a" / >`;
  t.true(tagOnTheRight(s6), "99.43.11");
  t.true(tagOnTheRight(s6, 0), "99.43.12");

  const s7 = `< br class = "a"  id ='z' / >`;
  t.true(tagOnTheRight(s7), "99.43.13");
  t.true(tagOnTheRight(s7, 0), "99.43.14");

  const s8 = `< br class = "a'  id = "z' / >`;
  t.true(tagOnTheRight(s8), "99.43.15");
  t.true(tagOnTheRight(s8, 0), "99.43.16");
});

test(`99.44 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`tagOnTheRight()`}\u001b[${39}m`} - ad-hoc #1`, t => {
  const s1 = `<a b="ccc"<d>`;
  t.false(tagOnTheRight(s1, 6), "99.44.02");
  t.true(tagOnTheRight(s1, 10), "99.44.02");
});

test(`99.51 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`onlyTheseLeadToThat()`}\u001b[${39}m`} - not greedy - default start idx - various validators`, t => {
  function notBracket(char) {
    return char !== ">";
  }

  const s1 = `<abc alt=here're various "characters" here>`;
  t.is(
    onlyTheseLeadToThat(
      s1,
      9,
      notBracket,
      char => {
        return char === ">";
      },
      null
    ),
    42,
    "99.51.01"
  );
});

test(`99.52 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`onlyTheseLeadToThat()`}\u001b[${39}m`} - not greedy - default start idx - greedy selection`, t => {
  // we'll skip to last bracket followed by equal
  function notBracket(char) {
    return char !== ">";
  }

  const s1 = `<abc alt=a > b>blablabla<img alt="zzz">`;
  t.is(
    onlyTheseLeadToThat(
      s1,
      null,
      notBracket,
      char => {
        return char === ">";
      },
      char => {
        return char === "=";
      }
    ),
    14,
    "99.52.01"
  );
});

test(`XX.XX - ${`\u001b[${31}m${`adhoc #1`}\u001b[${39}m`} - just a closing tag`, t => {
  const good = `</a>`;
  const res = lint(good);
  t.deepEqual(getUniqueIssueNames(res.issues), [], "XX.XX");
});

test(`XX.XX - ${`\u001b[${31}m${`adhoc #2`}\u001b[${39}m`} - <script> tags`, t => {
  const good1 = `<script> a === b ' " \`     ;; ="" kkk="mmm" </zz>  z == x</script>`;
  const res1 = lint(good1);
  t.deepEqual(getUniqueIssueNames(res1.issues), [], "XX.XX");
});

test(`XX.XX - ${`\u001b[${31}m${`adhoc #3`}\u001b[${39}m`} - <script> tags`, t => {
  const bad2 = `\`<script> a === b ' " \`    z == x</script>\``;
  const good2 = `&#x60;<script> a === b ' " \`    z == x</script>&#x60;`;
  const res2 = lint(bad2);
  t.is(apply(bad2, res2.fix), good2, "24.01.01");
  t.deepEqual(
    getUniqueIssueNames(res2.issues).sort(),
    ["bad-character-grave-accent"],
    "24.01.02"
  );
});

// xx. TODO's
// -----------------------------------------------------------------------------

// todo - duplicate attribute - boolean and normal, with a value
// todo - tag-missing-closing-bracket, where there's also hanging slash but no bracket
// todo - duplicate closing bracket
// todo - duplicate slash
// todo - duplicate closing quotes
// todo - duplicate opening quotes
// todo - duplicate equal
// what if un-pushed logAttr is still available when logTag is closing?
// space missing in front of an attribute
// test.todo("same opening/closing quotes repeated twice")
// test.todo("stray-ones inside another outer quotes")
// test.todo("file-xhtml-tag-ending");
// test.todo("file-html-tag-ending");
// test.todo("file-trailing-line-break-present");
// test.todo("file-trailing-line-break-absent");
// stray letters at the end of a line, surrounded by tag one the left and EOL
// <>< ><gh="ij">< ><>

// todo - attr with quotes/value missing (equal dangling), ensure that when attribute enforcing is on, and that attribute is enforced, instead of removal, empty quotes are added for that attr. For example, imagine forcing all img to have alt. Source: <img src="zzz" alt=>. Result: <img src="zzz" alt="">. That's opposite of usual approach of removing the attribute completely.

// TODO:
// https://stackoverflow.com/a/33811648/3943954
// Escape the following characters with HTML entity encoding ...
// & --> &amp;
// < --> &lt;
// > --> &gt;
// " --> &quot;
// "...escape all characters with ASCII values less than 256"
