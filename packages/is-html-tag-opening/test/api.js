import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isOpening } from "../dist/is-html-tag-opening.esm.js";

// API
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${32}m${`API`}\u001b[${39}m`} - throws`, () => {
  throws(
    () => {
      isOpening();
    },
    /THROW_ID_01/,
    "01.01"
  );
});

test(`02 - ${`\u001b[${32}m${`API`}\u001b[${39}m`} - throws`, () => {
  throws(
    () => {
      isOpening(true);
    },
    /THROW_ID_01/,
    "02.01"
  );
});

test(`03 - ${`\u001b[${32}m${`API`}\u001b[${39}m`} - throws`, () => {
  throws(
    () => {
      isOpening({ a: 1 });
    },
    /THROW_ID_01/,
    "03.01"
  );
});

test(`04 - ${`\u001b[${32}m${`API`}\u001b[${39}m`} - throws`, () => {
  throws(
    () => {
      isOpening("z", true);
    },
    /THROW_ID_02/,
    "04.01"
  );
});

test(`05 - ${`\u001b[${32}m${`API`}\u001b[${39}m`} - throws`, () => {
  throws(
    () => {
      isOpening("z", false);
    },
    /THROW_ID_02/,
    "05.01"
  );
});

test(`06 - ${`\u001b[${32}m${`API`}\u001b[${39}m`} - throws`, () => {
  throws(
    () => {
      isOpening("z", null);
    },
    /THROW_ID_02/,
    "06.01"
  );
});

test.run();
