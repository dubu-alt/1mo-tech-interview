---
title: "Pull Requests & Code Review"
---

This page brings together what a PR is, why it's used, and how to actually review a submitted PR on GitHub.

## What Is a Pull Request?

Imagine you've just joined a new team. Adding your code for the first time to a project that already has a huge pile of code is scary. "Could this have bugs?" You can't grab a busy senior colleague every time to check. This is when you use the **Pull Request (PR)** feature.

**A PR is a GitHub feature for asking others to review your work and merge it.** Nobody has to be available at a set time, and people can freely exchange opinions, so code quality naturally goes up.

### Why Use It Even When Working Alone

PRs are useful even in personal projects. Each PR becomes **a record of one feature**, so "why this group of commits was needed" is kept automatically without writing separate documentation. Also, if you merge directly without a PR, mistakes are hard to undo, but if you build things up through PRs, a record remains on the remote and recovery is easy.

### Even More Important in Team Projects

On a team, reading each other's code through PRs spreads knowledge and makes the author's intent transparent. Even your future self can recall "why did I write it this way?" by looking at the PR.

### The Actual Workflow

From now on, all work follows this order.

```
git pull → create a branch (git checkout -b) → commit (git add & git commit) → git push → create a PR
```

### The 3 States of a PR

| State | Meaning |
|---|---|
| **Open** | Still under review or needs more work. You can add more commits or discuss. |
| **Merged** | Merged into the default branch. Pressing the Merge button changes it to this state, and after that you can't add more commits. |
| **Closed** | Rejected or no longer needed. If the branch still exists, it can be reopened. |

Note that Merged is also, in the end, a "closed" PR, so GitHub's Closed tab shows both Merged and Closed PRs together.

## Code Review with GitHub

Let's say a colleague has opened a PR and requested a review. Go to the **Files changed** tab of the PR page and you'll see the changed code. Red lines are deleted code, and green lines are added code.

### Line-by-Line Review

Hover your mouse to the right of a line number and a `+` button appears; you can leave a comment from there. Besides simple comments, you can also propose a fix directly with the **suggested change** feature. If you write the code you want inside a suggestion block, the author can apply that suggestion as is with a single button.

### Multi-Line Review

Click to the left of a line number, then hold Shift and click another line to select several lines in yellow. Leaving a comment in this state creates a review spanning multiple lines. Also, typing `#` in a comment lets you search for and link another PR.

### Tracking Review Progress with the Viewed Checkbox

In a PR that changes dozens of files, it's easy to lose track of what you've seen. Clicking the `Viewed` checkbox next to a file collapses it, and if that file doesn't change in later commits, it stays collapsed. Review progress is shown as a blue bar at the bottom right.

### Reviewing Commit by Commit

If the PR was submitted as small commits split by logical unit, it's also a good idea to use the per-commit view and check them one by one in order. Selecting a range with Shift lets you view several consecutive commits at once.

### Submitting a Review: Comment / Approve / Request changes

| Option | Purpose |
|---|---|
| **Comment** | When you only want to leave an opinion or question (no intent to approve or reject) |
| **Approve** | Approval that the code has no problems. If branch protection requires it, the PR can only be merged with this |
| **Request changes** | When changes are needed. While this is in place, merging is blocked until the author addresses it with new commits |

## Summary

| Concept | One-line summary |
|---|---|
| Pull Request | A GitHub feature for asking others to review and merge your work |
| PR states (Open/Merged/Closed) | Under review / merged / rejected or closed |
| Code review | Done with line/multi-line comments, the Viewed checkbox, and Comment/Approve/Request changes |

> Source: [Codyssey-B1/B2-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B2-2)
