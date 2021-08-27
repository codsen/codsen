/* eslint no-template-curly-in-string: 0 */

import tap from "tap";
import { jVar } from "../dist/json-variables.esm.js";

tap.test("01 - two-level querying, normal keys in the root", (t) => {
  t.strictSame(
    jVar({
      a: "some text %%_var1.key3_%% more text %%_var2.key6_%%",
      b: "something",
      var1: {
        key1: "value1",
        key2: "value2",
        key3: "value3",
        key4: "value4",
      },
      var2: {
        key5: "value5",
        key6: "value6",
        key7: "value7",
        key8: "value8",
      },
    }),
    {
      a: "some text value3 more text value6",
      b: "something",
      var1: {
        key1: "value1",
        key2: "value2",
        key3: "value3",
        key4: "value4",
      },
      var2: {
        key5: "value5",
        key6: "value6",
        key7: "value7",
        key8: "value8",
      },
    },
    "01 - running on default notation"
  );
  t.end();
});

tap.test(
  "02 - two-level querying, normal keys in the root + wrapping & opts",
  (t) => {
    t.strictSame(
      jVar(
        {
          a: "some text %%_var1.key3_%% more text %%_var2.key6_%%",
          b: "something",
          var1: {
            key1: "value1",
            key2: "value2",
            key3: "value3",
            key4: "value4",
          },
          var2: {
            key5: "value5",
            key6: "value6",
            key7: "value7",
            key8: "value8",
          },
        },
        {
          lookForDataContainers: true,
          dataContainerIdentifierTails: "_data",
          wrapHeadsWith: "{",
          wrapTailsWith: "}",
          dontWrapVars: ["*zzz", "var1.*", "*key6"],
          preventDoubleWrapping: true,
          wrapGlobalFlipSwitch: true,
        }
      ),
      {
        a: "some text value3 more text value6",
        b: "something",
        var1: {
          key1: "value1",
          key2: "value2",
          key3: "value3",
          key4: "value4",
        },
        var2: {
          key5: "value5",
          key6: "value6",
          key7: "value7",
          key8: "value8",
        },
      },
      "02.01 - didn't wrap either, first level caught"
    );

    t.strictSame(
      jVar(
        {
          a: "some text %%_var1.key3_%% more text %%_var2.key6_%%",
          b: "something",
          var1: {
            key1: "value1",
            key2: "value2",
            key3: "value3",
            key4: "value4",
          },
          var2: {
            key5: "value5",
            key6: "value6",
            key7: "value7",
            key8: "value8",
          },
        },
        {
          lookForDataContainers: true,
          dataContainerIdentifierTails: "_data",
          wrapHeadsWith: "{",
          wrapTailsWith: "}",
          dontWrapVars: ["*zzz", "*3", "*9"],
          preventDoubleWrapping: true,
          wrapGlobalFlipSwitch: true,
        }
      ),
      {
        a: "some text value3 more text {value6}",
        b: "something",
        var1: {
          key1: "value1",
          key2: "value2",
          key3: "value3",
          key4: "value4",
        },
        var2: {
          key5: "value5",
          key6: "value6",
          key7: "value7",
          key8: "value8",
        },
      },
      "02.02 - didn't wrap one, second level caught"
    );

    t.strictSame(
      jVar(
        {
          a: "some text %%_var1.key3_%% more text %%_var2.key6_%%",
          b: "something",
          var1: {
            key1: "value1",
            key2: "value2",
            key3: "value3",
            key4: "value4",
          },
          var2: {
            key5: "value5",
            key6: "value6",
            key7: "value7",
            key8: "value8",
          },
        },
        {
          lookForDataContainers: true,
          dataContainerIdentifierTails: "_data",
          dontWrapVars: ["*zzz", "key3", "key6"],
          preventDoubleWrapping: true,
          wrapGlobalFlipSwitch: true,
        }
      ),
      {
        a: "some text value3 more text value6",
        b: "something",
        var1: {
          key1: "value1",
          key2: "value2",
          key3: "value3",
          key4: "value4",
        },
        var2: {
          key5: "value5",
          key6: "value6",
          key7: "value7",
          key8: "value8",
        },
      },
      "02.03 - didn't wrap either, second levels caught"
    );

    t.strictSame(
      jVar(
        {
          a: "some text %%-var1.key3-%% more text %%-var2.key6-%%",
          b: "something",
          var1: {
            key1: "value1",
            key2: "value2",
            key3: "value3",
            key4: "value4",
          },
          var2: {
            key5: "value5",
            key6: "value6",
            key7: "value7",
            key8: "value8",
          },
        },
        {
          lookForDataContainers: true,
          dataContainerIdentifierTails: "_data",
          wrapHeadsWith: "whatever,",
          wrapTailsWith: "it won't be used anyway",
          dontWrapVars: ["*zzz", "*3", "*9"],
          preventDoubleWrapping: true,
          wrapGlobalFlipSwitch: true,
        }
      ),
      {
        a: "some text value3 more text value6",
        b: "something",
        var1: {
          key1: "value1",
          key2: "value2",
          key3: "value3",
          key4: "value4",
        },
        var2: {
          key5: "value5",
          key6: "value6",
          key7: "value7",
          key8: "value8",
        },
      },
      "02.04 - didn't wrap either because of %%- the non-wrapping notation."
    );

    t.strictSame(
      jVar(
        {
          a: "some text %%-var1.key3-%% more text %%-var2.key6-%%",
          b: "something",
          var1: {
            key1: "value1",
            key2: "value2",
            key3: "value3",
            key4: "value4",
          },
          var2: {
            key5: "value5",
            key6: "value6",
            key7: "value7",
            key8: "value8",
          },
        },
        {
          lookForDataContainers: true,
          dataContainerIdentifierTails: "_data",
          wrapHeadsWith: "whatever,",
          wrapTailsWith: "it won't be used anyway",
          dontWrapVars: [],
          preventDoubleWrapping: true,
          wrapGlobalFlipSwitch: true,
        }
      ),
      {
        a: "some text value3 more text value6",
        b: "something",
        var1: {
          key1: "value1",
          key2: "value2",
          key3: "value3",
          key4: "value4",
        },
        var2: {
          key5: "value5",
          key6: "value6",
          key7: "value7",
          key8: "value8",
        },
      },
      "02.05"
    );
    t.end();
  }
);

tap.test("03 - opts.throwWhenNonStringInsertedInString", (t) => {
  t.throws(() => {
    jVar(
      {
        a: "some text %%_var1_%% more text %%_var2_%%",
        b: "something",
        var1: { key1: "value1", key2: "value2" },
        var2: { key3: "value3", key4: "value4" },
      },
      {
        throwWhenNonStringInsertedInString: true,
      }
    );
  }, /THROW_ID_23/);

  t.doesNotThrow(() => {
    jVar({
      a: "some text %%_var1_%% more text %%_var2_%%",
      b: "something",
      var1: { key1: "value1", key2: "value2" },
      var2: { key3: "value3", key4: "value4" },
    });
  }, "03.02");

  // then, also, pin the whole-value-variables

  t.strictSame(
    jVar({
      a: "%%-var1-%%",
      var1: null,
      b: "%%-var2-%%",
      var2: false,
    }),
    {
      a: null,
      var1: null,
      b: false,
      var2: false,
    },
    "03.03 - no path, values are variables in whole"
  );

  t.strictSame(
    jVar({
      a: "%%_var1.key1_%%",
      var1: { key1: null },
      b: "%%_var2.key2_%%",
      var2: { key2: false },
    }),
    {
      a: null,
      var1: { key1: null },
      b: false,
      var2: { key2: false },
    },
    "03.04 - control"
  );

  t.strictSame(
    jVar(
      {
        a: "%%_var1.key1_%%",
        var1: { key1: null },
        b: "%%_var2.key2_%%",
        var2: { key2: false },
      },
      { throwWhenNonStringInsertedInString: true }
    ),
    {
      a: null,
      var1: { key1: null },
      b: false,
      var2: { key2: false },
    },
    "03.05 - opts"
  );
  t.end();
});

tap.test("04 - multi-level + from array + root data store + ignores", (t) => {
  t.strictSame(
    jVar(
      {
        title: [
          "something",
          "Some text %%_subtitle.aaa_%%",
          "%%_submarine.bbb_%%",
          "anything",
        ],
        title_data: {
          subtitle: { aaa: "text" },
          submarine: { bbb: "ship" },
        },
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["*zzz", "*.aaa", "*yyy"],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      title: ["something", "Some text text", "{ship}", "anything"],
      title_data: {
        subtitle: { aaa: "text" },
        submarine: { bbb: "ship" },
      },
    },
    "04 - two ignores in an array, data store, multi-level"
  );
  t.end();
});
