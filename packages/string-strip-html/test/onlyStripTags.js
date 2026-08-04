// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// opts.onlyStripTags
// -----------------------------------------------------------------------------

test("001 - opts.onlyStripTags - base cases", () => {
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank"><b>news</b></a> this evening',
    ).result,
    "Let's watch news this evening",
    "001.01",
  );
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank"><b>news</b></a> this evening',
      {
        onlyStripTags: "z",
      },
    ).result,
    'Let\'s watch <a href="https://www.news.com/" target="_blank"><b>news</b></a> this evening',
    "001.02",
  );
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank"><b>news</b></a> this evening',
      {
        onlyStripTags: null,
      },
    ).result,
    "Let's watch news this evening",
    "001.03",
  );
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank"><b>news</b></a> this evening',
      {
        onlyStripTags: [],
      },
    ).result,
    "Let's watch news this evening",
    "001.04",
  );
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank"><b>news</b></a> this evening',
      {
        onlyStripTags: [""],
      },
    ).result,
    "Let's watch news this evening",
    "001.05",
  );
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank"><b>news</b></a> this evening',
      {
        onlyStripTags: ["\t", "\n"],
      },
    ).result,
    "Let's watch news this evening",
    "001.06",
  );
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank"><b>news</b></a> this evening',
    ).result,
    "Let's watch news this evening",
    "001.07",
  );
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank"><b>news</b></a> this evening',
      {
        onlyStripTags: "a",
      },
    ).result,
    "Let's watch <b>news</b> this evening",
    "001.08",
  );
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank"><b>news</b></a> this evening',
      {
        onlyStripTags: ["a"],
      },
    ).result,
    "Let's watch <b>news</b> this evening",
    "001.09",
  );
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank"><b>news</b></a> this evening',
      {
        onlyStripTags: "b",
      },
    ).result,
    'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
    "001.10",
  );
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank"><b>news</b></a> this evening',
      {
        onlyStripTags: ["b"],
      },
    ).result,
    'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
    "001.11",
  );
});

test("002 - opts.onlyStripTags + opts.ignoreTags combo", () => {
  equal(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.news.com/" target="_blank"><b>news</b></a> this evening</div>',
    ).result,
    "Let's watch news this evening",
    "002.01",
  );
  equal(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.news.com/" target="_blank"><b>news</b></a> this evening</div>',
      {
        onlyStripTags: "a",
      },
    ).result,
    "<div>Let's watch <b>news</b> this evening</div>",
    "002.02",
  );
  equal(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.news.com/" target="_blank"><b>news</b></a> this evening</div>',
      {
        ignoreTags: "a",
      },
    ).result,
    'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
    "002.03",
  );
  equal(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.news.com/" target="_blank"><b>news</b></a> this evening</div>',
      {
        onlyStripTags: "a",
        ignoreTags: "a",
      },
    ).result,
    '<div>Let\'s watch <a href="https://www.news.com/" target="_blank"><b>news</b></a> this evening</div>',
    "002.04",
  );
  equal(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.news.com/" target="_blank"><b>news</b></a> this evening</div>',
      {
        onlyStripTags: ["a", "b"],
        ignoreTags: "a",
      },
    ).result,
    '<div>Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening</div>',
    "002.05",
  );
  equal(
    stripHtml(
      '<div>Let\'s watch <a href="https://www.news.com/" target="_blank"><b>news</b></a> this evening</div>',
      {
        onlyStripTags: ["a"],
        ignoreTags: ["a", "b"],
      },
    ).result,
    '<div>Let\'s watch <a href="https://www.news.com/" target="_blank"><b>news</b></a> this evening</div>',
    "002.06",
  );
});

test("003 - opts.onlyStripTags - multiline text - defaults", () => {
  equal(
    stripHtml(
      `Abc

<b>mn</b>

def`,
    ).result,
    `Abc

mn

def`,
    "003.01",
  );
});

test("004 - opts.onlyStripTags - multiline text - option on", () => {
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
      },
    ).result,
    `Abc

mn
op
qr
st
uv

def`,
    "004.01",
  );
});

test.run();
