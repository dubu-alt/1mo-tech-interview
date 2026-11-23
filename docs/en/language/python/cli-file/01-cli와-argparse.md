---
title: "Console Programs and the CLI (argparse)"
sidebar: "CLI and argparse"
---

## What Is a Console Program?

Unlike programs you click with a mouse (GUI), these are programs you use **by typing text (commands)**.

- Windows: `Command Prompt` or `PowerShell`
- Mac: `Terminal`

The budget book we are going to build is used like this:

```
python -m budget_app add      ← means "run the add command"
python -m budget_app list     ← "show me the list"
```

## The CLI and Command Parsing (argparse)

For a program to understand commands typed like this, it needs parsing.

**Parsing** = splitting the text the user typed into meaningful pieces and understanding it.

```
python -m budget_app list --limit 3 --data-dir ./mydata
       └module name┘ └cmd┘ └option─┘ └───option────┘
```

Python has a tool called **`argparse`** (standard library) that does this splitting for you.

```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("command")                      # commands like add, list
parser.add_argument("--limit", type=int, default=10) # the --limit option (default 10)
args = parser.parse_args()
print(args.command, args.limit)
```

- argparse **creates the `--help` option for you** (requirement met!)
- Why the requirements say to write options consistently with `--` (two dashes): it's the standard convention in the Linux world

## Summary

| Concept | Summary |
| --- | --- |
| Console program | A program you use with text commands instead of clicks (GUI) |
| CLI/argparse | A receptionist that takes text commands and splits them up |

> Source: [Codyssey-B1/B2-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B2-1)
