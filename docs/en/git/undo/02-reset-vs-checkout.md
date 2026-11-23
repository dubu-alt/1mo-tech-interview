---
title: "reset vs checkout (Detached HEAD)"
sidebar: "reset vs checkout"
---

## 1. Reviewing git reset

As we saw in the [git reset](./01-reset) article, in a state like the picture below,

![](/images/git/c5f5ca27f07d.png)

running

> git reset 9033

gives the result shown in this picture.

![](/images/git/fd8f3ed70e09.png)

So HEAD **usually** does not point to a commit directly but **points to a commit indirectly** through a branch.

## 2. What git checkout Does

However, you can also change what HEAD itself points to. In fact, you can even make HEAD point directly to a commit.

You do this with the **git checkout** command.

![](/images/git/c902312c31a0.png)

From this original state, running

> git checkout 9033

changes things as in the picture below.

![](/images/git/c8bb3e057b7d.png)

Look at this picture closely. HEAD no longer points to the master branch; it points directly to the **9033.. commit** itself, right?

There is a special term for a HEAD that points directly to a commit instead of through a branch.

It's called a **Detached HEAD**. Detached means "separated from" or "cut off," and HEAD is called this because it is separated from any branch.

There can be several reasons to make HEAD point directly to a specific commit.

One of the main reasons is when you want to create a new branch from a specific past commit.

For example, in the Detached HEAD state shown in the picture above, if you create a new premium branch with

> git branch premium

you get the result in the picture below.

![](/images/git/c9836a379433.png)

1. A new branch called premium has been created
2. and the premium branch points to the same commit that HEAD was pointing to.

Now, let me tell you one new fact here.

With the git checkout command you can

- not only make HEAD point directly to a commit
- but also make it point directly to a branch.

Let's make HEAD point to a branch. If you write

> git checkout premium

HEAD now points to the premium branch.

So, as in the picture below, HEAD now points to the premium branch. This also means leaving the Detached HEAD state and returning to the normal state where HEAD points to a branch.

![](/images/git/c4c320aab863.png)

And if you make a **new commit** while HEAD points to the premium branch,

![](/images/git/c0089b1b3edd.png)

**you can now carry a new line of code management on the premium branch, separate from the master branch.**

Like we just did, HEAD is often put in the Detached HEAD state for a moment when you want to create a new branch starting from a specific commit.

To summarize:

- the git checkout command can change what HEAD points to directly,
- and by giving a commit ID or a branch name after git checkout,
- you can make HEAD point directly to a commit, or point to a branch.

Actually, we have already learned the case where a branch name comes after git checkout. When we want to go to some branch,

```bash
git checkout [branch name you want to go to]
```

we learned to use a command in this format, right?

Doesn't this command feel a bit different now? Let me show you with a picture right away.

In the state shown in the picture above, running

> git checkout master

![](/images/git/f6cea80b2d3e.png)

makes HEAD point to the master branch like this. This is exactly **what happened when we used the git checkout command to move to another branch** before.

In this way,

- when HEAD points to the commit another branch was pointing to,
- the inside of the working directory changes accordingly,
- and as a result we could actually feel that the branch had changed.

To put it again in easier terms,

```bash
git checkout master
```

this command can be read as follows.

= Move to the master branch

= Make HEAD point to the master branch

= HEAD indirectly points to the commit the master branch was pointing to

= so the inside of the working directory changes to match that commit

= and the user can actually feel that they moved to the master branch

That's how it works.

Now you know the secret of git checkout, right?

## 3. git reset vs git checkout

Finally, let's go over the differences between git reset and git checkout.
The differences are shown in the table below.

| **git reset** | **git checkout** |
| --- | --- |
| **Makes the branch HEAD was pointing to point to another commit** | **Makes HEAD itself point to another commit or branch** |
| **As a result, HEAD also ends up indirectly pointing to another commit** | **A HEAD that points directly to a commit, not through a branch, is called a Detached HEAD** |

## Summary

| git reset | git checkout |
| --- | --- |
| Moves the **branch** HEAD was pointing to onto another commit | Makes **HEAD itself** point to another commit or branch |
| HEAD keeps pointing to the same branch | Pointing directly to a commit gives a Detached HEAD state |

> Reference: personal Notion study notes (Git study)
