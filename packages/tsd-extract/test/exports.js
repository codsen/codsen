import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { extract, roysSort as contentSort } from "../dist/tsd-extract.esm.js";
import { mixer } from "./util/util.js";

// -----------------------------------------------------------------------------

test("01 - export from, one line", () => {
  let source = `export { x } from "y";`;
  mixer({
    semi: false,
    extractAll: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: '{ x } from "y"',
        contentStartsAt: 7,
        contentEndsAt: 21,
        value: 'export { x } from "y"',
        valueStartsAt: 0,
        valueEndsAt: 21,
        all: [],
        error: null,
      },
      "01.01"
    );
  });
  mixer({
    semi: false,
    extractAll: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: '{ x } from "y"',
        contentStartsAt: 7,
        contentEndsAt: 21,
        value: 'export { x } from "y"',
        valueStartsAt: 0,
        valueEndsAt: 21,
        all: ["export"],
        error: null,
      },
      "01.02"
    );
  });
  mixer({
    semi: true,
    extractAll: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: '{ x } from "y";',
        contentStartsAt: 7,
        contentEndsAt: 22,
        value: 'export { x } from "y";',
        valueStartsAt: 0,
        valueEndsAt: 22,
        all: [],
        error: null,
      },
      "01.03"
    );
  });
  mixer({
    semi: true,
    extractAll: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: '{ x } from "y";',
        contentStartsAt: 7,
        contentEndsAt: 22,
        value: 'export { x } from "y";',
        valueStartsAt: 0,
        valueEndsAt: 22,
        all: ["export"],
        error: null,
      },
      "01.04"
    );
  });
});

test("02 - two exports from", () => {
  let source = `export { a } from "b";
export { c } from "d";`;
  mixer({
    semi: false,
    extractAll: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: '{ a } from "b"',
        contentStartsAt: 7,
        contentEndsAt: 21,
        value: 'export { a } from "b"',
        valueStartsAt: 0,
        valueEndsAt: 21,
        all: [],
        error: null,
      },
      "02.01"
    );
  });
  mixer({
    semi: false,
    extractAll: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: '{ a } from "b"',
        contentStartsAt: 7,
        contentEndsAt: 21,
        value: 'export { a } from "b"',
        valueStartsAt: 0,
        valueEndsAt: 21,
        all: ["export"],
        error: null,
      },
      "02.02"
    );
  });
  mixer({
    semi: true,
    extractAll: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: '{ a } from "b";',
        contentStartsAt: 7,
        contentEndsAt: 22,
        value: 'export { a } from "b";',
        valueStartsAt: 0,
        valueEndsAt: 22,
        all: [],
        error: null,
      },
      "02.03"
    );
  });
  mixer({
    semi: true,
    extractAll: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: '{ a } from "b";',
        contentStartsAt: 7,
        contentEndsAt: 22,
        value: 'export { a } from "b";',
        valueStartsAt: 0,
        valueEndsAt: 22,
        all: ["export"],
        error: null,
      },
      "02.04"
    );
  });
});

test("03 - others follow", () => {
  let source = `export { a } from "b";
declare const c: string;
  `;
  mixer({
    semi: false,
    extractAll: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: '{ a } from "b"',
        contentStartsAt: 7,
        contentEndsAt: 21,
        value: 'export { a } from "b"',
        valueStartsAt: 0,
        valueEndsAt: 21,
        all: [],
        error: null,
      },
      "03.01"
    );
  });
  mixer({
    semi: false,
    extractAll: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: '{ a } from "b"',
        contentStartsAt: 7,
        contentEndsAt: 21,
        value: 'export { a } from "b"',
        valueStartsAt: 0,
        valueEndsAt: 21,
        all: ["export", "c"],
        error: null,
      },
      "03.02"
    );
  });
  mixer({
    semi: true,
    extractAll: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: '{ a } from "b";',
        contentStartsAt: 7,
        contentEndsAt: 22,
        value: 'export { a } from "b";',
        valueStartsAt: 0,
        valueEndsAt: 22,
        all: [],
        error: null,
      },
      "03.03"
    );
  });
  mixer({
    semi: true,
    extractAll: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: '{ a } from "b";',
        contentStartsAt: 7,
        contentEndsAt: 22,
        value: 'export { a } from "b";',
        valueStartsAt: 0,
        valueEndsAt: 22,
        all: ["export", "c"],
        error: null,
      },
      "03.04"
    );
  });
});

test("04 - re-exports", () => {
  let source = `export { x as y } from "z";`;
  // 4x semi=false
  mixer({
    semi: false,
    extractAll: false,
    stripAs: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: '{ x as y } from "z"',
        contentStartsAt: 7,
        contentEndsAt: 26,
        value: 'export { x as y } from "z"',
        valueStartsAt: 0,
        valueEndsAt: 26,
        all: [],
        error: null,
      },
      "04.01"
    );
  });
  mixer({
    semi: false,
    extractAll: false,
    stripAs: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: '{ y } from "z"',
        contentStartsAt: 7,
        contentEndsAt: 26,
        value: 'export { y } from "z"',
        valueStartsAt: 0,
        valueEndsAt: 26,
        all: [],
        error: null,
      },
      "04.02"
    );
  });
  mixer({
    semi: false,
    extractAll: true,
    stripAs: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: '{ x as y } from "z"',
        contentStartsAt: 7,
        contentEndsAt: 26,
        value: 'export { x as y } from "z"',
        valueStartsAt: 0,
        valueEndsAt: 26,
        all: ["export"],
        error: null,
      },
      "04.03"
    );
  });
  mixer({
    semi: false,
    extractAll: true,
    stripAs: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: '{ y } from "z"',
        contentStartsAt: 7,
        contentEndsAt: 26,
        value: 'export { y } from "z"',
        valueStartsAt: 0,
        valueEndsAt: 26,
        all: ["export"],
        error: null,
      },
      "04.04"
    );
  });
  // 4x semi=true
  mixer({
    semi: true,
    extractAll: false,
    stripAs: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: '{ x as y } from "z";',
        contentStartsAt: 7,
        contentEndsAt: 27,
        value: 'export { x as y } from "z";',
        valueStartsAt: 0,
        valueEndsAt: 27,
        all: [],
        error: null,
      },
      "04.05"
    );
  });
  mixer({
    semi: true,
    extractAll: false,
    stripAs: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: '{ y } from "z";',
        contentStartsAt: 7,
        contentEndsAt: 27,
        value: 'export { y } from "z";',
        valueStartsAt: 0,
        valueEndsAt: 27,
        all: [],
        error: null,
      },
      "04.06"
    );
  });
  mixer({
    semi: true,
    extractAll: true,
    stripAs: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: '{ x as y } from "z";',
        contentStartsAt: 7,
        contentEndsAt: 27,
        value: 'export { x as y } from "z";',
        valueStartsAt: 0,
        valueEndsAt: 27,
        all: ["export"],
        error: null,
      },
      "04.07"
    );
  });
  mixer({
    semi: true,
    extractAll: true,
    stripAs: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: '{ y } from "z";',
        contentStartsAt: 7,
        contentEndsAt: 27,
        value: 'export { y } from "z";',
        valueStartsAt: 0,
        valueEndsAt: 27,
        all: ["export"],
        error: null,
      },
      "04.08"
    );
  });
});

test("05 - re-exports, more realistic", () => {
  let source = `export {
  isProduction4,
  isProduction4a,
  isProduction4 as validFirstChar,
  isProduction4a as validSecondCharOnwards,
};`;
  // 4x semi=false
  mixer({
    semi: false,
    extractAll: false,
    stripAs: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  isProduction4,
  isProduction4a,
  isProduction4 as validFirstChar,
  isProduction4a as validSecondCharOnwards,
}`,
        contentStartsAt: 7,
        contentEndsAt: 124,
        value: `export {
  isProduction4,
  isProduction4a,
  isProduction4 as validFirstChar,
  isProduction4a as validSecondCharOnwards,
}`,
        valueStartsAt: 0,
        valueEndsAt: 124,
        all: [],
        error: null,
      },
      "05.01"
    );
  });
  mixer({
    semi: false,
    extractAll: false,
    stripAs: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
}`,
        contentStartsAt: 7,
        contentEndsAt: 124,
        value: `export {
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
}`,
        valueStartsAt: 0,
        valueEndsAt: 124,
        all: [],
        error: null,
      },
      "05.02"
    );
  });
  mixer({
    semi: false,
    extractAll: true,
    stripAs: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  isProduction4,
  isProduction4a,
  isProduction4 as validFirstChar,
  isProduction4a as validSecondCharOnwards,
}`,
        contentStartsAt: 7,
        contentEndsAt: 124,
        value: `export {
  isProduction4,
  isProduction4a,
  isProduction4 as validFirstChar,
  isProduction4a as validSecondCharOnwards,
}`,
        valueStartsAt: 0,
        valueEndsAt: 124,
        all: ["export"],
        error: null,
      },
      "05.03"
    );
  });
  mixer({
    semi: false,
    extractAll: true,
    stripAs: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
}`,
        contentStartsAt: 7,
        contentEndsAt: 124,
        value: `export {
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
}`,
        valueStartsAt: 0,
        valueEndsAt: 124,
        all: ["export"],
        error: null,
      },
      "05.04"
    );
  });
  // 4x semi=true
  mixer({
    semi: true,
    extractAll: false,
    stripAs: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  isProduction4,
  isProduction4a,
  isProduction4 as validFirstChar,
  isProduction4a as validSecondCharOnwards,
};`,
        contentStartsAt: 7,
        contentEndsAt: 125,
        value: `export {
  isProduction4,
  isProduction4a,
  isProduction4 as validFirstChar,
  isProduction4a as validSecondCharOnwards,
};`,
        valueStartsAt: 0,
        valueEndsAt: 125,
        all: [],
        error: null,
      },
      "05.05"
    );
  });
  mixer({
    semi: true,
    extractAll: false,
    stripAs: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
};`,
        contentStartsAt: 7,
        contentEndsAt: 125,
        value: `export {
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
};`,
        valueStartsAt: 0,
        valueEndsAt: 125,
        all: [],
        error: null,
      },
      "05.06"
    );
  });
  mixer({
    semi: true,
    extractAll: true,
    stripAs: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  isProduction4,
  isProduction4a,
  isProduction4 as validFirstChar,
  isProduction4a as validSecondCharOnwards,
};`,
        contentStartsAt: 7,
        contentEndsAt: 125,
        value: `export {
  isProduction4,
  isProduction4a,
  isProduction4 as validFirstChar,
  isProduction4a as validSecondCharOnwards,
};`,
        valueStartsAt: 0,
        valueEndsAt: 125,
        all: ["export"],
        error: null,
      },
      "05.07"
    );
  });
  mixer({
    semi: true,
    extractAll: true,
    stripAs: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
};`,
        contentStartsAt: 7,
        contentEndsAt: 125,
        value: `export {
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
};`,
        valueStartsAt: 0,
        valueEndsAt: 125,
        all: ["export"],
        error: null,
      },
      "05.08"
    );
  });
});

test("06 - sorting, minimal - no custom sort function", () => {
  let source = `export { b, a, c };`;
  mixer({
    semi: true,
    extractAll: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: "{ b, a, c };",
        contentStartsAt: 7,
        contentEndsAt: 19,
        value: "export { b, a, c };",
        valueStartsAt: 0,
        valueEndsAt: 19,
        all: [],
        error: null,
      },
      "06.01"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: "{ a, b, c };",
        contentStartsAt: 7,
        contentEndsAt: 19,
        value: "export { b, a, c };",
        valueStartsAt: 0,
        valueEndsAt: 19,
        all: [],
        error: null,
      },
      "06.02"
    );
  });
  mixer({
    semi: false,
    extractAll: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: "{ b, a, c }",
        contentStartsAt: 7,
        contentEndsAt: 18,
        value: "export { b, a, c }",
        valueStartsAt: 0,
        valueEndsAt: 18,
        all: [],
        error: null,
      },
      "06.03"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: "{ a, b, c }",
        contentStartsAt: 7,
        contentEndsAt: 18,
        value: "export { b, a, c }",
        valueStartsAt: 0,
        valueEndsAt: 18,
        all: [],
        error: null,
      },
      "06.04"
    );
  });
  mixer({
    semi: false,
    extractAll: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: "{ b, a, c }",
        contentStartsAt: 7,
        contentEndsAt: 18,
        value: "export { b, a, c }",
        valueStartsAt: 0,
        valueEndsAt: 18,
        all: ["export"],
        error: null,
      },
      "06.05"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: "{ a, b, c }",
        contentStartsAt: 7,
        contentEndsAt: 18,
        value: "export { b, a, c }",
        valueStartsAt: 0,
        valueEndsAt: 18,
        all: ["export"],
        error: null,
      },
      "06.06"
    );
  });
  mixer({
    semi: true,
    extractAll: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: "{ b, a, c };",
        contentStartsAt: 7,
        contentEndsAt: 19,
        value: "export { b, a, c };",
        valueStartsAt: 0,
        valueEndsAt: 19,
        all: ["export"],
        error: null,
      },
      "06.07"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: "{ a, b, c };",
        contentStartsAt: 7,
        contentEndsAt: 19,
        value: "export { b, a, c };",
        valueStartsAt: 0,
        valueEndsAt: 19,
        all: ["export"],
        error: null,
      },
      "06.08"
    );
  });
});

test("07 - places defaults and version after any other lowercase names", () => {
  let source = `export { b, a, defaults, c, version, };`;
  mixer({
    semi: false,
    extractAll: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{ b, a, defaults, c, version, }`,
        contentStartsAt: 7,
        contentEndsAt: 38,
        value: `export { b, a, defaults, c, version, }`,
        valueStartsAt: 0,
        valueEndsAt: 38,
        all: [],
        error: null,
      },
      "07.01"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{ a, b, c, defaults, version, }`,
        contentStartsAt: 7,
        contentEndsAt: 38,
        value: `export { b, a, defaults, c, version, }`,
        valueStartsAt: 0,
        valueEndsAt: 38,
        all: [],
        error: null,
      },
      "07.02"
    );
  });
  mixer({
    semi: false,
    extractAll: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{ b, a, defaults, c, version, }`,
        contentStartsAt: 7,
        contentEndsAt: 38,
        value: `export { b, a, defaults, c, version, }`,
        valueStartsAt: 0,
        valueEndsAt: 38,
        all: ["export"],
        error: null,
      },
      "07.03"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{ a, b, c, defaults, version, }`,
        contentStartsAt: 7,
        contentEndsAt: 38,
        value: `export { b, a, defaults, c, version, }`,
        valueStartsAt: 0,
        valueEndsAt: 38,
        all: ["export"],
        error: null,
      },
      "07.04"
    );
  });
  mixer({
    semi: true,
    extractAll: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{ b, a, defaults, c, version, };`,
        contentStartsAt: 7,
        contentEndsAt: 39,
        value: `export { b, a, defaults, c, version, };`,
        valueStartsAt: 0,
        valueEndsAt: 39,
        all: [],
        error: null,
      },
      "07.05"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{ a, b, c, defaults, version, };`,
        contentStartsAt: 7,
        contentEndsAt: 39,
        value: `export { b, a, defaults, c, version, };`,
        valueStartsAt: 0,
        valueEndsAt: 39,
        all: [],
        error: null,
      },
      "07.06"
    );
  });
  mixer({
    semi: true,
    extractAll: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{ b, a, defaults, c, version, };`,
        contentStartsAt: 7,
        contentEndsAt: 39,
        value: `export { b, a, defaults, c, version, };`,
        valueStartsAt: 0,
        valueEndsAt: 39,
        all: ["export"],
        error: null,
      },
      "07.07"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{ a, b, c, defaults, version, };`,
        contentStartsAt: 7,
        contentEndsAt: 39,
        value: `export { b, a, defaults, c, version, };`,
        valueStartsAt: 0,
        valueEndsAt: 39,
        all: ["export"],
        error: null,
      },
      "07.08"
    );
  });
});

test("08 - lowercase and uppercase", () => {
  let source = `export { b, B, a, A, C, c, 1, _ };`;
  mixer({
    semi: false,
    extractAll: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: "{ b, B, a, A, C, c, 1, _ }",
        contentStartsAt: 7,
        contentEndsAt: 33,
        value: "export { b, B, a, A, C, c, 1, _ }",
        valueStartsAt: 0,
        valueEndsAt: 33,
        all: [],
        error: null,
      },
      "08.01"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: "{ 1, _, a, b, c, A, B, C }",
        contentStartsAt: 7,
        contentEndsAt: 33,
        value: "export { b, B, a, A, C, c, 1, _ }",
        valueStartsAt: 0,
        valueEndsAt: 33,
        all: [],
        error: null,
      },
      "08.02"
    );
  });
  mixer({
    semi: false,
    extractAll: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: "{ b, B, a, A, C, c, 1, _ }",
        contentStartsAt: 7,
        contentEndsAt: 33,
        value: "export { b, B, a, A, C, c, 1, _ }",
        valueStartsAt: 0,
        valueEndsAt: 33,
        all: ["export"],
        error: null,
      },
      "08.03"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: "{ 1, _, a, b, c, A, B, C }",
        contentStartsAt: 7,
        contentEndsAt: 33,
        value: "export { b, B, a, A, C, c, 1, _ }",
        valueStartsAt: 0,
        valueEndsAt: 33,
        all: ["export"],
        error: null,
      },
      "08.04"
    );
  });
  mixer({
    semi: true,
    extractAll: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: "{ b, B, a, A, C, c, 1, _ };",
        contentStartsAt: 7,
        contentEndsAt: 34,
        value: "export { b, B, a, A, C, c, 1, _ };",
        valueStartsAt: 0,
        valueEndsAt: 34,
        all: [],
        error: null,
      },
      "08.05"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: "{ 1, _, a, b, c, A, B, C };",
        contentStartsAt: 7,
        contentEndsAt: 34,
        value: "export { b, B, a, A, C, c, 1, _ };",
        valueStartsAt: 0,
        valueEndsAt: 34,
        all: [],
        error: null,
      },
      "08.06"
    );
  });
  mixer({
    semi: true,
    extractAll: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: "{ b, B, a, A, C, c, 1, _ };",
        contentStartsAt: 7,
        contentEndsAt: 34,
        value: "export { b, B, a, A, C, c, 1, _ };",
        valueStartsAt: 0,
        valueEndsAt: 34,
        all: ["export"],
        error: null,
      },
      "08.07"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: "{ 1, _, a, b, c, A, B, C };",
        contentStartsAt: 7,
        contentEndsAt: 34,
        value: "export { b, B, a, A, C, c, 1, _ };",
        valueStartsAt: 0,
        valueEndsAt: 34,
        all: ["export"],
        error: null,
      },
      "08.08"
    );
  });
});

test("09 - lowercase and uppercase - one line", () => {
  let source = `export { bananas, Broccoli, apples, Apricots, Cucumbers, celery, 123, _ };`;
  mixer({
    semi: false,
    extractAll: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content:
          "{ bananas, Broccoli, apples, Apricots, Cucumbers, celery, 123, _ }",
        contentStartsAt: 7,
        contentEndsAt: 73,
        value:
          "export { bananas, Broccoli, apples, Apricots, Cucumbers, celery, 123, _ }",
        valueStartsAt: 0,
        valueEndsAt: 73,
        all: [],
        error: null,
      },
      "09.01"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content:
          "{ 123, _, apples, bananas, celery, Apricots, Broccoli, Cucumbers }",
        contentStartsAt: 7,
        contentEndsAt: 73,
        value:
          "export { bananas, Broccoli, apples, Apricots, Cucumbers, celery, 123, _ }",
        valueStartsAt: 0,
        valueEndsAt: 73,
        all: [],
        error: null,
      },
      "09.02"
    );
  });
  mixer({
    semi: false,
    extractAll: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content:
          "{ bananas, Broccoli, apples, Apricots, Cucumbers, celery, 123, _ }",
        contentStartsAt: 7,
        contentEndsAt: 73,
        value:
          "export { bananas, Broccoli, apples, Apricots, Cucumbers, celery, 123, _ }",
        valueStartsAt: 0,
        valueEndsAt: 73,
        all: ["export"],
        error: null,
      },
      "09.03"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content:
          "{ 123, _, apples, bananas, celery, Apricots, Broccoli, Cucumbers }",
        contentStartsAt: 7,
        contentEndsAt: 73,
        value:
          "export { bananas, Broccoli, apples, Apricots, Cucumbers, celery, 123, _ }",
        valueStartsAt: 0,
        valueEndsAt: 73,
        all: ["export"],
        error: null,
      },
      "09.04"
    );
  });
  mixer({
    semi: true,
    extractAll: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content:
          "{ bananas, Broccoli, apples, Apricots, Cucumbers, celery, 123, _ };",
        contentStartsAt: 7,
        contentEndsAt: 74,
        value:
          "export { bananas, Broccoli, apples, Apricots, Cucumbers, celery, 123, _ };",
        valueStartsAt: 0,
        valueEndsAt: 74,
        all: [],
        error: null,
      },
      "09.05"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content:
          "{ 123, _, apples, bananas, celery, Apricots, Broccoli, Cucumbers };",
        contentStartsAt: 7,
        contentEndsAt: 74,
        value:
          "export { bananas, Broccoli, apples, Apricots, Cucumbers, celery, 123, _ };",
        valueStartsAt: 0,
        valueEndsAt: 74,
        all: [],
        error: null,
      },
      "09.06"
    );
  });
  mixer({
    semi: true,
    extractAll: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content:
          "{ bananas, Broccoli, apples, Apricots, Cucumbers, celery, 123, _ };",
        contentStartsAt: 7,
        contentEndsAt: 74,
        value:
          "export { bananas, Broccoli, apples, Apricots, Cucumbers, celery, 123, _ };",
        valueStartsAt: 0,
        valueEndsAt: 74,
        all: ["export"],
        error: null,
      },
      "09.07"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content:
          "{ 123, _, apples, bananas, celery, Apricots, Broccoli, Cucumbers };",
        contentStartsAt: 7,
        contentEndsAt: 74,
        value:
          "export { bananas, Broccoli, apples, Apricots, Cucumbers, celery, 123, _ };",
        valueStartsAt: 0,
        valueEndsAt: 74,
        all: ["export"],
        error: null,
      },
      "09.08"
    );
  });
});

test("10 - lowercase and uppercase - one per line", () => {
  let source = `export {
  bananas,
  Broccoli,
  apples,
  Apricots,
  defaults,
  version,
  Cucumbers,
  celery,
  123,
  _,
};`;
  mixer({
    semi: false,
    extractAll: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  bananas,
  Broccoli,
  apples,
  Apricots,
  defaults,
  version,
  Cucumbers,
  celery,
  123,
  _,
}`,
        contentStartsAt: 7,
        contentEndsAt: 113,
        value: `export {
  bananas,
  Broccoli,
  apples,
  Apricots,
  defaults,
  version,
  Cucumbers,
  celery,
  123,
  _,
}`,
        valueStartsAt: 0,
        valueEndsAt: 113,
        all: [],
        error: null,
      },
      "10.01"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  123,
  _,
  apples,
  bananas,
  celery,
  defaults,
  version,
  Apricots,
  Broccoli,
  Cucumbers,
}`,
        contentStartsAt: 7,
        contentEndsAt: 113,
        value: `export {
  bananas,
  Broccoli,
  apples,
  Apricots,
  defaults,
  version,
  Cucumbers,
  celery,
  123,
  _,
}`,
        valueStartsAt: 0,
        valueEndsAt: 113,
        all: [],
        error: null,
      },
      "10.02"
    );
  });
  mixer({
    semi: false,
    extractAll: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  bananas,
  Broccoli,
  apples,
  Apricots,
  defaults,
  version,
  Cucumbers,
  celery,
  123,
  _,
}`,
        contentStartsAt: 7,
        contentEndsAt: 113,
        value: `export {
  bananas,
  Broccoli,
  apples,
  Apricots,
  defaults,
  version,
  Cucumbers,
  celery,
  123,
  _,
}`,
        valueStartsAt: 0,
        valueEndsAt: 113,
        all: ["export"],
        error: null,
      },
      "10.03"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  123,
  _,
  apples,
  bananas,
  celery,
  defaults,
  version,
  Apricots,
  Broccoli,
  Cucumbers,
}`,
        contentStartsAt: 7,
        contentEndsAt: 113,
        value: `export {
  bananas,
  Broccoli,
  apples,
  Apricots,
  defaults,
  version,
  Cucumbers,
  celery,
  123,
  _,
}`,
        valueStartsAt: 0,
        valueEndsAt: 113,
        all: ["export"],
        error: null,
      },
      "10.04"
    );
  });
  mixer({
    semi: true,
    extractAll: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  bananas,
  Broccoli,
  apples,
  Apricots,
  defaults,
  version,
  Cucumbers,
  celery,
  123,
  _,
};`,
        contentStartsAt: 7,
        contentEndsAt: 114,
        value: `export {
  bananas,
  Broccoli,
  apples,
  Apricots,
  defaults,
  version,
  Cucumbers,
  celery,
  123,
  _,
};`,
        valueStartsAt: 0,
        valueEndsAt: 114,
        all: [],
        error: null,
      },
      "10.05"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  123,
  _,
  apples,
  bananas,
  celery,
  defaults,
  version,
  Apricots,
  Broccoli,
  Cucumbers,
};`,
        contentStartsAt: 7,
        contentEndsAt: 114,
        value: `export {
  bananas,
  Broccoli,
  apples,
  Apricots,
  defaults,
  version,
  Cucumbers,
  celery,
  123,
  _,
};`,
        valueStartsAt: 0,
        valueEndsAt: 114,
        all: [],
        error: null,
      },
      "10.06"
    );
  });
  mixer({
    semi: true,
    extractAll: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  bananas,
  Broccoli,
  apples,
  Apricots,
  defaults,
  version,
  Cucumbers,
  celery,
  123,
  _,
};`,
        contentStartsAt: 7,
        contentEndsAt: 114,
        value: `export {
  bananas,
  Broccoli,
  apples,
  Apricots,
  defaults,
  version,
  Cucumbers,
  celery,
  123,
  _,
};`,
        valueStartsAt: 0,
        valueEndsAt: 114,
        all: ["export"],
        error: null,
      },
      "10.07"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  123,
  _,
  apples,
  bananas,
  celery,
  defaults,
  version,
  Apricots,
  Broccoli,
  Cucumbers,
};`,
        contentStartsAt: 7,
        contentEndsAt: 114,
        value: `export {
  bananas,
  Broccoli,
  apples,
  Apricots,
  defaults,
  version,
  Cucumbers,
  celery,
  123,
  _,
};`,
        valueStartsAt: 0,
        valueEndsAt: 114,
        all: ["export"],
        error: null,
      },
      "10.08"
    );
  });
});

test("11 - mixed 'as' and mixed indentation", () => {
  let source = `export {
  bananas as k,
  Broccoli as l,
  apples as defaults,
  Apricots as n,
  Cucumbers as o,
  celery as r,
  123 as version,
  _ as s
}`;
  mixer({
    extractAll: false,
    stripAs: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  bananas as k,
  Broccoli as l,
  apples as defaults,
  Apricots as n,
  Cucumbers as o,
  celery as r,
  123 as version,
  _ as s
}`,
        contentStartsAt: 7,
        contentEndsAt: 142,
        value: source,
        valueStartsAt: 0,
        valueEndsAt: 142,
        all: [],
        error: null,
      },
      "11.01"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  123 as version,
  _ as s,
  apples as defaults,
  bananas as k,
  celery as r,
  Apricots as n,
  Broccoli as l,
  Cucumbers as o
}`,
        contentStartsAt: 7,
        contentEndsAt: 142,
        value: source,
        valueStartsAt: 0,
        valueEndsAt: 142,
        all: [],
        error: null,
      },
      "11.02"
    );
  });
  mixer({
    extractAll: false,
    stripAs: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  k,
  l,
  defaults,
  n,
  o,
  r,
  version,
  s
}`,
        contentStartsAt: 7,
        contentEndsAt: 142,
        value: `export {
  k,
  l,
  defaults,
  n,
  o,
  r,
  version,
  s
}`,
        valueStartsAt: 0,
        valueEndsAt: 142,
        all: [],
        error: null,
      },
      "11.03"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  k,
  l,
  n,
  o,
  r,
  s,
  defaults,
  version
}`,
        contentStartsAt: 7,
        contentEndsAt: 142,
        value: `export {
  k,
  l,
  defaults,
  n,
  o,
  r,
  version,
  s
}`,
        valueStartsAt: 0,
        valueEndsAt: 142,
        all: [],
        error: null,
      },
      "11.04"
    );
  });
  mixer({
    extractAll: true,
    stripAs: false,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  bananas as k,
  Broccoli as l,
  apples as defaults,
  Apricots as n,
  Cucumbers as o,
  celery as r,
  123 as version,
  _ as s
}`,
        contentStartsAt: 7,
        contentEndsAt: 142,
        value: source,
        valueStartsAt: 0,
        valueEndsAt: 142,
        all: ["export"],
        error: null,
      },
      "11.05"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  123 as version,
  _ as s,
  apples as defaults,
  bananas as k,
  celery as r,
  Apricots as n,
  Broccoli as l,
  Cucumbers as o
}`,
        contentStartsAt: 7,
        contentEndsAt: 142,
        value: source,
        valueStartsAt: 0,
        valueEndsAt: 142,
        all: ["export"],
        error: null,
      },
      "11.06"
    );
  });
  mixer({
    extractAll: true,
    stripAs: true,
  }).forEach((opt) => {
    equal(
      extract(source, "export", opt),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  k,
  l,
  defaults,
  n,
  o,
  r,
  version,
  s
}`,
        contentStartsAt: 7,
        contentEndsAt: 142,
        value: `export {
  k,
  l,
  defaults,
  n,
  o,
  r,
  version,
  s
}`,
        valueStartsAt: 0,
        valueEndsAt: 142,
        all: ["export"],
        error: null,
      },
      "11.07"
    );
    equal(
      extract(source, "export", { ...opt, contentSort }),
      {
        identifiers: ["export"],
        identifiersStartAt: 0,
        identifiersEndAt: 6,
        content: `{
  k,
  l,
  n,
  o,
  r,
  s,
  defaults,
  version
}`,
        contentStartsAt: 7,
        contentEndsAt: 142,
        value: `export {
  k,
  l,
  defaults,
  n,
  o,
  r,
  version,
  s
}`,
        valueStartsAt: 0,
        valueEndsAt: 142,
        all: ["export"],
        error: null,
      },
      "11.08"
    );
  });
});

test.run();
