---
title: "stash - Saving Work Temporarily"
sidebar: "stash"
---

## 1. Why git stash Is Needed

- While working on the current branch, you often suddenly need to move to another branch and work there.
- If you don't commit your work in progress, you can't move to another branch, and there is a risk of losing your work.

## 2. How to Use git stash

- The `git stash` command lets you safely save the changes in the current working directory temporarily.
- The temporarily saved contents are managed as a **stack**.

![](/images/git/c145faec3fe3.png)

![](/images/git/cd07cddabe32.png)

1. **Saving and restoring work temporarily**
   - Save your work temporarily:

      ```bash
      git stash
      ```

   - Check the saved entries:

      ```bash
      git stash list
      ```

   - You can safely move to another branch:

      ```bash
      git checkout branch-name
      ```

   - Restore the temporarily saved contents:

      ```bash
      git stash apply
      ```

   - After restoring, continue working and commit
2. **Summary**
   - When you need to save uncommitted work for a moment, use the `git stash` command so you don't create pointless commits.
   - It's a saving feature that is very useful in real-world work.

## 3. What If You Worked on the Wrong Branch?

- You modified code or added files on a different branch (e.g. master) instead of the branch you were supposed to work on.
- Don't panic in this case; use `git stash` to save your work temporarily.

![](/images/git/c7d4d21c809f.png)

**How to fix it**

1. **Save your work temporarily**

Save your current work onto the stack with the `git stash` command.

1. **Move to the correct branch**

Move with `git checkout [correct-branch-name]`.

1. **Restore your work**
- Check the list of saved work with `git stash list`.
- Restore the work from the stash you want with the `git stash apply stash@{n}` command. (Conflicts may occur, so resolve them yourself and save.)
1. **Commit**

After resolving conflicts, commit with `git add .` → `git commit -m "commit message"`.

1. **Manage the stash**

Delete stashes you have already applied with the `git stash drop stash@{n}` command to keep the list tidy.

When you realize you worked on the wrong branch, 

> 💡 

   **git stash** → **move to the correct branch** → **git stash apply** → **resolve conflicts & commit** → **delete the stash**

## 4. Remove Applied Work from the Stack

**1. Save work**

```bash
git stash
```

**2. View work (= look at the stack)**

```bash
git stash list
```

**3. Apply work**

```bash
git stash apply [ID of the work]
```

- If you omit the work ID, the most recent work is applied

**4. Remove work**

```bash
git stash drop [ID of the work]
```

- If you omit the work ID, the most recent work is removed

It's good practice to **drop** work from the stack once you have **applied** it.

So you can use **git stash apply** and then run **git stash drop** right after.

But actually, there's no need to go through that hassle: there is a command that applies the work and removes it from the stack at the same time.

That is the

```bash
git stash pop [ID of the work]
```

command. Using it applies a specific piece of work and removes it from the stack at the same time.

Let me show you how this command works.

### 1. Running git stash

Let's try it with a README.md file like the one in the picture below.

![](/images/git/f0d6db84dc11.png)

Let's add the test sentence "git stash pop" to the existing content.

![](/images/git/f351b57462c4.png)

Then save the file

and save the work to the stack (git stash).

![](/images/git/eb06e65e22bd.png)

If you take a quick look at the README.md file now, it is back to its original state, as in the picture below.

![](/images/git/e76c18a27bb7.png)

Remember that after you save work to the stack (git stash), the file contents return to the state before you started working (= the state at the latest commit)?

This is normal, so don't panic.

Now let's look at the work saved on the stack. If you check with the git stash list command,

![](/images/git/d723409cdb39.png)

the work we just did has been saved properly.

### 2. Running git stash pop

In this state, let's run

```bash
git stash pop
```

![](/images/git/fced44ef8a82.png)

A message is printed saying the README.md file has been changed. If you look at the README.md file again,

![](/images/git/f47954887942.png)

the work has been restored. Up to this point there's no difference from git stash apply.

But if you look into the stack again,

![](/images/git/ed7b8701d61e.png)

nothing is printed. As explained earlier, this is because git stash pop applies the work and removes it from the stack at the same time.

For reference,

```bash
git stash pop [ID of the work]
```

the git stash pop command

applies a specific piece of work and removes it from the stack if you pass [ID of the work] as an argument.

If you don't pass [ID of the work], it applies the most recent work and removes it from the stack.

To sum up,

from now on, when applying work saved on the stack to the working directory,

- use git stash apply if you will need that work again later
- use git stash pop if you won't need it again.

In general, the latter will be more common.

## Summary

| Command | What it does |
| --- | --- |
| `git stash` | Saves work temporarily on the stack |
| `git stash list` | Shows the saved list |
| `git stash apply [ID]` | Applies it (stays on the stack) |
| `git stash drop [ID]` | Deletes it from the stack |
| `git stash pop [ID]` | Applies it and deletes it from the stack |

> Reference: personal Notion study notes (Git study)
