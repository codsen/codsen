import tap from "tap";
import er from "../dist/easy-replace.esm";

// ==============================
// missing searchFor value
// ==============================

tap.test("01 - source present, missing searchFor", (t) => {
  t.equal(
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
      ""
    ),
    "aaa",
    "test 9.1"
  );
  t.end();
});

tap.test("02 - everything is missing", (t) => {
  t.equal(
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
      ""
    ),
    "",
    "test 9.2"
  );
  t.end();
});

tap.test("03 - everything seriously missing", (t) => {
  t.equal(er("", {}, ""), "", "test 9.3");
  t.end();
});

tap.test("04 - everything extremely seriously missing", (t) => {
  t.equal(er("", {}), "", "test 9.4");
  t.end();
});

tap.test("05 - everything truly extremely seriously missing", (t) => {
  t.equal(er(""), "", "test 9.5");
  t.end();
});

tap.test("06 - everything really truly extremely seriously missing", (t) => {
  t.equal(er(), "", "test 9.6");
  t.end();
});

tap.test("07 - leftOutsideNot blocking rightOutsideNot being empty", (t) => {
  t.equal(
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
      "x"
    ),
    "ab x",
    "test 9.7"
  );
  t.end();
});

tap.test("08 - leftOutsideNot is blank array", (t) => {
  t.equal(
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
      "x"
    ),
    "ab x",
    "test 9.8"
  );
  t.end();
});

tap.test("09 - missing key in properties obj", (t) => {
  t.equal(
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
      "x"
    ),
    "ab x",
    "test 9.9"
  );
  t.end();
});
