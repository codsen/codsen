// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
// import { det as det1 } from "../dist/detergent.esm.js";
import { det } from "../t-util/util.js";

test("001 - line breaks - replacement with BR - LF", () => {
  // retaining current EOL setting, in this case LF:
  equal(
    det(ok, not, 0, "aaa\n\nbbb\n\nccc").res,
    "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
    "001.01",
  );
  // explicit EOL settings:
  equal(
    det(ok, not, 0, "aaa\n\nbbb\n\nccc", {
      eol: "lf",
    }).res,
    "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
    "001.02",
  );
  equal(
    det(ok, not, 0, "aaa\n\nbbb\n\nccc", {
      eol: "cr",
    }).res,
    "aaa<br/>\r<br/>\rbbb<br/>\r<br/>\rccc",
    "001.03",
  );
  equal(
    det(ok, not, 0, "aaa\n\nbbb\n\nccc", {
      eol: "crlf",
    }).res,
    "aaa<br/>\r\n<br/>\r\nbbb<br/>\r\n<br/>\r\nccc",
    "001.04",
  );
});

test("002 - line breaks - replacement with BR - CRLF", () => {
  // retaining current EOL setting, in this case CRLF:
  equal(
    det(ok, not, 0, "aaa\r\n\r\nbbb\r\n\r\nccc").res,
    "aaa<br/>\r\n<br/>\r\nbbb<br/>\r\n<br/>\r\nccc",
    "002.01",
  );
  // explicit EOL settings:
  equal(
    det(ok, not, 0, "aaa\r\n\r\nbbb\r\n\r\nccc", {
      eol: "lf",
    }).res,
    "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
    "002.02",
  );
  equal(
    det(ok, not, 0, "aaa\r\n\r\nbbb\r\n\r\nccc", {
      eol: "cr",
    }).res,
    "aaa<br/>\r<br/>\rbbb<br/>\r<br/>\rccc",
    "002.03",
  );
  equal(
    det(ok, not, 0, "aaa\r\n\r\nbbb\r\n\r\nccc", {
      eol: "crlf",
    }).res,
    "aaa<br/>\r\n<br/>\r\nbbb<br/>\r\n<br/>\r\nccc",
    "002.04",
  );
});

test("003 - line breaks - replacement with BR - CR", () => {
  // retaining current EOL setting, in this case CRLF:
  equal(
    det(ok, not, 0, "aaa\r\rbbb\r\rccc").res,
    "aaa<br/>\r<br/>\rbbb<br/>\r<br/>\rccc",
    "003.01",
  );
  // explicit EOL settings:
  equal(
    det(ok, not, 0, "aaa\r\rbbb\r\rccc", {
      eol: "lf",
    }).res,
    "aaa<br/>\n<br/>\nbbb<br/>\n<br/>\nccc",
    "003.02",
  );
  equal(
    det(ok, not, 0, "aaa\r\rbbb\r\rccc", {
      eol: "cr",
    }).res,
    "aaa<br/>\r<br/>\rbbb<br/>\r<br/>\rccc",
    "003.03",
  );
  equal(
    det(ok, not, 0, "aaa\r\rbbb\r\rccc", {
      eol: "crlf",
    }).res,
    "aaa<br/>\r\n<br/>\r\nbbb<br/>\r\n<br/>\r\nccc",
    "003.04",
  );
});

test("004 - line breaks - HTML BR replacement with XHTML BR", () => {
  equal(
    det(ok, not, 0, "a<br>b", {
      useXHTML: true,
    }).res,
    "a<br/>b",
    "004.01",
  );
});

test("005 - line breaks - HTML BR replacement with XHTML BR", () => {
  equal(
    det(ok, not, 0, "a<br>b", {
      useXHTML: false,
    }).res,
    "a<br>b",
    "005.01",
  );
});

test("006 - line breaks - HTML BR replacement with XHTML BR", () => {
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
    "05",
  );
});

test("007 - line breaks - HTML BR replacement with XHTML BR", () => {
  equal(
    det(ok, not, 0, "a<br/>b", {
      useXHTML: false,
    }).res,
    "a<br>b",
    "007.01",
  );
});

test("008 - line breaks - HTML BR replacement with XHTML BR", () => {
  equal(
    det(ok, not, 0, "abc<br >def<br>ghi<br/>jkl<br />mno", {
      useXHTML: true,
      replaceLineBreaks: false,
    }).res,
    "abc<br/>def<br/>ghi<br/>jkl<br/>mno",
    "008.01",
  );
});

test("009 - line breaks - HTML BR replacement with HTML BR", () => {
  equal(
    det(ok, not, 0, "abc<br >def<br>ghi<br/>jkl<br />mno", {
      useXHTML: false,
      replaceLineBreaks: false,
    }).res,
    "abc<br>def<br>ghi<br>jkl<br>mno",
    "009.01",
  );
});

test("010 - line breaks - dirty BRs", () => {
  equal(det(ok, not, 0, "<br />").res, "<br/>", "010.01");
});

test("011 - line breaks - dirty BRs", () => {
  equal(det(ok, not, 0, "< br>").res, "<br/>", "011.01");
});

test("012 - line breaks - dirty BRs", () => {
  equal(det(ok, not, 0, '<br class="z"/>').res, '<br class="z"/>', "012.01");
});

test("013 - line breaks - dirty BRs", () => {
  equal(
    det(ok, not, 0, "aaa<br />< br>bbb< br ><br>ccc< br >< br>ddd").res,
    "aaa<br/><br/>bbb<br/><br/>ccc<br/><br/>ddd",
    "013.01",
  );
});

test("014 - line breaks - messy BR #1", () => {
  equal(
    det(ok, not, 0, "a</br>b", {
      useXHTML: false,
    }).res,
    "a<br>b",
    "014.01",
  );
});

test("015 - line breaks - messy BR #1", () => {
  equal(
    det(ok, not, 0, "a</br>b", {
      useXHTML: true,
    }).res,
    "a<br/>b",
    "015.01",
  );
});

test("016 - line breaks - messy BR #2", () => {
  equal(
    det(ok, not, 0, "a< / / br>b", {
      useXHTML: false,
      replaceLineBreaks: false,
    }).res,
    "a<br>b",
    "016.01",
  );
});

test("017 - line breaks - messy BR #3", () => {
  equal(
    det(ok, not, 0, 'a< / / br style="something" / />b', {
      useXHTML: false,
      replaceLineBreaks: false,
    }).res,
    'a<br style="something">b',
    "017.01",
  );
});

test("018 - line breaks - messy BR #4", () => {
  equal(
    det(ok, not, 0, 'a< / / br style="something" / />b', {
      useXHTML: true,
      replaceLineBreaks: false,
    }).res,
    'a<br style="something"/>b',
    "018.01",
  );
});

test("019 - line breaks - messy BR #5", () => {
  equal(
    det(ok, not, 0, 'a</br class="display: none;">b', {
      useXHTML: false,
      replaceLineBreaks: false,
    }).res,
    'a<br class="display: none;">b',
    "019.01",
  );
});

test("020 - line breaks - messy BR #5", () => {
  equal(
    det(ok, not, 0, 'a</br class="display: none;">b', {
      useXHTML: true,
      replaceLineBreaks: false,
    }).res,
    'a<br class="display: none;"/>b',
    "020.01",
  );
});

test("021 - line breaks - messy BR #6", () => {
  equal(
    det(ok, not, 0, 'a<br class="display: none;"/>b', {
      useXHTML: false,
      replaceLineBreaks: false,
    }).res,
    'a<br class="display: none;">b',
    "021.01",
  );
});

test("022 - line breaks - messy BR #6", () => {
  equal(
    det(ok, not, 0, 'a<br class="display: none;"/>b', {
      useXHTML: true,
      replaceLineBreaks: false,
    }).res,
    'a<br class="display: none;"/>b',
    "022.01",
  );
});

test("023 - line breaks - messy BR #7", () => {
  equal(
    det(ok, not, 0, 'a<br class="display: none;">b', {
      useXHTML: false,
      replaceLineBreaks: false,
    }).res,
    'a<br class="display: none;">b',
    "023.01",
  );
});

test("024 - line breaks - messy BR #7", () => {
  equal(
    det(ok, not, 0, 'a<br class="display: none;">b', {
      useXHTML: true,
      replaceLineBreaks: false,
    }).res,
    'a<br class="display: none;"/>b',
    "024.01",
  );
});

test.run();
