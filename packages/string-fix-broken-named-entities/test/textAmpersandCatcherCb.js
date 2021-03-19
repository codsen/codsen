import tap from "tap";
import { fixEnt as fix } from "../dist/string-fix-broken-named-entities.esm";

tap.test(`01 - text amps and a healthy named entity, default settings`, (t) => {
  const gathered = [];
  const res = fix("Let's go to B&Q and by some&nbsp;M&M's.", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  t.strictSame(res, [], "01.01");
  t.strictSame(gathered, [13, 34], "01.02");
  t.end();
});

tap.test(`02 - text amps and a healthy named entity`, (t) => {
  const gathered = [];
  const res = fix("Let's go to B&Q and by some&nbsp;M&M's.", {
    decode: true,
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  t.match(
    res,
    [
      {
        ruleName: "bad-html-entity-encoded-nbsp",
      },
    ],
    "02.01"
  );
  t.equal(res.length, 1, "02.02");
  t.strictSame(gathered, [13, 34], "02.03");
  t.end();
});

tap.test(`03 - sandwitched, healthy entities`, (t) => {
  const gathered = [];
  const res = fix("&&nbsp;&&nbsp;&", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  t.strictSame(res, [], "03.01");
  t.strictSame(gathered, [0, 7, 14], "03.02");
  t.end();
});

tap.test(`04 - sandwitched, broken entities`, (t) => {
  const gathered = [];
  const res = fix("&&nsp;&&nsp;&", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  t.strictSame(
    res,
    [
      {
        ruleName: "bad-html-entity-malformed-nbsp",
        entityName: "nbsp",
        rangeFrom: 1,
        rangeTo: 6,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\u00A0",
      },
      {
        ruleName: "bad-html-entity-malformed-nbsp",
        entityName: "nbsp",
        rangeFrom: 7,
        rangeTo: 12,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\u00A0",
      },
    ],
    "04.01"
  );
  t.strictSame(gathered, [0, 6, 12], "04.02");
  t.end();
});
