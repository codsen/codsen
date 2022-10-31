/* eslint no-template-curly-in-string: 0 */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { jVar } from "../dist/json-variables.esm.js";

test("01 - arrays referencing values which are strings", () => {
  equal(
    jVar({
      a: ["Some text %%_d_%% some more text %%_c_%%"],
      b: ["Some text %%_c_%%, some more text %%_d_%%"],
      c: "cval",
      d: "dval",
    }),
    {
      a: ["Some text dval some more text cval"],
      b: ["Some text cval, some more text dval"],
      c: "cval",
      d: "dval",
    },
    "01.01"
  );
});

test("02 - arrays referencing values which are arrays", () => {
  equal(
    jVar({
      a: ["Some text %%_b_%% some more text %%_c_%%", "%%_c_%%", "%%_d_%%"],
      b: ["zzz", "Some text %%_c_%%, some more text %%_d_%%"],
      c: ["c1", "c2"],
      d: "dval",
    }),
    {
      a: [
        "Some text zzzSome text c1c2, some more text dval some more text c1c2",
        "c1c2",
        "dval",
      ],
      b: ["zzz", "Some text c1c2, some more text dval"],
      c: ["c1", "c2"],
      d: "dval",
    },
    "02.01"
  );
});

test("03 - arrays, whitelisting as string", () => {
  equal(
    jVar(
      {
        title: [
          "something",
          "Some text %%_subtitle_%%",
          "%%_submarine_%%",
          "anything",
        ],
        subtitle: "text",
        submarine: "ship",
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: [],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      title: ["something", "Some text {text}", "{ship}", "anything"],
      subtitle: "text",
      submarine: "ship",
    },
    "03.01 - base - no ignores"
  );
  equal(
    jVar(
      {
        title: [
          "something",
          "Some text %%_subtitle_%%",
          "%%_submarine_%%",
          "anything",
        ],
        subtitle: "text",
        submarine: "ship",
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: "sub*",
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      title: ["something", "Some text text", "ship", "anything"],
      subtitle: "text",
      submarine: "ship",
    },
    "03.02 - string whitelist startsWith"
  );
});

test("04 - arrays, whitelisting as array #1", () => {
  equal(
    jVar(
      {
        title: [
          "something",
          "Some text %%_subtitle_%%",
          "%%_submarine_%%",
          "anything",
        ],
        subtitle: "text",
        submarine: "ship",
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["subt*"],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      title: ["something", "Some text text", "{ship}", "anything"],
      subtitle: "text",
      submarine: "ship",
    },
    "04.01"
  );
  equal(
    jVar(
      {
        title: [
          "something",
          "Some text %%_subtitle_%%",
          "%%_submarine_%%",
          "anything",
        ],
        subtitle: "text",
        submarine: "ship",
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["zzz*", "subt*", "subm*"],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      title: ["something", "Some text text", "ship", "anything"],
      subtitle: "text",
      submarine: "ship",
    },
    "04.02 - two ignores in an array"
  );
  equal(
    jVar(
      {
        title: [
          "something",
          "Some text %%_subtitle_%%",
          "%%_submarine_%%",
          "anything",
        ],
        subtitle: "text",
        submarine: "ship",
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["*zzz", "*le", "*ne"],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      title: ["something", "Some text text", "ship", "anything"],
      subtitle: "text",
      submarine: "ship",
    },
    "04.03 - two ignores in an array startsWith"
  );
  equal(
    jVar(
      {
        title: [
          "something",
          "Some text %%_subtitle_%%",
          "%%_submarine_%%",
          "anything",
        ],
        subtitle: "text",
        submarine: "ship",
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["*zzz", "*le", "*yyy"],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      title: ["something", "Some text text", "{ship}", "anything"],
      subtitle: "text",
      submarine: "ship",
    },
    "04.04 - two ignores in an array, endsWith"
  );
});

test("05 - arrays, whitelisting as array #2", () => {
  equal(
    jVar(
      {
        title: [
          "something",
          "Some text %%_subtitle_%%",
          "%%_submarine_%%",
          "anything",
        ],
        title_data: {
          subtitle: "text",
          submarine: "ship",
        },
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["*zzz", "*le", "*yyy"],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      title: ["something", "Some text text", "{ship}", "anything"],
      title_data: {
        subtitle: "text",
        submarine: "ship",
      },
    },
    "05.01 - two ignores in an array, data store"
  );
  equal(
    jVar(
      {
        a: {
          title: "%%_whatnot_%%",
          title_data: {
            subtitle: "SUB",
          },
          whatnot: "%%_submarine_%%",
          whatnot_data: {
            submarine: "ship",
          },
        },
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["*zzz", "*le", "*yyy"],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      a: {
        title: "{ship}",
        title_data: {
          subtitle: "SUB",
        },
        whatnot: "{ship}",
        whatnot_data: {
          submarine: "ship",
        },
      },
    },
    "05.02 - does not wrap SUB"
  );
  equal(
    jVar(
      {
        a: {
          title: [
            "something",
            "Some text %%_subtitle_%%",
            "%%_whatnot_%%",
            "anything",
          ],
          title_data: {
            subtitle: "SUB",
          },
          whatnot: "%%_submarine_%%",
          whatnot_data: {
            submarine: "ship",
          },
        },
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["*zzz", "*le", "*yyy"],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      a: {
        title: ["something", "Some text SUB", "{ship}", "anything"],
        title_data: {
          subtitle: "SUB",
        },
        whatnot: "{ship}",
        whatnot_data: {
          submarine: "ship",
        },
      },
    },
    "05.03 - does not wrap SUB"
  );
  equal(
    jVar(
      {
        title: [
          "something",
          "Some text %%_subtitle_%%",
          "%%_whatnot_%%",
          "anything",
        ],
        title_data: {
          subtitle: "SUB",
        },
        whatnot: "%%_submarine_%%",
        whatnot_data: {
          submarine: "ship",
        },
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["*zzz", "*yyy"],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      title: ["something", "Some text {SUB}", "{ship}", "anything"],
      title_data: {
        subtitle: "SUB",
      },
      whatnot: "{ship}",
      whatnot_data: {
        submarine: "ship",
      },
    },
    "05.04 - wraps SUB"
  );

  throws(() => {
    jVar(
      {
        title: [
          "something",
          "Some text %%_subtitle_%%",
          "%%_whatnot_%%",
          "anything",
        ],
        title_data: {
          subtitle: "SUB",
        },
        whatnot: "%%_submarine_%%",
        whatnot_data: {
          zzz: "yyy",
        },
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["*zzz", "*yyy"],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    );
  }, /THROW_ID_18/);
});

test.run();
