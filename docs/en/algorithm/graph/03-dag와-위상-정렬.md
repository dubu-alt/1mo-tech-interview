---
title: "DAG and Topological Sort"
---

This article covers why a commit graph must be a graph without cycles (a DAG), and topological sort, which orders the log on top of it so that parents come first.

## Graphs and DAGs - Why Must There Be No Cycles?

**Graph** = a structure made of points (nodes) and lines (edges).
**DAG (Directed Acyclic Graph)** = a graph that has direction (Directed) and **no loops (cycles)** (Acyclic).

Why must a commit structure have no cycles?
- If A's parent is B and B's parent is A → you cannot tell "which came first"
- Log output repeats forever, or ancestor calculations never finish

So the commit creation rule ("a parent is always a past commit that already exists") naturally prevents cycles.

### Comparing Graphs and DAGs

| Aspect | Graph | DAG (Directed Acyclic Graph) |
|------|--------|------------------------------|
| Direction | May or may not have direction | Always has direction (one-way) |
| Cycles | Possible | None (no cycles) |

- **Node**: a point, **Edge**: a line connecting two nodes
- If you go around and come back, as in `A→C`, `C→B`, `B→A`, the graph has a cycle
- If there is no way back, as in `A→B`, `A→C`, `B→C`, it is a DAG

![Handwritten notes on DAGs, graphs and DFS/BFS](/images/algorithm/dag_notes-1.png)

*Handwritten notes: DAGs, graphs and DFS/BFS*

## Topological Sort - A Log Where Parents Come First

Requirement: LOG is not "listed newest first"; instead, **a parent commit must always be printed before its children**.
This kind of ordering is called a **topological sort**.

A simple method (DFS post-order traversal):
1. Pick a commit that has not been printed yet
2. **Recursively print its parents first**
3. Print the commit itself last

```python
def topo_visit(commit, visited, out):
    """Visits the parents first, then records the commit itself"""
    if commit.hash in visited:
        return                    # Skip commits that have already been processed
    visited.add(commit.hash)
    for parent in commit.parents: # 1) Parents first
        topo_visit(parent, visited, out)
    out.append(commit)            # 2) Then itself
```

This guarantees an order in which "ancestors always come first" for every commit.

### The Result of a Topological Sort May Not Be Unique

- **Parent commit**: a commit created earlier (the past)
- **Child commit**: a new commit written on top of its parent (the future)
- **Branch**: a name tag such as `main` or `develop` that points to a commit, and **HEAD** points to the current branch

Example: `M1` (initial commit), `M2`, `F1` (feature branch splits off), `F2`, `M3` (Merge Commit)

- Output 1: `M1 → M2 → F1 → F2 → M3`
- Output 2: `M1 → F1 → F2 → M2 → M3`

Since the only requirement is that parents come before children, the result of a topological sort **may not be uniquely determined**.

![Handwritten notes on BFS/DFS traversal order and topological sort](/images/algorithm/dag_notes-2.png)

*Handwritten notes: traversal order and topological sort*

More broadly, topological sort is used not only for commits but anywhere "a prerequisite task must finish before the next task can start." Examples: deciding the order of prerequisite courses, or installing dependency packages first when building. Finding the common ancestor of two commits is covered in [Lowest Common Ancestor (LCA)](./02-최소-공통-조상), and ways to walk through a graph step by step are covered in [DFS & BFS](/en/algorithm/search/02-dfs와-bfs).

## Summary

| Concept | Plain-language summary |
|------|-------------------|
| Commit/DAG | A record of "who did what and when" + pointers to parents with no loops |
| Topological sort | An output order that always shows parents before children |

> Source: [Codyssey-B1/B5-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B5-2) (includes study notes)
