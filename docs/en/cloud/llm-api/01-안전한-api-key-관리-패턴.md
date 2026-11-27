---
title: "Safe API Key Management"
sidebar: "Safe API Key Management"
---

An LLM API needs an API Key. Where to keep it and how to read it was the first design decision in ai-gitgen.

## Why the Key Must Not Be in Code

```python
API_KEY = "AIza..."                 # hardcoded: stays in the repo once committed
key = os.environ.get("AI_API_KEY")  # env var: only the name is in the code
```

- **Separated from the repo**: Publishing the code doesn't publish the key. A committed key stays in history even after deletion, so it should never go in.
- **A different key per environment**: The same code uses different keys on my PC, a teammate's PC, or a server.
- **Easy to replace**: If a key leaks, revoke it at the issuer and change only the env var. The code is untouched.

## Looking Up Several Names in Order

ai-gitgen checks three env vars in a fixed order and uses the first one with a value.

```python
for env_name in ("AI_API_KEY", "GOOGLE_API_KEY", "GEMINI_API_KEY"):
    key = os.environ.get(env_name, "").strip()
    if key:
        return key
raise AIAPIError("The AI_API_KEY environment variable is not set. ...")
```

- `AI_API_KEY` is a common name that works for any provider.
- `GOOGLE_API_KEY` and `GEMINI_API_KEY` let people who already set a Google AI Studio key under those names use it as is.
- If none is set, it stops before calling the API and explains how to set one. That surfaces the cause faster than sending a request and getting a 401.

## .env Auto-loading and Priority

Typing `export` every time was tedious, so I wrote a loader that reads `.env` in the project root into env vars at startup, without `python-dotenv`.

```python
os.environ.setdefault(key, value)  # never overwrite an existing value
```

`setdefault` makes sure **a value exported in the shell always wins**. `.env` holds defaults; `export` is for one-off changes. `.env` is listed in `.gitignore` so it is never committed.

## Limitations

- Env vars can still be seen by other processes on the same machine or remain in shell history (if you typed `export AI_API_KEY=...`). They aren't a full secret store.
- `.env` is a plain-text file, so it is exposed if the machine is compromised. On a server, a cloud secret manager (e.g. AWS Secrets Manager) is better.

## Questions That Could Come Up in an Interview

### Q. How did you manage the API Key?

This checks whether you separated the key from code and chose the priority on purpose.

> The code never contains the key; it looks up `AI_API_KEY`, `GOOGLE_API_KEY`, `GEMINI_API_KEY` in that order. For convenience it also reads `.env` automatically, using `setdefault` so a shell export always takes priority. `.env` is in `.gitignore`. Without a key, it exits before calling the API and shows how to set one.

### Follow-up Questions

- What if you committed a key by mistake?
  → Even after deleting the commit it may survive in history or forks, so first revoke the key at the issuer and get a new one. Cleaning history comes after.
- Would you use `.env` as is on a server?
  → This is a local CLI, so `.env` was enough. On a server I'd use the platform's env-var settings or a secret manager. I haven't done that myself.

> Source: [Codyssey-B1/B3-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B3-2)
