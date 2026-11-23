---
title: "revert - Undoing a Commit You Already Pushed"
sidebar: "revert"
---

1. **When you need to undo a commit**
   - If you have already pushed a bad commit to the remote repository, you may need to undo that commit.
2. **Using the git revert command**
   - The **reset** command works locally, but it is not suitable for undoing a commit that is already on the remote.
   - In this case, use the `git revert [commit ID]` command.
   - It automatically creates "a new commit that does the opposite" of the changes that commit made.
   - After you enter a commit message and save, the original commit's changes are undone.
3. **Pushing**
   - After the revert commit is created, run `git push` again to apply it to the remote repository as well.
   - This undoes the commit's changes both locally and on the remote, but the commit history remains.
4. **Difference from reset**
   - reset removes the commit itself from history, so it can cause conflicts when you are already in sync with the remote.
   - revert creates "a new commit that undoes the change," so the history is kept safely.
5. **Cautions**
   - It's important to make a habit of always checking your commits carefully before pushing.
   - If you have already pushed, use 'revert' instead of 'reset'.

![](/images/git/fffe094442ac.png)

→ When you try git reset, HEAD in the local repo points to the previous commit, but **you cannot push in this state**

- Why? Because the remote repository has a more recent commit, Add square function.
A message appears telling you to pull and then push again

![](/images/git/e5dd97db5b99.png)

→ When you git revert, **a new commit is created in the local repo**. In other words, it is 
one step ahead of the remote repo, so **pushing causes no problem**

## Undoing Several Commits at Once (git revert)

1. **You can revert several commits at once**
   - You can select several past commits and undo them at once.
2. **Practice example**
   - After making several commits to decorate a README file, you want to undo only some of them (the commits in a certain range).
   - Identify the range you want to undo in the commit history.
3. **How to use the command**
   - Specifying a range:

      ```bash
      git revert <start commit ID>..<end commit ID>
      ```

   - Caution: the commits from the one right after `<start commit ID>` up to `<end commit ID>` are selected. The start commit is not included.
4. **Running the revert**
   - After running the command, the commit message editor appears twice, and it's recommended to save it as is (so you can tell which commits were reverted).
5. **Checking the result**
   - Check that the actual file has been reset.
   - In the commit history you can see that new revert commits have been added.
   - When you are done, apply it to the remote repository with `git push`.
6. **Applying to each branch**
   - Repeat the same steps for each branch that needs it.
7. **Summary**
   - When reverting several commits at once, always pay attention to the range format and the inclusion/exclusion rule.

## Summary

| | reset | revert |
| --- | --- | --- |
| How it works | Removes commits from history | Creates a **new commit** that undoes the change |
| Commits already pushed | Cannot push (the remote is more recent) | Can push as is |

> Reference: personal Notion study notes (Git study)
