import changelogTimeline from "remark-conventional-commit-changelog-timeline";

const render: (markdown: string) => string = changelogTimeline;
const html: string = render("## 1.0.0 (2026-08-12)\n\n- First release");

changelogTimeline("");
changelogTimeline(html);

// @ts-expect-error -- the Markdown input is required.
changelogTimeline();

// @ts-expect-error -- the input must be a string.
changelogTimeline(123);

// @ts-expect-error -- the formatter no longer accepts a syntax tree.
changelogTimeline({ type: "root", children: [] });

// @ts-expect-error -- formatting options were removed.
changelogTimeline("# 1.0.0 (2026-08-12)", { dateDivLocale: "en-GB" });
