import tap from "tap";
import { mixer } from "../dist/test-mixer.esm.js";

tap.test("01", (t) => {
  t.strictSame(
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
  t.strictSame(
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
  t.strictSame(
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
  t.end();
});

tap.test("02", (t) => {
  t.strictSame(
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
  t.strictSame(
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
  t.end();
});

tap.test("03 - request all variations by passing undefined as 1st arg", (t) => {
  t.strictSame(
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
  t.strictSame(
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
  t.end();
});

tap.test("04 - ensure values are cloned, not referenced", (t) => {
  const obj = {
    foo: true,
    bar: false,
    baz: { x: "y" },
  };
  // first calculate the combinations
  const result = mixer(
    {
      foo: true,
    },
    obj
  );
  // then, modify the value within the source - if it was referenced,
  // values will change! If it was cloned, values won't change.
  obj.baz = null;

  t.strictSame(
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
  t.end();
});

tap.test("05 - ensure values are cloned, not referenced", (t) => {
  t.strictSame(
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
  t.end();
});

tap.test("06", (t) => {
  t.strictSame(
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
  t.end();
});

tap.test("07", (t) => {
  t.strictSame(
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
  t.end();
});
