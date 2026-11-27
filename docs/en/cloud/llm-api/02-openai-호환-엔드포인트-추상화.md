---
title: "OpenAI-Compatible Endpoints"
sidebar: "OpenAI-Compatible Endpoints"
---

If every LLM provider had a different API shape, switching providers would mean changing code each time. ai-gitgen sends requests in only one shape, **OpenAI Chat Completions**, and connects to different providers by changing just the base URL and key.

## The OpenAI-Compatible Shape

Many providers and gateways expose an endpoint with the same shape as OpenAI's. So the request always looks like this:

```
POST {base_url}/chat/completions
Authorization: Bearer {API Key}

{
  "model": "gemini-3-flash",
  "temperature": 0.3,
  "max_tokens": 800,
  "messages": [
    {"role": "system", "content": "commit/PR format rules"},
    {"role": "user",   "content": "git status / diff"}
  ]
}
```

From the response it only takes `choices[0].message.content`. The request is sent with the standard library `urllib.request`, not `requests`.

## How the Base URL Is Chosen

```python
self.base_url = (base_url or os.environ.get("AI_API_BASE_URL") or DEFAULT_BASE_URL).rstrip("/")
```

Argument → env var `AI_API_BASE_URL` → default (Google AI Studio). The trailing `/` is stripped so writing `.../v1/` doesn't produce `//chat/completions`.

## How to Connect

### Google AI Studio (default)

Get a key from [Google AI Studio](https://aistudio.google.com/); no URL needs to be set.

```bash
export AI_API_KEY="AIza..."
# default: https://generativelanguage.googleapis.com/v1beta/openai
python main.py commit
```

### Codyssey Public API Console

Go to `usr.codyssey.kr/public-api-console` → **API Keys** tab → **Issue Key**, and choose **OpenAI** as the compatibility mode. The key is shown only once, so copy it right away.

```bash
export AI_API_KEY="sk-cody-live-..."
export AI_API_BASE_URL="https://copa.codyssey.kr/v1"
python main.py commit --model gemini-3-flash
```

As a gateway, one key can use Gemini, Claude, and GPT models by changing only `--model`. In testing, `gemini-3-flash` worked while `gpt-5-mini` returned HTTP 502. Models deduct tokens at different multipliers (e.g. `gemini-3-flash` 0.5x, `claude-sonnet-4` 1x), so I used a light model by default.

### Other OpenAI-Compatible APIs

In code, any OpenAI-compatible endpoint should work by changing `AI_API_BASE_URL` and the key. The two above are the only ones I actually tested.

## Checking Available Models: GET /models

A wrong model name gives `404 Model not found`. So I added `python main.py models`, which calls `GET {base_url}/models` under the same compatibility rules. It is the list the server returns right now, not a hardcoded one, so new gateway models need no code change.

## Wrapping Errors into One

Failure causes are similar regardless of provider, so all are turned into a single `AIAPIError` with different messages.

| Situation | Message |
|---|---|
| 401 | API Key is invalid |
| 429 | Rate limit exceeded, retry later |
| Other 4xx/5xx | Status code and first 500 chars of the body |
| Connection failure | Network error |
| Timeout | No response within 60 seconds |
| Unexpected shape / empty response | Show part of the raw body and exit |

## Limitations

- Even "compatible" providers can differ slightly in supported options and error formats.
- There is no automatic retry or fallback model for transient errors like 502. The user has to rerun.

## Questions That Could Come Up in an Interview

### Q. How did you support multiple LLM providers?

This checks whether you wrote separate code per provider or unified them behind one interface.

> I build requests in only the OpenAI Chat Completions shape and take the base URL and key from env vars. The default is Google AI Studio's OpenAI-compatible endpoint, and I used the Codyssey console just by changing the URL, with no code change. To reduce model-name mistakes, I added a command that lists the real models via `GET /models`.

### Follow-up Questions

- What did you do when a model returned 502?
  → There is no automatic retry, so I reran with a different `--model`. Next time I'd add exponential-backoff retries or a fallback model list.

> Source: [Codyssey-B1/B3-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B3-2)
