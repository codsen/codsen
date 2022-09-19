import { Plugin } from "unified";
import { Root } from "hast";

declare type UnifiedPlugin<T> = Plugin<[T], Root>;
declare const fixTypography: UnifiedPlugin<any[]>;

export { fixTypography as default };
