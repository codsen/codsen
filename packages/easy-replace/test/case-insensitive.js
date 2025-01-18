import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { er } from "../dist/easy-replace.esm.js";

// ==============================
// case-insensitive opts flag
// ==============================

test("01 - case-insensitive flag works", () => {
  equal(
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
      "yyy",
    ),
    "zzz yyy zzz",
    "test 15.1.1 - all ok, flag off",
  );
  equal(
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
      "yyy",
    ),
    "zzz aBBB zzz",
    "test 15.1.2 - case mismatch, nothing replaced because flag's off",
  );
  equal(
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
      "yyy",
    ),
    "zzz yyy zzz",
    "test 15.1.3 - case mismatch, but flag allows it, so replace happens",
  );
  equal(
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
      "yyy",
    ),
    "zzz yyy zzz yyy zzz yyy zzz",
    "test 15.1.4 - case-insensitive flag, multiple replacements",
  );
});

test("02 - case-insensitive leftMaybe", () => {
  equal(
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
      "yyy",
    ),
    "zzz Ayyy zzz",
    "02.01",
  );
  equal(
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
      "yyy",
    ),
    "zzz yyy zzz",
    "02.02",
  );
  equal(
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
      "yyy",
    ),
    "zzz Abbb zzz",
    "02.03",
  );
  equal(
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
      "yyy",
    ),
    "zzz yyy zzz",
    "02.04",
  );
});

test("03 - case-insensitive rightMaybe", () => {
  equal(
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
      "yyy",
    ),
    "zzz yyyC zzz",
    "03.01",
  );
  equal(
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
      "yyy",
    ),
    "zzz yyy zzz",
    "03.02",
  );
  equal(
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
      "yyy",
    ),
    "zzz bbbC zzz",
    "03.03",
  );
  equal(
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
      "yyy",
    ),
    "zzz yyy zzz",
    "03.04",
  );
});

test("04 - case-insensitive leftOutside", () => {
  equal(
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
      "yyy",
    ),
    "zzz Abbb zzz",
    "04.01",
  );
  equal(
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
      "yyy",
    ),
    "zzz Ayyy zzz",
    "04.02",
  );
  equal(
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
      "yyy",
    ),
    "zzz Abbb zzz",
    "04.03",
  );
  equal(
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
      "yyy",
    ),
    "zzz Ayyy zzz",
    "04.04",
  );
});

test("05 - case-insensitive rightOutside", () => {
  equal(
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
      "yyy",
    ),
    "zzz bbbC zzz",
    "05.01",
  );
  equal(
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
      "yyy",
    ),
    "zzz yyyC zzz",
    "05.02",
  );
  equal(
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
      "yyy",
    ),
    "zzz bbbC zzz",
    "05.03",
  );
  equal(
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
      "yyy",
    ),
    "zzz yyyC zzz",
    "05.04",
  );
});

test("06 - case-insensitive leftOutsideNot", () => {
  equal(
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
      "yyy",
    ),
    "zzz Ayyy zzz",
    "06.01",
  );
  equal(
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
      "yyy",
    ),
    "zzz Abbb zzz",
    "06.02",
  );
  equal(
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
      "yyy",
    ),
    "zzz Abbb zzz",
    "06.03",
  );
  equal(
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
      "yyy",
    ),
    "zzz Abbb zzz",
    "06.04",
  );
  equal(
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
      "yyy",
    ),
    "zzz Ayyy zzz",
    "06.05",
  );
});

test("07 - case-insensitive rightOutsideNot", () => {
  equal(
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
      "yyy",
    ),
    "zzz yyyC zzz",
    "07.01",
  );
  equal(
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
      "yyy",
    ),
    "zzz bbbC zzz",
    "07.02",
  );
  equal(
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
      "yyy",
    ),
    "zzz bbbC zzz",
    "07.03",
  );
  equal(
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
      "yyy",
    ),
    "zzz bbbC zzz",
    "07.04",
  );
  equal(
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
      "yyy",
    ),
    "zzz yyyC zzz",
    "07.05",
  );
});

test.run();
