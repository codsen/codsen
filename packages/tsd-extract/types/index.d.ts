declare const version: string;
interface Opts {
  extractAll: boolean;
  semi: boolean;
  mustInclude: string;
  stripAs: boolean;
}
interface Statement {
  identifiers: string[];
  identifiersStartAt: number | null;
  identifiersEndAt: number | null;
  content: string | null;
  contentStartsAt: number | null;
  contentEndsAt: number | null;
  value: string | null;
  valueStartsAt: number | null;
  valueEndsAt: number | null;
}
declare const defaults: Opts;
declare type ReturnType = Statement & {
  all: string[];
  error: string | null;
};
/**
 *
 * @param str type definitions file, as a string
 * @param def name of an interface, function or something else to extract
 * @param opts optional options object
 */
declare function extract(
  str: string,
  def: string,
  opts?: Partial<Opts>
): ReturnType;
declare function join(...args: string[]): string;

export { defaults, extract, join, version };
