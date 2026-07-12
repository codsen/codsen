// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import {
  allNamedEntitiesSetOnly,
  decode,
  uncertain,
} from "all-named-html-entities";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
import {
  allRules,
  fixEnt,
} from "../dist/string-fix-broken-named-entities.esm.js";
import fix from "./util/util.js";

// -----------------------------------------------------------------------------
// programmatic tests
// -----------------------------------------------------------------------------

test(`01 - ${allNamedEntitiesSetOnly.size} programmatic tests in total`, () => {
  [...allNamedEntitiesSetOnly]
    .filter((entity) => !Object.keys(uncertain).includes(entity))
    .forEach((singleEntity, i, arr) => {
      //
      // semicolon missing, isolated:
      //
      let ruleName = `bad-html-entity-malformed-${singleEntity}`;
      ok(allRules.includes(ruleName), "04.01");
      equal(
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
        `01.01 - ${`${singleEntity} - 02; ${i + 1}/${arr.length}`}`,
      );
    });
});

test("02 - single pi", () => {
  let gatheredBroken = [];
  let gatheredHealthy = [];
  let gatheredAmps = [];
  let res = [[0, 3, "&pi;"]];
  equal(
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
    "02.01",
  );
  equal(
    fix(ok, "&pi", {
      cb: (obj) => {
        return [obj.rangeFrom, obj.rangeTo, obj.rangeValEncoded];
      },
      entityCatcherCb: () => {},
      textAmpersandCatcherCb: () => {},
    }),
    res,
    "02.02",
  );
  is(gatheredBroken.length, 1, "02.03");
  equal(gatheredHealthy, [], "02.03");
  equal(gatheredAmps, [], "02.04");
});

test("03 - larger set", () => {
  let gathered = [];
  let res = [
    [3, 6, "&pi;"],
    [6, 10, "&piv;"],
    [10, 13, "&pi;"],
    [13, 17, "&piv;"],
  ];
  equal(
    fixEnt("aaa&pi&piv&pi&pivaaa", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "03.01",
  );
  equal(
    fix(ok, "aaa&pi&piv&pi&pivaaa", {
      textAmpersandCatcherCb: () => {},
    }),
    res,
    "03.02",
  );
  equal(gathered, [], "03.03");
});

test("04 - letters follow tightly", () => {
  let gathered = [];
  let res = [
    [3, 7, "&ang;"],
    [7, 13, "&angst;"],
    [13, 17, "&ang;"],
    [17, 23, "&angst;"],
  ];
  equal(
    fixEnt("aaa&ang&angst&ang&angstaaa", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "04.01",
  );
  equal(
    fix(ok, "aaa&ang&angst&ang&angstaaa", {
      textAmpersandCatcherCb: () => {},
    }),
    res,
    "04.02",
  );
  equal(gathered, [], "04.03");
});

test(`05 - semicolon missing - \u001b[${32}m${"ang"}\u001b[${39}m - control`, () => {
  let gathered = [];
  equal(
    fix(ok, "z &ang; y", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "05.01",
  );
  equal(gathered, [], "05.02");
});

test(`06 - semicolon missing - \u001b[${32}m${"angst"}\u001b[${39}m - control`, () => {
  let gathered = [];
  equal(
    fix(ok, "z &angst; y", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "06.01",
  );
  equal(gathered, [], "06.02");
});

test(`07 - semicolon missing - \u001b[${32}m${"ang"}\u001b[${39}m - no decode, spaced`, () => {
  let gathered = [];
  let res = [[2, 6, "&ang;"]];
  equal(
    fixEnt("z &ang y", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "07.01",
  );
  equal(
    fix(ok, "z &ang y", {
      textAmpersandCatcherCb: () => {},
    }),
    res,
    "07.02",
  );
  equal(gathered, [], "07.03");
});

test(`08 - semicolon missing - \u001b[${32}m${"ang"}\u001b[${39}m - no decode, spaced`, () => {
  let gathered = [];
  let res = [[2, 8, "&ang;"]];
  equal(
    fixEnt("z &ang ;", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "08.01",
  );
  equal(
    fix(ok, "z &ang ;", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "08.02",
  );
  equal(gathered, [], "08.03");
});

test(`09 - semicolon missing - \u001b[${32}m${"ang"}\u001b[${39}m - no decode, spaced`, () => {
  let gathered = [];
  let res = [[2, 6, "&ang;"]];
  equal(
    fixEnt("z &ang st", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "09.01",
  );
  equal(
    fix(ok, "z &ang st", {
      textAmpersandCatcherCb: () => {},
    }),
    res,
    "09.02",
  );
  equal(gathered, [], "09.03");
});

test(`10 - semicolon missing - \u001b[${32}m${"ang"}\u001b[${39}m - no decode, spaced`, () => {
  let gathered = [];
  let res = [[2, 6, "&ang;"]];
  equal(
    fixEnt("z &ang sx", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "10.01",
  );
  equal(
    fix(ok, "z &ang sx", {
      textAmpersandCatcherCb: () => {},
    }),
    res,
    "10.02",
  );
  equal(gathered, [], "10.03");
});

test(`11 - semicolon missing - \u001b[${32}m${"ang"}\u001b[${39}m - no decode, spaced`, () => {
  let gathered = [];
  let res = [[2, 8, "&angst;"]];
  equal(
    fixEnt("z &angst y", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "11.01",
  );
  equal(
    fix(ok, "z &angst y", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "11.02",
  );
  equal(gathered, [], "11.03");
});

test(`12 - semicolon missing - \u001b[${32}m${"ang"}\u001b[${39}m - no decode, spaced`, () => {
  let gathered = [];
  let res = [
    [2, 6, "&ang;"],
    [8, 12, "&ang;"],
  ];
  equal(
    fixEnt("x &ang y&ang z", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "12.01",
  );
  equal(
    fix(ok, "x &ang y&ang z", {
      textAmpersandCatcherCb: () => {},
    }),
    res,
    "12.02",
  );
  equal(gathered, [], "12.03");
});

test(`13 - semicolon missing - \u001b[${32}m${"ang"}\u001b[${39}m - no decode, tight`, () => {
  let gathered = [];
  let res = [
    [0, 4, "&ang;"],
    [4, 8, "&ang;"],
  ];
  equal(
    fixEnt("&ang&ang", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "13.01",
  );
  equal(
    fix(ok, "&ang&ang", {
      textAmpersandCatcherCb: () => {},
    }),
    res,
    "13.02",
  );
  equal(gathered, [], "13.03");
});

test(`14 - semicolon missing - \u001b[${32}m${"ang"}\u001b[${39}m - no decode, tight`, () => {
  let gathered = [];
  let res = [
    [4, 8, "&ang;"],
    [12, 16, "&ang;"],
  ];
  equal(
    fixEnt("text&angtext&angtext", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "14.01",
  );
  equal(
    fix(ok, "text&angtext&angtext", {
      textAmpersandCatcherCb: () => {},
    }),
    res,
    "14.02",
  );
  equal(gathered, [], "14.03");
});

test(`15 - semicolon missing - \u001b[${32}m${"angst"}\u001b[${39}m - no decode, tight`, () => {
  let gathered = [];
  let res = [
    [4, 10, "&angst;"],
    [14, 20, "&angst;"],
  ];
  equal(
    fixEnt("text&angsttext&angsttext", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "15.01",
  );
  equal(
    fix(ok, "text&angsttext&angsttext", {
      textAmpersandCatcherCb: () => {},
    }),
    res,
    "15.02",
  );
  equal(gathered, [], "15.03");
});

test(`16 - semicolon missing - \u001b[${32}m${"angst"}\u001b[${39}m - no decode, tight`, () => {
  let gathered = [];
  let input = "text&angst";
  let res = [[4, 10, "&angst;"]];
  equal(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "16.01",
  );
  equal(
    fix(ok, input, {
      textAmpersandCatcherCb: () => {},
    }),
    res,
    "16.02",
  );
  equal(gathered, [], "16.03");
});

test(`17 - semicolon missing - \u001b[${32}m${"angst"}\u001b[${39}m - no decode, tight`, () => {
  let gathered = [];
  let input = "text&angst text&angst text";
  let res = [
    [4, 10, "&angst;"],
    [15, 21, "&angst;"],
  ];
  equal(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "17.01",
  );
  equal(
    fix(ok, input, {
      textAmpersandCatcherCb: () => {},
    }),
    res,
    "17.02",
  );
  equal(gathered, [], "17.03");
});

test(`18 - semicolon missing - \u001b[${32}m${"pi"}\u001b[${39}m - no decode, tight`, () => {
  let gathered = [];
  let input = "text&pitext&pitext";
  equal(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "18.01",
  );
  equal(
    fix(ok, input, {
      textAmpersandCatcherCb: () => {},
    }),
    [],
    "18.02",
  );
  equal(gathered, [4, 11], "18.03");
});

test(`19 - semicolon missing - \u001b[${32}m${"piv"}\u001b[${39}m - no decode, tight`, () => {
  let gathered = [];
  let input = "text&pivtext&pivtext";
  let res = [
    [4, 8, "&piv;"],
    [12, 16, "&piv;"],
  ];
  equal(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "19.01",
  );
  equal(
    fix(ok, input, {
      textAmpersandCatcherCb: () => {},
    }),
    res,
    "19.02",
  );
  equal(gathered, [], "19.03");
});

test(`20 - semicolon missing - \u001b[${32}m${"Pi"}\u001b[${39}m - no decode, tight`, () => {
  let gathered = [];
  let input = "text&Pitext&Pitext";
  let res = [];
  equal(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "20.01",
  );
  equal(
    fix(ok, input, {
      textAmpersandCatcherCb: () => {},
    }),
    res,
    "20.02",
  );
  equal(gathered, [4, 11], "20.03");
});

test(`21 - semicolon missing - \u001b[${32}m${"sigma"}\u001b[${39}m - not conclusive`, () => {
  let gathered = [];
  let input = "text&sigma text&sigma text";
  let res = [];
  equal(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "21.01",
  );
  equal(
    fix(ok, input, {
      textAmpersandCatcherCb: () => {},
    }),
    res,
    "21.02",
  );
  equal(gathered, [4, 15], "21.03");
});

test(`22 - semicolon missing - \u001b[${32}m${"sub"}\u001b[${39}m - no decode, tight`, () => {
  let gathered = [];
  equal(
    fixEnt("text&sub text&sub text", {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "22.01",
  );
  equal(
    fix(ok, "text&sub text&sub text", {
      textAmpersandCatcherCb: () => {},
    }),
    [],
    "22.02",
  );
  equal(gathered, [4, 13], "22.03");
});

test(`23 - semicolon missing - \u001b[${32}m${"sup"}\u001b[${39}m - no decode, tight`, () => {
  let gathered = [];
  let input = "text&suptext&suptext";
  let res = [
    [4, 8, "&sup;"],
    [12, 16, "&sup;"],
  ];
  equal(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "23.01",
  );
  equal(
    fix(ok, input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "23.02",
  );
  equal(gathered, [], "23.03");
});

test(`24 - semicolon missing - \u001b[${32}m${"theta"}\u001b[${39}m - no decode, tight`, () => {
  let gathered = [];
  let input = "text&theta text&theta text";
  let res = [];
  equal(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    res,
    "24.01",
  );
  equal(
    fix(ok, input, {
      textAmpersandCatcherCb: () => {},
    }),
    res,
    "24.02",
  );
  equal(gathered, [4, 15], "24.03");
});

test(`25 - semicolon missing - \u001b[${32}m${"thinsp"}\u001b[${39}m - no decode, linebreaked`, () => {
  let gathered = [];
  let input = "a &thinsp b\n&thinsp\nc";
  let result = [
    [2, 9, "&thinsp;"],
    [12, 19, "&thinsp;"],
  ];
  equal(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "25.01",
  );
  equal(
    fix(ok, input, {
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "25.02",
  );
  equal(gathered, [], "25.03");
});

test(`26 - semicolon missing - \u001b[${32}m${"thinsp"}\u001b[${39}m - joins 1`, () => {
  let gathered = [];
  let input = "&thinsp";
  let result = [[0, 7, "&thinsp;"]];
  equal(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "26.01",
  );
  equal(
    fix(ok, input, {
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "26.02",
  );
  equal(gathered, [], "26.03");
});

test(`27 - semicolon missing - \u001b[${32}m${"thinsp"}\u001b[${39}m - joins 2`, () => {
  let gathered = [];
  let input = "&thinsp&thinsp";
  let result = [
    [0, 7, "&thinsp;"],
    [7, 14, "&thinsp;"],
  ];
  equal(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "27.01",
  );
  equal(
    fix(ok, input, {
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "27.02",
  );
  equal(gathered, [], "27.03");
});

// with decode
// -----------------------------------------------------------------------------

test(`28 - semicolon missing - \u001b[${32}m${"ang"}\u001b[${39}m - with decode, spaced`, () => {
  let gathered = [];
  let input = "text &ang text&ang text";
  let result = [
    [5, 9, "\u2220"],
    [14, 18, "\u2220"],
  ];
  equal(
    fixEnt(input, {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "28.01",
  );
  equal(
    fix(ok, input, {
      decode: true,
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "28.02",
  );
  equal(gathered, [], "28.03");
});

test(`29 - semicolon missing - \u001b[${32}m${"ang"}\u001b[${39}m - with decode, tight`, () => {
  let gathered = [];
  let input = "text&angtext&angtext";
  let result = [
    [4, 8, "\u2220"],
    [12, 16, "\u2220"],
  ];
  equal(
    fixEnt(input, {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "29.01",
  );
  equal(
    fix(ok, input, {
      decode: true,
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "29.02",
  );
  equal(gathered, [], "29.03");
});

test(`30 - semicolon missing - \u001b[${32}m${"angst"}\u001b[${39}m - with decode, tight`, () => {
  let gathered = [];
  let input = "text&angst";
  let result = [[4, 10, "\xC5"]];
  equal(
    fixEnt(input, {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "30.01",
  );
  equal(
    fix(ok, input, {
      decode: true,
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "30.02",
  );
  equal(gathered, [], "30.03");
});

test(`31 - semicolon missing - \u001b[${32}m${"angst"}\u001b[${39}m - with decode, tight`, () => {
  let gathered = [];
  let input = "text&angst text&angst text";
  let result = [
    [4, 10, "\xC5"],
    [15, 21, "\xC5"],
  ];
  equal(
    fixEnt(input, {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "31.01",
  );
  equal(
    fix(ok, input, {
      decode: true,
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "31.02",
  );
  equal(gathered, [], "31.03");
});

test(`32 - semicolon missing - \u001b[${32}m${"angst"}\u001b[${39}m - with decode, tight`, () => {
  let gathered = [];
  let input = "text&angsttext&angsttext";
  let result = [
    [4, 10, "\xC5"],
    [14, 20, "\xC5"],
  ];
  equal(
    fixEnt(input, {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "32.01",
  );
  equal(
    fix(ok, input, {
      decode: true,
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "32.02",
  );
  equal(gathered, [], "32.03");
});

test(`33 - semicolon missing - \u001b[${32}m${"pi"}\u001b[${39}m - with decode, tight`, () => {
  let gathered = [];
  let input = "text&pi text&pi text";
  let result = [];
  equal(
    fixEnt(input, {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "33.01",
  );
  equal(
    fix(ok, input, {
      decode: true,
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "33.02",
  );
  equal(gathered, [4, 12], "33.03");
});

test(`34 - semicolon missing - \u001b[${32}m${"piv"}\u001b[${39}m - with decode, tight`, () => {
  let gathered = [];
  let input = "text&pivtext&pivtext";
  let result = [
    [4, 8, "\u03D6"],
    [12, 16, "\u03D6"],
  ];
  equal(
    fixEnt(input, {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "34.01",
  );
  equal(
    fix(ok, input, {
      decode: true,
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "34.02",
  );
  equal(gathered, [], "34.03");
});

test(`35 - semicolon missing - \u001b[${32}m${"Pi"}\u001b[${39}m - with decode, tight`, () => {
  let gathered = [];
  let input = "text&Pi text&Pi text";
  let result = [];
  equal(
    fixEnt(input, {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "35.01",
  );
  equal(
    fix(ok, input, {
      decode: true,
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "35.02",
  );
  equal(gathered, [4, 12], "35.03");
});

test(`36 - semicolon missing - \u001b[${32}m${"sigma"}\u001b[${39}m - with decode, tight`, () => {
  let gathered = [];
  let input = "text&sigma text&sigma text";
  let result = [];
  equal(
    fixEnt(input, {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "36.01",
  );
  equal(
    fix(ok, input, {
      decode: true,
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "36.02",
  );
  equal(gathered, [4, 15], "36.03");
});

test(`37 - semicolon missing - \u001b[${32}m${"sub"}\u001b[${39}m - with decode, tight`, () => {
  let gathered = [];
  let input = "text&sub text&sub text";
  let result = [];
  equal(
    fixEnt(input, {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "37.01",
  );
  equal(
    fix(ok, input, {
      decode: true,
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "37.02",
  );
  equal(gathered, [4, 13], "37.03");
});

test(`38 - semicolon missing - \u001b[${32}m${"sup"}\u001b[${39}m - with decode, tight`, () => {
  let gathered = [];
  let input = "text&suptext&suptext";
  let result = [
    [4, 8, "\u2283"],
    [12, 16, "\u2283"],
  ];
  equal(
    fixEnt(input, {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "38.01",
  );
  equal(
    fix(ok, input, {
      decode: true,
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "38.02",
  );
  equal(gathered, [], "38.03");
});

test(`39 - semicolon missing - \u001b[${32}m${"theta"}\u001b[${39}m - with decode, tight`, () => {
  let gathered = [];
  let input = "text&theta text&theta text";
  let result = [];
  equal(
    fixEnt(input, {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "39.01",
  );
  equal(
    fix(ok, input, {
      decode: true,
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "39.02",
  );
  equal(gathered, [4, 15], "39.03");
});

test(`40 - semicolon missing - \u001b[${32}m${"thinsp"}\u001b[${39}m - with decode, line breaked`, () => {
  let gathered = [];
  let input = "a &thinsp b\n&thinsp\nc";
  let result = [
    [2, 9, "\u2009"],
    [12, 19, "\u2009"],
  ];
  equal(
    fixEnt(input, {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "40.01",
  );
  equal(
    fix(ok, input, {
      decode: true,
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "40.02",
  );
  equal(gathered, [], "40.03");
});

test(`41 - semicolon missing - \u001b[${32}m${"thinsp"}\u001b[${39}m - with decode, isolated`, () => {
  let gathered = [];
  let input = "&thinsp";
  let result = [[0, 7, "\u2009"]];
  equal(
    fixEnt(input, {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "41.01",
  );
  equal(
    fix(ok, input, {
      decode: true,
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "41.02",
  );
  equal(gathered, [], "41.03");
});

test(`42 - semicolon missing - \u001b[${32}m${"thinsp"}\u001b[${39}m - joins`, () => {
  let gathered = [];
  let input = "&thinsp&thinsp";
  let result = [
    [0, 7, "\u2009"],
    [7, 14, "\u2009"],
  ];
  equal(
    fixEnt(input, {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "42.01",
  );
  equal(
    fix(ok, input, {
      decode: true,
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "42.02",
  );
  equal(gathered, [], "42.03");
});

test("43 - single pi - exact value in front", () => {
  let gathered = [];
  let input = "&pivaaa";
  let result = [[0, 4, "&piv;"]];
  equal(
    fixEnt(input, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    result,
    "43.01",
  );
  equal(
    fix(ok, input, {
      textAmpersandCatcherCb: () => {},
    }),
    result,
    "43.02",
  );
  equal(gathered, [], "43.03");
});

test.run();
