---
title: "rebase - A Clean Commit History"
sidebar: "rebase"
---

## 1. The Situation

- While working on the **premium** branch, functions that need experimenting are worked on in a separate **test** branch.
- Simple functions are added directly on the premium branch, and code whose experiments are finished is added on the test branch and then applied to premium.

## 2. The Usual Way: git merge

- `git merge` is mostly used to combine branches.
- A merge creates **a new merge commit**.
- The commit history keeps a record of the branches splitting and joining, which can look a bit complicated.

![**git merge [branchname]**](/images/git/d20afa789073.png)

## 3. What Is rebase?

- `git rebase` means "re-placing commits."
- It changes the **base** of the branch you're on to a commit from another branch.
- It makes the commit history a clean, straight line.
- If a conflict occurs during a rebase, you resolve it yourself just like with merge, and then continue with `git rebase --continue`.

![**git rebase [branchname]**](/images/git/c3276ddb2aee.png)

## 4. merge vs. rebase

- **merge**: a merge commit where the branches join remains in the history → the traces of splitting and joining are visible.
- **rebase**: no new commit is created, and the history looks like one continuous line → clean.
- The result (the code) is the same, but the structure of the commit history differs.

![](/images/git/de8f9ee2243c.png)

![](/images/git/c22ec4c4b1a4.png)

## 5. When to merge, when to rebase?

- Use **merge** if you really need a record that the branches were combined.
- Use **rebase** if you want to keep the commit history as a neat single line.

![](/images/git/f5b21c7a133c.png)

![](/images/git/c23bef33284b.png)

## Summary

| | merge | rebase |
| --- | --- | --- |
| History | Traces of splitting and joining + a merge commit remain | One continuous line |
| When | When you need a record that the branches were combined | When you want to keep the history clean |

> Reference: personal Notion study notes (Git study)
