import tap from "tap";
import {
  allRules as allRulesESM,
  fixEnt as fix,
} from "../dist/string-fix-broken-named-entities.esm";
import { allRules as allRulesCJS } from "../dist/string-fix-broken-named-entities.cjs";
import { allRules as allRulesUMD } from "../dist/string-fix-broken-named-entities.umd";

tap.test(
  `01 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - 1st input arg is wrong`,
  (t) => {
    t.doesNotThrow(() => {
      fix("");
    }, "01.01");
    t.throws(() => {
      fix();
    }, /THROW_ID_01/);

    t.throws(() => {
      fix(true);
    }, /THROW_ID_01/);

    t.throws(() => {
      fix(0);
    }, /THROW_ID_01/);

    t.throws(() => {
      fix(1);
    }, /THROW_ID_01/);

    t.throws(() => {
      fix(null);
    }, /THROW_ID_01/);
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - 2nd input arg is wrong`,
  (t) => {
    t.throws(() => {
      fix("aaa", "bbb");
    }, /THROW_ID_02/);

    t.throws(() => {
      fix("aaa", true);
    }, /THROW_ID_02/);

    // does not throw on falsey:
    t.doesNotThrow(() => {
      fix("zzz", {});
    }, "02.03");
    t.doesNotThrow(() => {
      fix("zzz", undefined);
    }, "02.04");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - opts.cb is not function`,
  (t) => {
    t.throws(() => {
      fix("aaa", { cb: "bbb" });
    }, /THROW_ID_03/);
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - opts.entityCatcherCb is not function`,
  (t) => {
    t.throws(() => {
      fix("aaa", { entityCatcherCb: "bbb" });
    }, /THROW_ID_04/);
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - opts.progressFn is not function`,
  (t) => {
    t.throws(() => {
      fix("aaa", { progressFn: "bbb" });
    }, /THROW_ID_05/);
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${35}m${`throws`}\u001b[${39}m`} - opts.textAmpersandCatcherCb is not function`,
  (t) => {
    t.throws(() => {
      fix("aaa", { textAmpersandCatcherCb: "bbb" });
    }, /THROW_ID_06/);
    t.end();
  }
);

tap.test(`07 - all callbacks are undefined`, (t) => {
  t.doesNotThrow(() => {
    fix("&nsp;", {
      cb: undefined,
      entityCatcherCb: undefined,
      textAmpersandCatcherCb: undefined,
      progressFn: undefined,
    });
  }, "07");
  t.end();
});

tap.test(`08 - all callbacks are nulls`, (t) => {
  t.doesNotThrow(() => {
    fix("&nsp;", {
      cb: null,
      entityCatcherCb: null,
      textAmpersandCatcherCb: null,
      progressFn: null,
    });
  }, "08");
  t.end();
});

tap.test(
  `09 - there are at least twice as many possible rules as there are entities`,
  (t) => {
    t.ok(allRulesESM.length > 263 * 2, "09.01");
    t.equal(allRulesCJS.length, allRulesESM.length, "09.02");
    t.equal(allRulesUMD.length, allRulesESM.length, "09.03");
    t.end();
  }
);
