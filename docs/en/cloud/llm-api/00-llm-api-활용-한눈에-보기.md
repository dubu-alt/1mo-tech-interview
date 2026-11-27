---
title: "Working with LLM APIs at a Glance (B3-2)"
sidebar: "Working with LLM APIs at a Glance"
---

In the Codyssey B3-2 mission, while building a Python CLI (`ai-gitgen`) that sends `git diff` to an LLM API to generate a commit message and a PR draft, I learned how to use an external LLM API safely and cheaply. This page gives a quick tour of the overall flow and concepts first; for details, see the article for each concept.

## What Was Built

Run `python main.py commit` or `pr`, and it collects the Git changes, sends them once to an OpenAI-compatible Chat Completions API (default: Google AI Studio Gemini), checks the returned draft, and prints it in the terminal. It uses only the standard library, and applying the commit or PR is left to the person.

## Flow of One Run

```
check API Key (env vars / .env)
 → collect git status / git diff (exit if no changes)
 → (safe-mode) mask sensitive data → limit size
 → build prompt → one API call ({base_url}/chat/completions)
 → validate and post-process output (truncate, normalize headers, warn)
 → print draft + number of calls
```

## Concepts in One Line

| Concept | One-line meaning | Details |
|---|---|---|
| Env-var key management | Read the key from env vars in priority order, never from code | [Safe API Key Management](./01-안전한-api-key-관리-패턴) |
| `.env` auto-loading | Load from a file without overwriting shell exports | [Safe API Key Management](./01-안전한-api-key-관리-패턴) |
| OpenAI-compatible endpoint | One request shape; switch providers by base URL and key | [OpenAI-Compatible Endpoints](./02-openai-호환-엔드포인트-추상화) |
| GET /models | Query the models the server supports, live | [OpenAI-Compatible Endpoints](./02-openai-호환-엔드포인트-추상화) |
| Output validation | Check the LLM response against length and section rules | [LLM Output Validation and Post-processing](./03-llm-출력-검증과-정규화) |
| Post-processing | Fix by truncating and unifying headers instead of re-requesting | [LLM Output Validation and Post-processing](./03-llm-출력-검증과-정규화) |
| Sensitive data masking | Replace keys/tokens/emails with `[MASKED:type]` before sending | [Sensitive Data Masking](./04-민감정보-마스킹-설계) |
| Mask, then cut | Order that keeps partial secrets from surviving at a cut boundary | [Sensitive Data Masking](./04-민감정보-마스킹-설계) |
| Token cost | (input + output tokens) × model price | [Managing LLM API Call Costs](./05-llm-api-호출-경제학) |
| One-call rule | Call once per run, and never make useless calls | [Managing LLM API Call Costs](./05-llm-api-호출-경제학) |

## What B3-2 Produced

| Item | Content |
|---|---|
| Modules | `git_collector` (collect), `prompts` (prompts), `ai_client` (API call), `validators` (validation), `safe_mode` (masking) |
| Commands | `commit`, `pr`, `models` |
| Connected to | Google AI Studio, Codyssey Public API Console |
| Biggest limitation | safe-mode is off by default and can't catch secrets outside its regex list. No automatic retry on transient errors |

> Source: [Codyssey-B1/B3-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B3-2)
