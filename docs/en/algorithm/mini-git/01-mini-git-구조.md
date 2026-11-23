---
title: "Mini Git Structure (Commits · Branches · HEAD · Command Parsing)"
sidebar: "Mini Git Structure"
---

This page gathers the basic skeleton for building Mini Git: commits, branches and HEAD, plus the REPL and command parsing that take commands as input and run them.

## What Are Git and Commits?

**Git** = a tool that records the change history of files.
**Commit** = one "save a snapshot of this moment." It carries metadata about who saved it (author), when (timestamp) and why (message).

A commit points to its **parent commit**: "this change comes after that change."
As these parent pointers pile up, they form a **graph**.

```
[Initial commit] ← [Add login] ← [Add payment]   (arrows point child→parent)
```

This mission does not care about the file contents themselves; it only builds **this metadata graph**.

## Branches and HEAD - The "Where Am I Working Now?" Signboard

- **Branch** = a name tag that points to one commit. Used for parallel work.
- **HEAD** = "where I am standing right now." Points to the currently checked-out branch (or commit).

```
main      ──→ [c3 Add payment]
feature   ──→ [c2 Add login]
HEAD ──→ main
```

Behavior:
- `BRANCH feature`: makes feature also point to the commit HEAD is currently looking at (no copy; they share the same commit)
- `SWITCH feature`: moves only HEAD to feature
- `COMMIT`: creates a new commit, sets its parent to the current HEAD commit + updates the current branch to point to the new commit

> Implementation tip: commit lookups need to be fast, so you can use a dict for "hash → commit object" lookups.

## REPL and Command Parsing

The commit and branch structure built this way is manipulated through a REPL that takes the commands the user types and runs them.

```python
while True:
    line = input("mini-git> ")
    if line.strip().lower() in ("exit", "quit"):
        break
    tokens = smart_split(line)   # Spaces inside quotes stay in a single argument
    run(tokens)
```

Parsing caveats:
- `COMMIT "Add login feature"` → `"Add login feature"` is **a single argument, quotes and all**. A plain `.split()` will not work; you need a splitting function that recognizes quotes
- Normalize commands with `.upper()` before comparing them (case-insensitive requirement)
- Options such as `--author=Alice` and `--sort-by=date` are split into key/value at `=`

## Algorithms Used in This Assignment

The algorithms used while building Mini Git have been moved into their concept-based categories. The "Trying it in Mini Git" section at the end of each article contains the assignment-specific content as is.

| Command | Algorithm used | Article |
|------|--------------|-----|
| `LOG` | Topological sort (parent commits first) | [DAG and Topological Sort](/en/algorithm/graph/03-dag와-위상-정렬) |
| `PATH`, `ANCESTORS` | BFS shortest path, DFS ancestor search | [DFS & BFS](/en/algorithm/search/02-dfs와-bfs) |
| `LOG --sort-by` | Merge sort (`sorted()` not allowed) | [Merge Sort](/en/algorithm/sort/05-병합-정렬) |
| `SEARCH` | Inverted index | [Inverted Index](./02-역색인) |

## Summary

| Concept | Plain-language summary |
|------|-------------------|
| Commit/DAG | A record of "who did what and when" + pointers to parents with no loops |
| Branch/HEAD | A name tag pointing to a commit / my current position |
| REPL | A chat window that repeats input→run→output forever |

> Source: [Codyssey-B1/B5-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B5-2)
