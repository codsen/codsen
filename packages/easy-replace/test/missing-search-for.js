import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { er } from "../dist/easy-replace.esm.js";

// ==============================
// missing searchFor value
// ==============================

test("01 - source present, missing searchFor", () => {
  equal(
    er(
      "aaa",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "",
    ),
    "aaa",
    "test 9.1",
  );
});

test("02 - everything is missing", () => {
  equal(
    er(
      "",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "",
    ),
    "",
    "test 9.2",
  );
});

test("03 - everything seriously missing", () => {
  equal(er("", {}, ""), "", "test 9.3");
});

test("04 - everything extremely seriously missing", () => {
  equal(er("", {}), "", "test 9.4");
});

test("05 - everything truly extremely seriously missing", () => {
  equal(er(""), "", "test 9.5");
});

test("06 - everything really truly extremely seriously missing", () => {
  equal(er(), "", "test 9.6");
});

test("07 - leftOutsideNot blocking rightOutsideNot being empty", () => {
  equal(
    er(
      "ab a",
      {
        leftOutsideNot: [""],
        leftOutside: "",
        leftMaybe: "",
        searchFor: "a",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "b",
      },
      "x",
    ),
    "ab x",
    "test 9.7",
  );
});

test("08 - leftOutsideNot is blank array", () => {
  equal(
    er(
      "ab a",
      {
        leftOutsideNot: [],
        leftOutside: "",
        leftMaybe: "",
        searchFor: "a",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "b",
      },
      "x",
    ),
    "ab x",
    "test 9.8",
  );
});

test("09 - missing key in properties obj", () => {
  equal(
    er(
      "ab a",
      {
        leftOutside: "",
        leftMaybe: "",
        searchFor: "a",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "b",
      },
      "x",
    ),
    "ab x",
    "test 9.9",
  );
});

test.run();
