import test from "ava";
import { lint } from "../dist/emlint.esm";
import { c, c2, getUniqueIssueNames } from "../test-util/util";

// avaonly

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
test(`01.00 - ${`\u001b[${35}m${`space between the tag name and opening bracket`}\u001b[${39}m`} - all fine (control)`, t =>
  c("<table>", t));

test(`01.02 - ${`\u001b[${35}m${`space between the tag name and opening bracket`}\u001b[${39}m`} - single space`, t =>
  c("< table>", "<table>", "tag-space-after-opening-bracket", t));

test(`01.03 - ${`\u001b[${35}m${`space between the tag name and opening bracket`}\u001b[${39}m`} - multiple spaces`, t =>
  c("<    table>", "<table>", "tag-space-after-opening-bracket", t));

test(`01.04 - ${`\u001b[${35}m${`space between the tag name and opening bracket`}\u001b[${39}m`} - multiple spaces with tabs`, t =>
  c(
    "< \n\n\n\t\t\t   table>",
    `<table>`,
    ["bad-character-character-tabulation", "tag-space-after-opening-bracket"],
    t
  ));

// 03. rule "tag-name-lowercase"
// -----------------------------------------------------------------------------
test(`03.00 - ${`\u001b[${36}m${`tag-name-lowercase`}\u001b[${39}m`} - all fine (control)`, t =>
  c("<table>", t));

test(`03.01 - ${`\u001b[${36}m${`tag-name-lowercase`}\u001b[${39}m`} - one tag with capital letter`, t =>
  c("<Table>", "<table>", "tag-name-lowercase", t));

test(`03.02 - ${`\u001b[${36}m${`tag-name-lowercase`}\u001b[${39}m`} - few tags with capital letters`, t =>
  c("<tAbLE><tR><TD>", "<table><tr><td>", "tag-name-lowercase", t));

// 04. rule "file-wrong-type-line-ending-*"
// -----------------------------------------------------------------------------
test(`04.01 - ${`\u001b[${34}m${`file-wrong-type-line-ending-*`}\u001b[${39}m`} - consistent line endings given, no desired option set`, t => {
  // desired line endings are not defined but they are consistent
  // 1. all CR
  c("\r", t);
  c("aaaaaa\rbbbbbbbb\r\rcccccc", t);
  c("aaaaaa\rbbbbbbbb\r\rcccccc\r", t);
  // 2. all LF
  c("\n", t);
  c("aaaaaa\nbbbbbbbb\n\ncccccc", t);
  c("aaaaaa\nbbbbbbbb\n\ncccccc\n", t);
  // 3. all CRLF
  c("\r\n", t);
  c("aaa\r\nbbb\r\n\r\nccc", t);
  c("aaa\r\nbbb\r\n\r\nccc\r\n", t);
});

test(`04.02 - ${`\u001b[${34}m${`file-wrong-type-line-ending-*`}\u001b[${39}m`} - consistent line endings given, matching the desired option set`, t => {
  // desired line endings are not defined but they are consistent
  // 1. all CR
  c("\r", null, null, t, {
    style: {
      line_endings_CR_LF_CRLF: "CR"
    }
  });
  c("aaaaaa\rbbbbbbbb\r\rcccccc", null, null, t, {
    style: {
      line_endings_CR_LF_CRLF: "CR"
    }
  });
  c("aaaaaa\rbbbbbbbb\r\rcccccc\r", null, null, t, {
    style: {
      line_endings_CR_LF_CRLF: "CR"
    }
  });
  // 2. all LF
  c("\n", null, null, t, {
    style: {
      line_endings_CR_LF_CRLF: "LF"
    }
  });
  c("aaaaaa\nbbbbbbbb\n\ncccccc", null, null, t, {
    style: {
      line_endings_CR_LF_CRLF: "LF"
    }
  });
  c("aaaaaa\nbbbbbbbb\n\ncccccc\n", null, null, t, {
    style: {
      line_endings_CR_LF_CRLF: "LF"
    }
  });
  // 3. all CRLF
  c("\r\n", null, null, t, {
    style: {
      line_endings_CR_LF_CRLF: "CRLF"
    }
  });
  c("aaa\r\nbbb\r\n\r\nccc", null, null, t, {
    style: {
      line_endings_CR_LF_CRLF: "CRLF"
    }
  });
  c("aaa\r\nbbb\r\n\r\nccc\r\n", null, null, t, {
    style: {
      line_endings_CR_LF_CRLF: "CRLF"
    }
  });
});

// desired line endings are defined and are consistent, but different ending
// is required via options.
test(`04.03 - ${`\u001b[${34}m${`file-wrong-type-line-ending-*`}\u001b[${39}m`} - all ${`\u001b[${33}m${`LF`}\u001b[${39}m`}   - requesting ${`\u001b[${31}m${`CR`}\u001b[${39}m`}`, t => {
  c("\n", "\r", "file-wrong-type-line-ending-LF", t, {
    style: {
      line_endings_CR_LF_CRLF: "CR"
    }
  });

  // ================

  c(
    "aaaaaa\nbbbbbbbb\n\ncccccc",
    "aaaaaa\rbbbbbbbb\r\rcccccc",
    "file-wrong-type-line-ending-LF",
    t,
    {
      style: {
        line_endings_CR_LF_CRLF: "CR"
      }
    }
  );

  // ================

  c(
    "aaaaaa\nbbbbbbbb\n\ncccccc\n",
    "aaaaaa\rbbbbbbbb\r\rcccccc\r",
    "file-wrong-type-line-ending-LF",
    t,
    {
      style: {
        line_endings_CR_LF_CRLF: "CR"
      }
    }
  );
});

test(`04.04 - ${`\u001b[${34}m${`file-wrong-type-line-ending-*`}\u001b[${39}m`} - all ${`\u001b[${32}m${`CRLF`}\u001b[${39}m`} - requesting ${`\u001b[${31}m${`CR`}\u001b[${39}m`}`, t => {
  // desired line endings are defined and are consistent, but different ending
  // is required via options.

  c("\r\n", "\r", "file-wrong-type-line-ending-CRLF", t, {
    style: {
      line_endings_CR_LF_CRLF: "CR"
    }
  });

  // ================

  c(
    "aaa\r\nbbb\r\n\r\nccc",
    "aaa\rbbb\r\rccc",
    "file-wrong-type-line-ending-CRLF",
    t,
    {
      style: {
        line_endings_CR_LF_CRLF: "CR"
      }
    }
  );

  // ================

  c(
    "aaaaaa\r\nbbbbbbbb\r\n\r\ncccccc\r\n",
    "aaaaaa\rbbbbbbbb\r\rcccccc\r",
    "file-wrong-type-line-ending-CRLF",
    t,
    {
      style: {
        line_endings_CR_LF_CRLF: "CR"
      }
    }
  );
});

test(`04.05 - ${`\u001b[${34}m${`file-wrong-type-line-ending-*`}\u001b[${39}m`} - all ${`\u001b[${31}m${`CR`}\u001b[${39}m`}   - requesting ${`\u001b[${33}m${`LF`}\u001b[${39}m`}`, t => {
  // desired line endings are defined and are consistent, but different ending
  // is required via options.

  c("\r", "\n", "file-wrong-type-line-ending-CR", t, {
    style: {
      line_endings_CR_LF_CRLF: "LF"
    }
  });

  // ================

  c(
    "aaaaaa\rbbbbbbbb\r\rcccccc",
    "aaaaaa\nbbbbbbbb\n\ncccccc",
    "file-wrong-type-line-ending-CR",
    t,
    {
      style: {
        line_endings_CR_LF_CRLF: "LF"
      }
    }
  );

  // ================

  c(
    "aaaaaa\rbbbbbbbb\r\rcccccc\r",
    "aaaaaa\nbbbbbbbb\n\ncccccc\n",
    "file-wrong-type-line-ending-CR",
    t,
    {
      style: {
        line_endings_CR_LF_CRLF: "LF"
      }
    }
  );
});

test(`04.06 - ${`\u001b[${34}m${`file-wrong-type-line-ending-*`}\u001b[${39}m`} - all ${`\u001b[${32}m${`CRLF`}\u001b[${39}m`} - requesting ${`\u001b[${33}m${`LF`}\u001b[${39}m`}`, t => {
  // desired line endings are defined and are consistent, but different ending
  // is required via options.

  c("\r\n", "\n", "file-wrong-type-line-ending-CRLF", t, {
    style: {
      line_endings_CR_LF_CRLF: "LF"
    }
  });

  // ================

  c(
    "aaa\r\nbbb\r\n\r\nccc",
    "aaa\nbbb\n\nccc",
    "file-wrong-type-line-ending-CRLF",
    t,
    {
      style: {
        line_endings_CR_LF_CRLF: "LF"
      }
    }
  );

  // ================

  c(
    "aaaaaa\r\nbbbbbbbb\r\n\r\ncccccc\r\n",
    "aaaaaa\nbbbbbbbb\n\ncccccc\n",
    "file-wrong-type-line-ending-CRLF",
    t,
    {
      style: {
        line_endings_CR_LF_CRLF: "LF"
      }
    }
  );
});

test(`04.07 - ${`\u001b[${34}m${`file-wrong-type-line-ending-*`}\u001b[${39}m`} - all ${`\u001b[${33}m${`LF`}\u001b[${39}m`}   - requesting ${`\u001b[${32}m${`CRLF`}\u001b[${39}m`}`, t => {
  // desired line endings are defined and are consistent, but different ending
  // is required via options.

  c("\n", "\r\n", "file-wrong-type-line-ending-LF", t, {
    style: {
      line_endings_CR_LF_CRLF: "CRLF"
    }
  });

  // ================

  c(
    "aaaaaa\nbbbbbbbb\n\ncccccc",
    "aaaaaa\r\nbbbbbbbb\r\n\r\ncccccc",
    "file-wrong-type-line-ending-LF",
    t,
    {
      style: {
        line_endings_CR_LF_CRLF: "CRLF"
      }
    }
  );

  // ================

  c(
    "aaaaaa\nbbbbbbbb\n\ncccccc\n",
    "aaaaaa\r\nbbbbbbbb\r\n\r\ncccccc\r\n",
    "file-wrong-type-line-ending-LF",
    t,
    {
      style: {
        line_endings_CR_LF_CRLF: "CRLF"
      }
    }
  );
});

test(`04.08 - ${`\u001b[${34}m${`file-wrong-type-line-ending-*`}\u001b[${39}m`} - all ${`\u001b[${31}m${`CR`}\u001b[${39}m`}   - requesting ${`\u001b[${32}m${`CRLF`}\u001b[${39}m`}`, t => {
  // desired line endings are defined and are consistent, but different ending
  // is required via options.

  c("\r", "\r\n", "file-wrong-type-line-ending-CR", t, {
    style: {
      line_endings_CR_LF_CRLF: "CRLF"
    }
  });

  // ================

  c(
    "aaaaaa\rbbbbbbbb\r\rcccccc",
    "aaaaaa\r\nbbbbbbbb\r\n\r\ncccccc",
    "file-wrong-type-line-ending-CR",
    t,
    {
      style: {
        line_endings_CR_LF_CRLF: "CRLF"
      }
    }
  );

  // ================

  c(
    "aaaaaa\rbbbbbbbb\r\rcccccc\r",
    "aaaaaa\r\nbbbbbbbb\r\n\r\ncccccc\r\n",
    "file-wrong-type-line-ending-CR",
    t,
    {
      style: {
        line_endings_CR_LF_CRLF: "CRLF"
      }
    }
  );
});

test(`04.09 - ${`\u001b[${34}m${`file-wrong-type-line-ending-*`}\u001b[${39}m`} -   ${`\u001b[${36}m${`mixed`}\u001b[${39}m`}  - requesting ${`\u001b[${33}m${`LF`}\u001b[${39}m`}`, t =>
  c(
    "aaaaaa\rbbbbbbbb\n\r\nccccc\nc\r",
    "aaaaaa\nbbbbbbbb\n\nccccc\nc\n",
    ["file-wrong-type-line-ending-CR", "file-wrong-type-line-ending-CRLF"],
    t,
    {
      style: {
        line_endings_CR_LF_CRLF: "LF"
      }
    }
  ));

test(`04.10 - ${`\u001b[${33}m${`file-mixed-line-endings-file-is-*-mainly`}\u001b[${39}m`} - ${`\u001b[${34}m${`no EOL specified in opts`}\u001b[${39}m`} - ${`\u001b[${31}m${`CR`}\u001b[${39}m`} clearly prevalent`, t => {
  c(
    "aaaaaa\rbbbbbbbb\r\r\nccccc\nc\r",
    "aaaaaa\rbbbbbbbb\r\rccccc\rc\r",
    "file-mixed-line-endings-file-is-CR-mainly",
    t
  );
  c(
    "aaaaaa\rbbbbbbbb\r\r\nccccc\nc\r",
    "aaaaaa\rbbbbbbbb\r\rccccc\rc\r",
    "file-mixed-line-endings-file-is-CR-mainly",
    t,
    {
      style: undefined
    }
  );
  c(
    "aaaaaa\rbbbbbbbb\r\r\nccccc\nc\r",
    "aaaaaa\rbbbbbbbb\r\rccccc\rc\r",
    "file-mixed-line-endings-file-is-CR-mainly",
    t,
    {
      style: null
    }
  );
  c(
    "aaaaaa\rbbbbbbbb\r\r\nccccc\nc\r",
    "aaaaaa\rbbbbbbbb\r\rccccc\rc\r",
    "file-mixed-line-endings-file-is-CR-mainly",
    t,
    {}
  );
});

test(`04.11 - ${`\u001b[${33}m${`file-mixed-line-endings-file-is-*-mainly`}\u001b[${39}m`} - ${`\u001b[${34}m${`no EOL specified in opts`}\u001b[${39}m`} - ${`\u001b[${33}m${`LF`}\u001b[${39}m`} clearly prevalent`, t => {
  c(
    "aaaaaa\nbbbbbbbb\n\r\nccccc\nc\r",
    "aaaaaa\nbbbbbbbb\n\nccccc\nc\n",
    "file-mixed-line-endings-file-is-LF-mainly",
    t
  );
  c(
    "aaaaaa\nbbbbbbbb\n\r\nccccc\nc\r",
    "aaaaaa\nbbbbbbbb\n\nccccc\nc\n",
    "file-mixed-line-endings-file-is-LF-mainly",
    t,
    {
      style: undefined
    }
  );
  c(
    "aaaaaa\nbbbbbbbb\n\r\nccccc\nc\r",
    "aaaaaa\nbbbbbbbb\n\nccccc\nc\n",
    "file-mixed-line-endings-file-is-LF-mainly",
    t,
    {
      style: null
    }
  );
  c(
    "aaaaaa\nbbbbbbbb\n\r\nccccc\nc\r",
    "aaaaaa\nbbbbbbbb\n\nccccc\nc\n",
    "file-mixed-line-endings-file-is-LF-mainly",
    t,
    {}
  );
});

test(`04.12 - ${`\u001b[${33}m${`file-mixed-line-endings-file-is-*-mainly`}\u001b[${39}m`} - ${`\u001b[${34}m${`no EOL specified in opts`}\u001b[${39}m`} - ${`\u001b[${32}m${`CRLF`}\u001b[${39}m`} clearly prevalent`, t => {
  c(
    "aaaaaa\r\nbbbbbbbb\r\r\nccccc\nc\r\n",
    "aaaaaa\r\nbbbbbbbb\r\n\r\nccccc\r\nc\r\n",
    "file-mixed-line-endings-file-is-CRLF-mainly",
    t
  );
  c(
    "aaaaaa\r\nbbbbbbbb\r\r\nccccc\nc\r\n",
    "aaaaaa\r\nbbbbbbbb\r\n\r\nccccc\r\nc\r\n",
    "file-mixed-line-endings-file-is-CRLF-mainly",
    t,
    {
      style: undefined
    }
  );
  c(
    "aaaaaa\r\nbbbbbbbb\r\r\nccccc\nc\r\n",
    "aaaaaa\r\nbbbbbbbb\r\n\r\nccccc\r\nc\r\n",
    "file-mixed-line-endings-file-is-CRLF-mainly",
    t,
    {
      style: null
    }
  );
  c(
    "aaaaaa\r\nbbbbbbbb\r\r\nccccc\nc\r\n",
    "aaaaaa\r\nbbbbbbbb\r\n\r\nccccc\r\nc\r\n",
    "file-mixed-line-endings-file-is-CRLF-mainly",
    t,
    {}
  );
});

test(`04.13 - ${`\u001b[${33}m${`file-mixed-line-endings-file-is-*-mainly`}\u001b[${39}m`} - ${`\u001b[${34}m${`no EOL specified in opts`}\u001b[${39}m`} - ${`\u001b[${36}m${`same amount of each type of EOL`}\u001b[${39}m`}`, t => {
  c(
    "aaaaaa\rbbbbbbbb\r\nccccc\nc",
    "aaaaaa\nbbbbbbbb\nccccc\nc",
    "file-mixed-line-endings-file-is-LF-mainly",
    t
  );
  c(
    "aaaaaa\rbbbbbbbb\r\nccccc\nc",
    "aaaaaa\nbbbbbbbb\nccccc\nc",
    "file-mixed-line-endings-file-is-LF-mainly",
    t,
    {
      style: null
    }
  );
  c(
    "aaaaaa\rbbbbbbbb\r\nccccc\nc",
    "aaaaaa\nbbbbbbbb\nccccc\nc",
    "file-mixed-line-endings-file-is-LF-mainly",
    t,
    {
      style: undefined
    }
  );
  c(
    "aaaaaa\rbbbbbbbb\r\nccccc\nc",
    "aaaaaa\nbbbbbbbb\nccccc\nc",
    "file-mixed-line-endings-file-is-LF-mainly",
    t,
    {}
  );
});

test(`04.14 - ${`\u001b[${33}m${`file-mixed-line-endings-file-is-*-mainly`}\u001b[${39}m`} - ${`\u001b[${34}m${`no EOL specified in opts`}\u001b[${39}m`} - ${`\u001b[${31}m${`CR`}\u001b[${39}m`} & ${`\u001b[${32}m${`CRLF`}\u001b[${39}m`} are prevalent over ${`\u001b[${33}m${`LF`}\u001b[${39}m`}`, t => {
  c(
    "aaaaaa\r\r\nbbbbbbbb\r\r\nccccc\nc\r\r\n",
    "aaaaaa\r\n\r\nbbbbbbbb\r\n\r\nccccc\r\nc\r\n\r\n",
    "file-mixed-line-endings-file-is-CRLF-mainly",
    t
  );
  c(
    "aaaaaa\r\r\nbbbbbbbb\r\r\nccccc\nc\r\r\n",
    "aaaaaa\r\n\r\nbbbbbbbb\r\n\r\nccccc\r\nc\r\n\r\n",
    "file-mixed-line-endings-file-is-CRLF-mainly",
    t,
    {
      style: null
    }
  );
  c(
    "aaaaaa\r\r\nbbbbbbbb\r\r\nccccc\nc\r\r\n",
    "aaaaaa\r\n\r\nbbbbbbbb\r\n\r\nccccc\r\nc\r\n\r\n",
    "file-mixed-line-endings-file-is-CRLF-mainly",
    t,
    {
      style: undefined
    }
  );
  c(
    "aaaaaa\r\r\nbbbbbbbb\r\r\nccccc\nc\r\r\n",
    "aaaaaa\r\n\r\nbbbbbbbb\r\n\r\nccccc\r\nc\r\n\r\n",
    "file-mixed-line-endings-file-is-CRLF-mainly",
    t,
    {}
  );
});

test(`04.15 - ${`\u001b[${33}m${`file-mixed-line-endings-file-is-*-mainly`}\u001b[${39}m`} - ${`\u001b[${34}m${`no EOL specified in opts`}\u001b[${39}m`} - ${`\u001b[${33}m${`LF`}\u001b[${39}m`} && ${`\u001b[${32}m${`CRLF`}\u001b[${39}m`} are prevalent over ${`\u001b[${31}m${`CR`}\u001b[${39}m`}`, t => {
  c(
    "aaaaaa\n\r\nbbbbbbbb\n\r\nccccc\rc\n\r\n",
    "aaaaaa\n\nbbbbbbbb\n\nccccc\nc\n\n",
    "file-mixed-line-endings-file-is-LF-mainly",
    t
  );
  c(
    "aaaaaa\n\r\nbbbbbbbb\n\r\nccccc\rc\n\r\n",
    "aaaaaa\n\nbbbbbbbb\n\nccccc\nc\n\n",
    "file-mixed-line-endings-file-is-LF-mainly",
    t,
    {
      style: null
    }
  );
  c(
    "aaaaaa\n\r\nbbbbbbbb\n\r\nccccc\rc\n\r\n",
    "aaaaaa\n\nbbbbbbbb\n\nccccc\nc\n\n",
    "file-mixed-line-endings-file-is-LF-mainly",
    t,
    {
      style: undefined
    }
  );
  c(
    "aaaaaa\n\r\nbbbbbbbb\n\r\nccccc\rc\n\r\n",
    "aaaaaa\n\nbbbbbbbb\n\nccccc\nc\n\n",
    "file-mixed-line-endings-file-is-LF-mainly",
    t,
    {}
  );
});

test(`04.16 - ${`\u001b[${33}m${`file-mixed-line-endings-file-is-*-mainly`}\u001b[${39}m`} - ${`\u001b[${34}m${`no EOL specified in opts`}\u001b[${39}m`} - ${`\u001b[${33}m${`LF`}\u001b[${39}m`} && ${`\u001b[${31}m${`CR`}\u001b[${39}m`} are prevalent over ${`\u001b[${32}m${`CRLF`}\u001b[${39}m`}`, t => {
  c(
    "aaaaaa\n\rbbbbbbbb\n\rccccc\r\nc\n\r",
    "aaaaaa\n\nbbbbbbbb\n\nccccc\nc\n\n",
    "file-mixed-line-endings-file-is-LF-mainly",
    t
  );
  c(
    "aaaaaa\n\rbbbbbbbb\n\rccccc\r\nc\n\r",
    "aaaaaa\n\nbbbbbbbb\n\nccccc\nc\n\n",
    "file-mixed-line-endings-file-is-LF-mainly",
    t,
    {
      style: null
    }
  );
  c(
    "aaaaaa\n\rbbbbbbbb\n\rccccc\r\nc\n\r",
    "aaaaaa\n\nbbbbbbbb\n\nccccc\nc\n\n",
    "file-mixed-line-endings-file-is-LF-mainly",
    t,
    {
      style: undefined
    }
  );
  c(
    "aaaaaa\n\rbbbbbbbb\n\rccccc\r\nc\n\r",
    "aaaaaa\n\nbbbbbbbb\n\nccccc\nc\n\n",
    "file-mixed-line-endings-file-is-LF-mainly",
    t,
    {}
  );
});

test(`04.17 - ${`\u001b[${33}m${`file-mixed-line-endings-file-is-*-mainly`}\u001b[${39}m`} - ${`\u001b[${34}m${`no EOL specified in opts`}\u001b[${39}m`} - ${`\u001b[${36}m${`no line breaks at all`}\u001b[${39}m`}`, t => {
  c("aaaaaa", t);
  c("aaaaaa", null, null, t, {
    style: null
  });
  c("aaaaaa", null, null, t, {
    style: undefined
  });
  c("aaaaaa", null, null, t, {});
});

// 05. rule "tag-attribute-space-between-name-and-equals"
// -----------------------------------------------------------------------------

test(`05.01 - ${`\u001b[${31}m${`tag-attribute-space-between-name-and-equals`}\u001b[${39}m`} - all OK (control)`, t => {
  c("<zzz>", t);
  c(`<zzz yyy="qqq">`, t);
});

test(`05.02 - ${`\u001b[${31}m${`tag-attribute-space-between-name-and-equals`}\u001b[${39}m`} - spaces`, t => {
  // 1. single space
  c(
    `<zzz yyy ="qqq">`,
    `<zzz yyy="qqq">`,
    "tag-attribute-space-between-name-and-equals",
    t
  );

  // 2. multiple spaces
  c(
    `<zzz yyy      ="qqq">`,
    `<zzz yyy="qqq">`,
    "tag-attribute-space-between-name-and-equals",
    t
  );
});

// 06. rule "tag-excessive-whitespace-inside-tag"
// -----------------------------------------------------------------------------

test(`06.01 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - control, no excessive gaps`, t => {
  c(`<aaa bbb="ccc" ddd="eee">`, t);
  c(`<aaa bbb="ccc" ddd="eee"/>`, t);
});

test(`06.02 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - single space between tag name and attr`, t =>
  c(
    `<aaa  bbb="ccc" ddd="eee">`,
    `<aaa bbb="ccc" ddd="eee">`,
    "tag-excessive-whitespace-inside-tag",
    t
  ));

test(`06.03 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - more substantial whitespace`, t =>
  c(
    `<aaa \n bbb="ccc" ddd="eee">`,
    `<aaa bbb="ccc" ddd="eee">`,
    "tag-excessive-whitespace-inside-tag",
    t
  ));

test(`06.04 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - double space between attributes, once`, t =>
  c(
    `<aaa bbb="ccc"  ddd="eee">`,
    `<aaa bbb="ccc" ddd="eee">`,
    "tag-excessive-whitespace-inside-tag",
    t
  ));

test(`06.05 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - multiple chunks, both larger`, t =>
  c(
    `<aaa bbb="ccc"  ddd="eee"       fff="ggg">`,
    `<aaa bbb="ccc" ddd="eee" fff="ggg">`,
    "tag-excessive-whitespace-inside-tag",
    t
  ));

test(`06.06 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - attribute with no equals and value`, t =>
  c(
    `<aaa bbb  ddd="eee">`,
    `<aaa bbb ddd="eee">`,
    "tag-excessive-whitespace-inside-tag",
    t
  ));

test(`06.07 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - single space before closing slash`, t =>
  c(
    `<aaa bbb="ccc" ddd="eee" />`,
    `<aaa bbb="ccc" ddd="eee"/>`,
    "tag-excessive-whitespace-inside-tag",
    t
  ));

test(`06.08 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - multiple spaces before the closing slash`, t =>
  c(
    `<aaa bbb="ccc" ddd="eee"    />`,
    `<aaa bbb="ccc" ddd="eee"/>`,
    "tag-excessive-whitespace-inside-tag",
    t
  ));

test(`06.09 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - spaces attr and closing slash - fake case`, t => {
  const bad1 = `<aaa bbb="ccc" / ddd="eee"/>`;
  //                          ^
  //   this gap will be recognised as not closing slash

  const res1 = lint(bad1);
  t.false(
    // <--------------------------------------- ! ! ! false ! ! !
    getUniqueIssueNames(res1.issues).includes(
      "tag-excessive-whitespace-inside-tag"
    ),
    "06.09.01"
  );
  // PS. in theory error should be raised but not with this rule...
});

test(`06.10 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - multiple issues`, t =>
  c(
    `<aaa bbb = "  ccc = "ddd">`,
    `<aaa bbb="" ccc="ddd">`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-space-between-equals-and-opening-quotes",
      "tag-attribute-space-between-name-and-equals",
      "tag-excessive-whitespace-inside-tag"
    ],
    t
  ));

test(`06.11 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - excessive whitespace leading to a missing closing bracket`, t =>
  c(
    `<a alt="yo"   /<a>`,
    `<a alt="yo"/><a>`,
    ["tag-excessive-whitespace-inside-tag", "tag-missing-closing-bracket"],
    t
  ));

test(`06.12 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - excessive whitespace before ESP tag`, t =>
  c(
    `<a  {% if b > 0 %}c{% else %}d{% endif %}>`,
    `<a {% if b > 0 %}c{% else %}d{% endif %}>`,
    "tag-excessive-whitespace-inside-tag",
    t
  ));

test(`06.13 - ${`\u001b[${32}m${`tag-excessive-whitespace-inside-tag`}\u001b[${39}m`} - excessive whitespace after ESP tag`, t =>
  c(
    `<a {% if b > 0 %}c{% else %}d{% endif %}  e>`,
    `<a {% if b > 0 %}c{% else %}d{% endif %} e>`,
    "tag-excessive-whitespace-inside-tag",
    t
  ));

// 07. rule "tag-attribute-space-between-equals-and-opening-quotes"
// -----------------------------------------------------------------------------

// 1. double quote:
test(`07.01 - ${`\u001b[${34}m${`tag-attribute-space-between-equals-and-opening-quotes`}\u001b[${39}m`} - spaces between equal and double quote`, t =>
  c(
    `<aaa bbb= "ccc">`,
    `<aaa bbb="ccc">`,
    "tag-attribute-space-between-equals-and-opening-quotes",
    t
  ));

// 2. single quote:
test(`07.02 - ${`\u001b[${34}m${`tag-attribute-space-between-equals-and-opening-quotes`}\u001b[${39}m`} - spaces between equal and single quote`, t =>
  c(
    `<aaa bbb= 'ccc'>`,
    `<aaa bbb='ccc'>`,
    "tag-attribute-space-between-equals-and-opening-quotes",
    t
  ));

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
  c(`<aaa />`, `<aaa/>`, "tag-excessive-whitespace-inside-tag", t);
});

test(`08.02 - ${`\u001b[${36}m${`tag-whitespace-closing-slash-and-bracket`}\u001b[${39}m`} - spaces between equal and quote`, t => {
  // 1. single space:
  c(`<aaa/ >`, `<aaa/>`, "tag-whitespace-closing-slash-and-bracket", t);

  // 2. more whitespace:
  c(`<aaa/    \n >`, `<aaa/>`, "tag-whitespace-closing-slash-and-bracket", t);
});

// 09. rule "tag-attribute-left-double-quotation-mark"
// -----------------------------------------------------------------------------

test(`09.01 - ${`\u001b[${35}m${`tag-attribute-left-double-quotation-mark`}\u001b[${39}m`} - left double opening, double closing`, t => {
  // 1. single double quote on the right
  // const bad1 = `<aaa bbb=“ccc">`;
  c(
    `<aaa bbb=\u201Cccc">`,
    `<aaa bbb="ccc">`,
    "tag-attribute-left-double-quotation-mark",
    t
  );
});

test(`09.02 - ${`\u001b[${35}m${`tag-attribute-left-double-quotation-mark`}\u001b[${39}m`} - left double opening, single closing`, t => {
  // 2. single straight quote on the right
  // const bad1 = `<aaa bbb=“ccc'>`;
  c(
    `<aaa bbb=\u201Cccc'>`,
    `<aaa bbb="ccc">`,
    [
      "tag-attribute-left-double-quotation-mark",
      "tag-attribute-mismatching-quotes-is-single"
    ],
    t
  );
});

test(`09.03 - ${`\u001b[${35}m${`tag-attribute-left-double-quotation-mark`}\u001b[${39}m`} - left double opening, right double closing`, t => {
  // const bad1 = `<abc def=“ghi”>`;
  c(
    `<abc def=\u201Cghi\u201D>`,
    `<abc def="ghi">`,
    [
      "tag-attribute-left-double-quotation-mark",
      "tag-attribute-right-double-quotation-mark"
    ],
    t
  );
});

test(`09.04 - ${`\u001b[${35}m${`tag-attribute-left-double-quotation-mark`}\u001b[${39}m`} - left double closing, normal opening`, t => {
  // const bad1 = `<aaa bbb="ccc“>`;
  c(
    `<aaa bbb="ccc\u201C>`,
    `<aaa bbb="ccc">`,
    "tag-attribute-left-double-quotation-mark",
    t
  );
});

test(`09.05 - ${`\u001b[${35}m${`tag-attribute-left-double-quotation-mark`}\u001b[${39}m`} - both left doubles`, t => {
  // const bad1 = `<aaa bbb=“ccc“>`;
  c(
    `<aaa bbb=\u201Cccc\u201C>`,
    `<aaa bbb="ccc">`,
    "tag-attribute-left-double-quotation-mark",
    t
  );
});

// 10. rule "tag-attribute-right-double-quotation-mark"
// -----------------------------------------------------------------------------

test(`10.01 - ${`\u001b[${33}m${`tag-attribute-right-double-quotation-mark`}\u001b[${39}m`} - right double opening, normal closing`, t => {
  // const bad1 = `<aaa bbb=“ccc">`;
  c(
    `<aaa bbb=\u201Dccc">`,
    `<aaa bbb="ccc">`,
    "tag-attribute-right-double-quotation-mark",
    t
  );
});

test(`10.02 - ${`\u001b[${33}m${`tag-attribute-right-double-quotation-mark`}\u001b[${39}m`} - attribute is enclosed in curly quotation marks`, t => {
  // 1. pair:
  // const bad1 = `<aaa bbb=“ccc”>`;
  c(
    `<aaa bbb=\u201Cccc\u201D>`,
    `<aaa bbb="ccc">`,
    [
      "tag-attribute-left-double-quotation-mark",
      "tag-attribute-right-double-quotation-mark"
    ],
    t
  );
});

test(`10.03 - ${`\u001b[${33}m${`tag-attribute-right-double-quotation-mark`}\u001b[${39}m`} - right double closing, normal opening`, t => {
  // const bad1 = `<aaa bbb="ccc“>`;
  c(
    `<aaa bbb="ccc\u201D>`,
    `<aaa bbb="ccc">`,
    "tag-attribute-right-double-quotation-mark",
    t
  );
});

test(`10.04 - ${`\u001b[${33}m${`tag-attribute-right-double-quotation-mark`}\u001b[${39}m`} - both right doubles`, t => {
  // const bad1 = `<aaa bbb=“ccc“>`;
  c(
    `<aaa bbb=\u201Dccc\u201D>`,
    `<aaa bbb="ccc">`,
    "tag-attribute-right-double-quotation-mark",
    t
  );
});

// 11. rule tag-attribute-quote-and-onwards-missing
// -----------------------------------------------------------------------------

test(`11.01 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, normal whitespace around`, t =>
  c(
    `<abc def="ghi" jkl= mno="pqr"/>`,
    `<abc def="ghi" mno="pqr"/>`,
    "tag-attribute-quote-and-onwards-missing",
    t
  ));

test(`11.02 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, extra whitespace follows, HTML`, t =>
  c(
    `<abc def="ghi" jkl=  mno="pqr">`,
    `<abc def="ghi" mno="pqr">`,
    "tag-attribute-quote-and-onwards-missing",
    t
  ));

test(`11.03 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, extra whitespace follows, XHTML`, t =>
  c(
    `<abc def="ghi" jkl=  mno="pqr"/>`,
    `<abc def="ghi" mno="pqr"/>`,
    "tag-attribute-quote-and-onwards-missing",
    t
  ));

test(`11.04 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, end of tag follows - XHTML - loose`, t =>
  c(
    `<abc def="ghi" jkl=  />`,
    `<abc def="ghi"/>`,
    "tag-attribute-quote-and-onwards-missing",
    t
  ));

test(`11.05 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, end of tag follows - XHTML - tight`, t =>
  c(
    `<abc def="ghi" jkl=/>`,
    `<abc def="ghi"/>`,
    "tag-attribute-quote-and-onwards-missing",
    t
  ));

test(`11.06 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, end of tag follows - HTML - loose`, t =>
  c(
    `<abc def="ghi" jkl=  >`,
    `<abc def="ghi">`,
    "tag-attribute-quote-and-onwards-missing",
    t
  ));

test(`11.07 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, end of tag follows - HTML - tight`, t =>
  c(
    `<abc def="ghi" jkl=>`,
    `<abc def="ghi">`,
    "tag-attribute-quote-and-onwards-missing",
    t
  ));

test(`11.08 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, normal whitespace around - HTML`, t =>
  c(`<img ab cd=>`, `<img ab>`, "tag-attribute-quote-and-onwards-missing", t));

test(`11.09 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - value with quotes missing, end of tag follows - XHTML`, t =>
  c(
    `<img ab cd=/>`,
    `<img ab/>`,
    "tag-attribute-quote-and-onwards-missing",
    t
  ));

test(`11.10 - ${`\u001b[${34}m${`tag-attribute-quote-and-onwards-missing`}\u001b[${39}m`} - excessive whitespace - XHTML`, t =>
  c(
    `<img ab cd=   /    >`,
    `<img ab/>`,
    [
      "tag-attribute-quote-and-onwards-missing",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    t
  ));

// 12. rule tag-attribute-mismatching-quotes-is-single
// -----------------------------------------------------------------------------

test(`12.01 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - non-empty value, no attr follows`, t =>
  c(
    `<aaa bbb="ccc'/>`,
    `<aaa bbb="ccc"/>`,
    "tag-attribute-mismatching-quotes-is-single",
    t
  ));

test(`12.02 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - non-empty value, other attr follows`, t =>
  c(
    `<aaa bbb="ccc' ddd="eee"/>`,
    `<aaa bbb="ccc" ddd="eee"/>`,
    "tag-attribute-mismatching-quotes-is-single",
    t
  ));

test(`12.03 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - non-empty value, other attr follows (no value)`, t =>
  c(
    `<aaa bbb="ccc' ddd/>`,
    `<aaa bbb="ccc" ddd/>`,
    "tag-attribute-mismatching-quotes-is-single",
    t
  ));

test(`12.04 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - non-empty value, other attr follows (different quotes)`, t =>
  c(
    `<aaa bbb="ccc' ddd='eee'/>`,
    `<aaa bbb="ccc" ddd='eee'/>`,
    "tag-attribute-mismatching-quotes-is-single",
    t
  ));

test(`12.05 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - non-empty value, opposite pair of mismatching attrs`, t =>
  c(
    `<aaa bbb="ccc' ddd='eee"/>`,
    `<aaa bbb="ccc" ddd='eee'/>`,
    [
      "tag-attribute-mismatching-quotes-is-double",
      "tag-attribute-mismatching-quotes-is-single"
    ],
    t
  ));

test(`12.06 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - legit single quote within double quotes`, t => {
  c(`<img alt="someone's">`, t);
  c(
    `<img alt='single double: "'>`,
    `<img alt='single double: &quot;'>`,
    "bad-character-unencoded-double-quotes",
    t
  );
});

test(`12.07 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - mismatching quotes followed by bool attr - HTML, minimal`, t =>
  c(
    `<td alt="a b' something>`,
    `<td alt="a b" something>`,
    "tag-attribute-mismatching-quotes-is-single",
    t
  ));

test(`12.08 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - mismatching quotes followed by bool attr - HTML, real life #1`, t =>
  c(
    `<td alt="a b' something><a href="zzz">aaa</a></td>`,
    `<td alt="a b" something><a href="zzz">aaa</a></td>`,
    "tag-attribute-mismatching-quotes-is-single",
    t
  ));

test(`12.09 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - mismatching quotes followed by bool attr - HTML, real life #2`, t =>
  c(
    `<td alt="a b' something>\n    tralala\n    <a href="zzz">aaa</a></td>`,
    `<td alt="a b" something>\n    tralala\n    <a href="zzz">aaa</a></td>`,
    "tag-attribute-mismatching-quotes-is-single",
    t
  ));

test(`12.10 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - mismatching quotes followed by bool attr - XHTML`, t =>
  c(
    `<td alt="a b' something/>`,
    `<td alt="a b" something/>`,
    "tag-attribute-mismatching-quotes-is-single",
    t
  ));

test(`12.11 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - mismatching quotes followed by bool attr - XHTML, real life #1`, t =>
  c(
    `<td alt="a b' something><a href="zzz">aaa</a></td>`,
    `<td alt="a b" something><a href="zzz">aaa</a></td>`,
    "tag-attribute-mismatching-quotes-is-single",
    t
  ));

test(`12.12 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-single`}\u001b[${39}m`} - mismatching quotes followed by bool attr - XHTML, real life #2`, t =>
  c(
    `<td alt="a b' something>\n    tralala\n    <a href="zzz">aaa</a></td>`,
    `<td alt="a b" something>\n    tralala\n    <a href="zzz">aaa</a></td>`,
    "tag-attribute-mismatching-quotes-is-single",
    t
  ));

// 13. rule "tag-attribute-left-single-quotation-mark"
// -----------------------------------------------------------------------------

test(`13.01 - ${`\u001b[${35}m${`tag-attribute-left-single-quotation-mark`}\u001b[${39}m`} - left single opening, normal closing - closing single straight quote`, t => {
  // const bad1 = `<aaa bbb=‘ccc'>`;
  c(
    `<aaa bbb=\u2018ccc'>`,
    `<aaa bbb='ccc'>`,
    "tag-attribute-left-single-quotation-mark",
    t
  );
});

test(`13.02 - ${`\u001b[${35}m${`tag-attribute-left-single-quotation-mark`}\u001b[${39}m`} - left single opening, normal closing - closing double straight quote`, t => {
  // const bad1 = `<aaa bbb=‘ccc">`;
  c(
    `<aaa bbb=\u2018ccc">`,
    `<aaa bbb='ccc'>`,
    [
      "tag-attribute-left-single-quotation-mark",
      "tag-attribute-mismatching-quotes-is-double"
    ],
    t
  );
});

test(`13.03 - ${`\u001b[${35}m${`tag-attribute-left-single-quotation-mark`}\u001b[${39}m`} - left single opening, right single closing`, t => {
  // const bad1 = `<aaa bbb=‘ccc’>`;
  c(
    `<aaa bbb=\u2018ccc\u2019>`,
    `<aaa bbb='ccc'>`,
    [
      "tag-attribute-left-single-quotation-mark",
      "tag-attribute-right-single-quotation-mark"
    ],
    t
  );
});

test(`13.04 - ${`\u001b[${35}m${`tag-attribute-left-single-quotation-mark`}\u001b[${39}m`} - left single closing, normal opening`, t => {
  // const bad1 = `<aaa bbb='ccc‘>`;
  c(
    `<aaa bbb='ccc\u2018>`,
    `<aaa bbb='ccc'>`,
    "tag-attribute-left-single-quotation-mark",
    t
  );
});

test(`13.05 - ${`\u001b[${35}m${`tag-attribute-left-single-quotation-mark`}\u001b[${39}m`} - both left single quotes`, t => {
  // const bad1 = `<aaa bbb=‘ccc‘>`;
  c(
    `<aaa bbb=\u2018ccc\u2018>`,
    `<aaa bbb='ccc'>`,
    "tag-attribute-left-single-quotation-mark",
    t
  );
});

// 14. rule "tag-attribute-right-single-quotation-mark"
// -----------------------------------------------------------------------------

test(`14.01 - ${`\u001b[${33}m${`tag-attribute-right-single-quotation-mark`}\u001b[${39}m`} - right single opening, normal closing`, t => {
  // const bad1 = `<aaa bbb=’ccc'>`;
  c(
    `<aaa bbb=\u2019ccc'>`,
    `<aaa bbb='ccc'>`,
    "tag-attribute-right-single-quotation-mark",
    t
  );
});

test(`14.02 - ${`\u001b[${33}m${`tag-attribute-right-single-quotation-mark`}\u001b[${39}m`} - attribute is enclosed in curly quotation marks`, t => {
  // pair:
  // const bad1 = `<aaa bbb=‘ccc’>`;
  c(
    `<aaa bbb=\u2018ccc\u2019>`,
    `<aaa bbb='ccc'>`,
    [
      "tag-attribute-left-single-quotation-mark",
      "tag-attribute-right-single-quotation-mark"
    ],
    t
  );
});

test(`14.03 - ${`\u001b[${33}m${`tag-attribute-right-single-quotation-mark`}\u001b[${39}m`} - right single closing, normal opening`, t => {
  // const bad1 = `<aaa bbb='ccc’>`;
  c(
    `<aaa bbb='ccc\u2019>`,
    `<aaa bbb='ccc'>`,
    "tag-attribute-right-single-quotation-mark",
    t
  );
});

test(`14.04 - ${`\u001b[${33}m${`tag-attribute-right-single-quotation-mark`}\u001b[${39}m`} - both right single quotes`, t => {
  // const bad1 = `<aaa bbb=’ccc’>`;
  c(
    `<aaa bbb=\u2019ccc\u2019>`,
    `<aaa bbb='ccc'>`,
    "tag-attribute-right-single-quotation-mark",
    t
  );
});

// 15. rule tag-attribute-closing-quotation-mark-missing
// -----------------------------------------------------------------------------

test(`15.01 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark at a tag ending - HTML, tight`, t =>
  c(
    `<zzz alt="><img alt="">`,
    `<zzz alt=""><img alt="">`,
    "tag-attribute-closing-quotation-mark-missing",
    t
  ));

test(`15.02 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark at a tag ending - XHTML, tight`, t =>
  c(
    `<zzz alt="/>`,
    `<zzz alt=""/>`,
    "tag-attribute-closing-quotation-mark-missing",
    t
  ));

test(`15.03 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark at a tag ending - HTML, loose`, t =>
  c(
    `<zzz alt=" >`,
    `<zzz alt="">`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag"
    ],
    t
  ));

test(`15.04 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark at a tag ending - XHTML, loose`, t =>
  c(
    `<zzz alt=" / >`,
    `<zzz alt=""/>`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    t
  ));

test(`15.05 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark at a tag ending - XHTML, very loose`, t =>
  c(
    `<xyz abc="  /  >`,
    `<xyz abc=""/>`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    t
  ));

test(`15.06 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark, tight, attrs follow`, t =>
  c(
    `<xyz abc="def="ghi">`,
    `<xyz abc="" def="ghi">`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-missing-space-before-attribute"
    ],
    t
  ));

test(`15.07 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark, spaced, attrs follow - HTML, spaced`, t =>
  c(
    `<xyz abc=" def="ghi">`,
    `<xyz abc="" def="ghi">`,
    "tag-attribute-closing-quotation-mark-missing",
    t
  ));

test(`15.08 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark, spaced, attrs follow - HTML, spaced`, t =>
  c(
    `<xyz abc="  def="ghi">`,
    `<xyz abc="" def="ghi">`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag"
    ],
    t
  ));

test(`15.09 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - sequence of two tags`, t =>
  c(
    `<abc def="><z >`,
    `<abc def=""><z>`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag"
    ],
    t
  ));

test(`15.10 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - false positives, doubles - HTML`, t =>
  c(
    `<abc def=">">`,
    `<abc def="&gt;">`,
    "bad-character-unencoded-closing-bracket",
    t
  ));

test(`15.11 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - false positives, doubles - XHTML`, t =>
  c(
    `<abc def=">"/>`,
    `<abc def="&gt;"/>`,
    "bad-character-unencoded-closing-bracket",
    t
  ));

test(`15.12 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - false positives, singles - HTML`, t =>
  c(
    `<abc def='>'>`,
    `<abc def='&gt;'>`,
    "bad-character-unencoded-closing-bracket",
    t
  ));

test(`15.13 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - false positives, singles - XHTML`, t =>
  c(
    `<abc def='>'/>`,
    `<abc def='&gt;'/>`,
    "bad-character-unencoded-closing-bracket",
    t
  ));

test(`15.14 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - unencoded bracket within double quotes`, t =>
  c(
    `<abc def=" '>' ">`,
    `<abc def=" '&gt;' ">`,
    "bad-character-unencoded-closing-bracket",
    t
  ));

test(`15.15 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - unencoded bracket within single quotes`, t =>
  c(
    `<abc def=' ">" '>`,
    `<abc def=' &quot;&gt;&quot; '>`,
    [
      "bad-character-unencoded-closing-bracket",
      "bad-character-unencoded-double-quotes"
    ],
    t
  ));

test(`15.16 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - unencoded bracket within attribute - HTML`, t =>
  c(
    `<xyz def="a > b">`,
    `<xyz def="a &gt; b">`,
    "bad-character-unencoded-closing-bracket",
    t
  ));

test(`15.17 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - unencoded bracket within attribute - XHTML`, t =>
  c(
    `<xyz def="a > b"/>`,
    `<xyz def="a &gt; b"/>`,
    "bad-character-unencoded-closing-bracket",
    t
  ));

test(`15.18 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark at a tag ending - HTML, tight`, t =>
  c(
    `<xyz abc="def><ghi jkl="">`,
    `<xyz abc="def"><ghi jkl="">`,
    "tag-attribute-closing-quotation-mark-missing",
    t
  ));

test(`15.19 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - excessive whitespace instead of closing quotes, doubles opening`, t =>
  c(
    `<a alt="yo\n><a>`,
    `<a alt="yo"><a>`,
    "tag-attribute-closing-quotation-mark-missing",
    t
  ));

test(`15.20 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - excessive whitespace instead of closing quotes, singles opening`, t =>
  c(
    `<a alt='yo\n><a>`,
    `<a alt='yo'><a>`,
    "tag-attribute-closing-quotation-mark-missing",
    t
  ));

test(`15.21 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - XHTML-style tag with slash`, t =>
  c(
    `<a alt="yo/><a>`,
    `<a alt="yo"/><a>`,
    "tag-attribute-closing-quotation-mark-missing",
    t
  ));

test(`15.22 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - XHTML-style tag with space then slash instead of closing bracket`, t =>
  c(
    `<a alt="yo   /><a>`,
    `<a alt="yo"/><a>`,
    "tag-attribute-closing-quotation-mark-missing",
    t
  ));

test(`15.23 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - missing closing quote, space, slash, space and closing bracket`, t =>
  c(
    `<a alt="yo  /  ><a>`,
    `<a alt="yo"/><a>`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    t
  ));

test(`15.24 - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - missing closing quote on first attribute`, t =>
  c(
    `<a href="xyz target="_blank">`,
    `<a href="xyz" target="_blank">`,
    "tag-attribute-closing-quotation-mark-missing",
    t
  ));

// test(`15.XX - ${`\u001b[${34}m${`tag-attribute-closing-quotation-mark-missing`}\u001b[${39}m`} - two consecutive attributes with closing quotes missing`, t => {
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

test(`16.01 - ${`\u001b[${32}m${`tag-attribute-missing-equal`}\u001b[${39}m`} - one tag, double quotes, HTML, tight`, t =>
  c(`<img alt"">`, `<img alt="">`, "tag-attribute-missing-equal", t));

test(`16.02 - ${`\u001b[${32}m${`tag-attribute-missing-equal`}\u001b[${39}m`} - one tag, double quotes, XHTML, tight`, t =>
  c(`<img alt""/>`, `<img alt=""/>`, "tag-attribute-missing-equal", t));

test(`16.03 - ${`\u001b[${32}m${`tag-attribute-missing-equal`}\u001b[${39}m`} - one tag, single quotes, HTML, tight`, t =>
  c(`<img alt''>`, `<img alt=''>`, "tag-attribute-missing-equal", t));

test(`16.04 - ${`\u001b[${32}m${`tag-attribute-missing-equal`}\u001b[${39}m`} - one tag, single quotes, XHTML, tight`, t =>
  c(`<img alt''/>`, `<img alt=''/>`, "tag-attribute-missing-equal", t));

test(`16.05 - ${`\u001b[${32}m${`tag-attribute-missing-equal`}\u001b[${39}m`} - combo of missing equal and mismatching quotes #1`, t =>
  c(
    `<img alt'">`,
    `<img alt=''>`,
    [
      "tag-attribute-mismatching-quotes-is-double",
      "tag-attribute-missing-equal"
    ],
    t
  ));

test(`16.06 - ${`\u001b[${32}m${`tag-attribute-missing-equal`}\u001b[${39}m`} - combo of missing equal and mismatching quotes #1`, t =>
  c(
    `<img alt'"/>`,
    `<img alt=''/>`,
    [
      "tag-attribute-mismatching-quotes-is-double",
      "tag-attribute-missing-equal"
    ],
    t
  ));

test(`16.07 - ${`\u001b[${32}m${`tag-attribute-missing-equal`}\u001b[${39}m`} - combo of missing equal and mismatching quotes #2`, t =>
  c(
    `<img alt"" yo=something"/>`,
    `<img alt="" yo="something"/>`,
    [
      "tag-attribute-missing-equal",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    t
  ));

test(`16.08 - ${`\u001b[${32}m${`tag-attribute-missing-equal`}\u001b[${39}m`} - combo with mismatching quotes`, t =>
  c(
    `<img alt"'>`,
    `<img alt="">`,
    [
      "tag-attribute-mismatching-quotes-is-single",
      "tag-attribute-missing-equal"
    ],
    t
  ));

// 17. rule tag-attribute-opening-quotation-mark-missing
// -----------------------------------------------------------------------------

test(`17.01 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark at a tag ending - one tag`, t =>
  c(
    `<zzz alt=zzz">`,
    `<zzz alt="zzz">`,
    "tag-attribute-opening-quotation-mark-missing",
    t
  ));

test(`17.02 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - double quotation mark at a tag ending - two tags`, t =>
  c(
    `<zzz alt=zzz"><img alt=yyy'>`,
    `<zzz alt="zzz"><img alt='yyy'>`,
    "tag-attribute-opening-quotation-mark-missing",
    t
  ));

test(`17.03 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - quotes within quotes are ${`\u001b[${33}m${`double`}\u001b[${39}m`} - 1 tag #1`, t =>
  c(
    `<ab cd=Efg, "hij"'>`,
    `<ab cd='Efg, &quot;hij&quot;'>`,
    [
      "bad-character-unencoded-double-quotes",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    t
  ));

test(`17.04 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - quotes within quotes are ${`\u001b[${33}m${`double`}\u001b[${39}m`} - 1 tag #2`, t =>
  c(
    `<zzz alt=Them, "specialists" behold'>`,
    `<zzz alt='Them, &quot;specialists&quot; behold'>`,
    [
      "bad-character-unencoded-double-quotes",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    t
  ));

test(`17.05 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - quotes within quotes are ${`\u001b[${33}m${`double`}\u001b[${39}m`} - 2 tags`, t =>
  c(
    `<zzz alt=So, "a" > "b"'>\ntext <img>`,
    `<zzz alt='So, &quot;a&quot; &gt; &quot;b&quot;'>\ntext <img>`,
    [
      "bad-character-unencoded-closing-bracket",
      "bad-character-unencoded-double-quotes",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    t
  ));

test(`17.06 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - quotes within quotes are ${`\u001b[${33}m${`double`}\u001b[${39}m`} - 1 tag #3`, t =>
  c(
    `<zzz alt=Just quotes: "'>`,
    `<zzz alt='Just quotes: &quot;'>`,
    [
      "bad-character-unencoded-double-quotes",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    t
  ));

test(`17.07 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - quotes within quotes are ${`\u001b[${33}m${`double`}\u001b[${39}m`} - 1 tag #4`, t =>
  c(
    `<zzz alt=Just quotes " here'>`,
    `<zzz alt='Just quotes &quot; here'>`,
    [
      "bad-character-unencoded-double-quotes",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    t
  ));

test(`17.08 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - quotes within quotes are ${`\u001b[${33}m${`double`}\u001b[${39}m`} - no equal`, t =>
  c(
    `<zzz alt'So, "a" > "b"'>\ntext <img>`,
    `<zzz alt='So, &quot;a&quot; &gt; &quot;b&quot;'>\ntext <img>`,
    [
      "bad-character-unencoded-closing-bracket",
      "bad-character-unencoded-double-quotes",
      "tag-attribute-missing-equal"
    ],
    t
  ));

test(`17.09 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - quotes within quotes are ${`\u001b[${31}m${`single`}\u001b[${39}m`} - with equal`, t =>
  c(
    `<zzz alt=Them, 'specialists'">`,
    `<zzz alt="Them, 'specialists'">`,
    "tag-attribute-opening-quotation-mark-missing",
    t
  ));

test(`17.10 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - quotes within quotes are ${`\u001b[${31}m${`single`}\u001b[${39}m`} - spaced out`, t =>
  c(
    `<zzz alt=Them, 'specialists' behold">`,
    `<zzz alt="Them, 'specialists' behold">`,
    "tag-attribute-opening-quotation-mark-missing",
    t
  ));

test(`17.11 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - quotes within quotes are ${`\u001b[${31}m${`single`}\u001b[${39}m`} - trailing single`, t =>
  c(
    `<zzz alt=Just quotes: '">`,
    `<zzz alt="Just quotes: '">`,
    "tag-attribute-opening-quotation-mark-missing",
    t
  ));

test(`17.12 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - quotes within quotes are ${`\u001b[${31}m${`single`}\u001b[${39}m`} - spaced single`, t =>
  c(
    `<zzz alt=Just quotes ' here">`,
    `<zzz alt="Just quotes ' here">`,
    "tag-attribute-opening-quotation-mark-missing",
    t
  ));

test(`17.13 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - text after tag, double quotes`, t =>
  c(
    `<a bc=de"> fg`,
    `<a bc="de"> fg`,
    "tag-attribute-opening-quotation-mark-missing",
    t
  ));

test(`17.14 - ${`\u001b[${36}m${`tag-attribute-opening-quotation-mark-missing`}\u001b[${39}m`} - text after tag, single quotes`, t =>
  c(
    `<a bc=de'> fg`,
    `<a bc='de'> fg`,
    "tag-attribute-opening-quotation-mark-missing",
    t
  ));

// 18. rule tag-attribute-mismatching-quotes-is-double
// -----------------------------------------------------------------------------

test(`18.01 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-double`}\u001b[${39}m`} - followed by bool attr - HTML`, t =>
  c(
    `<td alt='a b" something>`,
    `<td alt='a b' something>`,
    "tag-attribute-mismatching-quotes-is-double",
    t
  ));

test(`18.02 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-double`}\u001b[${39}m`} - followed by boolean attribute - XHTML`, t =>
  c(
    `<td alt='a b" something/>`,
    `<td alt='a b' something/>`,
    "tag-attribute-mismatching-quotes-is-double",
    t
  ));

test(`18.03 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-double`}\u001b[${39}m`} - followed by boolean attribute, followed by normal attribute`, t =>
  c(
    `<td alt='a b" cde="fgh">`,
    `<td alt='a b' cde="fgh">`,
    "tag-attribute-mismatching-quotes-is-double",
    t
  ));

test(`18.04 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-double`}\u001b[${39}m`} - followed by boolean attribute, preceded by normal attribute`, t =>
  c(
    `<td cde="fgh" alt='a b">`,
    `<td cde="fgh" alt='a b'>`,
    "tag-attribute-mismatching-quotes-is-double",
    t
  ));

test(`18.05 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-double`}\u001b[${39}m`} - followed by boolean attribute, surrounded by normal attributes`, t =>
  c(
    `<td cde="fgh" alt='a b" ijk="lmn">`,
    `<td cde="fgh" alt='a b' ijk="lmn">`,
    "tag-attribute-mismatching-quotes-is-double",
    t
  ));

test(`18.06 - ${`\u001b[${31}m${`tag-attribute-mismatching-quotes-is-double`}\u001b[${39}m`} - mix of different type mismatches separated by boolean attribute`, t =>
  c(
    `<td abc='d e" fgh ijk="klm'/>`,
    `<td abc='d e' fgh ijk="klm"/>`,
    [
      "tag-attribute-mismatching-quotes-is-double",
      "tag-attribute-mismatching-quotes-is-single"
    ],
    t
  ));

// 19. rule "bad-character-unencoded-closing-bracket"
// -----------------------------------------------------------------------------

test(`19.01 - ${`\u001b[${33}m${`bad-character-unencoded-closing-bracket`}\u001b[${39}m`} - minimal example`, t =>
  c(`a > b`, `a &gt; b`, "bad-character-unencoded-closing-bracket", t));

test(`19.02 - ${`\u001b[${33}m${`bad-character-unencoded-closing-bracket`}\u001b[${39}m`} - more resembling real life, surrounded by tags`, t =>
  c(
    `<a href="yz">mn ></a>`,
    `<a href="yz">mn &gt;</a>`,
    "bad-character-unencoded-closing-bracket",
    t
  ));

test(`19.03 - ${`\u001b[${33}m${`bad-character-unencoded-closing-bracket`}\u001b[${39}m`} - unencoded greater than character within attribute's value, tight`, t =>
  c(
    `<img alt=">">`,
    `<img alt="&gt;">`,
    "bad-character-unencoded-closing-bracket",
    t
  ));

test(`19.04 - ${`\u001b[${33}m${`bad-character-unencoded-closing-bracket`}\u001b[${39}m`} - unencoded greater than character within attribute's value, spaced`, t =>
  c(
    `<img alt="a > b">`,
    `<img alt="a &gt; b">`,
    "bad-character-unencoded-closing-bracket",
    t
  ));

// 20. rule "bad-character-unencoded-opening-bracket"
// -----------------------------------------------------------------------------

test(`20.01 - ${`\u001b[${33}m${`bad-character-unencoded-opening-bracket`}\u001b[${39}m`} - no HTML`, t =>
  c(`a < b`, `a &lt; b`, "bad-character-unencoded-opening-bracket", t));

test(`20.02 - ${`\u001b[${33}m${`bad-character-unencoded-opening-bracket`}\u001b[${39}m`} - more resembling real life, surrounded by tags`, t =>
  c(
    `<a bc="de">< gh</a>`,
    `<a bc="de">&lt; gh</a>`,
    "bad-character-unencoded-opening-bracket",
    t
  ));

test(`20.03 - ${`\u001b[${33}m${`bad-character-unencoded-opening-bracket`}\u001b[${39}m`} - actually, an unclosed tag`, t =>
  c(
    `<a bc="de">< gh ij="kl" mn="op"</a>`,
    `<a bc="de"><gh ij="kl" mn="op"></a>`,
    ["tag-missing-closing-bracket", "tag-space-after-opening-bracket"],
    t
  ));

// 21. rule "tag-missing-closing-bracket"
// -----------------------------------------------------------------------------

// There must be at least one attribute with equals-quotes pattern for it to
// be considered a tag
test(`21.01 - ${`\u001b[${34}m${`tag-missing-closing-bracket`}\u001b[${39}m`} - attribute with value, no bracket`, t =>
  c(`<a b="ccc"<d>`, `<a b="ccc"><d>`, ["tag-missing-closing-bracket"], t));

// There must be at least one attribute with equals-quotes pattern for it to
// be considered a tag. After that, boolean attributes can follow.
test(`21.02 - ${`\u001b[${34}m${`tag-missing-closing-bracket`}\u001b[${39}m`} - attribute without value, no bracket`, t =>
  c(
    `<a b="ccc" ddd<e>`,
    `<a b="ccc" ddd><e>`,
    "tag-missing-closing-bracket",
    t
  ));

// if there is not at least one attribute with equal-quotes pattern, it's not
// considered to be a tag but rather inline unencoded bracket
test(`21.03 - ${`\u001b[${34}m${`tag-missing-closing-bracket`}\u001b[${39}m`} - only attribute without value, no bracket`, t =>
  c(`<a bbb<c>`, `&lt;a bbb<c>`, "bad-character-unencoded-opening-bracket", t));

test(`21.04 - ${`\u001b[${34}m${`tag-missing-closing-bracket`}\u001b[${39}m`} - unclosed tag, EOF, tight`, t =>
  c(`<a b="ccc"`, `<a b="ccc">`, "tag-missing-closing-bracket", t));

test(`21.05 - ${`\u001b[${34}m${`tag-missing-closing-bracket`}\u001b[${39}m`} - unclosed tag, EOF, loose`, t =>
  c(
    `<a b="ccc" \t `,
    `<a b="ccc">`,
    ["bad-character-character-tabulation", "tag-missing-closing-bracket"],
    t
  ));

test(`21.06 - ${`\u001b[${34}m${`tag-missing-closing-bracket`}\u001b[${39}m`} - whitespace before added bracket`, t =>
  // There must be at least one attribute with equals-quotes pattern for it to
  // be considered a tag. After that, boolean attributes can follow.
  c(
    `<a b="ccc" ddd         <e>`,
    `<a b="ccc" ddd><e>`,
    ["tag-missing-closing-bracket"],
    t
  ));

// 22. Both quotes missing around attributes
// -----------------------------------------------------------------------------

test(`22.01 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - one tag`, t =>
  c(
    `<a bcd=ef>`,
    `<a bcd="ef">`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    t
  ));

test(`22.02 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - multiple tags`, t =>
  c(
    `<a bcd=ef ghj=kl  >`,
    `<a bcd="ef" ghj="kl">`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag"
    ],
    t
  ));

test(`22.03 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - boolean attributes #1`, t =>
  c(
    `<a bcd efg=hi>`,
    `<a bcd efg="hi">`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    t
  ));

test(`22.04 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - boolean attributes #2`, t =>
  c(
    `<a bcd efg=hi jkl=mn   >`,
    `<a bcd efg="hi" jkl="mn">`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag"
    ],
    t
  ));

test(`22.05 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - boolean attributes - one unrecognised`, t =>
  c(
    `<a bcd=ef ghi>`,
    `<a bcd="ef ghi">`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    t
  ));

test(`22.06 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - boolean attributes - one attr recognised`, t =>
  c(
    `<a bcd=ef nowrap>`,
    `<a bcd="ef" nowrap>`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    t
  ));

test(`22.07 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - boolean attributes - many recognised, ends with overkill`, t =>
  c(
    `<a bcd=ef gh     nowrap     noresize    reversed   >`,
    `<a bcd="ef gh" nowrap noresize reversed>`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-excessive-whitespace-inside-tag"
    ],
    t
  ));

test(`22.08 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - boolean attributes - many recognised, sandwitched overkill`, t =>
  c(
    `<a bcd=ef gh nowrap noresize reversed ghi=jkl>`,
    `<a bcd="ef gh" nowrap noresize reversed ghi="jkl">`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    t
  ));

test(`22.09 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - boolean attributes #4 (XHTML)`, t =>
  c(
    `<a bcd=ef ghi/>`,
    `<a bcd="ef ghi"/>`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    t
  ));

test(`22.10 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - boolean attributes #5 (XHTML)`, t =>
  c(
    `<a bcd=ef ghi=jk lmn/>`,
    `<a bcd="ef" ghi="jk lmn"/>`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    t
  ));

test(`22.11 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - boolean attributes #6 (existing neighbour attrs)`, t =>
  c(
    `<a bcd=ef ghi='jk' lmn>`,
    `<a bcd="ef" ghi='jk' lmn>`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    t
  ));

test(`22.12 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - boolean attributes #7 (existing neighbour attrs)`, t =>
  c(
    `<a bcd=ef ghi='jk'>`,
    `<a bcd="ef" ghi='jk'>`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    t
  ));

test(`22.13 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - no value and quotes, followed by tag with a quote-less value - HTML - #1`, t =>
  c(
    `<a bcd= ef=gh>`,
    `<a ef="gh">`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-attribute-quote-and-onwards-missing"
    ],
    t
  ));

test(`22.14 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - no value and quotes, followed by tag with a quote-less value - HTML - #2`, t =>
  c(
    `<a bcd= ef=gh><i jkl= mn=op><q rst= uv=wxyz>`,
    `<a ef="gh"><i mn="op"><q uv="wxyz">`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-attribute-quote-and-onwards-missing"
    ],
    t
  ));

test(`22.15 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - no value and quotes, followed by tag with a quote-less value - messy XHTML`, t =>
  c(
    `<a bcd= ef=gh   /   >`,
    `<a ef="gh"/>`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-attribute-quote-and-onwards-missing",
      "tag-excessive-whitespace-inside-tag",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    t
  ));

test(`22.16 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - no value and quotes, followed by tag with a quote-less value - real XHTML`, t =>
  c(
    `<img src=abc.jpg width=123 height=456 border=0 style=display:block; alt=xyz/>`,
    `<img src="abc.jpg" width="123" height="456" border="0" style="display:block;" alt="xyz"/>`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    t
  ));

test(`22.17 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - combo of various issues #1-1`, t =>
  c(
    `<a bcd = ef ghi = jk lmn / >`,
    `<a bcd="ef" ghi="jk lmn"/>`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-attribute-space-between-name-and-equals",
      "tag-excessive-whitespace-inside-tag",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    t
  ));

//
// notice "nowrap" is a recognised boolean attribute:
//
test(`22.18 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - combo of various issues #1-2`, t =>
  c(
    `<a bcd = ef ghi = jk nowrap / >`,
    `<a bcd="ef" ghi="jk" nowrap/>`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-attribute-space-between-name-and-equals",
      "tag-excessive-whitespace-inside-tag",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    t
  ));

test(`22.19 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - unquoted sentence #1`, t =>
  c(
    `<a bcd = ef ghi = Something, resembling text / >`,
    `<a bcd="ef" ghi="Something, resembling text"/>`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-attribute-space-between-name-and-equals",
      "tag-excessive-whitespace-inside-tag",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    t
  ));

test(`22.20 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - unquoted sentence #2`, t =>
  c(
    `<a bcd = ef ghi = Jkl, mno pq jkl = mno/ >`,
    `<a bcd="ef" ghi="Jkl, mno pq" jkl="mno"/>`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-attribute-space-between-name-and-equals",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    t
  ));

test(`22.21 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - chopped off file`, t =>
  c(`<a bcd=`, `<a bcd=`, "file-missing-ending", t));

test(`22.22 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - chopped off file + CRLF`, t =>
  c(`<a bcd=\r\n`, `<a bcd=\r\n`, "file-missing-ending", t));

test(`22.23 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - zeros`, t =>
  c(
    `<a bcd=0 ghj=0>`,
    `<a bcd="0" ghj="0">`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    t
  ));

test(`22.24 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - sequence of tags`, t =>
  c(
    `<a bcd=ef ghj=kl mnop="rst uvw = xyz" nowrap abc=def>`,
    `<a bcd="ef" ghj="kl" mnop="rst uvw = xyz" nowrap abc="def">`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    t
  ));

test(`22.25 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - closing bracket as content within unquotes attr value`, t =>
  c(
    `<a bcd= ef=gh > ij>`,
    `<a ef="gh &gt; ij">`,
    [
      "bad-character-unencoded-closing-bracket",
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-attribute-quote-and-onwards-missing"
    ],
    t
  ));

test(`22.26 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - closing bracket as content within unquotes attr value, more tags`, t =>
  c(
    `<a bcd= ef=gh > ij><img src=zzz alt="">`,
    `<a ef="gh &gt; ij"><img src="zzz" alt="">`,
    [
      "bad-character-unencoded-closing-bracket",
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-attribute-quote-and-onwards-missing"
    ],
    t
  ));

test(`22.27 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - an unencoded closing bracket is whole value`, t =>
  c(
    `<a bc=>><de fg=hi jk="">`,
    `<a bc="&gt;"><de fg="hi" jk="">`,
    [
      "bad-character-unencoded-closing-bracket",
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    t
  ));

test(`22.28 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - attr quotes missing, value begins with unencoded bracket #3`, t =>
  c(
    `<a bc= > defg">`,
    `<a bc="&gt; defg">`,
    [
      "bad-character-unencoded-closing-bracket",
      "tag-attribute-opening-quotation-mark-missing"
    ],
    t
  ));

test(`22.29 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - closing bracket as content within unquoted attr value`, t =>
  c(
    `<a bcd= ef=gh > ij \n klmn`,
    `<a ef="gh"> ij \n klmn`,
    [
      "tag-attribute-closing-quotation-mark-missing",
      "tag-attribute-opening-quotation-mark-missing",
      "tag-attribute-quote-and-onwards-missing",
      "tag-excessive-whitespace-inside-tag"
    ],
    t
  ));

//

// test(`22.30 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - attr quotes missing, value begins with unencoded bracket #1`, t =>
//   c(
//     `<a bc= > defg><img scr="z.jpg" alt="">`,
//     `<a bc="&gt; defg"><img scr="z.jpg" alt="">`,
//     [
//       "bad-character-unencoded-closing-bracket",
//       "tag-attribute-closing-quotation-mark-missing",
//       "tag-attribute-opening-quotation-mark-missing"
//     ],
//     t
//   ));
//
// test(`22.31 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - attr quotes missing, value begins with unencoded bracket #2`, t =>
//   c(
//     `<a bc= "> defg><img scr="z.jpg" alt="">`,
//     `<a bc="&gt; defg"><img scr="z.jpg" alt="">`,
//     [
//       "bad-character-unencoded-closing-bracket",
//       "tag-attribute-closing-quotation-mark-missing"
//     ],
//     t
//   ));
//
// // now repeated, to ensure consistency across many tags:
// test(`22.32 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - attr quotes missing, value begins with unencoded bracket #4`, t =>
//   c(
//     `<a bc= > defg hij><k lm= > nopr stuvwxyz>`,
//     `<a bc="> defg hij"><k lm="> nopr stuvwxyz">`,
//     [
//       "bad-character-unencoded-closing-bracket",
//       "tag-attribute-closing-quotation-mark-missing",
//       "tag-attribute-opening-quotation-mark-missing"
//     ],
//     t
//   ));
//
// test(`22.33 - ${`\u001b[${35}m${`attr. both quotes missing`}\u001b[${39}m`} - sequence of tags`, t =>
//   c(
//     `<a bcd=ef ghj=kl mnop="rst uvw = xyz" nowrap abc=def>\n<b cde="fgh" ijklm=0 abc="defgh ijkl">`,
//     `<a bcd="ef" ghj="kl" mnop="rst uvw = xyz" nowrap abc="def">\n<b cde="fgh" ijklm="0" abc="defgh ijkl">`,
//     [
//       "tag-attribute-closing-quotation-mark-missing",
//       "tag-attribute-opening-quotation-mark-missing"
//     ],
//     t
//   ));

// 23. rule "tag-attribute-repeated-equal"
// -----------------------------------------------------------------------------

test(`23.01 - ${`\u001b[${36}m${`repeated equal`}\u001b[${39}m`} - one tag, one double equal`, t =>
  c(`<a bcd=="ef">`, `<a bcd="ef">`, "tag-attribute-repeated-equal", t));

test(`23.02 - ${`\u001b[${36}m${`repeated equal`}\u001b[${39}m`} - few equals in a sequence, no spaces`, t =>
  c(`<a bcd==="ef">`, `<a bcd="ef">`, "tag-attribute-repeated-equal", t));

test(`23.03 - ${`\u001b[${36}m${`repeated equal`}\u001b[${39}m`} - few spaced out equals`, t =>
  c(
    `<a bcd = = = "ef">`,
    `<a bcd="ef">`,
    [
      "tag-attribute-repeated-equal",
      "tag-attribute-space-between-equals-and-opening-quotes",
      "tag-attribute-space-between-name-and-equals"
    ],
    t
  ));

test(`23.04 - ${`\u001b[${36}m${`repeated equal`}\u001b[${39}m`} - two consecutive, one spaced after`, t =>
  c(`<a bcd== ="ef">`, `<a bcd="ef">`, "tag-attribute-repeated-equal", t));

test(`23.05 - ${`\u001b[${36}m${`repeated equal`}\u001b[${39}m`} - excessive example`, t =>
  c(
    `<a bcd === == \t== =\n = 'ef'>`,
    `<a bcd='ef'>`,
    [
      "tag-attribute-repeated-equal",
      "tag-attribute-space-between-equals-and-opening-quotes",
      "tag-attribute-space-between-name-and-equals"
    ],
    t
  ));

test(`23.06 - ${`\u001b[${36}m${`repeated equal`}\u001b[${39}m`} - few equals in a sequence, EOF`, t =>
  c(
    `<a bcd===\n`,
    `<a bcd=\n`,
    ["file-missing-ending", "tag-attribute-repeated-equal"],
    t
  ));

// 24. rule "tag-stray-character"
// -----------------------------------------------------------------------------

test(`24.01 - ${`\u001b[${32}m${`tag-stray-character`}\u001b[${39}m`} - stray quote before attr. name`, t =>
  c(`<a "bcd="ef"/>`, `<a bcd="ef"/>`, "tag-stray-character", t));

test(`24.02 - ${`\u001b[${32}m${`tag-stray-character`}\u001b[${39}m`} - many stray quotes before attr. name`, t =>
  c(`<a """"bcd="ef"/>`, `<a bcd="ef"/>`, "tag-stray-character", t));

test(`24.03 - ${`\u001b[${32}m${`tag-stray-character`}\u001b[${39}m`} - stray quote instead of a space`, t =>
  c(`<a"bcd="ef"/>`, `<a bcd="ef"/>`, "tag-stray-character", t));

test(`24.04 - ${`\u001b[${32}m${`tag-stray-character`}\u001b[${39}m`} - stray quote instead of a space`, t =>
  c(`<a"'"'"'"'bcd="ef"/>`, `<a bcd="ef"/>`, "tag-stray-character", t));

test(`24.05 - ${`\u001b[${34}m${`tag-stray-character`}\u001b[${39}m`} - stray equal after attr. name`, t =>
  c(`<a=bcd="ef"/>`, `<a bcd="ef"/>`, "tag-stray-character", t));

test(`24.06 - ${`\u001b[${34}m${`tag-stray-character`}\u001b[${39}m`} - stray equal and quotes after attr. name`, t =>
  c(`<a="bcd="ef"/>`, `<a bcd="ef"/>`, "tag-stray-character", t));

// 25. rules coming from package "string-fix-broken-named-entities"
// -----------------------------------------------------------------------------

test(`25.01 - ${`\u001b[${31}m${`string-fix-broken-named-entities`}\u001b[${39}m`} - one malformed nbsp`, t =>
  c(
    `<div>&nbbsp;</div><div>&nbbsp;</div>`,
    `<div>&nbsp;</div><div>&nbsp;</div>`,
    "bad-named-html-entity-malformed-nbsp",
    t
  ));

test(`25.02 - ${`\u001b[${31}m${`string-fix-broken-named-entities`}\u001b[${39}m`} - one malformed nbsp - spaced #1`, t =>
  c(`abc &nbs;`, `abc &nbsp;`, "bad-named-html-entity-malformed-nbsp", t));

test(`25.03 - ${`\u001b[${31}m${`string-fix-broken-named-entities`}\u001b[${39}m`} - one malformed nbsp - spaced #2`, t =>
  c(
    `abc &nbs; xyz`,
    `abc &nbsp; xyz`,
    "bad-named-html-entity-malformed-nbsp",
    t
  ));

test(`25.04 - ${`\u001b[${31}m${`string-fix-broken-named-entities`}\u001b[${39}m`} - one malformed nbsp - spaced #3`, t =>
  c(
    `abc &nbs; xyz`,
    `abc &nbsp; xyz`,
    "bad-named-html-entity-malformed-nbsp",
    t
  ));

test(`25.05 - ${`\u001b[${31}m${`string-fix-broken-named-entities`}\u001b[${39}m`} - one malformed nbsp - tight`, t =>
  c(`abc&nbs;`, `abc&nbsp;`, "bad-named-html-entity-malformed-nbsp", t));

test(`25.06 - ${`\u001b[${31}m${`string-fix-broken-named-entities`}\u001b[${39}m`} - one malformed nbsp - spaced #1`, t =>
  c(`&nbs; xyz`, `&nbsp; xyz`, "bad-named-html-entity-malformed-nbsp", t));

test(`25.07 - ${`\u001b[${31}m${`string-fix-broken-named-entities`}\u001b[${39}m`} - one malformed nbsp - spaced #2`, t =>
  c(`abc&nbs;xyz`, `abc&nbsp;xyz`, "bad-named-html-entity-malformed-nbsp", t));

test(`25.08 - ${`\u001b[${31}m${`string-fix-broken-named-entities`}\u001b[${39}m`} - one malformed nbsp - spaced #3`, t =>
  c(`abc&nbs;xyz`, `abc&nbsp;xyz`, "bad-named-html-entity-malformed-nbsp", t));

test(`25.09 - ${`\u001b[${31}m${`string-fix-broken-named-entities`}\u001b[${39}m`} - one malformed nbsp - spaced #4`, t =>
  c(`&nbs;xyz`, `&nbsp;xyz`, "bad-named-html-entity-malformed-nbsp", t));

// 26. rule "tag-missing-space-before-attribute"
// -----------------------------------------------------------------------------

test(`26.01 - ${`\u001b[${33}m${`tag-missing-space-before-attribute`}\u001b[${39}m`} - space between two attributes`, t =>
  c(
    `<a b="c"d="e">`,
    `<a b="c" d="e">`,
    "tag-missing-space-before-attribute",
    t
  ));

// 27. Code chunk skipping rules
// -----------------------------------------------------------------------------

test(`27.01 - ${`\u001b[${36}m${`code chunk skipping`}\u001b[${39}m`} - <script> tags`, t =>
  c(`<script> a === b ' " \`     ;; ="" kkk="mmm" </zz>  z == x</script>`, t));

test(`27.02 - ${`\u001b[${36}m${`code chunk skipping`}\u001b[${39}m`} - <script> tags`, t =>
  c(
    `\`<script> a === b ' " \`    z == x</script>\``,
    `&#x60;<script> a === b ' " \`    z == x</script>&#x60;`,
    "bad-character-grave-accent",
    t
  ));

test(`27.03 - ${`\u001b[${36}m${`code chunk skipping`}\u001b[${39}m`} - <script> tags, more complex`, t =>
  c(
    `<script a="b" c="d" e="f" ghi jkl,
m cript>",
</script>`,
    t
  ));

// 28. rule "bad-named-html-entity-multiple-encoding"
// -----------------------------------------------------------------------------

test(`28.01 - ${`\u001b[${32}m${`bad-named-html-entity-multiple-encoding`}\u001b[${39}m`} - recognises simple double-encoded entity`, t =>
  c(`&amp;nbsp;`, `&nbsp;`, "bad-named-html-entity-multiple-encoding", t));

test(`28.02 - ${`\u001b[${32}m${`bad-named-html-entity-multiple-encoding`}\u001b[${39}m`} - not an issue`, t =>
  c("&amp; &amp; &amp;", t));

// 29. ESP templating language recognition
// -----------------------------------------------------------------------------

test(`29.01 - ${`\u001b[${35}m${`ESP tags`}\u001b[${39}m`} - known ESP tag within tag inner whitespace - spaced`, t =>
  c(`<tag{%- if a > 0 -%}>`, t));

test(`29.02 - ${`\u001b[${35}m${`ESP tags`}\u001b[${39}m`} - known ESP tag within tag inner whitespace - tight`, t =>
  c(`<tag{%-if a > 0-%}>`, t));

test(`29.03 - ${`\u001b[${35}m${`ESP tags`}\u001b[${39}m`} - known ESP tag within tag inner whitespace - loose`, t =>
  c(`<tag{%-  if a > 0  -%}>`, t));

test(`29.04 - ${`\u001b[${35}m${`ESP tags`}\u001b[${39}m`} - known ESP tag within tag inner whitespace - loose`, t =>
  c(`<a{% if b %}c{% endif %}/>`, t));

test(`29.05 - ${`\u001b[${35}m${`ESP tags`}\u001b[${39}m`} - known ESP tag adding conditional attributes`, t =>
  c(`<img{% if klm %} class="z"{% endif %} alt="1"/>`, t));

test(`29.06 - ${`\u001b[${35}m${`ESP tags`}\u001b[${39}m`} - known ESP tag closing is single char`, t =>
  c(`<img {% if z }/>`, t));

test(`29.07 - ${`\u001b[${35}m${`ESP tags`}\u001b[${39}m`} - unknown ESP tag adding conditional attributes`, t =>
  c(`<img%%a z%%/>`, t));

test(`29.08 - ${`\u001b[${35}m${`ESP tags`}\u001b[${39}m`} - Responsys clickthrough() function`, t =>
  c(
    `<a href="$clickthrough(ViewOnline, CUSTOMER_ID_, FIRST_NAME, LAST_NAME, SALUTATION, LANGUAGE_ISO2)$" target="_blank">click here</a>`,
    t
  ));

// 30. rule: "esp-more-closing-parentheses-than-opening"
// -----------------------------------------------------------------------------

test(`30.01 - ${`\u001b[${31}m${`esp-more-closing-parentheses-than-opening`}\u001b[${39}m`} - Responsys-style nested function`, t =>
  c(
    `a $cond(empty(lookup(ZZZUID)),nothing(), document(/contentlibrary/!campaign_templates,zzzpixel.htm))$ b`,
    t
  ));

test(`30.02 - ${`\u001b[${31}m${`esp-more-closing-parentheses-than-opening`}\u001b[${39}m`} - single function-type ESP templating tag`, t =>
  c2(
    `a $cond())$ b`,
    {
      issues: [
        {
          name: "esp-more-closing-parentheses-than-opening",
          position: [[2, 11]]
        }
      ]
    },
    t
  ));

test(`30.03 - ${`\u001b[${31}m${`esp-more-closing-parentheses-than-opening`}\u001b[${39}m`} - single function-type ESP templating tag - 1st opening paren removed`, t =>
  c2(
    `a $cond empty(lookup(ZZZUID)),nothing(), document(/contentlibrary/!campaign_templates,zzzpixel.htm))$ b`,
    {
      issues: [
        {
          name: "esp-more-closing-parentheses-than-opening",
          position: [[2, 101]]
        }
      ]
    },
    t
  ));

test(`30.04 - ${`\u001b[${31}m${`esp-more-closing-parentheses-than-opening`}\u001b[${39}m`} - single function-type ESP templating tag - 2nd paren removed`, t =>
  c2(
    `a $cond(empty lookup(ZZZUID)),nothing(), document(/contentlibrary/!campaign_templates,zzzpixel.htm))$ b`,
    {
      issues: [
        {
          name: "esp-more-closing-parentheses-than-opening",
          position: [[2, 101]]
        }
      ]
    },
    t
  ));

test(`30.05 - ${`\u001b[${31}m${`esp-more-closing-parentheses-than-opening`}\u001b[${39}m`} - single function-type ESP templating tag - 3rd paren removed`, t =>
  c2(
    `a $cond(empty(lookup ZZZUID)),nothing(), document(/contentlibrary/!campaign_templates,zzzpixel.htm))$ b`,
    {
      issues: [
        {
          name: "esp-more-closing-parentheses-than-opening",
          position: [[2, 101]]
        }
      ]
    },
    t
  ));

test(`30.06 - ${`\u001b[${31}m${`esp-more-closing-parentheses-than-opening`}\u001b[${39}m`} - single function-type ESP templating tag - 4rd paren removed`, t =>
  c2(
    `a $cond(empty(lookup(ZZZUID)),nothing), document(/contentlibrary/!campaign_templates,zzzpixel.htm))$ b`,
    {
      issues: [
        {
          name: "esp-more-closing-parentheses-than-opening",
          position: [[2, 100]]
        }
      ]
    },
    t
  ));

test(`30.07 - ${`\u001b[${31}m${`esp-more-closing-parentheses-than-opening`}\u001b[${39}m`} - single function-type ESP templating tag - 5th paren removed`, t =>
  c2(
    `a $cond(empty(lookup(ZZZUID)),nothing), document /contentlibrary/!campaign_templates,zzzpixel.htm))$ b`,
    {
      issues: [
        {
          name: "esp-more-closing-parentheses-than-opening",
          position: [[2, 100]]
        }
      ]
    },
    t
  ));

// ====

test(`30.08 - ${`\u001b[${31}m${`esp-more-closing-parentheses-than-opening`}\u001b[${39}m`} - single function-type ESP templating tag - #6 two removed`, t =>
  c2(
    `a $cond(empty(lookup ZZZUID)),nothing(), document /contentlibrary/!campaign_templates,zzzpixel.htm))$ b`,
    {
      issues: [
        {
          name: "esp-more-closing-parentheses-than-opening",
          position: [[2, 101]]
        }
      ]
    },
    t
  ));

test(`30.09 - ${`\u001b[${31}m${`esp-more-closing-parentheses-than-opening`}\u001b[${39}m`} - single function-type ESP templating tag - #7 three removed`, t =>
  c2(
    `a $cond empty lookup(ZZZUID),nothing(), document(/contentlibrary/!campaign_templates,zzzpixel.htm))$ b`,
    {
      issues: [
        {
          name: "esp-more-closing-parentheses-than-opening",
          position: [[2, 100]]
        }
      ]
    },
    t
  ));

test(`30.10 - ${`\u001b[${31}m${`esp-more-closing-parentheses-than-opening`}\u001b[${39}m`} - single function-type ESP templating tag - #8 all removed, mini`, t =>
  c2(
    `a $cond ))$ b`,
    {
      issues: [
        {
          name: "esp-more-closing-parentheses-than-opening",
          position: [[2, 11]]
        }
      ]
    },
    t
  ));

test(`30.11 - ${`\u001b[${31}m${`esp-more-closing-parentheses-than-opening`}\u001b[${39}m`} - single function-type ESP templating tag - #8 all removed`, t =>
  c2(
    `a $cond empty lookup ZZZUID)),nothing ), document /contentlibrary/!campaign_templates,zzzpixel.htm))$ b`,
    {
      issues: [
        {
          name: "esp-more-closing-parentheses-than-opening",
          position: [[2, 101]]
        }
      ]
    },
    t
  ));

// 31. rule: "esp-more-opening-parentheses-than-closing"
// -----------------------------------------------------------------------------

test(`31.01 - ${`\u001b[${33}m${`esp-more-opening-parentheses-than-closing`}\u001b[${39}m`} - Responsys-style nested function`, t =>
  c(
    `a $cond(empty(lookup(ZZZUID)),nothing(), document(/contentlibrary/!campaign_templates,zzzpixel.htm))$ b`,
    t
  ));

test(`31.02 - ${`\u001b[${33}m${`esp-more-opening-parentheses-than-closing`}\u001b[${39}m`} - single function-type ESP templating tag`, t =>
  c2(
    `a $cond(()$ b`,
    {
      issues: [
        {
          name: "esp-more-opening-parentheses-than-closing",
          position: [[2, 11]]
        }
      ]
    },
    t
  ));

test(`31.03 - ${`\u001b[${33}m${`esp-more-opening-parentheses-than-closing`}\u001b[${39}m`} - single function-type ESP templating tag - 1st paren removed`, t =>
  c2(
    `a $cond(empty(lookup(ZZZUID ),nothing(), document(/contentlibrary/!campaign_templates,zzzpixel.htm))$ b`,
    {
      issues: [
        {
          name: "esp-more-opening-parentheses-than-closing",
          position: [[2, 101]]
        }
      ]
    },
    t
  ));

test(`31.04 - ${`\u001b[${33}m${`esp-more-opening-parentheses-than-closing`}\u001b[${39}m`} - single function-type ESP templating tag - 2nd paren removed`, t =>
  c2(
    `a $cond(empty(lookup(ZZZUID) ,nothing(), document(/contentlibrary/!campaign_templates,zzzpixel.htm))$ b`,
    {
      issues: [
        {
          name: "esp-more-opening-parentheses-than-closing",
          position: [[2, 101]]
        }
      ]
    },
    t
  ));

test(`31.05 - ${`\u001b[${33}m${`esp-more-opening-parentheses-than-closing`}\u001b[${39}m`} - single function-type ESP templating tag - 3rd paren removed`, t =>
  c2(
    `a $cond(empty(lookup(ZZZUID)),nothing( , document(/contentlibrary/!campaign_templates,zzzpixel.htm))$ b`,
    {
      issues: [
        {
          name: "esp-more-opening-parentheses-than-closing",
          position: [[2, 101]]
        }
      ]
    },
    t
  ));

test(`31.06 - ${`\u001b[${33}m${`esp-more-opening-parentheses-than-closing`}\u001b[${39}m`} - single function-type ESP templating tag - 4th paren removed`, t =>
  c2(
    `a $cond(empty(lookup(ZZZUID)),nothing(), document(/contentlibrary/!campaign_templates,zzzpixel.htm)$ b`,
    {
      issues: [
        {
          name: "esp-more-opening-parentheses-than-closing",
          position: [[2, 100]]
        }
      ]
    },
    t
  ));

test(`31.07 - ${`\u001b[${33}m${`esp-more-opening-parentheses-than-closing`}\u001b[${39}m`} - single function-type ESP templating tag - 5th paren removed`, t =>
  c2(
    `a $cond(empty(lookup(ZZZUID)),nothing(), document(/contentlibrary/!campaign_templates,zzzpixel.html)$ b`,
    {
      issues: [
        {
          name: "esp-more-opening-parentheses-than-closing",
          position: [[2, 101]]
        }
      ]
    },
    t
  ));

// ======

test(`31.08 - ${`\u001b[${33}m${`esp-more-opening-parentheses-than-closing`}\u001b[${39}m`} - single function-type ESP templating tag - two parens removed`, t =>
  c2(
    `a $cond(empty(lookup(ZZZUID,nothing(), document(/contentlibrary/!campaign_templates,zzzpixel.htm))$ b`,
    {
      issues: [
        {
          name: "esp-more-opening-parentheses-than-closing",
          position: [[2, 99]]
        }
      ]
    },
    t
  ));

test(`31.09 - ${`\u001b[${33}m${`esp-more-opening-parentheses-than-closing`}\u001b[${39}m`} - single function-type ESP templating tag - three parens removed`, t =>
  c2(
    `a $cond(empty(lookup(ZZZUID,nothing(, document(/contentlibrary/!campaign_templates,zzzpixel.htm))$ b`,
    {
      issues: [
        {
          name: "esp-more-opening-parentheses-than-closing",
          position: [[2, 98]]
        }
      ]
    },
    t
  ));

test(`31.10 - ${`\u001b[${33}m${`esp-more-opening-parentheses-than-closing`}\u001b[${39}m`} - single function-type ESP templating tag - all parens removed`, t =>
  c2(
    `a $cond(empty(lookup(ZZZUID,nothing(, document(/contentlibrary/!campaign_templates,zzzpixel.htm$ b`,
    {
      issues: [
        {
          name: "esp-more-opening-parentheses-than-closing",
          position: [[2, 96]]
        }
      ]
    },
    t
  ));

// 32. rule "esp-line-break-within-templating-tag"
// -----------------------------------------------------------------------------

test(`32.01 - ${`\u001b[${34}m${`esp-line-break-within-templating-tag`}\u001b[${39}m`} - multiple line breaks`, t =>
  c2(
    `a $cond(\r\nsomething\nhere)$ b`,
    {
      issues: [
        {
          name: "esp-line-break-within-templating-tag",
          position: [[8, 10]]
        },
        {
          name: "esp-line-break-within-templating-tag",
          position: [[19, 20]]
        }
      ]
    },
    t
  ));

// 33. HTML comments
// -----------------------------------------------------------------------------

test(`33.01 - ${`\u001b[${35}m${`HTML comments`}\u001b[${39}m`} - single < character`, t =>
  c(`<`, `&lt;`, "bad-character-unencoded-opening-bracket", t));

test(`33.02 - ${`\u001b[${35}m${`HTML comments`}\u001b[${39}m`} - simple commented tag`, t =>
  c(`abc <!--<d>--> xyz`, t));

test(`33.03 - ${`\u001b[${35}m${`HTML comments`}\u001b[${39}m`} - simple commented text`, t =>
  c(`abc <!--text--> xyz`, t));

test(`33.04 - ${`\u001b[${35}m${`HTML comments`}\u001b[${39}m`} - does not mangle the legit HTML comments`, t => {
  c(`<!--<a href="xxx" target="_blank">z</a>-->`, t);
  c(`<!-- <a href="xxx" target="_blank">z</a> -->`, t);
  c(`<!--\n<a href="xxx" target="_blank">z</a>\n-->`, t);
});

test(`33.05 - ${`\u001b[${35}m${`HTML comments`}\u001b[${39}m`} - space after 1st`, t =>
  c(`abc < !--<d>--> xyz`, `abc <!--<d>--> xyz`, "html-comment-spaces", t));

test(`33.06 - ${`\u001b[${35}m${`HTML comments`}\u001b[${39}m`} - spaces after 1st`, t =>
  c(
    `abc <  \t !--<d>--> xyz`,
    `abc <!--<d>--> xyz`,
    ["bad-character-character-tabulation", "html-comment-spaces"],
    t
  ));

test(`33.07 - ${`\u001b[${35}m${`HTML comments`}\u001b[${39}m`} - space after 2nd`, t =>
  c(`abc <! --<d>--> xyz`, `abc <!--<d>--> xyz`, "html-comment-spaces", t));

test(`33.08 - ${`\u001b[${35}m${`HTML comments`}\u001b[${39}m`} - spaces after 2nd`, t =>
  c(`abc <!  \n --<d>--> xyz`, `abc <!--<d>--> xyz`, "html-comment-spaces", t));

test(`33.09 - ${`\u001b[${35}m${`HTML comments`}\u001b[${39}m`} - space after 3rd`, t =>
  c(`abc <!- -<d>--> xyz`, `abc <!--<d>--> xyz`, "html-comment-spaces", t));

test(`33.10 - ${`\u001b[${35}m${`HTML comments`}\u001b[${39}m`} - spaces after 3rd`, t =>
  c(`abc <!-  \n -<d>--> xyz`, `abc <!--<d>--> xyz`, "html-comment-spaces", t));

test(`33.11 - ${`\u001b[${35}m${`HTML comments`}\u001b[${39}m`} - multiple`, t =>
  c(
    `abc <!-  \n --<d>--> xyz`,
    `abc <!--<d>--> xyz`,
    ["html-comment-redundant-dash", "html-comment-spaces"],
    t
  ));

test(`33.12 - ${`\u001b[${35}m${`HTML comments`}\u001b[${39}m`} - repeated dashes`, t =>
  c(
    `abc <!- - - - - - - - - - - <d>--> xyz`,
    `abc <!--<d>--> xyz`,
    ["html-comment-redundant-dash", "html-comment-spaces"],
    t
  ));

// 34. rule "bad-character-unencoded-ampersand"
// -----------------------------------------------------------------------------

test(`34.01 - ${`\u001b[${36}m${`code chunk skipping`}\u001b[${39}m`} - slash missing on closing <script> tag`, t =>
  c(`<a></a>&`, `<a></a>&amp;`, "bad-character-unencoded-ampersand", t));

// let's place excaped backtick strategically, before the closing </script>,
// so that if the "within quotes" state is wrongly identified, tag closing
// will kick in, then all the "errors" that follow within same script tag
// will be flagged up.
test(`34.02 - ${`\u001b[${36}m${`code chunk skipping`}\u001b[${39}m`} - slash missing on closing <script> tag`, t =>
  c(
    `<xyz><b>a</b></xyz>&`,
    `<xyz><b>a</b></xyz>&amp;`,
    "bad-character-unencoded-ampersand",
    t
  ));

test(`34.03 - ${`\u001b[${36}m${`code chunk skipping`}\u001b[${39}m`} - slash missing on closing <script> tag`, t =>
  c(
    `<xyz><script>const klm =\\\` \`</script>'"\`</script></xyz>&`,
    `<xyz><script>const klm =\\\` \`</script>'"\`</script></xyz>&amp;`,
    "bad-character-unencoded-ampersand",
    t
  ));

// 35. rule "tag-duplicate-closing-slash"
// -----------------------------------------------------------------------------

test(`35.01 - ${`\u001b[${32}m${`tag-duplicate-closing-slash`}\u001b[${39}m`} - double slash, tight`, t =>
  c(`<a something//>`, `<a something/>`, "tag-duplicate-closing-slash", t));

test(`35.02 - ${`\u001b[${32}m${`tag-duplicate-closing-slash`}\u001b[${39}m`} - double slash space`, t =>
  c(
    `<a something// >`,
    `<a something/>`,
    ["tag-duplicate-closing-slash", "tag-whitespace-closing-slash-and-bracket"],
    t
  ));

test(`35.03 - ${`\u001b[${32}m${`tag-duplicate-closing-slash`}\u001b[${39}m`} - space double slash`, t =>
  c(
    `<a something //>`,
    `<a something/>`,
    ["tag-duplicate-closing-slash", "tag-excessive-whitespace-inside-tag"],
    t
  ));

test(`35.04 - ${`\u001b[${32}m${`tag-duplicate-closing-slash`}\u001b[${39}m`} - spaced double slash`, t =>
  c(
    `<a something // >`,
    `<a something/>`,
    [
      "tag-duplicate-closing-slash",
      "tag-excessive-whitespace-inside-tag",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    t
  ));

test(`35.05 - ${`\u001b[${32}m${`tag-duplicate-closing-slash`}\u001b[${39}m`} - excessive mixed-spacing slashes`, t =>
  c(
    `<a something / / / / / / / /////  / /   >`,
    `<a something/>`,
    [
      "tag-duplicate-closing-slash",
      "tag-excessive-whitespace-inside-tag",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    t
  ));

// 36. rule "tag-closing-left-slash"
// -----------------------------------------------------------------------------

// single

test(`36.01 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - left slash, tight`, t =>
  c(`<a something\\>`, `<a something/>`, "tag-closing-left-slash", t));

test(`36.02 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - left slash, space left`, t =>
  c(
    `<a something \\>`,
    `<a something/>`,
    ["tag-closing-left-slash", "tag-excessive-whitespace-inside-tag"],
    t
  ));

test(`36.03 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - left slash, space left`, t =>
  c(
    `<a something  \\>`,
    `<a something/>`,
    ["tag-closing-left-slash", "tag-excessive-whitespace-inside-tag"],
    t
  ));

test(`36.04 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - left slash, space right`, t =>
  c(
    `<a something\\ >`,
    `<a something/>`,
    ["tag-closing-left-slash", "tag-excessive-whitespace-inside-tag"],
    t
  ));

test(`36.05 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - left slash, excessive space left`, t =>
  c(
    `<a something  \n  \\>`,
    `<a something/>`,
    ["tag-closing-left-slash", "tag-excessive-whitespace-inside-tag"],
    t
  ));

test(`36.06 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - left slash, excessive space right`, t =>
  c(
    `<a something\\ \n  >`,
    `<a something/>`,
    ["tag-closing-left-slash", "tag-excessive-whitespace-inside-tag"],
    t
  ));

// double

test(`36.07 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - double left slash, tight`, t =>
  c(`<a something\\\\>`, `<a something/>`, "tag-closing-left-slash", t));

test(`36.08 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - double left slash, left space`, t =>
  c(
    `<a something \\\\>`,
    `<a something/>`,
    ["tag-closing-left-slash", "tag-excessive-whitespace-inside-tag"],
    t
  ));

test(`36.09 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - double left slash, right space`, t =>
  c(
    `<a something\\\\ >`,
    `<a something/>`,
    ["tag-closing-left-slash", "tag-excessive-whitespace-inside-tag"],
    t
  ));

test(`36.10 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - double left slash, spaced`, t =>
  c(
    `<a something \\\\ >`,
    `<a something/>`,
    ["tag-closing-left-slash", "tag-excessive-whitespace-inside-tag"],
    t
  ));

test(`36.11 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - double left slash, excessive left space`, t =>
  c(
    `<a something      \n \\\\>`,
    `<a something/>`,
    ["tag-closing-left-slash", "tag-excessive-whitespace-inside-tag"],
    t
  ));

test(`36.12 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - double left slash, excessive left space`, t =>
  c(
    `<a something      \n \\\\>`,
    `<a something/>`,
    ["tag-closing-left-slash", "tag-excessive-whitespace-inside-tag"],
    t
  ));

test(`36.13 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - double left slash, excessively spaced`, t =>
  c(
    `<a something      \n \\\\    \n>`,
    `<a something/>`,
    ["tag-closing-left-slash", "tag-excessive-whitespace-inside-tag"],
    t
  ));

test(`36.14 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - multiple left slashes, excessively spaced`, t =>
  c(
    `<a something      \n \\ \n \\  \\  \n>`,
    `<a something/>`,
    ["tag-closing-left-slash", "tag-excessive-whitespace-inside-tag"],
    t
  ));

// mixed with right slashes

test(`36.15 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - mixed with right slashes #1`, t =>
  c(
    `<a something      \n \\ \n  \\  \\ / \n>`,
    `<a something/>`,
    [
      "tag-closing-left-slash",
      "tag-excessive-whitespace-inside-tag",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    t
  ));

test(`36.16 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - mixed with right slashes #2`, t =>
  c(
    `<a something    /  \n \\ \n  \\  \\ \n>`,
    `<a something/>`,
    ["tag-closing-left-slash", "tag-excessive-whitespace-inside-tag"],
    t
  ));

test(`36.17 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - mixed with right slashes #3`, t =>
  c(
    `<a something    /  \n \\ \n / \\  \\ / \n>`,
    `<a something/>`,
    [
      "tag-closing-left-slash",
      "tag-excessive-whitespace-inside-tag",
      "tag-whitespace-closing-slash-and-bracket"
    ],
    t
  ));

// XX. ad hoc
// -----------------------------------------------------------------------------

test(`XX.01 - ${`\u001b[${31}m${`adhoc #1`}\u001b[${39}m`} - just a closing tag`, t => {
  const good = `</a>`;
  const res = lint(good);
  t.deepEqual(getUniqueIssueNames(res.issues), [], "XX.01");
});

test(`XX.02 - ${`\u001b[${31}m${`adhoc #2`}\u001b[${39}m`} - mailchimp templating tags`, t => {
  const good = `<td mc:edit="cta">`;
  const res = lint(good);
  t.deepEqual(getUniqueIssueNames(res.issues), [], "XX.02");
});

test(`XX.03 - ${`\u001b[${31}m${`adhoc #3`}\u001b[${39}m`} - correct entities`, t => {
  const good = `abc&nbsp;def`;
  const res = lint(good);
  t.deepEqual(getUniqueIssueNames(res.issues), [], "XX.03");
});

// xx. TODO's
// -----------------------------------------------------------------------------

// todo - duplicate attribute - boolean and normal, with a value
// todo - tag-missing-closing-bracket, where there's also hanging slash but no bracket
// todo - duplicate closing bracket
// todo - duplicate closing quotes
// todo - duplicate opening quotes
// what if un-pushed logAttr is still available when logTag is closing?
// test.todo("same opening/closing quotes repeated twice") <img width=""zzz"/>
// test.todo("file-xhtml-tag-ending");
// test.todo("file-html-tag-ending");
// test.todo("file-trailing-line-break-present");
// test.todo("file-trailing-line-break-absent");
// stray letters at the end of a line, surrounded by tag one the left and EOL
// <a b="cd "fg>
// <td width="100 nowrap>
// <>< ><gh="ij">< ><>
// <table ab="bb cc="dd">
// messed up HTML comments - excl. mark missing, dash missing etc
// zzzz < !DOCTYPE html> zzzz - should mention doctype
// zzzz < ! DOCTYPE html> zzzz - should mention doctype
// zzzz < !   DOCTYPE html> zzzz - should mention doctype
// zzzz <    !   DOCTYPE html> zzzz - should mention doctype
// �

// todo - attr with quotes/value missing (equal dangling), ensure that when attribute enforcing is on, and that attribute is enforced, instead of removal, empty quotes are added for that attr. For example, imagine forcing all img to have alt. Source: <img src="zzz" alt=>. Result: <img src="zzz" alt="">. That's opposite of usual approach of removing the attribute completely.

// TODO:
// https://stackoverflow.com/a/33811648/3943954
// Escape the following characters with HTML entity encoding ...
// & --> &amp;
// < --> &lt;
// > --> &gt;
// " --> &quot;
// "...escape all characters with ASCII values more than 256"
