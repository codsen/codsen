import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { mixer } from "../dist/test-mixer.esm.js";

test("01", () => {
  equal(
    mixer(
      {
        foo: true,
      },
      {
        foo: true,
        bar: false,
      }
    ),
    [
      {
        foo: true,
        bar: false,
      },
      {
        foo: true,
        bar: true,
      },
    ],
    "01.01"
  );
  equal(
    mixer(
      {
        foo: true,
      },
      {
        foo: true,
        bar: false,
      },
      false
    ),
    [
      {
        foo: true,
        bar: false,
      },
      {
        foo: true,
        bar: true,
      },
    ],
    "01.02"
  );
  equal(
    mixer(
      {
        foo: true,
      },
      {
        foo: true,
        bar: false,
      },
      true
    ),
    [
      {
        foo: true,
        bar: false,
      },
      {
        foo: true,
        bar: true,
      },
    ],
    "01.03"
  );
});

test("02", () => {
  equal(
    mixer(
      {},
      {
        foo: true,
        bar: "z",
      }
    ),
    [
      {
        foo: false,
        bar: "z",
      },
      {
        foo: true,
        bar: "z",
      },
    ],
    "02.01"
  );
  equal(
    mixer(
      {},
      {
        foo: true,
        bar: "z",
      },
      true // enforce bool values
    ),
    [
      {
        foo: false,
        bar: "z",
      },
      {
        foo: true,
        bar: "z",
      },
    ],
    "02.02"
  );
});

test("03 - request all variations by passing undefined as 1st arg", () => {
  equal(
    mixer(undefined, {
      foo: true,
      bar: "z",
    }),
    [
      {
        foo: false,
        bar: "z",
      },
      {
        foo: true,
        bar: "z",
      },
    ],
    "03.01"
  );
  equal(
    mixer(
      undefined,
      {
        foo: true,
        bar: "z",
      },
      true // enforce bool values
    ),
    [
      {
        foo: false,
        bar: "z",
      },
      {
        foo: true,
        bar: "z",
      },
    ],
    "03.02"
  );
});

test("04 - ensure values are cloned, not referenced", () => {
  let obj = {
    foo: true,
    bar: false,
    baz: { x: "y" },
  };
  // first calculate the combinations
  let result = mixer(
    {
      foo: true,
    },
    obj
  );
  // then, modify the value within the source - if it was referenced,
  // values will change! If it was cloned, values won't change.
  obj.baz = null;

  equal(
    result,
    [
      {
        foo: true,
        bar: false,
        baz: { x: "y" }, // <-- still "y", not null
      },
      {
        foo: true,
        bar: true,
        baz: { x: "y" }, // <-- still "y", not null
      },
    ],
    "04"
  );
});

test("05 - ensure values are cloned, not referenced", () => {
  equal(
    mixer(
      {
        stripHtml: true,
        replaceLineBreaks: false,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"], // <---
      },
      {
        removeWidows: true,
        stripHtml: true,
        replaceLineBreaks: false,
        eol: "lf",
        stripHtmlButIgnoreTags: ["b", "strong", "i", "em", "br", "sup"],
        stripHtmlAddNewLine: ["li", "/ul"],
        cb: null,
      }
    ),
    [
      {
        removeWidows: false,
        stripHtml: true,
        replaceLineBreaks: false,
        eol: "lf",
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"], // <---
        cb: null,
      },
      {
        removeWidows: true,
        stripHtml: true,
        replaceLineBreaks: false,
        eol: "lf",
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"], // <---
        cb: null,
      },
    ],
    "05"
  );
});

test("06", () => {
  equal(
    mixer(
      {
        foo: true,
        bar: false,
        baz: 1,
        qux: false,
      },
      {
        foo: false,
        bar: false,
        baz: 0,
        qux: true,
      }
    ),
    [
      {
        foo: true,
        bar: false,
        baz: 1,
        qux: false,
      },
    ],
    "06"
  );
});

test("07", () => {
  equal(
    mixer(
      {
        foo: true,
        bar: false,
        baz: 1,
      },
      {
        foo: false,
        bar: false,
        baz: 0,
        qux: true,
      }
    ),
    [
      {
        foo: true,
        bar: false,
        baz: 1,
        qux: false,
      },
      {
        foo: true,
        bar: false,
        baz: 1,
        qux: true,
      },
    ],
    "07"
  );
});

test.run();
