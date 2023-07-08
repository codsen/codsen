import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";
import validateTagLocations from "./util/validateTagLocations.js";

// normal use cases
// -----------------------------------------------------------------------------

test("01 - string is whole (opening) tag - no ignore", () => {
  let { result, allTagLocations } = stripHtml("<a>");
  equal(
    { result, allTagLocations },
    { result: "", allTagLocations: [[0, 3]] },
    "01.01",
  );
});

test("02 - string is whole (opening) tag - no ignore", () => {
  let { result, allTagLocations } = stripHtml("<a/>");
  equal(
    { result, allTagLocations },
    { result: "", allTagLocations: [[0, 4]] },
    "02.01",
  );
});

test("03 - string is whole (opening) tag - no ignore", () => {
  let { result, allTagLocations } = stripHtml("<a />");
  equal(
    { result, allTagLocations },
    { result: "", allTagLocations: [[0, 5]] },
    "03.01",
  );
});

test("04 - string is whole (opening) tag - ignore but wrong", () => {
  let input = "<a>";
  let { result, ranges, allTagLocations } = stripHtml(input, {
    ignoreTags: ["b"],
  });
  equal(result, "", "04.01");
  equal(ranges, [[0, 3]], "04.02");
  equal(allTagLocations, [[0, 3]], "04.03");

  validateTagLocations(is, input, [[0, 3]]);
});

test("05 - string is whole (opening) tag - ignore", () => {
  let input = "<a>";
  let { result, ranges, allTagLocations } = stripHtml(input, {
    ignoreTags: ["a"],
  });
  equal(result, "<a>", "05.01");
  equal(ranges, null, "05.02");
  equal(allTagLocations, [[0, 3]], "05.03");
  validateTagLocations(is, input, [[0, 3]]);
});

test("06 - string is whole (opening) tag - whitespace after opening bracket", () => {
  let input = "< a>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "06.01");
  equal(ranges, [[0, 4]], "06.02");
  equal(allTagLocations, [[0, 4]], "06.03");
  validateTagLocations(is, input, [[0, 4]]);
});

test("07 - string is whole (opening) tag - whitespace before closing bracket", () => {
  let input = "<a >";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "07.01");
  equal(ranges, [[0, 4]], "07.02");
  equal(allTagLocations, [[0, 4]], "07.03");
  validateTagLocations(is, input, [[0, 4]]);
});

test("08 - string is whole (opening) tag - whitespace inside on both sides", () => {
  let input = "< a >";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "08.01");
  equal(ranges, [[0, 5]], "08.02");
  equal(allTagLocations, [[0, 5]], "08.03");
  validateTagLocations(is, input, [[0, 5]]);
});

test("09 - string is whole (opening) tag - copious whitespace inside on both sides", () => {
  let input = "<     a     >";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "09.01");
  equal(ranges, [[0, 13]], "09.02");
  equal(allTagLocations, [[0, 13]], "09.03");
  validateTagLocations(is, input, [[0, 13]]);
});

test("10 - string is whole (opening) tag - leading space is not retained", () => {
  let input = " <a>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "10.01");
  equal(ranges, [[0, 4]], "10.02");
  equal(allTagLocations, [[1, 4]], "10.03");
  validateTagLocations(is, input, [[1, 4]]);
});

test("11 - string is whole (opening) tag - trailing space is not retained", () => {
  let input = "< a> ";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "11.01");
  equal(ranges, [[0, 5]], "11.02");
  equal(allTagLocations, [[0, 4]], "11.03");
  validateTagLocations(is, input, [[0, 4]]);
});

test("12 - string is whole (opening) tag - surrounding whitespace outside", () => {
  let input = "  <a >  ";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "12.01");
  equal(ranges, [[0, 8]], "12.02");
  equal(allTagLocations, [[2, 6]], "12.03");
  validateTagLocations(is, input, [[2, 6]]);
});

test("13 - string is whole (opening) tag - raw tab in front", () => {
  let input = "\t< a >";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "13.01");
  equal(ranges, [[0, 6]], "13.02");
  equal(allTagLocations, [[1, 6]], "13.03");
  validateTagLocations(is, input, [[1, 6]]);
});

test("14 - string is whole (opening) tag - lots of different whitespace chars", () => {
  let input = "    \t   <     a     >      \n\n   ";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "14.01");
  equal(ranges, [[0, 32]], "14.02");
  equal(allTagLocations, [[8, 21]], "14.03");
  validateTagLocations(is, input, [[8, 21]]);
});

test("15 - string is whole (opening) tag - whitespace between tags is deleted too", () => {
  let input = "<a>         <a>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "15.01");
  equal(ranges, [[0, 15]], "15.02");
  equal(
    allTagLocations,
    [
      [0, 3],
      [12, 15],
    ],
    "15.03",
  );
  validateTagLocations(is, input, [
    [0, 3],
    [12, 15],
  ]);
});

test("16 - string is whole (opening) tag - whitespace between tag and text is removed", () => {
  let input = "<a>         z";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "z", "16.01");
  equal(ranges, [[0, 12]], "16.02");
  equal(allTagLocations, [[0, 3]], "16.03");
  validateTagLocations(is, input, [[0, 3]]);
});

test("17 - string is whole (opening) tag - leading/trailing spaces", () => {
  let input = "   <b>text</b>   ";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "text", "17.01");
  equal(
    ranges,
    [
      [0, 6],
      [10, 17],
    ],
    "17.02",
  );
  equal(
    allTagLocations,
    [
      [3, 6],
      [10, 14],
    ],
    "17.03",
  );
  validateTagLocations(is, input, [
    [3, 6],
    [10, 14],
  ]);
});

test("18 - string is whole (opening) tag - but leading/trailing line breaks are deleted", () => {
  let input = "\n\n\n<b>text</b>\r\r\r";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "text", "18.01");
  equal(
    ranges,
    [
      [0, 6],
      [10, 17],
    ],
    "18.02",
  );
  equal(
    allTagLocations,
    [
      [3, 6],
      [10, 14],
    ],
    "18.03",
  );

  validateTagLocations(is, input, [
    [3, 6],
    [10, 14],
  ]);
});

test("19 - string is whole (opening) tag - HTML tag with attributes", () => {
  let input =
    'z <a href="https://codsen.com" target="_blank"> z <a href="zzz" target="_blank"> z';
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "z z z", "19.01");
  equal(
    ranges,
    [
      [1, 48, " "],
      [49, 81, " "],
    ],
    "19.02",
  );
  equal(
    allTagLocations,
    [
      [2, 47],
      [50, 80],
    ],
    "19.03",
  );
  validateTagLocations(is, input, [
    [2, 47],
    [50, 80],
  ]);
});

test("20 - string is whole (opening) tag - custom tag names, healthy", () => {
  let input = "<custom>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "20.01");
  equal(ranges, [[0, 8]], "20.02");
  equal(allTagLocations, [[0, 8]], "20.03");
  validateTagLocations(is, input, [[0, 8]]);
});

test("21 - string is whole (opening) tag - custom tag names, missing closing bracket", () => {
  let input = "<custom";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "21.01");
  equal(ranges, [[0, 7]], "21.02");
  equal(allTagLocations, [[0, 7]], "21.03");
  // can't call validateTagLocations() because bracket is missing
});

test("22 - string is whole (opening) tag - custom tag names, dash in the name", () => {
  let input = "<custom-tag>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "22.01");
  equal(ranges, [[0, 12]], "22.02");
  equal(allTagLocations, [[0, 12]], "22.03");
  validateTagLocations(is, input, [[0, 12]]);
});

test("23 - string is whole (opening) tag - dash is name's first character", () => {
  let input = "<-tag>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "23.01");
  equal(ranges, [[0, 6]], "23.02");
  equal(allTagLocations, [[0, 6]], "23.03");
  validateTagLocations(is, input, [[0, 6]]);
});

test("24 - string is whole (opening) tag - multiple custom", () => {
  let input = "<custom><custom><custom>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "24.01");
  equal(ranges, [[0, 24]], "24.02");
  equal(
    allTagLocations,
    [
      [0, 8],
      [8, 16],
      [16, 24],
    ],
    "24.03",
  );
  validateTagLocations(is, input, [
    [0, 8],
    [8, 16],
    [16, 24],
  ]);
});

test("25 - string is whole (opening) tag - multiple custom with dashes", () => {
  let input = "<custom-tag><custom-tag><custom-tag>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "25.01");
  equal(ranges, [[0, 36]], "25.02");
  equal(
    allTagLocations,
    [
      [0, 12],
      [12, 24],
      [24, 36],
    ],
    "25.03",
  );
  validateTagLocations(is, input, [
    [0, 12],
    [12, 24],
    [24, 36],
  ]);
});

test("26 - string is whole (opening) tag - multiple custom with names starting with dashes", () => {
  let input = "<-tag><-tag><-tag>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "26.01");
  equal(ranges, [[0, 18]], "26.02");
  equal(
    allTagLocations,
    [
      [0, 6],
      [6, 12],
      [12, 18],
    ],
    "26.03",
  );
  validateTagLocations(is, input, [
    [0, 6],
    [6, 12],
    [12, 18],
  ]);
});

test("27 - string is whole (opening) tag - multiple custom with surroundings", () => {
  let input = "a<custom><custom><custom>b";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "a b", "27.01");
  equal(ranges, [[1, 25, " "]], "27.02");
  equal(
    allTagLocations,
    [
      [1, 9],
      [9, 17],
      [17, 25],
    ],
    "27.03",
  );
  validateTagLocations(is, input, [
    [1, 9],
    [9, 17],
    [17, 25],
  ]);
});

test("28 - string is whole (opening) tag - multiple custom with surroundings with dashes", () => {
  let input = "a<custom-tag><custom-tag><custom-tag>b";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "a b", "28.01");
  equal(ranges, [[1, 37, " "]], "28.02");
  equal(
    allTagLocations,
    [
      [1, 13],
      [13, 25],
      [25, 37],
    ],
    "28.03",
  );
  validateTagLocations(is, input, [
    [1, 13],
    [13, 25],
    [25, 37],
  ]);
});

test("29 - string is whole (opening) tag - multiple custom with surroundings starting with dashes", () => {
  let input = "a<-tag><-tag><-tag>b";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "a b", "29.01");
  equal(ranges, [[1, 19, " "]], "29.02");
  equal(
    allTagLocations,
    [
      [1, 7],
      [7, 13],
      [13, 19],
    ],
    "29.03",
  );
  validateTagLocations(is, input, [
    [1, 7],
    [7, 13],
    [13, 19],
  ]);
});

test("30 - string is whole (opening) tag - self-closing - multiple with surroundings, inner whitespace", () => {
  let input = "a</custom>< /custom><custom/>b";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "a b", "30.01");
  equal(ranges, [[1, 29, " "]], "30.02");
  equal(
    allTagLocations,
    [
      [1, 10],
      [10, 20],
      [20, 29],
    ],
    "30.03",
  );
  validateTagLocations(is, input, [
    [1, 10],
    [10, 20],
    [20, 29],
  ]);
});

test("31 - string is whole (opening) tag - self-closing - multiple", () => {
  let input = "a<custom-tag /></ custom-tag>< /custom-tag>b";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "a b", "31.01");
  equal(ranges, [[1, 43, " "]], "31.02");
  equal(
    allTagLocations,
    [
      [1, 15],
      [15, 29],
      [29, 43],
    ],
    "31.03",
  );
  validateTagLocations(is, input, [
    [1, 15],
    [15, 29],
    [29, 43],
  ]);
});

test("32 - string is whole (opening) tag - self-closing - multiple names start with dash", () => {
  let input = "a</ -tag>< /-tag><-tag / >   b";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "a b", "32.01");
  equal(ranges, [[1, 29, " "]], "32.02");
  equal(
    allTagLocations,
    [
      [1, 9],
      [9, 17],
      [17, 26],
    ],
    "32.03",
  );
  validateTagLocations(is, input, [
    [1, 9],
    [9, 17],
    [17, 26],
  ]);
});

test("33 - string is whole (opening) tag - custom, outer whitespace", () => {
  let input = "a  </custom>< /custom><custom/>   b";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "a b", "33.01");
  equal(ranges, [[1, 34, " "]], "33.02");
  equal(
    allTagLocations,
    [
      [3, 12],
      [12, 22],
      [22, 31],
    ],
    "33.03",
  );
  validateTagLocations(is, input, [
    [3, 12],
    [12, 22],
    [22, 31],
  ]);
});

test("34 - string is whole (opening) tag - custom, line breaks", () => {
  let input = "a\n<custom-tag /></ custom-tag>\n< /custom-tag>\n\nb";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "a\n\nb", "34.01");
  equal(ranges, [[1, 47, "\n\n"]], "34.02");
  equal(
    allTagLocations,
    [
      [2, 16],
      [16, 30],
      [31, 45],
    ],
    "34.03",
  );
  validateTagLocations(is, input, [
    [2, 16],
    [16, 30],
    [31, 45],
  ]);
});

test("35 - string is whole (opening) tag - custom, outer tabs", () => {
  let input = "a\t\t</ -tag>< /-tag><-tag / >   \t b";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "a b", "35.01");
  equal(ranges, [[1, 33, " "]], "35.02");
  equal(
    allTagLocations,
    [
      [3, 11],
      [11, 19],
      [19, 28],
    ],
    "35.03",
  );
  validateTagLocations(is, input, [
    [3, 11],
    [11, 19],
    [19, 28],
  ]);
});

test("36 - string is whole (closing) tag - self-closing - single", () => {
  let input = "</a>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "36.01");
  equal(ranges, [[0, 4]], "36.02");
  equal(allTagLocations, [[0, 4]], "36.03");
  validateTagLocations(is, input, [[0, 4]]);
});

test("37 - string is whole (closing) tag - self-closing - whitespace before slash", () => {
  let input = "< /a>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "37.01");
  equal(ranges, [[0, 5]], "37.02");
  equal(allTagLocations, [[0, 5]], "37.03");
  validateTagLocations(is, input, [[0, 5]]);
});

test("38 - string is whole (closing) tag - self-closing - whitespace after slash", () => {
  let input = "< / a>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "38.01");
  equal(ranges, [[0, 6]], "38.02");
  equal(allTagLocations, [[0, 6]], "38.03");
  validateTagLocations(is, input, [[0, 6]]);
});

test("39 - string is whole (closing) tag - self-closing - whitespace after name", () => {
  let input = "</a >";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "39.01");
  equal(ranges, [[0, 5]], "39.02");
  equal(allTagLocations, [[0, 5]], "39.03");
  validateTagLocations(is, input, [[0, 5]]);
});

test("40 - string is whole (closing) tag - self-closing - surrounding whitespace #2", () => {
  let input = "</ a >";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "40.01");
  equal(ranges, [[0, 6]], "40.02");
  equal(allTagLocations, [[0, 6]], "40.03");
  validateTagLocations(is, input, [[0, 6]]);
});

test("41 - string is whole (closing) tag - self-closing - whitespace everywhere", () => {
  let input = "< / a >";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "41.01");
  equal(ranges, [[0, 7]], "41.02");
  equal(allTagLocations, [[0, 7]], "41.03");
  validateTagLocations(is, input, [[0, 7]]);
});

test("42 - string is whole (closing) tag - self-closing - copious whitespace everywhere", () => {
  let input = "<  /   a     >";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "42.01");
  equal(ranges, [[0, 14]], "42.02");
  equal(allTagLocations, [[0, 14]], "42.03");
  validateTagLocations(is, input, [[0, 14]]);
});

test("43 - string is whole (closing) tag - self-closing - leading outside whitespace", () => {
  let input = " </a>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "43.01");
  equal(ranges, [[0, 5]], "43.02");
  equal(allTagLocations, [[1, 5]], "43.03");
  validateTagLocations(is, input, [[1, 5]]);
});

test("44 - string is whole (closing) tag - self-closing - trailing outside whitespace", () => {
  let input = "< /a> ";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "44.01");
  equal(ranges, [[0, 6]], "44.02");
  equal(allTagLocations, [[0, 5]], "44.03");
  validateTagLocations(is, input, [[0, 5]]);
});

test("45 - string is whole (closing) tag - self-closing - outside whitespace on both sides", () => {
  let input = "  </a >  ";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "45.01");
  equal(ranges, [[0, 9]], "45.02");
  equal(allTagLocations, [[2, 7]], "45.03");
  validateTagLocations(is, input, [[2, 7]]);
});

test("46 - string is whole (closing) tag - self-closing - copious outside whitespace on both sides", () => {
  let input = "\t< /a >";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "46.01");
  equal(ranges, [[0, 7]], "46.02");
  equal(allTagLocations, [[1, 7]], "46.03");
  validateTagLocations(is, input, [[1, 7]]);
});

test("47 - string is whole (closing) tag - self-closing - even more copious outside whitespace on both sides", () => {
  let input = "    \t   <   /  a     >      \n\n   ";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "47.01");
  equal(ranges, [[0, 33]], "47.02");
  equal(allTagLocations, [[8, 22]], "47.03");
  validateTagLocations(is, input, [[8, 22]]);
});

test("48 - dodgy attribute", () => {
  let input = "< abc |>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, input, "48.01");
  equal(ranges, null, "48.02");
  equal(allTagLocations, [[0, 8]], "48.03");
  validateTagLocations(is, input, [[0, 8]]);
});

test("49 - dodgy attribute", () => {
  let input = "<table .>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "49.01");
  equal(ranges, [[0, 9]], "49.02");
  equal(allTagLocations, [[0, 9]], "49.03");
  validateTagLocations(is, input, [[0, 9]]);
});

test("50 - dodgy attribute from astral range", () => {
  let dodgyChar = String.fromCharCode(64976);
  let input = `<table ${dodgyChar}>`;
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "50.01");
  equal(ranges, [[0, 9]], "50.02");
  equal(allTagLocations, [[0, 9]], "50.03");
  validateTagLocations(is, input, [[0, 9]]);
});

test("51 - minimal, doctype", () => {
  let { result, allTagLocations } = stripHtml("<!DOCTYPE html>z");
  equal(
    { result, allTagLocations },
    { result: "z", allTagLocations: [[0, 15]] },
    "51.01",
  );
});

test("52 - invisibles from email templates", () => {
  // https://www.fileformat.info/info/unicode/char/034f/index.htm
  // decimal &#847;
  // hex &#x34f;
  // raw \u034F
  let { result, allTagLocations } = stripHtml(
    'z<span class="emailPreviewText" style="display:none;font-size:0px;line-height:0px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;visibility:hidden;mso-hide:all;" aria-hidden="true"> &#847; &#x34f; \u034F &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;&#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;&#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;&#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;&#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;&#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; </span>',
  );
  equal(
    { result, allTagLocations },
    {
      result: "z",
      allTagLocations: [
        [1, 189],
        [505, 512],
      ],
    },
    "52.01",
  );
});

test.run();
