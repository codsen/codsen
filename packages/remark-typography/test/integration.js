import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { test } from "uvu";
import { equal } from "uvu/assert";

import changelogTimeline from "../../remark-conventional-commit-changelog-timeline/dist/remark-conventional-commit-changelog-timeline.esm.js";
import fixTypography from "../dist/remark-typography.esm.js";

test("01 - HTML rendering preserves MDAST boundary semantics", async () => {
  const source =
    "The `deno`'s and [project](https://example.com/a-b?x=1)'s \"results\"... measure 3 x 4 - today.";
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(fixTypography)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(source);

  equal(
    file.toString(),
    '<p>The <code>deno</code>’s and <a href="https://example.com/a-b?x=1">project</a>’s “results”… measure 3 × 4 — today.</p>',
    "01.01",
  );
});

test("02 - timeline headings survive typographic date separators", async () => {
  const file = await remark()
    .use(remarkGfm)
    .use(fixTypography)
    .process("## 1.2.3 (2022-08-12)");

  equal(file.toString(), "## 1.2.3 (2022–08–12)\n", "02.01");
  equal(
    changelogTimeline(file.toString()),
    '\n<h2>1.2.3</h2>\n<div class="release-date">12 Aug <span>2022</span></div>\n',
    "02.02",
  );
});

test.run();
