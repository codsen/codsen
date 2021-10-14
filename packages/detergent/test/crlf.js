import tap from "tap";
// import { det as det1 } from "../dist/detergent.esm.js";
import {
  det,
  // mixer,
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  // rawNbsp,
  // rawhairspace,
  // rawEllipsis,
  // rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  // leftSingleQuote
} from "../t-util/util.js";

tap.test(
  `01 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - \\n replacement with BR - LF`,
  (t) => {
    t.equal(
      det(t, 0, `aaa\n\nbbb\n\nccc`).res,
      "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
      "01"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - \\n replacement with BR - CRLF`,
  (t) => {
    t.equal(
      det(t, 0, `aaa\r\n\r\nbbb\r\n\r\nccc`).res,
      "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
      "02 - CRLF"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - HTML BR replacement with XHTML BR`,
  (t) => {
    t.equal(
      det(t, 0, `a<br>b`, {
        useXHTML: true,
      }).res,
      "a<br/>b",
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - HTML BR replacement with XHTML BR`,
  (t) => {
    t.equal(
      det(t, 0, `a<br>b`, {
        useXHTML: false,
      }).res,
      "a<br>b",
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - HTML BR replacement with XHTML BR`,
  (t) => {
    t.match(
      det(t, 0, `a<br/>b`, {
        useXHTML: true,
      }),
      {
        res: "a<br/>b",
        applicableOpts: {
          fixBrokenEntities: false,
          removeWidows: false,
          convertEntities: false,
          convertDashes: false,
          convertApostrophes: false,
          replaceLineBreaks: false,
          removeLineBreaks: false,
          useXHTML: true,
          dontEncodeNonLatin: false,
          addMissingSpaces: false,
          convertDotsToEllipsis: false,
          stripHtml: true,
          eol: false,
        },
      },
      "05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - HTML BR replacement with XHTML BR`,
  (t) => {
    t.equal(
      det(t, 0, `a<br/>b`, {
        useXHTML: false,
      }).res,
      "a<br>b",
      "06"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - HTML BR replacement with XHTML BR`,
  (t) => {
    t.equal(
      det(t, 0, `abc<br >def<br>ghi<br/>jkl<br />mno`, {
        useXHTML: true,
        replaceLineBreaks: false,
      }).res,
      "abc<br/>def<br/>ghi<br/>jkl<br/>mno",
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - HTML BR replacement with HTML BR`,
  (t) => {
    t.equal(
      det(t, 0, `abc<br >def<br>ghi<br/>jkl<br />mno`, {
        useXHTML: false,
        replaceLineBreaks: false,
      }).res,
      "abc<br>def<br>ghi<br>jkl<br>mno",
      "08"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - dirty BRs`,
  (t) => {
    t.equal(det(t, 0, `<br />`).res, `<br/>`, "09");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - dirty BRs`,
  (t) => {
    t.equal(det(t, 0, `< br>`).res, `<br/>`, "10");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - dirty BRs`,
  (t) => {
    t.equal(det(t, 0, `<br class="z"/>`).res, `<br class="z"/>`, "11");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - dirty BRs`,
  (t) => {
    t.equal(
      det(t, 0, `aaa<br />< br>bbb< br ><br>ccc< br >< br>ddd`).res,
      "aaa<br/><br/>bbb<br/><br/>ccc<br/><br/>ddd",
      "12"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #1`,
  (t) => {
    t.equal(
      det(t, 0, `a</br>b`, {
        useXHTML: false,
      }).res,
      "a<br>b",
      "13"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #1`,
  (t) => {
    t.equal(
      det(t, 0, `a</br>b`, {
        useXHTML: true,
      }).res,
      "a<br/>b",
      "14"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #2`,
  (t) => {
    t.equal(
      det(t, 0, `a< / / br>b`, {
        useXHTML: false,
        replaceLineBreaks: false,
      }).res,
      "a<br>b",
      "15"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #3`,
  (t) => {
    t.equal(
      det(t, 0, `a< / / br style="something" / />b`, {
        useXHTML: false,
        replaceLineBreaks: false,
      }).res,
      `a<br style="something">b`,
      "16"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #4`,
  (t) => {
    t.equal(
      det(t, 0, `a< / / br style="something" / />b`, {
        useXHTML: true,
        replaceLineBreaks: false,
      }).res,
      `a<br style="something"/>b`,
      "17"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #5`,
  (t) => {
    t.equal(
      det(t, 0, `a</br class="display: none;">b`, {
        useXHTML: false,
        replaceLineBreaks: false,
      }).res,
      `a<br class="display: none;">b`,
      "18"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #5`,
  (t) => {
    t.equal(
      det(t, 0, `a</br class="display: none;">b`, {
        useXHTML: true,
        replaceLineBreaks: false,
      }).res,
      `a<br class="display: none;"/>b`,
      "19"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #6`,
  (t) => {
    t.equal(
      det(t, 0, `a<br class="display: none;"/>b`, {
        useXHTML: false,
        replaceLineBreaks: false,
      }).res,
      `a<br class="display: none;">b`,
      "20"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #6`,
  (t) => {
    t.equal(
      det(t, 0, `a<br class="display: none;"/>b`, {
        useXHTML: true,
        replaceLineBreaks: false,
      }).res,
      `a<br class="display: none;"/>b`,
      "21"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #7`,
  (t) => {
    t.equal(
      det(t, 0, `a<br class="display: none;">b`, {
        useXHTML: false,
        replaceLineBreaks: false,
      }).res,
      `a<br class="display: none;">b`,
      "22"
    );
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${33}m${`line breaks`}\u001b[${39}m`} - messy BR #7`,
  (t) => {
    t.equal(
      det(t, 0, `a<br class="display: none;">b`, {
        useXHTML: true,
        replaceLineBreaks: false,
      }).res,
      `a<br class="display: none;"/>b`,
      "23"
    );
    t.end();
  }
);
