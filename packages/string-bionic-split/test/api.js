import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { split, defaults, version } from "../dist/string-bionic-split.esm.js";

test("01 - wrong/missing input", () => {
  throws(() => {
    split();
  }, /THROW_ID_01/g);
  throws(() => {
    split(undefined);
  }, /THROW_ID_01/g);
  throws(() => {
    split(1);
  }, /THROW_ID_01/g);
  throws(() => {
    split(true);
  }, /THROW_ID_01/g);
  throws(() => {
    split(null);
  }, /THROW_ID_01/g);
});

test("02 - empty string as input", () => {
  equal(split(""), 0, "02");
});

test("03 - wrong second arg", () => {
  throws(() => {
    split("a", true);
  }, /THROW_ID_02/g);
  throws(() => {
    split("a", "a");
  }, /THROW_ID_02/g);
  not.throws(() => {
    split("a", {});
  });
  not.throws(() => {
    split("a", {}, "a");
  });
});

test("04 - leading whitespace", () => {
  throws(() => {
    split(" a");
  }, /THROW_ID_03/g);
  throws(() => {
    split(" a", {});
  }, /THROW_ID_03/g);
  throws(() => {
    split(" a", {
      throwIfEdgeWhitespace: true,
    });
  }, /THROW_ID_03/g);
  not.throws(() => {
    split(" a", {
      throwIfEdgeWhitespace: false,
    });
  });
});

test("05 - trailing whitespace", () => {
  throws(() => {
    split("a ");
  }, /THROW_ID_04/g);
  throws(() => {
    split("a ", {});
  }, /THROW_ID_04/g);
  throws(() => {
    split("a ", {
      throwIfEdgeWhitespace: true,
    });
  }, /THROW_ID_04/g);
  not.throws(() => {
    split("a ", {
      throwIfEdgeWhitespace: false,
    });
  });
});

test("06 - exports defaults", () => {
  equal(defaults, {
    throwIfEdgeWhitespace: true,
  });
});

test("07 - exports version", () => {
  ok(typeof version === "string", "07.01");
  ok(!!version.length, "07.02");
  ok(/\d+\.\d+\.\d+/.test(version), "07.03");
});

test.run();
