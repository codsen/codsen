import { test } from "uvu";
import { equal } from "uvu/assert";

import { splitEasy } from "../dist/csv-split-easy.esm.js";

test("01 - escaped-quote prefixes survive after each record break", () => {
  for (const lineBreak of ["\n", "\r\n", "\r"]) {
    equal(
      splitEasy(`head,tail${lineBreak}"""hello",world`),
      [
        ["head", "tail"],
        ['"hello', "world"],
      ],
      "01.01",
    );
    equal(splitEasy('"""hello",world'), [['"hello', "world"]], "01.02");
  }
});

test("02 - single-column quote-only records remain separate", () => {
  for (const lineBreak of ["\n", "\r\n", "\r"]) {
    for (const ending of ["", lineBreak]) {
      equal(
        splitEasy(
          `first${lineBreak}""""${lineBreak}""""${lineBreak}last${ending}`,
        ),
        [["first"], ['"'], ['"'], ["last"]],
        "02.01",
      );
      equal(
        splitEasy(`""""${lineBreak}""""""${ending}`),
        [['"'], ['""']],
        "02.02",
      );
    }
  }
});

test("03 - truly empty quoted records follow the existing skip policy", () => {
  for (const lineBreak of ["\n", "\r\n", "\r"]) {
    equal(
      splitEasy(`""${lineBreak}""${lineBreak}value${lineBreak}""`),
      [["value"]],
      "03.01",
    );
    equal(splitEasy(`""${lineBreak}""${lineBreak}`), [[""]], "03.02");
    equal(
      splitEasy(`head,tail${lineBreak}"",value`),
      [
        ["head", "tail"],
        ["", "value"],
      ],
      "03.03",
    );
  }
});

test("04 - alternating empty and quote-only records cannot merge later rows", () => {
  for (const lineBreak of ["\n", "\r\n", "\r"]) {
    equal(
      splitEasy(
        `start${lineBreak}""""${lineBreak}""${lineBreak}""""""${lineBreak}""${lineBreak}""""${lineBreak}""${lineBreak}end`,
      ),
      [["start"], ['"'], ['""'], ['"'], ["end"]],
      "04.01",
    );
  }
});

test("05 - a later first field preserves leading quotes and embedded breaks", () => {
  for (const recordBreak of ["\n", "\r\n", "\r"]) {
    for (const fieldBreak of ["\n", "\r\n", "\r"]) {
      equal(
        splitEasy(
          `head,tail${recordBreak}"""first${fieldBreak}""second",value${recordBreak}last,row`,
        ),
        [
          ["head", "tail"],
          [`"first${fieldBreak}"second`, "value"],
          ["last", "row"],
        ],
        "05.01",
      );
      equal(
        splitEasy(`head${recordBreak}"""${fieldBreak}"""`),
        [["head"], [`"${fieldBreak}"`]],
        "05.02",
      );
    }
  }
});

test("06 - quote-only and empty fields keep their columns and records", () => {
  for (const lineBreak of ["\n", "\r\n", "\r"]) {
    equal(
      splitEasy(
        `head,tail${lineBreak}"""",""${lineBreak}"",""""${lineBreak}"",""${lineBreak}last,row`,
      ),
      [
        ["head", "tail"],
        ['"', ""],
        ["", '"'],
        ["last", "row"],
      ],
      "06.01",
    );
  }
});

test("07 - custom delimiters preserve quoted record starts and empty columns", () => {
  for (const delimiter of [";", "\t", "|"]) {
    for (const lineBreak of ["\n", "\r\n", "\r"]) {
      equal(
        splitEasy(
          `head${delimiter}tail${lineBreak}"""first${delimiter}part"${delimiter}value${lineBreak}""""${delimiter}""${lineBreak}""${delimiter}""${lineBreak}last${delimiter}row`,
          { delimiter },
        ),
        [
          ["head", "tail"],
          [`"first${delimiter}part`, "value"],
          ['"', ""],
          ["last", "row"],
        ],
        "07.01",
      );
    }
  }
});

test("08 - external break clusters do not alter quoted starts or EOF records", () => {
  for (const ending of ["", "\n", "\r\n", "\r", "\n\r\r\n\n"]) {
    equal(
      splitEasy(
        `\n\r\nseed,x\r\n\n\r"""first",one\n\r\r\n"",""\r\n\n"""last",two${ending}`,
      ),
      [
        ["seed", "x"],
        ['"first', "one"],
        ['"last', "two"],
      ],
      "08.01",
    );
  }
});

test.run();
