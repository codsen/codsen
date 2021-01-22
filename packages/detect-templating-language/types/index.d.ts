declare const version: string;
declare type Output = "Nunjucks" | "Jinja" | "JSP" | null;
declare function detectLang(str: string): {
    name: Output;
};

export { detectLang, version };
