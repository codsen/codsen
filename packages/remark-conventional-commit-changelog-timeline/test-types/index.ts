import type { Root } from "hast";
import changelogTimeline, {
  type Opts,
} from "remark-conventional-commit-changelog-timeline";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import type { Plugin } from "unified";
import { unified } from "unified";

const processor = () => unified().use(remarkParse).use(remarkRehype);
const hastPlugin: Plugin<[options?: Partial<Opts>], Root> = changelogTimeline;

processor().use(hastPlugin);
processor().use(changelogTimeline);
processor().use(changelogTimeline, {});
processor().use(changelogTimeline, { dateDivLocale: "en-GB" });
processor().use(changelogTimeline, {
  dateDivMarkup: ({ day, month, year }) => `${day} ${month} ${year}`,
});

// @ts-expect-error -- unknown options must remain rejected.
processor().use(changelogTimeline, { unknownOption: true });

// @ts-expect-error -- known options must retain their declared types.
processor().use(changelogTimeline, { dateDivLocale: 1 });
