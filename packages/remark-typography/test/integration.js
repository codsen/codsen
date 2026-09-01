import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { test } from "uvu";
import { equal } from "uvu/assert";

import changelogTimeline from "../../remark-conventional-commit-changelog-timeline/dist/remark-conventional-commit-changelog-timeline.esm.js";
import fixTypography from "../dist/remark-typography.esm.js";

test("01 - production plugin order preserves MDAST boundary semantics", async () => {
  const source =
    "The `deno`'s and [project](https://example.com/a-b?x=1)'s \"results\"... measure 3 x 4 - today.";
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(fixTypography)
    .use(remarkRehype)
    .use(changelogTimeline)
    .use(rehypeStringify)
    .process(source);

  equal(
    file.toString(),
    '<p>The <code>deno</code>’s and <a href="https://example.com/a-b?x=1">project</a>’s “results”… measure 3 × 4 — today.</p>',
    "01.01",
  );
});

test("02 - timeline headings survive typographic date separators", async () => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(fixTypography)
    .use(remarkRehype)
    .use(changelogTimeline)
    .use(rehypeStringify)
    .process("## 1.2.3 (2022-08-12)");

  equal(
    file.toString(),
    '<h2>1.2.3</h2><div class="release-date">Aug 12, <span>2022</span></div>',
    "02.01",
  );
});

test.run();
