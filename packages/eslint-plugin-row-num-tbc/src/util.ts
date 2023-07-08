import stringifySafe from "json-stringify-safe";
import { deleteKey } from "object-delete-key";

// declare let DEV: boolean;

interface Obj {
  [key: string]: any;
}

export const stringify = (obj: Obj) => {
  // return stringifySafe(obj, null, 4);
  return JSON.stringify(
    deleteKey(
      deleteKey(JSON.parse(stringifySafe(obj)), {
        key: "parent",
      }),
      {
        key: "loc",
      },
    ),
    null,
    4,
  );
};
