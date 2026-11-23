---
title: "origin and upstream (Remote Branches)"
sidebar: "origin and upstream"
---

> **git remote add origin https://github.com/username/Math_Box.git**

> **git push -u origin master**

When you push a local repository to GitHub for the first time, you often copy and paste the two commands above. Let's look at what exactly they mean.

## 1. What is origin?

First, let's look at the first command.

> **git remote add origin https://github.com/username/Math_Box.git**

In this command, **remote** is the command used for working with remote repositories.

The **add** after it means you want to register a new remote repository.

Next comes **origin https://github.com/username/Math_Box.git**, right?

This means "register the remote repository **https://github.com/username/Math_Box.git** under the name **origin**."

So after running this command, you can refer to **https://github.com/username/Math_Box.git** simply as **origin**.

Then why **origin** of all names? It doesn't really matter if you type some other word you like instead of origin. But in Git it is a convention to call the first remote repository you add origin.

origin means "source" or "beginning." Presumably the convention arose because, from the point of view of someone who brings another person's remote repository onto their own computer to work on it, the remote repository is the source of the project.

In fact, you could write

> git remote add **hello** https://github.com/username/Math_Box.git

using any word you want (hello) instead of origin, but it's better to follow the convention and use origin whenever possible.

## 2. Branches in the Remote Repository

Now let me explain the second command.

> **git push -u origin master**

This command means:

- Take the contents of the master branch in the current local repository (= all commits related to the master branch)
- and send them to the remote repository called origin.

They are sent to a branch with the same name, and if the remote repository origin **has no master branch, a new master branch is created and pushed.**
But what does the **-u** option mean here? **-u** is short for the **--set-upstream** option.

When you pass the **--set-upstream (-u) option** like this,

- the master branch in the local repository
- is set to **track** the master branch on origin.

You can think of **tracking as a state where one branch in the local repository is linked to one branch in the remote repository and keeps watching it**. The link formed this way is called a **tracking connection**.

Suppose

- there is a branch A in the local repository,
- and a branch B in the remote repository,
- and this **tracking connection** is formed between them.
- Then branch B is called the **upstream branch** of branch A.
- Here I called them A and B to tell them apart, but in most cases they have the same name.

Once a **tracking connection** is set up,
while you are on the master branch, just typing

```bash
git push
```

automatically runs git push against the remote repository's master branch, and just typing

```bash
git pull
```

runs git pull against the remote repository's master branch.

Actually, you can still git push and git pull later even without the **--set-upstream (-u)** option. But if you don't pass this option the first time, there is no tracking connection, so when you want to git push later you have to write

```bash
git push origin master:master
```

like this. Here

- origin is the remote repository,
- in master:master, the first master is the local repository's master branch (from), and the second master is the remote repository's master branch (to).

So without a tracking connection, you have to git push this way every time. git pull also needs a similarly complicated expression.

So it's better to set up the tracking connection from the start and then push and pull comfortably with just git push and git pull, right? That is exactly why I used the -u option when I first sent the local repository's contents to the remote repository.

## 3. What origin/master Means

Now you can see that there are

- the master branch of the local repository
- the master branch of the remote repository

two different branches with the same name, right?

So how can you see the master branch in the remote repository? You could look at it on the GitHub page.

But there is also a way to check it on your own computer. If we take a quick look at the commit history:

![](/images/git/d2b845d7b2c2.png)

In the picture above,

- **master** is the master branch of the local repository
- **origin/master** is the master branch of the remote repository.

So far I have made several commits on the local master branch but have never run git push afterward. That is why, as in the picture, **origin/master** points to an earlier commit than **master**.

Let's **git push** both the master and premium branches to the remote repository. After that, origin/master will point to the same commit as master.

## Summary

- `git remote add origin <address>`: registers the remote repository under the name origin (origin is a convention)
- `git push -u origin master`: pushes master and links the remote master as its **upstream** (tracking)
- Once linked, you only need to type `git push` and `git pull` afterward
- `origin/master` = the position of the remote master branch as seen from your computer

> Reference: personal Notion study notes (Git study)
