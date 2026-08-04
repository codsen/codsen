// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";
import validateTagLocations from "./util/validateTagLocations.js";

// normal use cases
// -----------------------------------------------------------------------------

test("001 - string is whole (opening) tag - no ignore", () => {
  let { result, allTagLocations } = stripHtml("<a>");
  equal(
    { result, allTagLocations },
    { result: "", allTagLocations: [[0, 3]] },
    "001.01",
  );
});

test("002 - string is whole (opening) tag - no ignore", () => {
  let { result, allTagLocations } = stripHtml("<a/>");
  equal(
    { result, allTagLocations },
    { result: "", allTagLocations: [[0, 4]] },
    "002.01",
  );
});

test("003 - string is whole (opening) tag - no ignore", () => {
  let { result, allTagLocations } = stripHtml("<a />");
  equal(
    { result, allTagLocations },
    { result: "", allTagLocations: [[0, 5]] },
    "003.01",
  );
});

test("004 - string is whole (opening) tag - ignore but wrong", () => {
  let input = "<a>";
  let { result, ranges, allTagLocations } = stripHtml(input, {
    ignoreTags: ["b"],
  });
  equal(result, "", "004.01");
  equal(ranges, [[0, 3]], "004.02");
  equal(allTagLocations, [[0, 3]], "004.03");

  validateTagLocations(is, input, [[0, 3]]);
});

test("005 - string is whole (opening) tag - ignore", () => {
  let input = "<a>";
  let { result, ranges, allTagLocations } = stripHtml(input, {
    ignoreTags: ["a"],
  });
  equal(result, "<a>", "005.01");
  equal(ranges, null, "005.02");
  equal(allTagLocations, [[0, 3]], "005.03");
  validateTagLocations(is, input, [[0, 3]]);
});

test("006 - string is whole (opening) tag - whitespace after opening bracket", () => {
  let input = "< a>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "006.01");
  equal(ranges, [[0, 4]], "006.02");
  equal(allTagLocations, [[0, 4]], "006.03");
  validateTagLocations(is, input, [[0, 4]]);
});

test("007 - string is whole (opening) tag - whitespace before closing bracket", () => {
  let input = "<a >";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "007.01");
  equal(ranges, [[0, 4]], "007.02");
  equal(allTagLocations, [[0, 4]], "007.03");
  validateTagLocations(is, input, [[0, 4]]);
});

test("008 - string is whole (opening) tag - whitespace inside on both sides", () => {
  let input = "< a >";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "008.01");
  equal(ranges, [[0, 5]], "008.02");
  equal(allTagLocations, [[0, 5]], "008.03");
  validateTagLocations(is, input, [[0, 5]]);
});

test("009 - string is whole (opening) tag - copious whitespace inside on both sides", () => {
  let input = "<     a     >";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "009.01");
  equal(ranges, [[0, 13]], "009.02");
  equal(allTagLocations, [[0, 13]], "009.03");
  validateTagLocations(is, input, [[0, 13]]);
});

test("010 - string is whole (opening) tag - leading space is not retained", () => {
  let input = " <a>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "010.01");
  equal(ranges, [[0, 4]], "010.02");
  equal(allTagLocations, [[1, 4]], "010.03");
  validateTagLocations(is, input, [[1, 4]]);
});

test("011 - string is whole (opening) tag - trailing space is not retained", () => {
  let input = "< a> ";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "011.01");
  equal(ranges, [[0, 5]], "011.02");
  equal(allTagLocations, [[0, 4]], "011.03");
  validateTagLocations(is, input, [[0, 4]]);
});

test("012 - string is whole (opening) tag - surrounding whitespace outside", () => {
  let input = "  <a >  ";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "012.01");
  equal(ranges, [[0, 8]], "012.02");
  equal(allTagLocations, [[2, 6]], "012.03");
  validateTagLocations(is, input, [[2, 6]]);
});

test("013 - string is whole (opening) tag - raw tab in front", () => {
  let input = "\t< a >";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "013.01");
  equal(ranges, [[0, 6]], "013.02");
  equal(allTagLocations, [[1, 6]], "013.03");
  validateTagLocations(is, input, [[1, 6]]);
});

test("014 - string is whole (opening) tag - lots of different whitespace chars", () => {
  let input = "    \t   <     a     >      \n\n   ";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "014.01");
  equal(ranges, [[0, 32]], "014.02");
  equal(allTagLocations, [[8, 21]], "014.03");
  validateTagLocations(is, input, [[8, 21]]);
});

test("015 - string is whole (opening) tag - whitespace between tags is deleted too", () => {
  let input = "<a>         <a>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "015.01");
  equal(ranges, [[0, 15]], "015.02");
  equal(
    allTagLocations,
    [
      [0, 3],
      [12, 15],
    ],
    "015.03",
  );
  validateTagLocations(is, input, [
    [0, 3],
    [12, 15],
  ]);
});

test("016 - string is whole (opening) tag - whitespace between tag and text is removed", () => {
  let input = "<a>         z";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "z", "016.01");
  equal(ranges, [[0, 12]], "016.02");
  equal(allTagLocations, [[0, 3]], "016.03");
  validateTagLocations(is, input, [[0, 3]]);
});

test("017 - string is whole (opening) tag - leading/trailing spaces", () => {
  let input = "   <b>text</b>   ";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "text", "017.01");
  equal(
    ranges,
    [
      [0, 6],
      [10, 17],
    ],
    "017.02",
  );
  equal(
    allTagLocations,
    [
      [3, 6],
      [10, 14],
    ],
    "017.03",
  );
  validateTagLocations(is, input, [
    [3, 6],
    [10, 14],
  ]);
});

test("018 - string is whole (opening) tag - but leading/trailing line breaks are deleted", () => {
  let input = "\n\n\n<b>text</b>\r\r\r";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "text", "018.01");
  equal(
    ranges,
    [
      [0, 6],
      [10, 17],
    ],
    "018.02",
  );
  equal(
    allTagLocations,
    [
      [3, 6],
      [10, 14],
    ],
    "018.03",
  );

  validateTagLocations(is, input, [
    [3, 6],
    [10, 14],
  ]);
});

test("019 - string is whole (opening) tag - HTML tag with attributes", () => {
  let input =
    'z <a href="https://codsen.com" target="_blank"> z <a href="zzz" target="_blank"> z';
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "z z z", "019.01");
  equal(
    ranges,
    [
      [1, 48, " "],
      [49, 81, " "],
    ],
    "019.02",
  );
  equal(
    allTagLocations,
    [
      [2, 47],
      [50, 80],
    ],
    "019.03",
  );
  validateTagLocations(is, input, [
    [2, 47],
    [50, 80],
  ]);
});

test("020 - string is whole (opening) tag - custom tag names, healthy", () => {
  let input = "<custom>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "020.01");
  equal(ranges, [[0, 8]], "020.02");
  equal(allTagLocations, [[0, 8]], "020.03");
  validateTagLocations(is, input, [[0, 8]]);
});

test("021 - string is whole (opening) tag - custom tag names, missing closing bracket", () => {
  let input = "<custom";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "021.01");
  equal(ranges, [[0, 7]], "021.02");
  equal(allTagLocations, [[0, 7]], "021.03");
  // can't call validateTagLocations() because bracket is missing
});

test("022 - string is whole (opening) tag - custom tag names, dash in the name", () => {
  let input = "<custom-tag>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "022.01");
  equal(ranges, [[0, 12]], "022.02");
  equal(allTagLocations, [[0, 12]], "022.03");
  validateTagLocations(is, input, [[0, 12]]);
});

test("023 - string is whole (opening) tag - dash is name's first character", () => {
  let input = "<-tag>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "023.01");
  equal(ranges, [[0, 6]], "023.02");
  equal(allTagLocations, [[0, 6]], "023.03");
  validateTagLocations(is, input, [[0, 6]]);
});

test("024 - string is whole (opening) tag - multiple custom", () => {
  let input = "<custom><custom><custom>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "024.01");
  equal(ranges, [[0, 24]], "024.02");
  equal(
    allTagLocations,
    [
      [0, 8],
      [8, 16],
      [16, 24],
    ],
    "024.03",
  );
  validateTagLocations(is, input, [
    [0, 8],
    [8, 16],
    [16, 24],
  ]);
});

test("025 - string is whole (opening) tag - multiple custom with dashes", () => {
  let input = "<custom-tag><custom-tag><custom-tag>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "025.01");
  equal(ranges, [[0, 36]], "025.02");
  equal(
    allTagLocations,
    [
      [0, 12],
      [12, 24],
      [24, 36],
    ],
    "025.03",
  );
  validateTagLocations(is, input, [
    [0, 12],
    [12, 24],
    [24, 36],
  ]);
});

test("026 - string is whole (opening) tag - multiple custom with names starting with dashes", () => {
  let input = "<-tag><-tag><-tag>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "026.01");
  equal(ranges, [[0, 18]], "026.02");
  equal(
    allTagLocations,
    [
      [0, 6],
      [6, 12],
      [12, 18],
    ],
    "026.03",
  );
  validateTagLocations(is, input, [
    [0, 6],
    [6, 12],
    [12, 18],
  ]);
});

test("027 - string is whole (opening) tag - multiple custom with surroundings", () => {
  let input = "a<custom><custom><custom>b";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "a b", "027.01");
  equal(ranges, [[1, 25, " "]], "027.02");
  equal(
    allTagLocations,
    [
      [1, 9],
      [9, 17],
      [17, 25],
    ],
    "027.03",
  );
  validateTagLocations(is, input, [
    [1, 9],
    [9, 17],
    [17, 25],
  ]);
});

test("028 - string is whole (opening) tag - multiple custom with surroundings with dashes", () => {
  let input = "a<custom-tag><custom-tag><custom-tag>b";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "a b", "028.01");
  equal(ranges, [[1, 37, " "]], "028.02");
  equal(
    allTagLocations,
    [
      [1, 13],
      [13, 25],
      [25, 37],
    ],
    "028.03",
  );
  validateTagLocations(is, input, [
    [1, 13],
    [13, 25],
    [25, 37],
  ]);
});

test("029 - string is whole (opening) tag - multiple custom with surroundings starting with dashes", () => {
  let input = "a<-tag><-tag><-tag>b";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "a b", "029.01");
  equal(ranges, [[1, 19, " "]], "029.02");
  equal(
    allTagLocations,
    [
      [1, 7],
      [7, 13],
      [13, 19],
    ],
    "029.03",
  );
  validateTagLocations(is, input, [
    [1, 7],
    [7, 13],
    [13, 19],
  ]);
});

test("030 - string is whole (opening) tag - self-closing - multiple with surroundings, inner whitespace", () => {
  let input = "a</custom>< /custom><custom/>b";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "a b", "030.01");
  equal(ranges, [[1, 29, " "]], "030.02");
  equal(
    allTagLocations,
    [
      [1, 10],
      [10, 20],
      [20, 29],
    ],
    "030.03",
  );
  validateTagLocations(is, input, [
    [1, 10],
    [10, 20],
    [20, 29],
  ]);
});

test("031 - string is whole (opening) tag - self-closing - multiple", () => {
  let input = "a<custom-tag /></ custom-tag>< /custom-tag>b";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "a b", "031.01");
  equal(ranges, [[1, 43, " "]], "031.02");
  equal(
    allTagLocations,
    [
      [1, 15],
      [15, 29],
      [29, 43],
    ],
    "031.03",
  );
  validateTagLocations(is, input, [
    [1, 15],
    [15, 29],
    [29, 43],
  ]);
});

test("032 - string is whole (opening) tag - self-closing - multiple names start with dash", () => {
  let input = "a</ -tag>< /-tag><-tag / >   b";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "a b", "032.01");
  equal(ranges, [[1, 29, " "]], "032.02");
  equal(
    allTagLocations,
    [
      [1, 9],
      [9, 17],
      [17, 26],
    ],
    "032.03",
  );
  validateTagLocations(is, input, [
    [1, 9],
    [9, 17],
    [17, 26],
  ]);
});

test("033 - string is whole (opening) tag - custom, outer whitespace", () => {
  let input = "a  </custom>< /custom><custom/>   b";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "a b", "033.01");
  equal(ranges, [[1, 34, " "]], "033.02");
  equal(
    allTagLocations,
    [
      [3, 12],
      [12, 22],
      [22, 31],
    ],
    "033.03",
  );
  validateTagLocations(is, input, [
    [3, 12],
    [12, 22],
    [22, 31],
  ]);
});

test("034 - string is whole (opening) tag - custom, line breaks", () => {
  let input = "a\n<custom-tag /></ custom-tag>\n< /custom-tag>\n\nb";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "a\n\nb", "034.01");
  equal(ranges, [[1, 47, "\n\n"]], "034.02");
  equal(
    allTagLocations,
    [
      [2, 16],
      [16, 30],
      [31, 45],
    ],
    "034.03",
  );
  validateTagLocations(is, input, [
    [2, 16],
    [16, 30],
    [31, 45],
  ]);
});

test("035 - string is whole (opening) tag - custom, outer tabs", () => {
  let input = "a\t\t</ -tag>< /-tag><-tag / >   \t b";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "a b", "035.01");
  equal(ranges, [[1, 33, " "]], "035.02");
  equal(
    allTagLocations,
    [
      [3, 11],
      [11, 19],
      [19, 28],
    ],
    "035.03",
  );
  validateTagLocations(is, input, [
    [3, 11],
    [11, 19],
    [19, 28],
  ]);
});

test("036 - string is whole (closing) tag - self-closing - single", () => {
  let input = "</a>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "036.01");
  equal(ranges, [[0, 4]], "036.02");
  equal(allTagLocations, [[0, 4]], "036.03");
  validateTagLocations(is, input, [[0, 4]]);
});

test("037 - string is whole (closing) tag - self-closing - whitespace before slash", () => {
  let input = "< /a>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "037.01");
  equal(ranges, [[0, 5]], "037.02");
  equal(allTagLocations, [[0, 5]], "037.03");
  validateTagLocations(is, input, [[0, 5]]);
});

test("038 - string is whole (closing) tag - self-closing - whitespace after slash", () => {
  let input = "< / a>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "038.01");
  equal(ranges, [[0, 6]], "038.02");
  equal(allTagLocations, [[0, 6]], "038.03");
  validateTagLocations(is, input, [[0, 6]]);
});

test("039 - string is whole (closing) tag - self-closing - whitespace after name", () => {
  let input = "</a >";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "039.01");
  equal(ranges, [[0, 5]], "039.02");
  equal(allTagLocations, [[0, 5]], "039.03");
  validateTagLocations(is, input, [[0, 5]]);
});

test("040 - string is whole (closing) tag - self-closing - surrounding whitespace #2", () => {
  let input = "</ a >";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "040.01");
  equal(ranges, [[0, 6]], "040.02");
  equal(allTagLocations, [[0, 6]], "040.03");
  validateTagLocations(is, input, [[0, 6]]);
});

test("041 - string is whole (closing) tag - self-closing - whitespace everywhere", () => {
  let input = "< / a >";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "041.01");
  equal(ranges, [[0, 7]], "041.02");
  equal(allTagLocations, [[0, 7]], "041.03");
  validateTagLocations(is, input, [[0, 7]]);
});

test("042 - string is whole (closing) tag - self-closing - copious whitespace everywhere", () => {
  let input = "<  /   a     >";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "042.01");
  equal(ranges, [[0, 14]], "042.02");
  equal(allTagLocations, [[0, 14]], "042.03");
  validateTagLocations(is, input, [[0, 14]]);
});

test("043 - string is whole (closing) tag - self-closing - leading outside whitespace", () => {
  let input = " </a>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "043.01");
  equal(ranges, [[0, 5]], "043.02");
  equal(allTagLocations, [[1, 5]], "043.03");
  validateTagLocations(is, input, [[1, 5]]);
});

test("044 - string is whole (closing) tag - self-closing - trailing outside whitespace", () => {
  let input = "< /a> ";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "044.01");
  equal(ranges, [[0, 6]], "044.02");
  equal(allTagLocations, [[0, 5]], "044.03");
  validateTagLocations(is, input, [[0, 5]]);
});

test("045 - string is whole (closing) tag - self-closing - outside whitespace on both sides", () => {
  let input = "  </a >  ";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "045.01");
  equal(ranges, [[0, 9]], "045.02");
  equal(allTagLocations, [[2, 7]], "045.03");
  validateTagLocations(is, input, [[2, 7]]);
});

test("046 - string is whole (closing) tag - self-closing - copious outside whitespace on both sides", () => {
  let input = "\t< /a >";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "046.01");
  equal(ranges, [[0, 7]], "046.02");
  equal(allTagLocations, [[1, 7]], "046.03");
  validateTagLocations(is, input, [[1, 7]]);
});

test("047 - string is whole (closing) tag - self-closing - even more copious outside whitespace on both sides", () => {
  let input = "    \t   <   /  a     >      \n\n   ";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "047.01");
  equal(ranges, [[0, 33]], "047.02");
  equal(allTagLocations, [[8, 22]], "047.03");
  validateTagLocations(is, input, [[8, 22]]);
});

test("048 - dodgy attribute", () => {
  let input = "< abc |>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, input, "048.01");
  equal(ranges, null, "048.02");
  equal(allTagLocations, [[0, 8]], "048.03");
  validateTagLocations(is, input, [[0, 8]]);
});

test("049 - dodgy attribute", () => {
  let input = "<table .>";
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "049.01");
  equal(ranges, [[0, 9]], "049.02");
  equal(allTagLocations, [[0, 9]], "049.03");
  validateTagLocations(is, input, [[0, 9]]);
});

test("050 - dodgy attribute from astral range", () => {
  let dodgyChar = String.fromCharCode(64976);
  let input = `<table ${dodgyChar}>`;
  let { result, ranges, allTagLocations } = stripHtml(input);
  equal(result, "", "050.01");
  equal(ranges, [[0, 9]], "050.02");
  equal(allTagLocations, [[0, 9]], "050.03");
  validateTagLocations(is, input, [[0, 9]]);
});

test("051 - minimal, doctype", () => {
  let { result, allTagLocations } = stripHtml("<!DOCTYPE html>z");
  equal(
    { result, allTagLocations },
    { result: "z", allTagLocations: [[0, 15]] },
    "051.01",
  );
});

test("052 - invisibles from email templates", () => {
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
        [1301, 1308],
      ],
    },
    "052.01",
  );
});

test.run();
