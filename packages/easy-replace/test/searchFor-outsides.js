import tap from "tap";
import { er } from "../dist/easy-replace.esm";

// ==============================
// searchFor + only outsides
// ==============================

tap.test("01 - both outsides only, emoji, found", (t) => {
  t.equal(
    er(
      "🦄 🐴 🦄",
      {
        leftOutsideNot: "",
        leftOutside: "🦄 ",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: " 🦄",
        rightOutsideNot: "",
      },
      "z"
    ),
    "🦄 z 🦄",
    "test 5.1.1"
  );
  t.equal(
    er(
      "🦄 🐴 🦄",
      {
        leftOutsideNot: "",
        leftOutside: ["🦄 "],
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: [" 🦄"],
        rightOutsideNot: "",
      },
      "z"
    ),
    "🦄 z 🦄",
    "test 5.1.2"
  );
  t.end();
});

tap.test("02 - both outsides only, emoji, not found", (t) => {
  t.equal(
    er(
      "a 🐴 a",
      {
        leftOutsideNot: "",
        leftOutside: "🦄",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "🦄",
        rightOutsideNot: "",
      },
      "z"
    ),
    "a 🐴 a",
    "test 5.2"
  );
  t.end();
});

tap.test("03 - both outsides, emoji, not found", (t) => {
  t.equal(
    er(
      "🦄 🐴 a",
      {
        leftOutsideNot: "",
        leftOutside: "🦄",
        leftMaybe: " ",
        searchFor: "🐴",
        rightMaybe: " ",
        rightOutside: "🦄",
        rightOutsideNot: "",
      },
      "z"
    ),
    "🦄 🐴 a",
    "test 5.3"
  );
  t.end();
});

tap.test("04 - both outsides, emoji, not found #1", (t) => {
  t.equal(
    er(
      "a 🐴 a🦄",
      {
        leftOutsideNot: "",
        leftOutside: "🦄",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "🦄",
        rightOutsideNot: "",
      },
      "z"
    ),
    "a 🐴 a🦄",
    "test 5.4"
  );
  t.end();
});

tap.test("05 - both outsides, emoji, not found #2", (t) => {
  t.equal(
    er(
      "kgldfj lkfjkl jfk \ng \t;lgkh a 🐴 a🦄 slkgj fhjf jkghljk",
      {
        leftOutsideNot: "",
        leftOutside: "🦄",
        leftMaybe: "",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "🦄",
        rightOutsideNot: "",
      },
      "z"
    ),
    "kgldfj lkfjkl jfk \ng \t;lgkh a 🐴 a🦄 slkgj fhjf jkghljk",
    "test 5.5"
  );
  t.end();
});

tap.test("06 - line break as rightOutside, found", (t) => {
  t.equal(
    er(
      "aaab\n",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "b",
        rightMaybe: "",
        rightOutside: "\n",
        rightOutsideNot: "",
      },
      "c"
    ),
    "aaac\n",
    "test 5.6"
  );
  t.end();
});

tap.test("07 - line breaks as both outsides", (t) => {
  t.equal(
    er(
      "aaa\nb\n",
      {
        leftOutsideNot: "",
        leftOutside: "\n",
        leftMaybe: "",
        searchFor: "b",
        rightMaybe: "",
        rightOutside: "\n",
        rightOutsideNot: "",
      },
      "c"
    ),
    "aaa\nc\n",
    "test 5.7"
  );
  t.end();
});

tap.test("08 - \\n as outsides, replacement = undefined", (t) => {
  t.equal(
    er(
      "aaa\nb\n",
      {
        leftOutsideNot: "",
        leftOutside: "\n",
        leftMaybe: "",
        searchFor: "b",
        rightMaybe: "",
        rightOutside: "\n",
        rightOutsideNot: "",
      },
      undefined
    ),
    "aaa\n\n",
    "test 5.8"
  );
  t.end();
});

tap.test("09 - line breaks as outsides, replacement = Bool", (t) => {
  t.equal(
    er(
      "aaa\nb\n",
      {
        leftOutsideNot: "",
        leftOutside: "\n",
        leftMaybe: "",
        searchFor: "b",
        rightMaybe: "",
        rightOutside: "\n",
        rightOutsideNot: "",
      },
      true
    ),
    "aaa\n\n",
    "test 5.9"
  );
  t.end();
});

tap.test("10 - line breaks as outsides, replacement = null", (t) => {
  t.equal(
    er(
      "aaa\nb\n",
      {
        leftOutsideNot: "",
        leftOutside: "\n",
        leftMaybe: "",
        searchFor: "b",
        rightMaybe: "",
        rightOutside: "\n",
        rightOutsideNot: "",
      },
      null
    ),
    "aaa\n\n",
    "test 5.10"
  );
  t.end();
});

tap.test(
  "11 - left outside requirement not satisfied for replacement to happen",
  (t) => {
    t.equal(
      er("aaaBBBccc", {
        leftOutsideNot: "",
        leftOutside: "x",
        leftMaybe: "",
        searchFor: "bbb",
        rightMaybe: "",
        rightOutside: "z",
        rightOutsideNot: "",
        i: {
          searchFor: true,
          leftOutside: true,
        },
      }),
      "aaaBBBccc",
      "test 5.11 - did not replace because of o.leftOutside"
    );
    t.end();
  }
);

tap.test(
  "12 - right outside requirement not satisfied for replacement to happen",
  (t) => {
    t.equal(
      er("aaaBBBccc", {
        leftOutsideNot: "",
        leftOutside: "x",
        leftMaybe: "",
        searchFor: "bbb",
        rightMaybe: "",
        rightOutside: "z",
        rightOutsideNot: "",
        i: {
          searchFor: true,
          rightOutside: true,
        },
      }),
      "aaaBBBccc",
      "test 5.12 - did not replace because of o.rightOutside"
    );
    t.end();
  }
);
