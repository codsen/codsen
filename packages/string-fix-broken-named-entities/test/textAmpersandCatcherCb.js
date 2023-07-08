import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// import fix from "./util/util.js";
import {
  fixEnt,
  allRules,
} from "../dist/string-fix-broken-named-entities.esm.js";

test("01 - text amps and a healthy named entity, default settings", () => {
  let gathered = [];
  let res = fixEnt("Let's go to B&Q and buy some&nbsp;M&M's.", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  equal(res, [], "01.01");
  equal(gathered, [13, 35], "01.02");
});

test("02 - text amps and a healthy named entity", () => {
  let gathered = [];
  let res = fixEnt("Let's go to B&Q and buy some&nbsp;M&M's.", {
    decode: true,
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  let ruleName = "bad-html-entity-encoded-nbsp";
  ok(allRules.includes(ruleName), "02.01");
  ok(res[0].ruleName, "02.02");
  equal(res.length, 1, "02.03");
  equal(gathered, [13, 35], "02.04");
});

test("03 - sandwitched, healthy entities", () => {
  let gathered = [];
  let res = fixEnt("&&nbsp;&&nbsp;&", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  equal(res, [], "03.01");
  equal(gathered, [0, 7, 14], "03.02");
});

test("04 - sandwitched, broken entities", () => {
  let gathered = [];
  let res = fixEnt("&&nsp;&&nsp;&", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  let ruleName = "bad-html-entity-malformed-nbsp";
  ok(allRules.includes(ruleName), "04.01");
  equal(
    res,
    [
      {
        ruleName,
        entityName: "nbsp",
        rangeFrom: 1,
        rangeTo: 6,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\u00A0",
      },
      {
        ruleName,
        entityName: "nbsp",
        rangeFrom: 7,
        rangeTo: 12,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\u00A0",
      },
    ],
    "04.02",
  );
  equal(gathered, [0, 6, 12], "04.03");
});

test("05", () => {
  let gathered = [];
  let res = fixEnt("<span>&nbsp</span>", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  let ruleName = "bad-html-entity-malformed-nbsp";
  ok(allRules.includes(ruleName), "05.01");
  equal(
    res,
    [
      {
        ruleName,
        entityName: "nbsp",
        rangeFrom: 6,
        rangeTo: 11,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\u00A0",
      },
    ],
    "05.02",
  );
  equal(gathered, [], "05.03");
});

test("06", () => {
  let gathered = [];
  let res = fixEnt("<span>&&nbsp&</span>", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  let ruleName = "bad-html-entity-malformed-nbsp";
  ok(allRules.includes(ruleName), "06.01");
  equal(
    res,
    [
      {
        ruleName,
        entityName: "nbsp",
        rangeFrom: 7,
        rangeTo: 12,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\u00A0",
      },
    ],
    "06.02",
  );
  equal(gathered, [6, 12], "06.03");
});

test("07", () => {
  let gathered = [];
  let res = fixEnt("<span>&&nbsp;&</span>", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  equal(res, [], "07.01");
  equal(gathered, [6, 13], "07.02");
});

test("08", () => {
  let gathered = [];
  let res = fixEnt("<span>&nbp;</span>", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  let ruleName = "bad-html-entity-malformed-nbsp";
  ok(allRules.includes(ruleName), "08.01");
  equal(
    res,
    [
      {
        ruleName,
        entityName: "nbsp",
        rangeFrom: 6,
        rangeTo: 11,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\u00A0",
      },
    ],
    "08.02",
  );
  equal(gathered, [], "08.03");
});

test("09", () => {
  let gathered = [];
  let res = fixEnt("<span>& nbsp;</span>", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  let ruleName = "bad-html-entity-malformed-nbsp";
  ok(allRules.includes(ruleName), "09.01");
  equal(
    res,
    [
      {
        ruleName,
        entityName: "nbsp",
        rangeFrom: 6,
        rangeTo: 13,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\u00A0",
      },
    ],
    "09.02",
  );
  equal(gathered, [], "09.03");
});

test("10", () => {
  let gathered = [];
  let res = fixEnt("<span>&& nbsp;&</span>", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  let ruleName = "bad-html-entity-malformed-nbsp";
  ok(allRules.includes(ruleName), "10.01");
  equal(
    res,
    [
      {
        ruleName,
        entityName: "nbsp",
        rangeFrom: 7,
        rangeTo: 14,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\u00A0",
      },
    ],
    "10.02",
  );
  equal(gathered, [6, 14], "10.03");
});

// TODO
// test(`01 - hex with missing semi`, () => {
//   let gathered = [];
//   let res = fixEnt(`<span>&&#xA310&</span>`, {
//     cb: (obj) => obj,
//     textAmpersandCatcherCb: (idx) => gathered.push(idx),
//   });
//   let ruleName = "bad-html-entity-unrecognised";
//   ok(allRules.includes(ruleName), "01.01");
//   equal(
//     res,
//     [
//       {
//         ruleName,
//         entityName: "nbsp",
//         rangeFrom: 7,
//         rangeTo: 14,
//         rangeValEncoded: "&nbsp;",
//         rangeValDecoded: "\u00A0",
//       },
//     ],
//     "01.02"
//   );
//   equal(gathered, [6, 14], "01.03");
// });

// TODO
// test(`02`, () => {
//   let gathered = [];
//   let res = fixEnt(`<span>&#xA310</span>`, {
//     cb: (obj) => obj,
//     textAmpersandCatcherCb: (idx) => gathered.push(idx),
//   });
//   let ruleName = "bad-html-entity-unrecognised";
//   ok(allRules.includes(ruleName), "02.01");
//   equal(
//     res,
//     [
//       {
//         ruleName: "bad-html-entity-unrecognised",
//         entityName: "nbsp",
//         rangeFrom: 6,
//         rangeTo: 13,
//         rangeValEncoded: "&nbsp;",
//         rangeValDecoded: "\u00A0",
//       },
//     ],
//     "02.02"
//   );
//   equal(gathered, [], "02.03");
// });

// TODO
// test(`03`, () => {
//   let gathered = [];
//   let res = fixEnt(`abc &#xA3 def`, {
//     cb: (obj) => obj,
//     textAmpersandCatcherCb: (idx) => gathered.push(idx),
//   });
//   let ruleName = "bad-html-entity-unrecognised";
//   ok(allRules.includes(ruleName), "03.01");
//   equal(
//     res,
//     [
//       {
//         ruleName: "bad-html-entity-unrecognised",
//         entityName: "nbsp",
//         rangeFrom: 6,
//         rangeTo: 13,
//         rangeValEncoded: "&nbsp;",
//         rangeValDecoded: "\u00A0",
//       },
//     ],
//     "03.02"
//   );
//   equal(gathered, [], "03.03");
// });

test.run();
