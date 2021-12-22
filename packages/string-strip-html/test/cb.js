import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// opts.cb
// -----------------------------------------------------------------------------

test("01 - opts.cb - baseline", () => {
  // baseline, notice dirty whitespace:
  equal(
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
});

test("02 - opts.cb - baseline 2", () => {
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
    "02"
  );
});

test("03 - opts.cb - replace hr with tralala", () => {
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
    "03"
  );
});

test("04 - opts.cb - replace div with tralala", () => {
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
      `<${tag.slashPresent ? "/" : ""}tralala>`
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
    "04"
  );
});

test("05 - opts.cb - replace only hr", () => {
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
        `<${tag.slashPresent ? "/" : ""}tralala>`
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
    "05"
  );
});

test("06 - opts.cb - readme example one", () => {
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
    "06"
  );
});

test("07 - opts.cb - ignored tags are also being pinged, with null deletion range values", () => {
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
    "07.01"
  );
  equal(capturedTags, ["hr", "br"], "07.02");
});

test("08 - opts.cb - cb.tag contents are correct on ignored tags", () => {
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
    "08"
  );
});

test("09 - opts.cb - cb.tag contents are right on non-ignored tags", () => {
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
    "09"
  );
});

test.run();
