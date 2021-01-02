import tap from "tap";
import { stripHtml } from "../dist/string-strip-html.esm";
import validateallTagLocations from "./util/validateTagLocations";

// normal use cases
// -----------------------------------------------------------------------------

tap.test("01 - string is whole (opening) tag - no ignore", (t) => {
  const input = `<a>`;
  const allTagLocations = [[0, 3]];
  t.match(stripHtml(input), { result: "", allTagLocations }, "01");
  t.end();
});

tap.test("02 - string is whole (opening) tag - no ignore", (t) => {
  const input = `<a/>`;
  const allTagLocations = [[0, 4]];
  t.match(stripHtml(input), { result: "", allTagLocations }, "02");
  t.end();
});

tap.test("03 - string is whole (opening) tag - no ignore", (t) => {
  const input = `<a />`;
  const allTagLocations = [[0, 5]];
  t.match(stripHtml(input), { result: "", allTagLocations }, "03");
  t.end();
});

tap.test("04 - string is whole (opening) tag - ignore but wrong", (t) => {
  const input = `<a>`;
  const allTagLocations = [[0, 3]];
  t.match(
    stripHtml(input, {
      ignoreTags: ["b"],
    }),
    { result: "", ranges: allTagLocations, allTagLocations },
    "04"
  );
  validateallTagLocations(t, input, allTagLocations);
  t.end();
});

tap.test("05 - string is whole (opening) tag - ignore", (t) => {
  const input = `<a>`;
  const allTagLocations = [[0, 3]];
  t.match(
    stripHtml(input, {
      ignoreTags: ["a"],
    }),
    { result: "<a>", ranges: null, allTagLocations },
    "05"
  );
  validateallTagLocations(t, input, allTagLocations);
  t.end();
});

tap.test(
  "06 - string is whole (opening) tag - whitespace after opening bracket",
  (t) => {
    const input = `< a>`;
    const allTagLocations = [[0, 4]];
    t.match(
      stripHtml(input),
      { result: "", ranges: allTagLocations, allTagLocations },
      "06"
    );
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "07 - string is whole (opening) tag - whitespace before closing bracket",
  (t) => {
    const input = `<a >`;
    const allTagLocations = [[0, 4]];
    t.match(
      stripHtml(input),
      { result: "", ranges: allTagLocations, allTagLocations },
      "07"
    );
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "08 - string is whole (opening) tag - whitespace inside on both sides",
  (t) => {
    const input = `< a >`;
    const allTagLocations = [[0, 5]];
    t.match(
      stripHtml(input),
      { result: "", ranges: allTagLocations, allTagLocations },
      "08"
    );
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "09 - string is whole (opening) tag - copious whitespace inside on both sides",
  (t) => {
    const input = `<     a     >`;
    const allTagLocations = [[0, 13]];
    t.match(
      stripHtml(input),
      { result: "", ranges: allTagLocations, allTagLocations },
      "09"
    );
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "10 - string is whole (opening) tag - leading space is not retained",
  (t) => {
    const input = ` <a>`;
    const allTagLocations = [[1, 4]];
    t.match(
      stripHtml(input),
      { result: "", ranges: [[0, 4]], allTagLocations },
      "10"
    );
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "11 - string is whole (opening) tag - trailing space is not retained",
  (t) => {
    const input = `< a> `;
    const allTagLocations = [[0, 4]];
    t.match(
      stripHtml(input),
      { result: "", ranges: [[0, 5]], allTagLocations },
      "11"
    );
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "12 - string is whole (opening) tag - surrounding whitespace outside",
  (t) => {
    const input = `  <a >  `;
    const allTagLocations = [[2, 6]];
    t.match(
      stripHtml(input),
      { result: "", ranges: [[0, 8]], allTagLocations },
      "12"
    );
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test("13 - string is whole (opening) tag - raw tab in front", (t) => {
  const input = `\t< a >`;
  const allTagLocations = [[1, 6]];
  t.match(
    stripHtml(input),
    { result: "", ranges: [[0, 6]], allTagLocations },
    "13"
  );
  validateallTagLocations(t, input, allTagLocations);
  t.end();
});

tap.test(
  "14 - string is whole (opening) tag - lots of different whitespace chars",
  (t) => {
    const input = `    \t   <     a     >      \n\n   `;
    const allTagLocations = [[8, 21]];
    t.match(
      stripHtml(input),
      { result: "", ranges: [[0, 32]], allTagLocations },
      "14"
    );
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "15 - string is whole (opening) tag - whitespace between tags is deleted too",
  (t) => {
    const input = `<a>         <a>`;
    const allTagLocations = [
      [0, 3],
      [12, 15],
    ];
    t.match(
      stripHtml(input),
      { result: "", ranges: [[0, 15]], allTagLocations },
      "15"
    );
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "16 - string is whole (opening) tag - whitespace between tag and text is removed",
  (t) => {
    const input = `<a>         z`;
    const allTagLocations = [[0, 3]];
    t.match(stripHtml(input), { result: "z", allTagLocations }, "16");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "17 - string is whole (opening) tag - leading/trailing spaces",
  (t) => {
    const input = `   <b>text</b>   `;
    const allTagLocations = [
      [3, 6],
      [10, 14],
    ];
    t.match(stripHtml(input), { result: "text", allTagLocations }, "17");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "18 - string is whole (opening) tag - but leading/trailing line breaks are deleted",
  (t) => {
    const input = `\n\n\n<b>text</b>\r\r\r`;
    const allTagLocations = [
      [3, 6],
      [10, 14],
    ];
    t.match(stripHtml(input), { result: "text", allTagLocations }, "18");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "19 - string is whole (opening) tag - HTML tag with attributes",
  (t) => {
    const input = `z<a href="https://codsen.com" target="_blank">z<a href="zzz" target="_blank">z`;
    const allTagLocations = [
      [1, 46],
      [47, 77],
    ];
    t.match(stripHtml(input), { result: "z z z", allTagLocations }, "19");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "20 - string is whole (opening) tag - custom tag names, healthy",
  (t) => {
    const input = `<custom>`;
    const allTagLocations = [[0, 8]];
    t.match(
      stripHtml(input),
      { result: "", ranges: allTagLocations, allTagLocations },
      "20"
    );
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "21 - string is whole (opening) tag - custom tag names, missing closing bracket",
  (t) => {
    const input = `<custom`;
    const allTagLocations = [[0, 7]];
    t.match(stripHtml(input), { result: "", allTagLocations }, "21");
    // can't call validateallTagLocations() because bracket is missing
    t.end();
  }
);

tap.test(
  "22 - string is whole (opening) tag - custom tag names, dash in the name",
  (t) => {
    const input = `<custom-tag>`;
    const allTagLocations = [[0, 12]];
    t.match(stripHtml(input), { result: "", allTagLocations }, "22");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "23 - string is whole (opening) tag - dash is name's first character",
  (t) => {
    const input = `<-tag>`;
    const allTagLocations = [[0, 6]];
    t.match(stripHtml(input), { result: "", allTagLocations }, "23");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test("24 - string is whole (opening) tag - multiple custom", (t) => {
  const input = `<custom><custom><custom>`;
  const allTagLocations = [
    [0, 8],
    [8, 16],
    [16, 24],
  ];
  t.match(stripHtml(input), { result: "", allTagLocations }, "24");
  validateallTagLocations(t, input, allTagLocations);
  t.end();
});

tap.test(
  "25 - string is whole (opening) tag - multiple custom with dashes",
  (t) => {
    const input = `<custom-tag><custom-tag><custom-tag>`;
    const allTagLocations = [
      [0, 12],
      [12, 24],
      [24, 36],
    ];
    t.match(stripHtml(input), { result: "", allTagLocations }, "25");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "26 - string is whole (opening) tag - multiple custom with names starting with dashes",
  (t) => {
    const input = `<-tag><-tag><-tag>`;
    const allTagLocations = [
      [0, 6],
      [6, 12],
      [12, 18],
    ];
    t.match(stripHtml(input), { result: "", allTagLocations }, "26");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "27 - string is whole (opening) tag - multiple custom with surroundings",
  (t) => {
    const input = `a<custom><custom><custom>b`;
    const allTagLocations = [
      [1, 9],
      [9, 17],
      [17, 25],
    ];
    t.match(stripHtml(input), { result: "a b", allTagLocations }, "27");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "28 - string is whole (opening) tag - multiple custom with surroundings with dashes",
  (t) => {
    const input = `a<custom-tag><custom-tag><custom-tag>b`;
    const allTagLocations = [
      [1, 13],
      [13, 25],
      [25, 37],
    ];
    t.match(stripHtml(input), { result: "a b", allTagLocations }, "28");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "29 - string is whole (opening) tag - multiple custom with surroundings starting with dashes",
  (t) => {
    const input = `a<-tag><-tag><-tag>b`;
    const allTagLocations = [
      [1, 7],
      [7, 13],
      [13, 19],
    ];
    t.match(stripHtml(input), { result: "a b", allTagLocations }, "29");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "30 - string is whole (opening) tag - self-closing - multiple with surroundings, inner whitespace",
  (t) => {
    const input = `a</custom>< /custom><custom/>b`;
    const allTagLocations = [
      [1, 10],
      [10, 20],
      [20, 29],
    ];
    t.match(stripHtml(input), { result: "a b", allTagLocations }, "30");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "31 - string is whole (opening) tag - self-closing - multiple",
  (t) => {
    const input = `a<custom-tag /></ custom-tag>< /custom-tag>b`;
    const allTagLocations = [
      [1, 15],
      [15, 29],
      [29, 43],
    ];
    t.match(stripHtml(input), { result: "a b", allTagLocations }, "31");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "32 - string is whole (opening) tag - self-closing - multiple names start with dash",
  (t) => {
    const input = `a</ -tag>< /-tag><-tag / >   b`;
    const allTagLocations = [
      [1, 9],
      [9, 17],
      [17, 26],
    ];
    t.match(stripHtml(input), { result: "a b", allTagLocations }, "32");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "33 - string is whole (opening) tag - custom, outer whitespace",
  (t) => {
    const input = `a  </custom>< /custom><custom/>   b`;
    const allTagLocations = [
      [3, 12],
      [12, 22],
      [22, 31],
    ];
    t.match(stripHtml(input), { result: "a b", allTagLocations }, "33");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test("34 - string is whole (opening) tag - custom, line breaks", (t) => {
  const input = `a\n<custom-tag /></ custom-tag>\n< /custom-tag>\n\nb`;
  const allTagLocations = [
    [2, 16],
    [16, 30],
    [31, 45],
  ];
  t.match(stripHtml(input), { result: "a\n\nb", allTagLocations }, "34");
  validateallTagLocations(t, input, allTagLocations);
  t.end();
});

tap.test("35 - string is whole (opening) tag - custom, outer tabs", (t) => {
  const input = `a\t\t</ -tag>< /-tag><-tag / >   \t b`;
  const allTagLocations = [
    [3, 11],
    [11, 19],
    [19, 28],
  ];
  t.match(stripHtml(input), { result: "a b", allTagLocations }, "35");
  validateallTagLocations(t, input, allTagLocations);
  t.end();
});

tap.test("36 - string is whole (closing) tag - self-closing - single", (t) => {
  const input = `</a>`;
  const allTagLocations = [[0, 4]];
  t.match(stripHtml(input), { result: "", allTagLocations }, "36");
  validateallTagLocations(t, input, allTagLocations);
  t.end();
});

tap.test(
  "37 - string is whole (closing) tag - self-closing - whitespace before slash",
  (t) => {
    const input = `< /a>`;
    const allTagLocations = [[0, 5]];
    t.match(stripHtml(input), { result: "", allTagLocations }, "37");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "38 - string is whole (closing) tag - self-closing - whitespace after slash",
  (t) => {
    const input = `< / a>`;
    const allTagLocations = [[0, 6]];
    t.match(stripHtml(input), { result: "", allTagLocations }, "38");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "39 - string is whole (closing) tag - self-closing - whitespace after name",
  (t) => {
    const input = `</a >`;
    const allTagLocations = [[0, 5]];
    t.match(stripHtml(input), { result: "", allTagLocations }, "39");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "40 - string is whole (closing) tag - self-closing - surrounding whitespace #2",
  (t) => {
    const input = `</ a >`;
    const allTagLocations = [[0, 6]];
    t.match(stripHtml(input), { result: "", allTagLocations }, "40");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "41 - string is whole (closing) tag - self-closing - whitespace everywhere",
  (t) => {
    const input = `< / a >`;
    const allTagLocations = [[0, 7]];
    t.match(stripHtml(input), { result: "", allTagLocations }, "41");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "42 - string is whole (closing) tag - self-closing - copious whitespace everywhere",
  (t) => {
    const input = `<  /   a     >`;
    const allTagLocations = [[0, 14]];
    t.match(stripHtml(input), { result: "", allTagLocations }, "42");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "43 - string is whole (closing) tag - self-closing - leading outside whitespace",
  (t) => {
    const input = ` </a>`;
    const allTagLocations = [[1, 5]];
    t.match(stripHtml(input), { result: "", allTagLocations }, "43");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "44 - string is whole (closing) tag - self-closing - trailing outside whitespace",
  (t) => {
    const input = `< /a> `;
    const allTagLocations = [[0, 5]];
    t.match(stripHtml(input), { result: "", allTagLocations }, "44");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "45 - string is whole (closing) tag - self-closing - outside whitespace on both sides",
  (t) => {
    const input = `  </a >  `;
    const allTagLocations = [[2, 7]];
    t.match(stripHtml(input), { result: "", allTagLocations }, "45");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "46 - string is whole (closing) tag - self-closing - copious outside whitespace on both sides",
  (t) => {
    const input = `\t< /a >`;
    const allTagLocations = [[1, 7]];
    t.match(stripHtml(input), { result: "", allTagLocations }, "46");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test(
  "47 - string is whole (closing) tag - self-closing - even more copious outside whitespace on both sides",
  (t) => {
    const input = `    \t   <   /  a     >      \n\n   `;
    const allTagLocations = [[8, 22]];
    t.match(stripHtml(input), { result: "", allTagLocations }, "47");
    validateallTagLocations(t, input, allTagLocations);
    t.end();
  }
);

tap.test("48 - dodgy attribute", (t) => {
  const input = `< abc |>`;
  const allTagLocations = [[0, 8]];
  t.match(stripHtml(input), { result: input, allTagLocations }, "48");
  validateallTagLocations(t, input, allTagLocations);
  t.end();
});

tap.test("49 - dodgy attribute", (t) => {
  const input = `<table .>`;
  const allTagLocations = [[0, 9]];
  t.match(stripHtml(input), { result: "", allTagLocations }, "49");
  validateallTagLocations(t, input, allTagLocations);
  t.end();
});

tap.test("50 - dodgy attribute from astral range", (t) => {
  const dodgyChar = String.fromCharCode(64976);
  const input = `<table ${dodgyChar}>`;
  const allTagLocations = [[0, 9]];
  t.match(stripHtml(input), { result: "", allTagLocations }, "50");
  validateallTagLocations(t, input, allTagLocations);
  t.end();
});
