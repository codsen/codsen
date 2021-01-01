import tap from "tap";
import { er } from "../dist/easy-replace.esm";

// ==============================
// case-insensitive opts flag
// ==============================

tap.test("01 - case-insensitive flag works", (t) => {
  t.equal(
    er(
      "zzz abbb zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "a",
        searchFor: "bbb",
        rightMaybe: "c",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "yyy"
    ),
    "zzz yyy zzz",
    "test 15.1.1 - all ok, flag off"
  );
  t.equal(
    er(
      "zzz aBBB zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "a",
        searchFor: "bbb",
        rightMaybe: "c",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "yyy"
    ),
    "zzz aBBB zzz",
    "test 15.1.2 - case mismatch, nothing replaced because flag's off"
  );
  t.equal(
    er(
      "zzz aBBB zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "a",
        searchFor: "bbb",
        rightMaybe: "c",
        rightOutside: "",
        rightOutsideNot: "",
        i: {
          searchFor: true,
        },
      },
      "yyy"
    ),
    "zzz yyy zzz",
    "test 15.1.3 - case mismatch, but flag allows it, so replace happens"
  );
  t.equal(
    er(
      "zzz aBBB zzz bbB zzz aBbBc zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "a",
        searchFor: "bbb",
        rightMaybe: "c",
        rightOutside: "",
        rightOutsideNot: "",
        i: {
          searchFor: true,
        },
      },
      "yyy"
    ),
    "zzz yyy zzz yyy zzz yyy zzz",
    "test 15.1.4 - case-insensitive flag, multiple replacements"
  );
  t.end();
});

tap.test("test 15.2 - case-insensitive leftMaybe", (t) => {
  t.equal(
    er(
      "zzz Abbb zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "a",
        searchFor: "bbb",
        rightMaybe: "c",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "yyy"
    ),
    "zzz Ayyy zzz",
    "test 15.2.1 - flag off - testing leftMaybe only"
  );
  t.equal(
    er(
      "zzz Abbb zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "a",
        searchFor: "bbb",
        rightMaybe: "c",
        rightOutside: "",
        rightOutsideNot: "",
        i: {
          leftMaybe: true,
        },
      },
      "yyy"
    ),
    "zzz yyy zzz",
    "test 15.2.2 - flag on - testing leftMaybe only"
  );
  t.equal(
    er(
      "zzz Abbb zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "a",
        searchFor: "bBb",
        rightMaybe: "c",
        rightOutside: "",
        rightOutsideNot: "",
        i: {
          leftMaybe: true,
        },
      },
      "yyy"
    ),
    "zzz Abbb zzz",
    "test 15.2.3 - flag on - testing searchFor + leftMaybe"
  );
  t.equal(
    er(
      "zzz Abbb zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "a",
        searchFor: "bBb",
        rightMaybe: "c",
        rightOutside: "",
        rightOutsideNot: "",
        i: {
          leftMaybe: true,
          searchFor: true,
        },
      },
      "yyy"
    ),
    "zzz yyy zzz",
    "test 15.2.4 - flag on - testing searchFor + leftMaybe"
  );
  t.end();
});

tap.test("test 15.3 - case-insensitive rightMaybe", (t) => {
  t.equal(
    er(
      "zzz bbbC zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "a",
        searchFor: "bbb",
        rightMaybe: "c",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "yyy"
    ),
    "zzz yyyC zzz",
    "test 15.3.1 - flag off - testing rightMaybe only"
  );
  t.equal(
    er(
      "zzz bbbC zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "a",
        searchFor: "bbb",
        rightMaybe: "c",
        rightOutside: "",
        rightOutsideNot: "",
        i: {
          rightMaybe: true,
        },
      },
      "yyy"
    ),
    "zzz yyy zzz",
    "test 15.3.2 - flag on - testing rightMaybe only"
  );
  t.equal(
    er(
      "zzz bbbC zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "a",
        searchFor: "bBb",
        rightMaybe: "c",
        rightOutside: "",
        rightOutsideNot: "",
        i: {
          rightMaybe: true,
        },
      },
      "yyy"
    ),
    "zzz bbbC zzz",
    "test 15.3.3 - flag on - testing searchFor + rightMaybe"
  );
  t.equal(
    er(
      "zzz bbbC zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "a",
        searchFor: "bBb",
        rightMaybe: "c",
        rightOutside: "",
        rightOutsideNot: "",
        i: {
          rightMaybe: true,
          searchFor: true,
        },
      },
      "yyy"
    ),
    "zzz yyy zzz",
    "test 15.3.4 - flag on - testing searchFor + rightMaybe"
  );
  t.end();
});

tap.test("test 15.4 - case-insensitive leftOutside", (t) => {
  t.equal(
    er(
      "zzz Abbb zzz",
      {
        leftOutsideNot: "",
        leftOutside: "a",
        leftMaybe: "",
        searchFor: "bbb",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "yyy"
    ),
    "zzz Abbb zzz",
    "test 15.4.1 - flag off - testing leftOutside only"
  );
  t.equal(
    er(
      "zzz Abbb zzz",
      {
        leftOutsideNot: "",
        leftOutside: "a",
        leftMaybe: "",
        searchFor: "bbb",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
        i: {
          leftOutside: true,
        },
      },
      "yyy"
    ),
    "zzz Ayyy zzz",
    "test 15.4.2 - flag on - testing leftOutside only"
  );
  t.equal(
    er(
      "zzz Abbb zzz",
      {
        leftOutsideNot: "",
        leftOutside: "a",
        leftMaybe: "",
        searchFor: "bBb",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
        i: {
          leftOutside: true,
        },
      },
      "yyy"
    ),
    "zzz Abbb zzz",
    "test 15.4.3 - flag on - testing searchFor + leftOutside"
  );
  t.equal(
    er(
      "zzz Abbb zzz",
      {
        leftOutsideNot: "",
        leftOutside: "a",
        leftMaybe: "",
        searchFor: "bBb",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
        i: {
          leftOutside: true,
          searchFor: true,
        },
      },
      "yyy"
    ),
    "zzz Ayyy zzz",
    "test 15.4.4 - flag on - testing searchFor + leftOutside"
  );
  t.end();
});

tap.test("test 15.5 - case-insensitive rightOutside", (t) => {
  t.equal(
    er(
      "zzz bbbC zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "bbb",
        rightMaybe: "",
        rightOutside: "c",
        rightOutsideNot: "",
      },
      "yyy"
    ),
    "zzz bbbC zzz",
    "test 15.5.1 - flag off - testing rightOutside only"
  );
  t.equal(
    er(
      "zzz bbbC zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "bbb",
        rightMaybe: "",
        rightOutside: "c",
        rightOutsideNot: "",
        i: {
          rightOutside: true,
        },
      },
      "yyy"
    ),
    "zzz yyyC zzz",
    "test 15.5.2 - flag on - testing rightOutside only"
  );
  t.equal(
    er(
      "zzz bbbC zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "bBb",
        rightMaybe: "",
        rightOutside: "c",
        rightOutsideNot: "",
        i: {
          rightOutside: true,
        },
      },
      "yyy"
    ),
    "zzz bbbC zzz",
    "test 15.5.3 - flag on - testing searchFor + rightOutside"
  );
  t.equal(
    er(
      "zzz bbbC zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "bBb",
        rightMaybe: "",
        rightOutside: "c",
        rightOutsideNot: "",
        i: {
          rightOutside: true,
          searchFor: true,
        },
      },
      "yyy"
    ),
    "zzz yyyC zzz",
    "test 15.5.4 - flag on - testing searchFor + rightOutside"
  );
  t.end();
});

tap.test("test 15.6 - case-insensitive leftOutsideNot", (t) => {
  t.equal(
    er(
      "zzz Abbb zzz",
      {
        leftOutsideNot: "a",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "bbb",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "yyy"
    ),
    "zzz Ayyy zzz",
    "test 15.6.1 - flag off - testing leftOutsideNot only"
  );
  t.equal(
    er(
      "zzz Abbb zzz",
      {
        leftOutsideNot: "a",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "bbb",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
        i: {
          leftOutsideNot: true,
        },
      },
      "yyy"
    ),
    "zzz Abbb zzz",
    "test 15.6.2 - flag on - testing leftOutsideNot only"
  );
  t.equal(
    er(
      "zzz Abbb zzz",
      {
        leftOutsideNot: "a",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "bBb",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
        i: {
          leftOutsideNot: true,
        },
      },
      "yyy"
    ),
    "zzz Abbb zzz",
    "test 15.6.3 - flag on - testing searchFor + leftOutsideNot"
  );
  t.equal(
    er(
      "zzz Abbb zzz",
      {
        leftOutsideNot: "a",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "bBb",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
        i: {
          leftOutsideNot: true,
          searchFor: true,
        },
      },
      "yyy"
    ),
    "zzz Abbb zzz",
    "test 15.6.4 - flag on - testing searchFor + leftOutsideNot"
  );
  t.equal(
    er(
      "zzz Abbb zzz",
      {
        leftOutsideNot: "a",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "bBb",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
        i: {
          leftOutsideNot: false,
          searchFor: true,
        },
      },
      "yyy"
    ),
    "zzz Ayyy zzz",
    "test 15.6.5 - flag on - testing searchFor + leftOutsideNot"
  );
  t.end();
});

tap.test("test 15.7 - case-insensitive rightOutsideNot", (t) => {
  t.equal(
    er(
      "zzz bbbC zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "bbb",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "c",
      },
      "yyy"
    ),
    "zzz yyyC zzz",
    "test 15.7.1 - flag off - testing rightOutsideNot only"
  );
  t.equal(
    er(
      "zzz bbbC zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "bbb",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "c",
        i: {
          rightOutsideNot: true,
        },
      },
      "yyy"
    ),
    "zzz bbbC zzz",
    "test 15.7.2 - flag on - testing rightOutsideNot only"
  );
  t.equal(
    er(
      "zzz bbbC zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "bBb",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "c",
        i: {
          rightOutsideNot: true,
        },
      },
      "yyy"
    ),
    "zzz bbbC zzz",
    "test 15.7.3 - flag on - testing searchFor + rightOutsideNot"
  );
  t.equal(
    er(
      "zzz bbbC zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "bBb",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "c",
        i: {
          rightOutsideNot: true,
          searchFor: true,
        },
      },
      "yyy"
    ),
    "zzz bbbC zzz",
    "test 15.7.4 - flag on - testing searchFor + rightOutsideNot"
  );
  t.equal(
    er(
      "zzz bbbC zzz",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "bBb",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "c",
        i: {
          rightOutsideNot: false,
          searchFor: true,
        },
      },
      "yyy"
    ),
    "zzz yyyC zzz",
    "test 15.7.5 - flag on - testing searchFor + rightOutsideNot"
  );
  t.end();
});
