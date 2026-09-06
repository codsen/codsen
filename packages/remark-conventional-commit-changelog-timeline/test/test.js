import { test } from "uvu";
import { equal } from "uvu/assert";

import changelogTimeline from "../dist/remark-conventional-commit-changelog-timeline.esm.js";

test("01 - the introductory changelog uses the website timeline markup", () => {
  equal(
    changelogTimeline(`
# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.1.0 (2022-08-12)

### Features

- abc
- xyz
`),
    `
<h2>3.1.0</h2>
<div class="release-date">12 Aug <span>2022</span></div>
<h3><span class="emoji">✨</span> Features</h3>
<ul>
  <li>abc</li>
  <li>xyz</li>
</ul>
`,
    "01.01",
  );
});

test("02 - plain and linked release headings support historical heading levels", () => {
  for (let version of ["0.0.0", "1.2.3", "12.34.567"]) {
    for (let heading of ["#", "##", "###"]) {
      for (let label of [
        version,
        `[${version}](https://example.com/compare)`,
      ]) {
        for (let gap of ["", " "]) {
          equal(
            changelogTimeline(`${heading} ${label}${gap}(2022-08-12)`),
            `\n<h2>${version}</h2>\n<div class="release-date">12 Aug <span>2022</span></div>\n`,
            "02.01",
          );
        }
      }
    }
  }
});

test("03 - consecutive releases retain their commit links and dates", () => {
  equal(
    changelogTimeline(`
# [0.4.0](https://github.com/codsen/codsen/compare/v0.3.4...v0.4.0) (2022-10-13)

### Features

- correct apostrophes ([6495fe3](https://github.com/codsen/codsen/commit/6495fe3))

## [0.3.0](https://github.com/codsen/codsen/compare/v0.2.0...v0.3.0) (2022-09-27)

### Bug Fixes

- fix dependencies

### BREAKING CHANGES

- remove the old API

## 1.0.0 (2022-09-25)

- promote semver to stable v1
`),
    `
<h2>0.4.0</h2>
<div class="release-date">13 Oct <span>2022</span></div>
<h3><span class="emoji">✨</span> Features</h3>
<ul>
  <li>correct apostrophes (<a href="https://github.com/codsen/codsen/commit/6495fe3">6495fe3</a>)</li>
</ul>
<h2>0.3.0</h2>
<div class="release-date">27 Sept <span>2022</span></div>
<h3><span class="emoji">🔧</span> Fixed</h3>
<ul>
  <li>fix dependencies</li>
</ul>
<h3><span class="emoji">💥</span> BREAKING CHANGES</h3>
<ul>
  <li>remove the old API</li>
</ul>
<h2>1.0.0</h2>
<div class="release-date">25 Sept <span>2022</span></div>
<ul>
  <li>promote semver to stable v1</li>
</ul>
`,
    "03.01",
  );
});

test("04 - dates have fixed English months and unpadded days", () => {
  equal(
    Array.from({ length: 12 }, (_, index) =>
      changelogTimeline(
        `## 1.0.0 (2022-${String(index + 1).padStart(2, "0")}-01)`,
      ),
    ),
    [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ].map(
      (month) =>
        `\n<h2>1.0.0</h2>\n<div class="release-date">1 ${month} <span>2022</span></div>\n`,
    ),
    "04.01",
  );
});

test("05 - typographic date separators are accepted", () => {
  equal(
    changelogTimeline("## 1.2.3 (2022–08–12)"),
    '\n<h2>1.2.3</h2>\n<div class="release-date">12 Aug <span>2022</span></div>\n',
    "05.01",
  );
});

test("06 - malformed dates remain readable headings", () => {
  for (let date of [
    "2022-00-12",
    "2022-13-12",
    "2022-04-31",
    "2022-02-29",
    "2022-08-00",
    "2022-08-32",
    "not-a-date",
  ]) {
    equal(
      changelogTimeline(`## 1.2.3 (${date})`),
      `\n<h2>1.2.3 (${date})</h2>\n`,
      "06.01",
    );
  }
  equal(
    changelogTimeline("## 1.2.3 (2024-02-29)"),
    '\n<h2>1.2.3</h2>\n<div class="release-date">29 Feb <span>2024</span></div>\n',
    "06.02",
  );
});

test("07 - unrelated headings never become partial stable releases", () => {
  for (let label of ["1.2", "1.2.3.4", "Changes for 1.2.3"]) {
    equal(
      changelogTimeline(`## ${label} (2022-08-12)`),
      `\n<h2>${label} (2022-08-12)</h2>\n`,
      "07.01",
    );
    equal(
      changelogTimeline(
        `# [${label}](https://example.com/release) (2022-08-12)`,
      ),
      `\n<h1><a href="https://example.com/release">${label}</a> (2022-08-12)</h1>\n`,
      "07.02",
    );
  }
});

test("08 - known change sections use the website labels and emoji", () => {
  equal(
    changelogTimeline(
      "### Features\n\n### Bug Fixes\n\n### Fixed\n\n### BREAKING CHANGES\n\n### Reverts\n\n### Changes\n\n### Improvements",
    ),
    `
<h3><span class="emoji">✨</span> Features</h3>
<h3><span class="emoji">🔧</span> Fixed</h3>
<h3><span class="emoji">🔧</span> Fixed</h3>
<h3><span class="emoji">💥</span> BREAKING CHANGES</h3>
<h3><span class="emoji">⏪</span> Reverts</h3>
<h3><span class="emoji">✈️</span> Changes</h3>
<h3><span class="emoji">🏗️</span> Improvements</h3>
`,
    "08.01",
  );
});

test("09 - unknown headings and their inline formatting are preserved", () => {
  equal(
    changelogTimeline(
      "# Migration\n\n## Other changes\n\n### **Performance**\n\n#### Details",
    ),
    "\n<h1>Migration</h1>\n<h2>Other changes</h2>\n<h3><strong>Performance</strong></h3>\n<h4>Details</h4>\n",
    "09.01",
  );
});

test("10 - the conventional preamble can be the entire file", () => {
  equal(
    changelogTimeline(
      "# Change Log\n\nAll notable changes to this project will be documented in this file.\nSee [Conventional Commits](https://conventionalcommits.org) for commit guidelines.\n",
    ),
    "",
    "10.01",
  );
});

test("11 - prose following the preamble is retained", () => {
  equal(
    changelogTimeline(
      "# Change Log\n\nAll notable changes to this project will be documented in this file.\nSee [Conventional Commits](https://conventionalcommits.org) for commit guidelines.\n\n## Notes\n\nA first paragraph\ncontinued here.\n\nA second paragraph.",
    ),
    "\n<h2>Notes</h2>\n<p>A first paragraph\ncontinued here.</p>\n<p>A second paragraph.</p>\n",
    "11.01",
  );
});

test("12 - Windows line endings produce the same timeline", () => {
  let input = "## 1.0.0 (2022-08-12)\n\n### Features\n\n- first\n- second\n";
  equal(
    changelogTimeline(input.replaceAll("\n", "\r\n")),
    changelogTimeline(input),
    "12.01",
  );
});

test("13 - commit text supports code, emphasis and linked code labels", () => {
  equal(
    changelogTimeline(
      "- **api:** remove `old()` and add *new* behaviour ([`abc123`](https://example.com/commit/abc123))\n- use **bold** and _emphasis_",
    ),
    '\n<ul>\n  <li><strong>api:</strong> remove <code>old()</code> and add <em>new</em> behaviour (<a href="https://example.com/commit/abc123"><code>abc123</code></a>)</li>\n  <li>use <strong>bold</strong> and <em>emphasis</em></li>\n</ul>\n',
    "13.01",
  );
});

test("14 - code protects punctuation from inline formatting", () => {
  equal(
    changelogTimeline(
      "- `<tag>& **literal** [link](https://example.com)`\n- ``a `backtick` b``",
    ),
    "\n<ul>\n  <li><code>&lt;tag&gt;&amp; **literal** [link](https://example.com)</code></li>\n  <li><code>a `backtick` b</code></li>\n</ul>\n",
    "14.01",
  );
});

test("15 - raw HTML and text ampersands are escaped", () => {
  equal(
    changelogTimeline(
      '- <script>alert("x")</script> & <img src=x onerror=alert(1)>',
    ),
    '\n<ul>\n  <li>&lt;script&gt;alert("x")&lt;/script&gt; &amp; &lt;img src=x onerror=alert(1)&gt;</li>\n</ul>\n',
    "15.01",
  );
});

test("16 - safe links retain their destinations with escaped attributes", () => {
  for (let url of [
    "https://example.com",
    "http://example.com",
    "mailto:roy@example.com",
    "/docs",
    "./docs",
    "../docs",
    "#details",
    "?page=2",
    "docs/page",
  ]) {
    equal(
      changelogTimeline(`[read](${url})`),
      `\n<p><a href="${url}">read</a></p>\n`,
      "16.01",
    );
  }
  equal(
    changelogTimeline('[read](https://example.com/?q="x"&page=2)'),
    '\n<p><a href="https://example.com/?q=&quot;x&quot;&amp;page=2">read</a></p>\n',
    "16.02",
  );
});

test("17 - unsafe link schemes leave readable labels", () => {
  for (let url of [
    "javascript:alert",
    "JaVaScRiPt:alert",
    "data:text/html,evil",
    "vbscript:evil",
    "file:///etc/passwd",
  ]) {
    equal(
      changelogTimeline(`[**read**](${url})`),
      "\n<p><strong>read</strong></p>\n",
      "17.01",
    );
  }
});

test("18 - unmatched inline punctuation remains readable", () => {
  equal(
    changelogTimeline(
      "Keep `unfinished, *literal and [unfinished. A snake_case_name stays intact.",
    ),
    "\n<p>Keep `unfinished, *literal and [unfinished. A snake_case_name stays intact.</p>\n",
    "18.01",
  );
});

test("19 - ordered release instructions retain a non-default start", () => {
  equal(
    changelogTimeline("3. Remove the old option\n4. Use the new API\n\nDone."),
    '\n<ol start="3">\n  <li>Remove the old option</li>\n  <li>Use the new API</li>\n</ol>\n<p>Done.</p>\n',
    "19.01",
  );
  equal(
    changelogTimeline("1. First\n2. Second"),
    "\n<ol>\n  <li>First</li>\n  <li>Second</li>\n</ol>\n",
    "19.02",
  );
});

test("20 - nested change lists retain their hierarchy", () => {
  equal(
    changelogTimeline("- Parent\n  - Child\n  - Another child\n- Next"),
    "\n<ul>\n  <li>Parent\n    <ul>\n      <li>Child</li>\n      <li>Another child</li>\n    </ul>\n  </li>\n  <li>Next</li>\n</ul>\n",
    "20.01",
  );
});

test("21 - list items retain continuation lines", () => {
  equal(
    changelogTimeline("- A change with\n  more explanation\n- Another change"),
    "\n<ul>\n  <li>A change with\n    more explanation\n  </li>\n  <li>Another change</li>\n</ul>\n",
    "21.01",
  );
});

test("22 - fenced examples escape HTML and preserve whitespace", () => {
  equal(
    changelogTimeline(
      'Before.\n\n```js\nconst tag = "<b>";\n  // **literal** & code\n```\n\nAfter.',
    ),
    '\n<p>Before.</p>\n<pre><code class="language-js">const tag = "&lt;b&gt;";\n  // **literal** &amp; code\n</code></pre>\n<p>After.</p>\n',
    "22.01",
  );
});

test("23 - plain and unclosed fences remain code", () => {
  equal(
    changelogTimeline("~~~\n# 1.0.0 (2022-08-12)\n- literal\n~~~"),
    "\n<pre><code># 1.0.0 (2022-08-12)\n- literal\n</code></pre>\n",
    "23.01",
  );
  equal(
    changelogTimeline("```\n<unfinished>"),
    "\n<pre><code>&lt;unfinished&gt;\n</code></pre>\n",
    "23.02",
  );
});

test("24 - historical autolinks and bare URLs remain clickable", () => {
  equal(
    changelogTimeline(
      "Reference: <https://www.fileformat.info/info/unicode/category/Zs/list.htm>\n\nSee https://example.com/docs for details.",
    ),
    '\n<p>Reference: <a href="https://www.fileformat.info/info/unicode/category/Zs/list.htm">https://www.fileformat.info/info/unicode/category/Zs/list.htm</a></p>\n<p>See <a href="https://example.com/docs">https://example.com/docs</a> for details.</p>\n',
    "24.01",
  );
});

test("25 - historical nested emphasis and escaped punctuation are retained", () => {
  equal(
    changelogTimeline(
      "**PS. Bumping _semver major_ just in case** 😉\n\n- PR \\#3 from [@mac-](https://github.com/mac-)",
    ),
    '\n<p><strong>PS. Bumping <em>semver major</em> just in case</strong> 😉</p>\n<ul>\n  <li>PR #3 from <a href="https://github.com/mac-">@mac-</a></li>\n</ul>\n',
    "25.01",
  );
});

test("26 - historical blockquotes and thematic breaks remain separate blocks", () => {
  equal(
    changelogTimeline(
      "A change.\n\n---\n\n> Mapping data is often _incomplete_.\n\n- Fixed",
    ),
    "\n<p>A change.</p>\n<hr>\n<blockquote>\n<p>Mapping data is often <em>incomplete</em>.</p>\n</blockquote>\n<ul>\n  <li>Fixed</li>\n</ul>\n",
    "26.01",
  );
});

test("27 - historical list items retain fenced migrations and following prose", () => {
  equal(
    changelogTimeline(
      "- All functions were renamed:\n\n  ```\n  getKeyset      => getKeysetSync\n  enforceKeyset  => enforceKeysetSync\n  ```\n\n  In their place, **async-alternatives** were placed.\n\nUpdate your API.",
    ),
    "\n<ul>\n  <li><p>All functions were renamed:</p>\n    <pre><code>getKeyset      =&gt; getKeysetSync\nenforceKeyset  =&gt; enforceKeysetSync\n</code></pre>\n    <p>In their place, <strong>async-alternatives</strong> were placed.</p>\n  </li>\n</ul>\n<p>Update your API.</p>\n",
    "27.01",
  );
});

test("28 - prose character references are decoded while code stays literal", () => {
  equal(
    changelogTimeline(
      "&amp; &lt; &gt; &quot; &apos; &#65; &#x1f600; &hellip; &unknown;\n\n`&amp; &#65;`",
    ),
    "\n<p>&amp; &lt; &gt; \" ' A 😀 … &amp;unknown;</p>\n<p><code>&amp;amp; &amp;#65;</code></p>\n",
    "28.01",
  );
  equal(
    changelogTimeline("&#0; &#xD800; &#1114112;"),
    "\n<p>� � �</p>\n",
    "28.02",
  );
});

test("29 - encoded unsafe schemes cannot bypass link validation", () => {
  for (let url of [
    "java&#9;script:alert",
    "javascript&#58;alert",
    "java&#x0a;script:alert",
    "\u0000javascript:alert",
  ]) {
    equal(changelogTimeline(`[read](${url})`), "\n<p>read</p>\n", "29.01");
  }
});

test("30 - long unmatched markers and deeply nested quotes remain renderable", () => {
  let brackets = "[".repeat(10000);
  equal(changelogTimeline(brackets), `\n<p>${brackets}</p>\n`, "30.01");
  equal(
    changelogTimeline(`${">".repeat(10000)}kept`).includes("kept"),
    true,
    "30.02",
  );
});

test.run();
