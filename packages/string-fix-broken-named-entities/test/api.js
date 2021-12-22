import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  allRules as allRulesESM,
  fixEnt as fix,
} from "../dist/string-fix-broken-named-entities.esm.js";

test(`01 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - 1st input arg is wrong`, () => {
  not.throws(() => {
    fix("");
  }, "01.01");
  throws(() => {
    fix();
  }, /THROW_ID_01/);

  throws(() => {
    fix(true);
  }, /THROW_ID_01/);

  throws(() => {
    fix(0);
  }, /THROW_ID_01/);

  throws(() => {
    fix(1);
  }, /THROW_ID_01/);

  throws(() => {
    fix(null);
  }, /THROW_ID_01/);
});

test(`02 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - 2nd input arg is wrong`, () => {
  throws(() => {
    fix("aaa", "bbb");
  }, /THROW_ID_02/);

  throws(() => {
    fix("aaa", true);
  }, /THROW_ID_02/);

  // does not throw on falsey:
  not.throws(() => {
    fix("zzz", {});
  }, "02.03");
  not.throws(() => {
    fix("zzz", undefined);
  }, "02.04");
});

test(`03 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - opts.cb is not function`, () => {
  throws(() => {
    fix("aaa", { cb: "bbb" });
  }, /THROW_ID_03/);
});

test(`04 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - opts.entityCatcherCb is not function`, () => {
  throws(() => {
    fix("aaa", { entityCatcherCb: "bbb" });
  }, /THROW_ID_04/);
});

test(`05 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - opts.progressFn is not function`, () => {
  throws(() => {
    fix("aaa", { progressFn: "bbb" });
  }, /THROW_ID_05/);
});

test(`06 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - opts.textAmpersandCatcherCb is not function`, () => {
  throws(() => {
    fix("aaa", { textAmpersandCatcherCb: "bbb" });
  }, /THROW_ID_06/);
});

test(`07 - all callbacks are undefined`, () => {
  not.throws(() => {
    fix("&nsp;", {
      cb: undefined,
      entityCatcherCb: undefined,
      textAmpersandCatcherCb: undefined,
      progressFn: undefined,
    });
  }, "07");
});

test(`08 - all callbacks are nulls`, () => {
  not.throws(() => {
    fix("&nsp;", {
      cb: null,
      entityCatcherCb: null,
      textAmpersandCatcherCb: null,
      progressFn: null,
    });
  }, "08");
});

test(`09 - there are at least twice as many possible rules as there are entities`, () => {
  ok(allRulesESM.length > 263 * 2, "09");
});

test.run();
