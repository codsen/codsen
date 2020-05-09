import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// whacky inputs
// -----------------------------------------------------------------------------

tap.test("01 - whacky - sequence of empty <> - single", (t) => {
  t.same(stripHtml("<>"), "<>", "01");
  t.end();
});

tap.test("02 - whacky - sequence of empty <> - tight outside EOL", (t) => {
  t.same(stripHtml("<><>"), "<><>", "02");
  t.end();
});

tap.test("03 - whacky - sequence of empty <> - tight outside, content", (t) => {
  t.same(stripHtml("a<><>b"), "a<><>b", "03");
  t.end();
});

tap.test("04 - whacky - sequence of empty <> - just trimmed", (t) => {
  t.same(stripHtml("\na<><>b\n"), "a<><>b", "04");
  t.end();
});

tap.test(
  "05 - whacky - brackets used for expressive purposes (very very suspicious but possible)",
  (t) => {
    t.same(stripHtml("text <<<<<<<<<<< text"), "text <<<<<<<<<<< text", "05");
    t.end();
  }
);

tap.test(
  "06 - brackets used for expressive purposes (very very suspicious but possible)",
  (t) => {
    t.same(
      stripHtml("text <<<<<<<<<<< text <<<<<<<<<<< text"),
      "text <<<<<<<<<<< text <<<<<<<<<<< text",
      "06"
    );
    t.end();
  }
);

tap.test(
  "07 - brackets used for expressive purposes (very very suspicious but possible)",
  (t) => {
    t.same(
      stripHtml("<article> text <<<<<<<<<<< text </article>"),
      "text <<<<<<<<<<< text",
      "07"
    );
    t.end();
  }
);

tap.test(
  "08 - brackets used for expressive purposes (very very suspicious but possible)",
  (t) => {
    // will not remove
    t.same(
      stripHtml("text1 <<<<<<<<<<< text2 >>>>>>>>>>> text3"),
      "text1 <<<<<<<<<<< text2 >>>>>>>>>>> text3",
      "08"
    );
    t.end();
  }
);

tap.test(
  "09 - brackets used for expressive purposes (very very suspicious but possible)",
  (t) => {
    t.same(
      stripHtml("<article> text1 <<<<<<<<<<< text2 >>>>>>>>> text3 </article>"),
      "text1 <<<<<<<<<<< text2 >>>>>>>>> text3",
      "09"
    );
    t.end();
  }
);
