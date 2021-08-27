import tap from "tap";
// import fix from "./util/util.js";
import {
  fixEnt,
  allRules,
} from "../dist/string-fix-broken-named-entities.esm.js";

tap.test(`01 - text amps and a healthy named entity, default settings`, (t) => {
  const gathered = [];
  const res = fixEnt("Let's go to B&Q and buy some&nbsp;M&M's.", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  t.strictSame(res, [], "01.01");
  t.strictSame(gathered, [13, 35], "01.02");
  t.end();
});

tap.test(`02 - text amps and a healthy named entity`, (t) => {
  const gathered = [];
  const res = fixEnt("Let's go to B&Q and buy some&nbsp;M&M's.", {
    decode: true,
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  const ruleName = "bad-html-entity-encoded-nbsp";
  t.ok(allRules.includes(ruleName), "02.01");
  t.match(
    res,
    [
      {
        ruleName,
      },
    ],
    "02.02"
  );
  t.equal(res.length, 1, "02.03");
  t.strictSame(gathered, [13, 35], "02.04");
  t.end();
});

tap.test(`03 - sandwitched, healthy entities`, (t) => {
  const gathered = [];
  const res = fixEnt("&&nbsp;&&nbsp;&", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  t.strictSame(res, [], "03.01");
  t.strictSame(gathered, [0, 7, 14], "03.02");
  t.end();
});

tap.test(`04 - sandwitched, broken entities`, (t) => {
  const gathered = [];
  const res = fixEnt("&&nsp;&&nsp;&", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  const ruleName = "bad-html-entity-malformed-nbsp";
  t.ok(allRules.includes(ruleName), "04.01");
  t.strictSame(
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
    "04.02"
  );
  t.strictSame(gathered, [0, 6, 12], "04.03");
  t.end();
});

tap.test(`05`, (t) => {
  const gathered = [];
  const res = fixEnt("<span>&nbsp</span>", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  const ruleName = "bad-html-entity-malformed-nbsp";
  t.ok(allRules.includes(ruleName), "05.01");
  t.strictSame(
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
    "05.02"
  );
  t.strictSame(gathered, [], "05.03");
  t.end();
});

tap.test(`06`, (t) => {
  const gathered = [];
  const res = fixEnt("<span>&&nbsp&</span>", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  const ruleName = "bad-html-entity-malformed-nbsp";
  t.ok(allRules.includes(ruleName), "06.01");
  t.strictSame(
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
    "06.02"
  );
  t.strictSame(gathered, [6, 12], "06.03");
  t.end();
});

tap.test(`07`, (t) => {
  const gathered = [];
  const res = fixEnt("<span>&&nbsp;&</span>", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  t.strictSame(res, [], "07.01");
  t.strictSame(gathered, [6, 13], "07.02");
  t.end();
});

tap.test(`08`, (t) => {
  const gathered = [];
  const res = fixEnt("<span>&nbp;</span>", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  const ruleName = "bad-html-entity-malformed-nbsp";
  t.ok(allRules.includes(ruleName), "08.01");
  t.strictSame(
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
    "08.02"
  );
  t.strictSame(gathered, [], "08.03");
  t.end();
});

tap.test(`09`, (t) => {
  const gathered = [];
  const res = fixEnt(`<span>& nbsp;</span>`, {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  const ruleName = "bad-html-entity-malformed-nbsp";
  t.ok(allRules.includes(ruleName), "09.01");
  t.strictSame(
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
    "09.02"
  );
  t.strictSame(gathered, [], "09.03");
  t.end();
});

tap.test(`10`, (t) => {
  const gathered = [];
  const res = fixEnt(`<span>&& nbsp;&</span>`, {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  const ruleName = "bad-html-entity-malformed-nbsp";
  t.ok(allRules.includes(ruleName), "10.01");
  t.strictSame(
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
    "10.02"
  );
  t.strictSame(gathered, [6, 14], "10.03");
  t.end();
});

tap.todo(`11 - hex with missing semi`, (t) => {
  const gathered = [];
  const res = fixEnt(`<span>&&#xA310&</span>`, {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  const ruleName = "bad-html-entity-unrecognised";
  t.ok(allRules.includes(ruleName), "11.01");
  t.strictSame(
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
    "11.02"
  );
  t.strictSame(gathered, [6, 14], "11.03");
  t.end();
});

tap.todo(`12`, (t) => {
  const gathered = [];
  const res = fixEnt(`<span>&#xA310</span>`, {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  const ruleName = "bad-html-entity-unrecognised";
  t.ok(allRules.includes(ruleName), "12.01");
  t.strictSame(
    res,
    [
      {
        ruleName: "bad-html-entity-unrecognised",
        entityName: "nbsp",
        rangeFrom: 6,
        rangeTo: 13,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\u00A0",
      },
    ],
    "12.02"
  );
  t.strictSame(gathered, [], "12.03");
  t.end();
});

tap.todo(`13`, (t) => {
  const gathered = [];
  const res = fixEnt(`abc &#xA3 def`, {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  const ruleName = "bad-html-entity-unrecognised";
  t.ok(allRules.includes(ruleName), "13.01");
  t.strictSame(
    res,
    [
      {
        ruleName: "bad-html-entity-unrecognised",
        entityName: "nbsp",
        rangeFrom: 6,
        rangeTo: 13,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\u00A0",
      },
    ],
    "13.02"
  );
  t.strictSame(gathered, [], "13.03");
  t.end();
});
