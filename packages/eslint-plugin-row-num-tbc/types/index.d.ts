interface Obj {
  [key: string]: any;
}

declare const _default: {
  configs: {
    recommended: {
      plugins: string[];
      rules: {
        "no-console": string;
        "row-num/correct-row-num": string;
      };
    };
  };
  rules: {
    "correct-row-num": {
      create: (context: Obj) => Obj;
      meta: {
        type: string;
        messages: {
          correctRowNum: string;
        };
        fixable: string;
      };
    };
  };
};

export { _default as default };
