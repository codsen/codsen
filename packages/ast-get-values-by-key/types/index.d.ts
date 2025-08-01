declare const version: string;
interface Findings {
  val: any;
  path: string;
}
/**
 * Extract values and paths from AST by keys OR set them by keys
 */
declare function getByKey(
  originalInput: any,
  whatToFind: string | string[],
  originalReplacement?: any,
): any;

export { getByKey, version };
export type { Findings };
