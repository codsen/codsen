import tap from "tap";
import collapse from "../dist/string-collapse-white-space.esm";

const key = ["crlf", "cr", "lf"];

// More tests on trimming, targetting algorithm's weakest spots
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trimming mixed lumps of trimmable characters`,
  (t) => {
    t.equal(collapse(`\t\t\t   \t\t\taaa\t\t\t   \t\t\t`).result, `aaa`, "01");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trimming mixed lumps of trimmable characters`,
  (t) => {
    t.equal(collapse(`   \t\t\t   aaa   \t\t\t   `).result, `aaa`, "02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trimming mixed lumps of trimmable characters`,
  (t) => {
    t.equal(collapse(`   \t \t \t   aaa   \t \t \t   `).result, `aaa`, "03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trimming mixed lumps of trimmable characters`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(
          `\t ${presentEolType} \t \r ${presentEolType}aaa\t \r \t ${presentEolType} \t ${presentEolType} \r\n \t \n`
        ).result,
        `aaa`,
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trims mixed white space lump into empty string`,
  (t) => {
    t.equal(collapse("      ").result, "", "05");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trims mixed white space lump into empty string`,
  (t) => {
    t.equal(collapse("\t\t\t   \t\t\t").result, "", "06");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trims mixed white space lump into empty string`,
  (t) => {
    t.equal(collapse("\t\t\t").result, "", "07");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trims mixed white space lump into empty string`,
  (t) => {
    ["\r\n", "\r", "\n"].forEach((presentEolType, idx) => {
      t.equal(
        collapse(`${presentEolType}${presentEolType}${presentEolType}`).result,
        "",
        `EOL ${key[idx]}`
      );
    });
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trim involving non-breaking spaces`,
  (t) => {
    t.equal(collapse(`\xa0   a   \xa0`).result, `\xa0 a \xa0`, "09");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trim involving non-breaking spaces`,
  (t) => {
    t.equal(
      collapse(`    \xa0     a     \xa0      `).result,
      `\xa0 a \xa0`,
      "10"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trim involving non-breaking spaces`,
  (t) => {
    t.equal(
      collapse(` \xa0 `, {
        trimStart: false,
        trimEnd: false,
      }).result,
      ` \xa0 `,
      "11"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - trim involving non-breaking spaces`,
  (t) => {
    t.equal(
      collapse(`  \xa0  `, {
        trimStart: false,
        trimEnd: false,
      }).result,
      ` \xa0 `,
      "12"
    );
    t.end();
  }
);

tap.test(`13 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - bracket`, (t) => {
  t.equal(
    collapse(`a > b`, {
      trimLines: true,
      recogniseHTML: true,
    }).result,
    `a > b`,
    "13.01"
  );
  t.equal(
    collapse(`a > b`, {
      trimLines: false,
      recogniseHTML: true,
    }).result,
    `a > b`,
    "13.02"
  );
  t.equal(
    collapse(`a > b`, {
      trimLines: true,
      recogniseHTML: false,
    }).result,
    `a > b`,
    "13.03"
  );
  t.equal(
    collapse(`a > b`, {
      trimLines: false,
      recogniseHTML: false,
    }).result,
    `a > b`,
    "13.04"
  );
  t.end();
});

tap.test(`14 - ${`\u001b[${32}m${`advanced`}\u001b[${39}m`} - bracket`, (t) => {
  t.equal(
    collapse(`<span>zzz</span> abc def ghij klm`, {
      trimLines: 1,
      recogniseHTML: 1,
    }).result,
    `<span>zzz</span> abc def ghij klm`,
    "14.01"
  );
  t.equal(
    collapse(`<span>zzz</span> abc def ghij klm`, {
      trimLines: 0,
      recogniseHTML: 1,
    }).result,
    `<span>zzz</span> abc def ghij klm`,
    "14.02"
  );
  t.equal(
    collapse(`<span>zzz</span> abc def ghij klm`, {
      trimLines: 1,
      recogniseHTML: 0,
    }).result,
    `<span>zzz</span> abc def ghij klm`,
    "14.03"
  );
  t.equal(
    collapse(`<span>zzz</span> abc def ghij klm`, {
      trimLines: 0,
      recogniseHTML: 0,
    }).result,
    `<span>zzz</span> abc def ghij klm`,
    "14.04"
  );
  t.end();
});
