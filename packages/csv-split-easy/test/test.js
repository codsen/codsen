import tap from "tap";
import splitEasy from "../dist/csv-split-easy.esm";

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
  t.same(
    splitEasy("a,b,c\nd,e,f"),
    [
      ["a", "b", "c"],
      ["d", "e", "f"],
    ],
    "01.01 - minimal amount of chars in each col"
  );
  t.same(
    splitEasy(
      "apples and some more apples,bananas,cherries\ndonuts,eclairs,froyos"
    ),
    [
      ["apples and some more apples", "bananas", "cherries"],
      ["donuts", "eclairs", "froyos"],
    ],
    "01.02 - normal words in each col"
  );
  t.same(
    splitEasy("a,b,c\n\r\n\r\r\r\r\n\n\nd,e,f"),
    [
      ["a", "b", "c"],
      ["d", "e", "f"],
    ],
    "01.03 - minimal amount of chars in each col"
  );
  t.same(
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
  t.same(
    splitEasy(",,\na,b,c"),
    [["a", "b", "c"]],
    "02.01 - whole row comprises of empty values"
  );
  t.same(
    splitEasy("a,b\n,\n,"),
    [["a", "b"]],
    "02.02 - only first row contains real data"
  );
  t.same(
    splitEasy("a,b\n\r,\n,c"),
    [
      ["a", "b"],
      ["", "c"],
    ],
    "02.03 - only first row contains real data"
  );
  t.same(
    splitEasy('a,b\n\r"",""\n,c'),
    [
      ["a", "b"],
      ["", "c"],
    ],
    "02.04 - empty row all with double quotes"
  );
  t.same(
    splitEasy('a,b\n\r"",""\n"",c'),
    [
      ["a", "b"],
      ["", "c"],
    ],
    "02.05 - more double quotes"
  );
  t.same(
    splitEasy('a,"b"\n\r"",""\n"","c"'),
    [
      ["a", "b"],
      ["", "c"],
    ],
    "02.06 - double quotes almost everywhere"
  );
  t.same(
    splitEasy("a,b,c\n\r,,\n\r,,\n,,\n,,\r,,\n,,\n,d,"),
    [
      ["a", "b", "c"],
      ["", "d", ""],
    ],
    "02.07 - many empty rows"
  );
  t.same(splitEasy(",,,"), [[""]], "02.08 - three commas");
  t.same(splitEasy(""), [[""]], "02.09 - nothing");
  t.end();
});

tap.test("03 - copes with leading/trailing empty space", (t) => {
  t.same(
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
  t.same(
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

// =============================================================
// group 02 - concentrating on values wrapped with duoble quotes
// =============================================================
//
tap.test("04 - breaks lines correctly leaving no empty lines", (t) => {
  t.same(
    splitEasy('"a,b",c,d\ne,f,g'),
    [
      ["a,b", "c", "d"],
      ["e", "f", "g"],
    ],
    "04.01 - minimal amount of chars in each col"
  );
  t.same(
    splitEasy(
      '"apples, and some other fruits",bananas,cherries\ndonuts,eclairs,froyos'
    ),
    [
      ["apples, and some other fruits", "bananas", "cherries"],
      ["donuts", "eclairs", "froyos"],
    ],
    "04.02 - minimal amount of chars in each col"
  );
  t.end();
});

tap.test(
  "05 - particular attention of combos of line breaks and double quotes",
  (t) => {
    t.same(
      splitEasy('"a,b",c,d\n"e,f",g,h'),
      [
        ["a,b", "c", "d"],
        ["e,f", "g", "h"],
      ],
      "05 - double quotes follow line break"
    );
    t.end();
  }
);

tap.test("06 - particular attention of double quotes at the end", (t) => {
  t.same(
    splitEasy('"a,b",c,d\n\re,f,"g,h"'),
    [
      ["a,b", "c", "d"],
      ["e", "f", "g,h"],
    ],
    "06 - double quotes follow line break"
  );
  t.end();
});

tap.test(
  "07 - all values are wrapped with double quotes, some trailing white space",
  (t) => {
    t.same(
      splitEasy(
        '"Something here","And something there"," Notice space in front"\n"And here","This is wrapped as well","And this too"'
      ),
      [
        ["Something here", "And something there", "Notice space in front"],
        ["And here", "This is wrapped as well", "And this too"],
      ],
      "07 - splits correctly, trimming the space around"
    );
    t.end();
  }
);

tap.test(
  "08 - values wrapped in double quotes that contain double quotes",
  (t) => {
    t.same(
      splitEasy('"a,""b""",c,d\ne,f,"g ""G"""'),
      [
        ['a,"b"', "c", "d"],
        ["e", "f", 'g "G"'],
      ],
      "08 - double quotes that contain double quotes"
    );
    t.end();
  }
);

// =============================================================
// group 03 - input type validation
// =============================================================
//
tap.test("09 - wrong input types causes throwing up", (t) => {
  t.throws(() => {
    splitEasy(null);
  }, "09.01");
  t.throws(() => {
    splitEasy(1);
  }, "09.02");
  t.throws(() => {
    splitEasy(undefined);
  }, "09.03");
  t.throws(() => {
    splitEasy();
  }, "09.04");
  t.throws(() => {
    splitEasy(true);
  }, "09.05");
  t.throws(() => {
    splitEasy(NaN);
  }, "09.06");
  t.throws(() => {
    splitEasy({ a: "a" });
  }, "09.07");
  t.throws(() => {
    splitEasy("a", 1); // opts are not object
  }, "09.08");
  t.doesNotThrow(() => {
    splitEasy("a"); // opts missing
  }, "09.09");
  t.throws(() => {
    const f = () => null;
    splitEasy(f);
  }, "09.10");
  t.end();
});

// =============================================================
// group 04 - opts.removeThousandSeparatorsFromNumbers
// =============================================================
//

tap.test(
  "10 - deals with (or does not) thousand separators in numbers",
  (t) => {
    t.same(
      splitEasy(
        'Product Name,Main Price,Discounted Price\nTestarossa (Type F110),"100,000","90,000"\nF50,"2,500,000","1,800,000"'
      ),
      [
        ["Product Name", "Main Price", "Discounted Price"],
        ["Testarossa (Type F110)", "100000", "90000"],
        ["F50", "2500000", "1800000"],
      ],
      "10.01 - splits correctly, understanding comma thousand separators and removing them"
    );
    t.same(
      splitEasy(
        'Product Name,Main Price,Discounted Price\nTestarossa (Type F110),"100,000","90,000"\nF50,"2,500,000","1,800,000"',
        { removeThousandSeparatorsFromNumbers: false }
      ),
      [
        ["Product Name", "Main Price", "Discounted Price"],
        ["Testarossa (Type F110)", "100,000", "90,000"],
        ["F50", "2,500,000", "1,800,000"],
      ],
      "10.02 - leaves thousand separators intact"
    );
    t.end();
  }
);

// =============================================================
// group 05 - opts.padSingleDecimalPlaceNumbers
// =============================================================
//

tap.test("11 - to pad or not to pad", (t) => {
  t.same(
    splitEasy(
      'Product Name,Main Price,Discounted Price\n\rPencil HB,"2.2","2.1"\nPencil 2H,"2.32","2.3"'
    ),
    [
      ["Product Name", "Main Price", "Discounted Price"],
      ["Pencil HB", "2.20", "2.10"],
      ["Pencil 2H", "2.32", "2.30"],
    ],
    "11.01 - default behaviour, padds"
  );
  t.same(
    splitEasy(
      'Product Name,Main Price,Discounted Price\n\rPencil HB,"2.2","2.1"\nPencil 2H,"2.32","2.3"',
      {
        padSingleDecimalPlaceNumbers: false,
      }
    ),
    [
      ["Product Name", "Main Price", "Discounted Price"],
      ["Pencil HB", "2.2", "2.1"],
      ["Pencil 2H", "2.32", "2.3"],
    ],
    "11.02 - padding off"
  );
  t.end();
});

// =============================================================
// group 06 - opts.forceUKStyle
// =============================================================
//

tap.test(
  "12 - Russian/Lithuanian/continental decimal notation style CSV that uses commas",
  (t) => {
    t.same(
      splitEasy(
        'Product Name,Main Price (EUR),Discounted Price (EUR)\n\rCepelinai,"5,25","5,1"\nJautienos kepsnys,"14,5","14,2"'
      ),
      [
        ["Product Name", "Main Price (EUR)", "Discounted Price (EUR)"],
        ["Cepelinai", "5,25", "5,10"],
        ["Jautienos kepsnys", "14,50", "14,20"],
      ],
      "12.01 - does not convert the notation by default, but does pad"
    );
    t.same(
      splitEasy(
        'Product Name,Main Price (EUR),Discounted Price (EUR)\n\rCepelinai,"5,25","5,1"\nJautienos kepsnys,"14,5","14,2"',
        { forceUKStyle: true }
      ),
      [
        ["Product Name", "Main Price (EUR)", "Discounted Price (EUR)"],
        ["Cepelinai", "5.25", "5.10"],
        ["Jautienos kepsnys", "14.50", "14.20"],
      ],
      "12.02 - converts the notation as requested, and does pad by default"
    );
    t.same(
      splitEasy(
        'Product Name,Main Price (EUR),Discounted Price (EUR)\n\rCepelinai,"5,25","5,1"\nJautienos kepsnys,"14,5","14,2"',
        { padSingleDecimalPlaceNumbers: false }
      ),
      [
        ["Product Name", "Main Price (EUR)", "Discounted Price (EUR)"],
        ["Cepelinai", "5,25", "5,1"],
        ["Jautienos kepsnys", "14,5", "14,2"],
      ],
      "12.03 - does not convert the notation by default, and does not pad as requested"
    );
    t.same(
      splitEasy(
        'Product Name,Main Price (EUR),Discounted Price (EUR)\n\rCepelinai,"5,25","5,1"\nJautienos kepsnys,"14,5","14,2"',
        { forceUKStyle: true, padSingleDecimalPlaceNumbers: false }
      ),
      [
        ["Product Name", "Main Price (EUR)", "Discounted Price (EUR)"],
        ["Cepelinai", "5.25", "5.1"],
        ["Jautienos kepsnys", "14.5", "14.2"],
      ],
      "12.04 - converts the notation as requested, but does not pad as requested"
    );
    t.end();
  }
);
