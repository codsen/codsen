interface Obj {
    [key: string]: any;
}

declare const _default: {
    configs: {
        recommended: {
            plugins: string[];
            rules: {
                "no-console": string;
                "test-num/correct-test-num": string;
            };
        };
    };
    rules: {
        "correct-test-num": {
            create: (context: Obj) => Obj;
            meta: {
                type: string;
                messages: {
                    correctTestNum: string;
                };
                fixable: string;
            };
        };
    };
};

export { _default as default };
