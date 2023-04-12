import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import fix from "./util/util.js";

// decode on

test(`01 - ${`\u001b[${33}m${"numeric entities"}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decode within ASCII range - A`, () => {
  let gathered = [];
  let inp1 = "&#65;";
  equal(
    fix(ok, inp1, {
      decode: true,
      cb: (obj) => obj,
    }),
    [
      {
        ruleName: "bad-html-entity-encoded-numeric",
        entityName: "#65",
        rangeFrom: 0,
        rangeTo: 5,
        rangeValEncoded: "&#65;",
        rangeValDecoded: "A",
      },
    ],
    "01.01"
  );
  equal(gathered, [], "01.02");
});

test(`02 - ${`\u001b[${33}m${"numeric entities"}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decode outside ASCII range - pound`, () => {
  let gathered = [];
  let inp1 = "&#163;";
  equal(
    fix(ok, inp1, {
      decode: true,
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-encoded-numeric",
        entityName: "#163",
        rangeFrom: 0,
        rangeTo: 6,
        rangeValEncoded: "&#163;",
        rangeValDecoded: "\xA3",
      },
    ],
    "02.01"
  );
  equal(gathered, [], "02.02");
});

test(`03 - ${`\u001b[${33}m${"numeric entities"}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decode outside ASCII range - non-existing number`, () => {
  let gathered = [];
  let inp1 = "&#99999999999999999;";
  equal(
    fix(ok, inp1, {
      decode: true,
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-numeric",
        entityName: null,
        rangeFrom: 0,
        rangeTo: 20,
        rangeValEncoded: null,
        rangeValDecoded: null,
      },
    ],
    "03.01"
  );
  equal(gathered, [], "03.02");
});

// decode off

test(`04 - ${`\u001b[${33}m${"numeric entities"}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - no decode, within ASCII range - A`, () => {
  let gathered = [];
  let inp1 = "&#65;";
  equal(
    fix(ok, inp1, {
      decode: false,
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "04.01"
  );
  equal(gathered, [], "04.02");
});

test(`05 - ${`\u001b[${33}m${"numeric entities"}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - no decode, outside ASCII range - pound`, () => {
  let gathered = [];
  let inp1 = "&#163;";
  equal(
    fix(ok, inp1, {
      decode: false,
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "05.01"
  );
  equal(gathered, [], "05.02");
});

test(`06 - ${`\u001b[${33}m${"numeric entities"}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - no decode, outside ASCII range - non-existing number`, () => {
  let gathered = [];
  let inp1 = "&#99999999999999999;";
  equal(
    fix(ok, inp1, {
      decode: false,
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-numeric",
        entityName: null,
        rangeFrom: 0,
        rangeTo: 20,
        rangeValEncoded: null,
        rangeValDecoded: null,
      },
    ],
    "06.01"
  );
  equal(gathered, [], "06.02");
});

test(`07 - ${`\u001b[${33}m${"numeric entities"}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - dollar instead of hash`, () => {
  let gathered = [];
  let inp1 = "&$65;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-numeric",
        entityName: null,
        rangeFrom: 0,
        rangeTo: 5,
        rangeValEncoded: null,
        rangeValDecoded: null,
      },
    ],
    "07.01"
  );
  equal(gathered, [], "07.02");
});

test(`08 - ${`\u001b[${33}m${"numeric entities"}\u001b[${39}m`} - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decoding text with healthy numeric entities`, () => {
  let gathered = [];
  let inp1 = "something here &#163;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      decode: false,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "08.01"
  );
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      decode: true,
    }),
    [
      {
        ruleName: "bad-html-entity-encoded-numeric",
        entityName: "#163",
        rangeFrom: 15,
        rangeTo: 21,
        rangeValEncoded: "&#163;",
        rangeValDecoded: "\xA3",
      },
    ],
    "08.02"
  );
  equal(fix(ok, inp1, { decode: true }), [[15, 21, "\xA3"]], "08.03");
  equal(gathered, [], "08.04");
});

test(`09 - ${`\u001b[${33}m${"numeric entities"}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - decode outside ASCII range - pound`, () => {
  let gathered = [];
  let inp1 = "&#xA3;";
  equal(fix(ok, inp1, { decode: true }), [[0, 6, "\xA3"]], "09.01");
  equal(
    fix(ok, inp1, {
      decode: true,
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-encoded-numeric",
        entityName: "#xA3",
        rangeFrom: 0,
        rangeTo: 6,
        rangeValEncoded: inp1,
        rangeValDecoded: "\xA3",
      },
    ],
    "09.02"
  );
  equal(gathered, [], "09.03");
});

test(`10 - ${`\u001b[${33}m${"numeric entities"}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - swapped hash and x, no decode - pound`, () => {
  let gathered = [];
  let inp1 = "&x#A3;";
  equal(
    fix(ok, inp1, {
      decode: false,
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-numeric",
        entityName: null,
        rangeFrom: 0,
        rangeTo: 6,
        rangeValEncoded: null,
        rangeValDecoded: null,
      },
    ],
    "10.01"
  );
  equal(gathered, [], "10.02");
});

test(`11 - ${`\u001b[${33}m${"numeric entities"}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - swapped hash and x, with decode - pound`, () => {
  let gathered = [];
  let inp1 = "&x#A3;";
  equal(fix(ok, inp1, { decode: true }), [[0, 6]], "11.01");
  equal(
    fix(ok, inp1, {
      decode: true,
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-numeric",
        entityName: null,
        rangeFrom: 0,
        rangeTo: 6,
        rangeValEncoded: null,
        rangeValDecoded: null,
      },
    ],
    "11.02"
  );
  equal(gathered, [], "11.03");
});

test(`12 - ${`\u001b[${33}m${"numeric entities"}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - &#x pattern with hash missing`, () => {
  let gathered = [];
  let inp1 = "&x1000;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-numeric",
        entityName: null,
        rangeFrom: 0,
        rangeTo: 7,
        rangeValEncoded: null,
        rangeValDecoded: null,
      },
    ],
    "12.01"
  );
  equal(gathered, [], "12.02");
});

test(`13 - ${`\u001b[${33}m${"numeric entities"}\u001b[${39}m`} - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - missing ampersand`, () => {
  let gathered = [];
  let inp1 = "abc#x26;def";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [
      {
        ruleName: "bad-html-entity-malformed-numeric",
        entityName: null,
        rangeFrom: 3,
        rangeTo: 8,
        rangeValEncoded: null,
        rangeValDecoded: null,
      },
    ],
    "13.01"
  );
  equal(gathered, [], "13.02");
});

test.run();
