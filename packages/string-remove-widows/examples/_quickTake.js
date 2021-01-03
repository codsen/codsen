// Quick Take

import { strict as assert } from "assert";
import { removeWidows } from "../dist/string-remove-widows.esm.js";

const result = removeWidows("Some text with many words on one line.");

// time taken can vary so we'll set it to zero:
result.log.timeTakenInMiliseconds = 0;

assert.deepEqual(result, {
  log: {
    timeTakenInMiliseconds: 0,
  },
  ranges: [[32, 33, "&nbsp;"]], // see codsen.com/ranges/
  res: "Some text with many words on one&nbsp;line.",
  whatWasDone: {
    convertEntities: false,
    removeWidows: true,
  },
});
