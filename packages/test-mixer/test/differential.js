// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { mixer, mixerLazy } from "../dist/test-mixer.esm.js";

const hasOwn = Object.prototype.hasOwnProperty;

function referenceMixer(ref, defaultsObj) {
  const keysToMix = Object.keys(defaultsObj).filter(
    (key) => typeof defaultsObj[key] === "boolean" && !hasOwn.call(ref, key),
  );
  return Array.from(
    { length: 2 ** keysToMix.length },
    (_, combinationIndex) => {
      const result = { ...defaultsObj, ...ref };
      keysToMix.forEach((key, keyIndex) => {
        result[key] = Math.floor(combinationIndex / 2 ** keyIndex) % 2 === 1;
      });
      return result;
    },
  );
}

test("01 - matches a bounded reference implementation", () => {
  const actualCases = [];
  const expectedCases = [];
  const lazyCases = [];

  for (let keyCount = 0; keyCount <= 12; keyCount += 1) {
    const defaultsObj = { mode: "safe" };
    for (let keyIndex = 0; keyIndex < keyCount; keyIndex += 1) {
      defaultsObj[`flag${keyIndex}`] = keyIndex % 2 === 0;
    }

    for (let pinnedCount = 0; pinnedCount <= keyCount; pinnedCount += 1) {
      const ref = { required: "carried" };
      for (let keyIndex = 0; keyIndex < pinnedCount; keyIndex += 1) {
        ref[`flag${keyIndex}`] = keyIndex === 0 ? "pinned" : keyIndex % 2 === 0;
      }
      actualCases.push(mixer(ref, defaultsObj));
      expectedCases.push(referenceMixer(ref, defaultsObj));
      lazyCases.push([...mixerLazy(ref, defaultsObj)]);
    }
  }

  equal(actualCases.length, 91, "01.01");
  equal(actualCases, expectedCases, "01.02");
  equal(lazyCases, expectedCases, "01.03");
});

test.run();
