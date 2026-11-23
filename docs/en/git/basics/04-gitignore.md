---
title: ".gitignore - Files Git Ignores"
sidebar: ".gitignore"
---

We version-control a project by running

- **git add**
- **git commit**

on the files in the **working directory**. But there are files whose very existence Git ignores, even though they are inside the working directory.

## 1. Looking at the .gitignore File

Let's take a quick look at the image below.

![](/images/git/da5d12f17ee5.png)

Here we are about to create a repository called Mathbox on GitHub. If you look at the bottom of the screen, you'll see a setting tab that says

> Add .gitignore: None

This means a **.gitignore** file will not be created. So what is a **.gitignore** file?

A **.gitignore** file is a file that lists

- files that exist in the working directory
- but that Git should treat
- as if they don't exist.

Literally, it is **a file listing the names of files that Git ignores**. If you click this tab,

![](/images/git/fea87b3bf095.png)

words appear in alphabetical order starting from A. These words are all **platforms** that programs run on or **programming languages**. If you choose one of them, GitHub automatically creates a **.gitignore** file that lists the names of unnecessary files, among the files that are (usually automatically) generated

- when building a program that runs on that platform, or
- when writing code in that programming language,

which don't really need to be version-controlled by Git.

Let's say all the code in the example project is Python.

Choose **Python**.

![](/images/git/cfd318c0e803.png)

Search for Python, select it,

![](/images/git/edee6c201751.png)

and create the repository,

![](/images/git/e9569d6a436d.png)

and a **.gitignore** file is created like this. If you click it to see its contents,

![](/images/git/daa46b7baf0a.png)

you'll see various file names and directory names. Let's pick out just a few of them.

- `*.py[cod]`
- `*$py.class`
- `*.so`

What do all of these mean? Here,

- you can think of `*` as any word of length 0 or more,
- and square brackets ([ ]) as one of the letters inside them.

So these three mean what's shown in the table below.

| Pattern | Meaning |
| --- | --- |
| `*.py[cod]` | File names ending in .pyc, .pyo, or .pyd |
| `*$py.class` | File names ending in $py.class |
| `*.so` | File names ending in .so |

Not that hard, right?

Git simply ignores every file that matches these.

And in the image above, names with a **slash (/)** at the very end, like

- **build/**
- **develop-eggs/**

refer to directories. These two mean that Git also ignores every file in the build directory and every file in the develop-eggs directory.

So Python's .gitignore file lists the names of various typical by-products that appear when you work with Python.

These are set to be ignored by Git because they

- aren't really worth version-controlling,
- would only take up more space if version-controlled,
- and would only make each version harder to read when you look back at it later.

Then what exactly does it mean for Git to ignore something? Let's take a look.

## 2. What "Git Ignores It" Means

I created a remote repository called Mathbox on GitHub and brought it to my computer with the **git clone** command.

Now there will be a directory called Mathbox on my computer, right?

![](/images/git/f697ecff5b23.png)

If you go into the Mathbox directory and check, you can see the **.gitignore** file as in the image above.

Next, I created a file called **calculator.py** and a file called **library.so** in this working directory.

Then, checking right away with the **git status** command prints that the **calculator.py** file has not been git added yet.

![](/images/git/eda1b5c80c70.png)

But that's strange, isn't it? I definitely created the **library.so** file too, so why did only **calculator.py** show up? Scroll back up for a moment and find

> *.so, written in Python's .gitignore file

Because of this entry, from now on Git completely ignores and pays no attention to any file in this working directory that ends with the **.so** extension. **library.so** is exactly a file whose name matches this condition, so Git ignored it.

In this state, if you **delete the .gitignore file** and **check again**,

![](/images/git/fd0a2f072444.png)

this time you can see a warning that the **library.so** file has not been git added either. That's because **the .gitignore file was deleted**, and Git now recognizes every file.

Now you know what it means for Git to ignore a specific file, right?

If there are things in your working directory that don't need version control, add their names to a **.gitignore** file like this and then start version control. That way, your version control stays cleaner. And if you're not sure which files to ignore, refer to the per-platform or per-language .gitignore files that GitHub provides by default, as shown above.

- https://www.toptal.com/developers/gitignore

## Summary

- `.gitignore`: a list of files/directories Git should ignore as if they don't exist
- `*` is any word of length 0 or more, `[ ]` is one of the characters inside, and a trailing `/` means a directory
- Ignored files don't show up in `git status` either
- If you're not sure what to ignore, refer to the per-language `.gitignore` that GitHub provides

> Reference: personal Notion study notes (Git study)
