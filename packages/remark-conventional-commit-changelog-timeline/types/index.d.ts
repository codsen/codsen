import { Root } from "hast";
import { Plugin } from "unified";

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
type UnifiedPlugin<T extends unknown[]> = Plugin<T, Root>;
declare const changelogTimeline: UnifiedPlugin<[options?: Partial<Opts>]>;

export { changelogTimeline as default, defaults };
export type { DateParamsObj, Opts };
