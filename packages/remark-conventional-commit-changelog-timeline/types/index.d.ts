import { Plugin } from "unified";
import { Root } from "hast";

interface DateParamsObj {
  date: Date;
  year: string;
  month: string;
  day: string;
}
interface Opts {
  dateDivLocale: string;
  dateDivMarkup: (dateParamsObj: DateParamsObj) => string;
}
declare const defaults: Opts;
type UnifiedPlugin<T> = Plugin<[T], Root>;
declare const changelogTimeline: UnifiedPlugin<[Partial<Opts>?]>;

export { DateParamsObj, Opts, changelogTimeline as default, defaults };
