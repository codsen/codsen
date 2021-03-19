import tap from "tap";
import {
  decode,
  uncertain,
  allNamedEntitiesSetOnly,
} from "all-named-html-entities";
import { fixEnt as fix } from "../dist/string-fix-broken-named-entities.esm";
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
        t.strictSame(
          fix(`&${singleEntity}`, {
            cb: (obj) => obj,
          }),
          [
            {
              ruleName: `bad-html-entity-malformed-${singleEntity}`,
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
  t.strictSame(
    fix("&pi", {
      cb: (obj) => {
        gatheredBroken.push([obj.rangeFrom, obj.rangeTo, obj.rangeValEncoded]);
        return [obj.rangeFrom, obj.rangeTo, obj.rangeValEncoded];
      },
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
    }),
    [[0, 3, "&pi;"]],
    "02.01"
  );
  t.is(gatheredBroken.length, 1, "02.02");
  t.is(gatheredHealthy.length, 0, "02.03");
  t.end();
});

tap.test("03 - larger set", (t) => {
  t.strictSame(
    fix("aaa&pi&piv&pi&pivaaa"),
    [
      [3, 6, "&pi;"],
      [6, 10, "&piv;"],
      [10, 13, "&pi;"],
      [13, 17, "&piv;"],
    ],
    "03"
  );
  t.end();
});

tap.test("04 - letters follow tightly", (t) => {
  t.strictSame(
    fix("aaa&ang&angst&ang&angstaaa"),
    [
      [3, 7, "&ang;"],
      [7, 13, "&angst;"],
      [13, 17, "&ang;"],
      [17, 23, "&angst;"],
    ],
    "04"
  );
  t.end();
});

tap.test(
  `05 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - control`,
  (t) => {
    t.strictSame(fix("z &ang; y"), [], "05");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - control`,
  (t) => {
    t.strictSame(fix("z &angst; y"), [], "06");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    t.strictSame(fix("z &ang y"), [[2, 6, "&ang;"]], "07");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    t.strictSame(fix("z &ang ;"), [[2, 8, "&ang;"]], "08");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    t.strictSame(fix("z &ang st"), [[2, 6, "&ang;"]], "09");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    t.strictSame(fix("z &ang sx"), [[2, 6, "&ang;"]], "10");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    t.strictSame(fix("z &angst y"), [[2, 8, "&angst;"]], "11");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    t.strictSame(
      fix("x &ang y&ang z"),
      [
        [2, 6, "&ang;"],
        [8, 12, "&ang;"],
      ],
      "12"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.strictSame(
      fix("&ang&ang"),
      [
        [0, 4, "&ang;"],
        [4, 8, "&ang;"],
      ],
      "13"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.strictSame(
      fix("text&angtext&angtext"),
      [
        [4, 8, "&ang;"],
        [12, 16, "&ang;"],
      ],
      "14"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.strictSame(
      fix("text&angsttext&angsttext"),
      [
        [4, 10, "&angst;"],
        [14, 20, "&angst;"],
      ],
      "15 - spaces are obligatory"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.strictSame(fix("text&angst"), [[4, 10, "&angst;"]], "16");
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.strictSame(
      fix("text&angst text&angst text"),
      [
        [4, 10, "&angst;"],
        [15, 21, "&angst;"],
      ],
      "17"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`pi`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.strictSame(
      fix("text&pitext&pitext"),
      [],
      "18 - won't fix, it's a dubious case"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`piv`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.strictSame(
      fix("text&pivtext&pivtext"),
      [
        [4, 8, "&piv;"],
        [12, 16, "&piv;"],
      ],
      "19"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`Pi`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.strictSame(
      fix("text&Pitext&Pitext"),
      [],
      "20 - also won't fix, it's not conclusive"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sigma`}\u001b[${39}m - not conclusive`,
  (t) => {
    t.strictSame(fix("text&sigma text&sigma text"), [], "21");
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sub`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.strictSame(fix("text&sub text&sub text"), [], "22");
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sup`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.strictSame(
      fix("text&suptext&suptext"),
      [
        [4, 8, "&sup;"],
        [12, 16, "&sup;"],
      ],
      "23"
    );
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`theta`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.strictSame(fix("text&theta text&theta text"), [], "24");
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - no decode, linebreaked`,
  (t) => {
    t.strictSame(
      fix("a &thinsp b\n&thinsp\nc"),
      [
        [2, 9, "&thinsp;"],
        [12, 19, "&thinsp;"],
      ],
      "25"
    );
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - joins`,
  (t) => {
    t.strictSame(fix("&thinsp"), [[0, 7, "&thinsp;"]], "26.01");
    t.strictSame(
      fix("&thinsp&thinsp"),
      [
        [0, 7, "&thinsp;"],
        [7, 14, "&thinsp;"],
      ],
      "26.02"
    );
    t.end();
  }
);

// with decode
// -----------------------------------------------------------------------------

tap.test(
  `27 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - with decode, spaced`,
  (t) => {
    t.strictSame(
      fix("text &ang text&ang text", { decode: true }),
      [
        [5, 9, "\u2220"],
        [14, 18, "\u2220"],
      ],
      "27"
    );
    t.end();
  }
);

tap.test(
  `28 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.strictSame(
      fix("text&angtext&angtext", { decode: true }),
      [
        [4, 8, "\u2220"],
        [12, 16, "\u2220"],
      ],
      "28"
    );
    t.end();
  }
);

tap.test(
  `29 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.strictSame(fix("text&angst", { decode: true }), [[4, 10, "\xC5"]], "29");
    t.end();
  }
);

tap.test(
  `30 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.strictSame(
      fix("text&angst text&angst text", { decode: true }),
      [
        [4, 10, "\xC5"],
        [15, 21, "\xC5"],
      ],
      "30"
    );
    t.end();
  }
);

tap.test(
  `31 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.strictSame(
      fix("text&angsttext&angsttext", { decode: true }),
      [
        [4, 10, "\xC5"],
        [14, 20, "\xC5"],
      ],
      "31"
    );
    t.end();
  }
);

tap.test(
  `32 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`pi`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.strictSame(fix("text&pi text&pi text", { decode: true }), [], "32");
    t.end();
  }
);

tap.test(
  `33 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`piv`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.strictSame(
      fix("text&pivtext&pivtext", { decode: true }),
      [
        [4, 8, "\u03D6"],
        [12, 16, "\u03D6"],
      ],
      "33"
    );
    t.end();
  }
);

tap.test(
  `34 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`Pi`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.strictSame(fix("text&Pi text&Pi text", { decode: true }), [], "34");
    t.end();
  }
);

tap.test(
  `35 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sigma`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.strictSame(fix("text&sigma text&sigma text", { decode: true }), [], "35");
    t.end();
  }
);

tap.test(
  `36 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sub`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.strictSame(fix("text&sub text&sub text", { decode: true }), [], "36");
    t.end();
  }
);

tap.test(
  `37 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sup`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.strictSame(
      fix("text&suptext&suptext", { decode: true }),
      [
        [4, 8, "\u2283"],
        [12, 16, "\u2283"],
      ],
      "37"
    );
    t.end();
  }
);

tap.test(
  `38 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`theta`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.strictSame(fix("text&theta text&theta text", { decode: true }), [], "38");
    t.end();
  }
);

tap.test(
  `39 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - with decode, line breaked`,
  (t) => {
    t.strictSame(
      fix("a &thinsp b\n&thinsp\nc", { decode: true }),
      [
        [2, 9, "\u2009"],
        [12, 19, "\u2009"],
      ],
      "39"
    );
    t.end();
  }
);

tap.test(
  `40 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - with decode, isolated`,
  (t) => {
    t.strictSame(fix("&thinsp", { decode: true }), [[0, 7, "\u2009"]], "40");
    t.end();
  }
);

tap.test(
  `41 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - joins`,
  (t) => {
    t.strictSame(
      fix("&thinsp&thinsp", { decode: true }),
      [
        [0, 7, "\u2009"],
        [7, 14, "\u2009"],
      ],
      "41"
    );
    t.end();
  }
);

tap.test("42 - single pi - exact value in front", (t) => {
  t.strictSame(fix("&pivaaa"), [[0, 4, "&piv;"]], "42");
  t.end();
});
