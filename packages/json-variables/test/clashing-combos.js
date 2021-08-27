/* eslint no-template-curly-in-string: 0 */

import tap from "tap";
import { jVar } from "../dist/json-variables.esm.js";

tap.test(
  "01 - surrounding underscores - sneaky similarity with wrong side brackets #1",
  (t) => {
    t.strictSame(
      jVar({
        a: "joined with an underscores: %%_var1_%%_%%_var2_%%",
        b: "something",
        var1: "value1",
        var2: "value2",
      }),
      {
        a: "joined with an underscores: value1_value2",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      "01"
    );
    t.end();
  }
);

tap.test(
  "02 - surrounding underscores - sneaky similarity with wrong side brackets #2",
  (t) => {
    t.strictSame(
      jVar({
        a: "joined with an dashes: %%-var1-%%-%%-var2-%%",
        b: "something",
        var1: "value1",
        var2: "value2",
      }),
      {
        a: "joined with an dashes: value1-value2",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      "02"
    );
    t.end();
  }
);

tap.test(
  "03 - surrounding underscores - sneaky similarity with wrong side brackets #3",
  (t) => {
    t.strictSame(
      jVar({
        a: "zzz_%%-var1-%%_%%-var2-%%_yyy",
        b: "something",
        var1: "value1",
        var2: "value2",
      }),
      {
        a: "zzz_value1_value2_yyy",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      "03"
    );
    t.end();
  }
);

tap.test(
  "04 - surrounding underscores - sneaky similarity with wrong side brackets #4",
  (t) => {
    t.strictSame(
      jVar({
        a: "zzz_%%-var1-%%_%%-var2-%%",
        b: "something",
        var1: "value1",
        var2: "value2",
      }),
      {
        a: "zzz_value1_value2",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      "04"
    );
    t.end();
  }
);

tap.test(
  "05 - surrounding dashes - sneaky similarity with wrong side brackets #1",
  (t) => {
    t.strictSame(
      jVar({
        a: "zzz-%%_var1_%%-%%_var2_%%-yyy",
        b: "something",
        var1: "value1",
        var2: "value2",
      }),
      {
        a: "zzz-value1-value2-yyy",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      "05"
    );
    t.end();
  }
);

tap.test(
  "06 - surrounding dashes - sneaky similarity with wrong side brackets #2",
  (t) => {
    t.strictSame(
      jVar({
        a: "zzz-%%_var1_%%-%%_var2_%%",
        b: "something",
        var1: "value1",
        var2: "value2",
      }),
      {
        a: "zzz-value1-value2",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      "06"
    );
    t.end();
  }
);
