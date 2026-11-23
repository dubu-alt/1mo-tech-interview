---
title: "Merge in Depth (Fast-forward · 3-way)"
sidebar: "Merge in Depth"
---

Let's go a bit deeper into **merge**. Earlier we said that a merge creates a new commit.

And we said that a commit created by a merge is called a **merge commit**.

![](/images/git/d0526db7c86e.png)

In this image, you can see that **the premium branch was merged into the master branch**, creating the black merge commit.

But a merge doesn't always create a new commit like this.

Look at the image below.

![](/images/git/ca3166d12e08.png)

Let's say we're on the master branch, since HEAD points to the master branch. In this state, what happens if we run

> git merge premium

?

This is what happens.

![](/images/git/faeb2070fe87.png)

The master branch now points to the same commit the premium branch was pointing to. The total number of commits stays the same, right?

A merge like this, where no new commit is created and the branch simply moves, is called a **Fast-forward merge**. Fast-forward means to **fast-forward** a video or sound (wind it forward). The way the master branch moves to a newer commit really does look like fast-forwarding, doesn't it?

When does this happen?

A Fast-forward merge happens when you merge branches that are on the same line in the commit history. Just now, the master branch and the premium branch were both on the same line, right? That's exactly this case.

But as in the image we saw at the very beginning,

![](/images/git/d3ddeef3e8d4.png)

when two branches each sit on two separate lines in the commit history, merging them creates a new merge commit.

And this kind of merge is called a **3-way merge**. **It is called 3-way because it merges by considering the three commits marked 1, 2, and 3.** They are:

- (1): the commit that is the common ancestor before the split into two
- (2): the commit one branch points to
- (3): the commit the other branch points to

**A 3-way merge has its own method and automatically creates a merge commit based on these three commits.**

Let me briefly explain that method. The table below summarizes the results of merging the master branch and the premium branch in various situations.

| **Case** | **base** | **master** | **premium** |  | **Merge result** |
| --- | --- | --- | --- | --- | --- |
| **case1** | **A** | **A** | **B** | **->** | **B** |
| **case2** | **1** | **2** | **1** | **->** | **2** |
| **case3** | **"hello"** | **(empty)** | **"hello"** | **->** | **(empty)** |
| **case4** | **"bye"** | **"fighting"** | **"please"** | **->** | **Conflict!** |

Let me explain each column. Assume every commit has a sample.txt file.

1. **base** : part of the contents of sample.txt in the common parent commit of the two branches = (1) in the image above
2. **master** : part of the contents of sample.txt in the latest commit of the master branch = (2) in the image above
3. **premium** : part of the contents of sample.txt on the premium branch = (3) in the image above
4. **Merge result** : the final result of merging the premium branch into the master branch

Now let me explain why each case produces the merge result shown in the table.

**case1**

The base is A, master is A, and premium is B, right? So compared with the base, nothing changed in master, but in premium, A was changed to B. **A 3-way merge gives priority to whatever changed from the base.** So the merge result is 'B'.

**case2**

The base is 1, master is 2, and premium is 1, right? In this case too, 2, which changed from the base, becomes the merge result.

**case3**

The base is "hello", master is empty because "hello" was deleted, and premium is "hello". Deleting "hello" to leave it empty is the change from the base, so the merge result is empty.

**case4**

The base is "bye", master is "fighting", and premium is "please". This one is a bit different from the previous cases. Both changed from the base. When both branches have changes like this, which change should Git choose? The answer is: '**Git doesn't know either!**' In fact, this is exactly the case where the **Conflict** you learned about **occurs**. Remember how earlier, when a conflict occurred, you resolved it and finished the merge? It was exactly this kind of case.

Now you see how a 3-way merge works, right? Just remember that:

- whatever has changed compared with the base takes priority,
- and when both branches have changed, it raises a conflict so the user can choose for themselves.

So far we've looked at merge in some depth. Even if you don't remember everything you just learned,

make sure you at least remember that there are two main kinds of merge:

- **Fast-forward merge**
- **3-way merge**

## Summary

| Type | When | Result |
| --- | --- | --- |
| Fast-forward | When the two branches are on the same line | The branch just moves forward with no new commit |
| 3-way merge | When the two branches have diverged | Compares the common ancestor + both commits to create a merge commit; a conflict if both sides changed |

> Reference: personal Notion study notes (Git study)
