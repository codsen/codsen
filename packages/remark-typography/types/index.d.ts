import { Root } from "mdast";
import { Plugin } from "unified";

/** Options accepted by {@link fixTypography}. */
interface Opts {
  /** Receives finite, strictly increasing integer percentages within the inclusive configured bounds. */
  reportProgressFunc?: false | null | ((percentageDone: number) => void);
  /** Inclusive progress lower bound; an integer from 0 through 100. */
  reportProgressFuncFrom?: number;
  /** Inclusive progress upper bound; an integer from 0 through 100. */
  reportProgressFuncTo?: number;
}
/** Plain completion statistics stored at `file.data.remarkTypography`. */
interface RemarkTypographyCompletion {
  blocksProcessed: number;
  textNodesProcessed: number;
  charactersProcessed: number;
  textNodesChanged: number;
  replacementsApplied: number;
  apostrophesConverted: number;
  dashesConverted: number;
  ellipsesConverted: number;
  multiplicationSignsConverted: number;
  widowMeasuresAdded: number;
  timeTakenInMilliseconds: number;
}
declare module "vfile" {
  interface DataMap {
    remarkTypography?: RemarkTypographyCompletion;
  }
}
/** Fix English typography in the mutable phrasing text of an MDAST tree. */
declare const fixTypography: Plugin<[options?: Opts], Root>;

export { fixTypography as default };
export type { Opts, RemarkTypographyCompletion };
