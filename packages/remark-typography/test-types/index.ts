import type { Root } from "mdast";
import { remark } from "remark";
import type { Opts, RemarkTypographyCompletion } from "remark-typography";
import fixTypography from "remark-typography";
import type { Plugin } from "unified";

const mdastPlugin: Plugin<[options?: Opts], Root> = fixTypography;

remark().use(mdastPlugin);
remark().use(fixTypography);
remark().use(fixTypography, {});

const options: Opts = {
  reportProgressFunc: (percentageDone) => {
    const percentage: number = percentageDone;
    void percentage;
  },
  reportProgressFuncFrom: 20,
  reportProgressFuncTo: 80,
};
const file = remark().use(fixTypography, options).processSync("Wait...");
const completion: RemarkTypographyCompletion | undefined =
  file.data.remarkTypography;
const completionShape: RemarkTypographyCompletion = {
  apostrophesConverted: 0,
  blocksProcessed: 1,
  charactersProcessed: 7,
  dashesConverted: 0,
  ellipsesConverted: 1,
  multiplicationSignsConverted: 0,
  replacementsApplied: 1,
  textNodesChanged: 1,
  textNodesProcessed: 1,
  timeTakenInMilliseconds: 0,
  widowMeasuresAdded: 0,
};
void completion;
void completionShape;

// @ts-expect-error -- this plugin does not define this option.
remark().use(fixTypography, { convertEntities: false });

// @ts-expect-error -- progress must be reported through a callback.
remark().use(fixTypography, { reportProgressFunc: "progress" });

// @ts-expect-error -- progress range bounds must be numbers.
remark().use(fixTypography, { reportProgressFuncFrom: "20" });
