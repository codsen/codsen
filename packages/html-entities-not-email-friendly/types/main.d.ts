interface Obj {
    [key: string]: any;
}
declare const notEmailFriendly: Obj;
declare const notEmailFriendlySetOnly: Set<string>;
declare const notEmailFriendlyLowercaseSetOnly: Set<string>;
declare const notEmailFriendlyMinLength = 2;
declare const notEmailFriendlyMaxLength = 31;
export { notEmailFriendly, notEmailFriendlySetOnly, notEmailFriendlyLowercaseSetOnly, notEmailFriendlyMinLength, notEmailFriendlyMaxLength, };
