// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// opts.cb
// -----------------------------------------------------------------------------

test("001 - opts.cb - baseline", () => {
  // baseline, notice dirty whitespace:
  equal(
    stripHtml('<div style="display: inline !important;" >abc</ div>'),
    {
      result: "abc",
      ranges: [
        [0, 42],
        [45, 52],
      ],
      allTagLocations: [
        [0, 42],
        [45, 52],
      ],
      filteredTagLocations: [
        [0, 42],
        [45, 52],
      ],
    },
    "001.01",
  );
});

test("002 - opts.cb - baseline 2", () => {
  equal(
    stripHtml("<div >abc</ div>"),
    {
      result: "abc",
      ranges: [
        [0, 6],
        [9, 16],
      ],
      allTagLocations: [
        [0, 6],
        [9, 16],
      ],
      filteredTagLocations: [
        [0, 6],
        [9, 16],
      ],
    },
    "002.01",
  );
});

test("003 - opts.cb - replace hr with tralala", () => {
  let cb = ({
    // tag,
    deleteFrom,
    deleteTo,
    // insert,
    rangesArr,
    // proposedReturn
  }) => {
    rangesArr.push(deleteFrom, deleteTo, "<tralala>");
  };
  equal(
    stripHtml("abc<hr>def", { cb }),
    {
      result: "abc<tralala>def",
      ranges: [[3, 7, "<tralala>"]],
      allTagLocations: [[3, 7]],
      filteredTagLocations: [[3, 7]],
    },
    "003.01",
  );
});

test("004 - opts.cb - replace div with tralala", () => {
  let cb = ({
    tag,
    deleteFrom,
    deleteTo,
    // insert,
    rangesArr,
    // proposedReturn
  }) => {
    rangesArr.push(
      deleteFrom,
      deleteTo,
      `<${tag.slashPresent ? "/" : ""}tralala>`,
    );
  };
  equal(
    stripHtml("<div >abc</ div>", { cb }),
    {
      result: "<tralala>abc</tralala>",
      ranges: [
        [0, 6, "<tralala>"],
        [9, 16, "</tralala>"],
      ],
      allTagLocations: [
        [0, 6],
        [9, 16],
      ],
      filteredTagLocations: [
        [0, 6],
        [9, 16],
      ],
    },
    "004.01",
  );
});

test("005 - opts.cb - replace only hr", () => {
  let cb = ({
    tag,
    deleteFrom,
    deleteTo,
    // insert,
    rangesArr,
    // proposedReturn
  }) => {
    if (tag.name === "hr") {
      rangesArr.push(
        deleteFrom,
        deleteTo,
        `<${tag.slashPresent ? "/" : ""}tralala>`,
      );
    }
  };
  equal(
    stripHtml("abc<hr>def<span>ghi</span>jkl", { cb }),
    {
      result: "abc<tralala>def<span>ghi</span>jkl",
      ranges: [[3, 7, "<tralala>"]],
      allTagLocations: [
        [3, 7],
        [10, 16],
        [19, 26],
      ],
      filteredTagLocations: [
        [3, 7],
        [10, 16],
        [19, 26],
      ],
    },
    "005.01",
  );
});

test("006 - opts.cb - readme example one", () => {
  let cb = ({
    // tag,
    deleteFrom,
    deleteTo,
    insert,
    rangesArr,
    // proposedReturn
  }) => {
    rangesArr.push(deleteFrom, deleteTo, insert);
  };
  equal(
    stripHtml("abc<hr>def", { cb }),
    {
      result: "abc def",
      ranges: [[3, 7, " "]],
      allTagLocations: [[3, 7]],
      filteredTagLocations: [[3, 7]],
    },
    "006.01",
  );
});

test("007 - opts.cb - ignored tags are also being pinged, with null deletion range values", () => {
  let capturedTags = [];
  let cb = ({
    tag,
    deleteFrom,
    deleteTo,
    insert,
    rangesArr,
    // proposedReturn
  }) => {
    rangesArr.push(deleteFrom, deleteTo, insert);
    capturedTags.push(tag.name);
  };
  equal(
    stripHtml("abc<hr>def<br>ghi", { cb, ignoreTags: ["hr"] }),
    {
      result: "abc<hr>def ghi",
      ranges: [[10, 14, " "]],
      allTagLocations: [
        [3, 7],
        [10, 14],
      ],
      filteredTagLocations: [[10, 14]],
    },
    "007.01",
  );
  equal(capturedTags, ["hr", "br"], "007.02");
});

test("008 - opts.cb - cb.tag contents are correct on ignored tags", () => {
  let capturedTags = [];
  // const rangesArr = [];
  let cb = ({
    tag,
    // deleteFrom,
    // deleteTo,
    // insert
    // rangesArr
    // proposedReturn
  }) => {
    capturedTags.push(tag);
  };

  // notice there's no assigning to a variable, we just rely on a callback:
  stripHtml("a<br/>b", {
    cb,
    ignoreTags: ["b", "strong", "i", "em", "br", "sup"],
    onlyStripTags: [],
    stripTogetherWithTheirContents: ["script", "style", "xml"],
    skipHtmlDecoding: true,
    trimOnlySpaces: true,
    dumpLinkHrefsNearby: {
      enabled: false,
      putOnNewLine: false,
      wrapHeads: "",
      wrapTails: "",
    },
  });

  equal(
    capturedTags,
    [
      {
        attributes: [],
        lastClosingBracketAt: 5,
        lastOpeningBracketAt: 1,
        slashPresent: 4,
        leftOuterWhitespace: 1,
        onlyPlausible: false,
        nameStarts: 2,
        nameContainsLetters: true,
        nameEnds: 4,
        name: "br",
      },
    ],
    "008.01",
  );
});

test("009 - opts.cb - cb.tag contents are right on non-ignored tags", () => {
  let capturedTags = [];
  // const rangesArr = [];
  let cb = ({
    tag,
    // deleteFrom,
    // deleteTo,
    // insert
    // rangesArr
    // proposedReturn
  }) => {
    capturedTags.push(tag);
  };

  // notice there's no assigning to a variable, we just rely on a callback:
  stripHtml("abc<br >def<br>ghi<br/>jkl<br />mno", {
    cb,
    ignoreTags: ["b", "strong", "i", "em", "br", "sup"],
    onlyStripTags: [],
    stripTogetherWithTheirContents: ["script", "style", "xml"],
    skipHtmlDecoding: true,
    trimOnlySpaces: true,
    dumpLinkHrefsNearby: {
      enabled: false,
      putOnNewLine: false,
      wrapHeads: "",
      wrapTails: "",
    },
  });

  equal(
    capturedTags,
    [
      {
        attributes: [],
        lastClosingBracketAt: 7,
        lastOpeningBracketAt: 3,
        leftOuterWhitespace: 3,
        name: "br",
        nameContainsLetters: true,
        nameEnds: 6,
        nameStarts: 4,
        onlyPlausible: false,
        slashPresent: false,
      },
      {
        attributes: [],
        lastClosingBracketAt: 14,
        lastOpeningBracketAt: 11,
        leftOuterWhitespace: 11,
        name: "br",
        nameContainsLetters: true,
        nameEnds: 14,
        nameStarts: 12,
        onlyPlausible: false,
        slashPresent: false,
      },
      {
        attributes: [],
        lastClosingBracketAt: 22,
        lastOpeningBracketAt: 18,
        leftOuterWhitespace: 18,
        name: "br",
        nameContainsLetters: true,
        nameEnds: 21,
        nameStarts: 19,
        onlyPlausible: false,
        slashPresent: 21,
      },
      {
        attributes: [],
        lastClosingBracketAt: 31,
        lastOpeningBracketAt: 26,
        leftOuterWhitespace: 26,
        name: "br",
        nameContainsLetters: true,
        nameEnds: 29,
        nameStarts: 27,
        onlyPlausible: false,
        slashPresent: 30,
      },
    ],
    "009.01",
  );
});

test("010 - opts.cb - combined pair range includes the closing bracket", () => {
  const input = '<a href="test">123</a>';
  const gathered = [];

  stripHtml(input, {
    skipHtmlDecoding: true,
    stripTogetherWithTheirContents: ["*"],
    cb: ({ deleteFrom, deleteTo, insert, proposedReturn }) => {
      gathered.push({ deleteFrom, deleteTo, insert, proposedReturn });
    },
  });

  equal(
    gathered,
    [
      {
        deleteFrom: 0,
        deleteTo: 15,
        insert: undefined,
        proposedReturn: [0, 15, undefined],
      },
      {
        deleteFrom: 18,
        deleteTo: 22,
        insert: null,
        proposedReturn: [18, 22, null],
      },
      {
        deleteFrom: 0,
        deleteTo: 22,
        insert: "",
        proposedReturn: [0, 22, ""],
      },
    ],
    "010.01",
  );
});

test("011 - opts.cb - combined pair scalar and tuple ranges agree before punctuation", () => {
  const input = "<a>x</a>.";
  const opts = {
    skipHtmlDecoding: true,
    stripTogetherWithTheirContents: ["*"],
  };
  const scalarEvents = [];

  const scalarForwarded = stripHtml(input, {
    ...opts,
    cb: ({ deleteFrom, deleteTo, insert, rangesArr, proposedReturn }) => {
      scalarEvents.push({ deleteFrom, deleteTo, insert, proposedReturn });
      if (proposedReturn) {
        rangesArr.push(deleteFrom, deleteTo, insert);
      }
    },
  });
  const tupleForwarded = stripHtml(input, {
    ...opts,
    cb: ({ rangesArr, proposedReturn }) => {
      if (proposedReturn) {
        rangesArr.push(...proposedReturn);
      }
    },
  });

  equal(
    scalarEvents.map(({ deleteFrom, deleteTo, insert }) => [
      deleteFrom,
      deleteTo,
      insert,
    ]),
    scalarEvents.map(({ proposedReturn }) => proposedReturn),
    "011.01",
  );
  equal(scalarForwarded.result, ".", "011.02");
  equal(tupleForwarded.result, ".", "011.03");
});

test("012 - opts.cb - forwarding reproduces callback-free output", () => {
  const inputs = [
    "<!--x-->y",
    "<![CDATA[x]]>y",
    "<article><p>text</p></article>",
    "<script>x</script>",
    "<div",
    "text<br>",
  ];

  for (const trimOnlySpaces of [false, true]) {
    for (const input of inputs) {
      const opts = { skipHtmlDecoding: true, trimOnlySpaces };
      const expected = stripHtml(input, opts);
      const scalarForwarded = stripHtml(input, {
        ...opts,
        cb: ({ deleteFrom, deleteTo, insert, rangesArr, proposedReturn }) => {
          if (proposedReturn) {
            rangesArr.push(deleteFrom, deleteTo, insert);
          }
        },
      });
      const tupleForwarded = stripHtml(input, {
        ...opts,
        cb: ({ rangesArr, proposedReturn }) => {
          if (proposedReturn) {
            rangesArr.push(...proposedReturn);
          }
        },
      });

      equal(scalarForwarded, expected, "012.01");
      equal(tupleForwarded, expected, "012.02");
    }
  }
});

test("013 - opts.cb - a callback can reject every proposed deletion", () => {
  for (const input of [
    "<!--x-->y",
    "<![CDATA[x]]>y",
    "<article><p>text</p></article>",
    "<script>x</script>",
    "<div",
    "text<br>",
  ]) {
    const actual = stripHtml(input, {
      skipHtmlDecoding: true,
      cb: () => {},
    });

    equal(actual.result, input, "013.01");
    equal(actual.ranges, null, "013.02");
  }
});

test("014 - opts.cb - custom edge replacements are not normalized as defaults", () => {
  const replacePhysicalTag = (replacement) => ({
    skipHtmlDecoding: true,
    cb: ({ tag, rangesArr }) => {
      rangesArr.push(
        tag.lastOpeningBracketAt,
        tag.lastClosingBracketAt + 1,
        replacement,
      );
    },
  });

  const leading = stripHtml("<b> a", replacePhysicalTag(" Z "));
  const trailing = stripHtml("a <b>", replacePhysicalTag("Z"));

  equal(leading.result, " Z  a", "014.01");
  equal(leading.ranges, [[0, 3, " Z "]], "014.02");
  equal(trailing.result, "a Z", "014.03");
  equal(trailing.ranges, [[2, 5, "Z"]], "014.04");
});

test.run();
