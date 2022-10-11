import { Plugin } from "unified";
import { Root } from "hast";

interface Obj {
  [key: string]: any;
}
declare const contains: (
  tree: any,
  something: string | string[]
) => string | undefined;
declare const getNthChildTag: (
  tree: any,
  tagName: string,
  nth: number
) => Obj | null;

interface Opts {
  /**
   * Plugin will take each row, add a row above, with content from
   * the first column (single TD with colspan=0)
   */
  tableClassName: string;
  /**
   * Plugin will take each row, add a row above, with content from
   * the first column (single TD with colspan=0)
   */
  newTrClassName: string;
  /**
   * The first TD of each TR in the result table will have this class
   */
  hideTdClassName: string;
  /**
   * When cells are stacked, it's necessary to visually separate
   * the blocks. This plugin will add a gap <tr> above
   */
  gapTrClassName: string;
  /**
   * When the first column is "lifted" up, its contents are wrapped
   * with a span which will contain this CSS class
   */
  newTrSpanClassName: string;
  /**
   * Lift the following cells' contents up, under the first column
   */
  up: string[];
  /**
   * Move the following cells' contents under the table, full-width cell
   */
  /**
   * On narrow viewports sticky thead does not make sense any more, so
   * each <tr> group gets it own, equivalent of <thead>. Now, if
   * all heading cell values are covered by this blacklist, this
   * <thead> equivalent row won't be displayed.
   */
  newTheadBlacklist: string[];
}
declare const defaults: Opts;
declare const rehypeResponsiveTables: Plugin<[Partial<Opts>?], Root>;

export {
  Opts,
  contains,
  rehypeResponsiveTables as default,
  defaults,
  getNthChildTag,
};
