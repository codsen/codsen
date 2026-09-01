import { test } from "uvu";
import { equal, not, ok, throws } from "uvu/assert";

import {
  CheckTypesMiniError,
  checkTypesMini,
} from "../dist/check-types-mini.esm.js";

test("01 - reference root keys stay mandatory when schema is present", () => {
  throws(
    () => {
      checkTypesMini(
        { present: "" },
        { present: "", missing: 0 },
        { schema: { present: "string" } },
      );
    },
    /THROW_ID_16.*missing/,
    "01.01",
  );
  not.throws(() => {
    checkTypesMini({ present: "" }, null, {
      schema: { optional: "number", present: "string" },
    });
  }, "01.02");
});

test("02 - nested and flat schemas work without a reference", () => {
  not.throws(() => {
    checkTypesMini({ config: { enabled: true } }, null, {
      schema: { config: { enabled: "boolean" } },
    });
  }, "02.01");
  not.throws(() => {
    checkTypesMini({ config: { enabled: true } }, null, {
      schema: { "config.enabled": "boolean" },
    });
  }, "02.02");
  throws(
    () => {
      checkTypesMini({ config: { enabled: "yes" } }, null, {
        schema: { config: { enabled: "boolean" } },
      });
    },
    /THROW_ID_18/,
    "02.03",
  );
  throws(
    () => {
      checkTypesMini({ config: { enabled: true, extra: 1 } }, null, {
        schema: { config: { enabled: "boolean" } },
      });
    },
    /THROW_ID_17/,
    "02.04",
  );
});

test("03 - accepted arrays apply one top-level predicate to every element", () => {
  not.throws(() => {
    checkTypesMini(
      { items: [{ x: 1 }, { nested: { y: 2 } }] },
      {
        items: { x: 0 },
      },
      {
        acceptArrays: true,
      },
    );
  }, "03.01");
  not.throws(() => {
    checkTypesMini({ items: [{ x: 1 }] }, null, {
      acceptArrays: true,
      schema: { items: "object" },
    });
  }, "03.02");
  not.throws(() => {
    checkTypesMini(
      { items: [] },
      { items: { x: 0 } },
      {
        acceptArrays: true,
      },
    );
  }, "03.03");
  throws(
    () => {
      checkTypesMini(
        { items: [{ x: 1 }, null] },
        { items: { x: 0 } },
        {
          acceptArrays: true,
        },
      );
    },
    /THROW_ID_20/,
    "03.04",
  );
  throws(
    () => {
      checkTypesMini({ items: [{ x: 1 }, "wrong"] }, null, {
        acceptArrays: true,
        schema: { items: "object" },
      });
    },
    /THROW_ID_19/,
    "03.05",
  );
  throws(
    () => {
      checkTypesMini(
        { items: [{ x: 1 }] },
        { items: { x: 0 } },
        {
          acceptArrays: true,
          acceptArraysIgnore: "items",
        },
      );
    },
    /THROW_ID_21/,
    "03.06",
  );
});

test("04 - accepted arrays preserve literal Boolean schemas", () => {
  not.throws(() => {
    checkTypesMini({ flags: [true] }, null, {
      acceptArrays: true,
      schema: { flags: "true" },
    });
  }, "04.01");
  not.throws(() => {
    checkTypesMini({ flags: [false] }, null, {
      acceptArrays: true,
      schema: { flags: "false" },
    });
  }, "04.02");
  not.throws(() => {
    checkTypesMini({ flags: [true, false] }, null, {
      acceptArrays: true,
      schema: { flags: "boolean" },
    });
  }, "04.03");
  throws(
    () => {
      checkTypesMini({ flags: [true] }, null, {
        acceptArrays: true,
        schema: { flags: "false" },
      });
    },
    /THROW_ID_19/,
    "04.04",
  );
  throws(
    () => {
      checkTypesMini({ flags: [false] }, null, {
        acceptArrays: true,
        schema: { flags: "true" },
      });
    },
    /THROW_ID_19/,
    "04.05",
  );
});

test("05 - ignore matching is case-sensitive in every phase", () => {
  throws(
    () => {
      checkTypesMini(
        { flag: "wrong" },
        { flag: false },
        {
          ignoreKeys: "FLAG",
        },
      );
    },
    /THROW_ID_21/,
    "05.01",
  );
  not.throws(() => {
    checkTypesMini(
      { flag: "wrong" },
      { flag: false },
      {
        ignoreKeys: "flag",
      },
    );
  }, "05.02");
  throws(
    () => {
      checkTypesMini(
        { nest: { flag: "wrong" } },
        {
          nest: { flag: false },
        },
        {
          ignorePaths: "NEST.*",
        },
      );
    },
    /THROW_ID_21/,
    "05.03",
  );
  not.throws(() => {
    checkTypesMini(
      { nest: { flag: "wrong" } },
      {
        nest: { flag: false },
      },
      {
        ignorePaths: ["nest.*"],
      },
    );
  }, "05.04");
  throws(
    () => {
      checkTypesMini({ Rogue: 1 }, {}, { ignoreKeys: "rogue" });
    },
    /THROW_ID_15/,
    "05.05",
  );
  not.throws(() => {
    checkTypesMini({ Rogue: 1 }, {}, { ignoreKeys: ["Rogue"] });
  }, "05.06");
});

test("06 - ignore patterns retain escaping and cohesive negation", () => {
  not.throws(() => {
    checkTypesMini(
      { "!literal": "wrong", "star*": "wrong" },
      { "!literal": false, "star*": false },
      { ignoreKeys: ["\\!literal", "star\\*"] },
    );
  }, "06.01");
  throws(
    () => {
      checkTypesMini(
        { keep: "wrong", skip: "wrong" },
        { keep: false, skip: false },
        { ignoreKeys: ["*", "!keep"] },
      );
    },
    /opts\.keep/,
    "06.02",
  );
});

test("07 - malformed roots are rejected before validation", () => {
  class Box {}
  for (const value of [
    null,
    1,
    "x",
    true,
    [],
    new Date(),
    new Box(),
    () => 1,
  ]) {
    throws(
      () => {
        checkTypesMini(value, null, { enforceStrictKeyset: false });
      },
      /THROW_ID_01/,
      "07.01",
    );
  }
  for (const value of [undefined, 1, [], new Date(), new Box(), () => 1]) {
    throws(
      () => {
        checkTypesMini({}, value, { enforceStrictKeyset: false });
      },
      /THROW_ID_02/,
      "07.02",
    );
  }
  for (const value of [1, "x", [], new Date(), () => 1]) {
    throws(
      () => {
        checkTypesMini({}, null, value);
      },
      /THROW_ID_03/,
      "07.03",
    );
  }
});

test("08 - malformed options have stable validator codes", () => {
  throws(
    () => checkTypesMini({}, null, { enforceStrictKeyset: false, rogue: true }),
    /THROW_ID_04/,
    "08.01",
  );
  throws(
    () =>
      checkTypesMini({}, null, {
        enforceStrictKeyset: false,
        ignoreKeys: ["valid", 1],
      }),
    /THROW_ID_05/,
    "08.02",
  );
  throws(
    () =>
      checkTypesMini({}, null, {
        acceptArrays: "false",
        enforceStrictKeyset: false,
      }),
    /THROW_ID_06/,
    "08.03",
  );
  throws(
    () =>
      checkTypesMini({}, null, {
        enforceStrictKeyset: false,
        schema: [],
      }),
    /THROW_ID_07/,
    "08.04",
  );
  throws(
    () =>
      checkTypesMini({}, null, {
        enforceStrictKeyset: false,
        msg: 1,
      }),
    /THROW_ID_08/,
    "08.05",
  );
  throws(
    () =>
      checkTypesMini({}, null, {
        enforceStrictKeyset: false,
        reportProgressFunc: "progress",
      }),
    /THROW_ID_09/,
    "08.06",
  );
  throws(
    () =>
      checkTypesMini({}, null, {
        enforceStrictKeyset: false,
        reportProgressFuncFrom: Number.NaN,
      }),
    /THROW_ID_10/,
    "08.07",
  );
  throws(
    () =>
      checkTypesMini({}, null, {
        enforceStrictKeyset: false,
        reportProgressFuncFrom: 80,
        reportProgressFuncTo: 20,
      }),
    /THROW_ID_11/,
    "08.08",
  );
  for (const [key, expectedCode, label] of [
    ["ignoreKeys", "THROW_ID_05", "08.09"],
    ["ignorePaths", "THROW_ID_05", "08.10"],
    ["acceptArraysIgnore", "THROW_ID_05", "08.11"],
    ["acceptArrays", "THROW_ID_06", "08.12"],
    ["enforceStrictKeyset", "THROW_ID_06", "08.13"],
    ["schema", "THROW_ID_07", "08.14"],
    ["msg", "THROW_ID_08", "08.15"],
    ["optsVarName", "THROW_ID_08", "08.16"],
    ["reportProgressFuncFrom", "THROW_ID_10", "08.17"],
    ["reportProgressFuncTo", "THROW_ID_10", "08.18"],
  ]) {
    throws(
      () =>
        checkTypesMini({}, null, {
          enforceStrictKeyset: false,
          [key]: null,
        }),
      new RegExp(expectedCode),
      label,
    );
  }
  not.throws(() => {
    checkTypesMini({}, null, {
      enforceStrictKeyset: false,
      reportCompletionFunc: null,
      reportProgressFunc: null,
    });
  }, "08.19");
});

test("09 - explicit undefined differs from sparse array holes", () => {
  throws(
    () => {
      checkTypesMini({ values: [undefined] }, { values: ["sample"] });
    },
    /THROW_ID_21/,
    "09.01",
  );
  not.throws(() => {
    checkTypesMini({ values: Array(1) }, { values: ["sample"] });
  }, "09.02");
  const deleted = ["sample"];
  delete deleted[0];
  not.throws(() => {
    checkTypesMini({ values: deleted }, { values: ["sample"] });
  }, "09.03");
  not.throws(() => {
    checkTypesMini({ values: [undefined] }, null, {
      acceptArrays: true,
      schema: { values: "undefined" },
    });
  }, "09.04");
  const mixed = Array(2);
  mixed[1] = "wrong";
  throws(
    () => {
      checkTypesMini({ values: mixed }, null, {
        acceptArrays: true,
        schema: { values: "undefined" },
      });
    },
    /THROW_ID_19/,
    "09.05",
  );
});

test("10 - validation errors expose structured diagnostic fields", () => {
  let caught;
  try {
    checkTypesMini(
      { enabled: "yes" },
      { enabled: false },
      {
        msg: "buildConfig",
        optsVarName: "config",
      },
    );
  } catch (error) {
    caught = error;
  }
  ok(caught instanceof CheckTypesMiniError, "10.01");
  equal(caught.name, "CheckTypesMiniError", "10.02");
  equal(caught.validatorCode, "THROW_ID_21", "10.03");
  equal(caught.context, "buildConfig", "10.04");
  equal(caught.path, ["enabled"], "10.05");
  equal(caught.expectedTypes, ["boolean"], "10.06");
  equal(caught.actualType, "string", "10.07");
  equal(caught.toJSON().path, ["enabled"], "10.08");
  ok(Object.isFrozen(caught.path), "10.09");
  ok(Object.isFrozen(caught.expectedTypes), "10.10");
});

test("11 - dotted and unusual property keys stay lossless", () => {
  not.throws(() => {
    checkTypesMini({ "a.b": 1 }, { "a.b": 0 });
  }, "11.01");
  not.throws(() => {
    checkTypesMini({ "a.b": 1 }, null, { schema: { "a\\.b": "number" } });
  }, "11.02");
  throws(
    () => {
      checkTypesMini({ "a.b": 1 }, null, { schema: { "a.b": "number" } });
    },
    /THROW_ID_15/,
    "11.03",
  );
  not.throws(() => {
    checkTypesMini({ a: { b: 1 } }, null, { schema: { "a.b": "number" } });
  }, "11.04");
  let caught;
  try {
    checkTypesMini({ "a.b": 1 }, { "a.b": "" });
  } catch (error) {
    caught = error;
  }
  equal(caught.path, ["a.b"], "11.05");
  ok(caught.message.includes('opts["a.b"]'), "11.06");
  not.throws(() => {
    checkTypesMini({ "": 1, "01": true }, { "": 0, "01": false });
  }, "11.07");
  not.throws(() => {
    checkTypesMini({ "a.b": "wrong" }, { "a.b": false }, {
      ignorePaths: "a\\.b",
    });
  }, "11.08");
  throws(
    () => {
      checkTypesMini({ "a.b": "wrong" }, { "a.b": false }, {
        ignorePaths: "a.b",
      });
    },
    /THROW_ID_21/,
    "11.09",
  );
});

test("12 - magic keys and null-prototype objects stay local", () => {
  const input = JSON.parse('{"__proto__":1,"constructor":"x"}');
  const reference = JSON.parse('{"__proto__":0,"constructor":""}');
  const schema = JSON.parse('{"__proto__":"number","constructor":"string"}');
  not.throws(() => {
    checkTypesMini(input, reference);
  }, "12.01");
  not.throws(() => {
    checkTypesMini(input, null, { schema });
  }, "12.02");
  equal(Object.prototype.polluted, undefined, "12.03");

  const nullPrototypeInput = Object.create(null);
  const nullPrototypeReference = Object.create(null);
  nullPrototypeInput.value = 1;
  nullPrototypeReference.value = 0;
  not.throws(() => {
    checkTypesMini(nullPrototypeInput, nullPrototypeReference);
  }, "12.04");
});

test("13 - any schemas prune getters and cycles below the terminal", () => {
  let rootReads = 0;
  let childReads = 0;
  const child = {};
  Object.defineProperty(child, "danger", {
    enumerable: true,
    get() {
      childReads++;
      throw new TypeError("should not be read");
    },
  });
  child.self = child;
  const input = {};
  Object.defineProperty(input, "metadata", {
    enumerable: true,
    get() {
      rootReads++;
      return child;
    },
  });
  not.throws(() => {
    checkTypesMini(input, null, { schema: { metadata: "any" } });
  }, "13.01");
  equal(rootReads, 1, "13.02");
  equal(childReads, 0, "13.03");
});

test("14 - cycles are branded and shared acyclic graphs remain valid", () => {
  const cyclicSchema = {};
  cyclicSchema.self = cyclicSchema;
  throws(
    () => {
      checkTypesMini({ self: {} }, null, { schema: cyclicSchema });
    },
    /THROW_ID_13/,
    "14.01",
  );

  const input = {};
  const reference = {};
  input.self = input;
  reference.self = reference;
  throws(
    () => {
      checkTypesMini(input, reference);
    },
    /THROW_ID_22/,
    "14.02",
  );

  const sharedInput = { leaf: "value" };
  const sharedReference = { leaf: "" };
  not.throws(() => {
    checkTypesMini(
      { left: sharedInput, right: sharedInput },
      { left: sharedReference, right: sharedReference },
    );
  }, "14.03");
});

test("15 - input and reference properties are each read once", () => {
  let inputBranchReads = 0;
  let inputLeafReads = 0;
  let referenceBranchReads = 0;
  let referenceLeafReads = 0;
  const inputBranch = {};
  const referenceBranch = {};
  Object.defineProperty(inputBranch, "leaf", {
    enumerable: true,
    get() {
      inputLeafReads++;
      return "value";
    },
  });
  Object.defineProperty(referenceBranch, "leaf", {
    enumerable: true,
    get() {
      referenceLeafReads++;
      return "";
    },
  });
  const input = {};
  const reference = {};
  Object.defineProperty(input, "branch", {
    enumerable: true,
    get() {
      inputBranchReads++;
      return inputBranchReads === 1 ? inputBranch : 1;
    },
  });
  Object.defineProperty(reference, "branch", {
    enumerable: true,
    get() {
      referenceBranchReads++;
      return referenceBranchReads === 1 ? referenceBranch : false;
    },
  });
  not.throws(() => {
    checkTypesMini(input, reference);
  }, "15.01");
  equal(
    [
      inputBranchReads,
      inputLeafReads,
      referenceBranchReads,
      referenceLeafReads,
    ],
    [1, 1, 1, 1],
    "15.02",
  );
});

test("16 - object schemas mean plain objects", () => {
  class Box {}
  throws(
    () => {
      checkTypesMini({ value: new Box() }, null, {
        schema: { value: "object" },
      });
    },
    /THROW_ID_18/,
    "16.01",
  );
  throws(
    () => {
      checkTypesMini({ value: new Date() }, null, {
        schema: { value: "object" },
      });
    },
    /THROW_ID_18/,
    "16.02",
  );
  not.throws(() => {
    checkTypesMini({ value: Object.create(null) }, null, {
      schema: { value: "object" },
    });
  }, "16.03");
});

test("17 - malformed and colliding schema entries are rejected", () => {
  for (const descriptor of [1, true, () => 1, [], ["string", 1], [""]]) {
    throws(
      () => {
        checkTypesMini({ value: "x" }, null, {
          schema: { value: descriptor },
        });
      },
      /THROW_ID_12/,
      "17.01",
    );
  }
  const sparseDescriptor = Array(1);
  throws(
    () => {
      checkTypesMini({ value: "x" }, null, {
        schema: { value: sparseDescriptor },
      });
    },
    /THROW_ID_12/,
    "17.02",
  );
  throws(
    () => {
      checkTypesMini({ branch: { leaf: "x" } }, null, {
        schema: { branch: "any", "branch.leaf": "string" },
      });
    },
    /THROW_ID_12/,
    "17.03",
  );
  not.throws(() => {
    checkTypesMini({ branch: { leaf: "x" } }, null, {
      schema: { branch: "object", "branch.leaf": "string" },
    });
  }, "17.04");
});

test("18 - nested reference keys remain optional", () => {
  not.throws(() => {
    checkTypesMini({ root: {} }, { root: { optional: true } });
  }, "18.01");
});

test("19 - schema-only validation requires an explicit null reference", () => {
  throws(
    () => {
      checkTypesMini({});
    },
    /THROW_ID_02/,
    "19.01",
  );
  throws(
    () => {
      checkTypesMini({}, undefined);
    },
    /THROW_ID_02/,
    "19.02",
  );
  throws(
    () => {
      checkTypesMini({}, null);
    },
    /THROW_ID_14/,
    "19.03",
  );
  not.throws(() => {
    checkTypesMini({}, null, { enforceStrictKeyset: false });
  }, "19.04");
});

test.run();
