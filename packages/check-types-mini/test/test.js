import test from "ava";
import checkTypes from "../dist/check-types-mini.esm";

test("01.01 - throws when all/first args are missing", t => {
  const error = t.throws(() => {
    checkTypes();
  });
  t.truthy(error.message.includes("THROW_ID_01"));
  t.truthy(error.message.includes("check-types-mini"));
});

test("01.02 - throws when one of the arguments is of a wrong type", t => {
  const error = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: "false",
        option3: false
      },
      {
        option1: "setting1",
        option2: false,
        option3: false
      }
    );
  });
  t.truthy(error.message.includes("not boolean but string"));
});

test("01.03 - opts.msg or opts.optsVarName args are wrong-type", t => {
  const err1 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: "setting2",
        option3: false
      },
      {
        option1: "setting1",
        option2: "setting2",
        option3: false
      },
      {
        msg: "zzz",
        optsVarName: 1
      }
    );
  });
  t.truthy(err1.message.includes("not string but number"));
  t.truthy(err1.message.includes("opts.optsVarName"));

  const err2 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: "setting2",
        option3: false
      },
      {
        option1: "setting1",
        option2: "setting2",
        option3: false
      },
      {
        msg: 1,
        optsVarName: "zzz"
      }
    );
  });
  t.truthy(err2.message.includes("opts.msg"));
  t.truthy(err2.message.includes("which is not string but number"));
});

test("01.04 - throws if fourth argument is missing", t => {
  t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: "false",
        option3: false
      },
      {
        option1: "setting1",
        option2: false,
        option3: false
      },
      {
        msg: "newLibrary/index.js [THROW_ID_01]" // << no trailing space
      }
    );
  }, 'newLibrary/index.js [THROW_ID_01]: opts.option2 was customised to "false" which is not boolean but string');
  t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: "false",
        option3: false
      },
      {
        option1: "setting1",
        option2: false,
        option3: false
      },
      {
        msg: "newLibrary/index.js [THROW_ID_01]:        " // << trailing space
      }
    );
  }, 'newLibrary/index.js [THROW_ID_01]: opts.option2 was customised to "false" which is not boolean but string');
  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: "false",
        option3: false
      },
      {
        option1: "setting1",
        option2: false,
        option3: false
      },
      {
        msg: "newLibrary/index.js [THROW_ID_01]: ",
        ignoreKeys: ["option2"]
      }
    );
  });
});

test("01.05 - throws when opts are set wrong", t => {
  t.notThrows(() => {
    checkTypes(
      { somekey: "a" },
      { somekey: "b" },
      {
        msg: "aa",
        optsVarName: "bbb",
        ignoreKeys: false
      }
    );
  });

  const err1 = t.throws(() => {
    checkTypes(
      { somekey: "a" },
      { somekey: "b" },
      {
        msg: 1,
        optsVarName: "bbb",
        ignoreKeys: false
      }
    );
  });
  t.truthy(err1.message.includes("not string but number"));

  t.notThrows(() => {
    checkTypes(
      { somekey: "a" },
      { somekey: "b" },
      {
        msg: "aa",
        optsVarName: "bbb",
        ignoreKeys: "a"
      }
    );
  });
  t.notThrows(() => {
    checkTypes(
      { somekey: "a" },
      { somekey: "b" },
      {
        msg: "aa",
        optsVarName: "bbb",
        ignoreKeys: ""
      }
    );
  });
});

test("01.06 - nested options", t => {
  const err1 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: "setting2",
        option3: {
          aaa: {
            bbb: true // should be text, not Bool
          }
        }
      },
      {
        option1: "setting1",
        option2: "setting2",
        option3: {
          aaa: {
            bbb: "a"
          }
        }
      }
    );
  });
  t.is(
    err1.message,
    'check-types-mini: opts.option3.aaa.bbb was customised to "true" which is not string but boolean'
  );

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: "setting2",
        option3: {}
      },
      {
        option1: "setting1",
        option2: "setting2",
        option3: {
          aaa: true
        }
      }
    );
  });
});

test("01.07 - opts.ignorePaths", t => {
  // control:
  t.throws(() => {
    checkTypes(
      {
        aaa: {
          bbb: "a"
        },
        ccc: {
          bbb: "d"
        }
      },
      {
        aaa: {
          bbb: true
        },
        ccc: {
          bbb: "d"
        }
      },
      {
        msg: "msg",
        optsVarName: "OPTS",
        ignoreKeys: false
      }
    );
  }, 'msg: OPTS.aaa.bbb was customised to "a" which is not boolean but string');
});

// ======================
// 02. Arrays
// ======================

test("02.01 - opts.acceptArrays, strings+arrays", t => {
  const err1 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: ["setting3", "setting4"],
        option3: false
      },
      {
        option1: "setting1",
        option2: "setting2",
        option3: false
      }
    );
  });
  t.truthy(
    err1.message.includes(
      'check-types-mini: opts.option2 was customised to "["setting3","setting4"]" which is not string but array'
    )
  );

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: ["setting3", "setting4"],
        option3: false
      },
      {
        option1: "setting1",
        option2: "setting2",
        option3: false
      },
      {
        msg: "message",
        optsVarName: "varname",
        acceptArrays: true
      }
    );
  });

  const err2 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: ["setting3", true, "setting4"],
        option3: false
      },
      {
        option1: "setting1",
        option2: "setting2",
        option3: false
      },
      {
        msg: "message",
        optsVarName: "varname",
        acceptArrays: true
      }
    );
  });
  t.is(
    err2.message,
    "message: varname.option2 was customised to be array, but not all of its elements are string-type"
  );
});

test("02.02 - opts.acceptArrays, Booleans+arrays", t => {
  const err1 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: [true, true],
        option3: false
      },
      {
        option1: "setting1",
        option2: false,
        option3: false
      }
    );
  });
  t.is(
    err1.message,
    'check-types-mini: opts.option2 was customised to "[true,true]" which is not boolean but array'
  );

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: [true, true],
        option3: false
      },
      {
        option1: "setting1",
        option2: false,
        option3: false
      },
      {
        msg: "message",
        optsVarName: "varname",
        acceptArrays: true
      }
    );
  });

  const err2 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: [true, true, 1],
        option3: false
      },
      {
        option1: "setting1",
        option2: false,
        option3: false
      },
      {
        msg: "message",
        optsVarName: "varname",
        acceptArrays: true
      }
    );
  });
  t.truthy(
    err2.message.includes(
      "message: varname.option2 was customised to be array, but not all of its elements are boolean-type"
    )
  );

  const err3 = t.throws(() => {
    checkTypes(
      {
        option1: [1, 0, 1, 0],
        option2: [true, true],
        option3: false
      },
      {
        option1: 0,
        option2: false,
        option3: false
      },
      {
        msg: "test: [THROW_ID_01]",
        optsVarName: "opts",
        acceptArrays: "this string will cause the throw",
        acceptArraysIgnore: []
      }
    );
  });
  t.is(
    err3.message,
    'check-types-mini: opts.acceptArrays was customised to "this string will cause the throw" which is not boolean but string'
  );

  t.notThrows(() => {
    checkTypes(
      {
        option1: [1, 0, 1, 0],
        option2: [true, true],
        option3: false
      },
      {
        option1: 0,
        option2: false,
        option3: false
      },
      {
        msg: "test: [THROW_ID_01]",
        optsVarName: "opts",
        acceptArrays: true,
        acceptArraysIgnore: []
      }
    );
  });
});

test("02.03 - opts.acceptArraysIgnore", t => {
  t.notThrows(() => {
    checkTypes(
      {
        option1: [1, 0, 1, 0],
        option2: [true, true],
        option3: false
      },
      {
        option1: 0,
        option2: false,
        option3: false
      },
      {
        msg: "test: [THROW_ID_01]",
        optsVarName: "opts",
        acceptArrays: true,
        acceptArraysIgnore: []
      }
    );
  });

  const err1 = t.throws(() => {
    checkTypes(
      {
        option1: [1, 0, 1, 0],
        option2: [true, true],
        option3: false
      },
      {
        option1: 0,
        option2: false,
        option3: false
      },
      {
        msg: "test: [THROW_ID_01]",
        optsVarName: "opts",
        acceptArrays: true,
        acceptArraysIgnore: ["zzz", "option1"]
      }
    );
  });
  t.truthy(
    err1.message.includes(
      'test: [THROW_ID_01]: opts.option1 was customised to "[1,0,1,0]" which is not number but array'
    )
  );

  const err2 = t.throws(() => {
    checkTypes(
      {
        option1: [1, 0, 1, 0],
        option2: [true, true],
        option3: false
      },
      {
        option1: 0,
        option2: false,
        option3: false
      },
      {
        msg: "test: [THROW_ID_01]",
        optsVarName: "opts",
        acceptArrays: false,
        acceptArraysIgnore: ["zzz", "option1"]
      }
    );
  });
  t.truthy(
    err2.message.includes(
      'test: [THROW_ID_01]: opts.option1 was customised to "[1,0,1,0]" which is not number but array'
    )
  );

  const err3 = t.throws(() => {
    checkTypes(
      {
        option1: [1, 0, 1, 0],
        option2: [true, true],
        option3: false
      },
      {
        option1: 0,
        option2: false,
        option3: false
      },
      {
        msg: "test: [THROW_ID_01]",
        optsVarName: "opts",
        acceptArrays: true,
        acceptArraysIgnore: true
      }
    );
  });
  t.truthy(
    err3.message.includes(
      'check-types-mini: opts.acceptArraysIgnore was customised to "true" which is not array but boolean'
    )
  );
});

test("02.05 - involving null values", t => {
  const err = t.throws(() => {
    checkTypes(
      {
        key: 1,
        val: null,
        cleanup: true
      },
      {
        key: null,
        val: null,
        cleanup: true
      }
    );
  });
  t.is(
    err.message,
    'check-types-mini: opts.key was customised to "1" which is not null but number'
  );
});

test("02.06 - throws/notThrows when keysets mismatch", t => {
  t.throws(() => {
    checkTypes(
      {
        key: null,
        val: null,
        cleanup: true
      },
      {
        key: null,
        val: null
      }
    );
  });
  t.throws(() => {
    checkTypes(
      {
        key: null,
        val: null
      },
      {
        key: null,
        val: null,
        cleanup: true
      }
    );
  });
  t.notThrows(() => {
    checkTypes(
      {
        key: null,
        val: null,
        cleanup: true
      },
      {
        key: null,
        val: null
      },
      {
        enforceStrictKeyset: false
      }
    );
  });
  t.notThrows(() => {
    checkTypes(
      {
        key: null,
        val: null
      },
      {
        key: null,
        val: null,
        cleanup: true
      },
      {
        enforceStrictKeyset: false
      }
    );
  });
});

test("02.07 - opts.enforceStrictKeyset set to a wrong thing", t => {
  t.throws(() => {
    checkTypes(
      {
        key: 1,
        val: null,
        cleanup: true
      },
      {
        key: null,
        val: null,
        cleanup: true
      },
      {
        enforceStrictKeyset: 1
      }
    );
  });
});

test("02.08 - throws when reference and schema are both missing", t => {
  t.throws(() => {
    checkTypes(
      {
        key: 1,
        val: null,
        cleanup: true
      },
      {}
    );
  });
});

test.todo("02.09 - enforceStrictKeyset and nested inputs");

// ======================
// 03. opts.enforceStrictKeyset
// ======================

test("03.01 - opts.acceptArrays, strings+arrays", t => {
  t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: "setting2",
        rogueKey: false
      },
      {
        option1: "zz",
        option2: "yy"
      }
    );
  });
  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: "setting2",
        rogueKey: false
      },
      {
        option1: "zz",
        option2: "yy"
      },
      {
        enforceStrictKeyset: false
      }
    );
  });
});

// ======================
// 04. opts.schema
// ======================

test("04.01 - opts.schema only - located in root", t => {
  const err1 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: null
      },
      {
        option1: "zz",
        option2: "yy"
      }
    );
  });
  t.is(
    err1.message,
    'check-types-mini: opts.option2 was customised to "null" which is not string but null'
  );

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: null
      },
      {
        option1: "zz",
        option2: "yy"
      },
      {
        schema: {
          option2: ["stRing", null]
        }
      }
    );
  });

  const err2 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: null
      },
      {
        option1: "zz",
        option2: "yy"
      },
      {
        schema: {
          option2: ["string", "boolean"]
        }
      }
    );
  });
  t.is(
    err2.message,
    'check-types-mini: opts.option2 was customised to "null" (null) which is not among the allowed types in schema (string, boolean)'
  );

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: null
      },
      null, // << reference object is completely omitted!!!
      {
        schema: {
          option1: "String",
          option2: ["stRing", null]
        }
      }
    );
  });

  const err3 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: null
      },
      null,
      {
        schema: {
          // <<< notice how option1 is missing AND also missing in reference obj
          option2: ["stRing", null]
        }
      }
    );
  });
  t.is(
    err3.message,
    "check-types-mini: opts.enforceStrictKeyset is on and the following key is not covered by schema and/or reference objects: option1"
  );

  // true not allowed, - only false or null or string
  const err4 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: true
      },
      {
        option1: "zz",
        option2: null
      },
      {
        schema: {
          option2: ["null", "false", "string"]
        }
      }
    );
  });
  t.is(
    err4.message,
    'check-types-mini: opts.option2 was customised to "true" (boolean) which is not among the allowed types in schema (null, false, string)'
  );

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: false
      },
      {
        option1: "zz",
        option2: null
      },
      {
        schema: {
          option2: ["null", "false", "string"]
        }
      }
    );
  });

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: null
      },
      {
        option1: "zz",
        option2: false
      },
      {
        schema: {
          option2: ["null", "false", "string"]
        }
      }
    );
  });

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: "zzz"
      },
      {
        option1: "zz",
        option2: null
      },
      {
        schema: {
          option2: ["null", "false", "string"]
        }
      }
    );
  });

  // second bunch

  // true or string
  const err5 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: false
      },
      {
        option1: "zz",
        option2: true
      },
      {
        schema: {
          option2: ["true", "string"]
        }
      }
    );
  });
  t.is(
    err5.message,
    'check-types-mini: opts.option2 was customised to "false" (boolean) which is not among the allowed types in schema (true, string)'
  );

  const err6 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: null
      },
      {
        option1: "zz",
        option2: true
      },
      {
        schema: {
          option2: ["true", "string"]
        }
      }
    );
  });
  t.is(
    err6.message,
    'check-types-mini: opts.option2 was customised to "null" (null) which is not among the allowed types in schema (true, string)'
  );

  const err7 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: 0
      },
      {
        option1: "zz",
        option2: true
      },
      {
        schema: {
          option2: ["true", "string"]
        }
      }
    );
  });
  t.is(
    err7.message,
    'check-types-mini: opts.option2 was customised to "0" (number) which is not among the allowed types in schema (true, string)'
  );

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: "zzz"
      },
      {
        option1: "zz",
        option2: true
      },
      {
        schema: {
          option2: ["true", "string"]
        }
      }
    );
  });

  const err8 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: "zzz"
      },
      {
        option1: "zz",
        option2: true
      },
      {
        schema: {
          option2: ["true"]
        }
      }
    );
  });
  t.is(
    err8.message,
    'check-types-mini: opts.option2 was customised to "zzz" (string) which is not among the allowed types in schema (true)'
  );

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: true
      },
      {
        option1: "zz",
        option2: true
      },
      {
        schema: {
          option2: ["true"]
        }
      }
    );
  });

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: true
      },
      {
        option1: "zz",
        option2: true
      },
      {
        schema: {
          option2: ["boolean"]
        }
      }
    );
  });

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: false
      },
      {
        option1: "zz",
        option2: false
      },
      {
        schema: {
          option2: ["false"]
        }
      }
    );
  });

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: false
      },
      {
        option1: "zz",
        option2: false
      },
      {
        schema: {
          option2: ["boolean"]
        }
      }
    );
  });

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: true
      },
      {
        option1: "zz",
        option2: false
      },
      {
        schema: {
          option2: ["boolean"]
        }
      }
    );
  });

  const err9 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: "true" // <-- because it's string
      },
      {
        option1: "zz",
        option2: false
      },
      {
        schema: {
          option2: ["boolean"]
        }
      }
    );
  });
  t.is(
    err9.message,
    'check-types-mini: opts.option2 was customised to "true" (string) which is not among the allowed types in schema (boolean)'
  );
});

test("04.02 - opts.schema only - deeper level key doesn't even exist in ref", t => {
  const err1 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: {
          option3: null
        }
      },
      {
        option1: "zz",
        option2: null
      }
    );
  });
  t.is(
    err1.message,
    'check-types-mini: opts.option2 was customised to "{"option3":null}" which is not null but object'
  );

  const err2 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: {
          option3: "null"
        }
      },
      {
        option1: "zz",
        option2: {
          option3: null
        }
      }
    );
  });
  t.is(
    err2.message,
    'check-types-mini: opts.option2.option3 was customised to "null" which is not null but string'
  );

  const err3 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: {
          option3: null
        }
      },
      {
        option1: "zz",
        option2: {
          option3: "null"
        }
      }
    );
  });
  t.is(
    err3.message,
    'check-types-mini: opts.option2.option3 was customised to "null" which is not string but null'
  );
});

test("04.03 - opts.schema only - deeper level key type mismatches but is allowed through a schema", t => {
  // control - make it throw:

  const err = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: {
          option3: null
        }
      },
      {
        option1: "zz",
        option2: { option3: "yy" }
      },
      {
        schema: {
          option1: ["stRing"]
        }
      }
    );
  });
  t.is(
    err.message,
    'check-types-mini: opts.option2.option3 was customised to "null" which is not string but null'
  );

  // now prove that schema works:

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: {
          option3: null
        }
      },
      {
        option1: "zz",
        option2: { option3: "yy" }
      },
      {
        schema: {
          "option2.option3": ["stRing", null]
        }
      }
    );
  });
});

test("04.04 - opts.schema only - located deeper", t => {
  const err2 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: { option3: null }
      },
      {
        option1: "zz",
        option2: { option3: "yy" }
      },
      {
        schema: {
          "option2.option3": ["string", "boolean"]
        }
      }
    );
  });
  t.is(
    err2.message,
    'check-types-mini: opts.option2.option3 was customised to "null" (null) which is not among the allowed types in schema (string, boolean)'
  );

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: { option3: null }
      },
      null, // << reference object is completely omitted!!!
      {
        schema: {
          option1: "strinG",
          option2: "objecT",
          "option2.option3": ["stRing", null]
        }
      }
    );
  });

  const err3 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: { option3: null }
      },
      null,
      {
        schema: {
          // <<< notice how option1 is missing AND also missing in reference obj
          "option2.option3": ["stRing", null]
        }
      }
    );
  });
  t.is(
    err3.message,
    "check-types-mini: opts.enforceStrictKeyset is on and the following keys are not covered by schema and/or reference objects: option1, option2"
  );

  // make error message mention a missing deeper-level path:
  const err3_2 = t.throws(() => {
    checkTypes(
      {
        option1: { option2: "setting1" },
        option3: { option4: null }
      },
      null,
      {
        schema: {
          option1: "object", // option1.option2 is missing!
          option3: "object",
          "option3.option4": ["stRing", null]
        }
      }
    );
  });
  t.is(
    err3_2.message,
    "check-types-mini: opts.option1.option2 is neither covered by reference object (second input argument), nor opts.schema!"
  );

  // true not allowed, - only false or null or string
  const err4 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: true
      },
      {
        option1: "zz",
        option2: null
      },
      {
        schema: {
          option2: ["null", "false", "string"]
        }
      }
    );
  });
  t.is(
    err4.message,
    'check-types-mini: opts.option2 was customised to "true" (boolean) which is not among the allowed types in schema (null, false, string)'
  );

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: false
      },
      {
        option1: "zz",
        option2: null
      },
      {
        schema: {
          option2: ["null", "false", "string"]
        }
      }
    );
  });

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: null
      },
      {
        option1: "zz",
        option2: false
      },
      {
        schema: {
          option2: ["null", "false", "string"]
        }
      }
    );
  });

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: "zzz"
      },
      {
        option1: "zz",
        option2: null
      },
      {
        schema: {
          option2: ["null", "false", "string"]
        }
      }
    );
  });

  // second bunch

  // true or string
  const err5 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: false
      },
      {
        option1: "zz",
        option2: true
      },
      {
        schema: {
          option2: ["true", "string"]
        }
      }
    );
  });
  t.is(
    err5.message,
    'check-types-mini: opts.option2 was customised to "false" (boolean) which is not among the allowed types in schema (true, string)'
  );

  const err6 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: null
      },
      {
        option1: "zz",
        option2: true
      },
      {
        schema: {
          option2: ["true", "string"]
        }
      }
    );
  });
  t.is(
    err6.message,
    'check-types-mini: opts.option2 was customised to "null" (null) which is not among the allowed types in schema (true, string)'
  );

  const err7 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: 0
      },
      {
        option1: "zz",
        option2: true
      },
      {
        schema: {
          option2: ["true", "string"]
        }
      }
    );
  });
  t.is(
    err7.message,
    'check-types-mini: opts.option2 was customised to "0" (number) which is not among the allowed types in schema (true, string)'
  );

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: "zzz"
      },
      {
        option1: "zz",
        option2: true
      },
      {
        schema: {
          option2: ["true", "string"]
        }
      }
    );
  });

  const err8 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: "zzz"
      },
      {
        option1: "zz",
        option2: true
      },
      {
        schema: {
          option2: ["true"]
        }
      }
    );
  });
  t.is(
    err8.message,
    'check-types-mini: opts.option2 was customised to "zzz" (string) which is not among the allowed types in schema (true)'
  );

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: true
      },
      {
        option1: "zz",
        option2: true
      },
      {
        schema: {
          option2: ["true"]
        }
      }
    );
  });

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: true
      },
      {
        option1: "zz",
        option2: true
      },
      {
        schema: {
          option2: ["boolean"]
        }
      }
    );
  });

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: false
      },
      {
        option1: "zz",
        option2: false
      },
      {
        schema: {
          option2: ["false"]
        }
      }
    );
  });

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: false
      },
      {
        option1: "zz",
        option2: false
      },
      {
        schema: {
          option2: ["boolean"]
        }
      }
    );
  });

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: true
      },
      {
        option1: "zz",
        option2: false
      },
      {
        schema: {
          option2: ["boolean"]
        }
      }
    );
  });

  const err9 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: "true" // <-- because it's string
      },
      {
        option1: "zz",
        option2: false
      },
      {
        schema: {
          option2: ["boolean"]
        }
      }
    );
  });
  t.is(
    err9.message,
    'check-types-mini: opts.option2 was customised to "true" (string) which is not among the allowed types in schema (boolean)'
  );
});

test('04.05 - opts.schema values as strings + "whatever" keys', t => {
  const err1 = t.throws(() => {
    checkTypes(
      {
        option1: { somekey: "setting1" },
        option2: null
      },
      {
        option1: { somekey: "zz" },
        option2: "yy"
      }
    );
  });
  t.is(
    err1.message,
    'check-types-mini: opts.option2 was customised to "null" which is not string but null'
  );

  t.notThrows(() => {
    checkTypes(
      {
        option1: { somekey: "setting1" },
        option2: null
      },
      {
        option1: { somekey: "zz" },
        option2: "yy"
      },
      {
        schema: {
          option1: ["object", "string"],
          option2: ["whatever"]
        }
      }
    );
  });
  t.notThrows(() => {
    checkTypes(
      {
        option1: { somekey: "setting1" },
        option2: null
      },
      {
        option1: { somekey: "zz" },
        option2: "yy"
      },
      {
        schema: {
          option1: "object", // << observe it's a string, not an array
          option2: ["whatever"]
        }
      }
    );
  });

  const err2 = t.throws(() => {
    checkTypes(
      {
        option1: { somekey: "setting1" },
        option2: null
      },
      {
        option1: { somekey: "zz" },
        option2: "yy"
      },
      {
        schema: {
          option1: "string", // << will throw because this type is not followed
          option2: ["whatever"]
        }
      }
    );
  });
  t.truthy(
    err2.message.includes(
      'check-types-mini: opts.option1 was customised to "{"somekey":"setting1"}" (object) which is not among the allowed types in schema (string)'
    )
  );

  t.notThrows(() => {
    checkTypes(
      {
        option1: { somekey: "setting1" },
        option2: null
      },
      {
        option1: { somekey: "zz" },
        option2: "yy"
      },
      {
        schema: {
          option1: ["string", "any"], // <<< observe how "any" is among other types
          option2: "whatever" // also observe that it's not an array. Should work anyway!
        }
      }
    );
  });

  const err3 = t.throws(() => {
    checkTypes(
      {
        option1: { somekey: null },
        option2: "zz"
      },
      {
        option1: { somekey: "zz" },
        option2: "yy"
      },
      {
        schema: {
          option1: ["string", "any"], // option1 is set to "any" but its child option1.somekey is wrong.
          option2: "whatever" // also observe that it's not an array. Should work anyway!
        }
      }
    );
  });
  t.is(
    err3.message,
    'check-types-mini: opts.option1.somekey was customised to "null" which is not string but null'
  );
});

test("04.06 - opts.schema falling back to reference object", t => {
  // with throwing consequences:
  const err1 = t.throws(() => {
    checkTypes(
      {
        option1: { somekey: "setting1" },
        option2: null
      },
      {
        option1: "zz",
        option2: "yy"
      },
      {
        schema: {
          option1: "number"
        }
      }
    );
  });
  t.is(
    err1.message,
    'check-types-mini: opts.option1 was customised to "{"somekey":"setting1"}" (object) which is not among the allowed types in schema (number)'
  );

  // without throwing consequences:
  t.notThrows(() => {
    checkTypes(
      {
        option1: { somekey: "setting1" },
        option2: "zz"
      },
      {
        option1: { ww: "zz" },
        option2: "yy"
      },
      {
        schema: {
          option99: "number" // << that's useless, so falls back to reference object
        }
      }
    );
  });
});

test("04.07 - opts.schema is set to a wrong thing - throws", t => {
  const err1 = t.throws(() => {
    checkTypes(
      {
        option1: { somekey: "setting1" },
        option2: null
      },
      {
        option1: "zz",
        option2: "yy"
      },
      {
        schema: "zzz"
      }
    );
  });
  t.truthy(err1.message.includes("zzz"));

  const err2 = t.throws(() => {
    checkTypes(
      {
        option1: { somekey: "setting1" },
        option2: null
      },
      {
        option1: "zz",
        option2: "yy"
      },
      {
        schema: null
      }
    );
  });
  t.is(
    err2.message,
    'check-types-mini: opts.schema was customised to "null" which is not object but null'
  );
});

test.only("delete me", t => {
  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: ["setting2"]
      },
      {
        option1: "zz"
      },
      {
        acceptArrays: true,
        schema: {
          option2: "string"
        }
      }
    );
  });
});

test("04.08 - opts.schema understands opts.acceptArrays", t => {
  const err1 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: ["setting2"]
      },
      {
        option1: "zz",
        option2: "yy"
      }
    );
  }); // throws because reference's type mismatches.
  t.is(
    err1.message,
    'check-types-mini: opts.option2 was customised to "["setting2"]" which is not string but array'
  );

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: ["setting2"]
      },
      {
        option1: "zz",
        option2: "yy"
      },
      {
        acceptArrays: true
      }
    );
  }); // does not throw because of opts.acceptArrays is matching against reference
  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: ["setting2"]
      },
      {
        option1: "zz"
      },
      {
        acceptArrays: true,
        schema: {
          option2: "string"
        }
      }
    );
  }); // does not throw because of opts.acceptArrays is matching against schema's keys

  const err2 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: ["setting2", 999]
      },
      {
        option1: "zz"
      },
      {
        acceptArrays: true,
        schema: {
          option2: "string"
        }
      }
    );
  }); // throws because schema and opts.acceptArrays detects wrong type within input's array
  t.truthy(err2.message.includes("zzz"));

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: ["setting2", 999]
      },
      {
        option1: "zz"
      },
      {
        acceptArrays: true,
        schema: {
          option2: ["string", "number"]
        }
      }
    );
  }); // number is allowed now

  const err3 = t.throws(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: ["setting2", 999]
      },
      {
        option1: "zz"
      },
      {
        acceptArrays: false,
        schema: {
          option2: ["string", "number"]
        }
      }
    );
  }); // number is allowed in schema, but not in an array, and opts.acceptArrays is off, so throws
  t.truthy(err3.message.includes("zzz"));

  t.notThrows(() => {
    checkTypes(
      {
        option1: "setting1",
        option2: ["setting2", 999]
      },
      {
        option1: "zz"
      },
      {
        acceptArrays: false,
        schema: {
          option2: ["string", "number", "array"]
        }
      }
    );
  }); // does not throw because blanked permission for array's is on.
  // it might be array of rubbish though, so that's a faulty, short-sighted type check.
});

test("04.09 - ad-hoc #1", t => {
  const err1 = t.throws(() => {
    checkTypes(
      {
        heads: "%%_",
        tails: "_%%",
        headsNoWrap: "%%-",
        tailsNoWrap: "-%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "",
        wrapTailsWith: false, // <--------------------  !!!
        dontWrapVars: [],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
        noSingleMarkers: false,
        resolveToBoolIfAnyValuesContainBool: true,
        resolveToFalseIfAnyValuesContainBool: true,
        throwWhenNonStringInsertedInString: false
      },
      {
        heads: "%%_",
        tails: "_%%",
        headsNoWrap: "%%-",
        tailsNoWrap: "-%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "",
        wrapTailsWith: "", // <--------------------  !!!
        dontWrapVars: [],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
        noSingleMarkers: false,
        resolveToBoolIfAnyValuesContainBool: true,
        resolveToFalseIfAnyValuesContainBool: true,
        throwWhenNonStringInsertedInString: false
      },
      {
        msg: "json-variables/jsonVariables(): [THROW_ID_04*]",
        schema: {
          headsNoWrap: ["string", "null", "undefined"],
          tailsNoWrap: ["string", "null", "undefined"]
        }
      }
    );
  }, 'json-variables/jsonVariables(): [THROW_ID_04*]: opts.wrapTailsWith was customised to "false" which is not string but boolean');
  t.is(
    err1.message,
    'json-variables/jsonVariables(): [THROW_ID_04*]: opts.wrapTailsWith was customised to "false" which is not string but boolean'
  );
});
