import {
  type Dirent,
  lstatSync,
  readdirSync,
  realpathSync,
  type Stats,
  statSync,
} from "node:fs";
import { lstat, readdir, realpath, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import picomatch from "picomatch";

import { version as v } from "../package.json";

const version: string = v;

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

interface ResolvedOptions {
  absolute: boolean;
  caseSensitiveMatch: boolean;
  cwd: string;
  dot: boolean;
  expandDirectories: ExpandDirectories;
  followSymbolicLinks: boolean;
  ignore: string[];
  onlyDirectories: boolean;
  onlyFiles: boolean;
  signal?: AbortSignal;
}

interface PreparedPattern {
  absolute: boolean;
  basenameLiteral?: string;
  basenameRegex?: RegExp;
  basenameSuffix?: string;
  negative: boolean;
  original: string;
  regex: RegExp;
}

interface Candidate {
  absolutePath: string;
  isDirectory: boolean;
  relativePath: string;
}

interface WalkItem {
  absolutePath: string;
  ancestors: ReadonlySet<string>;
  depth: number;
  maxDepth: number;
  relativePath: string;
}

interface SearchRoot {
  absolutePath: string;
  includeSelf: boolean;
  maxDepth: number;
}

const concurrency = 256;

function slash(value: string): string {
  return value.split(path.sep).join("/");
}

function isNegative(pattern: string): boolean {
  return pattern.startsWith("!");
}

function assertPatterns(
  patterns: string | readonly string[],
  functionName: "glob" | "globSync",
): string[] {
  const result = typeof patterns === "string" ? [patterns] : patterns;
  if (
    !Array.isArray(result) ||
    result.some((item) => typeof item !== "string")
  ) {
    throw new TypeError(
      `codsen-glob/${functionName}(): [THROW_ID_01] The patterns argument must be a glob or an array of globs`,
    );
  }
  return [...new Set(result.map(slash))];
}

function resolveOptions(
  options: GlobOptions = {},
  functionName: "glob" | "globSync",
): ResolvedOptions {
  let cwd: string;
  if (options.cwd instanceof URL) {
    cwd = fileURLToPath(options.cwd);
  } else if (options.cwd === undefined) {
    cwd = process.cwd();
  } else if (typeof options.cwd === "string") {
    cwd = options.cwd;
  } else {
    throw new TypeError(
      `codsen-glob/${functionName}(): [THROW_ID_02] The cwd option must be a string or file URL`,
    );
  }

  const ignore = options.ignore === undefined ? [] : options.ignore;
  if (
    typeof ignore !== "string" &&
    (!Array.isArray(ignore) || ignore.some((item) => typeof item !== "string"))
  ) {
    throw new TypeError(
      `codsen-glob/${functionName}(): [THROW_ID_03] The ignore option must be a string or an array of strings`,
    );
  }

  const onlyDirectories = options.onlyDirectories === true;
  return {
    absolute: options.absolute === true,
    caseSensitiveMatch: options.caseSensitiveMatch !== false,
    cwd: path.resolve(cwd),
    dot: options.dot === true,
    expandDirectories: options.expandDirectories ?? true,
    followSymbolicLinks: options.followSymbolicLinks !== false,
    ignore: (typeof ignore === "string" ? [ignore] : Array.from(ignore)).map(
      slash,
    ),
    onlyDirectories,
    onlyFiles: onlyDirectories ? false : options.onlyFiles !== false,
    signal: options.signal,
  };
}

function findClosing(
  value: string,
  start: number,
  open: string,
  close: string,
): number {
  let depth = 0;
  for (let index = start; index < value.length; index++) {
    if (value[index] === "\\") {
      index++;
    } else if (value[index] === open) {
      depth++;
    } else if (value[index] === close && --depth === 0) {
      return index;
    }
  }
  return -1;
}

function splitAlternatives(value: string, separator: string): string[] {
  const result: string[] = [];
  let start = 0;
  let parentheses = 0;
  let braces = 0;
  for (let index = 0; index < value.length; index++) {
    const char = value[index];
    if (char === "\\") {
      index++;
    } else if (char === "(") {
      parentheses++;
    } else if (char === ")") {
      parentheses--;
    } else if (char === "{") {
      braces++;
    } else if (char === "}") {
      braces--;
    } else if (char === separator && parentheses === 0 && braces === 0) {
      result.push(value.slice(start, index));
      start = index + 1;
    }
  }
  result.push(value.slice(start));
  return result;
}

function rangeAlternatives(value: string): string[] | undefined {
  const match = /^(-?\d+)\.\.(-?\d+)(?:\.\.(-?\d+))?$/.exec(value);
  if (match) {
    const start = Number(match[1]);
    const end = Number(match[2]);
    const width = Math.max(
      match[1].replace(/^-/, "").length,
      match[2].replace(/^-/, "").length,
    );
    const padded = /^-?0\d/.test(match[1]) || /^-?0\d/.test(match[2]);
    let step =
      match[3] === undefined ? (start <= end ? 1 : -1) : Number(match[3]);
    if (step === 0) {
      return undefined;
    }
    step = start <= end ? Math.abs(step) : -Math.abs(step);
    const result: string[] = [];
    for (
      let current = start;
      step > 0 ? current <= end : current >= end;
      current += step
    ) {
      result.push(
        padded
          ? `${current < 0 ? "-" : ""}${String(Math.abs(current)).padStart(width, "0")}`
          : String(current),
      );
    }
    return result;
  }

  const characterMatch = /^(.)\.\.(.)(?:\.\.(-?\d+))?$/u.exec(value);
  if (!characterMatch) {
    return undefined;
  }
  const start = characterMatch[1].codePointAt(0) as number;
  const end = characterMatch[2].codePointAt(0) as number;
  let step =
    characterMatch[3] === undefined
      ? start <= end
        ? 1
        : -1
      : Number(characterMatch[3]);
  if (step === 0) {
    return undefined;
  }
  step = start <= end ? Math.abs(step) : -Math.abs(step);
  const result: string[] = [];
  for (
    let current = start;
    step > 0 ? current <= end : current >= end;
    current += step
  ) {
    result.push(String.fromCodePoint(current));
  }
  return result;
}

function expandBraces(pattern: string): string[] {
  for (let index = 0; index < pattern.length; index++) {
    if (pattern[index] === "\\") {
      index++;
      continue;
    }
    if (pattern[index] !== "{") {
      continue;
    }
    const closing = findClosing(pattern, index, "{", "}");
    if (closing === -1) {
      return [pattern];
    }
    const body = pattern.slice(index + 1, closing);
    const alternatives =
      rangeAlternatives(body) ?? splitAlternatives(body, ",");
    if (alternatives.length === 1) {
      continue;
    }
    return alternatives.flatMap((alternative) =>
      expandBraces(
        `${pattern.slice(0, index)}${alternative}${pattern.slice(closing + 1)}`,
      ),
    );
  }
  return [pattern];
}

function expandSlashExtglobs(pattern: string): string[] {
  for (let index = 0; index < pattern.length - 1; index++) {
    if (pattern[index] === "\\") {
      index++;
      continue;
    }
    if (!"@+?*".includes(pattern[index]) || pattern[index + 1] !== "(") {
      continue;
    }
    const closing = findClosing(pattern, index + 1, "(", ")");
    if (closing === -1) {
      return [pattern];
    }
    const alternatives = splitAlternatives(
      pattern.slice(index + 2, closing),
      "|",
    );
    if (!alternatives.some((alternative) => alternative.includes("/"))) {
      index = closing;
      continue;
    }
    const outside = `${pattern.slice(0, index)}${pattern.slice(closing + 1)}`;
    return alternatives
      .filter(
        (alternative) => !alternative.includes("/") || outside.includes("**"),
      )
      .flatMap((alternative) =>
        expandSlashExtglobs(
          `${pattern.slice(0, index)}${alternative}${pattern.slice(closing + 1)}`,
        ),
      );
  }
  return [pattern];
}

function compilePattern(pattern: string, options: ResolvedOptions): RegExp {
  const normalised = slash(pattern);
  const withoutLeadingDot = normalised.replace(/^\.\//, "");
  if (
    withoutLeadingDot
      .split("/")
      .some((part) => part === "." || part === "..") ||
    /\{[^{}]*\.\.[^{}]*\.\.0\}/.test(normalised)
  ) {
    return /$a/;
  }
  for (let index = 0; index < normalised.length - 1; index++) {
    if (
      "@+?*!".includes(normalised[index]) &&
      normalised[index + 1] === "(" &&
      findClosing(normalised, index + 1, "(", ")") === -1
    ) {
      return /$a/;
    }
  }
  return picomatch.makeRe(normalised, {
    dot: options.dot,
    nocase: !options.caseSensitiveMatch,
    posix: true,
    strictSlashes: false,
  });
}

function matchPattern(pattern: string): string {
  return !path.isAbsolute(pattern) &&
    !pattern.includes("/") &&
    !pattern.includes(path.sep) &&
    pattern.startsWith("**") &&
    pattern[2] !== "*" &&
    !/[*?[(!]/.test(pattern.slice(2))
    ? `**/${pattern}`
    : pattern;
}

function dynamicIndex(pattern: string): number {
  for (let index = 0; index < pattern.length; index++) {
    if (pattern[index] === "\\") {
      index++;
    } else if ("*?{[(".includes(pattern[index])) {
      return index;
    }
  }
  return -1;
}

function searchRoot(pattern: string, cwd: string): SearchRoot {
  const absolute = path.isAbsolute(pattern);
  const dynamicAt = dynamicIndex(pattern);
  const staticPart = dynamicAt === -1 ? pattern : pattern.slice(0, dynamicAt);
  const slashAt = Math.max(
    staticPart.lastIndexOf("/"),
    staticPart.lastIndexOf(path.sep),
  );
  let base: string;
  if (dynamicAt === -1) {
    base = pattern;
    if (path.sep === "/") {
      base = pattern.replace(/\\(.)/g, "$1");
    }
  } else if (slashAt === -1) {
    base = ".";
  } else {
    base = staticPart.slice(0, Math.max(1, slashAt));
  }
  const absolutePath = path.resolve(absolute ? base : path.join(cwd, base));
  const remainingSegments = slash(
    path.relative(absolutePath, path.resolve(cwd, pattern)),
  ).split("/");
  return {
    absolutePath,
    includeSelf: dynamicAt === -1,
    maxDepth: remainingSegments.some((segment) => segment.includes("**"))
      ? Number.POSITIVE_INFINITY
      : remainingSegments.length,
  };
}

function directoryGlob(pattern: string, option: ExpandDirectories): string[] {
  const negative = isNegative(pattern);
  const bare = negative ? pattern.slice(1) : pattern;
  let files: readonly string[] | undefined;
  let extensions: readonly string[] | undefined;
  if (Array.isArray(option)) {
    files = option;
  } else if (typeof option === "object") {
    const settings = option as Exclude<
      ExpandDirectories,
      boolean | readonly string[]
    >;
    files = settings.files;
    extensions = settings.extensions;
  }

  let suffixes: string[];
  if (files) {
    suffixes = files.flatMap((file) => {
      if (path.extname(file) || !extensions?.length) {
        return [file];
      }
      return extensions.map((extension) => `${file}.${extension}`);
    });
  } else if (extensions?.length) {
    suffixes = extensions.map((extension) => `*.${extension}`);
  } else {
    suffixes = ["*"];
  }

  const prefix = negative ? "!" : "";
  return suffixes.map((suffix) =>
    slash(path.join(`${prefix}${bare}`, "**", suffix)),
  );
}

async function expandPatterns(
  patterns: string[],
  options: ResolvedOptions,
): Promise<string[]> {
  if (options.expandDirectories === false) {
    return patterns;
  }
  return (
    await Promise.all(
      patterns.map(async (pattern) => {
        const bare = isNegative(pattern) ? pattern.slice(1) : pattern;
        if (dynamicIndex(bare) !== -1) {
          return [pattern];
        }
        const location = path.resolve(options.cwd, bare);
        try {
          return (await stat(location)).isDirectory()
            ? directoryGlob(pattern, options.expandDirectories)
            : [pattern];
        } catch {
          return [pattern];
        }
      }),
    )
  ).flat();
}

function expandPatternsSync(
  patterns: string[],
  options: ResolvedOptions,
): string[] {
  if (options.expandDirectories === false) {
    return patterns;
  }
  return patterns.flatMap((pattern) => {
    const bare = isNegative(pattern) ? pattern.slice(1) : pattern;
    if (dynamicIndex(bare) !== -1) {
      return [pattern];
    }
    try {
      return statSync(path.resolve(options.cwd, bare)).isDirectory()
        ? directoryGlob(pattern, options.expandDirectories)
        : [pattern];
    } catch {
      return [pattern];
    }
  });
}

function preparePatterns(
  patterns: string[],
  options: ResolvedOptions,
): PreparedPattern[] {
  return patterns.flatMap((original) => {
    const negative = isNegative(original);
    const bare = negative ? original.slice(1) : original;
    return expandBraces(bare).flatMap((expanded) =>
      expandSlashExtglobs(expanded).map((finalPattern) => {
        const matchingPattern = matchPattern(finalPattern);
        const basenamePattern = matchingPattern.startsWith("**/")
          ? matchingPattern.slice(3)
          : undefined;
        const comparableBasename = options.caseSensitiveMatch
          ? basenamePattern
          : undefined;
        return {
          absolute: path.isAbsolute(finalPattern),
          basenameLiteral:
            comparableBasename &&
            !comparableBasename.includes("/") &&
            !/[*?{[(]/.test(comparableBasename)
              ? comparableBasename
              : undefined,
          basenameRegex:
            basenamePattern && !basenamePattern.includes("/")
              ? compilePattern(basenamePattern, options)
              : undefined,
          basenameSuffix:
            comparableBasename?.startsWith("*.") &&
            !comparableBasename.includes("/") &&
            !/[*?{[(]/.test(comparableBasename.slice(1))
              ? comparableBasename.slice(1)
              : undefined,
          negative,
          original: finalPattern,
          regex: compilePattern(matchingPattern, options),
        };
      }),
    );
  });
}

function minimalRoots(patterns: PreparedPattern[], cwd: string): SearchRoot[] {
  const roots = patterns
    .filter((pattern) => !pattern.negative)
    .map((pattern) => searchRoot(pattern.original, cwd));
  const result = new Map<string, SearchRoot>();
  for (const root of roots) {
    const existing = result.get(root.absolutePath);
    if (!existing || existing.maxDepth < root.maxDepth) {
      result.set(root.absolutePath, root);
    }
  }
  return [...result.values()];
}

function pruneNames(
  patterns: PreparedPattern[],
  ignores: PreparedPattern[],
): Set<string> {
  const result = new Set<string>();
  const lastPositive = patterns.findLastIndex((pattern) => !pattern.negative);
  for (const prepared of [...patterns.slice(lastPositive + 1), ...ignores]) {
    const name = pruneDirectoryName(prepared.original);
    if (name) {
      result.add(name);
    }
  }
  return result;
}

function pruneDirectoryName(patternInput: string): string | undefined {
  const pattern = slash(patternInput).replace(/^\.\//, "");
  return /^\*\*\/([^*?{}[\]()/]+)\/\*\*(?:\/\*)?$/.exec(pattern)?.[1];
}

function abortIfNeeded(signal?: AbortSignal): void {
  if (signal?.aborted) {
    const error = new Error("The glob operation was aborted");
    error.name = "AbortError";
    throw error;
  }
}

function isMissingError(error: unknown): boolean {
  const code = (error as { code?: string }).code;
  return code === "ENOENT" || code === "ENOTDIR";
}

function throwInvalidCwd(functionName: "glob" | "globSync"): never {
  throw new TypeError(
    `codsen-glob/${functionName}(): [THROW_ID_04] The cwd option must point at a directory`,
  );
}

async function validateCwd(cwd: string): Promise<boolean> {
  let cwdStat: Stats;
  try {
    cwdStat = await stat(cwd);
  } catch (error) {
    if (isMissingError(error)) {
      return false;
    }
    throw error;
  }
  if (!cwdStat.isDirectory()) {
    throwInvalidCwd("glob");
  }
  return true;
}

function validateCwdSync(cwd: string): boolean {
  let cwdStat: Stats;
  try {
    cwdStat = statSync(cwd);
  } catch (error) {
    if (isMissingError(error)) {
      return false;
    }
    throw error;
  }
  if (!cwdStat.isDirectory()) {
    throwInvalidCwd("globSync");
  }
  return true;
}

async function classifySymlink(
  absolutePath: string,
  follow: boolean,
  ancestors: ReadonlySet<string>,
): Promise<
  | { broken?: boolean; directory: boolean; ancestors: ReadonlySet<string> }
  | undefined
> {
  if (!follow) {
    return undefined;
  }
  try {
    const targetStat = await stat(absolutePath);
    if (!targetStat.isDirectory()) {
      return { directory: false, ancestors };
    }
    const target = await realpath(absolutePath);
    if (ancestors.has(target)) {
      return undefined;
    }
    return { directory: true, ancestors: new Set([...ancestors, target]) };
  } catch {
    return { broken: true, directory: false, ancestors };
  }
}

function classifySymlinkSync(
  absolutePath: string,
  follow: boolean,
  ancestors: ReadonlySet<string>,
):
  | { broken?: boolean; directory: boolean; ancestors: ReadonlySet<string> }
  | undefined {
  if (!follow) {
    return undefined;
  }
  try {
    const targetStat = statSync(absolutePath);
    if (!targetStat.isDirectory()) {
      return { directory: false, ancestors };
    }
    const target = realpathSync(absolutePath);
    if (ancestors.has(target)) {
      return undefined;
    }
    return { directory: true, ancestors: new Set([...ancestors, target]) };
  } catch {
    return { broken: true, directory: false, ancestors };
  }
}

function matchesPositiveCandidate(
  absolutePath: string,
  patterns: PreparedPattern[],
  options: ResolvedOptions,
  relativePath: string,
): boolean {
  const relativeName = relativePath;
  const rawBasename = relativeName.slice(relativeName.lastIndexOf("/") + 1);
  const basename = options.caseSensitiveMatch
    ? rawBasename
    : rawBasename.toLowerCase();
  return patterns.some(
    (pattern) =>
      !pattern.negative &&
      (pattern.basenameLiteral && !pattern.absolute
        ? basename === pattern.basenameLiteral
        : pattern.basenameSuffix && !pattern.absolute
          ? (options.dot || !rawBasename.startsWith(".")) &&
            basename.endsWith(pattern.basenameSuffix)
          : pattern.basenameRegex && !pattern.absolute
            ? pattern.basenameRegex.test(rawBasename)
            : pattern.regex.test(
                pattern.absolute ? slash(absolutePath) : relativeName,
              )),
  );
}

function addCandidate(
  candidates: Map<string, Candidate>,
  absolutePath: string,
  isDirectory: boolean,
  patterns: PreparedPattern[],
  options: ResolvedOptions,
  relativePath: string,
  knownPositive = false,
): void {
  if (
    knownPositive ||
    matchesPositiveCandidate(absolutePath, patterns, options, relativePath)
  ) {
    candidates.set(absolutePath, { absolutePath, isDirectory, relativePath });
  }
}

function onlySimpleBasenamePositives(patterns: PreparedPattern[]): boolean {
  return patterns.every(
    (pattern) =>
      pattern.negative ||
      (!pattern.absolute &&
        Boolean(pattern.basenameLiteral || pattern.basenameSuffix)),
  );
}

function matchesSimpleBasename(
  basename: string,
  patterns: PreparedPattern[],
  options: ResolvedOptions,
): boolean {
  return patterns.some(
    (pattern) =>
      !pattern.negative &&
      (pattern.basenameLiteral === basename ||
        (pattern.basenameSuffix !== undefined &&
          (options.dot || !basename.startsWith(".")) &&
          basename.endsWith(pattern.basenameSuffix))),
  );
}

function explicitHiddenDirectoryNames(
  patterns: PreparedPattern[],
): ReadonlySet<string> {
  const result = new Set<string>();
  for (const pattern of patterns) {
    if (!pattern.negative) {
      for (const segment of slash(pattern.original).split("/")) {
        if (/^\.[^*?{}[\]()/]+$/.test(segment)) {
          result.add(segment);
        }
      }
    }
  }
  return result;
}

function skipDirectory(
  name: string,
  options: ResolvedOptions,
  pruned: ReadonlySet<string>,
  explicitHidden: ReadonlySet<string>,
): boolean {
  return (
    pruned.has(name) ||
    (!options.dot && name.startsWith(".") && !explicitHidden.has(name))
  );
}

async function walk(
  roots: SearchRoot[],
  patterns: PreparedPattern[],
  options: ResolvedOptions,
  pruned: ReadonlySet<string>,
): Promise<Candidate[]> {
  const candidates = new Map<string, Candidate>();
  const queue: WalkItem[] = [];
  const explicitHidden = explicitHiddenDirectoryNames(patterns);
  const simpleBasenamesOnly = onlySimpleBasenamePositives(patterns);

  for (const root of roots) {
    abortIfNeeded(options.signal);
    const rootRelative = slash(path.relative(options.cwd, root.absolutePath));
    try {
      const rootLstat = await lstat(root.absolutePath);
      if (rootLstat.isDirectory()) {
        const canonical = await realpath(root.absolutePath);
        queue.push({
          absolutePath: root.absolutePath,
          ancestors: new Set([canonical]),
          depth: 0,
          maxDepth: root.maxDepth,
          relativePath: rootRelative,
        });
        if (!options.onlyFiles && root.includeSelf) {
          addCandidate(
            candidates,
            root.absolutePath,
            true,
            patterns,
            options,
            rootRelative,
          );
        }
      } else if (rootLstat.isSymbolicLink()) {
        // `true` here is deliberate, not an oversight. followSymbolicLinks
        // governs whether a symlink met as an entry during the walk is
        // descended into, not whether the search root may be one: a pattern
        // whose static prefix is a symlinked directory still has to resolve it
        // to have anywhere to walk at all, which test 10.10 pins. The option is
        // consulted below, in the branch where the root resolves to a file
        // rather than a directory - that is what makes 10.05 return nothing.
        const classified = await classifySymlink(
          root.absolutePath,
          true,
          new Set(),
        );
        if (classified?.directory) {
          queue.push({
            absolutePath: root.absolutePath,
            ancestors: classified.ancestors,
            depth: 0,
            maxDepth: root.maxDepth,
            relativePath: rootRelative,
          });
          if (!options.onlyFiles && root.includeSelf) {
            addCandidate(
              candidates,
              root.absolutePath,
              true,
              patterns,
              options,
              rootRelative,
            );
          }
        } else if (
          classified &&
          options.followSymbolicLinks &&
          !options.onlyDirectories &&
          (!classified.broken || !options.onlyFiles)
        ) {
          addCandidate(
            candidates,
            root.absolutePath,
            false,
            patterns,
            options,
            rootRelative,
          );
        }
      } else if (!options.onlyDirectories) {
        addCandidate(
          candidates,
          root.absolutePath,
          false,
          patterns,
          options,
          rootRelative,
        );
      }
    } catch (error) {
      if (!isMissingError(error)) {
        throw error;
      }
    }
  }

  while (queue.length) {
    abortIfNeeded(options.signal);
    const batch = queue.splice(0, concurrency);
    const results = await Promise.all(
      batch.map(async (item) => {
        try {
          return {
            item,
            entries: await readdir(item.absolutePath, { withFileTypes: true }),
          };
        } catch (error) {
          if (isMissingError(error)) {
            return { item, entries: [] };
          }
          throw error;
        }
      }),
    );

    for (const { item, entries } of results) {
      for (const entry of entries) {
        const relativePath = item.relativePath
          ? `${item.relativePath}/${entry.name}`
          : entry.name;
        const simpleMatch =
          entry.isFile() &&
          simpleBasenamesOnly &&
          matchesSimpleBasename(entry.name, patterns, options);
        if (entry.isFile() && simpleBasenamesOnly && !simpleMatch) {
          continue;
        }
        const absolutePath = path.join(item.absolutePath, entry.name);
        const depth = item.depth + 1;
        if (entry.isDirectory()) {
          const skipped = skipDirectory(
            entry.name,
            options,
            pruned,
            explicitHidden,
          );
          if (!skipped && depth < item.maxDepth) {
            queue.push({
              absolutePath,
              ancestors: item.ancestors,
              depth,
              maxDepth: item.maxDepth,
              relativePath,
            });
          }
          if (!skipped && !options.onlyFiles) {
            addCandidate(
              candidates,
              absolutePath,
              true,
              patterns,
              options,
              relativePath,
            );
          }
        } else if (entry.isSymbolicLink()) {
          const classified = await classifySymlink(
            absolutePath,
            options.followSymbolicLinks,
            item.ancestors,
          );
          if (classified?.directory) {
            const skipped = skipDirectory(
              entry.name,
              options,
              pruned,
              explicitHidden,
            );
            if (!skipped && depth < item.maxDepth) {
              queue.push({
                absolutePath,
                ancestors: classified.ancestors,
                depth,
                maxDepth: item.maxDepth,
                relativePath,
              });
            }
            if (!skipped && !options.onlyFiles) {
              addCandidate(
                candidates,
                absolutePath,
                true,
                patterns,
                options,
                relativePath,
              );
            }
          } else if (
            classified &&
            !options.onlyDirectories &&
            (!classified.broken || !options.onlyFiles)
          ) {
            addCandidate(
              candidates,
              absolutePath,
              false,
              patterns,
              options,
              relativePath,
            );
          }
        } else if (entry.isFile() && !options.onlyDirectories) {
          addCandidate(
            candidates,
            absolutePath,
            false,
            patterns,
            options,
            relativePath,
            simpleMatch,
          );
        }
      }
    }
  }

  return [...candidates.values()];
}

function walkSync(
  roots: SearchRoot[],
  patterns: PreparedPattern[],
  options: ResolvedOptions,
  pruned: ReadonlySet<string>,
): Candidate[] {
  const candidates = new Map<string, Candidate>();
  const queue: WalkItem[] = [];
  const explicitHidden = explicitHiddenDirectoryNames(patterns);
  const simpleBasenamesOnly = onlySimpleBasenamePositives(patterns);
  for (const root of roots) {
    abortIfNeeded(options.signal);
    const rootRelative = slash(path.relative(options.cwd, root.absolutePath));
    try {
      const rootLstat = lstatSync(root.absolutePath);
      if (rootLstat.isDirectory()) {
        queue.push({
          absolutePath: root.absolutePath,
          ancestors: new Set([realpathSync(root.absolutePath)]),
          depth: 0,
          maxDepth: root.maxDepth,
          relativePath: rootRelative,
        });
        if (!options.onlyFiles && root.includeSelf) {
          addCandidate(
            candidates,
            root.absolutePath,
            true,
            patterns,
            options,
            rootRelative,
          );
        }
      } else if (rootLstat.isSymbolicLink()) {
        // `true` is deliberate here too - see the async twin above
        const classified = classifySymlinkSync(
          root.absolutePath,
          true,
          new Set(),
        );
        if (classified?.directory) {
          queue.push({
            absolutePath: root.absolutePath,
            ancestors: classified.ancestors,
            depth: 0,
            maxDepth: root.maxDepth,
            relativePath: rootRelative,
          });
          if (!options.onlyFiles && root.includeSelf) {
            addCandidate(
              candidates,
              root.absolutePath,
              true,
              patterns,
              options,
              rootRelative,
            );
          }
        } else if (
          classified &&
          options.followSymbolicLinks &&
          !options.onlyDirectories &&
          (!classified.broken || !options.onlyFiles)
        ) {
          addCandidate(
            candidates,
            root.absolutePath,
            false,
            patterns,
            options,
            rootRelative,
          );
        }
      } else if (!options.onlyDirectories) {
        addCandidate(
          candidates,
          root.absolutePath,
          false,
          patterns,
          options,
          rootRelative,
        );
      }
    } catch (error) {
      if (!isMissingError(error)) {
        throw error;
      }
    }
  }

  while (queue.length) {
    abortIfNeeded(options.signal);
    const item = queue.shift() as WalkItem;
    let entries: Dirent[];
    try {
      entries = readdirSync(item.absolutePath, { withFileTypes: true });
    } catch (error) {
      if (isMissingError(error)) {
        continue;
      }
      throw error;
    }
    for (const entry of entries) {
      const relativePath = item.relativePath
        ? `${item.relativePath}/${entry.name}`
        : entry.name;
      const simpleMatch =
        entry.isFile() &&
        simpleBasenamesOnly &&
        matchesSimpleBasename(entry.name, patterns, options);
      if (entry.isFile() && simpleBasenamesOnly && !simpleMatch) {
        continue;
      }
      const absolutePath = path.join(item.absolutePath, entry.name);
      const depth = item.depth + 1;
      if (entry.isDirectory()) {
        const skipped = skipDirectory(
          entry.name,
          options,
          pruned,
          explicitHidden,
        );
        if (!skipped && depth < item.maxDepth) {
          queue.push({
            absolutePath,
            ancestors: item.ancestors,
            depth,
            maxDepth: item.maxDepth,
            relativePath,
          });
        }
        if (!skipped && !options.onlyFiles) {
          addCandidate(
            candidates,
            absolutePath,
            true,
            patterns,
            options,
            relativePath,
          );
        }
      } else if (entry.isSymbolicLink()) {
        const classified = classifySymlinkSync(
          absolutePath,
          options.followSymbolicLinks,
          item.ancestors,
        );
        if (classified?.directory) {
          const skipped = skipDirectory(
            entry.name,
            options,
            pruned,
            explicitHidden,
          );
          if (!skipped && depth < item.maxDepth) {
            queue.push({
              absolutePath,
              ancestors: classified.ancestors,
              depth,
              maxDepth: item.maxDepth,
              relativePath,
            });
          }
          if (!skipped && !options.onlyFiles) {
            addCandidate(
              candidates,
              absolutePath,
              true,
              patterns,
              options,
              relativePath,
            );
          }
        } else if (
          classified &&
          !options.onlyDirectories &&
          (!classified.broken || !options.onlyFiles)
        ) {
          addCandidate(
            candidates,
            absolutePath,
            false,
            patterns,
            options,
            relativePath,
          );
        }
      } else if (entry.isFile() && !options.onlyDirectories) {
        addCandidate(
          candidates,
          absolutePath,
          false,
          patterns,
          options,
          relativePath,
          simpleMatch,
        );
      }
    }
  }
  return [...candidates.values()];
}

function selectMatches(
  candidates: Candidate[],
  patterns: PreparedPattern[],
  ignores: PreparedPattern[],
  options: ResolvedOptions,
  pruned: ReadonlySet<string>,
): string[] {
  const positivePatterns = patterns.filter((pattern) => !pattern.negative);
  const canReturnCandidatesDirectly =
    options.onlyFiles &&
    positivePatterns.length === 1 &&
    !positivePatterns[0].absolute &&
    Boolean(
      positivePatterns[0].basenameLiteral || positivePatterns[0].basenameSuffix,
    ) &&
    patterns.every(
      (pattern) =>
        !pattern.negative ||
        pruned.has(pruneDirectoryName(pattern.original) ?? ""),
    ) &&
    ignores.every((ignore) =>
      pruned.has(pruneDirectoryName(ignore.original) ?? ""),
    );
  if (canReturnCandidatesDirectly) {
    return candidates.map((candidate) =>
      options.absolute ? candidate.absolutePath : candidate.relativePath,
    );
  }
  const selected = new Map<string, string>();
  const effectiveIgnores = options.onlyFiles
    ? ignores.filter(
        (ignore) => !pruned.has(pruneDirectoryName(ignore.original) ?? ""),
      )
    : ignores;
  for (const pattern of patterns) {
    if (
      pattern.negative &&
      options.onlyFiles &&
      pruned.has(pruneDirectoryName(pattern.original) ?? "")
    ) {
      continue;
    }
    for (const candidate of candidates) {
      const absoluteName = slash(candidate.absolutePath);
      const relativeName = candidate.relativePath;
      const name = pattern.absolute ? absoluteName : relativeName;
      const rawBasename = relativeName.slice(relativeName.lastIndexOf("/") + 1);
      const matches =
        !pattern.absolute && pattern.basenameLiteral
          ? rawBasename === pattern.basenameLiteral
          : !pattern.absolute && pattern.basenameSuffix
            ? (options.dot || !rawBasename.startsWith(".")) &&
              rawBasename.endsWith(pattern.basenameSuffix)
            : pattern.regex.test(name);
      if (matches) {
        if (pattern.negative) {
          selected.delete(absoluteName);
        } else if (
          !effectiveIgnores.some((ignore) =>
            ignore.regex.test(ignore.absolute ? absoluteName : relativeName),
          )
        ) {
          selected.set(
            absoluteName,
            options.absolute || pattern.absolute
              ? candidate.absolutePath
              : relativeName,
          );
        }
      }
    }
  }
  return [...selected.values()];
}

function hasPositive(patterns: string[]): boolean {
  return patterns.some((pattern) => !isNegative(pattern));
}

async function glob(
  patterns: string | readonly string[],
  optionsInput: GlobOptions = {},
): Promise<string[]> {
  const options = resolveOptions(optionsInput, "glob");
  const input = assertPatterns(patterns, "glob");
  if (
    !input.length ||
    !hasPositive(input) ||
    !(await validateCwd(options.cwd))
  ) {
    return [];
  }
  const expanded = await expandPatterns(input, options);
  const prepared = preparePatterns(expanded, options);
  const ignores = preparePatterns(
    (await expandPatterns(options.ignore, options)).map((pattern) =>
      isNegative(pattern) ? pattern.slice(1) : pattern,
    ),
    options,
  );
  const pruned = pruneNames(prepared, ignores);
  const candidates = await walk(
    minimalRoots(prepared, options.cwd),
    prepared,
    options,
    pruned,
  );
  return selectMatches(candidates, prepared, ignores, options, pruned);
}

function globSync(
  patterns: string | readonly string[],
  optionsInput: GlobOptions = {},
): string[] {
  const options = resolveOptions(optionsInput, "globSync");
  const input = assertPatterns(patterns, "globSync");
  if (!input.length || !hasPositive(input) || !validateCwdSync(options.cwd)) {
    return [];
  }
  const expanded = expandPatternsSync(input, options);
  const prepared = preparePatterns(expanded, options);
  const ignores = preparePatterns(
    expandPatternsSync(options.ignore, options).map((pattern) =>
      isNegative(pattern) ? pattern.slice(1) : pattern,
    ),
    options,
  );
  const pruned = pruneNames(prepared, ignores);
  return selectMatches(
    walkSync(minimalRoots(prepared, options.cwd), prepared, options, pruned),
    prepared,
    ignores,
    options,
    pruned,
  );
}

export { type ExpandDirectories, type GlobOptions, glob, globSync, version };
