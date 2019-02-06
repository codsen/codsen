import test from "ava";
import { lint } from "../dist/emlint.esm";
import apply from "ranges-apply";
// import errors from "../src/errors.json";
import { withinTagInnerspace, firstOnTheRight } from "../dist/util.esm";

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

// 01. rule "tag-space-after-opening-bracket"
// -----------------------------------------------------------------------------
test(`01.00 - ${`\u001b[${35}m${`space between the tag name and opening bracket`}\u001b[${39}m`} - all fine (control)`, t => {
  t.is(lint("<table>").issues.length, 0, "01.00.01");
});

test(`01.01 - ${`\u001b[${35}m${`space between the tag name and opening bracket`}\u001b[${39}m`} - single space`, t => {
  const bad1 = "< table>";
  const bad2 = "<    table>";
  const bad3 = "< \n\n\n\t\t\t   table>";
  const good = "<table>";

  const res1 = lint(bad1);
  const res2 = lint(bad2);
  const res3 = lint(bad3);

  // there's only one issue:
  t.is(res1.issues.length, 1, "01.01.01");
  t.is(res1.issues[0].name, "tag-space-after-opening-bracket", "01.01.02");
  t.deepEqual(res1.issues[0].position, [[1, 2]], "01.01.03");

  t.is(res2.issues.length, 1, "01.01.04");
  t.is(res2.issues[0].name, "tag-space-after-opening-bracket", "01.01.05");
  t.deepEqual(res2.issues[0].position, [[1, 5]], "01.01.06");

  t.is(res3.issues.length, 4, "01.01.07");
  t.deepEqual(
    getUniqueIssueNames(res3.issues).sort(),
    ["bad-character-character-tabulation", "tag-space-after-opening-bracket"],
    "01.01.08"
  );
  t.deepEqual(res3.fix, [[1, 11]], "01.01.09");

  // fixing:
  t.is(apply(bad1, res1.fix), good, "01.01.10");
  t.is(apply(bad2, res2.fix), good, "01.01.11");
  t.is(apply(bad3, res3.fix), good, "01.01.12");
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
    getUniqueIssueNames(res1.issues),
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

test(`06.02 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - spaces between tag name and attr`, t => {
  // 1. single space between tag name and attr

  const bad1 = `<aaa  bbb="ccc" ddd="eee">`;
  const good1 = `<aaa bbb="ccc" ddd="eee">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-excessive-whitespace-inside-tag"],
    "06.02.01"
  );
  t.is(apply(bad1, res1.fix), good1, "06.02.02");

  // 2. more substantial whitespace
  const bad2 = `<aaa \n bbb="ccc" ddd="eee">`;
  const good2 = `<aaa bbb="ccc" ddd="eee">`;
  const res2 = lint(bad2);
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-excessive-whitespace-inside-tag"],
    "06.02.01"
  );
  t.is(apply(bad2, res2.fix), good2, "06.02.02");
});

test(`06.03 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - spaces between attrs`, t => {
  // 1. double space between attributes, once
  const bad1 = `<aaa bbb="ccc"  ddd="eee">`;
  const good1 = `<aaa bbb="ccc" ddd="eee">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-excessive-whitespace-inside-tag"],
    "06.03.01"
  );
  t.is(apply(bad1, res1.fix), good1, "06.03.02");

  // 2. multiple chunks, both larger
  const bad2 = `<aaa bbb="ccc"  ddd="eee"       fff="ggg">`;
  const good2 = `<aaa bbb="ccc" ddd="eee" fff="ggg">`;
  const res2 = lint(bad2);
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-excessive-whitespace-inside-tag"],
    "06.03.03"
  );
  t.is(apply(bad2, res2.fix), good2, "06.03.04");

  // 3. attribute without a value, followed by whitespace chunk:
  // attribute with no equals and value
  const bad3 = `<aaa bbb  ddd="eee">`;
  const good3 = `<aaa bbb ddd="eee">`;
  const res3 = lint(bad3);
  t.deepEqual(
    getUniqueIssueNames(res3.issues),
    ["tag-excessive-whitespace-inside-tag"],
    "06.03.05"
  );
  t.is(apply(bad3, res3.fix), good3, "06.03.06");
});

test(`06.04 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - spaces attr and closing slash`, t => {
  // 1. single space before closing slash

  const bad1 = `<aaa bbb="ccc" ddd="eee" />`;
  const good1 = `<aaa bbb="ccc" ddd="eee"/>`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-excessive-whitespace-inside-tag"],
    "06.04.01"
  );
  t.is(apply(bad1, res1.fix), good1, "06.04.02");

  // 2. multiple spaces before the closing slash

  const bad2 = `<aaa bbb="ccc" ddd="eee"    />`;
  const good2 = `<aaa bbb="ccc" ddd="eee"/>`;
  const res2 = lint(bad2);
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-excessive-whitespace-inside-tag"],
    "06.04.01"
  );
  t.is(apply(bad2, res2.fix), good2, "06.04.02");
});

test(`06.05 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - spaces attr and closing slash - fake case`, t => {
  // 1. single space before closing slash

  const bad1 = `<aaa bbb="ccc" / ddd="eee"/>`;
  //                          ^
  //   this gap will be recognised as not closing slash

  const res1 = lint(bad1);
  t.false(
    getUniqueIssueNames(res1.issues).includes(
      "tag-excessive-whitespace-inside-tag"
    ),
    "06.05.01"
  );
  // PS. in theory error should be raised but not with this rule...
});

// 07. rule "tag-attribute-space-between-equals-and-opening-quotes"
// -----------------------------------------------------------------------------

test(`07.01 - ${`\u001b[${34}m${`tag-attribute-space-between-equals-and-opening-quotes`}\u001b[${39}m`} - spaces between equal and quote`, t => {
  // 1. double quote:
  const bad1 = `<aaa bbb= "ccc">`;
  const good1 = `<aaa bbb="ccc">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-space-between-equals-and-opening-quotes"],
    "07.01.01"
  );
  t.is(apply(bad1, res1.fix), good1, "07.01.02");

  // 2. single quote:
  const bad2 = `<aaa bbb= 'ccc'>`;
  const good2 = `<aaa bbb='ccc'>`;
  const res2 = lint(bad2);
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-attribute-space-between-equals-and-opening-quotes"],
    "07.01.03"
  );
  t.is(apply(bad2, res2.fix), good2, "07.01.04");
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
    getUniqueIssueNames(res1.issues),
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

test(`09.01 - ${`\u001b[${35}m${`tag-attribute-left-double-quotation-mark`}\u001b[${39}m`} - left double opening, normal closing`, t => {
  // 1. single double quote on the right
  // const bad1 = `<aaa bbb=“ccc">`;
  const bad1 = `<aaa bbb=\u201Cccc">`;
  const good1 = `<aaa bbb="ccc">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-left-double-quotation-mark"],
    "09.01.01"
  );
  t.is(apply(bad1, res1.fix), good1, "09.01.02");

  // 2. single straight quote on the right
  // const bad1 = `<aaa bbb=“ccc'>`;
  const bad2 = `<aaa bbb=\u201Cccc">`;
  const good2 = `<aaa bbb="ccc">`;
  const res2 = lint(bad2);
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-attribute-left-double-quotation-mark"],
    "09.01.01"
  );
  t.is(apply(bad2, res2.fix), good2, "09.01.02");
});

test(`09.02 - ${`\u001b[${35}m${`tag-attribute-left-double-quotation-mark`}\u001b[${39}m`} - left double opening, right double closing`, t => {
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
    "09.02.01"
  );
  t.is(apply(bad1, res1.fix), good1, "09.02.02");
});

test(`09.03 - ${`\u001b[${35}m${`tag-attribute-left-double-quotation-mark`}\u001b[${39}m`} - left double closing, normal opening`, t => {
  // const bad1 = `<aaa bbb="ccc“>`;
  const bad1 = `<aaa bbb="ccc\u201C>`;
  const good1 = `<aaa bbb="ccc">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-left-double-quotation-mark"],
    "09.03.01"
  );
  t.is(apply(bad1, res1.fix), good1, "09.03.02");
});

test(`09.04 - ${`\u001b[${35}m${`tag-attribute-left-double-quotation-mark`}\u001b[${39}m`} - both left doubles`, t => {
  // const bad1 = `<aaa bbb=“ccc“>`;
  const bad1 = `<aaa bbb=\u201Cccc\u201C>`;
  const good1 = `<aaa bbb="ccc">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-left-double-quotation-mark"],
    "09.04.01"
  );
  t.is(apply(bad1, res1.fix), good1, "09.04.02");
});

// 10. rule "tag-attribute-right-double-quotation-mark"
// -----------------------------------------------------------------------------

test(`10.01 - ${`\u001b[${33}m${`tag-attribute-right-double-quotation-mark`}\u001b[${39}m`} - right double opening, normal closing`, t => {
  // const bad1 = `<aaa bbb=“ccc">`;
  const bad1 = `<aaa bbb=\u201Dccc">`;
  const good1 = `<aaa bbb="ccc">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
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
    getUniqueIssueNames(res1.issues),
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
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-right-double-quotation-mark"],
    "10.04.01"
  );
  t.is(apply(bad1, res1.fix), good1, "10.04.02");
});

// 11. Rule tag-attribute-quote-and-onwards-missing
// -----------------------------------------------------------------------------

test(`11.01 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, normal whitespace around`, t => {
  const bad = `<aaa bbb="ccc" ddd= eee="fff"/>`;
  const good = `<aaa bbb="ccc" eee="fff"/>`;
  const res = lint(bad);
  t.deepEqual(
    getUniqueIssueNames(res.issues),
    ["tag-attribute-quote-and-onwards-missing"],
    "11.01.01"
  );
  t.is(apply(bad, res.fix), good, "11.01.02");
});

test(`11.02 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, extra whitespace follows`, t => {
  const ba1 = `<aaa bbb="ccc" ddd=  eee="fff"/>`;
  const good1 = `<aaa bbb="ccc" eee="fff"/>`;
  const res1 = lint(ba1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-quote-and-onwards-missing"],
    "11.02.01"
  );
  t.is(apply(ba1, res1.fix), good1, "11.02.02");

  const bad2 = `<aaa bbb="ccc" ddd=  eee="fff"/>`;
  const good2 = `<aaa bbb="ccc" eee="fff"/>`;
  const res2 = lint(bad2);
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-attribute-quote-and-onwards-missing"],
    "11.02.03"
  );
  t.is(apply(bad2, res2.fix), good2, "11.02.04");
});

test(`11.03 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, end of tag follows`, t => {
  // XHTML - loose
  const bad1 = `<aaa bbb="ccc" ddd=  />`;
  const good1 = `<aaa bbb="ccc"/>`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-quote-and-onwards-missing"],
    "11.03.01"
  );
  t.is(apply(bad1, res1.fix), good1, "11.03.02");

  // XHTML - tight
  const bad2 = `<aaa bbb="ccc" ddd=/>`;
  const good2 = `<aaa bbb="ccc"/>`;
  const res2 = lint(bad2);
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-attribute-quote-and-onwards-missing"],
    "11.03.03"
  );
  t.is(apply(bad2, res2.fix), good2, "11.03.04");

  // HTML - loose
  const bad3 = `<aaa bbb="ccc" ddd=  >`;
  const good3 = `<aaa bbb="ccc">`;
  const res3 = lint(bad3);
  t.deepEqual(
    getUniqueIssueNames(res3.issues),
    ["tag-attribute-quote-and-onwards-missing"],
    "11.03.05"
  );
  t.is(apply(bad3, res3.fix), good3, "11.03.06");

  // HTML - tight
  const bad4 = `<aaa bbb="ccc" ddd=>`;
  const good4 = `<aaa bbb="ccc">`;
  const res4 = lint(bad4);
  t.deepEqual(
    getUniqueIssueNames(res4.issues),
    ["tag-attribute-quote-and-onwards-missing"],
    "11.03.07"
  );
  t.is(apply(bad4, res4.fix), good4, "11.03.08");
});

test(`11.04 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, normal whitespace around`, t => {
  // HTML
  const ba1 = `<img zz yy=>`;
  const goo1 = `<img zz>`;
  const res1 = lint(ba1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-quote-and-onwards-missing"],
    "11.04.01"
  );
  t.is(apply(ba1, res1.fix), goo1, "11.04.02");

  // XHTML
  const bad2 = `<img zz yy=/>`;
  const good2 = `<img zz/>`;
  const res2 = lint(bad2);
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-attribute-quote-and-onwards-missing"],
    "11.04.03"
  );
  t.is(apply(bad2, res2.fix), good2, "11.04.04");
});

// 12. Rule tag-attribute-mismatching-quotes-is-single
// -----------------------------------------------------------------------------

test(`12.01 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - non-empty value, no attr follows`, t => {
  const bad1 = `<aaa bbb="ccc'/>`;
  const good1 = `<aaa bbb="ccc"/>`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-mismatching-quotes-is-single"],
    "12.01.01"
  );
  t.is(apply(bad1, res1.fix), good1, "12.01.02");
});

test(`12.02 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - non-empty value, other attr follows`, t => {
  const bad1 = `<aaa bbb="ccc' ddd="eee"/>`;
  const good1 = `<aaa bbb="ccc" ddd="eee"/>`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-mismatching-quotes-is-single"],
    "12.02.01"
  );
  t.is(apply(bad1, res1.fix), good1, "12.02.02");
});

test(`12.03 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - non-empty value, other attr follows (no value)`, t => {
  const bad1 = `<aaa bbb="ccc' ddd/>`;
  const good1 = `<aaa bbb="ccc" ddd/>`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-mismatching-quotes-is-single"],
    "12.03.01"
  );
  t.is(apply(bad1, res1.fix), good1, "12.03.02");
});

test(`12.04 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - non-empty value, other attr follows (different quotes)`, t => {
  const bad1 = `<aaa bbb="ccc' ddd='eee'/>`;
  const good1 = `<aaa bbb="ccc" ddd='eee'/>`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-mismatching-quotes-is-single"],
    "12.04.01"
  );
  t.is(apply(bad1, res1.fix), good1, "12.04.02");
});

test(`12.05 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - non-empty value, opposite pair of mismatching attrs`, t => {
  const bad1 = `<aaa bbb="ccc' ddd='eee"/>`;
  const good1 = `<aaa bbb="ccc" ddd='eee'/>`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-mismatching-quotes-is-double",
      "tag-attribute-mismatching-quotes-is-single"
    ],
    "12.05.01"
  );
  t.is(apply(bad1, res1.fix), good1, "12.05.02");

  const bad2 = `<aaa bbb="ccc' ddd='eee">`;
  const good2 = `<aaa bbb="ccc" ddd='eee'>`;
  const res2 = lint(bad2);
  t.deepEqual(
    getUniqueIssueNames(res2.issues).sort(),
    [
      "tag-attribute-mismatching-quotes-is-double",
      "tag-attribute-mismatching-quotes-is-single"
    ],
    "12.05.01"
  );
  t.is(apply(bad2, res2.fix), good2, "12.05.02");
});

test(`12.04 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - legit single quote within double quotes`, t => {
  const good1 = `<img alt="someone's">`;
  const res1 = lint(good1);
  t.is(res1.issues.length, 0, "12.04.01");

  const good2 = `<img alt='single double: "'>`;
  const res2 = lint(good2);
  t.is(res2.issues.length, 0, "12.04.02");
});

// 13. rule "tag-attribute-left-single-quotation-mark"
// -----------------------------------------------------------------------------

test(`13.01 - ${`\u001b[${35}m${`tag-attribute-left-single-quotation-mark`}\u001b[${39}m`} - left single opening, normal closing`, t => {
  // 1. closing single straight quote
  // const bad1 = `<aaa bbb=‘ccc'>`;
  const bad1 = `<aaa bbb=\u2018ccc'>`;
  const good1 = `<aaa bbb='ccc'>`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-left-single-quotation-mark"],
    "13.01.01"
  );
  t.is(apply(bad1, res1.fix), good1, "13.01.02");

  // 2. closing double straight quote
  // const bad1 = `<aaa bbb=‘ccc">`;
  const bad2 = `<aaa bbb=\u2018ccc">`;
  const good2 = `<aaa bbb='ccc'>`;
  const res2 = lint(bad2);
  t.deepEqual(
    getUniqueIssueNames(res2.issues).sort(),
    [
      "tag-attribute-left-single-quotation-mark",
      "tag-attribute-mismatching-quotes-is-double"
    ],
    "13.01.03"
  );
  t.is(apply(bad2, res2.fix), good2, "13.01.04");
});

test(`13.02 - ${`\u001b[${35}m${`tag-attribute-left-single-quotation-mark`}\u001b[${39}m`} - left single opening, right single closing`, t => {
  // const bad1 = `<aaa bbb=‘ccc’>`;
  const bad1 = `<aaa bbb=\u2018ccc\u2019>`;
  const good1 = `<aaa bbb='ccc'>`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-left-single-quotation-mark",
      "tag-attribute-right-single-quotation-mark"
    ],
    "13.02.01"
  );
  t.is(apply(bad1, res1.fix), good1, "13.02.02");
});

test(`13.03 - ${`\u001b[${35}m${`tag-attribute-left-single-quotation-mark`}\u001b[${39}m`} - left single closing, normal opening`, t => {
  // const bad1 = `<aaa bbb='ccc‘>`;
  const bad1 = `<aaa bbb='ccc\u2018>`;
  const good1 = `<aaa bbb='ccc'>`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-left-single-quotation-mark"],
    "13.03.01"
  );
  t.is(apply(bad1, res1.fix), good1, "13.03.02");
});

test(`13.04 - ${`\u001b[${35}m${`tag-attribute-left-single-quotation-mark`}\u001b[${39}m`} - both left single quotes`, t => {
  // const bad1 = `<aaa bbb=‘ccc‘>`;
  const bad1 = `<aaa bbb=\u2018ccc\u2018>`;
  const good1 = `<aaa bbb='ccc'>`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-left-single-quotation-mark"],
    "13.04.01"
  );
  t.is(apply(bad1, res1.fix), good1, "13.04.02");
});

// 14. rule "tag-attribute-right-single-quotation-mark"
// -----------------------------------------------------------------------------

test(`14.01 - ${`\u001b[${33}m${`tag-attribute-right-single-quotation-mark`}\u001b[${39}m`} - right single opening, normal closing`, t => {
  // const bad1 = `<aaa bbb=’ccc'>`;
  const bad1 = `<aaa bbb=\u2019ccc'>`;
  const good1 = `<aaa bbb='ccc'>`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-right-single-quotation-mark"],
    "14.01.01"
  );
  t.is(apply(bad1, res1.fix), good1, "14.01.02");
});

test(`14.02 - ${`\u001b[${33}m${`tag-attribute-right-single-quotation-mark`}\u001b[${39}m`} - attribute is enclosed in curly quotation marks`, t => {
  // 1. pair:
  // const bad1 = `<aaa bbb=‘ccc’>`;
  const bad1 = `<aaa bbb=\u2018ccc\u2019>`;
  const good1 = `<aaa bbb='ccc'>`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-left-single-quotation-mark",
      "tag-attribute-right-single-quotation-mark"
    ],
    "14.02.01"
  );
  t.is(apply(bad1, res1.fix), good1, "14.02.02");
});

test(`14.03 - ${`\u001b[${33}m${`tag-attribute-right-single-quotation-mark`}\u001b[${39}m`} - right single closing, normal opening`, t => {
  // const bad1 = `<aaa bbb='ccc’>`;
  const bad1 = `<aaa bbb='ccc\u2019>`;
  const good1 = `<aaa bbb='ccc'>`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-right-single-quotation-mark"],
    "14.03.01"
  );
  t.is(apply(bad1, res1.fix), good1, "14.03.02");
});

test(`14.04 - ${`\u001b[${33}m${`tag-attribute-right-single-quotation-mark`}\u001b[${39}m`} - both right single quotes`, t => {
  // const bad1 = `<aaa bbb=’ccc’>`;
  const bad1 = `<aaa bbb=\u2019ccc\u2019>`;
  const good1 = `<aaa bbb='ccc'>`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-right-single-quotation-mark"],
    "14.04.01"
  );
  t.is(apply(bad1, res1.fix), good1, "14.04.02");
});

// 15. Rule tag-attribute-closing-quotation-mark-missing
// -----------------------------------------------------------------------------

test(`15.01 - ${`\u001b[${35}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark at a tag ending`, t => {
  // HTML, tight
  const bad1 = `<zzz alt="><img alt="">`;
  const good1 = `<zzz alt=""><img alt="">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-closing-quotation-mark-missing"],
    "15.01.01"
  );
  t.is(apply(bad1, res1.fix), good1, "15.01.02");

  // XHTML, tight
  const bad2 = `<zzz alt="/>`;
  const good2 = `<zzz alt=""/>`;
  const res2 = lint(bad2);
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    ["tag-attribute-closing-quotation-mark-missing"],
    "15.01.03"
  );
  t.is(apply(bad2, res2.fix), good2, "15.01.04");

  // HTML, loose
  const bad3 = `<zzz alt=" >`;
  const good3 = `<zzz alt="">`;
  const res3 = lint(bad3);
  t.deepEqual(
    getUniqueIssueNames(res3.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag"
    ],
    "15.01.05"
  );
  t.is(apply(bad3, res3.fix), good3, "15.01.06");

  // XHTML, loose
  const bad4 = `<zzz alt=" / >`;
  const good4 = `<zzz alt=""/>`;
  const res4 = lint(bad4);
  t.deepEqual(
    getUniqueIssueNames(res4.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    "15.01.07"
  );
  t.is(apply(bad4, res4.fix), good4, "15.01.08");

  // XHTML, very loose
  const bad5 = `<zzz alt="  /  >`;
  const good5 = `<zzz alt=""/>`;
  const res5 = lint(bad5);
  t.deepEqual(
    getUniqueIssueNames(res5.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    "15.01.07"
  );
  t.is(apply(bad5, res5.fix), good5, "15.01.08");
});

test(`15.02 - ${`\u001b[${35}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark, tight, attrs follow`, t => {
  // HTML, tight
  const bad1 = `<zzz alt="nnn="mmm">`;
  const good1 = `<zzz alt="" nnn="mmm">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-closing-quotation-mark-missing"],
    "15.02.01"
  );
  t.is(apply(bad1, res1.fix), good1, "15.02.02");
});

test(`15.03 - ${`\u001b[${35}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark, spaced, attrs follow`, t => {
  // HTML, spaced
  const bad1 = `<zzz alt=" nnn="mmm">`;
  const good1 = `<zzz alt="" nnn="mmm">`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues),
    ["tag-attribute-closing-quotation-mark-missing"],
    "15.03.01"
  );
  t.is(apply(bad1, res1.fix), good1, "15.03.02");

  const bad2 = `<zzz alt="  nnn="mmm">`;
  const good2 = `<zzz alt="" nnn="mmm">`;
  const res2 = lint(bad2);
  t.deepEqual(
    getUniqueIssueNames(res2.issues),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag"
    ],
    "15.03.03"
  );
  t.is(apply(bad2, res2.fix), good2, "15.03.04");
});

test(`15.04 - ${`\u001b[${35}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - sequence of two tags`, t => {
  // HTML, spaced
  const bad1 = `<img alt="><z >`;
  const good1 = `<img alt=""><z>`;
  const res1 = lint(bad1);
  t.deepEqual(
    getUniqueIssueNames(res1.issues).sort(),
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag"
    ],
    "15.04.01"
  );
  t.is(apply(bad1, res1.fix), good1, "15.04.02");
});

// 99. Util Unit tests
// -----------------------------------------------------------------------------

test(`99.01 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - no offset`, t => {
  // true:
  t.true(withinTagInnerspace(` ><zzz>`));
  t.true(withinTagInnerspace(` />`), "99.01.02");
  t.true(withinTagInnerspace(` z="">`), "99.01.03");
  t.true(withinTagInnerspace(` z=""/>`), "99.01.04");
  t.true(withinTagInnerspace(` alt=""/>`), "99.01.05");

  t.true(withinTagInnerspace(` ><b>`), "99.01.06");
  t.true(withinTagInnerspace(` /><b>`), "99.01.07");
  t.true(withinTagInnerspace(` z=""><b>`), "99.01.08");
  t.true(withinTagInnerspace(` z=""/><b>`), "99.01.09");
  t.true(withinTagInnerspace(` alt=""/><b>`), "99.01.10");

  t.true(withinTagInnerspace(` >\n   <b>`), "99.01.11");
  t.true(withinTagInnerspace(` />\n   <b>`), "99.01.12");
  t.true(withinTagInnerspace(` z="">\n   <b>`), "99.01.13");
  t.true(withinTagInnerspace(` z=""/>\n   <b>`), "99.01.14");
  t.true(withinTagInnerspace(` alt=""/>\n   <b>`), "99.01.15");

  // false:
  t.false(withinTagInnerspace(`tralala"/>\n   <b>`), "99.01.16");
});

test(`99.02 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - with offset`, t => {
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt=" height="100" border="0" style="display:block;"/>`,
      //                       ^
      24
    ),
    "99.02.01"
  );
  t.false(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt=" zzz" border="0" style="display:block;" alt=""/>`,
      //                       ^
      24
    ),
    "99.02.02"
  );
  t.false(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt=" <--- zzz" border="0" style="display:block;" alt=""/>`,
      //                       ^
      24
    ),
    "99.02.03"
  );
  // but this is within inner tag space:
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt="border="0" style="display:block;" alt=""/>`,
      //                       ^
      24
    ),
    "99.02.04"
  );
  // yet not this (nothing is after bracket so it's still a questionable case):
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt=">`,
      //                       ^
      24
    ),
    "99.02.05-1"
  );
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

test(`99.03 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`firstOnTheRight()`}\u001b[${39}m`} - all cases`, t => {
  t.false(!!firstOnTheRight(""), "99.03.01");
  t.false(!!firstOnTheRight("a"), "99.03.02");

  // zero was defaulted to, which is 'a', so to the right of it is 'b', index 1:
  t.is(firstOnTheRight("ab"), 1, "99.03.03");

  // 2nd input arg was omitted so starting index is zero, which is "a".
  // Now, to the right of it, there's a space, index 1, next non-whitespace char
  // is b which is index 2.
  t.is(firstOnTheRight("a b"), 2, "99.03.04");

  t.is(firstOnTheRight("a \n\n\nb"), 5, "99.03.05");
  t.is(firstOnTheRight("a \n\n\n\n"), null, "99.03.06");
});

// xx. TODO's
// -----------------------------------------------------------------------------

// todo - tag-attribute-must-use-single-quotes
// todo - tag-attribute-must-use-double-quotes
// todo - duplicate closing bracket
// todo - duplicate slash
// todo - duplicate closing quotes
// todo - duplicate opening quotes
// todo - duplicate equal
// todo - missing equal in attribute
// todo - missing opening quote in attribute
// what if un-pushed logAttr is still available when logTag is closing?
// space missing in front of an attribute
// test.todo("same opening/closing quotes repeated twice")
// test.todo("stray-ones inside another outer quotes")
// test.todo("file-xhtml-tag-ending");
// test.todo("file-html-tag-ending");
// test.todo("file-trailing-line-break-present");
// test.todo("file-trailing-line-break-absent");
// test.todo("tough one: <aaa bbb="  ccc="ddd">")
// test.todo("even tougher one: <aaa bbb = "  ccc = "ddd">")

// ‘something’
// 8216 - 8217
// '\u2018something\u2019'
