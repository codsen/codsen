import tap from "tap";
// import { det as det1 } from "../dist/detergent.esm.js";
import {
  det,
  mixer,
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  // rawNbsp,
  rawhairspace,
  // rawEllipsis,
  // rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  // leftSingleQuote
} from "../t-util/util.js";

tap.test(`01 - empty string input`, (t) => {
  t.equal(det(t, 0, "").res, "", "01");
  t.end();
});

tap.test(`02 - all low ASCII invisible characters are removed`, (t) => {
  t.equal(
    det(
      t,
      0,
      "\u0000\u0001\u0002\u0004\u0005\u0006\u0007\u0008\u000E\u000F\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001A\u001B\u001C\u001D\u001E\u001F\u007F\u0080\u0081\u0082\u0083\u0084\u0086\u0087\u0088\u0089\u008A\u008B\u008C\u008D\u008E\u008F\u0090\u0091\u0092\u0093\u0094\u0095\u0096\u0097\u0098\u0099\u009A\u009B\u009C\u009D\u009E\u009F\u200E\u200F"
    ).res,
    "",
    "02"
  );
  t.end();
});

tap.test(`03 - hairspace - tight - hairspace changed to space`, (t) => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    t.equal(
      det(
        t,
        n,
        `a&hairsp;a&VeryThinSpace;a&#x0200A;a&#8202;a${rawhairspace}a`,
        opt
      ).res,
      "a a a a a a",
      "02"
    );
  });
  t.end();
});

tap.test(
  `04 - hairspace - tight - hairspace changed to space (lots of spaces)`,
  (t) => {
    mixer({
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          `a    &hairsp;  a  &VeryThinSpace;   a &#x0200A;     a              &#8202; a ${rawhairspace} a    `,
          opt
        ).res,
        "a a a a a a",
        "03"
      );
    });
    t.end();
  }
);

tap.test(
  `05 - hairspace - tight - hairspace changed to space: +widows+entities`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          `a&hairsp;b&VeryThinSpace;c&#x0200A;d&#8202;e${rawhairspace}f`,
          opt
        ).res,
        "a b c d e&nbsp;f",
        "04"
      );
    });
    t.end();
  }
);

tap.test("06 - invisible breaks - raw", (t) => {
  mixer({
    replaceLineBreaks: false,
    removeLineBreaks: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "a\u000Ab\u000Bc\u000Cd\u000De\u2028f\u2029g\u0003h", opt).res,
      "a\nb\nc\nd\ne\nf\ng\nh",
      "05"
    );
  });
  t.end();
});

tap.test("07 - invisible breaks - encoded decimal HTML entities", (t) => {
  mixer({
    replaceLineBreaks: false,
    removeLineBreaks: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "a&#10;b&#11;c&#12;&#13;&#8232;&#8233;&#3;d", opt).res,
      "a\nb\nc\n\nd",
      "06"
    );
  });
  t.end();
});

tap.test("08 - invisible breaks - remove all line breaks on", (t) => {
  mixer({
    removeLineBreaks: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "a\u000Eb\u000C\u000D\u0085c\u2028\u2029d", opt).res,
      "ab cd",
      "07"
    );
  });
  t.end();
});

tap.test("09 - invisible breaks - replace breaks into XHTML BR's", (t) => {
  mixer({
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "a\u000Ab\u000Bc\u000C\u000D\u0085\u2028\u2029d", opt).res,
      "a<br/>\nb\nc<br/>\n\nd",
      "08"
    );
  });
  t.end();
});

tap.test("10 - invisible breaks - replace breaks into HTML BR's", (t) => {
  mixer({
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "a\u000Ab\u000Bc\u000C\u000D\u0085\u2028\u2029d", opt).res,
      "a<br>\nb\nc<br>\n\nd",
      "09"
    );
  });
  t.end();
});

tap.test("11 - line feed \\u000A (LF) and o.removeLineBreaks", (t) => {
  mixer({
    replaceLineBreaks: false,
    removeLineBreaks: true,
  }).forEach((opt, n) => {
    t.equal(det(t, n, "aaa\u000Abbb", opt).res, "aaa bbb", "10");
  });
  t.end();
});

tap.test("12 - line feed \\u000A (LF) and no o.removeLineBreaks", (t) => {
  mixer({
    replaceLineBreaks: false,
    removeLineBreaks: false,
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(det(t, n, "aaa\u000Abbb", opt).res, "aaa\nbbb", "11");
  });
  t.end();
});

tap.test("13 - narrow no break space", (t) => {
  mixer({
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(det(t, n, "a\u202Fb", opt).res, "a b", "12");
  });
  mixer({
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(det(t, n, "a\u202Fb", opt).res, "a b", "12");
  });
  t.end();
});
