---
title: "LLM Output Validation and Post-processing"
sidebar: "LLM Output Validation and Post-processing"
---

Even with a format given in the prompt, an LLM doesn't always follow it. ai-gitgen **doesn't trust the response as is**: it checks it against rules, fixes what it can, and reports the rest as warnings.

## Deviations That Actually Happen

- Wrapping the answer in a ```` ``` ```` code block
- A commit title that is too long
- Missing the `TITLE:` line requested for the PR title
- Variant headers like `### Why` or `## What:` instead of `## Why`
- Missing sections, or sections with no bullets

## Rules

| Target | Rule | If violated |
|---|---|---|
| Commit title | 50 chars recommended, 72 max | Over 50: warning only; over 72: truncated |
| Commit body | Use bullets (`-`) | Warning |
| PR title | `TITLE:` line, 80 max | If missing, first line becomes the title; over 80: truncated |
| PR body | `## Why` / `## What` / `## How to Test` | Variant headers normalized; missing ones warned |
| PR sections | At least one bullet each | Warning |

50 and 72 are common Git community conventions: lengths at which titles don't get cut off in one-line logs or GitHub lists.

## Processing Order

```
strip code fences
 → find the title (TITLE: line for PRs, else first line)
 → check and truncate title length
 → normalize section headers (### Why, ## What: → ## Why, ## What)
 → check required sections and bullets → warning list
 → reassemble title + body
```

Header normalization is a single regex:

```python
pattern = re.compile(rf"^#+\s*{re.escape(name)}\s*:?\s*$", re.IGNORECASE | re.MULTILINE)
body = pattern.sub(section, body)
```

It accepts any number of `#`, a trailing colon, and case differences, and unifies them into `## Why`. `TITLE:` also accepts `**TITLE**:` and the full-width colon `：`.

## Why Fix Instead of Reject

The check returns `ok`, `warnings`, and `fixed_text`. Only a completely missing title is a failure; otherwise the fixed text is shown with warnings.

- Regenerating costs **another API call**.
- Even slightly off-format output is often usable.
- The result is a **draft** anyway, and a person makes the final call. Seeing a warning (`[INFO] Validation warning: ...`), the user decides whether to rerun with different options.

## Limitations

- It only checks format. It can't tell whether the message actually matches the change.
- Truncation can cut in the middle of a word.

## Questions That Could Come Up in an Interview

### Q. How did you ensure the format of LLM responses?

This checks whether you relied only on the prompt or also validated the output.

> I gave the format in the prompt and checked again after receiving it. I strip code fences, truncate commit titles over 72 chars and PR titles over 80, and normalize variant headers like `### Why` to `## Why` with a regex. Missing sections or bullets only produce warnings. Regenerating would cost another call and the result is a draft, so I fix what can be fixed and leave the judgment to the person.

### Follow-up Questions

- Wouldn't JSON output be easier?
  → It would make the structure more certain, but this tool produces text a person reads and pastes directly, so I used a text format. I haven't tried JSON output.

> Source: [Codyssey-B1/B3-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B3-2)
