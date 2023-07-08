import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { er } from "../dist/easy-replace.esm.js";

// ==============================
// outsideNot's
// ==============================

test("01 - rightOutsideNot satisfied thus not replaced", () => {
  equal(
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
      "c",
    ),
    "🐴a",
    "test 12.1.1",
  );
  equal(
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
      "c",
    ),
    "🐴a",
    "test 12.1.2",
  );
});

test("02 - outsideNot left satisfied thus not replaced", () => {
  equal(
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
      "c",
    ),
    "a🐴",
    "test 12.2.1",
  );
  equal(
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
      "c",
    ),
    "a🐴",
    "test 12.2.2",
  );
});

test("03 - outsideNot's satisfied thus not replaced", () => {
  equal(
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
      "c",
    ),
    "a🐴a",
    "test 12.3",
  );
});

test("04 - outsideNot's not satisfied, with 1 maybe replaced", () => {
  equal(
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
      "🦄",
    ),
    "z🦄y",
    "test 12.4",
  );
});

test("05 - leftOutsideNot blocked positive leftMaybe", () => {
  equal(
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
      "whatevs",
    ),
    "zb🐴y",
    "test 12.5",
  );
});

test("06 - rightOutsideNot blocked both L-R maybes", () => {
  equal(
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
      "whatevs",
    ),
    "zb🐴cy",
    "test 12.6",
  );
});

test("07 - rightOutsideNot last char goes outside", () => {
  equal(
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
      "b",
    ),
    "ccccccccb",
    "test 12.7",
  );
});

test("08 - right maybe is last char, outsideNot satisfied", () => {
  equal(
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
      "c",
    ),
    "cccccccc",
    "test 12.8",
  );
});

test("09 - real life scenario, missing semicol on nbsp #1", () => {
  equal(
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
      "nbsp;",
    ),
    "&nbsp; &nbsp; &nbsp;",
    "test 12.9",
  );
});

test("10 - real life scenario, missing semicol on nbsp #2", () => {
  equal(
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
      "nbsp;",
    ),
    "&nbsp;&nbsp;&nbsp;",
    "test 12.10",
  );
});

test("11 - real life scenario, missing ampersand, text", () => {
  equal(
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
      "&nbsp",
    ),
    "tralalala&nbsp;&nbsp;&nbsp;",
    "test 12.11",
  );
});

test("12 - as before but with emoji instead", () => {
  equal(
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
      "🍻",
    ),
    "🍻🍻👌🍺",
    "test 12.12",
  );
});

test("13 - rightOutsideNot with L-R maybes", () => {
  equal(
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
      "x",
    ),
    "zxy",
    "test 12.13",
  );
});

test("14 - all of 'em #1", () => {
  equal(
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
      "x",
    ),
    "zxy",
    "test 12.14",
  );
});

test("15 - all of 'em #2", () => {
  equal(
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
      "x",
    ),
    "zxy",
    "test 12.14",
  );
});

test.run();
