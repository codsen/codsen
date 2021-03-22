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

tap.test(`05`, (t) => {
  const gathered = [];
  const res = fix("<span>&nbsp</span>", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  t.strictSame(
    res,
    [
      {
        ruleName: "bad-html-entity-malformed-nbsp",
        entityName: "nbsp",
        rangeFrom: 6,
        rangeTo: 11,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\u00A0",
      },
    ],
    "05.01"
  );
  t.strictSame(gathered, [], "05.02");
  t.end();
});

tap.test(`06`, (t) => {
  const gathered = [];
  const res = fix("<span>&&nbsp&</span>", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  t.strictSame(
    res,
    [
      {
        ruleName: "bad-html-entity-malformed-nbsp",
        entityName: "nbsp",
        rangeFrom: 7,
        rangeTo: 12,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\u00A0",
      },
    ],
    "06.01"
  );
  t.strictSame(gathered, [6, 12], "06.02");
  t.end();
});

tap.test(`07`, (t) => {
  const gathered = [];
  const res = fix("<span>&&nbsp;&</span>", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  t.strictSame(res, [], "07.01");
  t.strictSame(gathered, [6, 13], "07.02");
  t.end();
});

tap.test(`08`, (t) => {
  const gathered = [];
  const res = fix("<span>&nbp;</span>", {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  t.strictSame(
    res,
    [
      {
        ruleName: "bad-html-entity-malformed-nbsp",
        entityName: "nbsp",
        rangeFrom: 6,
        rangeTo: 11,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\u00A0",
      },
    ],
    "08.01"
  );
  t.strictSame(gathered, [], "08.02");
  t.end();
});

tap.test(`09`, (t) => {
  const gathered = [];
  const res = fix(`<span>& nbsp;</span>`, {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  t.strictSame(
    res,
    [
      {
        ruleName: "bad-html-entity-malformed-nbsp",
        entityName: "nbsp",
        rangeFrom: 6,
        rangeTo: 13,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\u00A0",
      },
    ],
    "09.01"
  );
  t.strictSame(gathered, [], "09.02");
  t.end();
});

tap.test(`10`, (t) => {
  const gathered = [];
  const res = fix(`<span>&& nbsp;&</span>`, {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  t.strictSame(
    res,
    [
      {
        ruleName: "bad-html-entity-malformed-nbsp",
        entityName: "nbsp",
        rangeFrom: 7,
        rangeTo: 14,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\u00A0",
      },
    ],
    "10.01"
  );
  t.strictSame(gathered, [6, 14], "10.02");
  t.end();
});

tap.todo(`11 - hex with missing semi`, (t) => {
  const gathered = [];
  const res = fix(`<span>&&#xA310&</span>`, {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  t.strictSame(
    res,
    [
      {
        ruleName: "bad-html-entity",
        entityName: "nbsp",
        rangeFrom: 7,
        rangeTo: 14,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\u00A0",
      },
    ],
    "11.01"
  );
  t.strictSame(gathered, [6, 14], "11.02");
  t.end();
});

tap.todo(`12`, (t) => {
  const gathered = [];
  const res = fix(`<span>&#xA310</span>`, {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  t.strictSame(
    res,
    [
      {
        ruleName: "bad-html-entity",
        entityName: "nbsp",
        rangeFrom: 6,
        rangeTo: 13,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\u00A0",
      },
    ],
    "12.01"
  );
  t.strictSame(gathered, [], "12.02");
  t.end();
});

tap.todo(`13`, (t) => {
  const gathered = [];
  const res = fix(`abc &#xA3 def`, {
    cb: (obj) => obj,
    textAmpersandCatcherCb: (idx) => gathered.push(idx),
  });
  t.strictSame(
    res,
    [
      {
        ruleName: "bad-html-entity",
        entityName: "nbsp",
        rangeFrom: 6,
        rangeTo: 13,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\u00A0",
      },
    ],
    "13.01"
  );
  t.strictSame(gathered, [], "13.02");
  t.end();
});
