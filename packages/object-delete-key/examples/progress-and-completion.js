// Compose progress and inspect completion statistics

import { strict as assert } from "node:assert";

import { deleteKey } from "../dist/object-delete-key.esm.js";

const progress = [];
let completion;
const result = deleteKey(
  { keep: true, remove: true, nested: { remove: true } },
  {
    key: "remove",
    reportCompletionFunc(stats) {
      completion = stats;
    },
    reportProgressFunc(percentageDone) {
      progress.push(percentageDone);
    },
    reportProgressFuncFrom: 20,
    reportProgressFuncTo: 40,
  },
);

assert.deepEqual(
  {
    completion: {
      cleanupPrunedContainers: completion.cleanupPrunedContainers,
      directDeletions: completion.directDeletions,
      frozen: Object.isFrozen(completion),
      maxDepth: completion.maxDepth,
      timeTakenInMilliseconds: typeof completion.timeTakenInMilliseconds,
      totalEntries: completion.totalEntries,
      visitedEntries: completion.visitedEntries,
    },
    progress,
    result,
  },
  {
    completion: {
      cleanupPrunedContainers: 1,
      directDeletions: 2,
      frozen: true,
      maxDepth: 2,
      timeTakenInMilliseconds: "number",
      totalEntries: 4,
      visitedEntries: 4,
    },
    progress: [20, 25, 30, 35, 40],
    result: { keep: true },
  },
);
