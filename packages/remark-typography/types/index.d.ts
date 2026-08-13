import { Root } from "mdast";
import { Plugin } from "unified";

type UnifiedPlugin<T extends unknown[]> = Plugin<T, Root>;
declare const fixTypography: UnifiedPlugin<[options?: Record<string, never>]>;

export { fixTypography as default };
