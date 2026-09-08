import { test } from "uvu";
import { equal } from "uvu/assert";

import { splitEasy } from "../dist/csv-split-easy.esm.js";

test("01 - quoted line breaks in the first column remain field content", () => {
  for (const lineBreak of ["\n", "\r\n", "\r"]) {
    equal(
      splitEasy(`"first${lineBreak}second",tail`),
      [[`first${lineBreak}second`, "tail"]],
      "01.01",
    );
  }
});

test("02 - multiline middle columns preserve surrounding fields and records", () => {
  for (const lineBreak of ["\n", "\r\n", "\r"]) {
    equal(
      splitEasy(
        `id,notes,end\r\n1,"hello${lineBreak}world",tail\r\n2,last,done`,
      ),
      [
        ["id", "notes", "end"],
        ["1", `hello${lineBreak}world`, "tail"],
        ["2", "last", "done"],
      ],
      "02.01",
    );
  }
});

test("03 - a multiline final column can end at its closing quote", () => {
  for (const lineBreak of ["\n", "\r\n", "\r"]) {
    equal(
      splitEasy(`first,"hello${lineBreak}world"`),
      [["first", `hello${lineBreak}world`]],
      "03.01",
    );
    equal(
      splitEasy(`"hello${lineBreak}world"`),
      [[`hello${lineBreak}world`]],
      "03.02",
    );
  }
});

test("04 - leading trailing and adjacent embedded breaks retain every character", () => {
  for (const value of [
    "\ntext",
    "text\r",
    "\r\ntext\r\n",
    "first\n\r\n\r\r\nlast",
    "  \r\n text \n\t ",
  ]) {
    equal(splitEasy(`id,"${value}",tail`), [["id", value, "tail"]], "04.01");
  }
});

test("05 - multiline fields decode doubled quotes without losing their text", () => {
  for (const lineBreak of ["\n", "\r\n", "\r"]) {
    equal(
      splitEasy(`"""hello${lineBreak}""world""",tail`),
      [[`"hello${lineBreak}"world"`, "tail"]],
      "05.01",
    );
    equal(
      splitEasy(`id,notes\n1,"  hello""${lineBreak}world""  "`),
      [
        ["id", "notes"],
        ["1", `  hello"${lineBreak}world"  `],
      ],
      "05.02",
    );
  }
});

test("06 - custom delimiters stay inside quoted multiline fields", () => {
  for (const delimiter of [";", "|", "\t"]) {
    equal(
      splitEasy(`id${delimiter}"first${delimiter}\r\nsecond"${delimiter}tail`, {
        delimiter,
      }),
      [["id", `first${delimiter}\r\nsecond`, "tail"]],
      "06.01",
    );
  }
});

test("07 - blank-row removal does not erase fields in nonempty multiline rows", () => {
  equal(splitEasy('id,"\r\n",tail'), [["id", "\r\n", "tail"]], "07.01");
  equal(splitEasy('" \n \r\n "'), [[""]], "07.02");
  equal(splitEasy('" \n ",\r\nnext,row'), [["next", "row"]], "07.03");
  equal(
    splitEasy('" \n ",tail\r\nnext,row'),
    [
      [" \n ", "tail"],
      ["next", "row"],
    ],
    "07.04",
  );
});

test("08 - numeric options leave multiline text intact and still format other cells", () => {
  const value = " \n1,000.5\r\n ";
  for (const removeThousandSeparatorsFromNumbers of [false, true]) {
    for (const padSingleDecimalPlaceNumbers of [false, true]) {
      for (const forceUKStyle of [false, true]) {
        equal(
          splitEasy(`id;"${value}";"1.5"`, {
            delimiter: ";",
            removeThousandSeparatorsFromNumbers,
            padSingleDecimalPlaceNumbers,
            forceUKStyle,
          }),
          [["id", value, padSingleDecimalPlaceNumbers ? "1.50" : "1.5"]],
          "08.01",
        );
      }
    }
  }
});

test("09 - external break clusters remain separate from quoted break sequences", () => {
  equal(
    splitEasy('"first\r\nsecond",tail\n\r\r\nnext,"third\n\rfourth"\r\n\n'),
    [
      ["first\r\nsecond", "tail"],
      ["next", "third\n\rfourth"],
    ],
    "09.01",
  );
});

test("10 - ordinary and escaped-quote whitespace behavior remains unchanged", () => {
  equal(
    splitEasy('"  ordinary  ","  a""b  "'),
    [["ordinary", '  a"b  ']],
    "10.01",
  );
  equal(
    splitEasy('"  ordinary  ","  a""b  "', {
      removeThousandSeparatorsFromNumbers: false,
      padSingleDecimalPlaceNumbers: false,
      forceUKStyle: false,
    }),
    [["ordinary", '  a"b  ']],
    "10.02",
  );
});

test.run();
