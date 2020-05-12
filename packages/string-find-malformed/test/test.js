import tap from "tap";
import strFindMalformed from "../dist/string-find-malformed.esm";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

tap.test(
  "01 - throws when the first argument, source string, is not a string",
  (t) => {
    t.throws(() => {
      strFindMalformed(1);
    }, /THROW_ID_01/);

    // more resembling real-life:
    t.throws(() => {
      strFindMalformed(
        1,
        "a",
        () => {
          console.log("yo");
        },
        null
      );
    }, /THROW_ID_01/);
    t.end();
  }
);

tap.test(
  "02 - throws when the second argument, ref string, is not a string",
  (t) => {
    t.throws(() => {
      strFindMalformed("aaa", 1);
    }, /THROW_ID_02/);

    // more resembling real-life:
    t.throws(() => {
      strFindMalformed(
        "a",
        1,
        () => {
          console.log("yo");
        },
        null
      );
    }, /THROW_ID_02/);
    t.end();
  }
);

tap.test(
  "03 - throws when the third argument, callback, is not a function",
  (t) => {
    t.throws(() => {
      strFindMalformed("aaa", "zzz", 1);
    }, /THROW_ID_03/);

    t.throws(() => {
      strFindMalformed("a", "b", "c", null);
    }, /THROW_ID_03/);
    t.end();
  }
);

tap.test(
  "04 - throws when the fourth argument, optional options object, is not a plain object",
  (t) => {
    t.throws(() => {
      strFindMalformed("aaa", "bbb", () => {}, "ccc");
    }, /THROW_ID_04/);
    t.end();
  }
);

tap.test("05 - throws when opts.stringOffset is not a number", (t) => {
  t.throws(() => {
    strFindMalformed("aaa", "bbb", () => {}, { stringOffset: "ccc" });
  }, /THROW_ID_05/);
  t.end();
});

tap.test(`06 - empty string`, (t) => {
  const gathered = [];
  strFindMalformed("", "bde", (obj) => {
    gathered.push(obj);
  });
  t.same(gathered, [], "06");
  t.end();
});

tap.test(`07 - empty string`, (t) => {
  const gathered = [];
  strFindMalformed("abc", "", (obj) => {
    gathered.push(obj);
  });
  t.same(gathered, [], "07");
  t.end();
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

tap.test(`08 - rogue character, "c"`, (t) => {
  const gathered = [];
  strFindMalformed("abcdef", "bde", (obj) => {
    gathered.push(obj);
  });
  t.same(
    gathered,
    [
      {
        idxFrom: 1,
        idxTo: 5,
      },
    ],
    "08"
  );
  t.end();
});

tap.test(`09 - overlapping and extended maxDistance`, (t) => {
  const gathered = [];
  strFindMalformed(
    "abcabcd.f",
    "abcdef",
    (obj) => {
      gathered.push(obj);
    },
    {
      maxDistance: 2,
    }
  );
  t.same(
    gathered,
    [
      {
        idxFrom: 3,
        idxTo: 9,
      },
    ],
    "09"
  );
  t.end();
});

tap.test(`10 - with opts.stringOffset`, (t) => {
  const gathered = [];
  strFindMalformed(
    "<div><!-something--></div>",
    "<!--",
    (obj) => {
      gathered.push(obj);
    },
    {
      maxDistance: 1,
      stringOffset: 100,
    }
  );
  t.same(
    gathered,
    [
      {
        idxFrom: 105,
        idxTo: 108,
      },
    ],
    "10"
  );
  t.end();
});

tap.test(`11 - correct, fully matching value is not pinged`, (t) => {
  const gathered = [];
  strFindMalformed(
    "<div><!--something--></div>",
    "<!--",
    (obj) => {
      gathered.push(obj);
    },
    {
      maxDistance: 1,
      stringOffset: 100,
    }
  );
  t.same(gathered, [], "11");
  t.end();
});

tap.test(`12 - like before but strings in opts`, (t) => {
  const gathered = [];
  strFindMalformed(
    "<div><!-\n\n\n-something--></div>",
    "<!--",
    (obj) => {
      gathered.push(obj);
    },
    {
      maxDistance: "1",
      stringOffset: "100",
    }
  );
  t.same(
    gathered,
    [
      {
        idxFrom: 105,
        idxTo: 112,
      },
    ],
    "12"
  );
  t.end();
});

tap.test(`13 - whitespace`, (t) => {
  const gathered = [];
  strFindMalformed(
    "<div>< ! - -something--></div>",
    "<!--",
    (obj) => {
      gathered.push(obj);
    },
    null
  );
  t.same(
    gathered,
    [
      {
        idxFrom: 5,
        idxTo: 12,
      },
    ],
    "13"
  );
  t.end();
});

tap.test(`14 - repeated characters after failed match`, (t) => {
  const gathered = [];
  strFindMalformed(
    "<--z",
    "<!--",
    (obj) => {
      gathered.push(obj);
    },
    null
  );
  t.same(
    gathered,
    [
      {
        idxFrom: 0,
        idxTo: 3,
      },
    ],
    "14"
  );
  t.end();
});

tap.test(`15 - repeated characters after failed match`, (t) => {
  const gathered = [];
  strFindMalformed(
    "<!-[if mso]>",
    "<!--[",
    (obj) => {
      gathered.push(obj);
    },
    null
  );
  t.same(
    gathered,
    [
      {
        idxFrom: 0,
        idxTo: 4,
      },
    ],
    "15"
  );
  t.end();
});
