import tap from "tap";
import { er } from "../dist/easy-replace.esm.js";

// ==============================
// double-check the README's corectness
// ==============================

tap.test("01 - readme example #1", (t) => {
  t.equal(
    er(
      "a x c x d",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "x",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "🦄"
    ),
    "a 🦄 c 🦄 d",
    "test 13.1"
  );
  t.end();
});

tap.test("02 - readme example #2", (t) => {
  t.equal(
    er(
      "🐴i🦄 🐴i i🦄 i",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["🐴", "🦄"],
        searchFor: "i",
        rightMaybe: ["🐴", "🦄"],
        rightOutside: "",
        rightOutsideNot: "",
      },
      "x"
    ),
    "x x x x",
    "test 13.2"
  );
  t.end();
});

tap.test("03 - readme example #3", (t) => {
  t.equal(
    er(
      "a🦄c x🦄x",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "🦄",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: ["c", "d"],
      },
      "🐴"
    ),
    "a🦄c x🐴x",
    "test 13.3"
  );
  t.end();
});

tap.test("04 - readme example #4", (t) => {
  t.equal(
    er(
      "zzzzz  zzzzzz zzzzzz",
      {
        leftOutsideNot: "",
        leftOutside: " ",
        leftMaybe: "",
        searchFor: " ",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      ""
    ),
    "zzzzz zzzzzz zzzzzz",
    "test 13.4"
  );
  t.end();
});

tap.test("05 - readme example #5", (t) => {
  t.equal(
    er(
      "<br /><br/><br />",
      {
        leftOutsideNot: " ",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "/>",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      " />"
    ),
    "<br /><br /><br />",
    "test 13.5"
  );
  t.end();
});

tap.test("06 - readme example #6", (t) => {
  t.equal(
    er(
      "&nbsp; nbsp &nbsp nbsp;",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "&",
        searchFor: "nbsp",
        rightMaybe: ";",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "&nbsp;"
    ),
    "&nbsp; &nbsp; &nbsp; &nbsp;",
    "test 13.6"
  );
  t.end();
});
