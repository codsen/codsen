import tap from "tap";
import { er } from "../dist/easy-replace.esm.js";

// ==============================
// outsideNot's
// ==============================

tap.test("01 - rightOutsideNot satisfied thus not replaced", (t) => {
  t.equal(
    er(
      "🐴a",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "a",
      },
      "c"
    ),
    "🐴a",
    "test 12.1.1"
  );
  t.equal(
    er(
      "🐴a",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: ["a"],
      },
      "c"
    ),
    "🐴a",
    "test 12.1.2"
  );
  t.end();
});

tap.test("02 - outsideNot left satisfied thus not replaced", (t) => {
  t.equal(
    er(
      "a🐴",
      {
        leftOutsideNot: "a",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "c"
    ),
    "a🐴",
    "test 12.2.1"
  );
  t.equal(
    er(
      "a🐴",
      {
        leftOutsideNot: ["a"],
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "c"
    ),
    "a🐴",
    "test 12.2.2"
  );
  t.end();
});

tap.test("03 - outsideNot's satisfied thus not replaced", (t) => {
  t.equal(
    er(
      "a🐴a",
      {
        leftOutsideNot: "a",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "a",
      },
      "c"
    ),
    "a🐴a",
    "test 12.3"
  );
  t.end();
});

tap.test("04 - outsideNot's not satisfied, with 1 maybe replaced", (t) => {
  t.equal(
    er(
      "zb🐴y",
      {
        leftOutsideNot: "a",
        leftOutside: "",
        leftMaybe: "b",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "c",
      },
      "🦄"
    ),
    "z🦄y",
    "test 12.4"
  );
  t.end();
});

tap.test("05 - leftOutsideNot blocked positive leftMaybe", (t) => {
  t.equal(
    er(
      "zb🐴y",
      {
        leftOutsideNot: "z",
        leftOutside: "",
        leftMaybe: "b",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "whatevs"
    ),
    "zb🐴y",
    "test 12.5"
  );
  t.end();
});

tap.test("06 - rightOutsideNot blocked both L-R maybes", (t) => {
  t.equal(
    er(
      "zb🐴cy",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["b", "a"],
        searchFor: "🐴",
        rightMaybe: ["a", "c"],
        rightOutside: "",
        rightOutsideNot: ["y", "a"],
      },
      "whatevs"
    ),
    "zb🐴cy",
    "test 12.6"
  );
  t.end();
});

tap.test("07 - rightOutsideNot last char goes outside", (t) => {
  t.equal(
    er(
      "cccccccca",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "a",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "b",
      },
      "b"
    ),
    "ccccccccb",
    "test 12.7"
  );
  t.end();
});

tap.test("08 - right maybe is last char, outsideNot satisfied", (t) => {
  t.equal(
    er(
      "cccccccca",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "c",
        rightMaybe: "a",
        rightOutside: "",
        rightOutsideNot: "c",
      },
      "c"
    ),
    "cccccccc",
    "test 12.8"
  );
  t.end();
});

tap.test("09 - real life scenario, missing semicol on nbsp #1", (t) => {
  t.equal(
    er(
      "&nbsp; &nbsp &nbsp",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "nbsp",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: ";",
      },
      "nbsp;"
    ),
    "&nbsp; &nbsp; &nbsp;",
    "test 12.9"
  );
  t.end();
});

tap.test("10 - real life scenario, missing semicol on nbsp #2", (t) => {
  t.equal(
    er(
      "&nbsp;&nbsp&nbsp",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "nbsp",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: ";",
      },
      "nbsp;"
    ),
    "&nbsp;&nbsp;&nbsp;",
    "test 12.10"
  );
  t.end();
});

tap.test("11 - real life scenario, missing ampersand, text", (t) => {
  t.equal(
    er(
      "tralalalanbsp;nbsp;&nbsp;",
      {
        leftOutsideNot: "&",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "nbsp",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "&nbsp"
    ),
    "tralalala&nbsp;&nbsp;&nbsp;",
    "test 12.11"
  );
  t.end();
});

tap.test("12 - as before but with emoji instead", (t) => {
  t.equal(
    er(
      "🍺🍺👌🍺",
      {
        leftOutsideNot: "👌",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🍺",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "🍻"
    ),
    "🍻🍻👌🍺",
    "test 12.12"
  );
  t.end();
});

tap.test("13 - rightOutsideNot with L-R maybes", (t) => {
  t.equal(
    er(
      "zb🐴cy",
      {
        leftOutsideNot: ["a"],
        leftOutside: "",
        leftMaybe: ["b", "a"],
        searchFor: "🐴",
        rightMaybe: ["a", "c"],
        rightOutside: "",
        rightOutsideNot: ["c", "a"],
      },
      "x"
    ),
    "zxy",
    "test 12.13"
  );
  t.end();
});

tap.test("14 - all of 'em #1", (t) => {
  t.equal(
    er(
      "zb🐴cy",
      {
        leftOutsideNot: ["c", "b"],
        leftOutside: ["z", "y"],
        leftMaybe: ["a", "b", "c"],
        searchFor: "🐴",
        rightMaybe: ["a", "b", "c"],
        rightOutside: ["z", "y"],
        rightOutsideNot: ["c", "b"],
      },
      "x"
    ),
    "zxy",
    "test 12.14"
  );
  t.end();
});

tap.test("15 - all of 'em #2", (t) => {
  t.equal(
    er(
      "zb🐴cy",
      {
        leftOutsideNot: ["", "", ""],
        leftOutside: ["z", "y"],
        leftMaybe: ["a", "b", "c"],
        searchFor: "🐴",
        rightMaybe: ["a", "b", "c"],
        rightOutside: ["z", "y"],
        rightOutsideNot: ["", "", ""],
      },
      "x"
    ),
    "zxy",
    "test 12.14"
  );
  t.end();
});
