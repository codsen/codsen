import { test } from "uvu";
import { equal } from "uvu/assert";

import { deleteObj } from "../dist/ast-delete-object.esm.js";

test("01 - meaningful values are not whitespace deletion patterns", () => {
  const selectorInput = { node: { selectors: [".keep"] } };
  equal(
    deleteObj(
      selectorInput,
      { selectors: [" "] },
      {
        hungryForWhitespace: true,
      },
    ),
    selectorInput,
    "01.01",
  );

  const primitiveInput = { node: { enabled: true, count: 1 } };
  equal(
    deleteObj(primitiveInput, {}, { hungryForWhitespace: true }),
    primitiveInput,
    "01.02",
  );
  equal(
    deleteObj(
      primitiveInput,
      {},
      {
        hungryForWhitespace: true,
        matchKeysStrictly: true,
      },
    ),
    primitiveInput,
    "01.03",
  );
});

test.run();
