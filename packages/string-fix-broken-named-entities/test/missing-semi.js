import tap from "tap";
import {
  decode,
  uncertain,
  allNamedEntitiesSetOnly,
} from "all-named-html-entities";
import fix from "../dist/string-fix-broken-named-entities.esm";
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
        t.same(
          fix(`&${singleEntity}`, {
            cb: (obj) => obj,
          }),
          [
            {
              ruleName: `bad-named-html-entity-malformed-${singleEntity}`,
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
  t.same(
    fix("&pi", {
      cb: (obj) => {
        gatheredBroken.push([obj.rangeFrom, obj.rangeTo, obj.rangeValEncoded]);
        return [obj.rangeFrom, obj.rangeTo, obj.rangeValEncoded];
      },
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
    }),
    [[0, 3, "&pi;"]],
    "02"
  );
  t.is(gatheredBroken.length, 1);
  t.is(gatheredHealthy.length, 0);
  t.end();
});

tap.test("03 - larger set", (t) => {
  t.same(
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
  t.same(
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
    t.same(fix("z &ang; y"), [], "05");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - control`,
  (t) => {
    t.same(fix("z &angst; y"), [], "06");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    t.same(fix("z &ang y"), [[2, 6, "&ang;"]], "07");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    t.same(fix("z &ang ;"), [[2, 8, "&ang;"]], "08");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    t.same(fix("z &ang st"), [[2, 6, "&ang;"]], "09");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    t.same(fix("z &ang sx"), [[2, 6, "&ang;"]], "10");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    t.same(fix("z &angst y"), [[2, 8, "&angst;"]], "11");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    t.same(
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
    t.same(
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
  `17 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.same(
      fix("text&angtext&angtext"),
      [
        [4, 8, "&ang;"],
        [12, 16, "&ang;"],
      ],
      "17"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.same(
      fix("text&angsttext&angsttext"),
      [
        [4, 10, "&angst;"],
        [14, 20, "&angst;"],
      ],
      "18 - spaces are obligatory"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.same(fix("text&angst"), [[4, 10, "&angst;"]], "19");
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.same(
      fix("text&angst text&angst text"),
      [
        [4, 10, "&angst;"],
        [15, 21, "&angst;"],
      ],
      "20"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`pi`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.same(
      fix("text&pitext&pitext"),
      [],
      "21 - won't fix, it's a dubious case"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`piv`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.same(
      fix("text&pivtext&pivtext"),
      [
        [4, 8, "&piv;"],
        [12, 16, "&piv;"],
      ],
      "22"
    );
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`Pi`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.same(
      fix("text&Pitext&Pitext"),
      [],
      "23 - also won't fix, it's not conclusive"
    );
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sigma`}\u001b[${39}m - not conclusive`,
  (t) => {
    t.same(fix("text&sigma text&sigma text"), [], "24");
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sub`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.same(fix("text&sub text&sub text"), [], "25");
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sup`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.same(
      fix("text&suptext&suptext"),
      [
        [4, 8, "&sup;"],
        [12, 16, "&sup;"],
      ],
      "26"
    );
    t.end();
  }
);

tap.test(
  `27 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`theta`}\u001b[${39}m - no decode, tight`,
  (t) => {
    t.same(fix("text&theta text&theta text"), [], "27");
    t.end();
  }
);

tap.test(
  `28 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - no decode, linebreaked`,
  (t) => {
    t.same(
      fix("a &thinsp b\n&thinsp\nc"),
      [
        [2, 9, "&thinsp;"],
        [12, 19, "&thinsp;"],
      ],
      "28"
    );
    t.end();
  }
);

tap.test(
  `29 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - joins`,
  (t) => {
    t.same(fix("&thinsp"), [[0, 7, "&thinsp;"]], "04.001.12");
    t.same(
      fix("&thinsp&thinsp"),
      [
        [0, 7, "&thinsp;"],
        [7, 14, "&thinsp;"],
      ],
      "29"
    );
    t.end();
  }
);

// with decode
// -----------------------------------------------------------------------------

tap.test(
  `30 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - with decode, spaced`,
  (t) => {
    t.same(
      fix("text &ang text&ang text", { decode: true }),
      [
        [5, 9, "\u2220"],
        [14, 18, "\u2220"],
      ],
      "30"
    );
    t.end();
  }
);

tap.test(
  `31 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(
      fix("text&angtext&angtext", { decode: true }),
      [
        [4, 8, "\u2220"],
        [12, 16, "\u2220"],
      ],
      "31"
    );
    t.end();
  }
);

tap.test(
  `32 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(fix("text&angst", { decode: true }), [[4, 10, "\xC5"]], "32");
    t.end();
  }
);

tap.test(
  `33 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(
      fix("text&angst text&angst text", { decode: true }),
      [
        [4, 10, "\xC5"],
        [15, 21, "\xC5"],
      ],
      "33"
    );
    t.end();
  }
);

tap.test(
  `34 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(
      fix("text&angsttext&angsttext", { decode: true }),
      [
        [4, 10, "\xC5"],
        [14, 20, "\xC5"],
      ],
      "34"
    );
    t.end();
  }
);

tap.test(
  `35 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`pi`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(fix("text&pi text&pi text", { decode: true }), [], "35");
    t.end();
  }
);

tap.test(
  `36 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`piv`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(
      fix("text&pivtext&pivtext", { decode: true }),
      [
        [4, 8, "\u03D6"],
        [12, 16, "\u03D6"],
      ],
      "36"
    );
    t.end();
  }
);

tap.test(
  `37 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`Pi`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(fix("text&Pi text&Pi text", { decode: true }), [], "37");
    t.end();
  }
);

tap.test(
  `38 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sigma`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(fix("text&sigma text&sigma text", { decode: true }), [], "38");
    t.end();
  }
);

tap.test(
  `39 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sub`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(fix("text&sub text&sub text", { decode: true }), [], "39");
    t.end();
  }
);

tap.test(
  `40 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sup`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(
      fix("text&suptext&suptext", { decode: true }),
      [
        [4, 8, "\u2283"],
        [12, 16, "\u2283"],
      ],
      "40"
    );
    t.end();
  }
);

tap.test(
  `41 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`theta`}\u001b[${39}m - with decode, tight`,
  (t) => {
    t.same(fix("text&theta text&theta text", { decode: true }), [], "41");
    t.end();
  }
);

tap.test(
  `42 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - with decode, line breaked`,
  (t) => {
    t.same(
      fix("a &thinsp b\n&thinsp\nc", { decode: true }),
      [
        [2, 9, "\u2009"],
        [12, 19, "\u2009"],
      ],
      "42"
    );
    t.end();
  }
);

tap.test(
  `43 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - with decode, isolated`,
  (t) => {
    t.same(fix("&thinsp", { decode: true }), [[0, 7, "\u2009"]], "43");
    t.end();
  }
);

tap.test(
  `44 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - joins`,
  (t) => {
    t.same(
      fix("&thinsp&thinsp", { decode: true }),
      [
        [0, 7, "\u2009"],
        [7, 14, "\u2009"],
      ],
      "44"
    );
    t.end();
  }
);

tap.test("45 - single pi - exact value in front", (t) => {
  t.same(fix("&pivaaa"), [[0, 4, "&piv;"]], "45");
  t.end();
});
