// Quick Take

import { strict as assert } from "assert";

import { mixer } from "../dist/test-mixer.esm.js";

// check all possible combinations of all boolean opts:
const defaultOpts = {
  scrapeWindshield: true,
  checkOil: true,
  inflateTires: false,
  extinguishersCount: 1, // as non-boolean will be ignored
};

// generates 2^3 = 8 combinations all possible bools
assert.deepEqual(
  mixer(
    {
      // empty first arg object means you want all combinations
    },
    defaultOpts,
  ),
  [
    {
      scrapeWindshield: false,
      checkOil: false,
      inflateTires: false,
      extinguishersCount: 1,
    },
    {
      scrapeWindshield: true,
      checkOil: false,
      inflateTires: false,
      extinguishersCount: 1,
    },
    {
      scrapeWindshield: false,
      checkOil: true,
      inflateTires: false,
      extinguishersCount: 1,
    },
    {
      scrapeWindshield: true,
      checkOil: true,
      inflateTires: false,
      extinguishersCount: 1,
    },
    {
      scrapeWindshield: false,
      checkOil: false,
      inflateTires: true,
      extinguishersCount: 1,
    },
    {
      scrapeWindshield: true,
      checkOil: false,
      inflateTires: true,
      extinguishersCount: 1,
    },
    {
      scrapeWindshield: false,
      checkOil: true,
      inflateTires: true,
      extinguishersCount: 1,
    },
    {
      scrapeWindshield: true,
      checkOil: true,
      inflateTires: true,
      extinguishersCount: 1,
    },
  ],
);

// let's "pin" a value, prepare two sets of options objects,
// one where scrapeWindshield === true and another with "false"

// you'll get 2 ^ (3-1) = 4 variations:
const variationsWithScrapeWindshieldOn = mixer(
  {
    scrapeWindshield: true,
  },
  defaultOpts,
);
assert.deepEqual(variationsWithScrapeWindshieldOn, [
  {
    scrapeWindshield: true, // <--- pinned
    checkOil: false,
    inflateTires: false,
    extinguishersCount: 1,
  },
  {
    scrapeWindshield: true, // <--- pinned
    checkOil: true,
    inflateTires: false,
    extinguishersCount: 1,
  },
  {
    scrapeWindshield: true, // <--- pinned
    checkOil: false,
    inflateTires: true,
    extinguishersCount: 1,
  },
  {
    scrapeWindshield: true, // <--- pinned
    checkOil: true,
    inflateTires: true,
    extinguishersCount: 1,
  },
]);

// also 4 variations, similar but with scrapeWindshield === false pinned:
const variationsWithScrapeWindshieldOff = mixer(
  {
    scrapeWindshield: false,
  },
  defaultOpts,
);
assert.equal(variationsWithScrapeWindshieldOff.length, 4);
