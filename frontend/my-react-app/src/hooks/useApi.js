import { useRef, useCallback } from "react";

const DEFAULT_BASE =
  import.meta.env.VITE_BAKEND_URL || "http://localhost:5000/api";

export default function useApi(defaultOptions = {}) {
  const { base = DEFAULT_BASE, headers: defaultHeaders = {} } = defaultOptions;

  const abortRef = useRef(null);

  const request = useCallback(
    async (path, opts = {}) => {
      const { method = "GET", headers = {}, body, signal } = opts;

      // Build URL: allow full absolute URLs or relative paths
      const url = String(path).startsWith("http") ? path : `${base}${path}`;

      // Merge headers; caller headers override defaults
      const mergedHeaders = { ...defaultHeaders, ...headers };

      const fetchOpts = {
        method,
        headers: mergedHeaders,
        signal,
      };

      if (body !== undefined) {
        fetchOpts.body = typeof body === "string" ? body : JSON.stringify(body);
        if (!fetchOpts.headers["Content-Type"]) {
          fetchOpts.headers["Content-Type"] = "application/json";
        }
      }

      try {
        const res = await fetch(url, fetchOpts);
        const contentType = res.headers.get("content-type") || "";
        const data = contentType.includes("application/json")
          ? await res.json()
          : null;
        return { ok: res.ok, status: res.status, data };
      } catch (err) {
        if (err.name === "AbortError") {
          // aborted: don't set persistent error
          return { ok: false, status: 0, data: null };
        }
        return { ok: false, status: 0, data: null };
      } finally {
        abortRef.current = null;
      }
    },
    [base, defaultHeaders],
  );

  return { request };
}
