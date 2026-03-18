// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { del, set } from "../dist/edit-package-json.esm.js";

// various throws
// -----------------------------------------------------------------------------

test(`01 - api - ${`\u001b[${33}m${"set"}\u001b[${39}m`} - wrong/missing 1st arg = throw`, () => {
  // throw test pinning:
  throws(
    () => {
      set();
    },
    /THROW_ID_01/,
    "01.01",
  );

  throws(
    () => {
      set("");
    },
    /THROW_ID_01/,
    "01.02",
  );

  throws(
    () => {
      set(null);
    },
    /THROW_ID_01/,
    "01.03",
  );

  throws(
    () => {
      set(undefined);
    },
    /THROW_ID_01/,
    "01.04",
  );

  throws(
    () => {
      set(true);
    },
    /THROW_ID_01/,
    "01.05",
  );
});

test(`02 - api - ${`\u001b[${32}m${"del"}\u001b[${39}m`} - wrong/missing 1st arg = throw`, () => {
  // throw test pinning:
  throws(
    () => {
      del();
    },
    /THROW_ID_02/,
    "02.01",
  );

  throws(
    () => {
      del("");
    },
    /THROW_ID_02/,
    "02.02",
  );

  throws(
    () => {
      del(null);
    },
    /THROW_ID_02/,
    "02.03",
  );

  throws(
    () => {
      del(undefined);
    },
    /THROW_ID_02/,
    "02.04",
  );

  throws(
    () => {
      del(true);
    },
    /THROW_ID_02/,
    "02.05",
  );
});

test.run();
