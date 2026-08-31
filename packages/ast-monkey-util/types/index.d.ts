declare function parent(path: string): null | string;
declare function parent(path: readonly string[]): null | string;

declare function pathNext(path: string): string;
declare function pathNext(path: readonly string[]): string[];

declare function pathPrev(path: string): null | string;
declare function pathPrev(path: readonly string[]): null | string[];

declare function pathUp(path: string): string;
declare function pathUp(path: readonly string[]): string[];

declare const version: string;

export { parent, pathNext, pathPrev, pathUp, version };
