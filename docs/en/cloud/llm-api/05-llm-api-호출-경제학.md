---
title: "Managing LLM API Call Costs"
sidebar: "Managing LLM API Call Costs"
---

An LLM API charges (or uses up free quota) by the tokens sent and received. ai-gitgen was built with an eye on how many calls a run makes and how much it sends.

## Tokens and Cost

- **Input tokens**: the system prompt (format rules) + the user prompt (git status, diff). Longer diffs mean more.
- **Output tokens**: the generated commit message or PR draft, capped by `--max-tokens` (default 800).
- Cost is roughly `(input + output tokens) × model price`. Some services, like the Codyssey console, also use per-model multipliers.

## One Call per Run

`commit` and `pr` each call the API **exactly once**. Summarizing each file separately and merging is possible, but then calls grow with the number of files and the shared prompt is resent every time. So the whole diff goes in one request and the result comes back in one response.

The client counts calls and prints the number at the end:

```
[INFO] AI API calls: 1
```

With no changes it exits without calling the API, and without a key it stops before the request. **Not making useless calls at all** is the cheapest option.

## Sending Less

| Method | Effect |
|---|---|
| `--safe-mode --max-files N --max-lines N` | Cut the diff by files and lines to reduce input tokens (default 10, 200) |
| `--max-tokens` | Cap output length; too small cuts the PR body off (500~1000 recommended for PRs) |
| `--model gemini-3-flash` | Default to a cheap, fast Flash model |
| `--temperature 0.3` (default) | Follows the format well, so fewer reruns |

The size limit only applies with safe-mode. Without it, the whole diff is sent.

## Not Regenerating

If the response slightly breaks the format, it isn't re-requested automatically; it is truncated and normalized with warnings ([LLM Output Validation and Post-processing](./03-llm-출력-검증과-정규화)). Automatic regeneration might improve quality a little, but it makes the number of calls unpredictable.

The result is printed as a draft only; it doesn't run `git commit`, `git push`, or create a GitHub PR. A person reads, edits, and applies it.

## Limitations

- Because the size limit is tied to safe-mode, a big diff sent without safe-mode sends all its input tokens.
- Cutting by lines means the AI never sees later files, so they can be missing from the message.
- It shows only the number of calls, not actual token usage (the response's `usage`).

## Questions That Could Come Up in an Interview

### Q. How did you manage LLM API costs?

This checks whether you designed with call count and input size in mind.

> Each run calls the API once and prints the call count at the end. With no changes or no key, it exits before any request. In safe-mode the diff can be cut to 10 files and 200 lines, and the default model is a cheap Flash model. Format deviations are fixed by post-processing instead of re-requesting, so calls don't grow.

### Follow-up Questions

- Doesn't cutting the diff lower quality?
  → It can. Files that are cut are also missing from the message. Next time I'd always include a per-file change summary (`git diff --stat`) so the full scope is known. I haven't implemented it.
- How would you manage tokens more precisely?
  → Log real token counts from the response's `usage` field and estimate before sending, warning when it would exceed a limit.

> Source: [Codyssey-B1/B3-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B3-2)
