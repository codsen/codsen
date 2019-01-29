import test from "ava";
import { emlint } from "../dist/emlint.esm";
import apply from "ranges-apply";
// import errors from "../src/errors.json";

// 00. Insurance
// -----------------------------------------------------------------------------

test(`00.01 - ${`\u001b[${33}m${`arg. validation`}\u001b[${39}m`} - 1st input arg wrong`, t => {
  const error1 = t.throws(() => {
    emlint(true);
  });
  t.regex(error1.message, /THROW_ID_01/);
});

test(`00.02 - ${`\u001b[${33}m${`arg. validation`}\u001b[${39}m`} - 2nd input arg wrong`, t => {
  const error1 = t.throws(() => {
    emlint("a", true);
  });
  t.regex(error1.message, /THROW_ID_02/);
});

// 01. rule "space-after-opening-bracket"
// -----------------------------------------------------------------------------
test(`01.00 - ${`\u001b[${35}m${`space between the tag name and opening bracket`}\u001b[${39}m`} - all fine (control)`, t => {
  t.is(emlint("<table>").issues.length, 0, "01.00.01");
});

test(`01.01 - ${`\u001b[${35}m${`space between the tag name and opening bracket`}\u001b[${39}m`} - single space`, t => {
  const bad1 = "< table>";
  const bad2 = "<    table>";
  const bad3 = "< \n\n\n\t\t\t   table>";
  const good = "<table>";

  const res1 = emlint(bad1);
  const res2 = emlint(bad2);
  const res3 = emlint(bad3);

  // there's only one issue:
  t.is(res1.issues.length, 1, "01.01.01");
  t.is(res1.issues[0].name, "space-after-opening-bracket", "01.01.02");
  t.deepEqual(res1.issues[0].position, [[1, 2]], "01.01.03");

  t.is(res2.issues.length, 1, "01.01.04");
  t.is(res2.issues[0].name, "space-after-opening-bracket", "01.01.05");
  t.deepEqual(res2.issues[0].position, [[1, 5]], "01.01.06");

  t.is(res3.issues.length, 4, "01.01.07");
  const uniqueIssueNames = [];
  res3.issues.forEach(issueObj => {
    if (!uniqueIssueNames.includes(issueObj.name)) {
      uniqueIssueNames.push(issueObj.name);
    }
  });
  t.truthy(
    uniqueIssueNames.includes("space-after-opening-bracket"),
    "01.01.08-1"
  );
  t.truthy(
    uniqueIssueNames.includes("bad-character-character-tabulation"),
    "01.01.08-2"
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
      const res1 = emlint(bad1);
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
      const res2 = emlint(bad2);
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
