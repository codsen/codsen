import { readFileSync } from "fs";
import path from "path";
import tap from "tap";
import c from "../dist/lerna-clean-changelogs.esm";
import { version } from "../package.json";

const fixtures = path.join(__dirname, "fixtures");

function compare(t, name) {
  const changelog = readFileSync(path.join(fixtures, `${name}.md`), "utf8");
  const expected = readFileSync(
    path.join(fixtures, `${name}.expected.md`),
    "utf8"
  );
  return t.equal(c(changelog).res, expected);
}

// 00. insurance
// -----------------------------------------------------------------------------

tap.test(
  `00.01 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - missing 1st arg`,
  (t) => {
    t.throws(() => {
      c();
    }, /THROW_ID_01/g);

    t.throws(() => {
      c(undefined);
    }, /THROW_ID_01/g);
    t.end();
  }
);

tap.test(
  `00.02 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - 1st arg of a wrong type`,
  (t) => {
    t.throws(() => {
      c(1);
    }, /THROW_ID_02/g);

    t.throws(() => {
      c(true);
    }, /THROW_ID_02/g);

    t.throws(() => {
      c([]);
    }, /THROW_ID_02/g);

    t.throws(() => {
      c(null);
    }, /THROW_ID_02/g);

    t.throws(() => {
      c({});
    }, /THROW_ID_02/g);

    t.end();
  }
);

tap.test(
  `00.03 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - 1st arg is empty string`,
  (t) => {
    t.same(
      c(""),
      {
        res: "",
        version,
      },
      "00.03"
    );

    t.end();
  }
);

// 01. cleaning
// -----------------------------------------------------------------------------

tap.test(
  `01.01 - ${`\u001b[${35}m${`cleaning`}\u001b[${39}m`} - deletes bump-only entries together with their headings`,
  (t) => {
    compare(t, "01_deletes_bump-only");
    t.end();
  }
);

tap.test(
  `01.02 - ${`\u001b[${35}m${`cleaning`}\u001b[${39}m`} - turns h1 headings within body into h2`,
  (t) => {
    compare(t, "02_remove_h1_tags_in_body");
    t.end();
  }
);

tap.test(
  `01.03 - ${`\u001b[${35}m${`cleaning`}\u001b[${39}m`} - cleans whitespace and replaces bullet dashes with asterisks`,
  (t) => {
    compare(t, "03_whitespace");
    t.end();
  }
);

tap.test(
  `01.04 - ${`\u001b[${35}m${`cleaning`}\u001b[${39}m`} - removes WIP entries`,
  (t) => {
    compare(t, "04_wip");
    t.end();
  }
);
