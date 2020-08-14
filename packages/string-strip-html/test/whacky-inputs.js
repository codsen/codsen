import tap from "tap";
import applyR from "ranges-apply";
import stripHtml from "../dist/string-strip-html.esm";

// whacky inputs
// -----------------------------------------------------------------------------

tap.test("01 - whacky - sequence of empty <> - single", (t) => {
  const input = "<>";
  t.same(stripHtml(input), input, "01.01");
  t.same(
    applyR(input, stripHtml(input, { returnRangesOnly: true })),
    input,
    "01.02"
  );
  t.end();
});

tap.test("02 - whacky - sequence of empty <> - tight outside EOL", (t) => {
  const input = "<><>";
  t.same(stripHtml(input), input, "02.01");
  t.same(
    applyR(input, stripHtml(input, { returnRangesOnly: true })),
    input,
    "02.02"
  );
  t.end();
});

tap.test("03 - whacky - sequence of empty <> - tight outside, content", (t) => {
  const input = "a<><>b";
  t.same(stripHtml(input), input, "03.01");
  t.same(
    applyR(input, stripHtml(input, { returnRangesOnly: true })),
    input,
    "03.02"
  );
  t.end();
});

tap.test("04 - whacky - sequence of empty <> - just trimmed", (t) => {
  const input = "\na<><>b\n";
  const res = "a<><>b";
  t.same(stripHtml(input), res, "04.01");
  t.same(
    applyR(input, stripHtml(input, { returnRangesOnly: true })),
    res,
    "04.02"
  );
  t.end();
});

tap.test(
  "05 - whacky - brackets used for expressive purposes (very very suspicious but possible)",
  (t) => {
    const input = "text <<<<<<<<<<< text";
    t.same(stripHtml(input), input, "05.01");
    t.same(
      applyR(input, stripHtml(input, { returnRangesOnly: true })),
      input,
      "05.02"
    );
    t.end();
  }
);

tap.test(
  "06 - brackets used for expressive purposes (very very suspicious but possible)",
  (t) => {
    const input = "text <<<<<<<<<<< text <<<<<<<<<<< text";
    t.same(stripHtml(input), input, "06.01");
    t.same(
      applyR(input, stripHtml(input, { returnRangesOnly: true })),
      input,
      "06.02"
    );
    t.end();
  }
);

tap.test(
  "07 - brackets used for expressive purposes (very very suspicious but possible)",
  (t) => {
    const input = "<article> text <<<<<<<<<<< text </article>";
    const res = "text <<<<<<<<<<< text";
    t.same(stripHtml(input), res, "07.01");
    t.same(
      applyR(input, stripHtml(input, { returnRangesOnly: true })),
      res,
      "07.02"
    );
    t.end();
  }
);

tap.test(
  "08 - brackets used for expressive purposes (very very suspicious but possible)",
  (t) => {
    // will not remove
    const input = "text1 <<<<<<<<<<< text2 >>>>>>>>>>> text3";
    t.same(stripHtml(input), input, "08.01");
    t.same(
      applyR(input, stripHtml(input, { returnRangesOnly: true })),
      input,
      "08.02"
    );
    t.end();
  }
);

tap.test(
  "09 - brackets used for expressive purposes (very very suspicious but possible)",
  (t) => {
    const input =
      "<article> text1 <<<<<<<<<<< text2 >>>>>>>>> text3 </article>";
    const res = "text1 <<<<<<<<<<< text2 >>>>>>>>> text3";
    t.same(stripHtml(input), res, "09.01");
    t.same(
      applyR(input, stripHtml(input, { returnRangesOnly: true })),
      res,
      "09.02"
    );
    t.end();
  }
);
