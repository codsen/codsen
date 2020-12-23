interface BoolValueObj {
    [key: string]: boolean;
}
interface UnknownValueObj {
    [key: string]: any;
}
declare function combinations(originalIncomingObject: UnknownValueObj, originalOverrideObject?: undefined | UnknownValueObj): BoolValueObj[];
export { combinations };
