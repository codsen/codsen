import { test } from "uvu";
import { equal } from "uvu/assert";

import { applyNodeEnginePolicy } from "../../lect/common/applyNodeEnginePolicy.js";

test("01 - all published packages require Node 22", () => {
  const input = {
    name: "example-library",
    engines: { node: ">=14.18.0", npm: ">=10" },
  };

  equal(
    applyNodeEnginePolicy(input),
    {
      name: "example-library",
      engines: { node: ">=22", npm: ">=10" },
    },
    "01.01",
  );
  equal(
    input,
    {
      name: "example-library",
      engines: { node: ">=14.18.0", npm: ">=10" },
    },
    "01.02",
  );
  equal(
    applyNodeEnginePolicy({ name: "example-library" }),
    { name: "example-library", engines: { node: ">=22" } },
    "01.03",
  );
});

test("02 - CLI engine declarations are normalised", () => {
  equal(
    applyNodeEnginePolicy({ name: "example-cli", engines: { node: ">=18" } }),
    { name: "example-cli", engines: { node: ">=22" } },
    "02.01",
  );
  equal(
    applyNodeEnginePolicy({ name: "example-cli" }),
    { name: "example-cli", engines: { node: ">=22" } },
    "02.02",
  );
});

test.run();
