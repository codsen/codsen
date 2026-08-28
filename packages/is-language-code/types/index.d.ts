declare const version: string;
type Res =
  | {
      res: true;
      message: null;
    }
  | {
      res: false;
      message: string;
    };
declare function isLangCode(str: string): Res;

export { isLangCode, version };
