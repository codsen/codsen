// Report document progress and completion

import { strict as assert } from "node:assert";
import { remark } from "remark";

import fixTypography from "../dist/remark-typography.esm.js";

const progress = [];
const file = remark()
  .use(fixTypography, {
    reportProgressFunc: (percentageDone) => progress.push(percentageDone),
    reportProgressFuncFrom: 20,
    reportProgressFuncTo: 40,
  })
  .processSync("Wait...");
const completion = file.data.remarkTypography;

assert.deepEqual(
  {
    completion: {
      ...completion,
      timeTakenInMilliseconds: typeof completion.timeTakenInMilliseconds,
    },
    output: file.toString().trim(),
    progress: {
      first: progress[0],
      last: progress[progress.length - 1],
      strictlyIncreasing: progress.every(
        (value, index) => index === 0 || value > progress[index - 1],
      ),
    },
  },
  {
    completion: {
      apostrophesConverted: 0,
      blocksProcessed: 1,
      charactersProcessed: 7,
      dashesConverted: 0,
      ellipsesConverted: 1,
      multiplicationSignsConverted: 0,
      replacementsApplied: 1,
      textNodesChanged: 1,
      textNodesProcessed: 1,
      timeTakenInMilliseconds: "number",
      widowMeasuresAdded: 0,
    },
    output: "Wait…",
    progress: {
      first: 20,
      last: 40,
      strictlyIncreasing: true,
    },
  },
);
