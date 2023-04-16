import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
// import { det as det1 } from "../dist/detergent.esm.js";
import { det } from "../t-util/util.js";

test(`01 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - replacement with BR - LF`, () => {
  // retaining current EOL setting, in this case LF:
  equal(
    det(ok, not, 0, "aaa\n\nbbb\n\nccc").res,
    "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
    "01.01"
  );
  // explicit EOL settings:
  equal(
    det(ok, not, 0, "aaa\n\nbbb\n\nccc", {
      eol: "lf",
    }).res,
    "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
    "01.02"
  );
  equal(
    det(ok, not, 0, "aaa\n\nbbb\n\nccc", {
      eol: "cr",
    }).res,
    "aaa<br/>\r<br/>\rbbb<br/>\r<br/>\rccc",
    "01.03"
  );
  equal(
    det(ok, not, 0, "aaa\n\nbbb\n\nccc", {
      eol: "crlf",
    }).res,
    "aaa<br/>\r\n<br/>\r\nbbb<br/>\r\n<br/>\r\nccc",
    "01.04"
  );
});

test(`02 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - replacement with BR - CRLF`, () => {
  // retaining current EOL setting, in this case CRLF:
  equal(
    det(ok, not, 0, "aaa\r\n\r\nbbb\r\n\r\nccc").res,
    "aaa<br/>\r\n<br/>\r\nbbb<br/>\r\n<br/>\r\nccc",
    "02.01"
  );
  // explicit EOL settings:
  equal(
    det(ok, not, 0, "aaa\r\n\r\nbbb\r\n\r\nccc", {
      eol: "lf",
    }).res,
    "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
    "02.02"
  );
  equal(
    det(ok, not, 0, "aaa\r\n\r\nbbb\r\n\r\nccc", {
      eol: "cr",
    }).res,
    "aaa<br/>\r<br/>\rbbb<br/>\r<br/>\rccc",
    "02.03"
  );
  equal(
    det(ok, not, 0, "aaa\r\n\r\nbbb\r\n\r\nccc", {
      eol: "crlf",
    }).res,
    "aaa<br/>\r\n<br/>\r\nbbb<br/>\r\n<br/>\r\nccc",
    "02.04"
  );
});

test(`03 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - replacement with BR - CR`, () => {
  // retaining current EOL setting, in this case CRLF:
  equal(
    det(ok, not, 0, "aaa\r\rbbb\r\rccc").res,
    "aaa<br/>\r<br/>\rbbb<br/>\r<br/>\rccc",
    "03.01"
  );
  // explicit EOL settings:
  equal(
    det(ok, not, 0, "aaa\r\rbbb\r\rccc", {
      eol: "lf",
    }).res,
    "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
    "03.02"
  );
  equal(
    det(ok, not, 0, "aaa\r\rbbb\r\rccc", {
      eol: "cr",
    }).res,
    "aaa<br/>\r<br/>\rbbb<br/>\r<br/>\rccc",
    "03.03"
  );
  equal(
    det(ok, not, 0, "aaa\r\rbbb\r\rccc", {
      eol: "crlf",
    }).res,
    "aaa<br/>\r\n<br/>\r\nbbb<br/>\r\n<br/>\r\nccc",
    "03.04"
  );
});

test(`04 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - HTML BR replacement with XHTML BR`, () => {
  equal(
    det(ok, not, 0, "a<br>b", {
      useXHTML: true,
    }).res,
    "a<br/>b",
    "04.01"
  );
});

test(`05 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - HTML BR replacement with XHTML BR`, () => {
  equal(
    det(ok, not, 0, "a<br>b", {
      useXHTML: false,
    }).res,
    "a<br>b",
    "05.01"
  );
});

test(`06 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - HTML BR replacement with XHTML BR`, () => {
  compare(
    ok,
    det(ok, not, 0, "a<br/>b", {
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
});

test(`07 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - HTML BR replacement with XHTML BR`, () => {
  equal(
    det(ok, not, 0, "a<br/>b", {
      useXHTML: false,
    }).res,
    "a<br>b",
    "07.01"
  );
});

test(`08 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - HTML BR replacement with XHTML BR`, () => {
  equal(
    det(ok, not, 0, "abc<br >def<br>ghi<br/>jkl<br />mno", {
      useXHTML: true,
      replaceLineBreaks: false,
    }).res,
    "abc<br/>def<br/>ghi<br/>jkl<br/>mno",
    "08.01"
  );
});

test(`09 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - HTML BR replacement with HTML BR`, () => {
  equal(
    det(ok, not, 0, "abc<br >def<br>ghi<br/>jkl<br />mno", {
      useXHTML: false,
      replaceLineBreaks: false,
    }).res,
    "abc<br>def<br>ghi<br>jkl<br>mno",
    "09.01"
  );
});

test(`10 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - dirty BRs`, () => {
  equal(det(ok, not, 0, "<br />").res, "<br/>", "10.01");
});

test(`11 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - dirty BRs`, () => {
  equal(det(ok, not, 0, "< br>").res, "<br/>", "11.01");
});

test(`12 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - dirty BRs`, () => {
  equal(det(ok, not, 0, '<br class="z"/>').res, '<br class="z"/>', "12.01");
});

test(`13 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - dirty BRs`, () => {
  equal(
    det(ok, not, 0, "aaa<br />< br>bbb< br ><br>ccc< br >< br>ddd").res,
    "aaa<br/><br/>bbb<br/><br/>ccc<br/><br/>ddd",
    "13.01"
  );
});

test(`14 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - messy BR #1`, () => {
  equal(
    det(ok, not, 0, "a</br>b", {
      useXHTML: false,
    }).res,
    "a<br>b",
    "14.01"
  );
});

test(`15 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - messy BR #1`, () => {
  equal(
    det(ok, not, 0, "a</br>b", {
      useXHTML: true,
    }).res,
    "a<br/>b",
    "15.01"
  );
});

test(`16 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - messy BR #2`, () => {
  equal(
    det(ok, not, 0, "a< / / br>b", {
      useXHTML: false,
      replaceLineBreaks: false,
    }).res,
    "a<br>b",
    "16.01"
  );
});

test(`17 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - messy BR #3`, () => {
  equal(
    det(ok, not, 0, 'a< / / br style="something" / />b', {
      useXHTML: false,
      replaceLineBreaks: false,
    }).res,
    'a<br style="something">b',
    "17.01"
  );
});

test(`18 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - messy BR #4`, () => {
  equal(
    det(ok, not, 0, 'a< / / br style="something" / />b', {
      useXHTML: true,
      replaceLineBreaks: false,
    }).res,
    'a<br style="something"/>b',
    "18.01"
  );
});

test(`19 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - messy BR #5`, () => {
  equal(
    det(ok, not, 0, 'a</br class="display: none;">b', {
      useXHTML: false,
      replaceLineBreaks: false,
    }).res,
    'a<br class="display: none;">b',
    "19.01"
  );
});

test(`20 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - messy BR #5`, () => {
  equal(
    det(ok, not, 0, 'a</br class="display: none;">b', {
      useXHTML: true,
      replaceLineBreaks: false,
    }).res,
    'a<br class="display: none;"/>b',
    "20.01"
  );
});

test(`21 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - messy BR #6`, () => {
  equal(
    det(ok, not, 0, 'a<br class="display: none;"/>b', {
      useXHTML: false,
      replaceLineBreaks: false,
    }).res,
    'a<br class="display: none;">b',
    "21.01"
  );
});

test(`22 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - messy BR #6`, () => {
  equal(
    det(ok, not, 0, 'a<br class="display: none;"/>b', {
      useXHTML: true,
      replaceLineBreaks: false,
    }).res,
    'a<br class="display: none;"/>b',
    "22.01"
  );
});

test(`23 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - messy BR #7`, () => {
  equal(
    det(ok, not, 0, 'a<br class="display: none;">b', {
      useXHTML: false,
      replaceLineBreaks: false,
    }).res,
    'a<br class="display: none;">b',
    "23.01"
  );
});

test(`24 - ${`\u001b[${33}m${"line breaks"}\u001b[${39}m`} - messy BR #7`, () => {
  equal(
    det(ok, not, 0, 'a<br class="display: none;">b', {
      useXHTML: true,
      replaceLineBreaks: false,
    }).res,
    'a<br class="display: none;"/>b',
    "24.01"
  );
});

test.run();
