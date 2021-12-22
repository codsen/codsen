import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import fix from "./util/util.js";
import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";

test(`01 - ${`\u001b[${36}m${`rogue character`}\u001b[${39}m`} - in front of semicolon - no decode`, () => {
  equal(fix(ok, "&pound1;", { decode: false }), [[0, 8, "&pound;"]], "01.01");

  let gathered = [];
  equal(
    fix(ok, "&pound1;", {
      decode: false,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [[0, 8, "&pound;"]],
    "01.02"
  );
  equal(gathered, [], "01.03");
});

test(`02 - ${`\u001b[${36}m${`rogue character`}\u001b[${39}m`} - in front of semicolon - decode`, () => {
  equal(fix(ok, "&pound1;", { decode: true }), [[0, 8, "\xA3"]], "02.01");

  let gathered = [];
  equal(
    fix(ok, "&pound1;", {
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [[0, 8, "\xA3"]],
    "02.02"
  );
  equal(gathered, [], "02.03");
});

test(`03 - ${`\u001b[${36}m${`rogue character`}\u001b[${39}m`} - no semi - no decode`, () => {
  equal(fix(ok, "&puvaaa", { decode: false }), [], "03.01");

  let gathered = [];
  equal(
    fixEnt("&puvaaa", {
      decode: false,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "03.02"
  );
  equal(
    fix(ok, "&puvaaa", {
      decode: false,
      textAmpersandCatcherCb: () => {},
    }),
    [],
    "03.03"
  );
  equal(gathered, [0], "03.04");
});

test(`04 - ${`\u001b[${36}m${`rogue character`}\u001b[${39}m`} - with semi - no decode`, () => {
  equal(fix(ok, "&puv;aaa", { decode: false }), [[0, 5, "&piv;"]], "04.01");

  let gathered = [];
  equal(
    fix(ok, "&puv;aaa", {
      decode: false,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [[0, 5, "&piv;"]],
    "04.02"
  );
  equal(gathered, [], "04.03");
});

// Levenshtein distance 1 - rogue char

test(`05 - ${`\u001b[${36}m${`rogue character`}\u001b[${39}m`} - with semi - no decode - an extra rogue char`, () => {
  equal(fix(ok, "&nbsdp;aaa", { decode: false }), [[0, 7, "&nbsp;"]], "05.01");

  let gathered = [];
  equal(
    fix(ok, "&nbsdp;aaa", {
      decode: false,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [[0, 7, "&nbsp;"]],
    "05.02"
  );
  equal(gathered, [], "05.03");
});

test(`06 - ${`\u001b[${36}m${`rogue character`}\u001b[${39}m`} - with semi - no decode - an extra rogue char`, () => {
  equal(
    fix(ok, "&bigtrianglesup;aaa", { decode: false }),
    [[0, 16, "&bigtriangleup;"]],
    "06.01"
  );

  let gathered = [];
  equal(
    fix(ok, "&bigtrianglesup;aaa", {
      decode: false,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [[0, 16, "&bigtriangleup;"]],
    "06.02"
  );
  equal(gathered, [], "06.03");
});

// Levenshtein distance 1 - replaced char

test(`07 - ${`\u001b[${36}m${`rogue character`}\u001b[${39}m`} - with semi - no decode - a replaced char`, () => {
  equal(fix(ok, "&npsp;aaa", { decode: false }), [[0, 6, "&nbsp;"]], "07.01");

  let gathered = [];
  equal(
    fix(ok, "&npsp;aaa", {
      decode: false,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [[0, 6, "&nbsp;"]],
    "07.02"
  );
  equal(gathered, [], "07.03");
});

test(`08 - ${`\u001b[${36}m${`rogue character`}\u001b[${39}m`} - with semi - no decode - a replaced char`, () => {
  equal(
    fix(ok, "&bigtrangleup;aaa", { decode: false }),
    [[0, 14, "&bigtriangleup;"]],
    "08.01"
  );

  let gathered = [];
  equal(
    fix(ok, "&bigtrangleup;aaa", {
      decode: false,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [[0, 14, "&bigtriangleup;"]],
    "08.02"
  );
  equal(gathered, [], "08.03");
});

test.run();
