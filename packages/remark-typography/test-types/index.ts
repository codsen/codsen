import type { Root } from "mdast";
import { remark } from "remark";
import fixTypography from "remark-typography";
import type { Plugin } from "unified";

const mdastPlugin: Plugin<[options?: Record<string, never>], Root> =
  fixTypography;

remark().use(mdastPlugin);
remark().use(fixTypography);
remark().use(fixTypography, {});

// @ts-expect-error -- this plugin does not define configurable options.
remark().use(fixTypography, { convertEntities: false });
