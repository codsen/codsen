import { Obj } from "codsen-utils";

declare const version: string;
declare function sortAllObjectsSync(input: any): any;
declare function getKeyset(
  arrOfPromises: Iterable<PromiseLike<Obj> | Obj>,
  opts?: Partial<GetKeysetOpts>
): Promise<Obj>;
interface GetKeysetOpts {
  placeholder: any;
}
declare function getKeysetSync(arr: Obj[], opts?: Partial<GetKeysetOpts>): Obj;
interface EnforceKeysetOpts {
  doNotFillThesePathsIfTheyContainPlaceholders: string[];
  placeholder: boolean;
  useNullAsExplicitFalse: boolean;
}
declare function enforceKeyset(
  obj: Obj,
  schemaKeyset: Obj,
  opts?: Partial<EnforceKeysetOpts>
): Promise<Obj>;
declare function enforceKeysetSync(
  obj: Obj,
  schemaKeyset: Obj,
  opts?: Partial<EnforceKeysetOpts>
): Obj;
type NoNewKeysSyncRes = string[];
declare function noNewKeysSync(obj: Obj, schemaKeyset: Obj): NoNewKeysSyncRes;
interface FindUnusedSyncOpts {
  placeholder: boolean;
  comments: string;
}
declare function findUnusedSync(
  arr: any[],
  opts?: Partial<FindUnusedSyncOpts>
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
