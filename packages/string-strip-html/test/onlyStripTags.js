import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// opts.onlyStripTags
// -----------------------------------------------------------------------------

tap.test("01 - opts.onlyStripTags - base cases", (t) => {
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening'
    ),
    "Let's watch RT news this evening",
    "01.01 - control, default behaviour"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: "z" }
    ),
    'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
    "01.02 - non-existent tag option - leaves all tags"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: null }
    ),
    "Let's watch RT news this evening",
    "01.03 - falsey option"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: [] }
    ),
    "Let's watch RT news this evening",
    "01.04 - no tags mentioned, will strip all"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: [""] }
    ),
    "Let's watch RT news this evening",
    "01.05 - empty strings will be removed and will become default, blank setting"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: ["\t", "\n"] }
    ),
    "Let's watch RT news this evening",
    "01.06 - same, whitespace entries will be removed, setting will become default - strip all"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening'
    ),
    "Let's watch RT news this evening",
    "01.07 - control, default behaviour"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: "a" }
    ),
    "Let's watch <b>RT news</b> this evening",
    "01.08 - only strip anchor tags"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: ["a"] }
    ),
    "Let's watch <b>RT news</b> this evening",
    "01.09 - only strip anchor tags"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: "b" }
    ),
    'Let\'s watch <a href="https://www.rt.com/" target="_blank"> RT news </a> this evening', // TODO - detect and skip adding the space here
    "01.10 - only strip anchor tags"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      { onlyStripTags: ["b"] }
    ),
    'Let\'s watch <a href="https://www.rt.com/" target="_blank"> RT news </a> this evening', // TODO - detect and skip adding the space here
    "01.11 - only strip anchor tags"
  );
  t.end();
});

tap.test("02 - opts.onlyStripTags + opts.ignoreTags combo", (t) => {
  t.same(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>'
    ),
    "Let's watch RT news this evening",
    "02.01 - control, default behaviour"
  );
  t.same(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
      { onlyStripTags: "a" }
    ),
    "<div>Let's watch <b>RT news</b> this evening</div>",
    "02.02"
  );
  t.same(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
      { ignoreTags: "a" }
    ),
    'Let\'s watch <a href="https://www.rt.com/" target="_blank"> RT news </a> this evening', // TODO - detect and skip adding the space here
    "02.03"
  );
  t.same(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
      { onlyStripTags: "a", ignoreTags: "a" }
    ),
    '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
    "02.04 - both entries cancel each one out"
  );
  t.same(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
      { onlyStripTags: ["a", "b"], ignoreTags: "a" }
    ),
    '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"> RT news </a> this evening</div>', // TODO - detect and skip adding the space here
    "02.05 - both entries cancel each one out"
  );
  t.same(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
      { onlyStripTags: ["a"], ignoreTags: ["a", "b"] }
    ),
    '<div>Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>',
    "02.06 - both entries cancel each one out"
  );
  t.end();
});

tap.test("03 - opts.onlyStripTags - multiline text - defaults", (t) => {
  t.same(
    stripHtml(
      `Abc

<b>mn</b>

def`
    ),
    `Abc

mn

def`,
    "03"
  );
  t.end();
});

tap.test("04 - opts.onlyStripTags - multiline text - option on", (t) => {
  t.same(
    stripHtml(
      `Abc

<b>mn</b>
<i>op</i>
<u>qr</u>
<strong>st</strong>
<em>uv</em>

def`,
      {
        onlyStripTags: [
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "strong",
          "em",
          "u",
          "strike",
          "ul",
          "ol",
          "hr",
          "p",
          "li",
          "sub",
          "sup",
          "i",
          "b",
        ],
      }
    ),
    `Abc

mn
op
qr
st
uv

def`,
    "04"
  );
  t.end();
});
