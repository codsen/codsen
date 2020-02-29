const t = require("tap");
const strFindMalformed = require("../dist/string-find-malformed.cjs");

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

t.test(
  "01.01 - throws when the first argument, source string, is not a string",
  t => {
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

t.test(
  "01.02 - throws when the second argument, ref string, is not a string",
  t => {
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

t.test(
  "01.03 - throws when the third argument, callback, is not a function",
  t => {
    t.throws(() => {
      strFindMalformed("aaa", "zzz", 1);
    }, /THROW_ID_03/);

    t.throws(() => {
      strFindMalformed("a", "b", "c", null);
    }, /THROW_ID_03/);
    t.end();
  }
);

t.test(
  "01.04 - throws when the fourth argument, optional options object, is not a plain object",
  t => {
    t.throws(() => {
      strFindMalformed("aaa", "bbb", () => {}, "ccc");
    }, /THROW_ID_04/);
    t.end();
  }
);

t.test("01.05 - throws when opts.stringOffset is not a number", t => {
  t.throws(() => {
    strFindMalformed("aaa", "bbb", () => {}, { stringOffset: "ccc" });
  }, /THROW_ID_05/);
  t.end();
});

t.test(`01.06 - empty string`, t => {
  const gathered = [];
  strFindMalformed("", "bde", obj => {
    gathered.push(obj);
  });
  t.same(gathered, [], "01.06");
  t.end();
});

t.test(`01.07 - empty string`, t => {
  const gathered = [];
  strFindMalformed("abc", "", obj => {
    gathered.push(obj);
  });
  t.same(gathered, [], "01.07");
  t.end();
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

t.test(`02.01 - rogue character, "c"`, t => {
  const gathered = [];
  strFindMalformed("abcdef", "bde", obj => {
    gathered.push(obj);
  });
  t.same(
    gathered,
    [
      {
        idxFrom: 1,
        idxTo: 5
      }
    ],
    "02.01"
  );
  t.end();
});

t.test(`02.02 - overlapping and extended maxDistance`, t => {
  const gathered = [];
  strFindMalformed(
    "abcabcd.f",
    "abcdef",
    obj => {
      gathered.push(obj);
    },
    {
      maxDistance: 2
    }
  );
  t.same(
    gathered,
    [
      {
        idxFrom: 3,
        idxTo: 9
      }
    ],
    "02.02"
  );
  t.end();
});

t.test(`02.03 - with opts.stringOffset`, t => {
  const gathered = [];
  strFindMalformed(
    "<div><!-something--></div>",
    "<!--",
    obj => {
      gathered.push(obj);
    },
    {
      maxDistance: 1,
      stringOffset: 100
    }
  );
  t.same(
    gathered,
    [
      {
        idxFrom: 105,
        idxTo: 108
      }
    ],
    "02.03"
  );
  t.end();
});

t.test(`02.04 - correct, fully matching value is not pinged`, t => {
  const gathered = [];
  strFindMalformed(
    "<div><!--something--></div>",
    "<!--",
    obj => {
      gathered.push(obj);
    },
    {
      maxDistance: 1,
      stringOffset: 100
    }
  );
  t.same(gathered, [], "02.04");
  t.end();
});

t.test(`02.05 - like before but strings in opts`, t => {
  const gathered = [];
  strFindMalformed(
    "<div><!-\n\n\n-something--></div>",
    "<!--",
    obj => {
      gathered.push(obj);
    },
    {
      maxDistance: "1",
      stringOffset: "100"
    }
  );
  t.same(
    gathered,
    [
      {
        idxFrom: 105,
        idxTo: 112
      }
    ],
    "02.04"
  );
  t.end();
});

t.test(`02.06 - whitespace`, t => {
  const gathered = [];
  strFindMalformed(
    "<div>< ! - -something--></div>",
    "<!--",
    obj => {
      gathered.push(obj);
    },
    null
  );
  t.same(
    gathered,
    [
      {
        idxFrom: 5,
        idxTo: 12
      }
    ],
    "02.06"
  );
  t.end();
});
