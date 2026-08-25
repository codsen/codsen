// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { rApply } from "ranges-apply";
import { Ranges } from "ranges-push";
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
        kind: "tag",
        start: 1,
        end: 6,
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
        status: "complete",
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
        kind: "tag",
        start: 3,
        end: 8,
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
        status: "complete",
      },
      {
        kind: "tag",
        start: 11,
        end: 15,
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
        status: "complete",
      },
      {
        kind: "tag",
        start: 18,
        end: 23,
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
        status: "complete",
      },
      {
        kind: "tag",
        start: 26,
        end: 32,
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
        status: "complete",
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

test("015 - opts.cb - decoded input exposes only original coordinates", () => {
  const prefix = "&copy;x";
  const opening =
    "&#x26;lt;b title&equals;&quot;&amp;🌟&#127775;&quot;&#x26;gt;";
  const between = "&amp;🌟";
  const closing = "&#x26;lt;&sol;b&#x26;gt;";
  const input = `${prefix}${opening}${between}${closing}z`;
  const openingStart = prefix.length;
  const openingEnd = openingStart + opening.length;
  const closingStart = openingEnd + between.length;
  const closingEnd = closingStart + closing.length;
  const events = [];

  const forwarded = stripHtml(input, {
    cb: ({
      tag,
      deleteFrom,
      deleteTo,
      insert,
      rangesArr,
      proposedReturn,
    }) => {
      events.push({
        tag,
        deleteFrom,
        deleteTo,
        insert,
        proposedReturn,
        rangesAtEntry: rangesArr.current(),
      });
      if (proposedReturn) {
        rangesArr.push(...proposedReturn);
      }
    },
  });

  equal(forwarded, stripHtml(input), "015.01");
  equal(forwarded.result, "©x&🌟z", "015.02");
  equal(rApply(input, forwarded.ranges), forwarded.result, "015.03");
  equal(events.length, 2, "015.04");
  equal(
    [events[0].deleteFrom, events[0].deleteTo, events[0].insert],
    events[0].proposedReturn,
    "015.05",
  );
  equal(
    [events[1].deleteFrom, events[1].deleteTo, events[1].insert],
    events[1].proposedReturn,
    "015.06",
  );
  equal(events[0].proposedReturn.slice(0, 2), [openingStart, openingEnd], "015.07");
  equal(events[1].proposedReturn.slice(0, 2), [closingStart, closingEnd], "015.08");
  equal(events[0].rangesAtEntry, null, "015.09");
  equal(events[1].rangesAtEntry, [[openingStart, openingEnd]], "015.10");
  equal(
    input.slice(
      events[0].tag.lastOpeningBracketAt,
      events[0].tag.lastClosingBracketAt + 1,
    ),
    opening,
    "015.11",
  );
  equal(
    input.slice(events[0].tag.nameStarts, events[0].tag.nameEnds),
    "b",
    "015.12",
  );
  equal(
    input.slice(
      events[0].tag.attributes[0].nameStarts,
      events[0].tag.attributes[0].nameEnds,
    ),
    "title",
    "015.13",
  );
  equal(
    input.slice(
      events[0].tag.attributes[0].equalsAt,
      events[0].tag.attributes[0].equalsAt + "&equals;".length,
    ),
    "&equals;",
    "015.14",
  );
  equal(
    input.slice(
      events[0].tag.attributes[0].valueStarts,
      events[0].tag.attributes[0].valueEnds,
    ),
    "&amp;🌟&#127775;",
    "015.15",
  );
  equal(events[0].tag.attributes[0].value, "&🌟🌟", "015.16");
  equal(
    input.slice(
      events[1].tag.lastOpeningBracketAt,
      events[1].tag.lastClosingBracketAt + 1,
    ),
    closing,
    "015.17",
  );
  equal(
    input.slice(
      events[1].tag.slashPresent,
      events[1].tag.slashPresent + "&sol;".length,
    ),
    "&sol;",
    "015.18",
  );
  equal(forwarded.allTagLocations, [
    [openingStart, openingEnd],
    [closingStart, closingEnd],
  ], "015.19");
});

test("016 - opts.cb - arbitrary original-coordinate ranges remain exact", () => {
  const input = "A&amp;<b>B</b>C";
  let edited = false;
  let callbackRanges;

  const actual = stripHtml(input, {
    cb: ({ rangesArr }) => {
      callbackRanges = rangesArr;
      if (!edited) {
        edited = true;
        rangesArr.push(2, 4, "X");
      }
    },
  });

  ok(callbackRanges instanceof Ranges, "016.01");
  equal(actual.result, "A&Xp;<b>B</b>C", "016.02");
  equal(actual.ranges, [[2, 4, "X"]], "016.03");
  equal(callbackRanges.current(), actual.ranges, "016.04");
  equal(rApply(input, actual.ranges), actual.result, "016.05");
  equal(actual.allTagLocations, [
    [6, 9],
    [10, 14],
  ], "016.06");
});

test("017 - opts.cb - skipped decoding is an identity coordinate mapping", () => {
  const input = '&amp;<b title="&copy;">x</b>';
  const tags = [];
  const actual = stripHtml(input, {
    skipHtmlDecoding: true,
    cb: ({ tag, rangesArr, proposedReturn }) => {
      tags.push(tag);
      if (proposedReturn) {
        rangesArr.push(...proposedReturn);
      }
    },
  });

  equal(actual, stripHtml(input, { skipHtmlDecoding: true }), "017.01");
  equal(input.slice(tags[0].nameStarts, tags[0].nameEnds), "b", "017.02");
  equal(
    input.slice(
      tags[0].attributes[0].valueStarts,
      tags[0].attributes[0].valueEnds,
    ),
    "&copy;",
    "017.03",
  );
});

test("018 - opts.cb - dirty-tag recognition is callback-independent", () => {
  const cases = [
    'hat > head class="z"> shoulders',
    "hat > head class='z'> shoulders",
    "hat > head /> shoulders",
    "hat > head / > shoulders",
  ];

  for (const input of cases) {
    const baseline = stripHtml(input);
    const forwardedEvents = [];
    const forwarded = stripHtml(input, {
      cb: (event) => {
        forwardedEvents.push(event);
        if (event.proposedReturn) {
          event.rangesArr.push(...event.proposedReturn);
        }
      },
    });
    const ignoredEvents = [];
    const ignored = stripHtml(input, {
      cb: (event) => {
        ignoredEvents.push(event);
      },
    });

    equal(forwarded, baseline, "018.01");
    equal(forwardedEvents.length, 1, "018.02");
    equal(ignoredEvents.length, 1, "018.03");
    equal(ignored.allTagLocations, baseline.allTagLocations, "018.04");
    equal(
      ignored.filteredTagLocations,
      baseline.filteredTagLocations,
      "018.05",
    );
    equal(ignored.result, input, "018.06");
    equal(
      forwardedEvents[0].proposedReturn,
      baseline.ranges[0],
      "018.07",
    );
  }
});

test("019 - opts.cb - rejected dirty candidates emit no event", () => {
  const input = "hat > head > shoulders";
  let eventCount = 0;
  const actual = stripHtml(input, {
    cb: () => {
      eventCount += 1;
    },
  });

  equal(actual.result, input, "019.01");
  equal(actual.allTagLocations, [], "019.02");
  equal(actual.filteredTagLocations, [], "019.03");
  equal(eventCount, 0, "019.04");
});

test("020 - opts.cb - dirty-tag probes do not reuse progress hooks", () => {
  const input = `head class="${"x".repeat(2100)}">tail`;
  const percentages = [];
  const actual = stripHtml(input, {
    reportProgressFunc: (percentage) => {
      percentages.push(percentage);
    },
  });

  ok(percentages.length > 0, "020.01");
  ok(
    percentages.every(
      (percentage, index) => !index || percentage > percentages[index - 1],
    ),
    "020.02",
  );
  equal(actual.allTagLocations, [[0, input.length - 4]], "020.03");
  equal(actual.result, "tail", "020.04");
});

test("021 - opts.cb - malformed candidates finalize once with fresh state", () => {
  const cases = [
    {
      input: "<div<span<em>x</em>",
      result: "x",
      locations: [
        [0, 4],
        [4, 9],
        [9, 13],
        [14, 19],
      ],
      names: ["div", "span", "em", "em"],
      attributes: [[], [], [], []],
    },
    {
      input: "</div<span>x</span>",
      result: "x",
      locations: [
        [0, 5],
        [5, 11],
        [12, 19],
      ],
      names: ["div", "span", "span"],
      attributes: [[], [], []],
    },
    {
      input: '<div class="x"<span>x</span>',
      result: "x",
      locations: [
        [0, 14],
        [14, 20],
        [21, 28],
      ],
      names: ["div", "span", "span"],
      attributes: [["class"], [], []],
    },
    {
      input: "<div<!--x-->",
      result: "",
      locations: [
        [0, 4],
        [4, 12],
      ],
      names: ["div", null],
      attributes: [[], []],
    },
  ];

  for (const expected of cases) {
    const events = [];
    const snapshots = [];
    const actual = stripHtml(expected.input, {
      cb: (event) => {
        events.push(event);
        snapshots.push(JSON.stringify(event.tag));
        if (event.proposedReturn) {
          event.rangesArr.push(...event.proposedReturn);
        }
      },
    });

    equal(actual.result, expected.result, "021.01");
    equal(actual.allTagLocations, expected.locations, "021.02");
    equal(actual.filteredTagLocations, expected.locations, "021.03");
    equal(events.length, expected.locations.length, "021.04");
    equal(
      events.map(({ proposedReturn }) => proposedReturn?.slice(0, 2)),
      expected.locations,
      "021.05",
    );
    equal(
      events.map(({ tag }) => tag.name ?? null),
      expected.names,
      "021.06",
    );
    equal(
      events.map(({ tag }) =>
        (tag.attributes || []).map((attribute) => attribute.name),
      ),
      expected.attributes,
      "021.07",
    );
    equal(
      events.map(({ tag }) => JSON.stringify(tag)),
      snapshots,
      "021.08",
    );
    equal(new Set(events.map(({ tag }) => tag)).size, events.length, "021.09");
    for (const { tag } of events) {
      if (tag.name) {
        equal(
          expected.input.slice(tag.nameStarts, tag.nameEnds),
          tag.name,
          "021.10",
        );
      }
    }
  }
});

test("022 - opts.cb - tight malformed ranged tags retain pair semantics", () => {
  for (const name of ["script", "style", "xml"]) {
    const input = `A<div<${name}>x</${name}>B`;
    const spacedInput = `A<div <${name}>x</${name}>B`;
    const events = [];
    const actual = stripHtml(input, {
      cb: (event) => {
        events.push(event);
        if (event.proposedReturn) {
          event.rangesArr.push(...event.proposedReturn);
        }
      },
    });

    equal(actual.result, "A B", "022.01");
    equal(actual.result, stripHtml(spacedInput).result, "022.02");
    equal(events.length, 4, "022.03");
    equal(
      events
        .slice(0, 3)
        .map(({ proposedReturn }) => proposedReturn.slice(0, 2)),
      actual.allTagLocations,
      "022.04",
    );
    equal(
      new Set(
        events.map(({ proposedReturn }) => proposedReturn.slice(0, 2).join()),
      ).size,
      events.length,
      "022.05",
    );
  }
});

test("023 - opts.cb - callback token variants match their public types", () => {
  const firstToken = (input) => {
    let token;
    stripHtml(input, {
      cb: (event) => {
        token ??= event.tag;
      },
    });
    return token;
  };

  const complete = firstToken('A<b x="y">B');
  const incomplete = firstToken("A<div<span>B");
  const inferred = firstToken('A> head class="z"> B');
  const comment = firstToken("A<!--x-->B");
  const cdata = firstToken("A<![CDATA[x]]>B");
  const encoded = firstToken("A&lt;b&gt;B");

  equal(
    {
      kind: complete.kind,
      status: complete.status,
      start: complete.start,
      end: complete.end,
    },
    { kind: "tag", status: "complete", start: 1, end: 10 },
    "023.01",
  );
  equal(
    {
      opening: complete.lastOpeningBracketAt,
      closing: complete.lastClosingBracketAt,
    },
    { opening: 1, closing: 9 },
    "023.02",
  );
  equal(
    {
      kind: incomplete.kind,
      status: incomplete.status,
      start: incomplete.start,
      end: incomplete.end,
    },
    { kind: "tag", status: "incomplete", start: 1, end: 5 },
    "023.03",
  );
  not.ok(
    Object.hasOwn(incomplete, "lastClosingBracketAt"),
    "023.04",
  );
  equal(
    {
      kind: inferred.kind,
      status: inferred.status,
      start: inferred.start,
      end: inferred.end,
      name: inferred.name,
    },
    { kind: "tag", status: "inferred", start: 2, end: 18, name: "head" },
    "023.05",
  );
  not.ok(Object.hasOwn(inferred, "attributes"), "023.06");
  equal(comment, { kind: "comment", start: 1, end: 9 }, "023.07");
  equal(cdata, { kind: "cdata", start: 1, end: 14 }, "023.08");
  equal(
    {
      kind: encoded.kind,
      status: encoded.status,
      start: encoded.start,
      end: encoded.end,
    },
    { kind: "tag", status: "complete", start: 1, end: 10 },
    "023.09",
  );
  equal("A&lt;b&gt;B".slice(encoded.start, encoded.end), "&lt;b&gt;", "023.10");

  for (const [input, token, expectedSlice] of [
    ['A<b x="y">B', complete, '<b x="y">'],
    ["A<div<span>B", incomplete, "<div"],
    ['A> head class="z"> B', inferred, ' head class="z">'],
    ["A<!--x-->B", comment, "<!--x-->"],
    ["A<![CDATA[x]]>B", cdata, "<![CDATA[x]]>"],
  ]) {
    equal(input.slice(token.start, token.end), expectedSlice, "023.11");
  }
});

test.run();
