---
title: "ai-gitgen — AI-Powered Git Commit/PR Generator"
---

A Python CLI tool that sends the output of `git status` and `git diff` to an AI API (default: **Google AI Studio Gemini**, OpenAI-compatible Chat Completions)
to automatically generate a **commit message** and a **draft PR title/body**.

## Project Structure

```
ai-gitgen/
├── main.py           # CLI entry point (commit / pr commands)
├── git_collector.py  # collects git status / git diff
├── ai_client.py      # REST client for the AI API
├── prompts.py        # commit/PR prompt templates
├── validators.py     # output format validation and post-processing
├── safe_mode.py      # sensitive data masking + diff size limit
└── README.md
```

## Requirements

- Python 3.10 or later
- No external libraries (standard library only)
- Git must be installed, and the tool must be run from inside a Git repository

## Installation and Usage

```bash
# 1. Move to the project directory (or run it from the root of any Git repository)
cd ~/Downloads/ai-gitgen

# 2. Set the API Key (issued from Google AI Studio)
export GOOGLE_API_KEY="AIza..."

# 3. Generate a commit message
python main.py commit

# 4. Generate a PR draft
python main.py pr
```

## Setting the Environment Variable (API Key)

The API Key is managed **only through environment variables** and is never hardcoded.

Issue an API Key from [Google AI Studio](https://aistudio.google.com/) and set it as shown below.

```bash
# Option 1 (recommended): use the common environment variable
export AI_API_KEY="AIza..."

# Option 2: use a Google-specific environment variable name (detected automatically)
export GOOGLE_API_KEY="AIza..."
# or
export GEMINI_API_KEY="AIza..."

# Optional: when using another OpenAI-compatible endpoint (default is Google AI Studio)
export AI_API_BASE_URL="https://generativelanguage.googleapis.com/v1beta/openai"
```

The priority order is `AI_API_KEY` > `GOOGLE_API_KEY` > `GEMINI_API_KEY`.

### Managing It with a `.env` File (No Need to export Every Time)

If typing `export` into the shell every time is a hassle, create a `.env` file in the project root and it will be read automatically when you run `python main.py` (implemented in the project's own code, without the external `python-dotenv` library).

```bash
# .env (create in the project root; already listed in .gitignore, so it won't be committed)
AI_API_KEY=AIza...
AI_API_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai
```

```bash
# Run directly without source, and the .env values are applied automatically
python main.py commit
```

- If an environment variable has already been set in the shell with `export`, that value always wins, and `.env` values only fill in the ones that are empty.
- Never commit the `.env` file (it is already listed in `.gitignore`).

If there is no API Key, the tool prints the following guidance and exits.

```
[ERROR] The AI_API_KEY environment variable is not set.
  e.g.) export AI_API_KEY="YOUR_KEY"
  (Google AI Studio key: export GOOGLE_API_KEY="YOUR_KEY")
```

### (Alternative) Using a Codyssey Public API Console Key

Instead of getting a key directly from Google/OpenAI/Anthropic, you can also use a key issued from **Codyssey's own Public API Console** (`usr.codyssey.kr/public-api-console`) as is. This console provides an OpenAI-compatible Chat Completions endpoint, so you only need to change environment variables, with no changes to the `ai-gitgen` code.

1. Log in to Codyssey, go to the `public-api-console` page → **API Keys** tab → click **Issue Key**
2. Under **API compatibility mode**, select **OpenAI** and issue the key (the key value is shown only once, so copy it immediately and store it somewhere safe)
3. Set the environment variables as shown below

```bash
export AI_API_KEY="sk-cody-live-..."                       # the issued key
export AI_API_BASE_URL="https://copa.codyssey.kr/v1"       # Codyssey Public API Base URL

# Example available models: gemini-3-flash, gemini-3.1-pro, claude-haiku-4, claude-sonnet-4, gpt-5-mini, etc.
python main.py commit --model gemini-3-flash
python main.py pr --model gemini-3-flash --safe-mode
```

- You can check your remaining free quota with "Remaining tokens" at the top of the console. Each model deducts tokens at a different multiplier (e.g. `gemini-3-flash` 0.5x, `claude-sonnet-4` 1x), so use low-weight models first if you want to save cost.
- Verified in actual use: `gpt-5-mini` returned a provider error (HTTP 502) at the time of testing, while `gemini-3-flash` worked normally. If you get a 502/503 error from a specific model, retry with a different model.
- Manage this key **only through environment variables**, just like a regular API Key, and never hardcode it in the code or in `.env.example`.

## CLI Options

| Option | Default | Description |
|---|---|---|
| `--model` | `gemini-3-flash` | AI model name to use |
| `--temperature` | `0.3` | Generation diversity (0.0~2.0). Lower gives more consistent results |
| `--max-tokens` | `800` | Maximum number of tokens to generate |
| `--safe-mode` | off | Enables sensitive data masking + diff size limit |
| `--max-files` | `10` | Maximum number of files to send in safe-mode |
| `--max-lines` | `200` | Maximum number of diff lines to send in safe-mode |

### Listing Available Models (`models` Command)

If digging through the docs every time to find out what you can pass to `--model` is a hassle, you can query the list of models your current API Key supports right away. It works even outside a Git repository, and since it asks the API server (`GET /models`) in real time instead of using a hardcoded list, it always shows the latest state.

```bash
python main.py models
```

```
--- Available models (use as is with the --model option) ---
  gemini-3-flash           (google)
  gemini-3.1-flash-lite    (google)
  gemini-3.1-pro           (google)
  claude-haiku-4           (anthropic)
  claude-sonnet-4          (anthropic)
  gpt-5-mini               (openai)
  claude-opus-4-7          (anthropic)
  claude-opus-4-8          (anthropic)
  gpt-5.5                  (openai)
  gpt-5.4                  (openai)
  gpt-5.4-mini             (openai)
----------------------------------------
```

> This is especially useful with gateway-style endpoints like the Codyssey Public API Console. You don't have to check the console's documentation page every time, and it prevents you from hitting a `404 Model not found` error by passing a model name that isn't on the list.

### How Parameters Affect Output Quality

- **temperature**: low (0.x) gives consistent text that follows the format well; high is more creative but can break the format. A low value is recommended for commit/PR generation.
- **max_tokens**: if too small, the body gets cut off midway. PR bodies are longer than commit messages, so 500~1000 is recommended.
- **model**: stronger models understand context and follow the format better, but cost more.

## Usage Examples

### Generating a Commit Message

```bash
python main.py commit --temperature 0.2
```

Example output:

```
[INFO] Git status collected: 3 changed files detected
[INFO] Git diff collected: 128 lines
[INFO] Current branch: feature/commit-pr-generator
[INFO] Requesting AI API...
[DONE] Commit message generated

--- Commit Message ---
feat: Add automatic commit message generation based on Git changes

- git_collector.py: collect git diff output and pass it to the AI as input context
- prompts.py: apply commit message template rules (feat/fix, etc.)
- main.py: improve guidance message and error handling when the API Key is not set
----------------------

[INFO] AI API calls: 1
[INFO] The result is a draft. Review it before applying.
```

### Generating a PR Draft

```bash
python main.py pr --safe-mode
```

Example output:

```
[DONE] PR draft generated

--- PR Title ---
feat: Add automatic commit/PR generation

--- PR Body ---
## Why
- Writing commit messages and PR descriptions took time during team collaboration, so an automatic generation tool was needed.
- The goal was to improve review efficiency by generating consistently formatted summaries based on Git changes.

## What
- git_collector.py: add logic that collects git status and git diff output and passes it to the AI as input context
- main.py: implement CLI commands for automatic commit message generation (commit) and PR draft generation (pr)
- safe_mode.py: add sensitive data masking and diff size limiting

## How to Test
- Set the environment variable: export AI_API_KEY="YOUR_KEY"
- Generate a commit message: python main.py commit
- Generate a PR draft: python main.py pr
- Check that the printed PR body follows the Why/What/How to Test structure and the length rules
-----------------
```

### Output in Other Situations

When there are no changes:

```
[INFO] No changes found. Exiting without generating anything.
```

Network error:

```
[ERROR] AI API call failed: Network error: Unable to connect to the API server.
```

## Output Format Validation Rules

Generated results are validated against the rules below, and post-processed (truncated/sections normalized) if they violate them.

- Commit title: 50 characters or fewer recommended (max 72; truncated if longer)
- PR title: max 80 characters (truncated if longer)
- PR body: the section headers `## Why` / `## What` / `## How to Test` are required + at least 1 bullet in each section
- Validation warnings are shown as `[INFO] Validation warning: ...`, so adjust the options and rerun if needed.

## Caveats (Operational Perspective)

### Protecting Sensitive Data (safe-mode)

`git diff` may contain an API Key, password, or personal information (such as an email address) that was added by mistake.
With the `--safe-mode` option:

1. **Masking**: API Keys (`sk-...`, `ghp_...`, `AKIA...`, `xox...`, `AIza...`), JWTs, Bearer tokens, email addresses, and `.env`-style `KEY=VALUE` secrets are found with regular expressions and replaced with `[MASKED:...]` before sending
2. **Size limit**: only up to 10 files / up to 200 lines are sent (adjust with `--max-files`, `--max-lines`)

The rule is to remove sensitive data before committing in the first place; safe-mode is a safety net against mistakes.

### Cost / Request Limits

- The `commit` / `pr` commands each work with **a single AI API call**, and print the number of calls at the end of the run.
- To reduce unnecessary reruns, cut the amount sent with `--max-lines` and use a Flash-family model on a free/low-cost tier such as `gemini-3-flash`.

### Using the Generated Results

- The generated commit/PR text is a **draft**, not the final answer. Always have a person review it before applying it.
- Automatic push to a remote repository (`git push`, creating a PR via the GitHub API) was intentionally not implemented.

> Source: [Codyssey-B1/B3-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B3-2)
