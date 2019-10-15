// avanotonly

import test from "ava";
import { set, del } from "../dist/edit-package-json.esm";
import objectPath from "object-path";

function setter(t, source, result, path, val, idNum, isInvalidJson = false) {
  // 01.
  t.is(
    set(source, path, val),
    result,
    `${idNum}.01 - string is identical after set`
  );

  // we can process invalid JSON too!
  if (!isInvalidJson) {
    // 02. parsed versions we just compared must be deep-equal
    t.deepEqual(
      JSON.parse(set(source, path, val)),
      JSON.parse(result),
      `${idNum}.02 - both parsed parties are deep-equal`
    );

    // 03. result is equivalent to (JSON.parse + object-path.set())
    const temp = JSON.parse(source);
    objectPath.set(temp, path, val);
    t.deepEqual(
      temp,
      JSON.parse(result),
      `${idNum}.03 - objectPath set is deep-equal`
    );
  }
}

function deleter(t, source, result, path, idNum) {
  // 01.
  t.is(
    del(source, path),
    result,
    `${idNum}.01 - string is identical after set`
  );

  // 02. compare parsed
  t.deepEqual(
    JSON.parse(del(source, path)),
    JSON.parse(result),
    `${idNum}.02 - both parsed parties are deep-equal`
  );

  // 03. if we did the deed manually, it would be the same if both were parsed
  const temp = JSON.parse(source);
  objectPath.del(temp, path);
  t.deepEqual(
    temp,
    JSON.parse(result),
    `${idNum}.03 - objectPath del is deep-equal`
  );
}

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - wrong/missing 1st arg = throw`, t => {
  // throw test pinning:
  const error1 = t.throws(() => {
    set();
  });
  t.regex(error1.message, /THROW_ID_01/);

  const error2 = t.throws(() => {
    set("");
  });
  t.regex(error2.message, /THROW_ID_01/);

  const error3 = t.throws(() => {
    set(null);
  });
  t.regex(error3.message, /THROW_ID_01/);

  const error4 = t.throws(() => {
    set(undefined);
  });
  t.regex(error4.message, /THROW_ID_01/);

  const error5 = t.throws(() => {
    set(true);
  });
  t.regex(error5.message, /THROW_ID_01/);
});

test(`01.02 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - ${`\u001b[${32}m${`del`}\u001b[${39}m`} - wrong/missing 1st arg = throw`, t => {
  // throw test pinning:
  const error1 = t.throws(() => {
    del();
  });
  t.regex(error1.message, /THROW_ID_02/);

  const error2 = t.throws(() => {
    del("");
  });
  t.regex(error2.message, /THROW_ID_02/);

  const error3 = t.throws(() => {
    del(null);
  });
  t.regex(error3.message, /THROW_ID_02/);

  const error4 = t.throws(() => {
    del(undefined);
  });
  t.regex(error4.message, /THROW_ID_02/);

  const error5 = t.throws(() => {
    del(true);
  });
  t.regex(error5.message, /THROW_ID_02/);
});

// -----------------------------------------------------------------------------
// 02. set - editing an existing key
// -----------------------------------------------------------------------------

test(`02.01 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - key in the root`, t => {
  const source = `{
  "a": "b",
  "c": "d"
}`;
  const result = `{
  "a": "b",
  "c": "e"
}`;
  setter(t, source, result, "c", "e", "02.01");
});

test(`02.02 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - key in the root`, t => {
  const source = `{
  "a": "b",
  "c": "d"
}`;
  const result = `{
  "a": "b",
  "c": "1"
}`;
  setter(t, source, result, "c", "1", "02.02");
});

test(`02.03 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - key in the root`, t => {
  const source = `{
  "a": "b",
  "c": "d"
}`;
  const result = `{
  "a": "b",
  "c": 1
}`;
  setter(t, source, result, "c", 1, "02.03");
});

test(`02.04 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - key in the root`, t => {
  const source = `{
  "a": "b",
  "c": "d"
}`;
  const result = `{
  "a": "b",
  "c": false
}`;
  setter(t, source, result, "c", false, "02.04");
});

test(`02.05 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - second level key`, t => {
  const source = `{
  "a": "b",
  "c": {
    "d": "e"
  }
}`;
  const result = `{
  "a": "b",
  "c": {
    "d": "f"
  }
}`;
  setter(t, source, result, "c.d", "f", "02.05");
});

test(`02.06 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - second level key`, t => {
  // notice deliberate mis-indentation after "d": "e"
  const source = `{
  "a": "b",
  "c": {
    "d": "e"
},
  "f": {
    "g": "h"
  }
}`;
  // notice deliberate mis-indentation after "d": "e"
  const result = `{
  "a": "b",
  "c": {
    "d": "e"
},
  "f": {
    "g": "i"
  }
}`;
  setter(t, source, result, "f.g", "i", "02.06");
});

test(`02.07 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - value is number`, t => {
  const source = `{
  "a": "b",
  "c": 1
}`;
  const result = `{
  "a": "b",
  "c": 0
}`;
  setter(t, source, result, "c", 0, "02.07");
});

test(`02.08 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - null overwritten with null`, t => {
  const source = `{
  "a": "b",
  "c": null
}`;
  const result = `{
  "a": "b",
  "c": null
}`;
  setter(t, source, result, "c", null, "02.08");
});

test(`02.09 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - value is object and it leads to contents end`, t => {
  const input = `{
  "a": "b",
  "x": {"y": "z"}
}`;
  const result = `{
  "a": "b",
  "x": {"y":"x"}
}`;
  setter(t, input, result, "x", { y: "x" }, "02.09");
});

test(`02.10 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - value is a stringified object - escapes`, t => {
  const input = `{
  "a": "b",
  "x": {"y": "z"}
}`;
  const result = `{
  "a": "b",
  "x": "{ y: \\"x\\" }"
}`;
  setter(t, input, result, "x", `{ y: "x" }`, "02.10");
});

test(`02.11 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - difficult characters 1`, t => {
  const input = `{
  "a": {
    "b": "}c"
}}`;
  const result = `{
  "a": "x"
}`;
  setter(t, input, result, "a", `x`, "02.11");
});

test(`02.12 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - difficult characters 2`, t => {
  const input = `{
  "a": {
    "b": "c '*.{d,e,f,g,md}' --write",
    "m": "n"
  }
}`;
  const result = `{
  "a": "x"
}`;
  setter(t, input, result, "a", `x`, "02.12");
});

test(`02.13 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - nested objects`, t => {
  const input = `{
  "a": {
    "b": {
      "c": "d"
    }
  }
}
`;
  const result = `{
  "a": "x"
}
`;
  setter(t, input, result, "a", `x`, "02.13");
});

test(`02.14 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - same-named key is passed through at deeper level while iterating`, t => {
  const input = `{
  "a": {
    "z": "x"
  },
  "z": {
    "k": false,
    "l": [
      "m"
    ],
    "n": true
  }
}
`;
  const result = `{
  "a": {
    "z": "x"
  },
  "z": "y"
}
`;
  setter(t, input, result, "z", `y`, "02.14");
});

test(`02.15 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - same-named key is passed through at deeper level while iterating`, t => {
  const input = `{
  "a": {
    "z": "x",
  },
  "z": {
    "k": false,
    "l": [
      "m"
    ],
    "n": true
  }
}
`;
  const result = `{
  "a": {
    "z": "x",
  },
  "z": "y"
}
`;
  setter(t, input, result, "z", `y`, "02.15", "invalid JSON");
});

test(`02.16 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - non-quoted value replaced with quoted`, t => {
  const input = `{
  "a": {
    "b": false
  }
}
`;
  const result = `{
  "a": {
    "b": "x"
  }
}
`;
  setter(t, input, result, "a.b", `x`, "02.16");
});

test(`02.17 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - non-quoted value replaced with non-quoted`, t => {
  const input = `{
  "a": {
    "b": false
  }
}
`;
  const result = `{
  "a": {
    "b": true
  }
}
`;
  setter(t, input, result, "a.b", true, "02.17");
});

test(`02.18 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - quoted value replaced with non-quoted`, t => {
  const input = `{
  "a": {
    "b": "c"
  }
}
`;
  const result = `{
  "a": {
    "b": true
  }
}
`;
  setter(t, input, result, "a.b", true, "02.18");
});

test(`02.19 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - value empty obj replaced with non-quoted`, t => {
  const input = `{
  "a": {
    "b": {}
  }
}
`;
  const result = `{
  "a": {
    "b": true
  }
}
`;
  setter(t, input, result, "a.b", true, "02.19");
});

test(`02.20 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - value empty obj replaced with non-quoted`, t => {
  const input = `{
  "a": {
    "b": []
  }
}
`;
  const result = `{
  "a": {
    "b": true
  }
}
`;
  setter(t, input, result, "a.b", true, "02.20");
});

test(`02.21 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - value empty obj replaced with non-quoted`, t => {
  const input = `{
  "a": {
    "b": {
      "c": []
    },
    "d": "e"
  }
}
`;
  const result = `{
  "a": {
    "b": {
      "c": []
    },
    "d": "x"
  }
}
`;
  setter(t, input, result, "a.d", "x", "02.21");
});

test(`02.22 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - value empty obj replaced with non-quoted`, t => {
  const input = `{
  "a": {
    "b": {
      "c": ["z"]
    },
    "d": "e"
  }
}
`;
  const result = `{
  "a": {
    "b": {
      "c": ["z"]
    },
    "d": "x"
  }
}
`;
  setter(t, input, result, "a.d", "x", "02.22");
});

// -----------------------------------------------------------------------------
// 03. set - key does not exist
// -----------------------------------------------------------------------------

// test(`03.01 - ${`\u001b[${32}m${`set`}\u001b[${39}m`} - ${`\u001b[${34}m${`non-existing path`}\u001b[${39}m`} - minimal example`, t => {
//   const source = `{
//   "a": "b",
//   "x": "y"
// }`;
//   const result = `{
//   "a": "b",
//   "x": "y",
//   "c": "e"
// }`;
//   setter(t, source, result, "c", "e", "03.01");
// });

// -----------------------------------------------------------------------------
// 04. adapted set() tests from object-path
// https://github.com/mariocasciaro/object-path
// MIT Licence, Copyright (c) 2015 Mario Casciaro
// -----------------------------------------------------------------------------

const testObj = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;

test(`04.01 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set the value using unicode key - value is number`, t => {
  const source = `{
  "15\u00f8C": {
    "3\u0111": 1
  }
}`;
  const result = `{
  "15\u00f8C": {
    "3\u0111": 2
  }
}`;
  setter(t, source, result, "15\u00f8C.3\u0111", 2, "04.01");
});

test(`04.02 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set the value using unicode key - value is string`, t => {
  const source = `{
  "15\u00f8C": {
    "3\u0111": "1"
  }
}`;
  const result = `{
  "15\u00f8C": {
    "3\u0111": "2"
  }
}`;
  setter(t, source, result, "15\u00f8C.3\u0111", "2", "04.02");
});

test(`04.03 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set the value using dot in key`, t => {
  const source = `{
  "a.b": {
    "looks.like": 1
  }
}`;
  const result = `{
  "a.b": {
    "looks.like": 2
  }
}`;
  setter(t, source, result, ["a.b", "looks.like"], 2, "04.03");
});

test(`04.04 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under shallow object`, t => {
  const input = `{
  "b": {
    "d": ["a"]
  },
  "j": {"k": "l"}
}`;
  const result = `{
  "b": {
    "d": ["a"]
  },
  "j": {"k":"x"}
}`;
  setter(t, input, result, "j", { k: "x" }, "04.04");
});

test(`04.05 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under shallow object`, t => {
  const input = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  },
  "j": {"k": "l"}
}`;
  const result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  },
  "j": {"k":"x"}
}`;
  setter(t, input, result, "j", { k: "x" }, "04.05");
});

test(`04.06 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under shallow object`, t => {
  const input = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  },
  "j": {"k": "l"}
}`;
  const result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  },
  "j": {"k":"x"}
}`;
  // path is array:
  setter(t, input, result, ["j"], { k: "x" }, "04.06");
});

// TODO
test(`04.07 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value using number path`, t => {
  const source = `{
  "a": "b",
  "b": {
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
  const result = `{
  "a": "b",
  "b": {
    "d": ["x", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
  // path is array:
  setter(t, source, result, "b.d.0", `x`, "04.07");
});

test(`04.08 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value using number path`, t => {
  const result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["x", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
  setter(t, testObj, result, "b.d.0", `x`, "04.08");
});

test(`04.09 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value using number path`, t => {
  // crop of test "should set value using number path", obj.b.d
  setter(t, `["a", "b"]`, `["x", "b"]`, 0, `x`, "04.09");
});

test(`04.10 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under deep object`, t => {
  const result = `{
  "a": "b",
  "b": {
    "c": "o",
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
  setter(t, testObj, result, "b.c", `o`, "04.10");
});

test(`04.11 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under deep object`, t => {
  const result = `{
  "a": "b",
  "b": {
    "c": "o",
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
  // quotes around "o" missing:
  setter(t, testObj, result, "b.c", `o`, "04.11");
});

test(`04.12 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under deep object`, t => {
  const result = `{
  "a": "b",
  "b": {
    "c": "o",
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
  setter(t, testObj, result, ["b", "c"], `o`, "04.12");
});

test(`04.13 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under deep object`, t => {
  const result = `{
  "a": "b",
  "b": {
    "c": "o",
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
  // quotes around "o" missing:
  setter(t, testObj, result, ["b", "c"], `o`, "04.13");
});

test(`04.14 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under array`, t => {
  const result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": null }],
    "f": "i"
  }
}`;
  // TODO: creates new keys
  // setter(t, testObj, result, "b.e.1.g", "f", "04.14");

  setter(t, testObj, result, "b.e.1.f", null, "04.14");
});

test(`04.15 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under array`, t => {
  const result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": null }],
    "f": "i"
  }
}`;
  // TODO: creates new keys
  // setter(t, testObj, result, "b.e.1.g", "f", "04.15");

  setter(t, testObj, result, ["b", "e", 1, "f"], null, "04.15");
});

test(`04.16 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - minimal case, arrays 1`, t => {
  const source = `{
  "a": [{}, { "b": "c" }]
}`;
  const result = `{
  "a": [{}, { "b": null }]
}`;
  setter(t, source, result, "a.1.b", null, "04.16");
});

test(`04.17 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - minimal case, arrays 2`, t => {
  const source = `{
  "a": [{ "b": "c" }]
}`;
  const result = `{
  "a": [{ "b": null }]
}`;
  setter(t, source, result, "a.0.b", null, "04.17");
});

test(`04.18 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - square bracket as value`, t => {
  const source = `{
  "a": "[",
  "k": {
    "lm": "1",
    "no": "2"
  }
}`;
  const result = `{
  "a": "[",
  "k": {
    "lm": "1",
    "no": "9"
  }
}`;
  setter(t, source, result, "k.no", "9", "04.18");
});

test(`04.19 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - curly bracket as value`, t => {
  const source = `{
  "a": "{",
  "k": {
    "lm": "1",
    "no": "2"
  }
}`;
  const result = `{
  "a": "{",
  "k": {
    "lm": "1",
    "no": "9"
  }
}`;
  setter(t, source, result, "k.no", "9", "04.19");
});

test(`04.20 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - curly bracket as value`, t => {
  const source = `{"a": {},"gh": {"mn": "1","yz": "-"}}`;
  const result = `{"a": {},"gh": {"mn": "1","yz": "x"}}`;
  setter(t, source, result, "gh.yz", "x", "04.20");
});

// -----------------------------------------------------------------------------
// 05. del - delete existing key
// -----------------------------------------------------------------------------

test(`05.01 - ${`\u001b[${33}m${`del`}\u001b[${39}m`} - ${`\u001b[${34}m${`existing path`}\u001b[${39}m`} - key in the root`, t => {
  const source = `{
  "a": "b",
  "c": "d"
}`;
  const result = `{
  "c": "d"
}`;
  deleter(t, source, result, "a", "05.01");
});

test(`05.02 - ${`\u001b[${33}m${`del`}\u001b[${39}m`} - ${`\u001b[${34}m${`existing path`}\u001b[${39}m`} - key in the root`, t => {
  const source = `{
  "a": "b",
  "c": "d"
}`;
  const result = `{
  "a": "b"
}`;
  deleter(t, source, result, "c", "05.02");
});

test(`05.03 - ${`\u001b[${33}m${`del`}\u001b[${39}m`} - ${`\u001b[${34}m${`existing path`}\u001b[${39}m`} - key in the root`, t => {
  const source = `{
  "a": "b",
  "c": "d",
  "e": "f"
}`;
  const result = `{
  "a": "b",
  "e": "f"
}`;
  deleter(t, source, result, "c", "05.03");
});

test(`05.04 - ${`\u001b[${33}m${`del`}\u001b[${39}m`} - ${`\u001b[${34}m${`existing path`}\u001b[${39}m`} - deletes the first array's element`, t => {
  const source = `{"qwe": [
  "ab",
  "cd",
  "ef"
]}`;
  const result = `{"qwe": [
  "cd",
  "ef"
]}`;
  deleter(t, source, result, "qwe.0", "05.04");
});

test(`05.05 - ${`\u001b[${33}m${`del`}\u001b[${39}m`} - ${`\u001b[${34}m${`existing path`}\u001b[${39}m`} - deletes the middle array's element`, t => {
  const source = `{"qwe": [
  "ab",
  "cd",
  "ef"
]}`;
  const result = `{"qwe": [
  "ab",
  "ef"
]}`;
  deleter(t, source, result, "qwe.1", "05.05");
});

test(`05.06 - ${`\u001b[${33}m${`del`}\u001b[${39}m`} - ${`\u001b[${34}m${`existing path`}\u001b[${39}m`} - deletes the last array's element`, t => {
  const source = `{"qwe": [
  "ab",
  "cd",
  "ef"
]}`;
  const result = `{"qwe": [
  "ab",
  "cd"
]}`;
  deleter(t, source, result, "qwe.2", "05.06");
});

test(`05.07 - ${`\u001b[${33}m${`del`}\u001b[${39}m`} - ${`\u001b[${34}m${`existing path`}\u001b[${39}m`} - deletes the first array's element`, t => {
  const source = `{"qwe": [
  true,
  "cd",
  "ef"
]}`;
  const result = `{"qwe": [
  "cd",
  "ef"
]}`;
  deleter(t, source, result, "qwe.0", "05.07");
});

test(`05.08 - ${`\u001b[${33}m${`del`}\u001b[${39}m`} - ${`\u001b[${34}m${`existing path`}\u001b[${39}m`} - deletes the middle array's element`, t => {
  const source = `{"qwe": [
  "ab",
  true,
  "ef"
]}`;
  const result = `{"qwe": [
  "ab",
  "ef"
]}`;
  deleter(t, source, result, "qwe.1", "05.08");
});

test(`05.09 - ${`\u001b[${33}m${`del`}\u001b[${39}m`} - ${`\u001b[${34}m${`existing path`}\u001b[${39}m`} - deletes the last array's element`, t => {
  const source = `{"qwe": [
  "ab",
  "cd",
  true
]}`;
  const result = `{"qwe": [
  "ab",
  "cd"
]}`;
  deleter(t, source, result, "qwe.2", "05.09");
});

test(`05.10 - ${`\u001b[${33}m${`del`}\u001b[${39}m`} - ${`\u001b[${34}m${`existing path`}\u001b[${39}m`} - dips to root level key before going to second branch`, t => {
  const source = `{
  "ab": {
    "cd": {
      "ef": "gh"
    }
  },
  "ij": {
    "kl": {
      "mn": [
        "op",
        "qr",
        "st"
      ],
      "uv": []
    }
  }
}`;
  const result = `{
  "ab": {
    "cd": {
      "ef": "gh"
    }
  },
  "ij": {
    "kl": {
      "mn": [
        "op",
        "qr"
      ],
      "uv": []
    }
  }
}`;
  deleter(t, source, result, "ij.kl.mn.2", "05.10");
});

test(`05.11 - ${`\u001b[${33}m${`del`}\u001b[${39}m`} - ${`\u001b[${34}m${`existing path`}\u001b[${39}m`} - nested arrays`, t => {
  const source = `{
  "a": {
    "c": [
      {
      }
    ],
    "f": [
      {
        "g": "",
        "h": ""
      }
    ]
  }
}`;
  const result = `{
  "a": {
    "c": [
      {
      }
    ],
    "f": [
      {
        "g": ""
      }
    ]
  }
}`;
  deleter(t, source, result, "a.f.0.h", "05.11");
});

test(`05.12 - ${`\u001b[${33}m${`del`}\u001b[${39}m`} - ${`\u001b[${34}m${`existing path`}\u001b[${39}m`} - nested arrays`, t => {
  const source = `{
  "a": {
    "c": [
      {
        "d": "",
        "e": ""
      }
    ],
    "f": [
      {
        "g": "",
        "h": ""
      }
    ]
  }
}`;
  const result = `{
  "a": {
    "c": [
      {
        "d": "",
        "e": ""
      }
    ],
    "f": [
      {
        "g": ""
      }
    ]
  }
}`;
  deleter(t, source, result, "a.f.0.h", "05.12");
});

// -----------------------------------------------------------------------------
// 06. set - on arrays, existing path
// -----------------------------------------------------------------------------

test(`06.01 - ${`\u001b[${34}m${`set`}\u001b[${39}m`} - ${`\u001b[${36}m${`existing path`}\u001b[${39}m`} - nested arrays 1`, t => {
  const input = `[[]]`;
  const result = `[true]`;
  setter(t, input, result, "0", true, "06.01");
});

test(`06.02 - ${`\u001b[${34}m${`set`}\u001b[${39}m`} - ${`\u001b[${36}m${`existing path`}\u001b[${39}m`} - nested arrays 1`, t => {
  const input = `[{}]`;
  const result = `[true]`;
  setter(t, input, result, "0", true, "06.02");
});

test(`06.03 - ${`\u001b[${34}m${`set`}\u001b[${39}m`} - ${`\u001b[${36}m${`existing path`}\u001b[${39}m`} - nested arrays 1`, t => {
  const input = `[false]`;
  const result = `[true]`;
  setter(t, input, result, "0", true, "06.03");
});

test(`06.04 - ${`\u001b[${34}m${`set`}\u001b[${39}m`} - ${`\u001b[${36}m${`existing path`}\u001b[${39}m`} - nested arrays 1`, t => {
  const input = `["z"]`;
  const result = `[true]`;
  setter(t, input, result, "0", true, "06.04");
});

// // TODO - new path
// test(`06.05 - ${`\u001b[${34}m${`set`}\u001b[${39}m`} - ${`\u001b[${36}m${`new path`}\u001b[${39}m`} - nested arrays 2`, t => {
//   const input = `[[]]`;
//   const result = `[[true]]`;
//   setter(t, input, result, "0.0", true, "06.05");
// });
//
// // TODO - new path
// test(`06.06 - ${`\u001b[${34}m${`set`}\u001b[${39}m`} - ${`\u001b[${36}m${`new path`}\u001b[${39}m`} - nested arrays 2`, t => {
//   const input = `[{}]`;
//   const result = `[[true]]`;
//   setter(t, input, result, "0.0", true, "06.06");
// });
//
// // TODO - new path
// test(`06.07 - ${`\u001b[${34}m${`set`}\u001b[${39}m`} - ${`\u001b[${36}m${`new path`}\u001b[${39}m`} - nested arrays 2`, t => {
//   const input = `[false]`;
//   const result = `[[true]]`;
//   setter(t, input, result, "0.0", true, "06.07");
// });
//
// // TODO - new path
// test(`06.08 - ${`\u001b[${34}m${`set`}\u001b[${39}m`} - ${`\u001b[${36}m${`new path`}\u001b[${39}m`} - nested arrays 2`, t => {
//   const input = `["z"]`;
//   const result = `[[true]]`;
//   setter(t, input, result, "0.0", true, "06.08");
// });

// TODO - minified json

// -----------------------------------------------------------------------------
// Create keys
// -----------------------------------------------------------------------------

// TODO:
// test(`99.01 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under array`, t => {
//   const obj = "{}";
//   let res = set(obj, "b.0", "c");
//   res = set(res, "b.1", "d");
//   t.is(res, `{"b": ["c", "d"]}`);
// });

// TODO:
// test(`99.02 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should create intermediate objects`, t => {
//   const result = `{
//   "a": "b",
//   "b": {
//     "c": [],
//     "d": ["a", "b"],
//     "e": [{}, { "f": "g" }],
//     "f": "i"
//   },
//   "c": {
//     "d": {
//       "e": {
//         "f": "l"
//       }
//     }
//   }
// }`;
//   setter(t, testObj, result, "c.d.e.f", "l", "99.02");
// });

// TODO:
// test(`99.03 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should create intermediate objects`, t => {
//   const result = `{
//   "a": "b",
//   "b": {
//     "c": [],
//     "d": ["a", "b"],
//     "e": [{}, { "f": "g" }],
//     "f": "i"
//   },
//   "c": {
//     "d": {
//       "e": {
//         "f": "l"
//       }
//     }
//   }
// }`;
//   setter(t, testObj, result, ["c", "d", "e", "f"], "l", "99.03");
// });

// TODO:
// test(`99.04 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should create intermediate arrays`, t => {
//   const result = `{
//   "a": "b",
//   "b": {
//     "c": [],
//     "d": ["a", "b"],
//     "e": [{}, { "f": "g" }],
//     "f": "i"
//   },
//   "c": [[undefined, {
//     "m": "l"
//   }]]
// }`;
//   setter(t, testObj, result, "c.0.1.m", "l", "99.04");
// });

// TODO:
// test(`99.05 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should create intermediate arrays`, t => {
//   const result = `{
//   "a": "b",
//   "b": {
//     "c": [],
//     "d": ["a", "b"],
//     "e": [{}, { "f": "g" }],
//     "f": "i"
//   },
//   "c": {
//     "0": [{
//       "m": "l"
//     }]
//   }
// }`;
//   setter(t, testObj, result, ["c", "0", 1, "m"], "l", "99.05");
// });

// TODO
// test(`99.06 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under integer-like key`, t => {
//   const result = `{
//   "a": "b",
//   "b": {
//     "c": [],
//     "d": ["a", "b"],
//     "e": [{}, { "f": "g" }],
//     "f": "i"
//   },
//   "1a": "foo"
// }`;
//   setter(t, testObj, result, "1a", "foo", "99.06");
// });

// TODO
// test(`99.07 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under integer-like key`, t => {
//   const result = `{
//   "a": "b",
//   "b": {
//     "c": [],
//     "d": ["a", "b"],
//     "e": [{}, { "f": "g" }],
//     "f": "i"
//   },
//   "1a": "foo"
// }`;
//   setter(t, testObj, result, ["1a"], "foo", "99.07");
// });

// TODO
// test(`99.08 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under integer-like key`, t => {
//   const result = `["foo"]`;
//   setter(t, [], result, [0], "foo", "99.08");
// });

// TODO
// test(`99.09 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under integer-like key`, t => {
//   const result = `["foo"]`;
//   setter(t, [], result, "0", "foo", "99.09");
// });
