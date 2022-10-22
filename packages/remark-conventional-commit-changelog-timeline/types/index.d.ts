import { Plugin } from "unified";
import { Root } from "hast";

declare type UnifiedPlugin<T> = Plugin<[T], Root>;
declare const changelogTimeline: UnifiedPlugin<any[]>;

export { changelogTimeline as default };
