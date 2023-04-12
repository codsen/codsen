import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { extract } from "../dist/tsd-extract.esm.js";

test("01 - minimal", () => {
  let source =
    "declare function comb(str: string, originalOpts?: Partial<Opts>): Res;";
  equal(
    extract(source, "comb", { extractAll: true, semi: true }),
    {
      identifiers: ["declare", "function", "comb"],
      identifiersStartAt: 0,
      identifiersEndAt: 21,
      content: "(str: string, originalOpts?: Partial<Opts>): Res;",
      contentStartsAt: 21,
      contentEndsAt: 70,
      value:
        "declare function comb(str: string, originalOpts?: Partial<Opts>): Res;",
      valueStartsAt: 0,
      valueEndsAt: 70,
      error: null,
      all: ["comb"],
    },
    "01.01"
  );
  equal(
    extract(source, "comb", { extractAll: false, semi: true }),
    {
      identifiers: ["declare", "function", "comb"],
      identifiersStartAt: 0,
      identifiersEndAt: 21,
      content: "(str: string, originalOpts?: Partial<Opts>): Res;",
      contentStartsAt: 21,
      contentEndsAt: 70,
      value:
        "declare function comb(str: string, originalOpts?: Partial<Opts>): Res;",
      valueStartsAt: 0,
      valueEndsAt: 70,
      error: null,
      all: [],
    },
    "01.02"
  );
  equal(
    extract(source, "comb", { extractAll: true, semi: false }),
    {
      identifiers: ["declare", "function", "comb"],
      identifiersStartAt: 0,
      identifiersEndAt: 21,
      content: "(str: string, originalOpts?: Partial<Opts>): Res",
      contentStartsAt: 21,
      contentEndsAt: 69,
      value:
        "declare function comb(str: string, originalOpts?: Partial<Opts>): Res",
      valueStartsAt: 0,
      valueEndsAt: 69,
      error: null,
      all: ["comb"],
    },
    "01.03"
  );
  equal(
    extract(source, "comb", { extractAll: false, semi: false }),
    {
      identifiers: ["declare", "function", "comb"],
      identifiersStartAt: 0,
      identifiersEndAt: 21,
      content: "(str: string, originalOpts?: Partial<Opts>): Res",
      contentStartsAt: 21,
      contentEndsAt: 69,
      value:
        "declare function comb(str: string, originalOpts?: Partial<Opts>): Res",
      valueStartsAt: 0,
      valueEndsAt: 69,
      error: null,
      all: [],
    },
    "01.04"
  );
});

test("02 - generics - minimal", () => {
  let source = "declare function a<b>(c: d): e;";
  equal(
    extract(source, "a", { extractAll: false, semi: true }),
    {
      identifiers: ["declare", "function", "a"],
      identifiersStartAt: 0,
      identifiersEndAt: 18,
      content: "(c: d): e;",
      contentStartsAt: 21,
      contentEndsAt: 31,
      value: "declare function a<b>(c: d): e;",
      valueStartsAt: 0,
      valueEndsAt: 31,
      error: null,
      all: [],
    },
    "02.01"
  );
});

test("03 - generics - full", () => {
  let source = `declare const version: string;
interface Obj {
  [key: string]: any;
}
declare function sortAllObjectsSync(input: any): any;
declare function getKeyset<ValueType>(
  arrOfPromises: Iterable<PromiseLike<ValueType> | ValueType>,
  opts?: {
    placeholder?: boolean;
  }
): Promise<Obj>;
declare function getKeysetSync(
  arrOriginal: Obj[],
  opts?: {
    placeholder?: any;
  }
): {};
interface EnforceKeysetOpts {
  doNotFillThesePathsIfTheyContainPlaceholders: string[];
  placeholder: boolean;
  useNullAsExplicitFalse: boolean;
}
declare function enforceKeyset(
  obj: Obj,
  schemaKeyset: Obj,
  opts?: EnforceKeysetOpts
): Promise<Obj>;
declare function enforceKeysetSync(
  obj: Obj,
  schemaKeyset: Obj,
  opts?: EnforceKeysetOpts
): any;
declare function noNewKeysSync(obj: Obj, schemaKeyset: Obj): any;
declare function findUnusedSync(
  arrOriginal: any[],
  opts?: {
    placeholder?: boolean;
    comments?: string;
  }
): string[];

export {
  enforceKeyset,
  enforceKeysetSync,
  findUnusedSync,
  getKeyset,
  getKeysetSync,
  noNewKeysSync,
  sortAllObjectsSync,
  version,
};
  `;

  equal(
    extract(source, "version", { extractAll: false, semi: true }).value,
    "declare const version: string;",
    "03.01"
  );
  equal(
    extract(source, "sortAllObjectsSync", { extractAll: false, semi: true })
      .value,
    "declare function sortAllObjectsSync(input: any): any;",
    "03.02"
  );
  equal(
    extract(source, "getKeyset", { extractAll: false, semi: true }).value,
    `declare function getKeyset<ValueType>(
  arrOfPromises: Iterable<PromiseLike<ValueType> | ValueType>,
  opts?: {
    placeholder?: boolean;
  }
): Promise<Obj>;`,
    "03.03"
  );
  equal(
    extract(source, "getKeysetSync", { extractAll: false, semi: true }).value,
    `declare function getKeysetSync(
  arrOriginal: Obj[],
  opts?: {
    placeholder?: any;
  }
): {};`,
    "03.04"
  );
  equal(
    extract(source, "EnforceKeysetOpts", { extractAll: false, semi: true })
      .value,
    `interface EnforceKeysetOpts {
  doNotFillThesePathsIfTheyContainPlaceholders: string[];
  placeholder: boolean;
  useNullAsExplicitFalse: boolean;
}`,
    "03.05"
  );
  equal(
    extract(source, "enforceKeyset", { extractAll: false, semi: true }).value,
    `declare function enforceKeyset(
  obj: Obj,
  schemaKeyset: Obj,
  opts?: EnforceKeysetOpts
): Promise<Obj>;`,
    "03.06"
  );
  equal(
    extract(source, "enforceKeysetSync", { extractAll: false, semi: true })
      .value,
    `declare function enforceKeysetSync(
  obj: Obj,
  schemaKeyset: Obj,
  opts?: EnforceKeysetOpts
): any;`,
    "03.07"
  );
  equal(
    extract(source, "noNewKeysSync", { extractAll: false, semi: true }).value,
    "declare function noNewKeysSync(obj: Obj, schemaKeyset: Obj): any;",
    "03.08"
  );
  equal(
    extract(source, "findUnusedSync", { extractAll: false, semi: true }).value,
    `declare function findUnusedSync(
  arrOriginal: any[],
  opts?: {
    placeholder?: boolean;
    comments?: string;
  }
): string[];`,
    "03.09"
  );
  equal(
    extract(source, "export", { extractAll: false, semi: true }).value,
    `export {
  enforceKeyset,
  enforceKeysetSync,
  findUnusedSync,
  getKeyset,
  getKeysetSync,
  noNewKeysSync,
  sortAllObjectsSync,
  version,
};`,
    "03.10"
  );
});

test.run();
