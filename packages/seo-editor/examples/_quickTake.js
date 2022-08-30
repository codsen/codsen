/* eslint-disable no-unused-vars */
// Quick Take

import { strict as assert } from "assert";

import { editor, version } from "../dist/seo-editor.esm.js";

// Powers the UI of codsen.com/tools/seo-editor

// there's also a non-deterministic "log" key containing calculation statistics
const { todoLines, todoTotal, completion, chunkWordCounts } = editor(
  `
- apple
- banana
- cucumber
`,
  `
I ate a banana and a cucumber.
  `
);
assert.deepEqual(
  { todoLines, todoTotal, completion, chunkWordCounts },
  {
    todoLines: [
      { extracted: "", counts: [], length: 0, lengthCompensation: 0 },
      { extracted: "apple", counts: [0], length: 5, lengthCompensation: 3 },
      { extracted: "banana", counts: [1], length: 6, lengthCompensation: 2 },
      {
        extracted: "cucumber",
        counts: [1],
        length: 8,
        lengthCompensation: 0,
      },
      { extracted: "", counts: [], length: 0, lengthCompensation: 0 },
    ],
    todoTotal: 3,
    completion: [2],
    chunkWordCounts: [7],
  }
);
