declare const version: string;
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
