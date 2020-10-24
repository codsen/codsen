import tap from "tap";
import { setter } from "./util/util";

// set - editing an existing key
// -----------------------------------------------------------------------------

tap.test(`01 - key in the root`, (t) => {
  const source = `{
  "a": "b",
  "c": "d"
}`;
  const result = `{
  "a": "b",
  "c": "e"
}`;
  setter(t, source, result, "c", "e", "02.01");

  t.end();
});

tap.test(`02 - key in the root`, (t) => {
  const source = `{
  "a": "b",
  "c": "d"
}`;
  const result = `{
  "a": "b",
  "c": "1"
}`;
  setter(t, source, result, "c", "1", "02.02");
  t.end();
});

tap.test(`03 - key in the root`, (t) => {
  const source = `{
  "a": "b",
  "c": "d"
}`;
  const result = `{
  "a": "b",
  "c": 1
}`;
  setter(t, source, result, "c", 1, "02.03");
  t.end();
});

tap.test(`04 - key in the root`, (t) => {
  const source = `{
  "a": "b",
  "c": "d"
}`;
  const result = `{
  "a": "b",
  "c": false
}`;
  setter(t, source, result, "c", false, "02.04");
  t.end();
});

tap.test(`05 - second level key`, (t) => {
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
  t.end();
});

tap.test(`06 - second level key`, (t) => {
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
  t.end();
});

tap.test(`07 - value is number`, (t) => {
  const source = `{
  "a": "b",
  "c": 1
}`;
  const result = `{
  "a": "b",
  "c": 0
}`;
  setter(t, source, result, "c", 0, "02.07");
  t.end();
});

tap.test(`08 - null overwritten with null`, (t) => {
  const source = `{
  "a": "b",
  "c": null
}`;
  const result = `{
  "a": "b",
  "c": null
}`;
  setter(t, source, result, "c", null, "02.08");
  t.end();
});

tap.test(`09 - value is object and it leads to contents end`, (t) => {
  const input = `{
  "a": "b",
  "x": {"y": "z"}
}`;
  const result = `{
  "a": "b",
  "x": {"y":"x"}
}`;
  setter(t, input, result, "x", { y: "x" }, "02.09");
  t.end();
});

tap.test(`10 - value is a stringified object - escapes`, (t) => {
  const input = `{
  "a": "b",
  "x": {"y": "z"}
}`;
  const result = `{
  "a": "b",
  "x": "{ y: \\"x\\" }"
}`;
  setter(t, input, result, "x", `{ y: "x" }`, "02.10");
  t.end();
});

tap.test(`11 - difficult characters 1`, (t) => {
  const input = `{
  "a": {
    "b": "}c"
}}`;
  const result = `{
  "a": "x"
}`;
  setter(t, input, result, "a", `x`, "02.11");
  t.end();
});

tap.test(`12 - difficult characters 2`, (t) => {
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
  t.end();
});

tap.test(`13 - nested objects`, (t) => {
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
  t.end();
});

tap.test(
  `14 - same-named key is passed through at deeper level while iterating`,
  (t) => {
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
    t.end();
  }
);

tap.test(
  `15 - same-named key is passed through at deeper level while iterating`,
  (t) => {
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
    t.end();
  }
);

tap.test(`16 - non-quoted value replaced with quoted`, (t) => {
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
  t.end();
});

tap.test(`17 - non-quoted value replaced with non-quoted`, (t) => {
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
  t.end();
});

tap.test(`18 - quoted value replaced with non-quoted`, (t) => {
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
  t.end();
});

tap.test(`19 - value empty obj replaced with non-quoted`, (t) => {
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
  t.end();
});

tap.test(`20 - value empty obj replaced with non-quoted`, (t) => {
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
  t.end();
});

tap.test(`21 - value empty obj replaced with non-quoted`, (t) => {
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
  t.end();
});

tap.test(`22 - value empty obj replaced with non-quoted`, (t) => {
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
  t.end();
});

tap.test(`23 - middle element in the array`, (t) => {
  const input = `{
  "k": {
    "l": "m",
    "p": "q"
  },
  "r": [
    "s",
    "t",
    "u"
  ]
}
`;
  const result = `{
  "k": {
    "l": "m",
    "p": "q"
  },
  "r": [
    "s",
    "x",
    "u"
  ]
}
`;
  setter(t, input, result, "r.1", "x", "02.23");
  t.end();
});

tap.test(`24 - the last element in the array`, (t) => {
  const input = `{
  "k": {
    "l": "m",
    "p": "q"
  },
  "r": [
    "s",
    "t",
    "u"
  ]
}
`;
  const result = `{
  "k": {
    "l": "m",
    "p": "q"
  },
  "r": [
    "s",
    "t",
    "x"
  ]
}
`;
  setter(t, input, result, "r.2", "x", "02.24");
  t.end();
});

tap.test(
  `25 - last value in array, bool replaced with a quoted string`,
  (t) => {
    const input = `{
  "a": {
    "b": false,
    "c": [
      "d"
    ]
  }
}
`;
    const result = `{
  "a": {
    "b": "x",
    "c": [
      "d"
    ]
  }
}
`;
    setter(t, input, result, "a.b", "x", "02.25");
    t.end();
  }
);

tap.test(`26 - key in the root`, (t) => {
  const source = `{
  "a": "b",
  "c": "workspace:d"
}`;
  const result = `{
  "a": "b",
  "c": "workspace:1"
}`;
  setter(t, source, result, "c", "workspace:1", "02.02");
  t.end();
});
