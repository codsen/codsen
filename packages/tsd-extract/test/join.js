import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { join } from "../dist/tsd-extract.esm.js";

test("01 - edge cases", () => {
  equal(join(), "", "01.01");
  equal(join(""), "", "01.02");
  equal(join("", ""), "", "01.03");
  equal(join(null), "", "01.04");
  equal(join(null, null, null), "", "01.05");
});

test("02 - minimal", () => {
  let source1 = `interface x {
    a: string;
}`;
  let source2 = `interface y {
    b: string;
}`;
  equal(
    join(source1, source2),
    `{
  a: string;
  b: string;
}`,
    "02.01",
  );
});

test("03 - more realistic", () => {
  let source1 = `interface Statement {
    identifiers: string[];
    identifiersStartAt: number | null;
    identifiersEndAt: number | null;
    content: string | null;
    contentStartsAt: number | null;
    contentEndsAt: number | null;
    value: string | null;
    valueStartsAt: number | null;
    valueEndsAt: number | null;
  }`;
  let source2 = ` = Statement & {
      all: string[];
      error: string | null;
  }`;
  equal(
    join(source1, source2),
    `{
  identifiers: string[];
  identifiersStartAt: number | null;
  identifiersEndAt: number | null;
  content: string | null;
  contentStartsAt: number | null;
  contentEndsAt: number | null;
  value: string | null;
  valueStartsAt: number | null;
  valueEndsAt: number | null;
  all: string[];
  error: string | null;
}`,
    "03.01",
  );
});

test("04 - many objects", () => {
  let source1 = `type x = {
    a: string;
  } & {
    b: number;
  }`;
  let source2 = ` = Statement & {
      c: boolean;
    } & {
      d: null | string;
    }`;
  let source3 = ` = zz & {
      e: number;
    } & {
      f: (g) => void;
    }`;
  let source4 = null;
  let source5 = "";
  equal(
    join(source1, source2, source3, source4, source5),
    `{
  a: string;
  b: number;
  c: boolean;
  d: null | string;
  e: number;
  f: (g) => void;
}`,
    "04.01",
  );
});

test.run();
