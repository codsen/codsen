import tap from "tap";
import { fixEnt as fix } from "../dist/string-fix-broken-named-entities.esm";

tap.test(
  `01 - ${`\u001b[${36}m${`rogue character`}\u001b[${39}m`} - in front of semicolon - no decode`,
  (t) => {
    t.strictSame(fix("&pound1;", { decode: false }), [[0, 8, "&pound;"]], "01");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`rogue character`}\u001b[${39}m`} - in front of semicolon - decode`,
  (t) => {
    t.strictSame(fix("&pound1;", { decode: true }), [[0, 8, "\xA3"]], "02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`rogue character`}\u001b[${39}m`} - no semi - no decode`,
  (t) => {
    t.strictSame(fix("&puvaaa", { decode: false }), [], "03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`rogue character`}\u001b[${39}m`} - with semi - no decode`,
  (t) => {
    t.strictSame(fix("&puv;aaa", { decode: false }), [[0, 5, "&piv;"]], "04");
    t.end();
  }
);

// Levenshtein distance 1 - rogue char

tap.test(
  `05 - ${`\u001b[${36}m${`rogue character`}\u001b[${39}m`} - with semi - no decode - an extra rogue char`,
  (t) => {
    t.strictSame(
      fix("&nbsdp;aaa", { decode: false }),
      [[0, 7, "&nbsp;"]],
      "05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`rogue character`}\u001b[${39}m`} - with semi - no decode - an extra rogue char`,
  (t) => {
    t.strictSame(
      fix("&bigtrianglesup;aaa", { decode: false }),
      [[0, 16, "&bigtriangleup;"]],
      "06"
    );
    t.end();
  }
);

// Levenshtein distance 1 - replaced char

tap.test(
  `07 - ${`\u001b[${36}m${`rogue character`}\u001b[${39}m`} - with semi - no decode - a replaced char`,
  (t) => {
    t.strictSame(fix("&npsp;aaa", { decode: false }), [[0, 6, "&nbsp;"]], "07");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`rogue character`}\u001b[${39}m`} - with semi - no decode - a replaced char`,
  (t) => {
    t.strictSame(
      fix("&bigtrangleup;aaa", { decode: false }),
      [[0, 14, "&bigtriangleup;"]],
      "08"
    );
    t.end();
  }
);
