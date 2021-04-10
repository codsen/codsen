import tap from "tap";
import {
  decode,
  uncertain,
  allNamedEntitiesSetOnly,
} from "all-named-html-entities";
import fix from "./util/util";
import { fixEnt, allRules } from "../dist/string-fix-broken-named-entities.esm";

// -----------------------------------------------------------------------------
// programmatic tests
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${allNamedEntitiesSetOnly.size} programmatic tests in total`,
  (t) => {
    [...allNamedEntitiesSetOnly]
      .filter((entity) => !Object.keys(uncertain).includes(entity))
      .forEach((singleEntity, i, arr) => {
        //
        // semicolon missing, isolated:
        //
        const ruleName = `bad-html-entity-malformed-${singleEntity}`;
        t.ok(allRules.includes(ruleName), "04.01");
        t.strictSame(
          fixEnt(`&${singleEntity}`, {
            cb: (obj) => obj,
          }),
          [
            {
              ruleName,
              entityName: singleEntity,
              rangeFrom: 0,
              rangeTo: singleEntity.length + 1,
              rangeValEncoded: `&${singleEntity};`,
              rangeValDecoded: decode(`&${singleEntity};`),
            },
          ],
          `${singleEntity} - 02; ${i + 1}/${arr.length}`
        );
      });
    t.end();
  }
);

tap.test("02 - single pi", (t) => {
  const gatheredBroken = [];
  const gatheredHealthy = [];
  const gatheredAmps = [];
  const res = [[0, 3, "&pi;"]];
  t.strictSame(
    fixEnt("&pi", {
      cb: (obj) => {
        gatheredBroken.push([obj.rangeFrom, obj.rangeTo, obj.rangeValEncoded]);
        return [obj.rangeFrom, obj.rangeTo, obj.rangeValEncoded];
      },
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      textAmpersandCatcherCb: (idx) => {
        gatheredAmps.push(idx);
      },
    }),
    res,
    "02.01"
  );
  t.strictSame(
    fix(t, "&pi", {
      cb: (obj) => {
        return [obj.rangeFrom, obj.rangeTo, obj.rangeValEncoded];
      },
      entityCatcherCb: () => {},
      textAmpersandCatcherCb: () => {},
    }),
    res,
    "02.02"
  );
  t.is(gatheredBroken.length, 1, "02.03");
  t.strictSame(gatheredHealthy, [], "02.04");
  t.strictSame(gatheredAmps, [], "02.05");
  t.end();
});

tap.test("03 - larger set", (t) => {
  const gathered = [];
  const res = [
    [3, 6, "&pi;"],
    [6, 10, "&piv;"],
    [10, 13, "&pi;"],
    [13, 17, "&piv;"],
  ];
  t.strictSame(
    fixEnt("aaa&pi&piv&pi&pivaaa", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "03.01"
  );
  t.strictSame(
    fix(t, "aaa&pi&piv&pi&pivaaa", {
      textAmpersandCatcherCb: () => {},
    }),
    res,
    "03.02"
  );
  t.strictSame(gathered, [], "03.03");
  t.end();
});

tap.test("04 - letters follow tightly", (t) => {
  const gathered = [];
  const res = [
    [3, 7, "&ang;"],
    [7, 13, "&angst;"],
    [13, 17, "&ang;"],
    [17, 23, "&angst;"],
  ];
  t.strictSame(
    fixEnt("aaa&ang&angst&ang&angstaaa", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "04.01"
  );
  t.strictSame(
    fix(t, "aaa&ang&angst&ang&angstaaa", {
      textAmpersandCatcherCb: () => {},
    }),
    res,
    "04.02"
  );
  t.strictSame(gathered, [], "04.03");
  t.end();
});

tap.test(
  `05 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - control`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix(t, "z &ang; y", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "05.01"
    );
    t.strictSame(gathered, [], "05.02");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - control`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix(t, "z &angst; y", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "06.01"
    );
    t.strictSame(gathered, [], "06.02");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    const gathered = [];
    const res = [[2, 6, "&ang;"]];
    t.strictSame(
      fixEnt("z &ang y", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      res,
      "07.01"
    );
    t.strictSame(
      fix(t, "z &ang y", {
        textAmpersandCatcherCb: () => {},
      }),
      res,
      "07.02"
    );
    t.strictSame(gathered, [], "07.03");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    const gathered = [];
    const res = [[2, 8, "&ang;"]];
    t.strictSame(
      fixEnt("z &ang ;", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      res,
      "08.01"
    );
    t.strictSame(
      fix(t, "z &ang ;", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      res,
      "08.02"
    );
    t.strictSame(gathered, [], "08.03");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    const gathered = [];
    const res = [[2, 6, "&ang;"]];
    t.strictSame(
      fixEnt("z &ang st", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      res,
      "09.01"
    );
    t.strictSame(
      fix(t, "z &ang st", {
        textAmpersandCatcherCb: () => {},
      }),
      res,
      "09.02"
    );
    t.strictSame(gathered, [], "09.03");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    const gathered = [];
    const res = [[2, 6, "&ang;"]];
    t.strictSame(
      fixEnt("z &ang sx", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      res,
      "10.01"
    );
    t.strictSame(
      fix(t, "z &ang sx", {
        textAmpersandCatcherCb: () => {},
      }),
      res,
      "10.02"
    );
    t.strictSame(gathered, [], "10.03");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    const gathered = [];
    const res = [[2, 8, "&angst;"]];
    t.strictSame(
      fixEnt("z &angst y", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      res,
      "11.01"
    );
    t.strictSame(
      fix(t, "z &angst y", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      res,
      "11.02"
    );
    t.strictSame(gathered, [], "11.03");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    const gathered = [];
    const res = [
      [2, 6, "&ang;"],
      [8, 12, "&ang;"],
    ];
    t.strictSame(
      fixEnt("x &ang y&ang z", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      res,
      "12.01"
    );
    t.strictSame(
      fix(t, "x &ang y&ang z", {
        textAmpersandCatcherCb: () => {},
      }),
      res,
      "12.02"
    );
    t.strictSame(gathered, [], "12.03");
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    const res = [
      [0, 4, "&ang;"],
      [4, 8, "&ang;"],
    ];
    t.strictSame(
      fixEnt("&ang&ang", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      res,
      "13.01"
    );
    t.strictSame(
      fix(t, "&ang&ang", {
        textAmpersandCatcherCb: () => {},
      }),
      res,
      "13.02"
    );
    t.strictSame(gathered, [], "13.03");
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    const res = [
      [4, 8, "&ang;"],
      [12, 16, "&ang;"],
    ];
    t.strictSame(
      fixEnt("text&angtext&angtext", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      res,
      "14.01"
    );
    t.strictSame(
      fix(t, "text&angtext&angtext", {
        textAmpersandCatcherCb: () => {},
      }),
      res,
      "14.02"
    );
    t.strictSame(gathered, [], "14.03");
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    const res = [
      [4, 10, "&angst;"],
      [14, 20, "&angst;"],
    ];
    t.strictSame(
      fixEnt("text&angsttext&angsttext", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      res,
      "15.01 - spaces are obligatory"
    );
    t.strictSame(
      fix(t, "text&angsttext&angsttext", {
        textAmpersandCatcherCb: () => {},
      }),
      res,
      "15.02 - spaces are obligatory"
    );
    t.strictSame(gathered, [], "15.03");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    const input = "text&angst";
    const res = [[4, 10, "&angst;"]];
    t.strictSame(
      fixEnt(input, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      res,
      "16.01"
    );
    t.strictSame(
      fix(t, input, {
        textAmpersandCatcherCb: () => {},
      }),
      res,
      "16.02"
    );
    t.strictSame(gathered, [], "16.03");
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    const input = "text&angst text&angst text";
    const res = [
      [4, 10, "&angst;"],
      [15, 21, "&angst;"],
    ];
    t.strictSame(
      fixEnt(input, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      res,
      "17.01"
    );
    t.strictSame(
      fix(t, input, {
        textAmpersandCatcherCb: () => {},
      }),
      res,
      "17.02"
    );
    t.strictSame(gathered, [], "17.03");
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`pi`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    const input = "text&pitext&pitext";
    t.strictSame(
      fixEnt(input, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "18.01 - won't fix, it's a dubious case"
    );
    t.strictSame(
      fix(t, input, {
        textAmpersandCatcherCb: () => {},
      }),
      [],
      "18.02 - won't fix, it's a dubious case"
    );
    t.strictSame(gathered, [4, 11], "18.03");
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`piv`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    const input = "text&pivtext&pivtext";
    const res = [
      [4, 8, "&piv;"],
      [12, 16, "&piv;"],
    ];
    t.strictSame(
      fixEnt(input, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      res,
      "19.01"
    );
    t.strictSame(
      fix(t, input, {
        textAmpersandCatcherCb: () => {},
      }),
      res,
      "19.02"
    );
    t.strictSame(gathered, [], "19.03");
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`Pi`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    const input = "text&Pitext&Pitext";
    const res = [];
    t.strictSame(
      fixEnt(input, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      res,
      "20.01 - also won't fix, it's not conclusive"
    );
    t.strictSame(
      fix(t, input, {
        textAmpersandCatcherCb: () => {},
      }),
      res,
      "20.02 - also won't fix, it's not conclusive"
    );
    t.strictSame(gathered, [4, 11], "20.03");
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sigma`}\u001b[${39}m - not conclusive`,
  (t) => {
    const gathered = [];
    const input = "text&sigma text&sigma text";
    const res = [];
    t.strictSame(
      fixEnt(input, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      res,
      "21.01"
    );
    t.strictSame(
      fix(t, input, {
        textAmpersandCatcherCb: () => {},
      }),
      res,
      "21.02"
    );
    t.strictSame(gathered, [4, 15], "21.03");
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sub`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fixEnt("text&sub text&sub text", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "22.01"
    );
    t.strictSame(
      fix(t, "text&sub text&sub text", {
        textAmpersandCatcherCb: () => {},
      }),
      [],
      "22.02"
    );
    t.strictSame(gathered, [4, 13], "22.03");
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sup`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    const input = "text&suptext&suptext";
    const res = [
      [4, 8, "&sup;"],
      [12, 16, "&sup;"],
    ];
    t.strictSame(
      fixEnt(input, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      res,
      "23.01"
    );
    t.strictSame(
      fix(t, input, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      res,
      "23.02"
    );
    t.strictSame(gathered, [], "23.03");
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`theta`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    const input = "text&theta text&theta text";
    const res = [];
    t.strictSame(
      fixEnt(input, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      res,
      "24.01"
    );
    t.strictSame(
      fix(t, input, {
        textAmpersandCatcherCb: () => {},
      }),
      res,
      "24.02"
    );
    t.strictSame(gathered, [4, 15], "24.03");
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - no decode, linebreaked`,
  (t) => {
    const gathered = [];
    const input = "a &thinsp b\n&thinsp\nc";
    const result = [
      [2, 9, "&thinsp;"],
      [12, 19, "&thinsp;"],
    ];
    t.strictSame(
      fixEnt(input, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      result,
      "25.01"
    );
    t.strictSame(
      fix(t, input, {
        textAmpersandCatcherCb: () => {},
      }),
      result,
      "25.02"
    );
    t.strictSame(gathered, [], "25.03");
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - joins 1`,
  (t) => {
    const gathered = [];
    const input = "&thinsp";
    const result = [[0, 7, "&thinsp;"]];
    t.strictSame(
      fixEnt(input, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      result,
      "26.01"
    );
    t.strictSame(
      fix(t, input, {
        textAmpersandCatcherCb: () => {},
      }),
      result,
      "26.02"
    );
    t.strictSame(gathered, [], "26.03");
    t.end();
  }
);

tap.test(
  `27 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - joins 2`,
  (t) => {
    const gathered = [];
    const input = "&thinsp&thinsp";
    const result = [
      [0, 7, "&thinsp;"],
      [7, 14, "&thinsp;"],
    ];
    t.strictSame(
      fixEnt(input, {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      result,
      "27.01"
    );
    t.strictSame(
      fix(t, input, {
        textAmpersandCatcherCb: () => {},
      }),
      result,
      "27.02"
    );
    t.strictSame(gathered, [], "27.03");
    t.end();
  }
);

// with decode
// -----------------------------------------------------------------------------

tap.test(
  `28 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - with decode, spaced`,
  (t) => {
    const gathered = [];
    const input = "text &ang text&ang text";
    const result = [
      [5, 9, "\u2220"],
      [14, 18, "\u2220"],
    ];
    t.strictSame(
      fixEnt(input, {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      result,
      "28.01"
    );
    t.strictSame(
      fix(t, input, {
        decode: true,
        textAmpersandCatcherCb: () => {},
      }),
      result,
      "28.02"
    );
    t.strictSame(gathered, [], "28.03");
    t.end();
  }
);

tap.test(
  `29 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    const input = "text&angtext&angtext";
    const result = [
      [4, 8, "\u2220"],
      [12, 16, "\u2220"],
    ];
    t.strictSame(
      fixEnt(input, {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      result,
      "29.01"
    );
    t.strictSame(
      fix(t, input, {
        decode: true,
        textAmpersandCatcherCb: () => {},
      }),
      result,
      "29.02"
    );
    t.strictSame(gathered, [], "29.03");
    t.end();
  }
);

tap.test(
  `30 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    const input = "text&angst";
    const result = [[4, 10, "\xC5"]];
    t.strictSame(
      fixEnt(input, {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      result,
      "30.01"
    );
    t.strictSame(
      fix(t, input, {
        decode: true,
        textAmpersandCatcherCb: () => {},
      }),
      result,
      "30.02"
    );
    t.strictSame(gathered, [], "30.03");
    t.end();
  }
);

tap.test(
  `31 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    const input = "text&angst text&angst text";
    const result = [
      [4, 10, "\xC5"],
      [15, 21, "\xC5"],
    ];
    t.strictSame(
      fixEnt(input, {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      result,
      "31.01"
    );
    t.strictSame(
      fix(t, input, {
        decode: true,
        textAmpersandCatcherCb: () => {},
      }),
      result,
      "31.02"
    );
    t.strictSame(gathered, [], "31.03");
    t.end();
  }
);

tap.test(
  `32 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    const input = "text&angsttext&angsttext";
    const result = [
      [4, 10, "\xC5"],
      [14, 20, "\xC5"],
    ];
    t.strictSame(
      fixEnt(input, {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      result,
      "32.01"
    );
    t.strictSame(
      fix(t, input, {
        decode: true,
        textAmpersandCatcherCb: () => {},
      }),
      result,
      "32.02"
    );
    t.strictSame(gathered, [], "32.03");
    t.end();
  }
);

tap.test(
  `33 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`pi`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    const input = "text&pi text&pi text";
    const result = [];
    t.strictSame(
      fixEnt(input, {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      result,
      "33.01"
    );
    t.strictSame(
      fix(t, input, {
        decode: true,
        textAmpersandCatcherCb: () => {},
      }),
      result,
      "33.02"
    );
    t.strictSame(gathered, [4, 12], "33.03");
    t.end();
  }
);

tap.test(
  `34 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`piv`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    const input = "text&pivtext&pivtext";
    const result = [
      [4, 8, "\u03D6"],
      [12, 16, "\u03D6"],
    ];
    t.strictSame(
      fixEnt(input, {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      result,
      "34.01"
    );
    t.strictSame(
      fix(t, input, {
        decode: true,
        textAmpersandCatcherCb: () => {},
      }),
      result,
      "34.02"
    );
    t.strictSame(gathered, [], "34.03");
    t.end();
  }
);

tap.test(
  `35 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`Pi`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    const input = "text&Pi text&Pi text";
    const result = [];
    t.strictSame(
      fixEnt(input, {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      result,
      "35.01"
    );
    t.strictSame(
      fix(t, input, {
        decode: true,
        textAmpersandCatcherCb: () => {},
      }),
      result,
      "35.02"
    );
    t.strictSame(gathered, [4, 12], "35.03");
    t.end();
  }
);

tap.test(
  `36 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sigma`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    const input = "text&sigma text&sigma text";
    const result = [];
    t.strictSame(
      fixEnt(input, {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      result,
      "36.01"
    );
    t.strictSame(
      fix(t, input, {
        decode: true,
        textAmpersandCatcherCb: () => {},
      }),
      result,
      "36.02"
    );
    t.strictSame(gathered, [4, 15], "36.03");
    t.end();
  }
);

tap.test(
  `37 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sub`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    const input = "text&sub text&sub text";
    const result = [];
    t.strictSame(
      fixEnt(input, {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      result,
      "37.01"
    );
    t.strictSame(
      fix(t, input, {
        decode: true,
        textAmpersandCatcherCb: () => {},
      }),
      result,
      "37.02"
    );
    t.strictSame(gathered, [4, 13], "37.03");
    t.end();
  }
);

tap.test(
  `38 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sup`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    const input = "text&suptext&suptext";
    const result = [
      [4, 8, "\u2283"],
      [12, 16, "\u2283"],
    ];
    t.strictSame(
      fixEnt(input, {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      result,
      "38.01"
    );
    t.strictSame(
      fix(t, input, {
        decode: true,
        textAmpersandCatcherCb: () => {},
      }),
      result,
      "38.02"
    );
    t.strictSame(gathered, [], "38.03");
    t.end();
  }
);

tap.test(
  `39 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`theta`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    const input = "text&theta text&theta text";
    const result = [];
    t.strictSame(
      fixEnt(input, {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      result,
      "39.01"
    );
    t.strictSame(
      fix(t, input, {
        decode: true,
        textAmpersandCatcherCb: () => {},
      }),
      result,
      "39.02"
    );
    t.strictSame(gathered, [4, 15], "39.03");
    t.end();
  }
);

tap.test(
  `40 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - with decode, line breaked`,
  (t) => {
    const gathered = [];
    const input = "a &thinsp b\n&thinsp\nc";
    const result = [
      [2, 9, "\u2009"],
      [12, 19, "\u2009"],
    ];
    t.strictSame(
      fixEnt(input, {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      result,
      "40.01"
    );
    t.strictSame(
      fix(t, input, {
        decode: true,
        textAmpersandCatcherCb: () => {},
      }),
      result,
      "40.02"
    );
    t.strictSame(gathered, [], "40.03");
    t.end();
  }
);

tap.test(
  `41 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - with decode, isolated`,
  (t) => {
    const gathered = [];
    const input = "&thinsp";
    const result = [[0, 7, "\u2009"]];
    t.strictSame(
      fixEnt(input, {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      result,
      "41.01"
    );
    t.strictSame(
      fix(t, input, {
        decode: true,
        textAmpersandCatcherCb: () => {},
      }),
      result,
      "41.02"
    );
    t.strictSame(gathered, [], "41.03");
    t.end();
  }
);

tap.test(
  `42 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - joins`,
  (t) => {
    const gathered = [];
    const input = "&thinsp&thinsp";
    const result = [
      [0, 7, "\u2009"],
      [7, 14, "\u2009"],
    ];
    t.strictSame(
      fixEnt(input, {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      result,
      "42.01"
    );
    t.strictSame(
      fix(t, input, {
        decode: true,
        textAmpersandCatcherCb: () => {},
      }),
      result,
      "42.02"
    );
    t.strictSame(gathered, [], "42.03");
    t.end();
  }
);

tap.test("43 - single pi - exact value in front", (t) => {
  const gathered = [];
  const input = "&pivaaa";
  const result = [[0, 4, "&piv;"]];
  t.strictSame(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "43.01"
  );
  t.strictSame(
    fix(t, input, {
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "43.02"
  );
  t.strictSame(gathered, [], "43.03");
  t.end();
});
