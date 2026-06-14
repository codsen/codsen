import { Root } from "hast";
import { Plugin } from "unified";

type UnifiedPlugin<T> = Plugin<[T], Root>;
declare const fixTypography: UnifiedPlugin<any[]>;

export { fixTypography as default };
