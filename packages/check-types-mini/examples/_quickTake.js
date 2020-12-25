// Quick Take

import { strict as assert } from "assert";
import { checkTypesMini } from "../dist/check-types-mini.esm.js";

assert.throws(() => {
  checkTypesMini(
    checkTypesMini(
      {
        // object to check
        option1: "setting1",
        option2: "false",
        option3: false,
      },
      {
        // reference defaults object
        option1: "setting1",
        option2: false,
        option3: false,
      }
    ),
    /not boolean but string/g
  );
});
