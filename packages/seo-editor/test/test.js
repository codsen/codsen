import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { editor, version } from "../dist/seo-editor.esm.js";

function prep(obj) {
  let newObj = { ...obj };
  delete newObj.log;
  return newObj;
}

// -----------------------------------------------------------------------------
// 00. api bits
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - exports a function`, () => {
  equal(typeof editor, "function", "01");
});

test(`02 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - exported version is a semver version`, () => {
  equal(String(version).match(/\d+\.\d+\.\d+/gi).length, 1, "02");
});

// -----------------------------------------------------------------------------
// 01. normal use
// -----------------------------------------------------------------------------

test(`03 - one copy chunk`, () => {
  equal(
    prep(
      editor(
        `
- apple
- banana
- cucumber
`,
        `
I ate a banana and a cucumber.
    `
      )
    ),
    {
      result: [
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
    },
    "03"
  );
});

test(`04 - two copy chunks, whitespaced`, () => {
  equal(
    prep(
      editor(
        `
- apple
- banana
- cucumber
`,
        `
I ate a banana and a cucumber.

---

So, I ate a banana and then, after five minutes, another banana. Then, I thought, it's so close to five-a-day! So I are another banana. My belly started to swell and refused to collaborate further, growling silently. I went to the gym in the evening and came back hungry and ate one more banana. That was my five-a-day day.
    `
      )
    ),
    {
      result: [
        { extracted: "", counts: [], length: 0, lengthCompensation: 0 },
        {
          extracted: "apple",
          counts: [0, 0],
          length: 5,
          lengthCompensation: 3,
        }, // "apple" not found in either chunks
        {
          extracted: "banana",
          counts: [1, 4],
          length: 6,
          lengthCompensation: 2,
        }, // "banana" found four times in second chunk, once in the first
        {
          extracted: "cucumber",
          counts: [1, 0],
          length: 8,
          lengthCompensation: 0,
        }, // "cucumber" found only in the first chunk
        { extracted: "", counts: [], length: 0, lengthCompensation: 0 },
      ],
      todoTotal: 3,
      completion: [2, 1],
      chunkWordCounts: [7, 63],
    },
    "04"
  );
});

test(`05 - two copy chunks, tight`, () => {
  equal(
    prep(
      editor(
        `- apple
- banana
- cucumber`,
        `I ate a banana and a cucumber.
----
So, I ate a banana and then, after five minutes, another banana. Then, I thought, it's so close to five-a-day! So I are another banana. My belly started to swell and refused to collaborate further, growling silently. I went to the gym in the evening and came back hungry and ate one more banana. That was my five-a-day day.`
      )
    ),
    {
      result: [
        {
          extracted: "apple",
          counts: [0, 0],
          length: 5,
          lengthCompensation: 3,
        }, // "apple" not found in either chunks
        {
          extracted: "banana",
          counts: [1, 4],
          length: 6,
          lengthCompensation: 2,
        }, // "banana" found four times in second chunk, once in the first
        {
          extracted: "cucumber",
          counts: [1, 0],
          length: 8,
          lengthCompensation: 0,
        }, // "cucumber" found only in the first chunk
      ],
      todoTotal: 3,
      completion: [2, 1],
      chunkWordCounts: [7, 63],
    },
    "05"
  );
});

test(`06 - both todo and copy are empty`, () => {
  equal(
    prep(editor("", "")),
    {
      result: [],
      todoTotal: 0,
      completion: [0],
      chunkWordCounts: [],
    },
    "06.01"
  );
  equal(
    prep(editor("", ",")),
    {
      result: [],
      todoTotal: 0,
      completion: [0],
      chunkWordCounts: [0],
    },
    "06.02"
  );
});

test(`07 - nothing todo`, () => {
  equal(
    prep(editor("tralala", "")),
    {
      result: [{ extracted: "", counts: [], length: 0, lengthCompensation: 0 }],
      todoTotal: 0,
      completion: [0],
      chunkWordCounts: [],
    },
    "07.01"
  );
  equal(
    prep(editor("tralala", "\t\t\t\t\t\t")),
    {
      result: [{ extracted: "", counts: [], length: 0, lengthCompensation: 0 }],
      todoTotal: 0,
      completion: [0],
      chunkWordCounts: [],
    },
    "07.02"
  );
  equal(
    prep(editor("tralala", ",")),
    {
      result: [{ extracted: "", counts: [], length: 0, lengthCompensation: 0 }],
      todoTotal: 0,
      completion: [0],
      chunkWordCounts: [0],
    },
    "07.03"
  );
  equal(
    prep(editor("", "tralala")),
    {
      result: [],
      todoTotal: 0,
      completion: [0],
      chunkWordCounts: [1],
    },
    "07.04"
  );
  equal(
    prep(editor("\t\t\t\t\t\t", "tralala")),
    {
      result: [],
      todoTotal: 0,
      completion: [0],
      chunkWordCounts: [1],
    },
    "07.05"
  );
  equal(
    prep(editor("tralala", "tralala")),
    {
      result: [{ extracted: "", counts: [], length: 0, lengthCompensation: 0 }],
      todoTotal: 0,
      completion: [0],
      chunkWordCounts: [1],
    },
    "07.06"
  );
  equal(
    prep(editor("tralala", ",")),
    {
      result: [{ extracted: "", counts: [], length: 0, lengthCompensation: 0 }],
      todoTotal: 0,
      completion: [0],
      chunkWordCounts: [0],
    },
    "07.07"
  );
});

test.run();
