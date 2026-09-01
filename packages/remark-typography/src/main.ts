import {
  ellipsis,
  formatDiagnosticValue,
  isPlainObject,
  multiplicationSign,
} from "codsen-utils";
import type { Nodes, Parents, Root, Text } from "mdast";
import { convertAll as convertApostrophes } from "string-apostrophes";
import { convertAll as convertDashes } from "string-dashes";
import { removeWidows } from "string-remove-widows";
import type { Plugin, Transformer } from "unified";

interface ReplacementRange {
  from: number;
  to: number;
  value: string;
  owner: Text;
}

type SourceRange = readonly [from: number, to: number, value: string];

interface PhrasingSegment {
  start: number;
  end: number;
  node: Text | null;
  apostropheWordLike: boolean;
}

interface PhrasingMap {
  value: string;
  segments: PhrasingSegment[];
  textNodes: Text[];
}

type SupportedBlock = Extract<
  Parents,
  { type: "heading" | "paragraph" | "tableCell" }
>;

interface BlockRecord {
  node: SupportedBlock;
  initialLength: number;
}

interface ProgressReporter {
  advance: (amount: number) => void;
  finish: () => void;
  preview: (absoluteWork: number) => void;
}

/** Options accepted by {@link fixTypography}. */
export interface Opts {
  /** Receives finite, strictly increasing integer percentages within the inclusive configured bounds. */
  reportProgressFunc?: false | null | ((percentageDone: number) => void);
  /** Inclusive progress lower bound; an integer from 0 through 100. */
  reportProgressFuncFrom?: number;
  /** Inclusive progress upper bound; an integer from 0 through 100. */
  reportProgressFuncTo?: number;
}

/** Plain completion statistics stored at `file.data.remarkTypography`. */
export interface RemarkTypographyCompletion {
  blocksProcessed: number;
  textNodesProcessed: number;
  charactersProcessed: number;
  textNodesChanged: number;
  replacementsApplied: number;
  apostrophesConverted: number;
  dashesConverted: number;
  ellipsesConverted: number;
  multiplicationSignsConverted: number;
  widowMeasuresAdded: number;
  timeTakenInMilliseconds: number;
}

declare module "vfile" {
  interface DataMap {
    remarkTypography?: RemarkTypographyCompletion;
  }
}

const supportedBlockTypes = new Set(["heading", "paragraph", "tableCell"]);
const allowedOptionKeys = new Set([
  "reportProgressFunc",
  "reportProgressFuncFrom",
  "reportProgressFuncTo",
]);
const quantity = /[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[A-Za-z°µμ%]+)?/y;
const quantityCharacter = /[+\-.%0-9A-Z_a-z°µμ]/;
const quantityContinuation = /[\p{ID_Continue}\p{Sc}\u200C\u200D]/u;
const htmlBreak = /^<br(?:\s[^<>]*)?\s*\/?>$/i;
const verticalWhitespace = new Set(["\n", "\v", "\f", "\r", "\u2028", "\u2029"]);

function isParent(node: Nodes): node is Parents {
  return "children" in node;
}

function isSupportedBlock(node: Nodes): node is SupportedBlock {
  return isParent(node) && supportedBlockTypes.has(node.type);
}

function appendSegment(
  parts: string[],
  segments: PhrasingSegment[],
  value: string,
  node: Text | null,
  apostropheWordLike = false,
): void {
  if (!value) {
    return;
  }
  const previous = segments[segments.length - 1];
  const start = previous ? previous.end : 0;
  parts.push(value);
  segments.push({
    start,
    end: start + value.length,
    node,
    apostropheWordLike,
  });
}

function buildPhrasingMap(block: Parents): PhrasingMap {
  const parts: string[] = [];
  const segments: PhrasingSegment[] = [];
  const textNodes: Text[] = [];
  const stack: Nodes[] = [];

  for (let index = block.children.length - 1; index >= 0; index -= 1) {
    stack.push(block.children[index]);
  }

  while (stack.length) {
    const node = stack.pop() as Nodes;

    if (node.type === "text") {
      textNodes.push(node);
      appendSegment(parts, segments, node.value, node);
    } else if (node.type === "inlineCode") {
      appendSegment(parts, segments, node.value, null, true);
    } else if (node.type === "image" || node.type === "imageReference") {
      appendSegment(parts, segments, node.alt || "", null);
    } else if (node.type === "break") {
      appendSegment(parts, segments, "\n", null);
    } else if (node.type === "html" && htmlBreak.test(node.value.trim())) {
      appendSegment(parts, segments, "\n", null);
    } else if (isParent(node)) {
      for (let index = node.children.length - 1; index >= 0; index -= 1) {
        stack.push(node.children[index]);
      }
    }
  }

  return { value: parts.join(""), segments, textNodes };
}

function apostropheContextValue(map: PhrasingMap): string {
  const parts: string[] = [];
  for (const segment of map.segments) {
    const value = map.value.slice(segment.start, segment.end);
    parts.push(segment.apostropheWordLike ? value.replace(/\S/g, "a") : value);
  }
  return parts.join("");
}

function widowContextValue(map: PhrasingMap): string {
  const parts: string[] = [];
  for (const segment of map.segments) {
    const value = map.value.slice(segment.start, segment.end);
    parts.push(segment.apostropheWordLike ? "a".repeat(value.length) : value);
  }
  return parts.join("");
}

function collectBlocks(tree: Root): BlockRecord[] {
  const blocks: BlockRecord[] = [];
  const stack: Nodes[] = [tree];

  while (stack.length) {
    const node = stack.pop() as Nodes;
    if (isSupportedBlock(node)) {
      blocks.push({ node, initialLength: buildPhrasingMap(node).value.length });
    } else if (isParent(node)) {
      for (let index = node.children.length - 1; index >= 0; index -= 1) {
        stack.push(node.children[index]);
      }
    }
  }

  return blocks;
}

function selectMutableRanges(
  ranges: readonly SourceRange[] | null,
  map: PhrasingMap,
): ReplacementRange[] {
  if (!ranges?.length || !map.segments.length) {
    return [];
  }

  const accepted: ReplacementRange[] = [];
  let segmentIndex = 0;

  for (const range of ranges) {
    const from = range[0];
    const to = range[1];

    while (
      segmentIndex < map.segments.length &&
      map.segments[segmentIndex].end <= from
    ) {
      segmentIndex += 1;
    }

    let currentSegment = segmentIndex;
    let owner: Text | null = null;
    let isMutable = true;
    while (
      currentSegment < map.segments.length &&
      map.segments[currentSegment].start < to
    ) {
      const segment = map.segments[currentSegment];
      if (segment.end > from) {
        if (!segment.node) {
          isMutable = false;
          break;
        }
        owner ||= segment.node;
      }
      currentSegment += 1;
    }

    if (isMutable && owner) {
      accepted.push({
        from,
        to,
        value: range[2],
        owner,
      });
    }
  }

  return accepted;
}

function applyRanges(map: PhrasingMap, ranges: ReplacementRange[]): void {
  if (!ranges.length) {
    return;
  }

  const pieces = new Map<Text, string[]>();
  let rangeIndex = 0;

  for (const segment of map.segments) {
    if (!segment.node) {
      continue;
    }

    const nodePieces: string[] = [];
    let cursor = segment.start;

    let currentRange = rangeIndex;
    while (
      currentRange < ranges.length &&
      ranges[currentRange].from < segment.end
    ) {
      const range = ranges[currentRange];
      const unchangedTo = Math.max(cursor, Math.min(segment.end, range.from));
      if (cursor < unchangedTo) {
        nodePieces.push(map.value.slice(cursor, unchangedTo));
      }
      if (range.owner === segment.node) {
        nodePieces.push(range.value);
      }
      cursor = Math.max(cursor, Math.min(segment.end, range.to));

      if (range.to <= segment.end) {
        currentRange += 1;
        rangeIndex = currentRange;
      } else {
        break;
      }
    }

    if (cursor < segment.end) {
      nodePieces.push(map.value.slice(cursor, segment.end));
    }
    pieces.set(segment.node, nodePieces);
  }

  for (const [node, nodePieces] of pieces) {
    node.value = nodePieces.join("");
  }
}

function exactEllipsisRanges(value: string): SourceRange[] {
  const ranges: SourceRange[] = [];
  let index = 0;

  while (index < value.length) {
    if (value[index] !== ".") {
      index += 1;
      continue;
    }
    const from = index;
    while (index < value.length && value[index] === ".") {
      index += 1;
    }
    if (index - from === 3) {
      ranges.push([from, index, ellipsis]);
    }
  }

  return ranges;
}

function isHorizontalWhitespace(character: string | undefined): boolean {
  return (
    character !== undefined &&
    !verticalWhitespace.has(character) &&
    !character.trim()
  );
}

function codePointAt(value: string, index: number): string | undefined {
  const codePoint = value.codePointAt(index);
  return codePoint === undefined ? undefined : String.fromCodePoint(codePoint);
}

function codePointBefore(value: string, index: number): string | undefined {
  if (index <= 0) {
    return undefined;
  }
  const previousCodeUnit = value.charCodeAt(index - 1);
  return previousCodeUnit >= 0xdc00 &&
    previousCodeUnit <= 0xdfff &&
    index > 1
    ? value.slice(index - 2, index)
    : value[index - 1];
}

function isQuantityContinuation(character: string | undefined): boolean {
  return character !== undefined && quantityContinuation.test(character);
}

function quantityEndsAt(value: string, end: number): boolean {
  let start = end;
  while (start > 0 && quantityCharacter.test(value[start - 1])) {
    start -= 1;
  }
  if (isQuantityContinuation(codePointBefore(value, start))) {
    return false;
  }
  quantity.lastIndex = start;
  const match = quantity.exec(value);
  return Boolean(match && match.index === start && quantity.lastIndex === end);
}

function quantityStartsAt(value: string, start: number): boolean {
  quantity.lastIndex = start;
  const match = quantity.exec(value);
  if (!match || match.index !== start) {
    return false;
  }
  const end = quantity.lastIndex;
  return (
    !isQuantityContinuation(codePointAt(value, end)) &&
    !(value[end] === "." && /\d/.test(value[end + 1] || ""))
  );
}

function multiplicationRanges(value: string): SourceRange[] {
  const ranges: SourceRange[] = [];

  for (let index = 0; index < value.length; index += 1) {
    if (value[index] !== "x" || !isHorizontalWhitespace(value[index - 1])) {
      continue;
    }

    let leftEnd = index - 1;
    while (leftEnd > 0 && isHorizontalWhitespace(value[leftEnd - 1])) {
      leftEnd -= 1;
    }
    if (!quantityEndsAt(value, leftEnd)) {
      continue;
    }

    let rightStart = index + 1;
    if (!isHorizontalWhitespace(value[rightStart])) {
      continue;
    }
    while (isHorizontalWhitespace(value[rightStart])) {
      rightStart += 1;
    }
    if (quantityStartsAt(value, rightStart)) {
      ranges.push([index, index + 1, multiplicationSign]);
    }
  }

  return ranges;
}

function isPercentage(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 100
  );
}

function resolveOptions(options: unknown): Required<Opts> {
  if (!isPlainObject(options)) {
    throw new Error(
      `remark-typography/fixTypography(): [THROW_ID_01] options must be a plain object, but they were ${formatDiagnosticValue(options, 4)}.`,
    );
  }
  for (const key of Object.keys(options)) {
    if (!allowedOptionKeys.has(key)) {
      throw new Error(
        `remark-typography/fixTypography(): [THROW_ID_02] the options object contains an unknown key "${key}".`,
      );
    }
  }

  const reportProgressFunc = options.reportProgressFunc ?? null;
  if (
    reportProgressFunc !== false &&
    reportProgressFunc !== null &&
    typeof reportProgressFunc !== "function"
  ) {
    throw new Error(
      `remark-typography/fixTypography(): [THROW_ID_03] option "reportProgressFunc" must be a function, false, or null, but it was ${formatDiagnosticValue(reportProgressFunc, 4)}.`,
    );
  }
  const reportProgressFuncFrom = options.reportProgressFuncFrom ?? 0;
  const reportProgressFuncTo = options.reportProgressFuncTo ?? 100;
  if (
    !isPercentage(reportProgressFuncFrom) ||
    !isPercentage(reportProgressFuncTo)
  ) {
    const [key, value] = !isPercentage(reportProgressFuncFrom)
      ? ["reportProgressFuncFrom", reportProgressFuncFrom]
      : ["reportProgressFuncTo", reportProgressFuncTo];
    throw new Error(
      `remark-typography/fixTypography(): [THROW_ID_04] option "${key}" must be an integer from 0 through 100, but it was ${formatDiagnosticValue(value, 4)}.`,
    );
  }
  if (reportProgressFuncFrom > reportProgressFuncTo) {
    throw new Error(
      `remark-typography/fixTypography(): [THROW_ID_05] option "reportProgressFuncFrom" (${reportProgressFuncFrom}) cannot exceed "reportProgressFuncTo" (${reportProgressFuncTo}).`,
    );
  }

  return {
    reportProgressFunc:
      typeof reportProgressFunc === "function"
        ? (reportProgressFunc as (percentageDone: number) => void)
        : false,
    reportProgressFuncFrom,
    reportProgressFuncTo,
  };
}

function createProgressReporter(
  options: Required<Opts>,
  totalWork: number,
): ProgressReporter {
  const callback = options.reportProgressFunc || null;
  const from = options.reportProgressFuncFrom;
  const to = options.reportProgressFuncTo;
  let completedWork = 0;
  let lastReported: number | undefined;

  function preview(absoluteWork: number): void {
    if (!callback) {
      return;
    }
    const ratio = Math.min(1, absoluteWork / totalWork);
    const calculated = Math.min(
      to,
      Math.floor(from + (to - from) * ratio),
    );
    const percentage = to > from ? Math.min(to - 1, calculated) : to;
    if (lastReported === undefined || percentage > lastReported) {
      lastReported = percentage;
      callback(percentage);
    }
  }

  if (callback) {
    lastReported = from;
    callback(from);
  }

  return {
    advance(amount) {
      completedWork += amount;
      preview(completedWork);
    },
    finish() {
      if (callback && to > (lastReported as number)) {
        lastReported = to;
        callback(to);
      }
    },
    preview,
  };
}

function processRanges(
  map: PhrasingMap,
  sourceRanges: readonly SourceRange[] | null,
): number {
  const ranges = selectMutableRanges(sourceRanges, map);
  applyRanges(map, ranges);
  return ranges.length;
}

/** Fix English typography in the mutable phrasing text of an MDAST tree. */
const fixTypography: Plugin<[options?: Opts], Root> = (
  originalOptions = {},
) => {
  const options = resolveOptions(originalOptions);

  const transformer: Transformer<Root> = (tree, file) => {
    const startedAt = Date.now();
    const blocks = collectBlocks(tree);
    let totalWork = 0;
    for (const block of blocks) {
      totalWork += block.initialLength * 4;
    }
    const progress = createProgressReporter(options, totalWork);
    const originalTextValues = new Map<Text, string>();
    let textNodesProcessed = 0;
    let charactersProcessed = 0;
    let apostrophesConverted = 0;
    let dashesConverted = 0;
    let ellipsesConverted = 0;
    let multiplicationSignsConverted = 0;
    let widowMeasuresAdded = 0;
    let replacementsApplied = 0;
    let completedWork = 0;

    for (const block of blocks) {
      let map = buildPhrasingMap(block.node);
      charactersProcessed += map.value.length;
      textNodesProcessed += map.textNodes.length;
      for (const node of map.textNodes) {
        originalTextValues.set(node, node.value);
      }

      let result = convertApostrophes(apostropheContextValue(map), {
        convertEntities: false,
      });
      const blockApostrophes = processRanges(
        map,
        result.ranges as readonly SourceRange[] | null,
      );
      apostrophesConverted += blockApostrophes;
      replacementsApplied += blockApostrophes;
      completedWork += block.initialLength;
      progress.advance(block.initialLength);

      map = buildPhrasingMap(block.node);
      result = convertDashes(map.value, { convertEntities: false });
      const blockDashes = processRanges(
        map,
        result.ranges as readonly SourceRange[] | null,
      );
      dashesConverted += blockDashes;
      replacementsApplied += blockDashes;
      completedWork += block.initialLength;
      progress.advance(block.initialLength);

      map = buildPhrasingMap(block.node);
      const blockEllipses = processRanges(map, exactEllipsisRanges(map.value));
      ellipsesConverted += blockEllipses;
      replacementsApplied += blockEllipses;
      map = buildPhrasingMap(block.node);
      const blockMultiplications = processRanges(
        map,
        multiplicationRanges(map.value),
      );
      multiplicationSignsConverted += blockMultiplications;
      replacementsApplied += blockMultiplications;
      completedWork += block.initialLength;
      progress.advance(block.initialLength);

      map = buildPhrasingMap(block.node);
      const workBeforeWidows = completedWork;
      const widowResult = removeWidows(map.value, {
        convertEntities: false,
        reportProgressFunc:
          options.reportProgressFunc && block.initialLength
            ? (percentage) => {
                progress.preview(
                  workBeforeWidows + (block.initialLength * percentage) / 100,
                );
              }
            : null,
        reportProgressFuncFrom: 0,
        reportProgressFuncTo: 100,
      });
      let blockWidows = processRanges(
        map,
        widowResult.ranges as readonly SourceRange[] | null,
      );
      if (!blockWidows && widowResult.ranges?.length) {
        const fallbackResult = removeWidows(widowContextValue(map), {
          convertEntities: false,
          reportProgressFunc: null,
          reportProgressFuncFrom: 0,
          reportProgressFuncTo: 100,
        });
        blockWidows = processRanges(
          map,
          fallbackResult.ranges as readonly SourceRange[] | null,
        );
      }
      widowMeasuresAdded += blockWidows;
      replacementsApplied += blockWidows;
      completedWork += block.initialLength;
      progress.advance(block.initialLength);
    }

    let textNodesChanged = 0;
    for (const [node, originalValue] of originalTextValues) {
      if (node.value !== originalValue) {
        textNodesChanged += 1;
      }
    }

    file.data.remarkTypography = {
      blocksProcessed: blocks.length,
      textNodesProcessed,
      charactersProcessed,
      textNodesChanged,
      replacementsApplied,
      apostrophesConverted,
      dashesConverted,
      ellipsesConverted,
      multiplicationSignsConverted,
      widowMeasuresAdded,
      timeTakenInMilliseconds: Date.now() - startedAt,
    };
    progress.finish();
  };

  return transformer;
};

export default fixTypography;
