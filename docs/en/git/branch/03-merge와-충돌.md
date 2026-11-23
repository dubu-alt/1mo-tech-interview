---
title: "Merge and Resolving Conflicts"
---

1. **The branch concept**
   - Work is split and managed in a master branch (free version) and a premium branch (paid version).
2. **Workflow**
   - A feature needed for the free version (a divide function) is added and committed on the master branch.
   - When it turns out the paid version needs the same feature, it also has to be applied to the premium branch.
3. **merge**
   - You could add the code directly on the premium branch, but with Git's merge feature you can easily bring the commit made on the master branch into the premium branch.
   - After moving to the premium branch, the `git merge master` command applies the commits from the master branch to the premium branch.
   - During a merge, a window opens for entering the merge commit message; save and exit, and the merge is complete.
4. **Result**
   - The divide function added on the master branch now also appears on the premium branch.
   - Use merge when you want to combine another branch's work into the current branch.

## Merge Conflict (How to Resolve It)

1. Open the file where the conflict occurred
2. Edit the code to look the way you want the merge result to be.
3. Try the commit again.

## Merging Several Files (How to Resolve Conflicts)

1. Resolve the conflict in each file one at a time and put them on the staging area one by one with the **git add [file name]** command,
(checking the current state with the git status command along the way)

2. or resolve the conflicts in all the files and put them on the staging area all at once with the **git add .** command,
3. then try the commit again.

## How to Cancel a Branch Merge Itself

```bash
git merge --abort
```

![](/images/git/c299a76caafe.png)

This is **a way to go back to the state before you tried the merge**, simply canceling the merge itself.

## Summary

- `git merge branch`: combine another branch's work into the current branch
- If there's a conflict: open the file → edit it to the desired state → `git add` → commit again
- `git merge --abort`: cancel the merge itself and go back to the previous state

> Reference: personal Notion study notes (Git study)
