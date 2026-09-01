import * as codsenUtils from "codsen-utils";
import typ from "type-detect";

import { version as v } from "../package.json";

const version: string = v;

const { formatDiagnosticValue, isPlainObject, match } = codsenUtils;

type MatcherFactory = (
  patterns: string | readonly string[],
  options?: { caseSensitiveMatch?: boolean },
) => (input: string) => boolean;

// Older compatible codsen-utils releases expose match() but not the newer
// precompiled factory. Detect it through the namespace so the ESM linker can
// still load against those releases, then retain match() as the fallback.
const optionalCreateMatcher = Object.getOwnPropertyDescriptor(
  codsenUtils,
  "createMatcher",
)?.value as MatcherFactory | undefined;

// A root value accepted by the TypeScript API. Runtime checks narrow it to a
// plain object.
export type Obj = object;

// A case-insensitive type-detect label, true/false, or a blanket label. Null
// and undefined are shorthand for their corresponding labels.
export type SchemaTypeName = string | null | undefined;

export type SchemaDescriptor = SchemaTypeName | readonly SchemaTypeName[];

// A nested schema. Escape a literal dot in a key as `\.`.
export interface Schema {
  readonly [key: string]: Schema | SchemaDescriptor;
}

export interface CompletionStats {
  // Number of present array elements inspected. Sparse holes are not visited.
  arrayElementsVisited: number;
  // Deepest input or schema path reached, where root properties have depth 1.
  maxDepth: number;
  // Number of input object properties inspected.
  objectPropertiesVisited: number;
  // Number of normalized schema entries.
  schemaEntries: number;
  // Best-effort elapsed time for user-facing completion feedback.
  timeTakenInMilliseconds: number;
  // Number of values pruned by an ignore rule or a blanket schema.
  valuesIgnored: number;
  // Number of schema or reference predicates evaluated.
  valuesValidated: number;
}

export interface Opts {
  acceptArrays: boolean;
  acceptArraysIgnore: string | readonly string[];
  enforceStrictKeyset: boolean;
  ignoreKeys: string | readonly string[];
  ignorePaths: string | readonly string[];
  msg: string;
  optsVarName: string;
  reportCompletionFunc: null | ((stats: Readonly<CompletionStats>) => void);
  reportProgressFunc: null | ((percentageDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
  schema: Schema;
}

const emptyPatterns = Object.freeze([]) as readonly string[];
const emptySchema = Object.freeze({}) as Readonly<Schema>;

const canonicalDefaults: Opts = {
  acceptArrays: false,
  acceptArraysIgnore: emptyPatterns,
  enforceStrictKeyset: true,
  ignoreKeys: emptyPatterns,
  ignorePaths: emptyPatterns,
  msg: "check-types-mini",
  optsVarName: "opts",
  reportCompletionFunc: null,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
  schema: emptySchema,
};

const defaults: Readonly<Opts> = Object.freeze({ ...canonicalDefaults });

export type CheckTypesMiniThrowId =
  | "THROW_ID_01"
  | "THROW_ID_02"
  | "THROW_ID_03"
  | "THROW_ID_04"
  | "THROW_ID_05"
  | "THROW_ID_06"
  | "THROW_ID_07"
  | "THROW_ID_08"
  | "THROW_ID_09"
  | "THROW_ID_10"
  | "THROW_ID_11"
  | "THROW_ID_12"
  | "THROW_ID_13"
  | "THROW_ID_14"
  | "THROW_ID_15"
  | "THROW_ID_16"
  | "THROW_ID_17"
  | "THROW_ID_18"
  | "THROW_ID_19"
  | "THROW_ID_20"
  | "THROW_ID_21"
  | "THROW_ID_22";

export interface CheckTypesMiniErrorDetails {
  actualType?: string | null;
  context?: string;
  expectedTypes?: readonly string[] | null;
  path?: readonly string[];
}

export interface CheckTypesMiniErrorJson {
  actualType: string | null;
  context: string;
  expectedTypes: readonly string[] | null;
  message: string;
  name: "CheckTypesMiniError";
  path: readonly string[];
  reason: string;
  validatorCode: CheckTypesMiniThrowId;
}

// A validator-branded error whose fields do not require parsing its prose.
export class CheckTypesMiniError extends TypeError {
  readonly actualType: string | null;
  readonly context: string;
  readonly expectedTypes: readonly string[] | null;
  override readonly name = "CheckTypesMiniError";
  readonly path: readonly string[];
  readonly reason: string;
  readonly validatorCode: CheckTypesMiniThrowId;

  constructor(
    validatorCode: CheckTypesMiniThrowId,
    reason: string,
    details: CheckTypesMiniErrorDetails = {},
  ) {
    const context = details.context || canonicalDefaults.msg;
    super(
      `check-types-mini/checkTypesMini(): [${validatorCode}] ${context}: ${reason}`,
    );
    this.actualType = details.actualType ?? null;
    this.context = context;
    this.expectedTypes = details.expectedTypes
      ? Object.freeze(Array.from(details.expectedTypes))
      : null;
    this.path = Object.freeze(Array.from(details.path ?? emptyPatterns));
    this.reason = reason;
    this.validatorCode = validatorCode;
  }

  toJSON(): CheckTypesMiniErrorJson {
    return {
      actualType: this.actualType,
      context: this.context,
      expectedTypes: this.expectedTypes,
      message: this.message,
      name: this.name,
      path: this.path,
      reason: this.reason,
      validatorCode: this.validatorCode,
    };
  }
}

const ANY_TYPE_NAMES = new Set([
  "all",
  "any",
  "anything",
  "every",
  "everything",
  "whatever",
  "whatevs",
]);
const hasOwn = Object.prototype.hasOwnProperty;
const caseSensitiveMatchOpts = { caseSensitiveMatch: true } as const;
const keyMatcherCache = new Map<string, (input: string) => boolean>();
const pathMatcherCache = new Map<string, (input: string) => boolean>();
const MATCHER_CACHE_LIMIT = 100;
const knownOptionKeys = new Set([
  "acceptArrays",
  "acceptArraysIgnore",
  "enforceStrictKeyset",
  "ignoreKeys",
  "ignorePaths",
  "msg",
  "optsVarName",
  "reportCompletionFunc",
  "reportProgressFunc",
  "reportProgressFuncFrom",
  "reportProgressFuncTo",
  "schema",
]);

interface ResolvedOpts {
  acceptArrays: boolean;
  acceptArraysIgnore: string[];
  enforceStrictKeyset: boolean;
  ignoreKeys: string[];
  ignorePaths: string[];
  msg: string;
  optsVarName: string;
  reportCompletionFunc: null | ((stats: Readonly<CompletionStats>) => void);
  reportProgressFunc: null | ((percentageDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
  schema: Schema;
}

interface PathNode {
  depth: number;
  encoded: string;
  parent: PathNode | null;
  segment: string;
}

interface SchemaNode {
  children: Map<string, SchemaNode>;
  descriptors: string[] | null;
  implicitContainer: boolean;
}

interface ContainerFrame {
  index: number;
  keys: string[];
  path: PathNode | null;
  refValue: unknown;
  schemaNode: SchemaNode;
  value: Record<string, unknown> | unknown[];
}

interface ExitFrame {
  value: object;
}

type InputFrame = ContainerFrame | ExitFrame;

interface SchemaContainerFrame {
  index: number;
  keys: string[];
  node: SchemaNode;
  path: PathNode | null;
  value: Record<string, unknown>;
}

interface SchemaExitFrame {
  value: object;
}

type SchemaFrame = SchemaContainerFrame | SchemaExitFrame;

function newSchemaNode(): SchemaNode {
  return {
    children: new Map(),
    descriptors: null,
    implicitContainer: false,
  };
}

const emptySchemaNode = newSchemaNode();

function isContainerFrame(frame: InputFrame): frame is ContainerFrame {
  return "keys" in frame;
}

function isSchemaContainerFrame(
  frame: SchemaFrame,
): frame is SchemaContainerFrame {
  return "keys" in frame;
}

function pathSegments(path: PathNode | null): string[] {
  if (!path) return [];
  const result = new Array<string>(path.depth);
  let current: PathNode | null = path;
  while (current) {
    result[current.depth - 1] = current.segment;
    current = current.parent;
  }
  return result;
}

function diagnosticPath(optsVarName: string, path: PathNode): string {
  let result = optsVarName;
  for (const segment of pathSegments(path)) {
    if (/^(?:[A-Za-z_$][A-Za-z0-9_$]*|\d+)$/u.test(segment)) {
      result += `.${segment}`;
    } else {
      result += `[${JSON.stringify(segment)}]`;
    }
  }
  return result;
}

function encodePathSegment(segment: string): string {
  let result = "";
  for (const character of segment) {
    if (character === "%") result += "%25";
    else if (character === ".") result += "%2E";
    else if (character === "\\") result += "%5C";
    else result += character;
  }
  return result;
}

function encodedPath(path: PathNode): string {
  return path.encoded;
}

function encodePathPattern(pattern: string): string {
  let result = "";
  for (let index = 0; index < pattern.length; index++) {
    const character = pattern[index];
    if (character === "\\" && index + 1 < pattern.length) {
      const next = pattern[index + 1];
      if (next === ".") result += "%2E";
      else if (next === "%") result += "%25";
      else if (next === "\\") result += "%5C";
      else result += `\\${next}`;
      index++;
    } else if (character === "%") {
      result += "%25";
    } else {
      result += character;
    }
  }
  return result;
}

function prepareMatcher(
  patterns: readonly string[],
  paths: boolean,
): null | ((input: string) => boolean) {
  if (!patterns.length) return null;
  if (patterns.length === 1) {
    const pattern = patterns[0];
    const cache = paths ? pathMatcherCache : keyMatcherCache;
    const cached = cache.get(pattern);
    if (cached) return cached;
    const preparedPattern = paths ? encodePathPattern(pattern) : pattern;
    const matcher = optionalCreateMatcher
      ? optionalCreateMatcher(preparedPattern, caseSensitiveMatchOpts)
      : (input: string) =>
          match(input, preparedPattern, caseSensitiveMatchOpts);
    if (cache.size < MATCHER_CACHE_LIMIT) cache.set(pattern, matcher);
    return matcher;
  }
  const preparedPatterns = paths
    ? patterns.map(encodePathPattern)
    : Array.from(patterns);
  return optionalCreateMatcher
    ? optionalCreateMatcher(preparedPatterns, caseSensitiveMatchOpts)
    : (input: string) => match(input, preparedPatterns, caseSensitiveMatchOpts);
}

function parseSchemaKey(key: string): string[] {
  const result: string[] = [];
  let current = "";
  for (let index = 0; index < key.length; index++) {
    const character = key[index];
    if (character === "\\" && index + 1 < key.length) {
      current += key[index + 1];
      index++;
    } else if (character === ".") {
      result.push(current);
      current = "";
    } else {
      current += character;
    }
  }
  result.push(current);
  return result;
}

function schemaAllows(value: unknown, descriptors: readonly string[]): boolean {
  if (descriptors.some((descriptor) => ANY_TYPE_NAMES.has(descriptor))) {
    return true;
  }
  if (value === true) {
    return descriptors.includes("true") || descriptors.includes("boolean");
  }
  if (value === false) {
    return descriptors.includes("false") || descriptors.includes("boolean");
  }
  const valueType = typ(value).toLowerCase();
  if (valueType === "object" && descriptors.includes("object")) {
    return isPlainObject(value);
  }
  return descriptors.includes(valueType);
}

function schemaCanOwnChildren(descriptors: readonly string[]): boolean {
  return (
    descriptors.includes("object") &&
    !descriptors.some((descriptor) => ANY_TYPE_NAMES.has(descriptor))
  );
}

function normalizeDescriptor(value: unknown): string[] | null {
  const values = Array.isArray(value) ? value : [value];
  if (!values.length) return null;
  const result: string[] = [];
  for (let index = 0; index < values.length; index++) {
    if (!hasOwn.call(values, index)) return null;
    const entry = values[index];
    if (entry !== null && entry !== undefined && typeof entry !== "string") {
      return null;
    }
    const normalized = String(entry).toLowerCase().trim();
    if (!normalized) return null;
    if (!result.includes(normalized)) result.push(normalized);
  }
  return result;
}

function inputKeys(value: Record<string, unknown> | unknown[]): string[] {
  if (!Array.isArray(value)) return Object.keys(value);
  return Object.keys(value).filter((key) => {
    const index = Number(key);
    return (
      Number.isInteger(index) &&
      index >= 0 &&
      index < value.length &&
      String(index) === key
    );
  });
}

function canReadReference(value: unknown): value is Record<string, unknown> {
  return (
    value !== null && (typeof value === "object" || typeof value === "function")
  );
}

function callSafely<T>(callback: null | ((value: T) => void), value: T): void {
  if (!callback) return;
  try {
    callback(value);
  } catch {
    // Observability callbacks must not change validation semantics.
  }
}

function fail(
  validatorCode: CheckTypesMiniThrowId,
  reason: string,
  details: CheckTypesMiniErrorDetails = {},
): never {
  throw new CheckTypesMiniError(validatorCode, reason, details);
}

function optionValue(
  inputOpts: Record<string, unknown>,
  key: keyof Opts,
): unknown {
  return hasOwn.call(inputOpts, key) && inputOpts[key] !== undefined
    ? inputOpts[key]
    : canonicalDefaults[key];
}

function readProperty(owner: object, key: string): unknown {
  return (owner as Record<string, unknown>)[key];
}

function rootPathIsIgnored(
  key: string,
  keyMatcher: null | ((input: string) => boolean),
  pathMatcher: null | ((input: string) => boolean),
): boolean {
  return Boolean(keyMatcher?.(key) || pathMatcher?.(encodePathSegment(key)));
}

function schemaIssue(
  validatorCode: CheckTypesMiniThrowId,
  reason: string,
  path: PathNode | null,
  actualType: string | null,
  msg: string,
): never {
  return fail(validatorCode, reason, {
    actualType,
    context: msg,
    path: pathSegments(path),
  });
}

function listValue(
  value: unknown,
  fallback: readonly string[],
): string[] | null {
  if (value === undefined) return Array.from(fallback);
  const values = typeof value === "string" ? [value] : value;
  if (!Array.isArray(values)) return null;
  const result: string[] = [];
  for (let index = 0; index < values.length; index++) {
    if (!hasOwn.call(values, index) || typeof values[index] !== "string") {
      return null;
    }
    result.push(values[index]);
  }
  return result;
}

type PlainObjectInput<T extends object> = T extends
  | readonly unknown[]
  | ((...args: never[]) => unknown)
  | Date
  | RegExp
  | Map<unknown, unknown>
  | Set<unknown>
  | WeakMap<object, unknown>
  | WeakSet<object>
  | Promise<unknown>
  ? never
  : T;

// Validate a plain options object against a reference object and/or schema.
//
// Root arrays and non-plain objects are rejected at runtime. Reference keys are
// mandatory only at the root; nested reference keys remain optional. Nested
// schema containers imply a plain-object requirement. Schema leaves are
// terminal, so object, array, and blanket descriptors do not inspect their
// descendants. Flat schema and ignore paths use dots as separators; escape a
// literal dot as `\.`.
//
// With acceptArrays, a scalar schema or reference can also accept an array when
// every present top-level element satisfies the same predicate. Sparse holes
// are ignored, while an explicit undefined element is validated.
//
// Progress and completion callbacks are observational: callback errors are
// ignored. Progress is monotonic within the configured range. Completion is
// reported only after successful validation.
function checkTypesMini<TObj extends object, TRef extends object | null>(
  obj: PlainObjectInput<TObj>,
  ref: TRef extends object ? PlainObjectInput<TRef> : TRef,
  opts?: Partial<Opts> | null,
): void;
function checkTypesMini(
  ...args: [obj: object, ref: object | null, opts?: Partial<Opts> | null]
): void {
  const [obj, ref, opts] = args;

  if (!isPlainObject(obj)) {
    fail(
      "THROW_ID_01",
      `The first argument must be a plain object; received ${formatDiagnosticValue(obj, 4)}.`,
      { actualType: typ(obj).toLowerCase() },
    );
  }

  if (args.length < 2 || (ref !== null && !isPlainObject(ref))) {
    fail(
      "THROW_ID_02",
      `The second argument must be a plain object or null; received ${formatDiagnosticValue(ref, 4)}. Pass null explicitly when validating against only a schema.`,
      { actualType: typ(ref).toLowerCase() },
    );
  }

  if (opts != null && !isPlainObject(opts)) {
    fail(
      "THROW_ID_03",
      `The third argument must be a plain options object, null, or undefined; received ${formatDiagnosticValue(opts, 4)}.`,
      { actualType: typ(opts).toLowerCase() },
    );
  }

  const inputOpts = (opts ?? emptySchema) as Record<string, unknown>;
  const unknownOption = Object.keys(inputOpts).find(
    (key) => !knownOptionKeys.has(key),
  );
  if (unknownOption !== undefined) {
    fail(
      "THROW_ID_04",
      `Unknown option ${formatDiagnosticValue(unknownOption)}.`,
      { path: [unknownOption] },
    );
  }

  const ignoreKeys = listValue(
    optionValue(inputOpts, "ignoreKeys"),
    emptyPatterns,
  );
  const ignorePaths = listValue(
    optionValue(inputOpts, "ignorePaths"),
    emptyPatterns,
  );
  const acceptArraysIgnore = listValue(
    optionValue(inputOpts, "acceptArraysIgnore"),
    emptyPatterns,
  );
  if (!ignoreKeys || !ignorePaths || !acceptArraysIgnore) {
    fail(
      "THROW_ID_05",
      "opts.ignoreKeys, opts.ignorePaths, and opts.acceptArraysIgnore must each be a string or a dense array of strings.",
    );
  }

  const acceptArrays = optionValue(inputOpts, "acceptArrays");
  const enforceStrictKeyset = optionValue(inputOpts, "enforceStrictKeyset");
  if (
    typeof acceptArrays !== "boolean" ||
    typeof enforceStrictKeyset !== "boolean"
  ) {
    fail(
      "THROW_ID_06",
      "opts.acceptArrays and opts.enforceStrictKeyset must be Booleans.",
    );
  }

  const schema = optionValue(inputOpts, "schema");
  if (!isPlainObject(schema)) {
    fail(
      "THROW_ID_07",
      `opts.schema was customised to ${formatDiagnosticValue(schema)} which is not a plain object but ${typ(schema).toLowerCase()}.`,
      { actualType: typ(schema).toLowerCase(), path: ["schema"] },
    );
  }

  const msgValue = optionValue(inputOpts, "msg");
  const optsVarNameValue = optionValue(inputOpts, "optsVarName");
  if (typeof msgValue !== "string" || typeof optsVarNameValue !== "string") {
    fail("THROW_ID_08", "opts.msg and opts.optsVarName must be strings.");
  }
  let msg = (msgValue as string).trim();
  if (msg.endsWith(":")) msg = msg.slice(0, -1).trim();
  if (!msg) msg = canonicalDefaults.msg;
  const optsVarName = optsVarNameValue as string;

  const reportCompletionFunc = optionValue(inputOpts, "reportCompletionFunc");
  const reportProgressFunc = optionValue(inputOpts, "reportProgressFunc");
  if (
    (reportCompletionFunc !== null &&
      typeof reportCompletionFunc !== "function") ||
    (reportProgressFunc !== null && typeof reportProgressFunc !== "function")
  ) {
    fail(
      "THROW_ID_09",
      "opts.reportCompletionFunc and opts.reportProgressFunc must each be a function, null, or undefined.",
      { context: msg },
    );
  }

  const reportProgressFuncFrom = optionValue(
    inputOpts,
    "reportProgressFuncFrom",
  );
  const reportProgressFuncTo = optionValue(inputOpts, "reportProgressFuncTo");
  if (
    !Number.isFinite(reportProgressFuncFrom) ||
    !Number.isFinite(reportProgressFuncTo)
  ) {
    fail(
      "THROW_ID_10",
      "opts.reportProgressFuncFrom and opts.reportProgressFuncTo must be finite numbers.",
      { context: msg },
    );
  }
  if ((reportProgressFuncFrom as number) > (reportProgressFuncTo as number)) {
    fail(
      "THROW_ID_11",
      `opts.reportProgressFuncFrom cannot exceed opts.reportProgressFuncTo; received ${reportProgressFuncFrom} and ${reportProgressFuncTo}.`,
      { context: msg },
    );
  }

  const resolvedOpts: ResolvedOpts = {
    acceptArrays: acceptArrays as boolean,
    acceptArraysIgnore: acceptArraysIgnore as string[],
    enforceStrictKeyset: enforceStrictKeyset as boolean,
    ignoreKeys: ignoreKeys as string[],
    ignorePaths: ignorePaths as string[],
    msg,
    optsVarName,
    reportCompletionFunc:
      reportCompletionFunc as ResolvedOpts["reportCompletionFunc"],
    reportProgressFunc:
      reportProgressFunc as ResolvedOpts["reportProgressFunc"],
    reportProgressFuncFrom: reportProgressFuncFrom as number,
    reportProgressFuncTo: reportProgressFuncTo as number,
    schema: schema as Schema,
  };

  const observing = Boolean(
    resolvedOpts.reportCompletionFunc || resolvedOpts.reportProgressFunc,
  );
  const startedAt = resolvedOpts.reportCompletionFunc ? Date.now() : 0;
  let arrayElementsVisited = 0;
  let maxDepth = 0;
  let objectPropertiesVisited = 0;
  let schemaEntries = 0;
  let valuesIgnored = 0;
  let valuesValidated = 0;
  let work = 0;
  let lastProgress: number | undefined;

  let reportProgress: null | ((complete?: boolean) => void) = null;
  let recordWork: null | (() => void) = null;
  if (observing) {
    reportProgress = (complete = false): void => {
      if (!resolvedOpts.reportProgressFunc) return;
      const span =
        resolvedOpts.reportProgressFuncTo - resolvedOpts.reportProgressFuncFrom;
      const percentage = complete
        ? resolvedOpts.reportProgressFuncTo
        : resolvedOpts.reportProgressFuncFrom +
          span * Math.min(0.99, work / (work + 1000));
      if (percentage !== lastProgress) {
        lastProgress = percentage;
        callSafely(resolvedOpts.reportProgressFunc, percentage);
      }
    };
    recordWork = (): void => {
      work++;
      if (work % 1000 === 0) reportProgress?.();
    };
    reportProgress();
  }

  const objObject = obj as Record<string, unknown>;
  const refObject = ref as Record<string, unknown> | null;
  const schemaObject = schema as Schema & Record<string, unknown>;
  const schemaRootKeys = inputKeys(schemaObject);
  const schemaRoot = schemaRootKeys.length ? newSchemaNode() : emptySchemaNode;
  const invalidSchemaCode: CheckTypesMiniThrowId = "THROW_ID_12";
  const cyclicSchemaCode: CheckTypesMiniThrowId = "THROW_ID_13";
  const activeSchema = schemaRootKeys.length
    ? new Set<object>([schemaObject])
    : null;
  const schemaStack: SchemaFrame[] = schemaRootKeys.length
    ? [
        { value: schemaObject },
        {
          index: 0,
          keys: schemaRootKeys,
          node: schemaRoot,
          path: null,
          value: schemaObject,
        },
      ]
    : [];

  while (schemaStack.length) {
    const frame = schemaStack.pop() as SchemaFrame;
    if (!isSchemaContainerFrame(frame)) {
      activeSchema?.delete(frame.value);
      continue;
    }
    if (frame.index >= frame.keys.length) continue;

    const key = frame.keys[frame.index++];
    schemaStack.push(frame);
    const rawValue = readProperty(frame.value, key);
    const parsedSegments = parseSchemaKey(key);
    let node = frame.node;
    let currentPath = frame.path;
    for (let index = 0; index < parsedSegments.length; index++) {
      const segment = parsedSegments[index];
      let child = node.children.get(segment);
      if (!child) {
        child = newSchemaNode();
        node.children.set(segment, child);
        schemaEntries++;
        recordWork?.();
      }
      currentPath = {
        depth: (currentPath?.depth ?? 0) + 1,
        encoded: currentPath
          ? `${currentPath.encoded}.${encodePathSegment(segment)}`
          : encodePathSegment(segment),
        parent: currentPath,
        segment,
      };
      if (index < parsedSegments.length - 1) {
        if (child.descriptors && !schemaCanOwnChildren(child.descriptors)) {
          schemaIssue(
            invalidSchemaCode,
            `${diagnosticPath("schema", currentPath)} cannot have both a terminal descriptor and nested schema paths.`,
            currentPath,
            null,
            msg,
          );
        }
        child.implicitContainer = true;
      }
      if (currentPath.depth > maxDepth) maxDepth = currentPath.depth;
      node = child;
    }

    if (isPlainObject(rawValue)) {
      if (node.descriptors && !schemaCanOwnChildren(node.descriptors)) {
        schemaIssue(
          invalidSchemaCode,
          `${diagnosticPath("schema", currentPath as PathNode)} cannot have both a terminal descriptor and nested schema paths.`,
          currentPath,
          "object",
          msg,
        );
      }
      node.implicitContainer = true;
      if (activeSchema?.has(rawValue)) {
        schemaIssue(
          cyclicSchemaCode,
          `${diagnosticPath("schema", currentPath as PathNode)} contains a cycle. Cyclic schemas are not supported.`,
          currentPath,
          "object",
          msg,
        );
      }
      activeSchema?.add(rawValue);
      schemaStack.push({ value: rawValue });
      schemaStack.push({
        index: 0,
        keys: inputKeys(rawValue),
        node,
        path: currentPath,
        value: rawValue,
      });
      continue;
    }

    const descriptors = normalizeDescriptor(rawValue);
    if (!descriptors) {
      schemaIssue(
        invalidSchemaCode,
        `${diagnosticPath("schema", currentPath as PathNode)} must be a non-empty type name, null, undefined, or a dense array of those values; received ${formatDiagnosticValue(rawValue, 4)}.`,
        currentPath,
        typ(rawValue).toLowerCase(),
        msg,
      );
    }
    const normalizedDescriptors = descriptors as string[];
    if (node.descriptors) {
      schemaIssue(
        invalidSchemaCode,
        `${diagnosticPath("schema", currentPath as PathNode)} is declared more than once.`,
        currentPath,
        typ(rawValue).toLowerCase(),
        msg,
      );
    }
    if (
      (node.children.size || node.implicitContainer) &&
      !schemaCanOwnChildren(normalizedDescriptors)
    ) {
      schemaIssue(
        invalidSchemaCode,
        `${diagnosticPath("schema", currentPath as PathNode)} cannot have both a terminal descriptor and nested schema paths.`,
        currentPath,
        typ(rawValue).toLowerCase(),
        msg,
      );
    }
    node.descriptors = normalizedDescriptors;
  }

  const ignoreKeyMatcher = prepareMatcher(resolvedOpts.ignoreKeys, false);
  const ignorePathMatcher = prepareMatcher(resolvedOpts.ignorePaths, true);
  const acceptArraysIgnoreMatcher = prepareMatcher(
    resolvedOpts.acceptArraysIgnore,
    false,
  );

  const objKeys = inputKeys(objObject);
  const refKeys = refObject ? inputKeys(refObject) : emptyPatterns;

  if (
    resolvedOpts.enforceStrictKeyset &&
    !refObject &&
    schemaRoot.children.size === 0
  ) {
    fail(
      "THROW_ID_14",
      `Both ${resolvedOpts.optsVarName}.schema and reference objects are missing! We don't have anything to match the keys as requested via ${resolvedOpts.optsVarName}.enforceStrictKeyset.`,
      { context: msg },
    );
  }

  if (resolvedOpts.enforceStrictKeyset) {
    const extraKeys = objKeys.filter(
      (key) =>
        !rootPathIsIgnored(key, ignoreKeyMatcher, ignorePathMatcher) &&
        !(refObject && hasOwn.call(refObject, key)) &&
        !schemaRoot.children.has(key),
    );
    if (extraKeys.length) {
      const plural = extraKeys.length > 1;
      const reason = schemaRoot.children.size
        ? `The ${resolvedOpts.optsVarName}.enforceStrictKeyset is on and the following key${plural ? "s are" : " is"} not covered by schema and/or reference objects: ${extraKeys.join(", ")}`
        : `The input object has key${plural ? "s" : ""} which ${plural ? "are" : "is"} not covered by the reference object: ${extraKeys.join(", ")}`;
      fail("THROW_ID_15", reason, { context: msg });
    }
  }

  if (resolvedOpts.enforceStrictKeyset && refObject) {
    const missingKeys = refKeys.filter(
      (key) =>
        !hasOwn.call(objObject, key) &&
        !rootPathIsIgnored(key, ignoreKeyMatcher, ignorePathMatcher),
    );
    if (missingKeys.length) {
      const plural = missingKeys.length > 1;
      fail(
        "THROW_ID_16",
        `The reference object has key${plural ? "s" : ""} which ${plural ? "are" : "is"} not present in the input object: ${missingKeys.join(", ")}`,
        { context: msg },
      );
    }
  }

  const activeInput: object[] = [objObject];
  let activeInputSet: Set<object> | null = null;
  const stack: InputFrame[] = [
    { value: objObject },
    {
      index: 0,
      keys: objKeys,
      path: null,
      refValue: refObject,
      schemaNode: schemaRoot,
      value: objObject,
    },
  ];

  while (stack.length) {
    const frame = stack.pop() as InputFrame;
    if (!isContainerFrame(frame)) {
      activeInput.pop();
      activeInputSet?.delete(frame.value);
      if (activeInputSet && activeInput.length <= 32) activeInputSet = null;
      continue;
    }
    if (frame.index >= frame.keys.length) continue;

    const key = frame.keys[frame.index++];
    stack.push(frame);
    const path: PathNode = {
      depth: (frame.path?.depth ?? 0) + 1,
      encoded: frame.path
        ? `${frame.path.encoded}.${encodePathSegment(key)}`
        : encodePathSegment(key),
      parent: frame.path,
      segment: key,
    };
    if (observing) {
      if (Array.isArray(frame.value)) arrayElementsVisited++;
      else objectPropertiesVisited++;
      if (path.depth > maxDepth) maxDepth = path.depth;
      recordWork?.();
    }

    const value = readProperty(frame.value, key);
    const parentIsArray = Array.isArray(frame.value);
    const ignored = Boolean(
      (!parentIsArray && ignoreKeyMatcher?.(key)) ||
        ignorePathMatcher?.(encodedPath(path)),
    );
    if (ignored) {
      if (observing) valuesIgnored++;
      continue;
    }

    const schemaNode = frame.schemaNode.children.get(key);
    let schemaContainerValidated = false;
    if (schemaNode?.descriptors) {
      const descriptors = schemaNode.descriptors;
      if (descriptors.some((descriptor) => ANY_TYPE_NAMES.has(descriptor))) {
        if (observing) valuesIgnored++;
        continue;
      }
      if (observing) {
        valuesValidated++;
        recordWork?.();
      }
      if (schemaAllows(value, descriptors)) {
        if (
          (schemaNode.implicitContainer || schemaNode.children.size) &&
          isPlainObject(value)
        ) {
          schemaContainerValidated = true;
        } else {
          continue;
        }
      }

      if (
        !schemaContainerValidated &&
        resolvedOpts.acceptArrays &&
        Array.isArray(value) &&
        !acceptArraysIgnoreMatcher?.(key)
      ) {
        const elementKeys = inputKeys(value);
        for (const elementKey of elementKeys) {
          const element = readProperty(value, elementKey);
          if (observing) {
            arrayElementsVisited++;
            valuesValidated++;
            if (path.depth + 1 > maxDepth) maxDepth = path.depth + 1;
            recordWork?.();
          }
          if (!schemaAllows(element, descriptors)) {
            acceptedSchemaArrayMismatch(
              element,
              descriptors,
              path,
              Number(elementKey),
              resolvedOpts,
              msg,
            );
          }
        }
        continue;
      }
      if (!schemaContainerValidated) {
        schemaMismatch(value, descriptors, path, resolvedOpts, msg);
      }
    }

    let refPresent = false;
    let referenceValue: unknown;
    if (canReadReference(frame.refValue) && hasOwn.call(frame.refValue, key)) {
      refPresent = true;
      referenceValue = readProperty(frame.refValue, key);
    }

    let descend = false;
    const descendantReference: unknown = referenceValue;
    const descendantSchema = schemaNode ?? emptySchemaNode;

    if (
      schemaNode &&
      (schemaNode.implicitContainer || schemaNode.children.size)
    ) {
      if (!schemaContainerValidated) {
        if (observing) {
          valuesValidated++;
          recordWork?.();
        }
        if (!isPlainObject(value)) {
          schemaMismatch(value, ["object"], path, resolvedOpts, msg);
        }
      }
      descend = true;
    } else if (refPresent) {
      if (
        resolvedOpts.acceptArrays &&
        Array.isArray(value) &&
        !Array.isArray(referenceValue) &&
        !acceptArraysIgnoreMatcher?.(key)
      ) {
        const expectedType = typ(referenceValue).toLowerCase();
        const elementKeys = inputKeys(value);
        for (const elementKey of elementKeys) {
          const element = readProperty(value, elementKey);
          if (observing) {
            arrayElementsVisited++;
            valuesValidated++;
            if (path.depth + 1 > maxDepth) maxDepth = path.depth + 1;
            recordWork?.();
          }
          const elementType = typ(element).toLowerCase();
          if (elementType !== expectedType) {
            acceptedReferenceArrayMismatch(
              elementType,
              expectedType,
              path,
              Number(elementKey),
              resolvedOpts,
              msg,
            );
          }
        }
        continue;
      }

      if (observing) {
        valuesValidated++;
        recordWork?.();
      }
      if (typ(value) !== typ(referenceValue)) {
        referenceMismatch(value, referenceValue, path, resolvedOpts, msg);
      }
      if (Array.isArray(value) && Array.isArray(referenceValue)) {
        descend = true;
      } else if (isPlainObject(value)) {
        descend = true;
      }
    } else if (
      resolvedOpts.enforceStrictKeyset &&
      (!parentIsArray || isPlainObject(value) || Array.isArray(value))
    ) {
      uncoveredValue(path, resolvedOpts, msg);
    }

    if (!descend) continue;
    if (
      activeInputSet
        ? activeInputSet.has(value as object)
        : activeInput.includes(value as object)
    ) {
      cyclicInput(path, resolvedOpts, msg);
    }
    activeInput.push(value as object);
    if (activeInputSet) activeInputSet.add(value as object);
    else if (activeInput.length > 32) activeInputSet = new Set(activeInput);
    stack.push({ value: value as object });
    stack.push({
      index: 0,
      keys: inputKeys(value as Record<string, unknown> | unknown[]),
      path,
      refValue: descendantReference,
      schemaNode: descendantSchema,
      value: value as Record<string, unknown> | unknown[],
    });
  }

  reportProgress?.(true);
  callSafely(
    resolvedOpts.reportCompletionFunc,
    Object.freeze({
      arrayElementsVisited,
      maxDepth,
      objectPropertiesVisited,
      schemaEntries,
      timeTakenInMilliseconds: resolvedOpts.reportCompletionFunc
        ? Date.now() - startedAt
        : 0,
      valuesIgnored,
      valuesValidated,
    }),
  );
}

function uncoveredValue(
  path: PathNode,
  opts: ResolvedOpts,
  msg: string,
): never {
  return fail(
    "THROW_ID_17",
    `${diagnosticPath(opts.optsVarName, path)} is neither covered by reference object (second input argument), nor ${opts.optsVarName}.schema! To stop this error, turn off ${opts.optsVarName}.enforceStrictKeyset or provide a type reference.`,
    { context: msg, path: pathSegments(path) },
  );
}

function schemaMismatch(
  value: unknown,
  descriptors: readonly string[],
  path: PathNode,
  opts: ResolvedOpts,
  msg: string,
): never {
  const currentType = typ(value).toLowerCase();
  const quote = currentType === "string" ? "" : '"';
  return fail(
    "THROW_ID_18",
    `${diagnosticPath(opts.optsVarName, path)} was customised to ${quote}${formatDiagnosticValue(value)}${quote} (type: ${currentType}) which is not among the allowed types in schema (which is equal to ${formatDiagnosticValue(descriptors)})`,
    {
      actualType: currentType,
      context: msg,
      expectedTypes: descriptors,
      path: pathSegments(path),
    },
  );
}

function acceptedSchemaArrayMismatch(
  value: unknown,
  descriptors: readonly string[],
  path: PathNode,
  index: number,
  opts: ResolvedOpts,
  msg: string,
): never {
  return fail(
    "THROW_ID_19",
    `${diagnosticPath(opts.optsVarName, path)}.${index}, the ${index}th element (equal to ${formatDiagnosticValue(value)}) is of a type ${typ(value).toLowerCase()}, but only the following are allowed by the ${opts.optsVarName}.schema: ${descriptors.join(", ")}`,
    {
      actualType: typ(value).toLowerCase(),
      context: msg,
      expectedTypes: descriptors,
      path: pathSegments({
        depth: path.depth + 1,
        encoded: `${path.encoded}.${index}`,
        parent: path,
        segment: String(index),
      }),
    },
  );
}

function acceptedReferenceArrayMismatch(
  actualType: string,
  expectedType: string,
  path: PathNode,
  index: number,
  opts: ResolvedOpts,
  msg: string,
): never {
  return fail(
    "THROW_ID_20",
    `${diagnosticPath(opts.optsVarName, path)} was customised to be array, but not all of its elements are ${expectedType}-type`,
    {
      actualType,
      context: msg,
      expectedTypes: [expectedType],
      path: pathSegments({
        depth: path.depth + 1,
        encoded: `${path.encoded}.${index}`,
        parent: path,
        segment: String(index),
      }),
    },
  );
}

function referenceMismatch(
  value: unknown,
  referenceValue: unknown,
  path: PathNode,
  opts: ResolvedOpts,
  msg: string,
): never {
  const currentType = typ(value).toLowerCase();
  const compareType = typ(referenceValue).toLowerCase();
  const quote = currentType === "string" ? "" : '"';
  return fail(
    "THROW_ID_21",
    `${diagnosticPath(opts.optsVarName, path)} was customised to ${quote}${formatDiagnosticValue(value)}${quote} which is not ${compareType} but ${currentType}`,
    {
      actualType: currentType,
      context: msg,
      expectedTypes: [compareType],
      path: pathSegments(path),
    },
  );
}

function cyclicInput(path: PathNode, opts: ResolvedOpts, msg: string): never {
  return fail(
    "THROW_ID_22",
    `${diagnosticPath(opts.optsVarName, path)} contains a cycle. Cyclic input structures are not supported.`,
    { actualType: "object", context: msg, path: pathSegments(path) },
  );
}

export { checkTypesMini, defaults, version };
