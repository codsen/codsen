import tap from "tap";
import checkTypes from "../dist/check-types-mini.esm";

tap.test(
  `01.01 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - when all/first args are missing`,
  (t) => {
    t.throws(() => {
      checkTypes();
    }, /THROW_ID_01/);
    t.end();
  }
);

tap.test(
  `01.02 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - when one of the arguments is of a wrong type`,
  (t) => {
    t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: "false",
          option3: false,
        },
        {
          option1: "setting1",
          option2: false,
          option3: false,
        }
      );
    }, /not boolean but string/g);

    // with opts.enforceStrictKeyset === false
    t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: "false",
          option3: false,
        },
        {
          option1: "setting1",
          option2: false,
          option3: false,
        },
        {
          enforceStrictKeyset: false,
        }
      );
    }, /not boolean but string/g);
    t.end();
  }
);

tap.test(
  `01.03 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - opts.msg or opts.optsVarName args are wrong-type`,
  (t) => {
    t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: "setting2",
          option3: false,
        },
        {
          option1: "setting1",
          option2: "setting2",
          option3: false,
        },
        {
          msg: "zzz",
          optsVarName: 1,
        }
      );
    }, /not string but number/g);

    t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: "setting2",
          option3: false,
        },
        {
          option1: "setting1",
          option2: "setting2",
          option3: false,
        },
        {
          msg: 1,
          optsVarName: "zzz",
        }
      );
    }, /opts\.msg/g);
    t.end();
  }
);

tap.test(
  `01.04 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - if fourth argument is missing`,
  (t) => {
    t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: "false",
          option3: false,
        },
        {
          option1: "setting1",
          option2: false,
          option3: false,
        },
        {
          msg: "newLibrary/index.js [THROW_ID_01]", // << no trailing space
        }
      );
    }, /THROW_ID_01/g);

    t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: "false",
          option3: false,
        },
        {
          option1: "setting1",
          option2: false,
          option3: false,
        },
        {
          msg: "newLibrary/index.js [THROW_ID_01]:        ", // << trailing space
        }
      );
    }, /THROW_ID_01/g);

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: "false",
          option3: false,
        },
        {
          option1: "setting1",
          option2: false,
          option3: false,
        },
        {
          msg: "newLibrary/index.js [THROW_ID_01]: ",
          ignoreKeys: ["option2"],
        }
      );
    });
    t.end();
  }
);

tap.test(
  `01.05 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - when opts are set wrong`,
  (t) => {
    t.doesNotThrow(() => {
      checkTypes(
        { somekey: "a" },
        { somekey: "b" },
        {
          msg: "aa",
          optsVarName: "bbb",
          ignoreKeys: false,
        }
      );
    });

    t.throws(() => {
      checkTypes(
        { somekey: "a" },
        { somekey: "b" },
        {
          msg: 1,
          optsVarName: "bbb",
          ignoreKeys: false,
        }
      );
    }, /not string but number/);

    t.doesNotThrow(() => {
      checkTypes(
        { somekey: "a" },
        { somekey: "b" },
        {
          msg: "aa",
          optsVarName: "bbb",
          ignoreKeys: "a",
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        { somekey: "a" },
        { somekey: "b" },
        {
          msg: "aa",
          optsVarName: "bbb",
          ignoreKeys: "",
        }
      );
    });

    t.end();
  }
);

tap.test(
  `01.06 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - nested options`,
  (t) => {
    t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: "setting2",
          option3: {
            aaa: {
              bbb: true, // should be text, not Bool
            },
          },
        },
        {
          option1: "setting1",
          option2: "setting2",
          option3: {
            aaa: {
              bbb: "a",
            },
          },
        }
      );
    }, /opts\.option3\.aaa\.bbb was customised to/);

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: "setting2",
          option3: {},
        },
        {
          option1: "setting1",
          option2: "setting2",
          option3: {
            aaa: true,
          },
        }
      );
    });

    t.end();
  }
);

tap.test(
  `01.07 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - opts.ignorePaths`,
  (t) => {
    // control:
    t.throws(() => {
      checkTypes(
        {
          aaa: {
            bbb: "a",
          },
          ccc: {
            bbb: "d",
          },
        },
        {
          aaa: {
            bbb: true,
          },
          ccc: {
            bbb: "d",
          },
        },
        {
          msg: "msg",
          optsVarName: "OPTS",
          ignoreKeys: false,
          ignorePaths: null,
          acceptArraysIgnore: null,
        }
      );
    }, /OPTS\.aaa\.bbb was customised to /);

    // for a reference, let's see what will "ignoreKeys" against "bbb" do:
    t.doesNotThrow(() => {
      checkTypes(
        {
          aaa: {
            bbb: "a", // <---- should be Boolean
          },
          ccc: {
            bbb: "d", // <---- should be Boolean too
          },
        },
        {
          aaa: {
            bbb: true,
          },
          ccc: {
            bbb: true,
          },
        },
        {
          msg: "msg",
          optsVarName: "OPTS",
          ignoreKeys: "bbb", // <-------- string, not array, but that's fine
        }
      );
    });

    // paths ignored - given as array:
    t.throws(() => {
      checkTypes(
        {
          aaa: {
            bbb: "a",
          },
          ccc: {
            bbb: "d",
          },
        },
        {
          aaa: {
            bbb: true,
          },
          ccc: {
            bbb: true,
          },
        },
        {
          msg: "msg",
          optsVarName: "OPTS",
          ignorePaths: ["aaa.bbb"], // <----- array.
        }
      );
    }, /OPTS\.ccc\.bbb was customised to/g);

    t.doesNotThrow(() => {
      checkTypes(
        {
          aaa: {
            bbb: "a",
          },
          ccc: {
            bbb: "d",
          },
        },
        {
          aaa: {
            bbb: true,
          },
          ccc: {
            bbb: "",
          },
        },
        {
          msg: "msg",
          optsVarName: "OPTS",
          ignorePaths: "aaa.bbb", // <----- string.
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          aaa: {
            bbb: "a",
          },
          ccc: {
            bbb: "d",
          },
        },
        {
          aaa: {
            bbb: true,
          },
          ccc: {
            bbb: "",
          },
        },
        {
          msg: "msg",
          optsVarName: "OPTS",
          ignorePaths: ["aaa.bbb"], // <----- array.
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          aaa: {
            bbb: "a",
          },
          ccc: {
            bbb: "d",
          },
        },
        {
          aaa: {
            bbb: true,
          },
          ccc: {
            bbb: "",
          },
        },
        {
          msg: "msg",
          optsVarName: "OPTS",
          ignorePaths: "aaa.*", // <----- with glob, string.
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          aaa: {
            bbb: "a",
          },
          ccc: {
            bbb: "d",
          },
        },
        {
          aaa: {
            bbb: true,
          },
          ccc: {
            bbb: "",
          },
        },
        {
          msg: "msg",
          optsVarName: "OPTS",
          ignorePaths: ["aaa.*"], // <----- with glob, array.
        }
      );
    });

    // paths ignored - given as string:
    t.throws(() => {
      checkTypes(
        {
          aaa: {
            bbb: "a",
          },
          ccc: {
            bbb: "d",
          },
        },
        {
          aaa: {
            bbb: true,
          },
          ccc: {
            bbb: true,
          },
        },
        {
          msg: "msg",
          optsVarName: "OPTS",
          ignorePaths: "aaa.bbb", // <----- string. Should be same thing tho.
        }
      );
    }, 'msg: OPTS.ccc.bbb was customised to "d" which is not boolean but string');

    t.doesNotThrow(() => {
      checkTypes(
        {
          aaa: {
            bbb: "a",
          },
          ccc: {
            bbb: "d",
          },
        },
        {
          aaa: {
            bbb: true,
          },
          ccc: {
            bbb: true,
          },
        },
        {
          msg: "msg",
          optsVarName: "OPTS",
          ignorePaths: ["aaa.bbb", "ccc.bbb"], // <----- both ignored
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          aaa: {
            bbb: "a",
          },
          bbb: "zzz",
          ccc: {
            bbb: "d",
          },
        },
        {
          aaa: {
            bbb: true,
          },
          bbb: "",
          ccc: {
            bbb: true,
          },
        },
        {
          msg: "msg",
          optsVarName: "OPTS",
          ignorePaths: ["aaa.bbb", "ccc.bbb"], // <----- both ignored
        }
      );
    });

    t.end();
  }
);

tap.test(
  `01.08 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - opts.ignorePaths with wildcards`,
  (t) => {
    // paths ignored - given as string:
    t.throws(() => {
      checkTypes(
        {
          aaa: {
            bbb: "a",
          },
          ccc: {
            bbb: "d",
          },
        },
        {
          aaa: {
            bbb: true,
          },
          ccc: {
            bbb: true,
          },
        },
        {
          msg: "msg",
          optsVarName: "OPTS",
          ignorePaths: "aaa.*", // <----- string, not string in an array
        }
      );
    }, 'msg: OPTS.ccc.bbb was customised to "d" which is not boolean but string');

    // paths ignored - given as array:
    t.throws(() => {
      checkTypes(
        {
          aaa: {
            bbb: "a",
          },
          ccc: {
            bbb: "d",
          },
        },
        {
          aaa: {
            bbb: true,
          },
          ccc: {
            bbb: true,
          },
        },
        {
          msg: "msg",
          optsVarName: "OPTS",
          ignorePaths: ["aaa.*"], // <----- array
        }
      );
    }, 'msg: OPTS.ccc.bbb was customised to "d" which is not boolean but string');

    // paths ignored - given as string:
    t.doesNotThrow(() => {
      checkTypes(
        {
          aaa: {
            bbb: "a",
          },
          ccc: {
            bbb: "d",
          },
        },
        {
          aaa: {
            bbb: true,
            zzz: "whatever",
          },
          ccc: {
            bbb: true,
            this_key_should_throw: "as well",
          },
        },
        {
          msg: "msg",
          optsVarName: "OPTS",
          ignorePaths: ["aaa.*", "ccc.*"], // <------ both ignored
        }
      );
    });

    t.end();
  }
);

tap.test(
  `01.09 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - opts.ignoreKeys with wildcards not referenced by schema/reference obj.`,
  (t) => {
    // the control
    t.throws(() => {
      checkTypes(
        {
          www1: "yyy",
          www2: "zzz",
        },
        {
          aaa: "bbb",
          ccc: "ddd",
        },
        {
          msg: "msg",
          optsVarName: "OPTS",
        }
      );
    }, "msg: The input object has keys which are not covered by the reference object: www1, www2");

    // the bizness
    // default mode is Strict, opts.enforceStrictKeyset = true by default, so
    // even though "www1" and "www2" will be bailed out, the check-types-mini will
    // ask, WTF are the keys "aaa" and "ccc":
    t.throws(() => {
      checkTypes(
        {
          www1: "yyy",
          www2: "zzz",
        },
        {
          aaa: "bbb",
          ccc: "ddd",
        },
        {
          msg: "msg",
          optsVarName: "OPTS",
          ignoreKeys: "www*",
        }
      );
    }, "msg: The reference object has keys which are not present in the input object: aaa, ccc");
    // and it will throw the question at you.

    // but if we turn off Strict mode, no more throws:
    t.doesNotThrow(() => {
      checkTypes(
        {
          www1: "yyy",
          www2: "zzz",
        },
        {
          aaa: "bbb",
          ccc: "ddd",
        },
        {
          msg: "msg",
          optsVarName: "OPTS",
          ignoreKeys: "www*",
          enforceStrictKeyset: false,
        }
      );
    });

    t.end();
  }
);

tap.test(
  `01.10 - ${`\u001b[${31}m${`throws`}\u001b[${39}m`} - some keys bailed through ignoreKeys, some through ignorePaths and as a result it does not throw`,
  (t) => {
    // the control:
    t.throws(() => {
      checkTypes(
        {
          aaa: {
            bbb: "ccc",
          },
          ddd: {
            eee: "fff",
          },
        },
        {
          aaa: {
            bbb: false,
          },
          ddd: {
            eee: false,
          },
        },
        {
          msg: "msg",
        }
      );
    }, 'msg: opts.aaa.bbb was customised to "ccc" which is not boolean but string');

    // bail the "aaa.bbb" via "ignoreKeys"
    t.throws(() => {
      checkTypes(
        {
          aaa: {
            bbb: "ccc",
          },
          ddd: {
            eee: "fff", // <----- ddd.eee fill cause a throw now
          },
        },
        {
          aaa: {
            bbb: false,
          },
          ddd: {
            eee: false,
          },
        },
        {
          msg: "msg",
          ignoreKeys: "bbb",
        }
      );
    }, 'msg: opts.ddd.eee was customised to "fff" which is not boolean but string');

    // bail the "aaa.bbb" via "opts.ignoreKeys" and "ddd.eee" via "opts.ignorePaths"
    t.doesNotThrow(() => {
      checkTypes(
        {
          aaa: {
            bbb: "ccc",
          },
          ddd: {
            eee: "fff", // <----- ddd.eee fill cause a throw now
          },
        },
        {
          aaa: {
            bbb: false,
          },
          ddd: {
            eee: false,
          },
        },
        {
          msg: "msg",
          ignoreKeys: "bbb",
          ignorePaths: "ddd.eee",
        }
      );
    });

    // just to make sure options can fail too:
    t.throws(() => {
      checkTypes(
        {
          aaa: {
            bbb: "ccc",
          },
          ddd: {
            eee: "fff",
          },
        },
        {
          aaa: {
            bbb: false,
          },
          ddd: {
            eee: false,
          },
        },
        {
          msg: "msg",
          ignoreKeys: "zzz", // <------ unused key name
          ignorePaths: "ddd.yyy", // <-- unused path
        }
      );
    });

    t.end();
  }
);

// ======================
// 02. Arrays
// ======================

tap.test(
  `02.01 - ${`\u001b[${33}m${`arrays`}\u001b[${39}m`} - opts.acceptArrays, strings+arrays`,
  (t) => {
    const err1 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: ["setting3", "setting4"],
          option3: false,
        },
        {
          option1: "setting1",
          option2: "setting2",
          option3: false,
        }
      );
    });
    t.ok(
      err1.message.includes(
        'check-types-mini: opts.option2 was customised to "["setting3","setting4"]" which is not string but array'
      )
    );

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: ["setting3", "setting4"],
          option3: false,
        },
        {
          option1: "setting1",
          option2: "setting2",
          option3: false,
        },
        {
          msg: "message",
          optsVarName: "varname",
          acceptArrays: true,
        }
      );
    });

    const err2 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: ["setting3", true, "setting4"],
          option3: false,
        },
        {
          option1: "setting1",
          option2: "setting2",
          option3: false,
        },
        {
          msg: "message",
          optsVarName: "varname",
          acceptArrays: true,
        }
      );
    });
    t.equal(
      err2.message,
      "message: varname.option2 was customised to be array, but not all of its elements are string-type"
    );
    t.end();
  }
);

tap.test(
  `02.02 - ${`\u001b[${33}m${`arrays`}\u001b[${39}m`} - opts.acceptArrays, Booleans+arrays`,
  (t) => {
    const err1 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: [true, true],
          option3: false,
        },
        {
          option1: "setting1",
          option2: false,
          option3: false,
        }
      );
    });
    t.equal(
      err1.message,
      'check-types-mini: opts.option2 was customised to "[true,true]" which is not boolean but array'
    );

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: [true, true],
          option3: false,
        },
        {
          option1: "setting1",
          option2: false,
          option3: false,
        },
        {
          msg: "message",
          optsVarName: "varname",
          acceptArrays: true,
        }
      );
    });

    const err2 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: [true, true, 1],
          option3: false,
        },
        {
          option1: "setting1",
          option2: false,
          option3: false,
        },
        {
          msg: "message",
          optsVarName: "varname",
          acceptArrays: true,
        }
      );
    });
    t.ok(
      err2.message.includes(
        "message: varname.option2 was customised to be array, but not all of its elements are boolean-type"
      )
    );

    const err3 = t.throws(() => {
      checkTypes(
        {
          option1: [1, 0, 1, 0],
          option2: [true, true],
          option3: false,
        },
        {
          option1: 0,
          option2: false,
          option3: false,
        },
        {
          msg: "test: [THROW_ID_01]",
          optsVarName: "opts",
          acceptArrays: "this string will cause the throw",
          acceptArraysIgnore: [],
        }
      );
    });
    t.equal(
      err3.message,
      'check-types-mini: opts.acceptArrays was customised to "this string will cause the throw" which is not boolean but string'
    );

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: [1, 0, 1, 0],
          option2: [true, true],
          option3: false,
        },
        {
          option1: 0,
          option2: false,
          option3: false,
        },
        {
          msg: "test: [THROW_ID_01]",
          optsVarName: "opts",
          acceptArrays: true,
          acceptArraysIgnore: [],
        }
      );
    });

    t.end();
  }
);

tap.test(
  `02.03 - ${`\u001b[${33}m${`arrays`}\u001b[${39}m`} - opts.acceptArraysIgnore`,
  (t) => {
    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: [1, 0, 1, 0],
          option2: [true, true],
          option3: false,
        },
        {
          option1: 0,
          option2: false,
          option3: false,
        },
        {
          msg: "test: [THROW_ID_01]",
          optsVarName: "opts",
          acceptArrays: true,
          acceptArraysIgnore: [],
        }
      );
    });

    const err1 = t.throws(() => {
      checkTypes(
        {
          option1: [1, 0, 1, 0],
          option2: [true, true],
          option3: false,
        },
        {
          option1: 0,
          option2: false,
          option3: false,
        },
        {
          msg: "test: [THROW_ID_01]",
          optsVarName: "opts",
          acceptArrays: true,
          acceptArraysIgnore: ["zzz", "option1"],
        }
      );
    });
    t.ok(
      err1.message.includes(
        'test: [THROW_ID_01]: opts.option1 was customised to "[1,0,1,0]" which is not number but array'
      )
    );

    const err2 = t.throws(() => {
      checkTypes(
        {
          option1: [1, 0, 1, 0],
          option2: [true, true],
          option3: false,
        },
        {
          option1: 0,
          option2: false,
          option3: false,
        },
        {
          msg: "test: [THROW_ID_01]",
          optsVarName: "opts",
          acceptArrays: false,
          acceptArraysIgnore: ["zzz", "option1"],
        }
      );
    });
    t.ok(
      err2.message.includes(
        'test: [THROW_ID_01]: opts.option1 was customised to "[1,0,1,0]" which is not number but array'
      )
    );

    const err3 = t.throws(() => {
      checkTypes(
        {
          option1: [1, 0, 1, 0],
          option2: [true, true],
          option3: false,
        },
        {
          option1: 0,
          option2: false,
          option3: false,
        },
        {
          msg: "test: [THROW_ID_01]",
          optsVarName: "opts",
          acceptArrays: true,
          acceptArraysIgnore: true,
        }
      );
    });
    t.ok(
      err3.message.includes(
        'check-types-mini: opts.acceptArraysIgnore was customised to "true" which is not array but boolean'
      )
    );

    t.end();
  }
);

tap.test(
  `02.05 - ${`\u001b[${33}m${`arrays`}\u001b[${39}m`} - involving null values`,
  (t) => {
    const err = t.throws(() => {
      checkTypes(
        {
          key: 1,
          val: null,
          cleanup: true,
        },
        {
          key: null,
          val: null,
          cleanup: true,
        }
      );
    });
    t.equal(
      err.message,
      'check-types-mini: opts.key was customised to "1" which is not null but number'
    );

    t.end();
  }
);

tap.test(
  `02.06 - ${`\u001b[${33}m${`arrays`}\u001b[${39}m`} - throws/notThrows when keysets mismatch`,
  (t) => {
    t.throws(() => {
      checkTypes(
        {
          key: null,
          val: null,
          cleanup: true,
        },
        {
          key: null,
          val: null,
        }
      );
    });
    t.throws(() => {
      checkTypes(
        {
          key: null,
          val: null,
        },
        {
          key: null,
          val: null,
          cleanup: true,
        }
      );
    });
    t.doesNotThrow(() => {
      checkTypes(
        {
          key: null,
          val: null,
          cleanup: true,
        },
        {
          key: null,
          val: null,
        },
        {
          enforceStrictKeyset: false,
        }
      );
    });
    t.doesNotThrow(() => {
      checkTypes(
        {
          key: null,
          val: null,
        },
        {
          key: null,
          val: null,
          cleanup: true,
        },
        {
          enforceStrictKeyset: false,
        }
      );
    });

    t.end();
  }
);

tap.test(
  `02.07 - ${`\u001b[${33}m${`arrays`}\u001b[${39}m`} - opts.enforceStrictKeyset set to a wrong thing`,
  (t) => {
    t.throws(() => {
      checkTypes(
        {
          key: 1,
          val: null,
          cleanup: true,
        },
        {
          key: null,
          val: null,
          cleanup: true,
        },
        {
          enforceStrictKeyset: 1,
        }
      );
    });

    t.end();
  }
);

tap.test(
  `02.08 - ${`\u001b[${33}m${`arrays`}\u001b[${39}m`} - throws when reference and schema are both missing`,
  (t) => {
    t.throws(() => {
      checkTypes(
        {
          key: 1,
          val: null,
          cleanup: true,
        },
        {}
      );
    });

    t.end();
  }
);

tap.test(
  `02.09 - ${`\u001b[${33}m${`arrays`}\u001b[${39}m`} - acceptArrays + schema + nested`,
  (t) => {
    // control

    t.doesNotThrow(() => {
      checkTypes(
        {
          opt1: "aaa",
          opt2: {
            opt3: "bbb",
          },
        },
        {
          opt1: "zzz",
          opt2: {},
        },
        {
          acceptArrays: false, // <--------
          schema: {
            "opt2.opt3": "string",
          },
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          opt1: "aaa",
          opt2: {
            opt3: "bbb",
          },
        },
        {
          opt1: "zzz",
          opt2: {},
        },
        {
          acceptArrays: true, // <--------
          schema: {
            "opt2.opt3": "string",
          },
        }
      );
    });

    // the value opt2.opt3 is missing from ref but given in schema. Parent key,
    // opt2, is present in ref.
    const err1 = t.throws(() => {
      checkTypes(
        {
          opt1: "aaa",
          opt2: {
            opt3: ["bbb"],
          },
        },
        {
          // <---- ref object
          opt1: "zzz",
          opt2: {},
        },
        {
          acceptArrays: false,
          schema: {
            "opt2.opt3": "string",
          },
        }
      );
    });
    // throws because schema and opts.acceptArrays detects wrong type within input's array
    t.match(err1.message, /opts.opt2.opt3 was customised to/gi);
    // error message mentions array:
    t.match(err1.message, /array/gi);
    // error message mentions string:
    t.match(err1.message, /string/gi);

    t.doesNotThrow(() => {
      checkTypes(
        {
          opt1: "aaa",
          opt2: {
            opt3: ["bbb"],
          },
        },
        {
          opt1: "zzz",
          opt2: {},
        },
        {
          acceptArrays: true,
          schema: {
            "opt2.opt3": "string",
          },
        }
      );
    });

    const err2 = t.throws(() => {
      checkTypes(
        {
          opt1: "aaa",
          opt2: {
            opt3: ["bbb", 999],
          },
        },
        {
          opt1: "zzz",
          opt2: {},
        },
        {
          acceptArrays: true,
          schema: {
            "opt2.opt3": "string",
          },
        }
      );
    }); // throws because schema and opts.acceptArrays detects wrong type within input's array
    t.match(err2.message, /opts.opt2.opt3.1, the/gi);
    t.match(err2.message, /number/gi);
    t.match(err2.message, /string/gi);

    t.end();
  }
);

tap.test(
  `02.10 - ${`\u001b[${33}m${`arrays`}\u001b[${39}m`} - enforceStrictKeyset and nested inputs`,
  (t) => {
    const err1 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: "setting2",
          rogueKey: {
            rogueSubkey: false,
          },
        },
        {
          option1: "zz",
          option2: "yy",
          rogueKey: {},
        }
      );
    });
    t.match(
      err1.message,
      /check-types-mini: opts\.rogueKey\.rogueSubkey is neither covered by reference object \(second input argument\), nor opts\.schema/g
    );

    t.end();
  }
);

tap.test(
  `02.11 - ${`\u001b[${33}m${`arrays`}\u001b[${39}m`} - strict mode, customising keys`,
  (t) => {
    // default mode (strict) - root level

    // it should not throw because this is typical scenario: array keys are given,
    // but necessarily they will be on defaults. However, strict mode is on to
    // prevent any rogue keys and enforce correct values.
    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "aaa",
          ignoreThese: ["zzz", "yyy"], // <----
          option2: false,
        },
        {
          option1: "aaa",
          ignoreThese: [], // <---- defaults come empty
          option2: false,
        },
        {
          enforceStrictKeyset: true,
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "aaa",
          ignoreThese: ["zzz", "yyy"], // <----
          option2: false,
        },
        {
          option1: "aaa",
          ignoreThese: [], // <---- defaults come empty
          option2: false,
        },
        {
          enforceStrictKeyset: false,
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "aaa",
          ignoreThese: { here: ["zzz", "yyy"] }, // <---- same, just nested
          option2: false,
        },
        {
          option1: "aaa",
          ignoreThese: { here: [] }, // <---- defaults come empty here too
          option2: false,
        },
        {
          enforceStrictKeyset: false,
        }
      );
    });
    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "aaa",
          ignoreThese: { here: ["zzz", "yyy"] }, // <---- same, just nested
          option2: false,
        },
        {
          option1: "aaa",
          ignoreThese: { here: [] }, // <---- defaults come empty here too
          option2: false,
        },
        {
          enforceStrictKeyset: true,
        }
      );
    });

    const err = t.throws(() => {
      checkTypes(
        {
          option1: "aaa",
          ignoreThese: [{ a: "zzz" }, { a: "yyy" }], // <----
          option2: false,
        },
        {
          option1: "aaa",
          ignoreThese: [{ a: "" }], // <---- defaults come empty
          option2: false,
        },
        {
          enforceStrictKeyset: true,
        }
      );
    });
    t.match(
      err.message,
      /check-types-mini: opts\.ignoreThese\.1 is neither covered by reference object/g
    );

    t.end();
  }
);

// ======================
// 03. opts.enforceStrictKeyset
// ======================

tap.test(
  `03.01 - ${`\u001b[${32}m${`opts.acceptArrays`}\u001b[${39}m`} - strings + arrays`,
  (t) => {
    t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: "setting2",
          rogueKey: false,
        },
        {
          option1: "zz",
          option2: "yy",
        }
      );
    });
    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: "setting2",
          rogueKey: false,
        },
        {
          option1: "zz",
          option2: "yy",
        },
        {
          enforceStrictKeyset: false,
        }
      );
    });

    t.end();
  }
);

// ======================
// 04. opts.schema
// ======================

tap.test(
  `04.01 - ${`\u001b[${36}m${`opts.schema`}\u001b[${39}m`} only - located in root`,
  (t) => {
    const err1 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: null,
        },
        {
          option1: "zz",
          option2: "yy",
        }
      );
    });
    t.match(err1.message, /opts.option2 was customised to/gi);
    t.match(err1.message, /string/gi);
    t.match(err1.message, /null/gi);

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: null,
        },
        {
          option1: "zz",
          option2: "yy",
        },
        {
          schema: {
            option2: ["stRing", null],
          },
        }
      );
    });

    const err2 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: null,
        },
        {
          option1: "zz",
          option2: "yy",
        },
        {
          schema: {
            option2: ["string", "boolean"],
          },
        }
      );
    });
    t.match(err2.message, /opts\.option2 was customised to "null"/gi);

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: null,
        },
        null, // << reference object is completely omitted!!!
        {
          schema: {
            option1: "String",
            option2: ["stRing", null],
          },
        }
      );
    });

    const err3 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: null,
        },
        null,
        {
          schema: {
            // <<< notice how option1 is missing AND also missing in reference obj
            option2: ["stRing", null],
          },
        }
      );
    });
    t.match(
      err3.message,
      /opts\.enforceStrictKeyset is on and the following key/gi
    );
    t.match(err3.message, /option1/gi);

    // true not allowed, - only false or null or string
    const err4 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: true,
        },
        {
          option1: "zz",
          option2: null,
        },
        {
          schema: {
            option2: ["null", "false", "string"],
          },
        }
      );
    });
    t.match(err4.message, /opts\.option2 was customised to "true"/gi);
    t.match(err4.message, /boolean/gi);
    t.match(err4.message, /null/gi);
    t.match(err4.message, /false/gi);

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: false,
        },
        {
          option1: "zz",
          option2: null,
        },
        {
          schema: {
            option2: ["null", "false", "string"],
          },
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: null,
        },
        {
          option1: "zz",
          option2: false,
        },
        {
          schema: {
            option2: ["null", "false", "string"],
          },
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: "zzz",
        },
        {
          option1: "zz",
          option2: null,
        },
        {
          schema: {
            option2: ["null", "false", "string"],
          },
        }
      );
    });

    // second bunch

    // true or string
    const err5 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: false,
        },
        {
          option1: "zz",
          option2: true,
        },
        {
          schema: {
            option2: ["true", "string"],
          },
        }
      );
    });
    t.match(
      err5.message,
      /check-types-mini: opts\.option2 was customised to "false" \(type: boolean\)/gi
    );

    const err6 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: null,
        },
        {
          option1: "zz",
          option2: true,
        },
        {
          schema: {
            option2: ["true", "string"],
          },
        }
      );
    });
    t.match(
      err6.message,
      /check-types-mini: opts\.option2 was customised to "null"/gi
    );

    const err7 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: 0,
        },
        {
          option1: "zz",
          option2: true,
        },
        {
          schema: {
            option2: ["true", "string"],
          },
        }
      );
    });
    t.match(
      err7.message,
      /check-types-mini: opts\.option2 was customised to "0"/
    );

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: "zzz",
        },
        {
          option1: "zz",
          option2: true,
        },
        {
          schema: {
            option2: ["true", "string"],
          },
        }
      );
    });

    const err8 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: "zzz",
        },
        {
          option1: "zz",
          option2: true,
        },
        {
          schema: {
            option2: ["true"],
          },
        }
      );
    });
    t.match(
      err8.message,
      /check-types-mini: opts\.option2 was customised to "zzz"/gi
    );

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: true,
        },
        {
          option1: "zz",
          option2: true,
        },
        {
          schema: {
            option2: ["true"],
          },
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: true,
        },
        {
          option1: "zz",
          option2: true,
        },
        {
          schema: {
            option2: ["boolean"],
          },
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: false,
        },
        {
          option1: "zz",
          option2: false,
        },
        {
          schema: {
            option2: ["false"],
          },
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: false,
        },
        {
          option1: "zz",
          option2: false,
        },
        {
          schema: {
            option2: ["boolean"],
          },
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: true,
        },
        {
          option1: "zz",
          option2: false,
        },
        {
          schema: {
            option2: ["boolean"],
          },
        }
      );
    });

    const err9 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: "true", // <-- because it's string
        },
        {
          option1: "zz",
          option2: false,
        },
        {
          schema: {
            option2: ["boolean"],
          },
        }
      );
    });
    t.match(
      err9.message,
      /check-types-mini: opts\.option2 was customised to "true" \(type: string\)/gi
    );

    t.end();
  }
);

tap.test(
  `04.02 - ${`\u001b[${36}m${`opts.schema`}\u001b[${39}m`} only - deeper level key doesn't even exist in ref`,
  (t) => {
    const err1 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: {
            option3: null,
          },
        },
        {
          option1: "zz",
          option2: null,
        }
      );
    });
    t.equal(
      err1.message,
      'check-types-mini: opts.option2 was customised to "{"option3":null}" which is not null but object'
    );

    const err2 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: {
            option3: "null",
          },
        },
        {
          option1: "zz",
          option2: {
            option3: null,
          },
        }
      );
    });
    t.equal(
      err2.message,
      'check-types-mini: opts.option2.option3 was customised to "null" which is not null but string'
    );

    const err3 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: {
            option3: null,
          },
        },
        {
          option1: "zz",
          option2: {
            option3: "null",
          },
        }
      );
    });
    t.equal(
      err3.message,
      'check-types-mini: opts.option2.option3 was customised to "null" which is not string but null'
    );

    t.end();
  }
);

tap.test(
  `04.03 - ${`\u001b[${36}m${`opts.schema`}\u001b[${39}m`} only - deeper level key type mismatches but is allowed through a schema`,
  (t) => {
    // control - make it throw:

    const err = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: {
            option3: null,
          },
        },
        {
          option1: "zz",
          option2: { option3: "yy" },
        },
        {
          schema: {
            option1: ["stRing"],
          },
        }
      );
    });
    t.equal(
      err.message,
      'check-types-mini: opts.option2.option3 was customised to "null" which is not string but null'
    );

    // now prove that schema works:

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: {
            option3: null,
          },
        },
        {
          option1: "zz",
          option2: { option3: "yy" },
        },
        {
          schema: {
            "option2.option3": ["stRing", null],
          },
        }
      );
    });

    t.end();
  }
);

tap.test(
  `04.04 - ${`\u001b[${36}m${`opts.schema`}\u001b[${39}m`} only - located deeper`,
  (t) => {
    const err2 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: { option3: null },
        },
        {
          option1: "zz",
          option2: { option3: "yy" },
        },
        {
          schema: {
            "option2.option3": ["string", "boolean"],
          },
        }
      );
    });
    t.match(
      err2.message,
      /check-types-mini: opts\.option2\.option3 was customised to "null" \(type: null\)/gi
    );

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: { option3: null },
        },
        null, // << reference object is completely omitted!!!
        {
          schema: {
            option1: "strinG",
            option2: "objecT",
            "option2.option3": ["stRing", null],
          },
        }
      );
    });

    const err3 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: { option3: null },
        },
        null,
        {
          schema: {
            // <<< notice how option1 is missing AND also missing in reference obj
            "option2.option3": ["stRing", null],
          },
        }
      );
    });
    t.equal(
      err3.message,
      "check-types-mini: opts.enforceStrictKeyset is on and the following keys are not covered by schema and/or reference objects: option1, option2"
    );

    // make error message mention a missing deeper-level path:
    const err32 = t.throws(() => {
      checkTypes(
        {
          option1: { option2: "setting1" },
          option3: { option4: null },
        },
        null,
        {
          schema: {
            option1: "object", // option1.option2 is missing!
            option3: "object",
            "option3.option4": ["stRing", null],
          },
        }
      );
    });
    t.match(
      err32.message,
      /check-types-mini: opts\.option1\.option2 is neither covered by reference object/gi
    );

    // true not allowed, - only false or null or string
    const err4 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: true,
        },
        {
          option1: "zz",
          option2: null,
        },
        {
          schema: {
            option2: ["null", "false", "string"],
          },
        }
      );
    });
    t.match(
      err4.message,
      /check-types-mini: opts\.option2 was customised to "true" \(type: boolean\)/gi
    );

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: false,
        },
        {
          option1: "zz",
          option2: null,
        },
        {
          schema: {
            option2: ["null", "false", "string"],
          },
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: null,
        },
        {
          option1: "zz",
          option2: false,
        },
        {
          schema: {
            option2: ["null", "false", "string"],
          },
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: "zzz",
        },
        {
          option1: "zz",
          option2: null,
        },
        {
          schema: {
            option2: ["null", "false", "string"],
          },
        }
      );
    });

    // second bunch

    // true or string
    const err5 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: false,
        },
        {
          option1: "zz",
          option2: true,
        },
        {
          schema: {
            option2: ["true", "string"],
          },
        }
      );
    });
    t.match(
      err5.message,
      /check-types-mini: opts\.option2 was customised to "false" \(type: boolean\)/gi
    );

    const err6 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: null,
        },
        {
          option1: "zz",
          option2: true,
        },
        {
          schema: {
            option2: ["true", "string"],
          },
        }
      );
    });
    t.match(
      err6.message,
      /check-types-mini: opts\.option2 was customised to "null" \(type: null\)/gi
    );

    const err7 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: 0,
        },
        {
          option1: "zz",
          option2: true,
        },
        {
          schema: {
            option2: ["true", "string"],
          },
        }
      );
    });
    t.match(
      err7.message,
      /check-types-mini: opts\.option2 was customised to "0" \(type: number\)/gi
    );

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: "zzz",
        },
        {
          option1: "zz",
          option2: true,
        },
        {
          schema: {
            option2: ["true", "string"],
          },
        }
      );
    });

    const err8 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: "zzz",
        },
        {
          option1: "zz",
          option2: true,
        },
        {
          schema: {
            option2: ["true"],
          },
        }
      );
    });
    t.match(
      err8.message,
      /check-types-mini: opts\.option2 was customised to "zzz" \(type: string\)/gi
    );

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: true,
        },
        {
          option1: "zz",
          option2: true,
        },
        {
          schema: {
            option2: ["true"],
          },
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: true,
        },
        {
          option1: "zz",
          option2: true,
        },
        {
          schema: {
            option2: ["boolean"],
          },
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: false,
        },
        {
          option1: "zz",
          option2: false,
        },
        {
          schema: {
            option2: ["false"],
          },
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: false,
        },
        {
          option1: "zz",
          option2: false,
        },
        {
          schema: {
            option2: ["boolean"],
          },
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: true,
        },
        {
          option1: "zz",
          option2: false,
        },
        {
          schema: {
            option2: ["boolean"],
          },
        }
      );
    });

    const err9 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: "true", // <-- because it's string
        },
        {
          option1: "zz",
          option2: false,
        },
        {
          schema: {
            option2: ["boolean"],
          },
        }
      );
    });
    t.match(
      err9.message,
      /check-types-mini: opts\.option2 was customised to "true" \(type: string\)/gi
    );

    t.end();
  }
);

tap.test(
  `04.05 - ${`\u001b[${36}m${`opts.schema`}\u001b[${39}m`} values as strings + "whatever" keys`,
  (t) => {
    const err1 = t.throws(() => {
      checkTypes(
        {
          option1: { somekey: "setting1" },
          option2: null,
        },
        {
          option1: { somekey: "zz" },
          option2: "yy",
        }
      );
    });
    t.equal(
      err1.message,
      'check-types-mini: opts.option2 was customised to "null" which is not string but null'
    );

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: { somekey: "setting1" },
          option2: null,
        },
        {
          option1: { somekey: "zz" },
          option2: "yy",
        },
        {
          schema: {
            option1: ["object", "string"],
            option2: ["whatever"],
          },
        }
      );
    });
    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: { somekey: "setting1" },
          option2: null,
        },
        {
          option1: { somekey: "zz" },
          option2: "yy",
        },
        {
          schema: {
            option1: "object", // << observe it's a string, not an array
            option2: ["whatever"],
          },
        }
      );
    });

    const err2 = t.throws(() => {
      checkTypes(
        {
          option1: { somekey: "setting1" },
          option2: null,
        },
        {
          option1: { somekey: "zz" },
          option2: "yy",
        },
        {
          schema: {
            option1: "string", // << will throw because this type is not followed
            option2: ["whatever"],
          },
        }
      );
    });
    t.match(
      err2.message,
      /check-types-mini: opts\.option1 was customised to "{"somekey":"setting1"}" \(type: object\)/gi
    );

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: { somekey: "setting1" },
          option2: null,
        },
        {
          option1: { somekey: "zz" },
          option2: "yy",
        },
        {
          schema: {
            option1: ["string", "any"], // <<< observe how "any" is among other types
            option2: "whatever", // also observe that it's not an array. Should work anyway!
          },
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: { somekey: null },
          option2: "zz",
        },
        {
          option1: { somekey: "zz" },
          option2: "yy",
        },
        {
          schema: {
            option1: ["string", "any"], // option1 is set to "any" but its child option1.somekey is wrong.
            option2: "whatever", // also observe that it's not an array. Should work anyway!
          },
        }
      );
    });

    t.end();
  }
);

tap.test(
  `04.06 - ${`\u001b[${36}m${`opts.schema`}\u001b[${39}m`} falling back to reference object`,
  (t) => {
    // with throwing consequences:
    const err1 = t.throws(() => {
      checkTypes(
        {
          option1: { somekey: "setting1" },
          option2: null,
        },
        {
          option1: "zz",
          option2: "yy",
        },
        {
          schema: {
            option1: "number",
          },
        }
      );
    });
    t.match(
      err1.message,
      /check-types-mini: opts\.option1 was customised to "{"somekey":"setting1"}" \(type: object\)/gi
    );

    // without throwing consequences:
    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: { somekey: "setting1" },
          option2: "zz",
        },
        {
          option1: { somekey: "zz" },
          option2: "yy",
        },
        {
          schema: {
            option99: "number", // << that's useless, so falls back to reference object
          },
        }
      );
    });

    t.end();
  }
);

tap.test(
  `04.07 - ${`\u001b[${36}m${`opts.schema`}\u001b[${39}m`} is set to a wrong thing - throws`,
  (t) => {
    const err1 = t.throws(() => {
      checkTypes(
        {
          option1: { somekey: "setting1" },
          option2: null,
        },
        {
          option1: "zz",
          option2: "yy",
        },
        {
          schema: "zzz",
        }
      );
    });
    t.ok(err1.message.includes("zzz"));

    const err2 = t.throws(() => {
      checkTypes(
        {
          option1: { somekey: "setting1" },
          option2: null,
        },
        {
          option1: "zz",
          option2: "yy",
        },
        {
          schema: null,
        }
      );
    });
    t.equal(
      err2.message,
      'check-types-mini: opts.schema was customised to "null" which is not object but null'
    );

    t.end();
  }
);

tap.test(
  `04.08 - ${`\u001b[${36}m${`opts.schema`}\u001b[${39}m`} understands opts.acceptArrays`,
  (t) => {
    const err1 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: ["setting2"],
        },
        {
          option1: "zz",
          option2: "yy",
        }
      );
    }); // throws because reference's type mismatches.
    t.equal(
      err1.message,
      'check-types-mini: opts.option2 was customised to "["setting2"]" which is not string but array'
    );

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: ["setting2"],
        },
        {
          option1: "zz",
          option2: "yy",
        },
        {
          acceptArrays: true,
        }
      );
    }); // does not throw because of opts.acceptArrays is matching against reference
    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: ["setting2"],
        },
        {
          option1: "zz",
        },
        {
          acceptArrays: true,
          schema: {
            option2: "string",
          },
        }
      );
    }); // does not throw because of opts.acceptArrays is matching against schema's keys

    const err2 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: ["setting2", 999],
        },
        {
          option1: "zz",
        },
        {
          acceptArrays: true,
          schema: {
            option2: "string",
          },
        }
      );
    }); // throws because schema and opts.acceptArrays detects wrong type within input's array
    t.equal(
      err2.message,
      "check-types-mini: opts.option2.1, the 1th element (equal to 999) is of a type number, but only the following are allowed by the opts.schema: string"
    );

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: ["setting2", 999],
        },
        {
          option1: "zz",
        },
        {
          acceptArrays: true,
          schema: {
            option2: ["string", "number"],
          },
        }
      );
    }); // number is allowed now

    const err3 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: ["setting2", 999],
        },
        {
          option1: "zz",
        },
        {
          acceptArrays: false,
          schema: {
            option2: ["string", "number"],
          },
        }
      );
    }); // number is allowed in schema, but not in an array, and opts.acceptArrays is off, so throws
    t.match(
      err3.message,
      /check-types-mini: opts\.option2 was customised to "\["setting2",999\]" \(type: array\)/gi
    );

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: ["setting2", 999],
        },
        {
          option1: "zz",
        },
        {
          acceptArrays: false,
          schema: {
            option2: ["string", "number", "array"],
          },
        }
      );
    }); // does not throw because blanked permission for array's is on.
    // it might be array of rubbish though, so that's a faulty, short-sighted type check.

    t.end();
  }
);

tap.test(`04.09 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} #1`, (t) => {
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
        throwWhenNonStringInsertedInString: false,
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
        throwWhenNonStringInsertedInString: false,
      },
      {
        msg: "json-variables/jsonVariables(): [THROW_ID_04*]",
        schema: {
          headsNoWrap: ["string", "null", "undefined"],
          tailsNoWrap: ["string", "null", "undefined"],
        },
      }
    );
  }, 'json-variables/jsonVariables(): [THROW_ID_04*]: opts.wrapTailsWith was customised to "false" which is not string but boolean');
  t.equal(
    err1.message,
    'json-variables/jsonVariables(): [THROW_ID_04*]: opts.wrapTailsWith was customised to "false" which is not string but boolean'
  );

  t.end();
});

tap.test(
  `04.10 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} #2 - enforcing first-level key types but ignoring sub-level values`,
  (t) => {
    // root level "placeholder" gets flagged up, deeper levels given in "ignorePaths"
    // don't even matter.
    const err1 = t.throws(() => {
      checkTypes(
        {
          placeholder: {},
        },
        {
          placeholder: false,
        },
        {
          msg: "json-comb-core/getKeyset(): [THROW_ID_10*]",
          ignorePaths: ["placeholder.*"],
          schema: {
            placeholder: ["null", "number", "string", "boolean"], // <--- no object here!
          },
        }
      );
    });
    t.match(err1.message, /THROW_ID_10\*/g, "04.10.01");

    // adding "object" in schema stops the throws:
    t.doesNotThrow(() => {
      checkTypes(
        {
          placeholder: {},
        },
        {
          placeholder: false,
        },
        {
          msg: "json-comb-core/getKeyset(): [THROW_ID_10*]",
          ignorePaths: ["placeholder.*"],
          schema: {
            placeholder: ["null", "number", "string", "boolean", "object"], // <--- added object here!
          },
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          placeholder: {
            a: {
              b: "c",
            },
          },
        },
        {
          placeholder: false,
        },
        {
          msg: "json-comb-core/getKeyset(): [THROW_ID_10*]",
          ignorePaths: ["placeholder.*"],
          schema: {
            placeholder: ["null", "number", "string", "boolean", "object"],
          },
        }
      );
    });

    t.end();
  }
);

tap.test(
  `04.11 - ${`\u001b[${35}m${`opts.schema`}\u001b[${39}m`} type "any" applies to all deeper levels`,
  (t) => {
    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: { somekey: { anotherlevel: "setting1" } },
          option2: null,
        },
        {
          option1: { somekey: "zz" },
          option2: "yy",
        },
        {
          schema: {
            option1: "any", // <------ !
            option2: "whatever",
          },
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: { somekey: { anotherlevel: "setting1" } },
          option2: null,
        },
        {
          option1: { somekey: "zz" },
          option2: "yy",
        },
        {
          schema: {
            "option1.somekey": "any", // <------ !
            option2: "whatever",
          },
        }
      );
    });

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: { somekey: { anotherlevel: "setting1" } },
          option2: null,
        },
        {
          option1: { somekey: "zz" },
          option2: "yy",
        },
        {
          schema: {
            option1: { somekey: "any" }, // <------ !
            option2: "whatever",
          },
        }
      );
    });

    t.end();
  }
);

tap.test(
  `04.12 - ${`\u001b[${35}m${`opts.schema`}\u001b[${39}m`} key's value is "undefined" literal, it's in schema`,
  (t) => {
    const err2 = t.throws(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: undefined,
        },
        {
          option1: "zz",
          option2: "yy",
        },
        {
          schema: {
            option2: ["string", "boolean"],
          },
        }
      );
    });
    t.match(err2.message, /opts\.option2 was customised to "undefined"/gi);

    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: undefined,
        },
        null, // << reference object is completely omitted!!!
        {
          schema: {
            option1: "String",
            option2: ["null", "undefined"],
          },
        }
      );
    });
    t.doesNotThrow(() => {
      checkTypes(
        {
          option1: "setting1",
          option2: null,
        },
        null, // << reference object is completely omitted!!!
        {
          schema: {
            option1: "String",
            option2: ["null", "undefined"],
          },
        }
      );
    });

    t.end();
  }
);
