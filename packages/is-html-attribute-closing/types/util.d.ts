declare function makeTheQuoteOpposite(quoteChar: string): string;
declare function ensureXIsNotPresentBeforeOneOfY(str: string, startingIdx: number, x: string, y?: string[]): boolean;
declare function xBeforeYOnTheRight(str: string, startingIdx: number, x: string, y: string): boolean;
declare function plausibleAttrStartsAtX(str: string, start: number): boolean;
declare function guaranteedAttrStartsAtX(str: string, start: number): boolean;
declare function findAttrNameCharsChunkOnTheLeft(str: string, i: number): undefined | string;
export { ensureXIsNotPresentBeforeOneOfY, xBeforeYOnTheRight, plausibleAttrStartsAtX, guaranteedAttrStartsAtX, findAttrNameCharsChunkOnTheLeft, makeTheQuoteOpposite, };
