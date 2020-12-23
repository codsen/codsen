import { version } from "../package.json";
declare type NextToken = [
    key: "string",
    value: any,
    innerObj: {
        depth: number;
        path: string;
        parent: any;
        parentType: string;
    }
];
interface InnerObj {
    depth: number;
    path: string;
    topmostKey?: string;
    parent?: any;
    parentType?: string;
    next?: NextToken[];
}
declare type Callback = (key?: string, val?: any, innerObj?: InnerObj, stop?: {
    now: boolean;
}) => any;
declare function traverse(tree1: any, cb1: Callback, lookahead?: number): void;
export { traverse, version };
