declare const version: string;
declare type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
declare type JsonObject = {
    [Key in string]?: JsonValue;
};
declare type JsonArray = Array<JsonValue>;
declare function looseCompare(bigObj: JsonValue, smallObj: JsonValue): boolean | undefined;

export { looseCompare, version };
