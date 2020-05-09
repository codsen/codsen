import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// opts.cb
// -----------------------------------------------------------------------------

tap.test("01 - opts.cb - baseline, no ranges requested", (t) => {
  // baseline, notice dirty whitespace:
  t.same(
    stripHtml(`<div style="display: inline !important;" >abc</ div>`, {
      returnRangesOnly: false,
    }),
    "abc",
    "01"
  );
  t.end();
});

tap.test("02 - opts.cb - baseline, ranges requested", (t) => {
  t.same(
    stripHtml("<div >abc</ div>", {
      returnRangesOnly: true,
    }),
    [
      [0, 6],
      [9, 16],
    ],
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
  t.same(stripHtml("abc<hr>def", { cb }), "abc<tralala>def", "03.01");
  t.same(
    stripHtml("abc<hr>def", { returnRangesOnly: true, cb }),
    [[3, 7, "<tralala>"]],
    "03.02"
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
  t.same(
    stripHtml("<div >abc</ div>", { cb }),
    "<tralala>abc</tralala>",
    "04.01"
  );
  t.same(
    stripHtml("<div >abc</ div>", {
      returnRangesOnly: true,
      cb,
    }),
    [
      [0, 6, "<tralala>"],
      [9, 16, "</tralala>"],
    ],
    "04.02"
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
  t.same(
    stripHtml("abc<hr>def<span>ghi</span>jkl", { cb }),
    "abc<tralala>def<span>ghi</span>jkl",
    "05.01"
  );
  t.same(
    stripHtml("abc<hr>def<span>ghi</span>jkl", { returnRangesOnly: true, cb }),
    [[3, 7, "<tralala>"]],
    "05.02"
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
  t.same(stripHtml("abc<hr>def", { cb }), "abc def", "06.01");
  t.same(
    stripHtml("abc<hr>def", { returnRangesOnly: true, cb }),
    [[3, 7, " "]],
    "06.02"
  );
  t.end();
});

tap.test(
  "07 - opts.cb - ignored tags are also being pinged, with null values",
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
    const res = stripHtml("abc<hr>def<br>ghi", { cb, ignoreTags: ["hr"] });
    t.same(res, "abc<hr>def ghi", "07.01");
    t.same(capturedTags, ["hr", "br"], "07.02");
    t.end();
  }
);

tap.test(
  "08 - opts.cb - ignored tags are also being pinged, with null values",
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
    const res = stripHtml("abc<hr>def<br>ghi", {
      returnRangesOnly: true,
      cb,
      ignoreTags: ["hr"],
    });
    t.same(res, [[10, 14, " "]], "08.01");
    t.same(capturedTags, ["hr", "br"], "08.02");
    t.end();
  }
);

tap.test("09 - opts.cb - cb.tag contents are right on ignored tags", (t) => {
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
    returnRangesOnly: true,
    trimOnlySpaces: true,
    dumpLinkHrefsNearby: {
      enabled: false,
      putOnNewLine: false,
      wrapHeads: "",
      wrapTails: "",
    },
  });

  t.same(
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
    "09.01"
  );
  t.end();
});

tap.test(
  "10 - opts.cb - cb.tag contents are right on non-ignored tags",
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
      returnRangesOnly: true,
      trimOnlySpaces: true,
      dumpLinkHrefsNearby: {
        enabled: false,
        putOnNewLine: false,
        wrapHeads: "",
        wrapTails: "",
      },
    });

    t.same(
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
      "10.01"
    );
    t.end();
  }
);
