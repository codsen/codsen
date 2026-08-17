// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

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

test("05 - pairs braces by nesting, not by position", () => {
  // openings and closings used to be zipped by index, so a chunk ran from an
  // outer "{" to an inner "}" - truncating it and repeating its tail
  equal(
    join(
      "interface A { x: string; y: { z: number }; }",
      "interface B { q: boolean; }",
    ),
    "{\n  x: string; y: { z: number };\n  q: boolean;\n}",
    "05.01",
  );
  // two top-level groups in one argument are both collected
  equal(
    join("interface A { a: 1; }\ninterface B { b: 2; }"),
    "{\n  a: 1;\n  b: 2;\n}",
    "05.02",
  );
  // an opening brace which is never closed yields nothing, as before
  equal(
    join("interface A { x: string;", "interface B { q: boolean; }"),
    "{\n  q: boolean;\n}",
    "05.03",
  );
});

test.run();
