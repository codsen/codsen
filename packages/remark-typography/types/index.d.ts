import { Plugin } from "unified";
import { Root } from "hast";

type UnifiedPlugin<T> = Plugin<[T], Root>;
declare const fixTypography: UnifiedPlugin<any[]>;

export { fixTypography as default };
