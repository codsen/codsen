import { readFileSync } from "fs";
import path from "path";
import test from "ava";
import c from "../dist/lerna-clean-changelogs.esm";
import { version } from "../package.json";

const fixtures = path.join(__dirname, "fixtures");

function compare(t, name) {
  const changelog = readFileSync(path.join(fixtures, `${name}.md`), "utf8");
  const expected = readFileSync(
    path.join(fixtures, `${name}.expected.md`),
    "utf8"
  );
  return t.is(c(changelog).res, expected);
}

// 00. insurance
// -----------------------------------------------------------------------------

test(`00.01 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - missing 1st arg`, t => {
  const error1 = t.throws(() => {
    c();
  });
  t.regex(error1.message, /THROW_ID_01/, "completely missing");

  const error2 = t.throws(() => {
    c(undefined);
  });
  t.regex(error2.message, /THROW_ID_01/, 'passed as a literal "undefined"');
});

test(`00.02 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - 1st arg of a wrong type`, t => {
  const error1 = t.throws(() => {
    c(1);
  });
  t.regex(error1.message, /THROW_ID_02/, "00.02.01");
  t.regex(error1.message, /number/, "00.02.02");

  const error2 = t.throws(() => {
    c(true);
  });
  t.regex(error2.message, /THROW_ID_02/, "00.02.03");
  t.regex(error2.message, /boolean/, "00.02.04");

  const error3 = t.throws(() => {
    c([]);
  });
  t.regex(error3.message, /THROW_ID_02/, "00.02.05");
  t.regex(error3.message, /array/, "00.02.06");

  const error4 = t.throws(() => {
    c(null);
  });
  t.regex(error4.message, /THROW_ID_02/, "00.02.07");
  t.regex(error4.message, /null/, "00.02.08");

  const error5 = t.throws(() => {
    c({});
  });
  t.regex(error5.message, /THROW_ID_02/, "00.02.09");
  t.regex(error5.message, /object/, "00.02.10");
});

test(`00.03 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - 1st arg is empty string`, t => {
  t.deepEqual(
    c(""),
    {
      res: "",
      version
    },
    "00.03"
  );
});

// 01. cleaning
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${35}m${`cleaning`}\u001b[${39}m`} - deletes bump-only entries together with their headings`, t =>
  compare(t, "01_deletes_bump-only"));

test(`01.02 - ${`\u001b[${35}m${`cleaning`}\u001b[${39}m`} - turns h1 headings within body into h2`, t =>
  compare(t, "02_remove_h1_tags_in_body"));
