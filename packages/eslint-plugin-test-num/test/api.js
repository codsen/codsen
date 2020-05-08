/* eslint no-prototype-builtins: 0 */

import tap from "tap";
import api from "../dist/eslint-plugin-test-num.esm";

// 00. API wirings
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`api`}\u001b[${39}m`} - object is exported`,
  (t) => {
    t.is(typeof api, "object", "01");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`api`}\u001b[${39}m`} - object is exported`,
  (t) => {
    t.true(api.hasOwnProperty("rules"), "02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`api`}\u001b[${39}m`} - rule "correct-test-num" is exported`,
  (t) => {
    t.true(api.rules.hasOwnProperty("correct-test-num"), "03.01");
    t.is(typeof api.rules["correct-test-num"], "object", "03.02");
    t.true(api.rules["correct-test-num"].hasOwnProperty("create"), "03.03");
    t.is(typeof api.rules["correct-test-num"].create, "function", "03.04");
    t.end();
  }
);
