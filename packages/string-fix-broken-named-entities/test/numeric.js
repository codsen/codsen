// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";
import fix from "./util/util.js";

// decode on

test(`01 - numeric entities - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decode within ASCII range - A`, () => {
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
    "01.01",
  );
  equal(gathered, [], "01.02");
});

test(`02 - numeric entities - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decode outside ASCII range - pound`, () => {
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
    "02.01",
  );
  equal(gathered, [], "02.02");
});

test(`03 - numeric entities - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decode outside ASCII range - non-existing number`, () => {
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
    "03.01",
  );
  equal(gathered, [], "03.02");
});

// decode off

test(`04 - numeric entities - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - no decode, within ASCII range - A`, () => {
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
    "04.01",
  );
  equal(gathered, [], "04.02");
});

test(`05 - numeric entities - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - no decode, outside ASCII range - pound`, () => {
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
    "05.01",
  );
  equal(gathered, [], "05.02");
});

test(`06 - numeric entities - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - no decode, outside ASCII range - non-existing number`, () => {
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
    "06.01",
  );
  equal(gathered, [], "06.02");
});

test(`07 - numeric entities - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - dollar instead of hash`, () => {
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
    "07.01",
  );
  equal(gathered, [], "07.02");
});

test(`08 - numeric entities - ${`\u001b[${31}m${"decimal pattern"}\u001b[${39}m`} - decoding text with healthy numeric entities`, () => {
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
    "08.01",
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
    "08.02",
  );
  equal(fix(ok, inp1, { decode: true }), [[15, 21, "\xA3"]], "08.03");
  equal(gathered, [], "08.04");
});

test(`09 - numeric entities - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - decode outside ASCII range - pound`, () => {
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
    "09.02",
  );
  equal(gathered, [], "09.03");
});

test(`10 - numeric entities - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - swapped hash and x, no decode - pound`, () => {
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
    "10.01",
  );
  equal(gathered, [], "10.02");
});

test(`11 - numeric entities - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - swapped hash and x, with decode - pound`, () => {
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
    "11.02",
  );
  equal(gathered, [], "11.03");
});

test(`12 - numeric entities - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - &#x pattern with hash missing`, () => {
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
    "12.01",
  );
  equal(gathered, [], "12.02");
});

test(`13 - numeric entities - ${`\u001b[${34}m${"hexidecimal pattern"}\u001b[${39}m`} - missing ampersand`, () => {
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
    "13.01",
  );
  equal(gathered, [], "13.02");
});

test("14 - valid scalar references agree across bases and decode whole code points", () => {
  for (const [value, decoded] of [
    [1, "\u0001"],
    [128, "\u0080"],
    [0xd7ff, "\uD7FF"],
    [0xe000, "\uE000"],
    [0xffff, "\uFFFF"],
    [0x10000, "\u{10000}"],
    [0x1f600, "😀"],
    [0xf0000, "\u{F0000}"],
    [0x10ffff, "\u{10FFFF}"],
  ]) {
    for (const input of [
      `&#${value};`,
      `&#x${value.toString(16)};`,
      `&#X${value.toString(16).toUpperCase()};`,
    ]) {
      for (const decode of [false, true]) {
        let entities = [];
        let amps = [];
        equal(
          fixEnt(input, {
            decode,
            entityCatcherCb: (from, to) => entities.push([from, to]),
            textAmpersandCatcherCb: (index) => amps.push(index),
          }),
          decode ? [[0, input.length, decoded]] : [],
          "14.01",
        );
        equal(
          fixEnt(input, { decode, cb: (obj) => obj }),
          decode
            ? [
                {
                  ruleName: "bad-html-entity-encoded-numeric",
                  entityName: input.slice(1, -1),
                  rangeFrom: 0,
                  rangeTo: input.length,
                  rangeValEncoded: input,
                  rangeValDecoded: decoded,
                },
              ]
            : [],
          "14.02",
        );
        equal(entities, [[0, input.length]], "14.03");
        equal(amps, [], "14.04");
      }
    }
  }
});

test("15 - uppercase hexadecimal markers and leading zeroes remain healthy", () => {
  for (const input of ["&#X41;", "&#00065;", "&#x00041;", "&#X00041;"]) {
    equal(fixEnt(input), [], "15.01");
    equal(fixEnt(input, { decode: true }), [[0, input.length, "A"]], "15.02");
  }
});

test("16 - malformed numeric payloads are deleted without decoding prefixes", () => {
  for (const input of [
    "&#xzz;",
    "&#x41zz;",
    "&#X41zz;",
    "&#12#3;",
    "&##65;",
    "&#x#41;",
    "&#1e2;",
    "&#;",
    "&#x;",
    "&#X;",
    "&#x 41;",
  ]) {
    for (const decode of [false, true]) {
      let entities = [];
      let amps = [];
      equal(
        fixEnt(input, {
          decode,
          entityCatcherCb: (from, to) => entities.push([from, to]),
          textAmpersandCatcherCb: (index) => amps.push(index),
        }),
        [[0, input.length]],
        "16.01",
      );
      equal(
        fixEnt(input, { decode, cb: (obj) => obj }),
        [
          {
            ruleName: "bad-html-entity-malformed-numeric",
            entityName: null,
            rangeFrom: 0,
            rangeTo: input.length,
            rangeValEncoded: null,
            rangeValDecoded: null,
          },
        ],
        "16.02",
      );
      equal(entities, [], "16.03");
      equal(amps, [], "16.04");
    }
  }
});

test("17 - null, surrogate and out-of-range references use malformed deletion", () => {
  for (const value of [0, 0xd800, 0xdfff, 0x110000, 999999999999999]) {
    for (const input of [`&#${value};`, `&#x${value.toString(16)};`]) {
      for (const decode of [false, true]) {
        let entities = [];
        equal(
          fixEnt(input, {
            decode,
            entityCatcherCb: (from, to) => entities.push([from, to]),
          }),
          [[0, input.length]],
          "17.01",
        );
        equal(
          fixEnt(input, { decode, cb: (obj) => obj }),
          [
            {
              ruleName: "bad-html-entity-malformed-numeric",
              entityName: null,
              rangeFrom: 0,
              rangeTo: input.length,
              rangeValEncoded: null,
              rangeValDecoded: null,
            },
          ],
          "17.02",
        );
        equal(entities, [], "17.03");
      }
    }
  }
});

test("18 - abandoned numeric markers cannot consume later prose", () => {
  for (const input of [
    "#x26",
    "#x26!",
    "#x26! hello;",
    "#x26? hello;",
    "#x26, hello;",
    "#x26. hello;",
    "#x26\n! hello;",
    `#x26${"a".repeat(51)} hello;`,
  ]) {
    for (const decode of [false, true]) {
      let entities = [];
      equal(
        fixEnt(input, {
          decode,
          entityCatcherCb: (from, to) => entities.push([from, to]),
        }),
        [],
        "18.01",
      );
      equal(fixEnt(input, { decode, cb: (obj) => obj }), [], "18.02");
      equal(entities, [], "18.03");
    }
  }
});

test("19 - consecutive candidates and intervening healthy references stay separate", () => {
  for (const decode of [false, true]) {
    equal(fixEnt("#x26! #x41;", { decode }), [[6, 11]], "19.01");
    equal(
      fixEnt("#x26; #x41;", { decode }),
      [
        [0, 5],
        [6, 11],
      ],
      "19.02",
    );
    let input = "#x26! &#65; hello; &";
    let entities = [];
    let amps = [];
    equal(
      fixEnt(input, {
        decode,
        entityCatcherCb: (from, to) => entities.push([from, to]),
        textAmpersandCatcherCb: (index) => amps.push(index),
      }),
      decode ? [[6, 11, "A"]] : [],
      "19.03",
    );
    equal(entities, [[6, 11]], "19.04");
    equal(amps, [input.length - 1], "19.05");
  }
});

test.run();
