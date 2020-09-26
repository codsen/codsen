import tap from "tap";
import splitEasy from "../dist/csv-split-easy.esm";

tap.test("01 - breaks lines correctly leaving no empty lines", (t) => {
  t.strictSame(
    splitEasy('"a,b",c,d\ne,f,g'),
    [
      ["a,b", "c", "d"],
      ["e", "f", "g"],
    ],
    "01.01 - minimal amount of chars in each col"
  );
  t.strictSame(
    splitEasy(
      '"apples, and some other fruits",bananas,cherries\ndonuts,eclairs,froyos'
    ),
    [
      ["apples, and some other fruits", "bananas", "cherries"],
      ["donuts", "eclairs", "froyos"],
    ],
    "01.02 - minimal amount of chars in each col"
  );
  t.end();
});

tap.test(
  "02 - particular attention of combos of line breaks and double quotes",
  (t) => {
    t.strictSame(
      splitEasy('"a,b",c,d\n"e,f",g,h'),
      [
        ["a,b", "c", "d"],
        ["e,f", "g", "h"],
      ],
      "02 - double quotes follow line break"
    );
    t.end();
  }
);

tap.test("03 - particular attention of double quotes at the end", (t) => {
  t.strictSame(
    splitEasy('"a,b",c,d\n\re,f,"g,h"'),
    [
      ["a,b", "c", "d"],
      ["e", "f", "g,h"],
    ],
    "03 - double quotes follow line break"
  );
  t.end();
});

tap.test(
  "04 - all values are wrapped with double quotes, some trailing white space",
  (t) => {
    t.strictSame(
      splitEasy(
        '"Something here","And something there"," Notice space in front"\n"And here","This is wrapped as well","And this too"'
      ),
      [
        ["Something here", "And something there", "Notice space in front"],
        ["And here", "This is wrapped as well", "And this too"],
      ],
      "04 - splits correctly, trimming the space around"
    );
    t.end();
  }
);

tap.test(
  "05 - values wrapped in double quotes that contain double quotes",
  (t) => {
    t.strictSame(
      splitEasy('"a,""b""",c,d\ne,f,"g ""G"""'),
      [
        ['a,"b"', "c", "d"],
        ["e", "f", 'g "G"'],
      ],
      "05 - double quotes that contain double quotes"
    );
    t.end();
  }
);
