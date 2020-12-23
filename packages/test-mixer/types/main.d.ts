import { version } from "../package.json";
declare type PlainObject = {
    [name: string]: any;
};
declare type PlainObjectOfBool = {
    [name: string]: boolean;
};
declare function mixer(ref?: PlainObject, defaultsObj?: PlainObject): PlainObjectOfBool[];
export { mixer, version };
