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
  const gatheredAmps = [];
  t.strictSame(
    fix("&pi", {
      cb: (obj) => {
        gatheredBroken.push([obj.rangeFrom, obj.rangeTo, obj.rangeValEncoded]);
        return [obj.rangeFrom, obj.rangeTo, obj.rangeValEncoded];
      },
      entityCatcherCb: (from, to) => gatheredHealthy.push([from, to]),
      textAmpersandCatcherCb: (idx) => {
        gatheredAmps.push(idx);
      },
    }),
    [[0, 3, "&pi;"]],
    "02.01"
  );
  t.is(gatheredBroken.length, 1, "02.02");
  t.strictSame(gatheredHealthy, [], "02.03");
  t.strictSame(gatheredAmps, [], "02.04");
  t.end();
});

tap.test("03 - larger set", (t) => {
  const gathered = [];
  t.strictSame(
    fix("aaa&pi&piv&pi&pivaaa", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      [3, 6, "&pi;"],
      [6, 10, "&piv;"],
      [10, 13, "&pi;"],
      [13, 17, "&piv;"],
    ],
    "03.01"
  );
  t.strictSame(gathered, [], "03.02");
  t.end();
});

tap.test("04 - letters follow tightly", (t) => {
  const gathered = [];
  t.strictSame(
    fix("aaa&ang&angst&ang&angstaaa", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      [3, 7, "&ang;"],
      [7, 13, "&angst;"],
      [13, 17, "&ang;"],
      [17, 23, "&angst;"],
    ],
    "04.01"
  );
  t.strictSame(gathered, [], "04.02");
  t.end();
});

tap.test(
  `05 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - control`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("z &ang; y", {
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
      fix("z &angst; y", {
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
    t.strictSame(
      fix("z &ang y", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[2, 6, "&ang;"]],
      "07.01"
    );
    t.strictSame(gathered, [], "07.02");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("z &ang ;", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[2, 8, "&ang;"]],
      "08.01"
    );
    t.strictSame(gathered, [], "08.02");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("z &ang st", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[2, 6, "&ang;"]],
      "09.01"
    );
    t.strictSame(gathered, [], "09.02");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("z &ang sx", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[2, 6, "&ang;"]],
      "10.01"
    );
    t.strictSame(gathered, [], "10.02");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("z &angst y", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[2, 8, "&angst;"]],
      "11.01"
    );
    t.strictSame(gathered, [], "11.02");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, spaced`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("x &ang y&ang z", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [2, 6, "&ang;"],
        [8, 12, "&ang;"],
      ],
      "12.01"
    );
    t.strictSame(gathered, [], "12.02");
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("&ang&ang", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [0, 4, "&ang;"],
        [4, 8, "&ang;"],
      ],
      "13.01"
    );
    t.strictSame(gathered, [], "13.02");
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&angtext&angtext", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [4, 8, "&ang;"],
        [12, 16, "&ang;"],
      ],
      "14.01"
    );
    t.strictSame(gathered, [], "14.02");
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&angsttext&angsttext", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [4, 10, "&angst;"],
        [14, 20, "&angst;"],
      ],
      "15.01 - spaces are obligatory"
    );
    t.strictSame(gathered, [], "15.02");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&angst", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[4, 10, "&angst;"]],
      "16.01"
    );
    t.strictSame(gathered, [], "16.02");
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&angst text&angst text", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [4, 10, "&angst;"],
        [15, 21, "&angst;"],
      ],
      "17.01"
    );
    t.strictSame(gathered, [], "17.02");
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`pi`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&pitext&pitext", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "18.01 - won't fix, it's a dubious case"
    );
    t.strictSame(gathered, [4, 11], "18.02");
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`piv`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&pivtext&pivtext", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [4, 8, "&piv;"],
        [12, 16, "&piv;"],
      ],
      "19.01"
    );
    t.strictSame(gathered, [], "19.02");
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`Pi`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&Pitext&Pitext", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "20.01 - also won't fix, it's not conclusive"
    );
    t.strictSame(gathered, [4, 11], "20.02");
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sigma`}\u001b[${39}m - not conclusive`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&sigma text&sigma text", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "21.01"
    );
    t.strictSame(gathered, [4, 15], "21.02");
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sub`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&sub text&sub text", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "22.01"
    );
    t.strictSame(gathered, [4, 13], "22.02");
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sup`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&suptext&suptext", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [4, 8, "&sup;"],
        [12, 16, "&sup;"],
      ],
      "23.01"
    );
    t.strictSame(gathered, [], "23.02");
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`theta`}\u001b[${39}m - no decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&theta text&theta text", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "24.01"
    );
    t.strictSame(gathered, [4, 15], "24.02");
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - no decode, linebreaked`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("a &thinsp b\n&thinsp\nc", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [2, 9, "&thinsp;"],
        [12, 19, "&thinsp;"],
      ],
      "25.01"
    );
    t.strictSame(gathered, [], "25.02");
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - joins 1`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("&thinsp", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[0, 7, "&thinsp;"]],
      "26.01"
    );
    t.strictSame(gathered, [], "26.02");
    t.end();
  }
);

tap.test(
  `27 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - joins 2`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("&thinsp&thinsp", {
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [0, 7, "&thinsp;"],
        [7, 14, "&thinsp;"],
      ],
      "27.01"
    );
    t.strictSame(gathered, [], "27.02");
    t.end();
  }
);

// with decode
// -----------------------------------------------------------------------------

tap.test(
  `28 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - with decode, spaced`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text &ang text&ang text", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [5, 9, "\u2220"],
        [14, 18, "\u2220"],
      ],
      "28.01"
    );
    t.strictSame(gathered, [], "28.02");
    t.end();
  }
);

tap.test(
  `29 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`ang`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&angtext&angtext", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [4, 8, "\u2220"],
        [12, 16, "\u2220"],
      ],
      "29.01"
    );
    t.strictSame(gathered, [], "29.02");
    t.end();
  }
);

tap.test(
  `30 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&angst", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[4, 10, "\xC5"]],
      "30.01"
    );
    t.strictSame(gathered, [], "30.02");
    t.end();
  }
);

tap.test(
  `31 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&angst text&angst text", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [4, 10, "\xC5"],
        [15, 21, "\xC5"],
      ],
      "31.01"
    );
    t.strictSame(gathered, [], "31.02");
    t.end();
  }
);

tap.test(
  `32 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`angst`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&angsttext&angsttext", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [4, 10, "\xC5"],
        [14, 20, "\xC5"],
      ],
      "32.01"
    );
    t.strictSame(gathered, [], "32.02");
    t.end();
  }
);

tap.test(
  `33 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`pi`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&pi text&pi text", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "33.01"
    );
    t.strictSame(gathered, [4, 12], "33.02");
    t.end();
  }
);

tap.test(
  `34 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`piv`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&pivtext&pivtext", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [4, 8, "\u03D6"],
        [12, 16, "\u03D6"],
      ],
      "34.01"
    );
    t.strictSame(gathered, [], "34.02");
    t.end();
  }
);

tap.test(
  `35 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`Pi`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&Pi text&Pi text", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "35.01"
    );
    t.strictSame(gathered, [4, 12], "35.02");
    t.end();
  }
);

tap.test(
  `36 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sigma`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&sigma text&sigma text", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "36.01"
    );
    t.strictSame(gathered, [4, 15], "36.02");
    t.end();
  }
);

tap.test(
  `37 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sub`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&sub text&sub text", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "37.01"
    );
    t.strictSame(gathered, [4, 13], "37.02");
    t.end();
  }
);

tap.test(
  `38 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`sup`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&suptext&suptext", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [4, 8, "\u2283"],
        [12, 16, "\u2283"],
      ],
      "38.01"
    );
    t.strictSame(gathered, [], "38.02");
    t.end();
  }
);

tap.test(
  `39 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`theta`}\u001b[${39}m - with decode, tight`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("text&theta text&theta text", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [],
      "39.01"
    );
    t.strictSame(gathered, [4, 15], "39.02");
    t.end();
  }
);

tap.test(
  `40 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - with decode, line breaked`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("a &thinsp b\n&thinsp\nc", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [2, 9, "\u2009"],
        [12, 19, "\u2009"],
      ],
      "40.01"
    );
    t.strictSame(gathered, [], "40.02");
    t.end();
  }
);

tap.test(
  `41 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - with decode, isolated`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("&thinsp", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [[0, 7, "\u2009"]],
      "41.01"
    );
    t.strictSame(gathered, [], "41.02");
    t.end();
  }
);

tap.test(
  `42 - ${`\u001b[${36}m${`semicolon missing`}\u001b[${39}m`} - \u001b[${32}m${`thinsp`}\u001b[${39}m - joins`,
  (t) => {
    const gathered = [];
    t.strictSame(
      fix("&thinsp&thinsp", {
        decode: true,
        textAmpersandCatcherCb: (idx) => {
          gathered.push(idx);
        },
      }),
      [
        [0, 7, "\u2009"],
        [7, 14, "\u2009"],
      ],
      "42.01"
    );
    t.strictSame(gathered, [], "42.02");
    t.end();
  }
);

tap.test("43 - single pi - exact value in front", (t) => {
  const gathered = [];
  t.strictSame(
    fix("&pivaaa", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [[0, 4, "&piv;"]],
    "43.01"
  );
  t.strictSame(gathered, [], "43.02");
  t.end();
});
