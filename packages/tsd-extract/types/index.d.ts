declare const version: string;
interface Opts {
  extractAll: boolean;
  semi: boolean;
  mustInclude: string | undefined;
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
/**
 *
 * @param str type definitions file, as a string
 * @param def name of an interface, function or something else to extract
 * @param opts optional options object
 */
declare type ReturnType = Statement & {
  all: string[];
  error: string | null;
};
declare function extract(
  str: string,
  def: string,
  opts?: Partial<Opts>
): ReturnType;

export { defaults, extract, version };
