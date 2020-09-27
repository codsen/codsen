import tap from "tap";
import get from "../dist/ast-get-values-by-key.esm";

tap.test("01 - wrong type of second argument", (t) => {
  // throw pinning:
  const error1 = t.throws(() => {
    get(
      {
        style: "html",
      },
      1,
      ["meta"]
    );
  });
  t.match(error1.message, /THROW_ID_04/g, "01");
  t.end();
});

tap.test(
  "02 - input is plain object, replacement is unrecognised (is a function)",
  (t) => {
    function f() {
      return "zzz";
    }
    t.doesNotThrow(() => {
      get(
        {
          style: "html",
        },
        "style",
        f
      );
    }, "02");
    t.end();
  }
);

tap.test(
  "03 - one of the whatToFind array values is a sneaky non-string",
  (t) => {
    t.throws(() => {
      get(
        {
          style: "html",
        },
        ["style", 1],
        ["meta"]
      );
    }, /THROW_ID_03/g);
    t.end();
  }
);

tap.test(
  "04 - one of the replacement array values is a sneaky non-string",
  (t) => {
    t.doesNotThrow(() => {
      get(
        {
          style: "html",
        },
        "style",
        ["meta", 1]
      );
    }, "04");
    t.end();
  }
);

tap.test("05 - input present but non-container sort", (t) => {
  t.strictSame(get(1, "style", "meta"), 1, "05");
  t.end();
});

tap.test("06 - input completely missing", (t) => {
  t.throws(() => {
    get();
  }, /THROW_ID_01/g);

  t.throws(() => {
    get(null);
  }, /THROW_ID_01/g);

  t.throws(() => {
    get(undefined);
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("07 - second argument is completely missing", (t) => {
  t.throws(() => {
    get({
      style: "meta",
    });
  }, /THROW_ID_02/g);

  t.throws(() => {
    get(
      {
        style: "meta",
      },
      undefined,
      ["a"]
    );
  }, /THROW_ID_02/g);

  t.throws(() => {
    get(
      {
        style: "meta",
      },
      null,
      ["a"]
    );
  }, /THROW_ID_02/g);
  t.end();
});
