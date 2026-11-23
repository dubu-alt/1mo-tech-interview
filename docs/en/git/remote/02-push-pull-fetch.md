---
title: "push · pull · fetch"
---

## The Roles of git push and git pull

- `git push` : a command that sends the contents of a branch in your local repository to the remote repository
- `git pull` : a command that brings the contents of a branch in the remote repository into your local repository and 
merges them

![](/images/git/eee1024ff41c.png)

![](/images/git/f0be73994976.png)

1. **Conflicts caused by simultaneous work**
   - When several developers work on the same remote branch, another developer may update its contents.
   - If something was changed on the remote before you push your own work, you can't push right away. An error occurs at this point.
2. **How to fix it**
   - In this case you must run `git pull` first to bring the latest contents from the remote into your local branch, which merges them automatically.
   - If the changes overlap, a merge conflict occurs. Open the file, edit the conflicting parts the way you want, save it, and run `git add .` and commit again.
3. **The flow up to a successful push**
   - Once you have resolved the conflict and committed, running `git push` uploads your changes to the remote repository normally.
4. **Key takeaways**
   - When collaborating, you often need to git pull before git push.
   - git pull merges the remote branch into your branch.
   - If a conflict happens, calmly resolve it, commit, and then push.

## The git fetch Command

- **git pull**
   - Fetches a branch from the remote repository and **automatically merges** it into your local branch.
   - Convenient when you want to combine them right away.
- **git fetch**
   - **Only fetches** the **branch commits** from the **remote repository** and **does not merge automatically**.
   - After fetching, you can **decide for yourself** whether to merge.
   - Use it when you want to **review or compare** the contents before merging.
- **Difference**
   - git pull: does fetch + merge in one go
   - git fetch: only fetches; you merge yourself
- **Practical example**
   - If another developer pushed broken code, running git pull right away could merge the broken code straight into yours.
   - So you can first fetch only the code with git fetch and compare the local branch with the remote branch using the **git diff** command.
   - If you find a problem, you can fix it yourself and push, or ask that developer to fix it.
- **Summary**
   - **If it's fine to merge right away**: git pull
   - **If you want to review first**: git fetch + git diff

## Summary

| Command | What it does |
| --- | --- |
| `git push` | Sends local branch contents to the remote |
| `git pull` | Fetches remote contents and **merges automatically** (fetch + merge) |
| `git fetch` | Only fetches; you decide whether to merge (after reviewing with `git diff`) |

- If the remote is more up to date, the push is rejected, so pull before you push

> Reference: personal Notion study notes (Git study)
