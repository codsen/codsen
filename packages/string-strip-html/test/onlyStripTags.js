import tap from "tap";
import { stripHtml } from "../dist/string-strip-html.esm.js";

// opts.onlyStripTags
// -----------------------------------------------------------------------------

tap.test("01 - opts.onlyStripTags - base cases", (t) => {
  t.hasStrict(
    stripHtml(
      `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`
    ),
    { result: "Let's watch RT news this evening" },
    "01.01 - control, default behaviour"
  );
  t.hasStrict(
    stripHtml(
      `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`,
      {
        onlyStripTags: "z",
      }
    ),
    {
      result: `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`,
    },
    "01.02 - non-existent tag option - leaves all tags"
  );
  t.hasStrict(
    stripHtml(
      `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`,
      {
        onlyStripTags: null,
      }
    ),
    { result: "Let's watch RT news this evening" },
    "01.03 - falsey option"
  );
  t.hasStrict(
    stripHtml(
      `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`,
      {
        onlyStripTags: [],
      }
    ),
    { result: "Let's watch RT news this evening" },
    "01.04 - no tags mentioned, will strip all"
  );
  t.hasStrict(
    stripHtml(
      `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`,
      {
        onlyStripTags: [""],
      }
    ),
    { result: `Let's watch RT news this evening` },
    "01.05 - empty strings will be removed and will become default, blank setting"
  );
  t.hasStrict(
    stripHtml(
      `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`,
      {
        onlyStripTags: ["\t", "\n"],
      }
    ),
    { result: `Let's watch RT news this evening` },
    "01.06 - same, whitespace entries will be removed, setting will become default - strip all"
  );
  t.hasStrict(
    stripHtml(
      `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`
    ),
    { result: `Let's watch RT news this evening` },
    "01.07 - control, default behaviour"
  );
  t.hasStrict(
    stripHtml(
      `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`,
      {
        onlyStripTags: "a",
      }
    ),
    { result: `Let's watch <b>RT news</b> this evening` },
    "01.08 - only strip anchor tags"
  );
  t.hasStrict(
    stripHtml(
      `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`,
      {
        onlyStripTags: ["a"],
      }
    ),
    { result: `Let's watch <b>RT news</b> this evening` },
    "01.09 - only strip anchor tags"
  );
  t.hasStrict(
    stripHtml(
      `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`,
      {
        onlyStripTags: "b",
      }
    ),
    {
      result: `Let's watch <a href="https://www.rt.com/" target="_blank"> RT news </a> this evening`,
    }, // TODO - detect and skip adding the space here
    "01.10 - only strip anchor tags"
  );
  t.hasStrict(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      {
        onlyStripTags: ["b"],
      }
    ),
    {
      result: `Let's watch <a href="https://www.rt.com/" target="_blank"> RT news </a> this evening`,
    }, // TODO - detect and skip adding the space here
    "01.11 - only strip anchor tags"
  );
  t.end();
});

tap.test("02 - opts.onlyStripTags + opts.ignoreTags combo", (t) => {
  t.hasStrict(
    stripHtml(
      `<div>Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>`
    ),
    { result: "Let's watch RT news this evening" },
    "02.01 - control, default behaviour"
  );
  t.hasStrict(
    stripHtml(
      `<div>Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>`,
      {
        onlyStripTags: "a",
      }
    ),
    { result: `<div>Let's watch <b>RT news</b> this evening</div>` },
    "02.02"
  );
  t.hasStrict(
    stripHtml(
      `<div>Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>`,
      {
        ignoreTags: "a",
      }
    ),
    {
      result: `Let's watch <a href="https://www.rt.com/" target="_blank"> RT news </a> this evening`,
    }, // TODO - detect and skip adding the space here
    "02.03"
  );
  t.hasStrict(
    stripHtml(
      `<div>Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>`,
      {
        onlyStripTags: "a",
        ignoreTags: "a",
      }
    ),
    {
      result: `<div>Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>`,
    },
    "02.04 - both entries cancel each one out"
  );
  t.hasStrict(
    stripHtml(
      `<div>Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>`,
      {
        onlyStripTags: ["a", "b"],
        ignoreTags: "a",
      }
    ),
    {
      result: `<div>Let's watch <a href="https://www.rt.com/" target="_blank"> RT news </a> this evening</div>`,
    }, // TODO - detect and skip adding the space here
    "02.05 - both entries cancel each one out"
  );
  t.hasStrict(
    stripHtml(
      `<div>Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>`,
      {
        onlyStripTags: ["a"],
        ignoreTags: ["a", "b"],
      }
    ),
    {
      result: `<div>Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>`,
    },
    "02.06 - both entries cancel each one out"
  );
  t.end();
});

tap.test("03 - opts.onlyStripTags - multiline text - defaults", (t) => {
  t.hasStrict(
    stripHtml(
      `Abc

<b>mn</b>

def`
    ),
    {
      result: `Abc

mn

def`,
    },
    "03"
  );
  t.end();
});

tap.test("04 - opts.onlyStripTags - multiline text - option on", (t) => {
  t.hasStrict(
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
    {
      result: `Abc

mn
op
qr
st
uv

def`,
    },
    "04"
  );
  t.end();
});
