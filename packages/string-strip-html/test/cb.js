import tap from "tap";
import { stripHtml } from "../dist/string-strip-html.esm.js";

// opts.cb
// -----------------------------------------------------------------------------

tap.test("01 - opts.cb - baseline", (t) => {
  // baseline, notice dirty whitespace:
  t.match(
    stripHtml(`<div style="display: inline !important;" >abc</ div>`),
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
    "01"
  );
  t.end();
});

tap.test("02 - opts.cb - baseline 2", (t) => {
  t.match(
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
    "02"
  );
  t.end();
});

tap.test("03 - opts.cb - replace hr with tralala", (t) => {
  const cb = ({
    // tag,
    deleteFrom,
    deleteTo,
    // insert,
    rangesArr,
    // proposedReturn
  }) => {
    rangesArr.push(deleteFrom, deleteTo, "<tralala>");
  };
  t.match(
    stripHtml("abc<hr>def", { cb }),
    {
      result: "abc<tralala>def",
      ranges: [[3, 7, "<tralala>"]],
      allTagLocations: [[3, 7]],
      filteredTagLocations: [[3, 7]],
    },
    "03"
  );
  t.end();
});

tap.test("04 - opts.cb - replace div with tralala", (t) => {
  const cb = ({
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
      `<${tag.slashPresent ? "/" : ""}tralala>`
    );
  };
  t.match(
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
    "04"
  );
  t.end();
});

tap.test("05 - opts.cb - replace only hr", (t) => {
  const cb = ({
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
        `<${tag.slashPresent ? "/" : ""}tralala>`
      );
    }
  };
  t.match(
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
    "05"
  );
  t.end();
});

tap.test("06 - opts.cb - readme example one", (t) => {
  const cb = ({
    // tag,
    deleteFrom,
    deleteTo,
    insert,
    rangesArr,
    // proposedReturn
  }) => {
    rangesArr.push(deleteFrom, deleteTo, insert);
  };
  t.match(
    stripHtml("abc<hr>def", { cb }),
    {
      result: "abc def",
      ranges: [[3, 7, " "]],
      allTagLocations: [[3, 7]],
      filteredTagLocations: [[3, 7]],
    },
    "06"
  );
  t.end();
});

tap.test(
  "07 - opts.cb - ignored tags are also being pinged, with null deletion range values",
  (t) => {
    const capturedTags = [];
    const cb = ({
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
    t.match(
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
      "07.01"
    );
    t.strictSame(capturedTags, ["hr", "br"], "07.02");
    t.end();
  }
);

tap.test("08 - opts.cb - cb.tag contents are correct on ignored tags", (t) => {
  const capturedTags = [];
  // const rangesArr = [];
  const cb = ({
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

  t.strictSame(
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
    "08"
  );
  t.end();
});

tap.test(
  "09 - opts.cb - cb.tag contents are right on non-ignored tags",
  (t) => {
    const capturedTags = [];
    // const rangesArr = [];
    const cb = ({
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

    t.strictSame(
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
      "09"
    );
    t.end();
  }
);
