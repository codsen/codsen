import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import { lowestNodeMajor, nodeTargetFromEngineRange } from "../nodeEngine.js";

test("01 - engine ranges map to their lowest supported Node target", () => {
  equal(nodeTargetFromEngineRange(">=18"), "node18", "01.01");
  equal(nodeTargetFromEngineRange(">=18.17.0"), "node18", "01.02");
  equal(nodeTargetFromEngineRange("^18.17.0 || >=20.5.0"), "node18", "01.03");
  equal(nodeTargetFromEngineRange(">=20 <22"), "node20", "01.04");
  equal(nodeTargetFromEngineRange(">=22"), "node22", "01.05");
  equal(nodeTargetFromEngineRange(">=24"), "node24", "01.06");
  equal(nodeTargetFromEngineRange(">=26"), "node26", "01.07");
  equal(lowestNodeMajor("18.17.0 - 22"), 18, "01.08");
});

test("02 - invalid engine declarations fail early", () => {
  throws(
    () => nodeTargetFromEngineRange(),
    /engines\.node must be a non-empty string/,
    "02.01",
  );
  throws(
    () => nodeTargetFromEngineRange(">=18 ||"),
    /empty range alternative/,
    "02.02",
  );
  throws(
    () => nodeTargetFromEngineRange("*"),
    /must contain a lower version bound/,
    "02.03",
  );
});

test.run();
