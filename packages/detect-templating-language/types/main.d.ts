import { version } from "../package.json";
declare type Output = "Nunjucks" | "Jinja" | "JSP" | null;
declare function detectLang(str: string): {
    name: Output;
};
export { detectLang, version };
