---
title: "Merge Strategies and Resolving Conflicts"
---

This page covers the three ways to merge a PR, and how to resolve and prevent conflicts that arise during merging.

## Comparing the 3 Merge Strategies

When you press the green `Merge pull request` button on the PR screen, GitHub actually hides **3 merge methods** behind that one button. Whichever you choose, the final code is the same, but **the shape of the commit history** is completely different.

### Merge Commit

This method **keeps all the changes** from both branches and adds one new commit that represents the merge. The past commits of each branch remain as they are.

- Pros: preserves the entire history. Commit IDs don't change, so it's easy to work with
- Cons: the more branches there are, the messier the history gets

### Squash and Merge

This **squashes all of the branch's commits into one** and merges it. If there were 3 to 5 small commits, they're all bundled into 1 new commit.

- Pros: one commit = one PR = one completed feature. The history is clean
- Cons: the individual work history disappears. If several people were already working on the same branch, the commit IDs change entirely, which can cause confusion (though GitHub's own PR record remains, so you can still search it)

### Rebase and Merge

This **rebases** the current branch onto the target branch and then merges. The commits are moved, in order, on top of the target branch's latest commit, so the history stays **linear**.

- Pros: a clean, linear history
- Cons: all the related commit IDs change. If several people are working at the same time, it can cause complicated conflicts. It becomes hard to tell where each PR started and ended

### Comparison

| Method | History shape | Commit IDs | Recommended when |
|---|---|---|---|
| Merge Commit | Branch history as is + a merge commit | Don't change | When just starting out, when the project is small |
| Squash and Merge | 1 PR = 1 commit | Change | When you want to keep the history clean |
| Rebase and Merge | Fully linear | Change | When the order of the history matters |

It's recommended to start with **Merge Commit**, and once the project grows and becomes hard to manage, tidy things up with squash or rebase. Most importantly, the team should agree on one method.

## Merge Conflicts: Resolving and Preventing Them

A **conflict** occurs when two branches modify **the same part of the same file** differently. Git decides "I don't know which of the two to use" and hands the decision to a person. The conflicting part is marked with markers like this.

```
<<<<<<< HEAD
print("1mo")
=======
print("hello")
>>>>>>> test/branch1
```

### Two Ways to Resolve It

**① The Resolve conflicts button in the GitHub UI**
Pressing the button gives you 4 choices: use the current branch's content / use the incoming branch's content / use both / edit manually. After resolving, proceed with `Mark as resolved` → `Commit merge`.

**② Resolving it locally**
The GitHub UI has no IDE support, so it can be risky for complicated conflicts. In that case, it's safer to resolve it yourself locally.

```
git checkout test/branch1
git merge main
# open the conflict markers and fix them yourself
git add .
git commit
git push
```

Recent versions of VS Code have a `Resolve in Merge Editor` button that lets you compare and edit the left (incoming), right (current), and result (bottom) on one screen. It's convenient, but at its core it's the same as editing the text yourself.

### Ways to Reduce Conflicts in the First Place

- **Stay up to date**: the longer development goes on, the further you drift from the main branch. If you make a routine of regularly pulling in the latest code with `git merge`, such as every morning, conflicts drop a lot.
- **Make small PRs**: the smaller the PR, the narrower the scope of changes, so both the chance of conflicts and the difficulty of resolving them go down. (This only works if the software's structure is well divided, though.)
- **Split files into smaller pieces**: conflicts happen per file. If unrelated functions are crammed into one file, different branches each adding a function at the end of the file can easily cause "meaningless" ordering conflicts. Splitting files by purpose reduces these conflicts altogether.
- **Communicate with your colleagues**: communication matters as much as technical skill. If you split up work by priority, starting with features that aren't closely related to each other, conflicts naturally decrease.

## Summary

| Concept | One-line summary |
|---|---|
| Merge Commit | Preserves both branches' histories as they are and adds one merge commit |
| Squash and Merge | Squashes several commits into one and merges; the history becomes clean |
| Rebase and Merge | Re-places commits on top of the target and merges into a linear history |
| Merge conflict | Occurs when the same part of the same file is changed differently; resolved by editing the markers yourself |
| Minimizing conflicts | Pull the latest code often + small PRs/files + active communication |

> Source: [Codyssey-B1/B2-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B2-2)
