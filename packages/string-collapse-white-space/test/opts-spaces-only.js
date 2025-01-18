import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";
import { mixer } from "./util/util.js";

// opts.enforceSpacesOnly
// -----------------------------------------------------------------------------

test("01", () => {
  mixer().forEach((opt) => {
    equal(
      collapse("a b", opt),
      {
        result: "a b",
        ranges: null,
      },
      JSON.stringify(opt, null, 0),
    );
  });
});

test("02", () => {
  mixer({
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    equal(collapse("a \tb", opt), { result: "a \tb", ranges: null }, "02.01");
  });
  mixer({
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    equal(collapse("a \tb", opt), { result: "a b", ranges: [[2, 3]] }, "02.02");
  });
});

test("03", () => {
  mixer({
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    equal(
      collapse("a \t\tb", opt),
      { result: "a \t\tb", ranges: null },
      "03.01",
    );
  });
  mixer({
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    equal(
      collapse("a \t\tb", opt),
      { result: "a b", ranges: [[2, 4]] },
      "03.02",
    );
  });
});

test("04", () => {
  mixer({
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    equal(collapse("a\t\tb", opt), { result: "a\t\tb", ranges: null }, "04.01");
  });
  mixer({
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    equal(
      collapse("a\t\tb", opt),
      { result: "a b", ranges: [[1, 3, " "]] },
      "04.02",
    );
  });
});

// -----------------------------------------------------------------------------

test("05", () => {
  mixer({
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    equal(
      collapse("a  \tb", opt),
      { result: "a \tb", ranges: [[1, 2]] },
      "05.01",
    );
  });
  mixer({
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    equal(
      collapse("a  \tb", opt),
      { result: "a b", ranges: [[2, 4]] },
      "05.02",
    );
  });
});

test("06 - reuse the last space", () => {
  mixer({
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    equal(
      collapse("a\t  b", opt),
      { result: "a\t b", ranges: [[2, 3]] },
      "06.01",
    );
  });
  mixer({
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    equal(
      collapse("a\t  b", opt),
      { result: "a b", ranges: [[1, 3]] },
      "06.02",
    );
  });
});

test("07", () => {
  mixer({
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    equal(
      collapse("a\t\t\tb", opt),
      { result: "a\t\t\tb", ranges: null },
      "07.01",
    );
  });
  mixer({
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    equal(
      collapse("a\t\t\tb", opt),
      { result: "a b", ranges: [[1, 4, " "]] },
      "07.02",
    );
  });
});

// -----------------------------------------------------------------------------

test("08", () => {
  equal(
    collapse("  \tx", {
      enforceSpacesOnly: false,
      trimStart: false,
    }),
    { result: " \tx", ranges: [[0, 1]] },
    "08.01",
  );
});

test("09 - reuse the space", () => {
  equal(
    collapse("  \tx", {
      enforceSpacesOnly: true,
      trimStart: false,
    }),
    { result: " x", ranges: [[1, 3]] },
    "09.01",
  );
});

test("10 - full replace", () => {
  equal(
    collapse("\t \tx", {
      enforceSpacesOnly: true,
      trimStart: false,
    }),
    { result: " x", ranges: [[0, 3, " "]] },
    "10.01",
  );
});

test("11", () => {
  equal(
    collapse("  \tx", {
      enforceSpacesOnly: false,
      trimStart: true,
    }),
    { result: "x", ranges: [[0, 3]] },
    "11.01",
  );
});

test("12", () => {
  equal(
    collapse("\t \tx", {
      enforceSpacesOnly: false,
      trimStart: true,
    }),
    { result: "x", ranges: [[0, 3]] },
    "12.01",
  );
});

test("13", () => {
  equal(
    collapse("  \tx", {
      enforceSpacesOnly: true,
      trimStart: true,
    }),
    { result: "x", ranges: [[0, 3]] },
    "13.01",
  );
});

test("14", () => {
  equal(
    collapse("\t \tx", {
      enforceSpacesOnly: true,
      trimStart: true,
    }),
    { result: "x", ranges: [[0, 3]] },
    "14.01",
  );
});

// -----------------------------------------------------------------------------

test("15", () => {
  equal(
    collapse("x\t  ", {
      enforceSpacesOnly: false,
      trimEnd: false,
    }),
    { result: "x\t ", ranges: [[2, 3]] },
    "15.01",
  );
});

test("16 - reuse", () => {
  equal(
    collapse("x\t  ", {
      enforceSpacesOnly: true,
      trimEnd: false,
    }),
    { result: "x ", ranges: [[1, 3]] },
    "16.01",
  );
});

test("17 - replace", () => {
  equal(
    collapse("x\t \t", {
      enforceSpacesOnly: true,
      trimEnd: false,
    }),
    { result: "x ", ranges: [[1, 4, " "]] },
    "17.01",
  );
});

test("18", () => {
  equal(
    collapse("x\t  ", {
      enforceSpacesOnly: false,
      trimEnd: true,
    }),
    { result: "x", ranges: [[1, 4]] },
    "18.01",
  );
});

test("19", () => {
  equal(
    collapse("x\t  ", {
      enforceSpacesOnly: true,
      trimEnd: true,
    }),
    { result: "x", ranges: [[1, 4]] },
    "19.01",
  );
});

// -----------------------------------------------------------------------------

test("20", () => {
  equal(
    collapse("a\t b", {
      enforceSpacesOnly: false,
    }),
    { result: "a\t b", ranges: null },
    "20.01",
  );
});

test("21", () => {
  equal(
    collapse("a\t b", {
      enforceSpacesOnly: true,
    }),
    { result: "a b", ranges: [[1, 2]] },
    "21.01",
  );
});

test("22", () => {
  equal(
    collapse("a\t\tb", {
      enforceSpacesOnly: true,
    }),
    { result: "a b", ranges: [[1, 3, " "]] },
    "22.01",
  );
});

// -----------------------------------------------------------------------------

test("23", () => {
  equal(
    collapse("a\tb", {
      enforceSpacesOnly: false,
    }),
    { result: "a\tb", ranges: null },
    "23.01",
  );
});

test("24", () => {
  equal(
    collapse("a\tb", {
      enforceSpacesOnly: true,
    }),
    { result: "a b", ranges: [[1, 2, " "]] },
    "24.01",
  );
});

// -----------------------------------------------------------------------------

test("25", () => {
  equal(
    collapse("a\t\tb", {
      enforceSpacesOnly: false,
    }),
    { result: "a\t\tb", ranges: null },
    "25.01",
  );
});

test("26", () => {
  equal(
    collapse("a\t\tb", {
      enforceSpacesOnly: true,
    }),
    { result: "a b", ranges: [[1, 3, " "]] },
    "26.01",
  );
});

// -----------------------------------------------------------------------------

test("27", () => {
  equal(
    collapse("a\nb", {
      enforceSpacesOnly: false,
    }),
    { result: "a\nb", ranges: null },
    "27.01",
  );
});

test("28", () => {
  equal(
    collapse("a\nb", {
      enforceSpacesOnly: true,
    }),
    { result: "a\nb", ranges: null },
    "28.01",
  );
});

// -----------------------------------------------------------------------------

test("29", () => {
  equal(
    collapse("a\r\nb", {
      enforceSpacesOnly: false,
    }),
    { result: "a\r\nb", ranges: null },
    "29.01",
  );
});

test("30", () => {
  equal(
    collapse("a\r\nb", {
      enforceSpacesOnly: true,
    }),
    { result: "a\r\nb", ranges: null },
    "30.01",
  );
});

// -----------------------------------------------------------------------------

test("31", () => {
  mixer({
    removeEmptyLines: false,
  }).forEach((opt) => {
    equal(collapse("a\n\nb", opt), { result: "a\n\nb", ranges: null }, "31.01");
  });
  mixer({
    removeEmptyLines: true,
  }).forEach((opt) => {
    equal(
      collapse("a\n\nb", opt),
      { result: "a\nb", ranges: [[1, 2]] },
      "31.02",
    );
  });
});

// -----------------------------------------------------------------------------

test("32", () => {
  mixer({
    enforceSpacesOnly: false,
    trimLines: false,
  }).forEach((opt) => {
    equal(
      collapse("a \t \n \t b", opt),
      { result: "a \t \n \t b", ranges: null },
      "32.01",
    );
  });
  mixer({
    enforceSpacesOnly: true,
    trimLines: false,
  }).forEach((opt) => {
    equal(collapse("a \t \n \t b", opt).result, "a \n b", "32.02");
  });
  mixer({
    trimLines: true,
  }).forEach((opt) => {
    equal(collapse("a \t \n \t b", opt).result, "a\nb", "32.03");
  });
});

test("33", () => {
  mixer({
    enforceSpacesOnly: false,
    trimLines: false,
  }).forEach((opt) => {
    equal(collapse("a \n \t b", opt).result, "a \n \t b", "33.01");
  });
  mixer({
    enforceSpacesOnly: true,
    trimLines: false,
  }).forEach((opt) => {
    equal(collapse("a \n \t b", opt).result, "a \n b", "33.02");
  });
  mixer({
    trimLines: true,
  }).forEach((opt) => {
    equal(collapse("a \n \t b", opt).result, "a\nb", "33.03");
  });
});

test.run();
