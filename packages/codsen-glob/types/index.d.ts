declare const version: string;
type ExpandDirectories =
  | boolean
  | readonly string[]
  | {
      files?: readonly string[];
      extensions?: readonly string[];
    };
interface GlobOptions {
  absolute?: boolean;
  caseSensitiveMatch?: boolean;
  cwd?: string | URL;
  dot?: boolean;
  expandDirectories?: ExpandDirectories;
  followSymbolicLinks?: boolean;
  ignore?: string | readonly string[];
  onlyDirectories?: boolean;
  onlyFiles?: boolean;
  signal?: AbortSignal;
}
declare function glob(
  patterns: string | readonly string[],
  optionsInput?: GlobOptions,
): Promise<string[]>;
declare function globSync(
  patterns: string | readonly string[],
  optionsInput?: GlobOptions,
): string[];

export { glob, globSync, version };
export type { ExpandDirectories, GlobOptions };
