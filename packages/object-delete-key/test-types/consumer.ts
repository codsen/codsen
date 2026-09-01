import {
  type CompletionStats,
  type Obj,
  type ReadonlyTreeArray,
  type ReadonlyTreeObject,
  type TreeArray,
  type TreeObject,
  defaults,
  deleteKey,
} from "object-delete-key";

const readonlyObject: ReadonlyTreeObject = {
  a: [undefined, null, Number.NaN],
};
const readonlyArray: ReadonlyTreeArray = ["remove", { keep: true }];

interface NamedTree {
  readonly keep: string;
  readonly list: readonly (number | undefined)[];
  readonly nested: {
    readonly remove: boolean;
  };
}

interface NamedPattern {
  readonly remove: boolean;
}

interface RecursiveTree {
  readonly child?: RecursiveTree;
  readonly value: string;
}

type ValidUnionBranch = { readonly x: string };
type InvalidUnionBranch = Date & { readonly x: string };

const namedTree: NamedTree = {
  keep: "yes",
  list: [1, undefined],
  nested: { remove: true },
};
const namedPattern: NamedPattern = { remove: true };
declare const recursiveTree: RecursiveTree;
declare const invalidUnion: ValidUnionBranch | InvalidUnionBranch;
declare const untypedInput: any;

const objectResult: TreeObject = deleteKey(readonlyObject, { key: "a" });
const arrayResult: TreeArray = deleteKey(readonlyArray, { key: "remove" });
const legacyResult: Obj = deleteKey({ a: 1 }, { val: 1 });
const nullResult: null = deleteKey(null, { key: "unused" });
const undefinedResult: undefined = deleteKey(undefined, { key: "unused" });
const literalResult: "unchanged" = deleteKey("unchanged" as const, {
  key: "unused",
});
const namedResult = deleteKey(namedTree, { key: "remove" });
const recursiveResult = deleteKey(recursiveTree, { key: "remove" });
namedResult.keep = "changed";
namedResult.list.push(2);

deleteKey(readonlyObject, { key: "a", val: undefined });
deleteKey(readonlyObject, { key: null, val: null });
deleteKey(readonlyObject, { val: namedPattern });
deleteKey(readonlyObject, { key: "a", only: "objects" });
deleteKey(readonlyObject, {
  cleanup: undefined,
  key: "a",
  only: undefined,
  reportCompletionFunc: undefined,
  reportProgressFunc: undefined,
  reportProgressFuncFrom: undefined,
  reportProgressFuncTo: undefined,
  val: undefined,
});
deleteKey(readonlyObject, {
  key: "a",
  reportCompletionFunc(stats: Readonly<CompletionStats>) {
    const visited: number = stats.visitedEntries;
    void visited;
  },
  reportProgressFunc(percentageDone: number) {
    void percentageDone;
  },
  reportProgressFuncFrom: 20,
  reportProgressFuncTo: 80,
});

void objectResult;
void arrayResult;
void legacyResult;
void nullResult;
void undefinedResult;
void literalResult;
void namedResult;
void recursiveResult;

// @ts-expect-error The options object is required.
deleteKey(readonlyObject);
// @ts-expect-error At least one selector is required.
deleteKey(readonlyObject, {});
// @ts-expect-error Null is only an absent-key marker when val is present.
deleteKey(readonlyObject, { key: null });
// @ts-expect-error Keys must be strings or the null marker.
deleteKey(readonlyObject, { key: 1 });
// @ts-expect-error Selector patterns must be supported tree values.
deleteKey(readonlyObject, { val() {} });
// @ts-expect-error Selector patterns do not admit bigint.
deleteKey(readonlyObject, { val: 1n });
// @ts-expect-error Nested selector fields must be supported tree values.
deleteKey(readonlyObject, { val: { nested: { invalid: 1n } } });
// @ts-expect-error Input functions are not supported tree values.
deleteKey(() => undefined, { key: "x" });
// @ts-expect-error Dates are not supported tree values.
deleteKey(new Date(), { key: "x" });
// @ts-expect-error A valid union branch cannot hide an invalid tree branch.
deleteKey(invalidUnion, { key: "x" });
// @ts-expect-error Any cannot bypass the runtime tree contract.
deleteKey(untypedInput, { key: "x" });
// @ts-expect-error Only published aliases are accepted.
deleteKey(readonlyObject, { key: "a", only: "records" });
// @ts-expect-error Completion reporters must be functions or null.
deleteKey(readonlyObject, { key: "a", reportCompletionFunc: true });
// @ts-expect-error Progress range endpoints must be numbers.
deleteKey(readonlyObject, { key: "a", reportProgressFuncFrom: "0" });
// @ts-expect-error Exported defaults are read-only.
defaults.cleanup = false;
