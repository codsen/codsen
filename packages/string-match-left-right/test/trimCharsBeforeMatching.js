import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  matchLeftIncl,
  matchRightIncl,
  matchLeft,
  matchRight,
} from "../dist/string-match-left-right.esm.js";

// opts.trimCharsBeforeMatching
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}       pt.1`, () => {
  function isSpace(char) {
    return typeof char === "string" && char.trim() === "";
  }
  // control
  equal(matchRight("</div>", 0, ["div"]), false, "01.01");
  equal(
    matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["/", " "] }),
    "div",
    "01.02"
  );
  // two character-long opts.trimCharsBeforeMatching
  throws(() => {
    matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["/ "] });
  }, "01.03");
  equal(
    matchRight("< / div>", 0, ["div"], {
      trimCharsBeforeMatching: ["/", " "],
    }),
    "div",
    "01.04"
  );
  equal(
    matchRight("< / div>", 0, ["hgfdf", "hkjh", "div", "00"], {
      trimCharsBeforeMatching: ["/", " "],
    }),
    "div",
    "01.05"
  );
  equal(
    matchRight("< / div>", 0, ["div"], { trimCharsBeforeMatching: ["/"] }),
    false,
    "01.06"
  );

  // opts.cb
  equal(
    matchRight("</div>", 0, ["div"], {
      cb: isSpace,
      trimCharsBeforeMatching: ["/", " "],
    }),
    false,
    "01.07"
  );
  equal(
    matchRight("< / div>", 0, ["zzzz", "div"], {
      cb: isSpace,
      trimCharsBeforeMatching: ["/", " "],
    }),
    false,
    "01.08"
  );
  equal(
    matchRight("< / div>", 0, ["div"], {
      cb: isSpace,
      trimCharsBeforeMatching: ["/", " "],
    }),
    false,
    "01.09"
  );
  equal(
    matchRight("< / div>", 0, ["div"], {
      cb: isSpace,
      trimCharsBeforeMatching: ["/"],
    }),
    false,
    "01.10"
  );
  equal(
    matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["/", 1] }),
    "div",
    "01.11"
  );
});

test(`02 - ${`\u001b[${34}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}       pt.2`, () => {
  // matchRight
  equal(matchRight("</div>", 0, ["div"]), false, "02.01");
  equal(
    matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: "/" }),
    "div",
    "02.02 - opts.trimCharsBeforeMatching given as string"
  );
  equal(
    matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["/"] }),
    "div",
    "02.03 - opts.trimCharsBeforeMatching given within array"
  );
  equal(
    matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["a", "/"] }),
    "div",
    "02.04 - opts.trimCharsBeforeMatching given within array"
  );
  equal(
    matchRight("<adiv>", 0, ["div"], { trimCharsBeforeMatching: "A" }),
    false,
    "02.05"
  );
  equal(
    matchRight("<adiv>", 0, ["div"], {
      i: false,
      trimCharsBeforeMatching: "A",
    }),
    false,
    "02.06"
  );
  equal(
    matchRight("<adiv>", 0, ["div"], {
      i: true,
      trimCharsBeforeMatching: "A",
    }),
    "div",
    "02.07 - case insensitive affects trimCharsBeforeMatching too and yields results"
  );
  equal(
    matchRight("<adiv>", 0, ["dIv"], {
      i: true,
      trimCharsBeforeMatching: ["1", "A"],
    }),
    "dIv",
    "02.08"
  );
  // matchRightIncl
  equal(matchRightIncl("</div>", 0, ["div"]), false, "02.09");
  equal(
    matchRightIncl("</div>", 0, ["div"], { trimCharsBeforeMatching: "<" }),
    false,
    "02.10"
  );
  equal(
    matchRightIncl("</div>", 0, ["yo", "div"], {
      trimCharsBeforeMatching: ["<", "/"],
    }),
    "div",
    "02.11"
  );
  equal(
    matchRightIncl("abdiv>", 0, ["yo", "div"], {
      trimCharsBeforeMatching: ["c", "a", "b"],
    }),
    "div",
    "02.12"
  );
  equal(
    matchRightIncl("abdiv>", 0, ["yo", "div"], {
      trimCharsBeforeMatching: ["C", "A", "B"],
    }),
    false,
    "02.13"
  );
  equal(
    matchRightIncl("abdiv>", 0, ["yo", "div"], {
      i: true,
      trimCharsBeforeMatching: ["C", "A", "B"],
    }),
    "div",
    "02.14"
  );
  equal(
    matchRightIncl("abdiv>", 0, ["yo", "dIv"], {
      i: true,
      trimCharsBeforeMatching: ["C", "A", "B"],
    }),
    "dIv",
    "02.15"
  );
  // matchLeft
  equal(matchLeft("</divz>", 6, ["div"]), false, "02.16");
  equal(
    matchLeft("</divz>", 6, ["div"], { trimCharsBeforeMatching: "z" }),
    "div",
    "02.17"
  );
  equal(
    matchLeft("</divz>", 6, ["div"], { trimCharsBeforeMatching: ["z"] }),
    "div",
    "02.18"
  );
  equal(
    matchLeft("</divz>", 6, ["div"], { trimCharsBeforeMatching: ["Z"] }),
    false,
    "02.19"
  );
  equal(
    matchLeft("</divz>", 6, ["div"], {
      i: false,
      trimCharsBeforeMatching: ["Z"],
    }),
    false,
    "02.20"
  );
  equal(
    matchLeft("</divz>", 6, ["div"], {
      i: true,
      trimCharsBeforeMatching: ["Z"],
    }),
    "div",
    "02.21"
  );
  equal(
    matchLeft("</divz>", 6, ["dIv"], {
      i: true,
      trimCharsBeforeMatching: ["Z"],
    }),
    "dIv",
    "02.22"
  );
  // matchLeftIncl
  equal(matchLeftIncl("</divz>", 6, ["div"]), false, "02.23");
  equal(
    matchLeftIncl("</divz>", 6, ["div"], { trimCharsBeforeMatching: "z" }),
    false,
    "02.24"
  );
  equal(
    matchLeftIncl("</divz>", 6, ["div"], {
      trimCharsBeforeMatching: ["z", ">"],
    }),
    "div",
    "02.25"
  );
  equal(
    matchLeftIncl("</divz>", 6, ["div"], {
      trimCharsBeforeMatching: ["a", "z", ">"],
    }),
    "div",
    "02.26"
  );
  equal(
    matchLeftIncl("</divz>", 6, ["div"], {
      trimCharsBeforeMatching: ["Z", ">"],
    }),
    false,
    "02.27"
  );
  equal(
    matchLeftIncl("</divz>", 6, ["div"], {
      i: false,
      trimCharsBeforeMatching: ["a", "Z", ">"],
    }),
    false,
    "02.28"
  );
  equal(
    matchLeftIncl("</divz>", 6, ["div"], {
      i: true,
      trimCharsBeforeMatching: ["a", "Z", ">"],
    }),
    "div",
    "02.29"
  );
  equal(
    matchLeftIncl("</divz>", 6, ["dIv"], {
      i: true,
      trimCharsBeforeMatching: ["a", "Z", ">"],
    }),
    "dIv",
    "02.30"
  );
});

test(`03 - ${`\u001b[${34}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}       throws`, () => {
  equal(
    matchRight("</div>", 0, ["zz", "div"], {
      trimCharsBeforeMatching: ["/", "<"],
    }),
    "div",
    "03.01"
  );
  throws(() => {
    matchRight("</div>", 0, ["zz", "div"], {
      trimCharsBeforeMatching: ["/<"], // <--- has to be character-by-character
    });
  }, "03.02");

  equal(
    matchLeft("</div>", 5, ["zz", "div"], {
      trimCharsBeforeMatching: ["/", "<"],
    }),
    "div",
    "03.03"
  );
  throws(() => {
    matchLeft("</div>", 5, ["zz", "div"], {
      trimCharsBeforeMatching: ["/<"], // <--- has to be character-by-character
    });
  }, "03.04");

  equal(
    matchRightIncl("</div>", 1, ["zz", "div"], {
      trimCharsBeforeMatching: ["/", "<"],
    }),
    "div",
    "03.05"
  );
  throws(() => {
    matchRightIncl("</div>", 1, ["zz", "div"], {
      trimCharsBeforeMatching: ["/<"], // <--- has to be character-by-character
    });
  }, "03.06");

  equal(
    matchLeftIncl("</div>", 4, ["zz", "div"], {
      trimCharsBeforeMatching: ["/", "<"],
    }),
    "div",
    "03.07"
  );
  throws(() => {
    matchLeftIncl("</div>", 4, ["zz", "div"], {
      trimCharsBeforeMatching: ["/<"], // <--- has to be character-by-character
    });
  }, "03.08");
});

test(`04 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`, () => {
  equal(
    matchLeft("za", 1, [() => "EOL"]),
    false,
    "04.01 - whitespace trim opts control"
  );
});

test(`05 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`, () => {
  equal(
    matchLeft("za", 1, [() => "EOL"], {
      trimCharsBeforeMatching: ["z"],
    }),
    "EOL",
    "05.01 - whitespace trim opt on"
  );
});

test(`06 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`, () => {
  equal(
    matchLeft("za", 1, ["a", () => "EOL"]),
    false,
    "06.01 - whitespace trim opts control"
  );
});

test(`07 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`, () => {
  equal(matchLeft("za", 1, ["z", () => "EOL"]), "z", "07.01 - z caught");
});

test(`08 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`, () => {
  equal(
    matchLeft("za", 1, ["a", () => "EOL"], {
      trimCharsBeforeMatching: ["z"],
    }),
    "EOL",
    "08.01 - whitespace trim opt on"
  );
});

test.run();
