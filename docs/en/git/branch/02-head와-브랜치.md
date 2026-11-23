---
title: "How HEAD and Branches Relate"
---

- In fact, a **branch** is something (a pointer) that points to a commit,
- and **HEAD** is something (a pointer) that points to a commit indirectly through such a branch.
1. **The role of a branch**
   - A branch is "one flow" for managing a project's code.
   - In practice, a branch acts as a **pointer** to "the latest commit."
   - Commits are linked linearly, so even if a branch points only to the latest commit, the entire older history can be traced.
2. **The role of HEAD**
   - HEAD is also a **pointer** to a commit, but it usually points directly to a branch.
   - In other words, the branch HEAD points to in turn points to the latest commit, so HEAD references the commit indirectly.
   - The contents of the working directory change depending on which branch HEAD points to (e.g. master, premium).
3. **Commits & switching branches**
   - When you create a new branch, it also points to the commit HEAD points to.
   - When you switch branches with `git checkout [branchname]`, HEAD moves to that branch.
   - Each branch can stack up commits independently, and each branch can have its own commit history.
   - When you commit on different branches, the commit history "branches" (diverges).
4. **Merge**
   - Combines the changes (commits) of another branch into the branch HEAD points to and creates a new commit (a merge commit).
   - A merge is the process of bringing the work of two branches together in the history.

![](/images/git/ce65eee41eda.png)

## Summary

| Item | What it points to |
| --- | --- |
| Branch | The latest commit (pointer) |
| HEAD | Usually points to a branch, and points to a commit indirectly through that branch |

> Reference: personal Notion study notes (Git study)
