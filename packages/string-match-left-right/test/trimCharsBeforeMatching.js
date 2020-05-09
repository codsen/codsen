import tap from "tap";
import {
  matchLeftIncl,
  matchRightIncl,
  matchLeft,
  matchRight,
} from "../dist/string-match-left-right.esm";

// opts.trimCharsBeforeMatching
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}       pt.1`,
  (t) => {
    function isSpace(char) {
      return typeof char === "string" && char.trim() === "";
    }
    // control
    t.equal(matchRight("</div>", 0, ["div"]), false, "01.01");
    t.equal(
      matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["/", " "] }),
      "div",
      "01.02"
    );
    // two character-long opts.trimCharsBeforeMatching
    t.throws(() => {
      matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["/ "] });
    }, "01.03");
    t.equal(
      matchRight("< / div>", 0, ["div"], {
        trimCharsBeforeMatching: ["/", " "],
      }),
      "div",
      "01.04"
    );
    t.equal(
      matchRight("< / div>", 0, ["hgfdf", "hkjh", "div", "00"], {
        trimCharsBeforeMatching: ["/", " "],
      }),
      "div",
      "01.05"
    );
    t.equal(
      matchRight("< / div>", 0, ["div"], { trimCharsBeforeMatching: ["/"] }),
      false,
      "01.06"
    );

    // opts.cb
    t.equal(
      matchRight("</div>", 0, ["div"], {
        cb: isSpace,
        trimCharsBeforeMatching: ["/", " "],
      }),
      false,
      "01.07"
    );
    t.equal(
      matchRight("< / div>", 0, ["zzzz", "div"], {
        cb: isSpace,
        trimCharsBeforeMatching: ["/", " "],
      }),
      false,
      "01.08"
    );
    t.equal(
      matchRight("< / div>", 0, ["div"], {
        cb: isSpace,
        trimCharsBeforeMatching: ["/", " "],
      }),
      false,
      "01.09"
    );
    t.equal(
      matchRight("< / div>", 0, ["div"], {
        cb: isSpace,
        trimCharsBeforeMatching: ["/"],
      }),
      false,
      "01.10"
    );
    t.equal(
      matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["/", 1] }),
      "div",
      "01.11"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}       pt.2`,
  (t) => {
    // matchRight
    t.equal(matchRight("</div>", 0, ["div"]), false, "02.01");
    t.equal(
      matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: "/" }),
      "div",
      "02.02 - opts.trimCharsBeforeMatching given as string"
    );
    t.equal(
      matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["/"] }),
      "div",
      "02.03 - opts.trimCharsBeforeMatching given within array"
    );
    t.equal(
      matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["a", "/"] }),
      "div",
      "02.04 - opts.trimCharsBeforeMatching given within array"
    );
    t.equal(
      matchRight("<adiv>", 0, ["div"], { trimCharsBeforeMatching: "A" }),
      false,
      "02.05"
    );
    t.equal(
      matchRight("<adiv>", 0, ["div"], {
        i: false,
        trimCharsBeforeMatching: "A",
      }),
      false,
      "02.06"
    );
    t.equal(
      matchRight("<adiv>", 0, ["div"], {
        i: true,
        trimCharsBeforeMatching: "A",
      }),
      "div",
      "02.07 - case insensitive affects trimCharsBeforeMatching too and yields results"
    );
    t.equal(
      matchRight("<adiv>", 0, ["dIv"], {
        i: true,
        trimCharsBeforeMatching: ["1", "A"],
      }),
      "dIv",
      "02.08"
    );
    // matchRightIncl
    t.equal(matchRightIncl("</div>", 0, ["div"]), false, "02.09");
    t.equal(
      matchRightIncl("</div>", 0, ["div"], { trimCharsBeforeMatching: "<" }),
      false,
      "02.10"
    );
    t.equal(
      matchRightIncl("</div>", 0, ["yo", "div"], {
        trimCharsBeforeMatching: ["<", "/"],
      }),
      "div",
      "02.11"
    );
    t.equal(
      matchRightIncl("abdiv>", 0, ["yo", "div"], {
        trimCharsBeforeMatching: ["c", "a", "b"],
      }),
      "div",
      "02.12"
    );
    t.equal(
      matchRightIncl("abdiv>", 0, ["yo", "div"], {
        trimCharsBeforeMatching: ["C", "A", "B"],
      }),
      false,
      "02.13"
    );
    t.equal(
      matchRightIncl("abdiv>", 0, ["yo", "div"], {
        i: true,
        trimCharsBeforeMatching: ["C", "A", "B"],
      }),
      "div",
      "02.14"
    );
    t.equal(
      matchRightIncl("abdiv>", 0, ["yo", "dIv"], {
        i: true,
        trimCharsBeforeMatching: ["C", "A", "B"],
      }),
      "dIv",
      "02.15"
    );
    // matchLeft
    t.equal(matchLeft("</divz>", 6, ["div"]), false, "02.16");
    t.equal(
      matchLeft("</divz>", 6, ["div"], { trimCharsBeforeMatching: "z" }),
      "div",
      "02.17"
    );
    t.equal(
      matchLeft("</divz>", 6, ["div"], { trimCharsBeforeMatching: ["z"] }),
      "div",
      "02.18"
    );
    t.equal(
      matchLeft("</divz>", 6, ["div"], { trimCharsBeforeMatching: ["Z"] }),
      false,
      "02.19"
    );
    t.equal(
      matchLeft("</divz>", 6, ["div"], {
        i: false,
        trimCharsBeforeMatching: ["Z"],
      }),
      false,
      "02.20"
    );
    t.equal(
      matchLeft("</divz>", 6, ["div"], {
        i: true,
        trimCharsBeforeMatching: ["Z"],
      }),
      "div",
      "02.21"
    );
    t.equal(
      matchLeft("</divz>", 6, ["dIv"], {
        i: true,
        trimCharsBeforeMatching: ["Z"],
      }),
      "dIv",
      "02.22"
    );
    // matchLeftIncl
    t.equal(matchLeftIncl("</divz>", 6, ["div"]), false, "02.23");
    t.equal(
      matchLeftIncl("</divz>", 6, ["div"], { trimCharsBeforeMatching: "z" }),
      false,
      "02.24"
    );
    t.equal(
      matchLeftIncl("</divz>", 6, ["div"], {
        trimCharsBeforeMatching: ["z", ">"],
      }),
      "div",
      "02.25"
    );
    t.equal(
      matchLeftIncl("</divz>", 6, ["div"], {
        trimCharsBeforeMatching: ["a", "z", ">"],
      }),
      "div",
      "02.26"
    );
    t.equal(
      matchLeftIncl("</divz>", 6, ["div"], {
        trimCharsBeforeMatching: ["Z", ">"],
      }),
      false,
      "02.27"
    );
    t.equal(
      matchLeftIncl("</divz>", 6, ["div"], {
        i: false,
        trimCharsBeforeMatching: ["a", "Z", ">"],
      }),
      false,
      "02.28"
    );
    t.equal(
      matchLeftIncl("</divz>", 6, ["div"], {
        i: true,
        trimCharsBeforeMatching: ["a", "Z", ">"],
      }),
      "div",
      "02.29"
    );
    t.equal(
      matchLeftIncl("</divz>", 6, ["dIv"], {
        i: true,
        trimCharsBeforeMatching: ["a", "Z", ">"],
      }),
      "dIv",
      "02.30"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}       throws`,
  (t) => {
    t.equal(
      matchRight("</div>", 0, ["zz", "div"], {
        trimCharsBeforeMatching: ["/", "<"],
      }),
      "div",
      "03.01"
    );
    t.throws(() => {
      matchRight("</div>", 0, ["zz", "div"], {
        trimCharsBeforeMatching: ["/<"], // <--- has to be character-by-character
      });
    }, "03.02");

    t.equal(
      matchLeft("</div>", 5, ["zz", "div"], {
        trimCharsBeforeMatching: ["/", "<"],
      }),
      "div",
      "03.03"
    );
    t.throws(() => {
      matchLeft("</div>", 5, ["zz", "div"], {
        trimCharsBeforeMatching: ["/<"], // <--- has to be character-by-character
      });
    }, "03.04");

    t.equal(
      matchRightIncl("</div>", 1, ["zz", "div"], {
        trimCharsBeforeMatching: ["/", "<"],
      }),
      "div",
      "03.05"
    );
    t.throws(() => {
      matchRightIncl("</div>", 1, ["zz", "div"], {
        trimCharsBeforeMatching: ["/<"], // <--- has to be character-by-character
      });
    }, "03.06");

    t.equal(
      matchLeftIncl("</div>", 4, ["zz", "div"], {
        trimCharsBeforeMatching: ["/", "<"],
      }),
      "div",
      "03.07"
    );
    t.throws(() => {
      matchLeftIncl("</div>", 4, ["zz", "div"], {
        trimCharsBeforeMatching: ["/<"], // <--- has to be character-by-character
      });
    }, "03.08");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft("za", 1, [() => "EOL"]),
      false,
      "04 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft("za", 1, [() => "EOL"], {
        trimCharsBeforeMatching: ["z"],
      }),
      "EOL",
      "05 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft("za", 1, ["a", () => "EOL"]),
      false,
      "06 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`,
  (t) => {
    t.equal(matchLeft("za", 1, ["z", () => "EOL"]), "z", "07 - z caught");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft("za", 1, ["a", () => "EOL"], {
        trimCharsBeforeMatching: ["z"],
      }),
      "EOL",
      "08 - whitespace trim opt on"
    );
    t.end();
  }
);
