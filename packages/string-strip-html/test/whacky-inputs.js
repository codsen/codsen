import tap from "tap";
import { rApply } from "ranges-apply";
import { stripHtml } from "../dist/string-strip-html.esm";

// whacky inputs
// -----------------------------------------------------------------------------

tap.test("01 - whacky - sequence of empty <> - single", (t) => {
  const input = "<>";
  t.match(stripHtml(input), { result: input }, "01.01");
  t.match(rApply(input, stripHtml(input).ranges), input, "01.02");
  t.end();
});

tap.test("02 - whacky - sequence of empty <> - tight outside EOL", (t) => {
  const input = "<><>";
  t.match(stripHtml(input), { result: input }, "02.01");
  t.match(rApply(input, stripHtml(input).ranges), input, "02.02");
  t.end();
});

tap.test("03 - whacky - sequence of empty <> - tight outside, content", (t) => {
  const input = "a<><>b";
  t.match(stripHtml(input), { result: input }, "03.01");
  t.match(rApply(input, stripHtml(input).ranges), input, "03.02");
  t.end();
});

tap.test("04 - whacky - sequence of empty <> - just trimmed", (t) => {
  const input = "\na<><>b\n";
  const result = "a<><>b";
  t.match(stripHtml(input), { result }, "04.01");
  t.match(rApply(input, stripHtml(input).ranges), result, "04.02");
  t.end();
});

tap.test(
  "05 - whacky - brackets used for expressive purposes (very very suspicious but possible)",
  (t) => {
    const input = "text <<<<<<<<<<< text";
    t.match(stripHtml(input), { result: input }, "05.01");
    t.match(rApply(input, stripHtml(input).ranges), input, "05.02");
    t.end();
  }
);

tap.test(
  "06 - brackets used for expressive purposes (very very suspicious but possible)",
  (t) => {
    const input = "text <<<<<<<<<<< text <<<<<<<<<<< text";
    t.match(stripHtml(input), { result: input }, "06.01");
    t.match(rApply(input, stripHtml(input).ranges), input, "06.02");
    t.end();
  }
);

tap.test(
  "07 - brackets used for expressive purposes (very very suspicious but possible)",
  (t) => {
    const input = "<article> text <<<<<<<<<<< text </article>";
    const result = "text <<<<<<<<<<< text";
    t.match(stripHtml(input), { result }, "07.01");
    t.match(rApply(input, stripHtml(input).ranges), result, "07.02");
    t.end();
  }
);

tap.test(
  "08 - brackets used for expressive purposes (very very suspicious but possible)",
  (t) => {
    // will not remove
    const input = "text1 <<<<<<<<<<< text2 >>>>>>>>>>> text3";
    t.match(stripHtml(input), { result: input }, "08.01");
    t.match(rApply(input, stripHtml(input).ranges), input, "08.02");
    t.end();
  }
);

tap.test(
  "09 - brackets used for expressive purposes (very very suspicious but possible)",
  (t) => {
    const input =
      "<article> text1 <<<<<<<<<<< text2 >>>>>>>>> text3 </article>";
    const result = "text1 <<<<<<<<<<< text2 >>>>>>>>> text3";
    t.match(stripHtml(input), { result }, "09.01");
    t.match(rApply(input, stripHtml(input).ranges), result, "09.02");
    t.end();
  }
);
