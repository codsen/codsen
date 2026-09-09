import { setTimeout as sleep } from "node:timers/promises";

import { assertDay, validateRangeResponse } from "./npmDownloads.js";

const API = "https://api.npmjs.org/downloads";
const NOT_FOUND = Symbol("npm downloads HTTP 404");
const MAX_RETRY_DELAY_MS = 60_000;

class ResponseError extends Error {
  constructor(message, { retryable = false, retryAfter } = {}) {
    super(message);
    this.retryable = retryable;
    this.retryAfter = retryAfter;
  }
}

function retryDelay(header, attempt, now) {
  let delayMs = Math.min(1_000 * 2 ** attempt, MAX_RETRY_DELAY_MS);
  if (header) {
    const requested = /^\d+$/.test(header)
      ? Number(header) * 1_000
      : Date.parse(header) - now();
    if (!Number.isNaN(requested)) {
      if (requested > MAX_RETRY_DELAY_MS) {
        throw new Error(
          `npm requested Retry-After ${header}, exceeding the 60-second retry limit; refresh again later`,
        );
      }
      delayMs = Math.max(0, requested);
    }
  }
  return delayMs;
}

export function createNpmDownloadsClient({
  fetchImpl = fetch,
  sleepImpl = sleep,
  now = Date.now,
  retries = 3,
  timeoutMs = 30_000,
  onRetry = () => {},
} = {}) {
  if (
    [fetchImpl, sleepImpl, now, onRetry].some(
      (capability) => typeof capability !== "function",
    )
  ) {
    throw new Error("npm downloads client capabilities must be functions");
  }
  if (!Number.isInteger(retries) || retries < 0 || retries > 10) {
    throw new Error("npm downloads retries must be an integer from 0 to 10");
  }
  if (
    !Number.isInteger(timeoutMs) ||
    timeoutMs < 1 ||
    timeoutMs > 2_147_483_647
  ) {
    throw new Error("npm downloads timeout must be a positive timer interval");
  }

  async function attemptRequest(url, allow404) {
    const controller = new AbortController();
    let timer;
    try {
      return await Promise.race([
        (async () => {
          const response = await fetchImpl(url, {
            headers: { Accept: "application/json" },
            signal: controller.signal,
          });
          if (
            !response ||
            !Number.isInteger(response.status) ||
            response.status < 100 ||
            response.status > 599
          ) {
            throw new ResponseError(`Invalid HTTP response from ${url}`);
          }
          if (response.status < 200 || response.status >= 300) {
            const retryAfter = response.headers?.get("retry-after");
            // Release the connection without waiting for an error page body.
            controller.abort();
            if (response.status === 404 && allow404) {
              return NOT_FOUND;
            }
            throw new ResponseError(`npm HTTP ${response.status}: ${url}`, {
              retryable: response.status === 429 || response.status >= 500,
              retryAfter,
            });
          }
          if (typeof response.json !== "function") {
            throw new ResponseError(`Invalid JSON response from ${url}`);
          }
          try {
            return await response.json();
          } catch (error) {
            if (error instanceof SyntaxError) {
              throw new ResponseError(`Malformed JSON from ${url}`);
            }
            throw error;
          }
        })(),
        new Promise((_, reject) => {
          timer = setTimeout(() => {
            reject(
              new ResponseError(
                `npm request timed out after ${timeoutMs}ms: ${url}`,
                { retryable: true },
              ),
            );
            controller.abort();
          }, timeoutMs);
        }),
      ]);
    } finally {
      clearTimeout(timer);
    }
  }

  async function requestJson(url, allow404 = false) {
    for (let attempt = 0; ; attempt += 1) {
      try {
        return await attemptRequest(url, allow404);
      } catch (error) {
        if (
          (error instanceof ResponseError && !error.retryable) ||
          attempt >= retries
        ) {
          throw error;
        }
        const delayMs = retryDelay(error?.retryAfter, attempt, now);
        onRetry({ url, attempt: attempt + 2, delayMs, error });
        await sleepImpl(delayMs);
      }
    }
  }

  async function latestDay() {
    const payload = await requestJson(`${API}/point/last-day`);
    if (
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload) ||
      payload.start !== payload.end ||
      !Number.isSafeInteger(payload.downloads) ||
      payload.downloads < 0
    ) {
      throw new Error("npm returned an invalid latest-day watermark");
    }
    const day = assertDay(payload.end);
    const today = new Date(now()).toISOString().slice(0, 10);
    if (day >= today) {
      throw new Error(
        `npm latest-day watermark ${day} must precede current UTC day ${today}`,
      );
    }
    return day;
  }

  async function range(names, start, end) {
    if (
      !Array.isArray(names) ||
      names.length < 1 ||
      names.length > 128 ||
      new Set(names).size !== names.length ||
      names.some(
        (name) =>
          typeof name !== "string" ||
          !/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/i.test(name),
      )
    ) {
      throw new Error(
        "npm download ranges require 1 to 128 unique package names",
      );
    }
    if (names.length > 1 && names.some((name) => name.startsWith("@"))) {
      throw new Error(
        "Scoped npm packages require individual download requests",
      );
    }
    assertDay(start);
    assertDay(end);
    if (start > end) {
      throw new Error("npm download range start must not follow its end");
    }
    const url = `${API}/range/${start}:${end}/${names.map(encodeURIComponent).join(",")}`;
    const payload = await requestJson(url, names.length === 1);
    if (names.length === 1) {
      const [name] = names;
      return {
        [name]:
          payload === NOT_FOUND
            ? null
            : validateRangeResponse(name, start, end, payload),
      };
    }
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error("npm returned an invalid bulk download response");
    }
    const entries = names.map((name) => {
      if (!Object.hasOwn(payload, name)) {
        throw new Error(`npm bulk download response omitted ${name}`);
      }
      return [
        name,
        payload[name] === null
          ? null
          : validateRangeResponse(name, start, end, payload[name]),
      ];
    });
    for (const entry of entries) {
      // A bulk null is ambiguous. Only an individual HTTP 404 proves absence.
      if (entry[1] === null) {
        entry[1] = (await range([entry[0]], start, end))[entry[0]];
      }
    }
    return Object.fromEntries(entries);
  }

  return { latestDay, range };
}
