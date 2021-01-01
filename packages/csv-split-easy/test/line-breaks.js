import tap from "tap";
import { splitEasy } from "../dist/csv-split-easy.esm";

// some art first
//
//                             _.,aaPPPPPPPPaa,._
//                         ,adP"""'          `""Yb,_
//                      ,adP'                     `"Yb,
//                    ,dP'     ,aadPP"""""YYba,.     `"Y,
//                   ,P'    ,aP"'            `""Ya,     "Y,
//                  ,P'    aP'                   `"Ya    `Yb,
//                 ,P'    d"    ,adP""""""""Yba,    `Y,    "Y,
//                ,d'   ,d'   ,dP"            `Yb,   `Y,    `Y,
//                d'   ,d'   ,d'    ,dP""Yb,    `Y,   `Y,    `b
//                8    d'    d'   ,d"      "b,   `Y,   `8,    Y,
//                8    8     8    d'    .   `Y,   `8    `8    `b
//                8    8     8    8     8    `8    8     8     8
//                8    Y,    Y,   `b, ,aP     P    8    ,P     8
//                I,   `Y,   `Ya    """"     d'   ,P    d"    ,P
//                `Y,   `8,    `Ya         ,8"   ,P'   ,P'    d'
//                 `Y,   `Ya,    `Ya,,__,,d"'   ,P'   ,P"    ,P
//                  `Y,    `Ya,     `""""'     ,P'   ,d"    ,P'
//                   `Yb,    `"Ya,_          ,d"    ,P'    ,P'
//                     `Yb,      ""YbaaaaaadP"     ,P'    ,P'
//                       `Yba,                   ,d'    ,dP'
//                          `"Yba,._       _.,adP"     dP"
//                              `"""""""""""""'

// ============================================================================
// group 01 - concentrating on line breaks: varying amounts and different types
// ============================================================================
//
tap.test("01 - breaks lines correctly leaving no empty lines", (t) => {
  t.strictSame(
    splitEasy("a,b,c\nd,e,f"),
    [
      ["a", "b", "c"],
      ["d", "e", "f"],
    ],
    "01.01 - minimal amount of chars in each col"
  );
  t.strictSame(
    splitEasy(
      "apples and some more apples,bananas,cherries\ndonuts,eclairs,froyos"
    ),
    [
      ["apples and some more apples", "bananas", "cherries"],
      ["donuts", "eclairs", "froyos"],
    ],
    "01.02 - normal words in each col"
  );
  t.strictSame(
    splitEasy("a,b,c\n\r\n\r\r\r\r\n\n\nd,e,f"),
    [
      ["a", "b", "c"],
      ["d", "e", "f"],
    ],
    "01.03 - minimal amount of chars in each col"
  );
  t.strictSame(
    splitEasy(
      "apples and some more apples,bananas,cherries\n\r\r\r\r\n\n\n\n\ndonuts,eclairs,froyos"
    ),
    [
      ["apples and some more apples", "bananas", "cherries"],
      ["donuts", "eclairs", "froyos"],
    ],
    "01.04 - normal words in each col"
  );
  t.end();
});

tap.test("02 - breaks lines that have empty values", (t) => {
  t.strictSame(
    splitEasy(",,\na,b,c"),
    [["a", "b", "c"]],
    "02.01 - whole row comprises of empty values"
  );
  t.strictSame(
    splitEasy("a,b\n,\n,"),
    [["a", "b"]],
    "02.02 - only first row contains real data"
  );
  t.strictSame(
    splitEasy("a,b\n\r,\n,c"),
    [
      ["a", "b"],
      ["", "c"],
    ],
    "02.03 - only first row contains real data"
  );
  t.strictSame(
    splitEasy('a,b\n\r"",""\n,c'),
    [
      ["a", "b"],
      ["", "c"],
    ],
    "02.04 - empty row all with double quotes"
  );
  t.strictSame(
    splitEasy('a,b\n\r"",""\n"",c'),
    [
      ["a", "b"],
      ["", "c"],
    ],
    "02.05 - more double quotes"
  );
  t.strictSame(
    splitEasy('a,"b"\n\r"",""\n"","c"'),
    [
      ["a", "b"],
      ["", "c"],
    ],
    "02.06 - double quotes almost everywhere"
  );
  t.strictSame(
    splitEasy("a,b,c\n\r,,\n\r,,\n,,\n,,\r,,\n,,\n,d,"),
    [
      ["a", "b", "c"],
      ["", "d", ""],
    ],
    "02.07 - many empty rows"
  );
  t.strictSame(splitEasy(",,,"), [[""]], "02.08 - three commas");
  t.strictSame(splitEasy(""), [[""]], "02.09 - nothing");
  t.end();
});

tap.test("03 - copes with leading/trailing empty space", (t) => {
  t.strictSame(
    splitEasy(`Description,Debit Amount,Credit Amount,Balance
Client #1 payment,,1000,1940
Bought table,10,,940
Bought carpet,30,,950
Bought chairs,20,,980
Bought pens,10,,1000\n`),
    [
      ["Description", "Debit Amount", "Credit Amount", "Balance"],
      ["Client #1 payment", "", "1000", "1940"],
      ["Bought table", "10", "", "940"],
      ["Bought carpet", "30", "", "950"],
      ["Bought chairs", "20", "", "980"],
      ["Bought pens", "10", "", "1000"],
    ],
    "03.01 - one trailing \\n"
  );
  t.strictSame(
    splitEasy(`\nDescription,Debit Amount,Credit Amount,Balance
Client #1 payment,,1000,1940
Bought table,10,,940
Bought carpet,30,,950
Bought chairs,20,,980
Bought pens,10,,1000\n \r \n \r \r\r\r\n\n\n\n      `),
    [
      ["Description", "Debit Amount", "Credit Amount", "Balance"],
      ["Client #1 payment", "", "1000", "1940"],
      ["Bought table", "10", "", "940"],
      ["Bought carpet", "30", "", "950"],
      ["Bought chairs", "20", "", "980"],
      ["Bought pens", "10", "", "1000"],
    ],
    "03.02 - bunch of leading and trailing whitespace"
  );
  t.end();
});
