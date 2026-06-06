/**
 * useProblem — Problem data fetching hook
 *
 * HOW TO WIRE UP YOUR DB:
 * ─────────────────────────────────────────────────────────────────
 * Replace the TODO block below with a real fetch call, e.g.:
 *
 *   const res = await fetch(`/api/problems/${problemId}`);
 *   const data = await res.json();
 *   setProblem(data);
 *
 * The shape your API must return:
 * {
 *   id:          string | number,
 *   title:       string,
 *   difficulty:  'Easy' | 'Medium' | 'Hard',
 *   topic:       string,
 *   description: string,          // plain text / markdown
 *   examples: [
 *     { input: string, output: string, explain?: string }
 *   ],
 *   constraints: string[],
 *   starterCode: {
 *     javascript: string,
 *     python:     string,
 *     java:       string,
 *   },
 *   visibleTestCases: [           // shown to user in UI
 *     { label: string, input: string, output: string }
 *   ],
 *   // hiddenTestCases live in Judge0 — NOT returned to client
 * }
 * ─────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';

/**
 * @param {string|number|null} problemId  - pass null to keep loading
 * @returns {{ problem: object|null, loading: boolean, error: string|null }}
 */
export function useProblem(problemId) {
  // eslint-disable-next-line no-unused-vars
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (problemId == null) return; // waiting for room assignment

    setLoading(true);
    setError(null);

    // ── TODO: replace with real API call ──────────────────────────
    // Example:
    //   fetch(`/api/problems/${problemId}`)
    //     .then(r => r.json())
    //     .then(data => { setProblem(data); setLoading(false); })
    //     .catch(err => { setError(err.message); setLoading(false); });
    // ─────────────────────────────────────────────────────────────
    //
    // For now, remain in loading state — problem will be injected
    // once the DB is ready.
    //
    // Remove this comment block and the line below when wiring DB:
    setLoading(true); // keep spinner until DB is ready

  }, [problemId]);

  return { problem, loading, error };
}
