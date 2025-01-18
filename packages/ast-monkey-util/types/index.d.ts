declare function pathNext(str: string): string;

declare function pathPrev(str: string): null | string;

declare function pathUp(str: string): string;

declare function parentItem(str: string): null | string;

declare const version: string;

export { parentItem as parent, pathNext, pathPrev, pathUp, version };
