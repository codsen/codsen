import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { checkTypesMini } from "../dist/check-types-mini.esm.js";

test(`01 - when all/first args are missing`, () => {
  throws(
    () => {
      checkTypesMini();
    },
    /THROW_ID_01/,
    "01.01"
  );
});

test(`02 - when one of the arguments is of a wrong type`, () => {
  throws(
    () => {
      checkTypesMini(
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
    },
    /not boolean but string/g,
    "02.01"
  );

  // with opts.enforceStrictKeyset === false
  throws(
    () => {
      checkTypesMini(
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
    },
    /not boolean but string/g,
    "02.02"
  );
});

test(`03`, () => {
  throws(
    () => {
      checkTypesMini(
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
    },
    /THROW_ID_01/g,
    "03.01"
  );

  throws(
    () => {
      checkTypesMini(
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
    },
    /THROW_ID_01/g,
    "03.02"
  );

  not.throws(() => {
    checkTypesMini(
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
  }, "03.03");
});

test(`04 - when opts are set wrong`, () => {
  not.throws(() => {
    checkTypesMini(
      { somekey: "a" },
      { somekey: "b" },
      {
        msg: "aa",
        optsVarName: "bbb",
        ignoreKeys: "a",
      }
    );
  }, "04.01");

  not.throws(() => {
    checkTypesMini(
      { somekey: "a" },
      { somekey: "b" },
      {
        msg: "aa",
        optsVarName: "bbb",
        ignoreKeys: "",
      }
    );
  }, "04.02");
});

test(`05 - nested options`, () => {
  throws(
    () => {
      checkTypesMini(
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
    },
    /opts\.option3\.aaa\.bbb was customised to/,
    "05.01"
  );

  not.throws(() => {
    checkTypesMini(
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
  }, "05.02");
});

test(`06 - opts.ignorePaths`, () => {
  // for a reference, let's see what will "ignoreKeys" against "bbb" do:
  not.throws(() => {
    checkTypesMini(
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
  }, "06.01");

  // paths ignored - given as array:
  throws(
    () => {
      checkTypesMini(
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
    },
    /OPTS\.ccc\.bbb was customised to/g,
    "06.01"
  );

  not.throws(() => {
    checkTypesMini(
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
  }, "06.03");

  not.throws(() => {
    checkTypesMini(
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
  }, "06.04");

  not.throws(() => {
    checkTypesMini(
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
  }, "06.05");

  not.throws(() => {
    checkTypesMini(
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
  }, "06.06");

  // paths ignored - given as string:
  throws(
    () => {
      checkTypesMini(
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
    },
    'msg: OPTS.ccc.bbb was customised to "d" which is not boolean but string',
    "06.02"
  );

  not.throws(() => {
    checkTypesMini(
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
  }, "06.08");

  not.throws(() => {
    checkTypesMini(
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
  }, "06.09");
});

test(`07 - opts.ignorePaths with wildcards`, () => {
  // paths ignored - given as string:
  throws(
    () => {
      checkTypesMini(
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
    },
    'msg: OPTS.ccc.bbb was customised to "d" which is not boolean but string',
    "07.01"
  );

  // paths ignored - given as array:
  throws(
    () => {
      checkTypesMini(
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
    },
    'msg: OPTS.ccc.bbb was customised to "d" which is not boolean but string',
    "07.02"
  );

  // paths ignored - given as string:
  not.throws(() => {
    checkTypesMini(
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
  }, "07.03");
});

test(`08 - opts.ignoreKeys with wildcards not referenced by schema/reference obj.`, () => {
  // the control
  throws(
    () => {
      checkTypesMini(
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
    },
    "msg: The input object has keys which are not covered by the reference object: www1, www2",
    "08.01"
  );

  // the bizness
  // default mode is Strict, opts.enforceStrictKeyset = true by default, so
  // even though "www1" and "www2" will be bailed out, the check-types-mini will
  // ask, WTF are the keys "aaa" and "ccc":
  throws(
    () => {
      checkTypesMini(
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
    },
    "msg: The reference object has keys which are not present in the input object: aaa, ccc",
    "08.02"
  );
  // and it will throw the question at you.

  // but if we turn off Strict mode, no more throws:
  not.throws(() => {
    checkTypesMini(
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
  }, "08.03");
});

test(`09 - some keys bailed through ignoreKeys, some through ignorePaths and as a result it does not throw`, () => {
  // the control:
  throws(
    () => {
      checkTypesMini(
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
    },
    'msg: opts.aaa.bbb was customised to "ccc" which is not boolean but string',
    "09.01"
  );

  // bail the "aaa.bbb" via "ignoreKeys"
  throws(
    () => {
      checkTypesMini(
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
    },
    'msg: opts.ddd.eee was customised to "fff" which is not boolean but string',
    "09.02"
  );

  // bail the "aaa.bbb" via "opts.ignoreKeys" and "ddd.eee" via "opts.ignorePaths"
  not.throws(() => {
    checkTypesMini(
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
  }, "09.03");

  // just to make sure options can fail too:
  throws(
    () => {
      checkTypesMini(
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
    },
    "09.04",
    "09.03"
  );
});

// ======================
// 02. Arrays
// ======================

test(`10 - opts.acceptArrays, strings+arrays`, () => {
  throws(
    () => {
      checkTypesMini(
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
    },
    /opts.option2 was customised/,
    "10.01"
  );

  not.throws(() => {
    checkTypesMini(
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
  }, "10.02");

  throws(
    () => {
      checkTypesMini(
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
    },
    /varname.option2 was customised to be array/,
    "10.02"
  );
});

test(`11 - opts.acceptArrays, Booleans+arrays`, () => {
  throws(
    () => {
      checkTypesMini(
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
    },
    /opts.option2 was customised to "\[true,true\]"/,
    "11.01"
  );
});

test(`12`, () => {
  not.throws(() => {
    checkTypesMini(
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
  }, "12.01");
});

test(`13`, () => {
  throws(
    () => {
      checkTypesMini(
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
    },
    /varname\.option2 was customised to be array/,
    "13.01"
  );
});

test(`14`, () => {
  not.throws(() => {
    checkTypesMini(
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
  }, "14.01");
});

test(`15 - opts.acceptArraysIgnore`, () => {
  not.throws(() => {
    checkTypesMini(
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
  }, "15.01");

  throws(
    () => {
      checkTypesMini(
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
    },
    /\[THROW_ID_01\]/,
    "15.01"
  );

  throws(
    () => {
      checkTypesMini(
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
    },
    /opts\.option1 was customised to "\[1,0,1,0\]"/,
    "15.02"
  );
});

test(`16 - involving null values`, () => {
  throws(
    () => {
      checkTypesMini(
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
    },
    /opts.key was customised to "1"/,
    "16.01"
  );
});

test(`17 - throws/notThrows when keysets mismatch`, () => {
  throws(
    () => {
      checkTypesMini(
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
    },
    "17.01",
    "17.01"
  );
  throws(
    () => {
      checkTypesMini(
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
    },
    "17.02",
    "17.02"
  );
  not.throws(() => {
    checkTypesMini(
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
  }, "17.03");
  not.throws(() => {
    checkTypesMini(
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
  }, "17.04");
});

test(`18 - opts.enforceStrictKeyset set to a wrong thing`, () => {
  throws(
    () => {
      checkTypesMini(
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
    },
    "18.01",
    "18.01"
  );
});

test(`19 - throws when reference and schema are both missing`, () => {
  throws(
    () => {
      checkTypesMini(
        {
          key: 1,
          val: null,
          cleanup: true,
        },
        {}
      );
    },
    "19.01",
    "19.01"
  );
});

test(`20 - acceptArrays + schema + nested`, () => {
  // control

  not.throws(() => {
    checkTypesMini(
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
  }, "20.01");

  not.throws(() => {
    checkTypesMini(
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
  }, "20.02");

  // the value opt2.opt3 is missing from ref but given in schema. Parent key,
  // opt2, is present in ref.
  throws(
    () => {
      checkTypesMini(
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
    },
    /opts\.opt2\.opt3 was customised to/,
    "20.01"
  );

  not.throws(() => {
    checkTypesMini(
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
  }, "20.04");

  throws(
    () => {
      checkTypesMini(
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
    },
    /opts\.opt2\.opt3\.1/,
    "20.02"
  ); // throws because schema and opts.acceptArrays detects wrong type within input's array
});

test(`21 - enforceStrictKeyset and nested inputs`, () => {
  throws(
    () => {
      checkTypesMini(
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
    },
    /rogueSubkey is neither covered by reference object/,
    "21.01"
  );
});

test(`22 - strict mode, customising keys`, () => {
  // default mode (strict) - root level

  // it should not throw because this is typical scenario: array keys are given,
  // but necessarily they will be on defaults. However, strict mode is on to
  // prevent any rogue keys and enforce correct values.
  not.throws(() => {
    checkTypesMini(
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
  }, "22.01");

  not.throws(() => {
    checkTypesMini(
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
  }, "22.02");

  not.throws(() => {
    checkTypesMini(
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
  }, "22.03");
  not.throws(() => {
    checkTypesMini(
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
  }, "22.04");

  throws(
    () => {
      checkTypesMini(
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
    },
    /opts\.ignoreThese\.1 is neither covered by reference object/,
    "22.01"
  );
});

// ======================
// 03. opts.enforceStrictKeyset
// ======================

test(`23 - ${`\u001b[${32}m${`opts.acceptArrays`}\u001b[${39}m`} - strings + arrays`, () => {
  throws(
    () => {
      checkTypesMini(
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
    },
    "23.01",
    "23.01"
  );
  not.throws(() => {
    checkTypesMini(
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
  }, "23.02");
});

// ======================
// opts.schema
// ======================

test(`24 - ${`\u001b[${36}m${`opts.schema`}\u001b[${39}m`} only - located in root`, () => {
  throws(
    () => {
      checkTypesMini(
        {
          option1: "setting1",
          option2: null,
        },
        {
          option1: "zz",
          option2: "yy",
        }
      );
    },
    /opts.option2 was customised to/,
    "24.01"
  );

  not.throws(() => {
    checkTypesMini(
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
  }, "24.02");

  throws(
    () => {
      checkTypesMini(
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
    },
    /opts\.option2 was customised to "null"/,
    "24.02"
  );

  not.throws(() => {
    checkTypesMini(
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
  }, "24.04");

  throws(
    () => {
      checkTypesMini(
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
    },
    /opts\.enforceStrictKeyset is on and the following key/,
    "24.03"
  );

  // true not allowed, - only false or null or string
  throws(
    () => {
      checkTypesMini(
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
    },
    /opts\.option2 was customised to "true"/,
    "24.04"
  );

  not.throws(() => {
    checkTypesMini(
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
  }, "24.07");

  not.throws(() => {
    checkTypesMini(
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
  }, "24.08");

  not.throws(() => {
    checkTypesMini(
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
  }, "24.09");

  // second bunch

  // true or string
  throws(
    () => {
      checkTypesMini(
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
    },
    /check-types-mini: opts\.option2 was customised to "false" \(type: boolean\)/,
    "24.05"
  );

  throws(
    () => {
      checkTypesMini(
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
    },
    /check-types-mini: opts\.option2 was customised to "null"/,
    "24.06"
  );

  throws(
    () => {
      checkTypesMini(
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
    },
    /check-types-mini: opts\.option2 was customised to "0"/,
    "24.07"
  );

  not.throws(() => {
    checkTypesMini(
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
  }, "24.13");

  throws(
    () => {
      checkTypesMini(
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
    },
    /check-types-mini: opts\.option2 was customised to "zzz"/,
    "24.08"
  );

  not.throws(() => {
    checkTypesMini(
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
  }, "24.15");

  not.throws(() => {
    checkTypesMini(
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
  }, "24.16");

  not.throws(() => {
    checkTypesMini(
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
  }, "24.17");

  not.throws(() => {
    checkTypesMini(
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
  }, "24.18");

  not.throws(() => {
    checkTypesMini(
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
  }, "24.19");

  throws(
    () => {
      checkTypesMini(
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
    },
    /check-types-mini: opts\.option2 was customised to "true" \(type: string\)/,
    "24.09"
  );
});

test(`25 - ${`\u001b[${36}m${`opts.schema`}\u001b[${39}m`} only - deeper level key doesn't even exist in ref`, () => {
  throws(
    () => {
      checkTypesMini(
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
    },
    "25.01",
    "25.01"
  );

  throws(
    () => {
      checkTypesMini(
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
    },
    /check-types-mini: opts\.option2.option3 was customised to "null" which is not null but string/,
    "25.02"
  );

  throws(
    () => {
      checkTypesMini(
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
    },
    /check-types-mini: opts\.option2\.option3 was customised to "null" which is not string but null/,
    "25.03"
  );
});

test(`26 - ${`\u001b[${36}m${`opts.schema`}\u001b[${39}m`} only - deeper level key type mismatches but is allowed through a schema`, () => {
  // control - make it throw:

  throws(
    () => {
      checkTypesMini(
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
    },
    /check-types-mini: opts\.option2\.option3 was customised to "null" which is not string but null/,
    "26.01"
  );

  // now prove that schema works:

  not.throws(() => {
    checkTypesMini(
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
  }, "26.02");
});

test(`27 - ${`\u001b[${36}m${`opts.schema`}\u001b[${39}m`} only - located deeper`, () => {
  throws(
    () => {
      checkTypesMini(
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
    },
    /check-types-mini: opts\.option2\.option3 was customised to "null" \(type: null\)/,
    "27.01"
  );

  not.throws(() => {
    checkTypesMini(
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
  }, "27.02");

  throws(
    () => {
      checkTypesMini(
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
    },
    /option1, option2/,
    "27.02"
  );

  // make error message mention a missing deeper-level path:
  throws(
    () => {
      checkTypesMini(
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
    },
    /check-types-mini: opts\.option1\.option2 is neither covered by reference object/,
    "27.03"
  );

  // true not allowed, - only false or null or string
  throws(
    () => {
      checkTypesMini(
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
    },
    /check-types-mini: opts\.option2 was customised to "true" \(type: boolean\)/,
    "27.04"
  );

  not.throws(() => {
    checkTypesMini(
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
  }, "27.06");

  not.throws(() => {
    checkTypesMini(
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
  }, "27.07");

  not.throws(() => {
    checkTypesMini(
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
  }, "27.08");

  // second bunch

  // true or string
  throws(
    () => {
      checkTypesMini(
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
    },
    /check-types-mini: opts\.option2 was customised to "false" \(type: boolean\)/,
    "27.05"
  );

  throws(
    () => {
      checkTypesMini(
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
    },
    /check-types-mini: opts\.option2 was customised to "null" \(type: null\)/,
    "27.06"
  );

  throws(
    () => {
      checkTypesMini(
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
    },
    /check-types-mini: opts\.option2 was customised to "0" \(type: number\)/,
    "27.07"
  );

  not.throws(() => {
    checkTypesMini(
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
  }, "27.12");

  throws(
    () => {
      checkTypesMini(
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
    },
    /check-types-mini: opts\.option2 was customised to "zzz" \(type: string\)/,
    "27.08"
  );

  not.throws(() => {
    checkTypesMini(
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
  }, "27.14");

  not.throws(() => {
    checkTypesMini(
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
  }, "27.15");

  not.throws(() => {
    checkTypesMini(
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
  }, "27.16");

  not.throws(() => {
    checkTypesMini(
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
  }, "27.17");

  not.throws(() => {
    checkTypesMini(
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
  }, "27.18");

  throws(
    () => {
      checkTypesMini(
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
    },
    /check-types-mini: opts\.option2 was customised to "true" \(type: string\)/,
    "27.09"
  );
});

test(`28 - ${`\u001b[${36}m${`opts.schema`}\u001b[${39}m`} values as strings + "whatever" keys`, () => {
  throws(
    () => {
      checkTypesMini(
        {
          option1: { somekey: "setting1" },
          option2: null,
        },
        {
          option1: { somekey: "zz" },
          option2: "yy",
        }
      );
    },
    /opts.option2 was customised to "null" which is not string but null/,
    "28.01"
  );

  not.throws(() => {
    checkTypesMini(
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
  }, "28.02");
  not.throws(() => {
    checkTypesMini(
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
  }, "28.03");

  throws(
    () => {
      checkTypesMini(
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
    },
    /check-types-mini: opts\.option1 was customised to "{"somekey":"setting1"}" \(type: object\)/,
    "28.02"
  );

  not.throws(() => {
    checkTypesMini(
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
  }, "28.05");

  not.throws(() => {
    checkTypesMini(
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
  }, "28.06");
});

test(`29 - ${`\u001b[${36}m${`opts.schema`}\u001b[${39}m`} falling back to reference object`, () => {
  // with throwing consequences:
  throws(
    () => {
      checkTypesMini(
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
    },
    /check-types-mini: opts\.option1 was customised to "{"somekey":"setting1"}" \(type: object\)/,
    "29.01"
  );

  // without throwing consequences:
  not.throws(() => {
    checkTypesMini(
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
  }, "29.02");
});

test(`30 - ${`\u001b[${36}m${`opts.schema`}\u001b[${39}m`} is set to a wrong thing - throws`, () => {
  throws(
    () => {
      checkTypesMini(
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
    },
    /check-types-mini: opts\.schema was customised to "zzz" which is not object but string/,
    "30.01"
  );
});

test(`31 - ${`\u001b[${36}m${`opts.schema`}\u001b[${39}m`} understands opts.acceptArrays`, () => {
  throws(
    () => {
      checkTypesMini(
        {
          option1: "setting1",
          option2: ["setting2"],
        },
        {
          option1: "zz",
          option2: "yy",
        }
      );
    },
    /check-types-mini: opts.option2 was customised to "\["setting2"]" which is not string but array/,
    "31.01"
  ); // throws because reference's type mismatches.

  not.throws(() => {
    checkTypesMini(
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
  }, "31.02"); // does not throw because of opts.acceptArrays is matching against reference
  not.throws(() => {
    checkTypesMini(
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
  }, "31.03"); // does not throw because of opts.acceptArrays is matching against schema's keys

  throws(
    () => {
      checkTypesMini(
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
    },
    /opts\.option2\.1, the 1th element \(equal to 999\) is of a type number, but only the following are allowed by the opts\.schema: string/,
    "31.02"
  ); // throws because schema and opts.acceptArrays detects wrong type within input's array

  not.throws(() => {
    checkTypesMini(
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
  }, "31.05"); // number is allowed now

  throws(
    () => {
      checkTypesMini(
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
    },
    /check-types-mini: opts\.option2 was customised to "\["setting2",999\]" \(type: array\)/,
    "31.03"
  ); // number is allowed in schema, but not in an array, and opts.acceptArrays is off, so throws

  not.throws(() => {
    checkTypesMini(
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
  }, "31.07"); // does not throw because blanked permission for array's is on.
  // it might be array of rubbish though, so that's a faulty, short-sighted type check.
});

test(`32 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} #1`, () => {
  throws(
    () => {
      checkTypesMini(
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
    },
    /\[THROW_ID_04\*]/,
    "32.01"
  );
});

test(`33 - ${`\u001b[${35}m${`ad-hoc`}\u001b[${39}m`} #2 - enforcing first-level key types but ignoring sub-level values`, () => {
  // root level "placeholder" gets flagged up, deeper levels given in "ignorePaths"
  // don't even matter.
  throws(
    () => {
      checkTypesMini(
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
    },
    /THROW_ID_10\*/,
    "33.01"
  );

  // adding "object" in schema stops the throws:
  not.throws(() => {
    checkTypesMini(
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
  }, "33.02");

  not.throws(() => {
    checkTypesMini(
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
  }, "33.03");
});

test(`34 - ${`\u001b[${35}m${`opts.schema`}\u001b[${39}m`} type "any" applies to all deeper levels`, () => {
  not.throws(() => {
    checkTypesMini(
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
  }, "34.01");

  not.throws(() => {
    checkTypesMini(
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
  }, "34.02");

  not.throws(() => {
    checkTypesMini(
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
  }, "34.03");
});

test(`35 - ${`\u001b[${35}m${`opts.schema`}\u001b[${39}m`} key's value is "undefined" literal, it's in schema`, () => {
  throws(
    () => {
      checkTypesMini(
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
    },
    /opts\.option2 was customised to "undefined"/,
    "35.01"
  );

  not.throws(() => {
    checkTypesMini(
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
  }, "35.02");
  not.throws(() => {
    checkTypesMini(
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
  }, "35.03");
});

test.run();
