const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
const sections = new Map([
  ["Features", "✨"],
  ["BREAKING CHANGES", "💥"],
  ["Reverts", "⏪"],
  ["Changes", "✈️"],
  ["Improvements", "🏗️"],
  ["Fixed", "🔧"],
]);

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const entities = new Map([
  ["amp", "&"],
  ["lt", "<"],
  ["gt", ">"],
  ["quot", '"'],
  ["apos", "'"],
  ["nbsp", "\u00a0"],
  ["hellip", "…"],
]);

function decode(str: string): string {
  return str.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, name: string) => {
    if (name[0] !== "#") return entities.get(name) || entity;
    const hex = name[1].toLowerCase() === "x";
    const point = Number.parseInt(name.slice(hex ? 2 : 1), hex ? 16 : 10);
    return String.fromCodePoint(
      point > 0 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff)
        ? point
        : 0xfffd,
    );
  });
}

function link(label: string, url: string): string {
  url = decode(url);
  // Relative links and the schemes used in release notes are allowed.
  // biome-ignore lint/suspicious/noControlCharactersInRegex: browsers ignore C0 controls when resolving URL schemes.
  const scheme = url.replace(/[\u0000-\u0020]/g, "");
  if (/^[\w+.-]+:/.test(scheme) && !/^(?:https?:|mailto:)/i.test(scheme)) {
    return label;
  }
  return `<a href="${escapeHtml(url).replace(/"/g, "&quot;")}">${label}</a>`;
}

function inline(str: string, depth = 0): string {
  if (depth === 16) return escapeHtml(str);
  // Code and escaped punctuation are consumed before any formatting inside them.
  const tokens =
    /(`+)|\\([!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~])|\[([^[\]\n]+)\]\(([^\s()]*(?:\([^\s()]*\)[^\s()]*)*)\)|\*\*([\s\S]+?)\*\*|\*([^*\n]+)\*|_([^_\n]+)_|<(https?:\/\/[^\s<>]+)>|https?:\/\/[^\s<>]+/g;
  let result = "";
  let end = 0;
  for (let match = tokens.exec(str); match; match = tokens.exec(str)) {
    result += escapeHtml(decode(str.slice(end, match.index)));
    if (match[1]) {
      const start = tokens.lastIndex;
      let close = str.indexOf(match[1], start);
      while (
        close !== -1 &&
        (str[close - 1] === "`" || str[close + match[1].length] === "`")
      ) {
        close = str.indexOf(match[1], close + match[1].length);
      }
      if (close === -1) {
        result += match[1];
        end = tokens.lastIndex;
        continue;
      }
      tokens.lastIndex = close + match[1].length;
      let code = str.slice(start, close).replace(/\n/g, " ");
      if (code.startsWith(" ") && code.endsWith(" ") && code.trim()) {
        code = code.slice(1, -1);
      }
      result += `<code>${escapeHtml(code)}</code>`;
    } else if (match[2]) {
      result += escapeHtml(match[2]);
    } else if (match[3]) {
      result += link(inline(match[3], depth + 1), match[4]);
    } else if (match[5]) {
      result += `<strong>${inline(match[5], depth + 1)}</strong>`;
    } else if (match[6] || match[7]) {
      // Underscores inside identifiers are literal, as in option_name_here.
      if (match[7] && /\w/.test(str[match.index - 1] || "")) {
        result += escapeHtml(match[0]);
      } else {
        result += `<em>${inline(match[6] || match[7], depth + 1)}</em>`;
      }
    } else if (match[8]) {
      result += link(escapeHtml(decode(match[8])), match[8]);
    } else {
      const url = match[0].replace(/[.,;:!?]+$/, "").replace(/\)+$/, "");
      result +=
        link(escapeHtml(decode(url)), url) +
        escapeHtml(match[0].slice(url.length));
    }
    end = tokens.lastIndex;
  }
  return result + escapeHtml(decode(str.slice(end)));
}

function heading(level: number, text: string): string {
  const release =
    /^(?:\[(\d+\.\d+\.\d+)\]\([^\s]+\)|(\d+\.\d+\.\d+))\s*\((\d{4})[-–](\d{2})[-–](\d{2})\)$/.exec(
      text,
    );
  if (level <= 3 && release) {
    const [, linked, plain, year, month, day] = release;
    const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
    if (
      date.getUTCFullYear() === Number(year) &&
      date.getUTCMonth() === Number(month) - 1 &&
      date.getUTCDate() === Number(day)
    ) {
      return `<h2>${linked || plain}</h2>\n<div class="release-date">${Number(day)} ${months[Number(month) - 1]} <span>${year}</span></div>`;
    }
  }
  const label = level === 3 && text === "Bug Fixes" ? "Fixed" : text;
  const emoji = level === 3 ? sections.get(label) : undefined;
  return `<h${level}>${emoji ? `<span class="emoji">${emoji}</span> ` : ""}${inline(label)}</h${level}>`;
}

const listItem = /^( *)([-+*]|\d+[.)]) +(.*)$/;
const fence = /^ {0,3}(`{3,}|~{3,})(\S*)\s*$/;
const blockStart =
  /^(?:#{1,6} | {0,3}(?:`{3,}|~{3,})|>|(?:[-+*]|\d+[.)]) |(?:---+|\*\*\*+)\s*$)/;

function blocks(lines: string[], tight = false, depth = 0): string {
  if (depth === 64) return escapeHtml(lines.join("\n"));
  const result: string[] = [];
  for (let i = 0; i < lines.length; ) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }
    const codeFence = fence.exec(line);
    const title = /^(#{1,6}) +(.*)$/.exec(line);
    const item = listItem.exec(line);
    if (codeFence) {
      const code: string[] = [];
      const close = new RegExp(
        `^ {0,3}${codeFence[1][0]}{${codeFence[1].length},}\\s*$`,
      );
      i += 1;
      while (i < lines.length && !close.test(lines[i])) code.push(lines[i++]);
      i += 1;
      const language = codeFence[2]
        ? ` class="language-${escapeHtml(codeFence[2]).replace(/"/g, "&quot;")}"`
        : "";
      result.push(
        `<pre><code${language}>${escapeHtml(code.join("\n"))}${code.length ? "\n" : ""}</code></pre>`,
      );
    } else if (title) {
      result.push(heading(title[1].length, title[2]));
      i += 1;
    } else if (/^(?:---+|\*\*\*+)\s*$/.test(line)) {
      result.push("<hr>");
      i += 1;
    } else if (line.startsWith(">")) {
      const quoted: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        quoted.push(lines[i++].replace(/^> ?/, ""));
      }
      result.push(
        `<blockquote>\n${blocks(quoted, false, depth + 1)}\n</blockquote>`,
      );
    } else if (item && !item[1]) {
      const ordered = /^\d/.test(item[2]);
      const items: string[][] = [];
      let loose = false;
      while (i < lines.length) {
        const next = listItem.exec(lines[i]);
        if (!next || next[1] || /^\d/.test(next[2]) !== ordered) break;
        const width = lines[i].length - next[3].length;
        const contents = [next[3]];
        i += 1;
        while (i < lines.length) {
          if (!lines[i].trim()) {
            let after = i + 1;
            while (after < lines.length && !lines[after].trim()) after += 1;
            if (after === lines.length) {
              i = after;
              break;
            }
            if (lines[after].startsWith(" ".repeat(width))) {
              contents.push("");
              loose = true;
              i = after;
              continue;
            }
            const sibling = listItem.exec(lines[after]);
            if (sibling && !sibling[1] && /^\d/.test(sibling[2]) === ordered) {
              loose = true;
              i = after;
            }
            break;
          }
          if (lines[i].startsWith(" ".repeat(width))) {
            contents.push(lines[i++].slice(width));
          } else if (blockStart.test(lines[i])) {
            break;
          } else {
            contents.push(lines[i++]);
          }
        }
        items.push(contents);
      }
      const tag = ordered ? "ol" : "ul";
      const start =
        ordered && Number.parseInt(item[2], 10) !== 1
          ? ` start="${Number.parseInt(item[2], 10)}"`
          : "";
      const rendered = items.map((contents) => {
        const body = blocks(contents, !loose, depth + 1);
        // Indent HTML, leaving the bytes inside code blocks untouched.
        return `  <li>${body.replace(/(<pre><code[^>]*>[\s\S]*?<\/code><\/pre>)|\n/g, (value, code) => code || `${value}    `)}${body.includes("\n") ? "\n  " : ""}</li>`;
      });
      result.push(`<${tag}${start}>\n${rendered.join("\n")}\n</${tag}>`);
    } else {
      const paragraph = [line];
      i += 1;
      while (
        i < lines.length &&
        lines[i].trim() &&
        !blockStart.test(lines[i])
      ) {
        paragraph.push(lines[i++]);
      }
      const content = inline(paragraph.join("\n"));
      result.push(tight ? content : `<p>${content}</p>`);
    }
  }
  return result.join("\n");
}

/**
 * Render Codsen Conventional Commits Markdown as fixed timeline HTML.
 * Supports release/section headings, paragraphs, lists, fenced code, quotes,
 * links, inline code and emphasis. This is not a general Markdown processor.
 */
export default function changelogTimeline(markdown: string): string {
  if (typeof markdown !== "string") {
    throw new TypeError(
      "remark-conventional-commit-changelog-timeline/changelogTimeline(): [THROW_ID_01] Expected a Markdown string.",
    );
  }
  const lines = markdown
    .replace(/\r\n?/g, "\n")
    .replace(/^\uFEFF/, "")
    .split("\n");
  const first = lines.findIndex((line) => line.trim());
  if (first !== -1 && /^# Change ?Log\s*$/i.test(lines[first])) {
    let start = first + 1;
    while (start < lines.length && !/^#{1,6} /.test(lines[start])) start += 1;
    lines.splice(0, start);
  }
  const html = blocks(lines);
  return html ? `\n${html}\n` : "";
}
