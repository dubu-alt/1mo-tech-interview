---
title: "reflog - When You Don't Know the Commit ID"
sidebar: "reflog"
---

![](/images/git/eba677f60e8c.png)

## What is git reflog (git Reference Log)?

- **git reflog** is a Git command that shows every record of where references such as HEAD and branches have moved.
- Simply put, think of it as a log that records "the history of every commit HEAD has pointed to" in chronological order.

![](/images/git/e77eb28654cc.png)

## Key Features and Uses

1. **Checking HEAD's movement history**
   - Every time HEAD moves through a commit, checkout, reset and so on, a record is left.
   - Even if you accidentally move a branch or remove a commit, you can find the old position in reflog.
2. **Recovering commits**
   - You can bring back commits that disappeared (became invisible) because of `git reset`, `git checkout`, `git commit --amend` and so on.
   - For example, you can easily go back to a commit that disappeared because of a reset.

      ```bash
      git reflog           # find the commit hash or HEAD@{n} you want in the log
      git reset --hard HEAD@{2}   # recover to that position
      ```

3. **Works even if you don't know the commit ID**
   - Even if you forget the commit hash, you can check the full movement history with reflog and go back to the point you want.

## How to Use It

1. Basic usage

   ```bash
   git reflog
   ```

   - Shows the movement history based on HEAD.
2. Recover to the point you want

   ```bash
   git reset --hard [commit ID or HEAD@{n}]
   ```

## Summary

- `git reflog`: a record of every position HEAD has pointed to
- Commits that seem to have disappeared because of reset and the like can be recovered with `git reset --hard HEAD@{n}`

> Reference: personal Notion study notes (Git study)
