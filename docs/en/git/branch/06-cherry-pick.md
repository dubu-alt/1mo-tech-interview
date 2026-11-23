---
title: "cherry-pick - Bringing Over Only the Commits You Need"
sidebar: "cherry-pick"
---

## 1. What Is cherry-pick?

- git cherry-pick is a command that **selects specific commit(s) from another branch and applies them to the current branch**.
- Just like picking out only the cherries to eat, you can pick and bring over only the 'commits' you want.

![](/images/git/fe56b21f7287.png)

## 2. How to Use It

- Basic command

   ```bash
   git cherry-pick <commit ID>
   ```

- To bring over several commits at once

   ```bash
   git cherry-pick <commitID1> <commitID2>
   ```

   ```bash
   git cherry-pick <start commit ID>^..<end commit ID>
   ```

## 3. Characteristics and Benefits

- You can selectively apply **only the commits you need**.
- Unlike a merge, it applies **only the contents of specific commits**, not the changes of the whole branch.
- It's useful when you want to pick only the work you want from several experimental branches and add it to the main branch.

## 4. Cautions

- A cherry-picked commit remains with **a new commit ID**. (It does not bring over the original commit as is.)
- If the same file was modified, a **conflict** can occur, and you have to resolve it yourself.

## 5. Recommended Situations

- When you want to **apply only exactly the changes you need to the main branch**, such as some features or bug fixes from several branches
- When there is experimental work you don't want to merge

## Summary

- `git cherry-pick <commit ID>`: apply only a specific commit from another branch to the current branch
- The brought-over commit gets a new commit ID, and if the same file was changed, a conflict can occur

> Reference: personal Notion study notes (Git study)
