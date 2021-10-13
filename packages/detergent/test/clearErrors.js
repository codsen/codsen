import tap from "tap";
// import { det as det1 } from "../dist/detergent.esm.js";
import {
  det,
  mixer,
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  rawNbsp,
  // rawhairspace,
  // rawEllipsis,
  // rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  // leftSingleQuote
} from "../t-util/util.js";

tap.test(
  `01 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=off`,
  (t) => {
    mixer({
      removeWidows: false,
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
          opt
        ).res,
        "Very long line, long-enough to trigger widow removal.<br/>\n<br/>\nText.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=on`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
          opt
        ).res,
        "Very long line, long-enough to trigger widow&nbsp;removal.<br/>\n<br/>\nText.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, convertEntities=off`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: false,
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
          opt
        ).res,
        `Very long line, long-enough to trigger widow${rawNbsp}removal.<br/>\n<br/>\nText.`,
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeLineBreaks=off`,
  (t) => {
    mixer({
      removeWidows: false,
      replaceLineBreaks: false,
      removeLineBreaks: false,
      useXHTML: false,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
          opt
        ).res,
        "Very long line, long-enough to trigger widow removal.\n\nText.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, convertEntities=on`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
      replaceLineBreaks: false,
      removeLineBreaks: false,
      useXHTML: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
          opt
        ).res,
        "Very long line, long-enough to trigger widow&nbsp;removal.\n\nText.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, convertEntities=off`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: false,
      replaceLineBreaks: false,
      removeLineBreaks: false,
      useXHTML: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
          opt
        ).res,
        `Very long line, long-enough to trigger widow${rawNbsp}removal.\n\nText.`,
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=off, replaceLineBreaks=on`,
  (t) => {
    mixer({
      removeWidows: false,
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: false,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
          opt
        ).res,
        "Very long line, long-enough to trigger widow removal.<br>\n<br>\nText.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=on, replaceLineBreaks=on`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: false,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
          opt
        ).res,
        "Very long line, long-enough to trigger widow&nbsp;removal.<br>\n<br>\nText.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=on, replaceLineBreaks=on, convertEntities=off`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: false,
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: false,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          "\u000a Very long line, long-enough to trigger widow removal . \u000a\n Text . ",
          opt
        ).res,
        `Very long line, long-enough to trigger widow${rawNbsp}removal.<br>\n<br>\nText.`,
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=off, removeLineBreaks=on - LF`,
  (t) => {
    mixer({
      removeWidows: false,
      removeLineBreaks: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          " \u000a    Very long line, long-enough to trigger widow removal   \n\n. \u000a\n Text text text text . ",
          opt
        ).res,
        "Very long line, long-enough to trigger widow removal. Text text text text.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=off, removeLineBreaks=on - CR`,
  (t) => {
    mixer({
      removeWidows: false,
      removeLineBreaks: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          " \u000a    Very long line, long-enough to trigger widow removal   \r\r. \u000a\n Text text text text . ",
          opt
        ).res,
        "Very long line, long-enough to trigger widow removal. Text text text text.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=off, removeLineBreaks=on - CRLF`,
  (t) => {
    mixer({
      removeWidows: false,
      removeLineBreaks: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          " \u000a    Very long line, long-enough to trigger widow removal   \r\n\r\n. \u000a\n Text text text text . ",
          opt
        ).res,
        "Very long line, long-enough to trigger widow removal. Text text text text.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=on, removeLineBreaks=on`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
      removeLineBreaks: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          " \u000a    Very long line, long-enough to trigger widow removal .  \n \n \u000a\n Text text text text . ",
          opt
        ).res,
        "Very long line, long-enough to trigger widow removal. Text text text&nbsp;text.",
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - space - full stop, removeWidows=on, convertEntities=off`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: false,
      removeLineBreaks: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          " \u000a   Very long line, long-enough to trigger widow removal .  \n \n  \u000a\n Text text text text . ",
          opt
        ).res,
        `Very long line, long-enough to trigger widow removal. Text text text${rawNbsp}text.`,
        JSON.stringify(opt, null, 0)
      );
    });
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - line break combinations`,
  (t) => {
    t.equal(det(t, 0, `a. \na`).res, "a.<br/>\na", "15");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - line break combinations`,
  (t) => {
    t.equal(det(t, 0, `a . \na`).res, "a.<br/>\na", "16");
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - line break combinations`,
  (t) => {
    t.equal(det(t, 0, `a , \na`).res, "a,<br/>\na", "17");
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${32}m${`fixes`}\u001b[${39}m`} - checking line feed being replaced with space`,
  (t) => {
    mixer({
      removeLineBreaks: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `aaaa\u000Abbbbb`, opt).res,
        "aaaa bbbbb",
        JSON.stringify(opt, null, 0)
      );
    });

    t.end();
  }
);
