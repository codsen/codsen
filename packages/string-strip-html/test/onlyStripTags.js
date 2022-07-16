import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// opts.onlyStripTags
// -----------------------------------------------------------------------------

test("01 - opts.onlyStripTags - base cases", () => {
  equal(
    stripHtml(
      `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`
    ).result,
    "Let's watch RT news this evening",
    "01.01 - control, default behaviour"
  );
  equal(
    stripHtml(
      `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`,
      {
        onlyStripTags: "z",
      }
    ).result,
    `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`,
    "01.02 - non-existent tag option - leaves all tags"
  );
  equal(
    stripHtml(
      `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`,
      {
        onlyStripTags: null,
      }
    ).result,
    "Let's watch RT news this evening",
    "01.03 - falsey option"
  );
  equal(
    stripHtml(
      `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`,
      {
        onlyStripTags: [],
      }
    ).result,
    "Let's watch RT news this evening",
    "01.04 - no tags mentioned, will strip all"
  );
  equal(
    stripHtml(
      `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`,
      {
        onlyStripTags: [""],
      }
    ).result,
    `Let's watch RT news this evening`,
    "01.05 - empty strings will be removed and will become default, blank setting"
  );
  equal(
    stripHtml(
      `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`,
      {
        onlyStripTags: ["\t", "\n"],
      }
    ).result,
    `Let's watch RT news this evening`,
    "01.06 - same, whitespace entries will be removed, setting will become default - strip all"
  );
  equal(
    stripHtml(
      `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`
    ).result,
    `Let's watch RT news this evening`,
    "01.07 - control, default behaviour"
  );
  equal(
    stripHtml(
      `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`,
      {
        onlyStripTags: "a",
      }
    ).result,
    `Let's watch <b>RT news</b> this evening`,
    "01.08 - only strip anchor tags"
  );
  equal(
    stripHtml(
      `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`,
      {
        onlyStripTags: ["a"],
      }
    ).result,
    `Let's watch <b>RT news</b> this evening`,
    "01.09 - only strip anchor tags"
  );
  equal(
    stripHtml(
      `Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening`,
      {
        onlyStripTags: "b",
      }
    ).result,
    `Let's watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening`,
    "01.10 - only strip anchor tags"
  );
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening',
      {
        onlyStripTags: ["b"],
      }
    ).result,
    `Let's watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening`,
    "01.11 - only strip anchor tags"
  );
});

test("02 - opts.onlyStripTags + opts.ignoreTags combo", () => {
  equal(
    stripHtml(
      `<div>Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>`
    ).result,
    "Let's watch RT news this evening",
    "02.01 - control, default behaviour"
  );
  equal(
    stripHtml(
      `<div>Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>`,
      {
        onlyStripTags: "a",
      }
    ).result,
    `<div>Let's watch <b>RT news</b> this evening</div>`,
    "02.02"
  );
  equal(
    stripHtml(
      `<div>Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>`,
      {
        ignoreTags: "a",
      }
    ).result,
    `Let's watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening`,
    "02.03"
  );
  equal(
    stripHtml(
      `<div>Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>`,
      {
        onlyStripTags: "a",
        ignoreTags: "a",
      }
    ).result,
    `<div>Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>`,
    "02.04 - both entries cancel each one out"
  );
  equal(
    stripHtml(
      `<div>Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>`,
      {
        onlyStripTags: ["a", "b"],
        ignoreTags: "a",
      }
    ).result,
    `<div>Let's watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening</div>`,
    "02.05 - both entries cancel each one out"
  );
  equal(
    stripHtml(
      `<div>Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>`,
      {
        onlyStripTags: ["a"],
        ignoreTags: ["a", "b"],
      }
    ).result,
    `<div>Let's watch <a href="https://www.rt.com/" target="_blank"><b>RT news</b></a> this evening</div>`,
    "02.06 - both entries cancel each one out"
  );
});

test("03 - opts.onlyStripTags - multiline text - defaults", () => {
  equal(
    stripHtml(
      `Abc

<b>mn</b>

def`
    ).result,
    `Abc

mn

def`,
    "03"
  );
});

test("04 - opts.onlyStripTags - multiline text - option on", () => {
  equal(
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
    ).result,
    `Abc

mn
op
qr
st
uv

def`,
    "04"
  );
});

test.run();
