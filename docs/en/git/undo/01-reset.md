---
title: "git reset (soft · mixed · hard)"
sidebar: "reset"
---

```bash
git reset [option][commit ID]

git reset --hard HEAD^  #HEAD points to the previous commit
git reset --soft HEAD~x  #refers to the commit x steps back
For example, HEAD~2 means 2 steps before the commit HEAD currently points to
```

## The 3 Options of git reset

In Git, the `git reset` command is used to move HEAD to a past commit, and depending on the option, it affects different work areas.

Git has 3 work areas:

- Working directory
- Staging area
- Repository

### Behavior by option

| **Option** | **Repository (HEAD)** | **Staging area** | **Working directory** |
| --- | --- | --- | --- |
| **hard** | **O** | **O** | **O** |
| **mixed** | **O** | **O** | **X** |
| **soft** | **O** | **X** | **X** |

**▶ hard option:**

   - All three work areas are reset to the past commit's state
   - All changes after that commit are lost (cannot be recovered)
   - Use with care

   ![](/images/git/f333b07d2eb3.png)

**▶ mixed option:**

   - Resets only the repository (HEAD) and the staging area
   - The working directory is kept
   - Usually the default (mixed is used when no option is given)

   ![](/images/git/f7032937acde.png)

**▶ soft option:**

   - Resets only the repository (HEAD)
   - The staging area and working directory stay as they are

   ![](/images/git/e24a434e7c23.png)

### git reset at a glance

- hard → resets all areas (including the working directory)
- mixed → resets only the repository and staging area (working directory unchanged)
- soft → resets only the repository (everything else unchanged)

In general, when your work must not be lost, it's best to use the **soft** or **mixed** option, and **hard** is recommended only when truly necessary.

## How the git reset Command Works

## 1. What happens to HEAD when you git reset?

Let's assume the following situation with 4 commits in total.

![](/images/git/ed9aafce3b22.png)

The text in each box is the beginning of each commit's commit ID.

In this state, what happens if we run

> git reset [--hard or --soft or --mixed] 9033

? Recalling what we learned about git reset earlier, HEAD will point to the 9033.. commit, right? Let me show you exactly how it ends up pointing there. Whatever option you use, the result looks like the picture below.

![](/images/git/e54adcf1495c.png)

HEAD still points to the master branch. Instead, the commit that the master branch points to has changed. As a result, HEAD ends up pointing to the **9033.. commit**.

To sum up what just happened: **when you use the git reset command**

1. HEAD still points to the same branch,
2. the branch that HEAD points to now points to another specific commit,
3. and because of this, the commit HEAD indirectly pointed to also changes.

Now you know exactly what it means that the commit HEAD points to changes when you git reset, right? That's the principle behind it. And as we learned before, each option (--soft/--mixed/--hard) decides whether the working directory and staging area are also reset to match the past commit.

But there is one more secret of git reset you need to know.

## 2. git reset does not make later commits disappear.

It's easy to mistakenly think that git reset deletes the commits after it. In the situation above, you might think the **fourth commit, 43kf..**, disappears. **That's not the case at all**. The 43kf.. commit is still there.

Also, git reset isn't limited to past commits. You can also reset to a commit after the one HEAD currently points to.

- With HEAD pointing to the 3rd commit, 9033.., as it does now,

> git reset 43kf

running this makes the master branch point to the **43kf.. commit** again, as in the picture below.

![](/images/git/d451134b1620.png)

So here is what you should clearly know about git reset:

1. Resetting to a past commit never deletes the commits after it. They remain.
2. git reset works not only with past commits but also with commits after the one HEAD currently points to.

Once you are sure of these facts, you'll be able to move freely between commits with git reset.

## Combining Several Commits into One (Advanced git reset)

Specifically, if you accidentally created several unnecessary commits, 

you can use **git reset --soft** or the **--mixed** option to a point before the unneeded commits

to move HEAD (the branch's reference point) back to an earlier commit.

This keeps the working directory (your working files) at the latest state,

and if you run **git add .** and **git commit** again from there,

you can squash the unnecessary commits into one.

![](/images/git/dcda02923ea6.png)

**To sum up**

- **git reset --soft** or **-mixed** to a point before the commits you want to remove
- The working directory stays at the latest state
- Add/commit again to tidy up the commit history

This keeps the commit history clean and easier to manage!

## Summary

| Option | Repository (HEAD) | Staging area | Working directory |
| --- | --- | --- | --- |
| `--soft` | Reset | Kept | Kept |
| `--mixed` (default) | Reset | Reset | Kept |
| `--hard` | Reset | Reset | Reset (changes lost) |

- reset moves the **branch** that HEAD points to onto another commit, and later commits are not deleted

> Reference: personal Notion study notes (Git study)
