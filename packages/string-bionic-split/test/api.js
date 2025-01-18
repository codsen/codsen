import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { split, defaults, version } from "../dist/string-bionic-split.esm.js";

test("01 - wrong/missing input", () => {
  throws(
    () => {
      split();
    },
    /THROW_ID_01/g,
    "01.01",
  );
  throws(
    () => {
      split(undefined);
    },
    /THROW_ID_01/g,
    "01.02",
  );
  throws(
    () => {
      split(1);
    },
    /THROW_ID_01/g,
    "01.03",
  );
  throws(
    () => {
      split(true);
    },
    /THROW_ID_01/g,
    "01.04",
  );
  throws(
    () => {
      split(null);
    },
    /THROW_ID_01/g,
    "01.05",
  );
});

test("02 - empty string as input", () => {
  equal(split(""), 0, "02.01");
});

test("03 - wrong second arg", () => {
  throws(
    () => {
      split("a", true);
    },
    /THROW_ID_02/g,
    "03.01",
  );
  throws(
    () => {
      split("a", "a");
    },
    /THROW_ID_02/g,
    "03.02",
  );
  not.throws(() => {
    split("a", {});
  }, "03.03");
  not.throws(() => {
    split("a", {}, "a");
  }, "03.04");
});

test("04 - leading whitespace", () => {
  throws(
    () => {
      split(" a");
    },
    /THROW_ID_03/g,
    "04.01",
  );
  throws(
    () => {
      split(" a", {});
    },
    /THROW_ID_03/g,
    "04.02",
  );
  throws(
    () => {
      split(" a", {
        throwIfEdgeWhitespace: true,
      });
    },
    /THROW_ID_03/g,
    "04.03",
  );
  not.throws(() => {
    split(" a", {
      throwIfEdgeWhitespace: false,
    });
  }, "04.04");
});

test("05 - trailing whitespace", () => {
  throws(
    () => {
      split("a ");
    },
    /THROW_ID_04/g,
    "05.01",
  );
  throws(
    () => {
      split("a ", {});
    },
    /THROW_ID_04/g,
    "05.02",
  );
  throws(
    () => {
      split("a ", {
        throwIfEdgeWhitespace: true,
      });
    },
    /THROW_ID_04/g,
    "05.03",
  );
  not.throws(() => {
    split("a ", {
      throwIfEdgeWhitespace: false,
    });
  }, "05.04");
});

test("06 - exports defaults", () => {
  equal(
    defaults,
    {
      throwIfEdgeWhitespace: true,
    },
    "06.01",
  );
});

test("07 - exports version", () => {
  ok(typeof version === "string", "07.01");
  ok(!!version.length, "07.02");
  ok(/\d+\.\d+\.\d+/.test(version), "07.03");
});

test.run();
