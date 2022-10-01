import { Plugin } from "unified";
import { Root } from "hast";

interface Opts {
  /**
   * plugin will take each row, add a row above, with content from
   * the first column (single TD with colspan=0)
   */
  tableClassName: string;
  /**
   * plugin will take each row, add a row above, with content from
   * the first column (single TD with colspan=0)
   */
  newTrClassName: string;
  /**
   * first TD of each TR in the result table will have this class
   */
  hideTdClassName: string;
}
declare const rehypeResponsiveTables: Plugin<[Partial<Opts>?], Root>;

export { Opts, rehypeResponsiveTables as default };
