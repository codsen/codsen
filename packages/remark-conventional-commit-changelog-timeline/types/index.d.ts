/**
 * Render Codsen Conventional Commits Markdown as fixed timeline HTML.
 * Supports release/section headings, paragraphs, lists, fenced code, quotes,
 * links, inline code and emphasis. This is not a general Markdown processor.
 */
declare function changelogTimeline(markdown: string): string;

export { changelogTimeline as default };
