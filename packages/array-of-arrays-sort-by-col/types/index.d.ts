declare const version: string;
/**
 * Sort array of arrays by column, rippling the sorting outwards from that column
 */
declare function sortByCol(arr: any[], axis?: number | string): any[];

export { sortByCol, version };
