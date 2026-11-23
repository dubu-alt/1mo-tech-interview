---
title: "DFS & BFS"
---

DFS (Depth-First Search) and BFS (Breadth-First Search) are the two most basic ways to visit every vertex of a graph without missing any.

## At a Glance

Both are graph algorithms and are used very often when solving problems. In path-finding problems, you choose DFS or BFS depending on the situation.

- **Graph**: a structure made of points (vertices) and lines connecting them (edges). Think of a subway map. The stations are vertices and the tracks between stations are edges.
- **DFS**: in a maze, pick one path and follow it all the way to a dead end; when blocked, come back and try another path.
- **BFS**: like ripples spreading when you throw a stone into a lake, it expands outward one layer at a time, starting from the closest places.

| Aspect | DFS (depth-first) | BFS (breadth-first) |
|------|----------------|----------------|
| Visiting order | Explores one branch to the end before moving to the next branch | Starts from the vertices closest (adjacent) to the starting point |
| Implementation tool | A stack or a recursive function | A queue |
| Good fit | When every path must be visited | When finding the shortest path by number of edges (fewest moves) |

## DFS (Depth-First Search)

Starting from the root node or any node, it **explores an entire branch before moving on to the next branch**.

It is implemented with **a stack or a recursive function**. Since you have to retrace the path you just came in on, a stack, which "takes out the last thing put in first," is a perfect fit. A recursive function also uses the call stack internally, so it works on the same principle.

- It is suitable when every path must be visited.

### How It Works

1. Mark the start vertex as visited.
2. Move into one of the unvisited neighbors (usually the one with the smallest number).
3. From that vertex, repeat steps 1-2.
4. If there are no more neighbors to go to, go back to the previous vertex and look at its remaining neighbors.
5. It ends when no vertex has anywhere left to go.

Example graph: 4 vertices, edges `1-2`, `1-3`, `1-4`, `2-4`, `3-4`, start vertex 1

| Step | Current vertex | Path so far | Explanation |
|------|----------|------------|------|
| 1 | 1 | 1 | Visit 1. Among neighbors 2, 3, 4, go to the smallest, 2 |
| 2 | 2 | 1 → 2 | Visit 2. Neighbor 1 is visited, go to 4 |
| 3 | 4 | 1 → 2 → 4 | Visit 4. Neighbors 1 and 2 are visited, go to 3 |
| 4 | 3 | 1 → 2 → 4 → 3 | Visit 3. Neighbors 1 and 4 are both visited |
| 5 | - | Backtracking | Going back 3 → 4 → 2 → 1 finds no remaining neighbors, done |

Visiting order: **1 → 2 → 4 → 3**

### In Pictures

![DFS in action](/images/algorithm/dfs.gif)

*Image source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Depth-First-Search.gif)*

### Python Code (Recursive)

Like the original C code, this uses an adjacency matrix (a and b are connected if `graph[a][b] == 1`) and visits neighbors with smaller numbers first.

```python
def dfs(graph, v, visited, order):
    """DFS implemented with recursion. graph is an adjacency matrix, vertices are numbered from 1"""
    visited[v] = True                        # 1. Mark the current vertex as visited
    order.append(v)
    for nxt in range(1, len(graph)):         # 2. Check neighbors starting from the smallest number
        if graph[v][nxt] == 1 and not visited[nxt]:
            dfs(graph, nxt, visited, order)  # 3. Explore that neighbor's branch to the end


def build(n, edges):
    """Build an undirected adjacency matrix from an edge list"""
    graph = [[0] * (n + 1) for _ in range(n + 1)]
    for a, b in edges:
        graph[a][b] = graph[b][a] = 1
    return graph


n = 4
graph = build(n, [(1, 2), (1, 3), (1, 4), (2, 4), (3, 4)])
order = []
dfs(graph, 1, [False] * (n + 1), order)
print(*order)  # Output: 1 2 4 3
```

1. Marking the vertex as visited as soon as you enter prevents visiting the same vertex twice.
2. Since it checks from vertex 1 in order, when there are several neighbors, the smaller number goes first.
3. As soon as it finds an unvisited neighbor, it dives deep in that direction. Only after that call finishes (after reaching a dead end and coming back) does it look at the next neighbor.

Python's default recursion depth limit is about 1000. If there are many vertices, raise it with something like `sys.setrecursionlimit(10000)`, or use the stack version below.

### Python Code (Stack)

```python
def dfs_stack(graph, start):
    """DFS implemented with a stack. Visits in the same order as the recursive version"""
    n = len(graph) - 1
    visited = [False] * (n + 1)
    order = []
    stack = [start]                          # 1. Push the start vertex onto the stack
    while stack:
        v = stack.pop()                      # 2. Pop the most recently pushed vertex
        if visited[v]:
            continue
        visited[v] = True
        order.append(v)
        for nxt in range(n, 0, -1):          # 3. Push larger numbers first so smaller numbers come out first
            if graph[v][nxt] == 1 and not visited[nxt]:
                stack.append(nxt)
    return order


print(*dfs_stack(graph, 1))  # Output: 1 2 4 3
```

1. A stack is a container that "takes out the last thing put in first." In Python, a list's `append`/`pop` is enough.
2. If the popped vertex has already been visited, skip it; otherwise, mark it as visited. The same vertex can be pushed onto the stack several times, so it is checked when popped.
3. A stack comes out in reverse, so to visit smaller numbers first, push larger numbers first.

## BFS (Breadth-First Search)

Starting from the root node or any node, it **explores adjacent nodes first**.

It is implemented with **a queue**. Since it must explore the surroundings of a node first, a queue, which "takes out the first thing put in first," is the right fit. Like a ticket number at a bank, items are handled in the order they arrive.

- It is suitable when minimum cost comes first, that is, when finding **the route that arrives in the fewest moves** rather than exploring everywhere. With BFS, the moment a vertex is first reached is its shortest distance (by number of edges). If each edge has a different cost, use [Dijkstra](/en/algorithm/graph/01-다익스트라) instead of BFS.

### How It Works

1. Mark the start vertex as visited and put it in the queue.
2. Take out the vertex at the front of the queue.
3. Mark all of its unvisited neighbors as visited and put them at the back of the queue.
4. Repeat steps 2-3 until the queue is empty.

Same example graph, start vertex 1

| Step | Vertex taken out | Vertices newly added | Queue state | Visiting order |
|------|----------|--------------|---------|----------|
| Start | - | 1 | [1] | 1 |
| 1 | 1 | 2, 3, 4 | [2, 3, 4] | 1, 2, 3, 4 |
| 2 | 2 | None (1, 4 visited) | [3, 4] | 1, 2, 3, 4 |
| 3 | 3 | None | [4] | 1, 2, 3, 4 |
| 4 | 4 | None | [] | 1, 2, 3, 4 |

Visiting order: **1 → 2 → 3 → 4** (2, 3 and 4, at distance 1 from the starting point, are all visited first)

### In Pictures

![BFS in action](/images/algorithm/bfs.gif)

*Image source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Breadth-First-Search-Algorithm.gif)*

### Python Code

```python
from collections import deque


def bfs(graph, start):
    """BFS implemented with a queue. graph is an adjacency matrix, vertices are numbered from 1"""
    n = len(graph) - 1
    visited = [False] * (n + 1)
    order = [start]
    queue = deque([start])                   # 1. Put the start vertex in the queue and mark it visited
    visited[start] = True
    while queue:
        v = queue.popleft()                  # 2. Take out vertices in the order they came in
        for nxt in range(1, n + 1):
            if graph[v][nxt] == 1 and not visited[nxt]:
                visited[nxt] = True          # 3. Mark as visited the moment it is put in the queue
                order.append(nxt)
                queue.append(nxt)
    return order


print(*bfs(graph, 1))  # Output: 1 2 3 4
```

1. `deque` is Python's standard queue, which is fast at adding and removing at both ends. A list's `pop(0)` is slow (O(n)) because it shifts all the remaining items forward by one each time.
2. `popleft()` takes out the vertex that came in first, so closer vertices are processed first.
3. You must mark a vertex as visited **when it is put in**, not when it is taken out, so that the same vertex does not enter the queue multiple times.

## DFS vs. BFS at a Glance

| Aspect | DFS (Depth-First Search) | BFS (Breadth-First Search) |
|------|--------------------------|----------------------------|
| Name | Depth-first search | Breadth-first search |
| Approach | Goes all the way down in one direction | Explores level by level, starting from the closest nodes |
| Data structure | Stack (LIFO / last in, first out) | Queue (FIFO / first in, first out) |

Example 1 (A's children are B and C / B's child is D)

- DFS: `A → B → D → C` (goes down to D, comes back to B and A, then C)
- BFS: `A → B → C → D`

Example 2 (A's children are B and C / B's children are D and E / C's children are F and G)

- DFS: `A → B → D → E → C → F → G`
- BFS: `A → B → C → D → E → F → G`

**Queue (BFS)**: what goes in first comes out first. Example) If you put in `A → B → C`, they also come out as `A → B → C`.

> Data in → `[ C | B | A ]` → Data out (A on the right is at the front)

**Stack (DFS)**: the most recent item is on top, and the earliest item is at the bottom.

| Stack state (top → bottom) | What gets popped |
|--------------------------|-----------|
| `[B, C]` | Pop B (push B's child D) |
| `[D, C]` | Pop D |
| `[C]` | Pop C |

> Visiting order: `A → B → D → C`

![Handwritten notes on queues (BFS) and stacks (DFS)](/images/algorithm/dag_notes-3.png)

*Handwritten notes: queues (BFS) and stacks (DFS)*

## Time and Space Complexity

V is the number of vertices and E is the number of edges. They are the same for DFS and BFS.

| Graph representation | Time complexity | Reason |
|------------|-----------|------|
| Adjacency matrix | O(V²) | For each vertex, checks whether it is connected to every vertex (V of them) |
| Adjacency list | O(V + E) | For each vertex, checks only the neighbors actually connected; edges are looked at only once or twice in total |

- Space complexity: O(V) for the visited flags and the stack/queue. Storing the graph takes O(V²) for an adjacency matrix and O(V + E) for an adjacency list.
- For graphs with few edges, an adjacency list is much faster and uses less memory. For complexity notation, see the [time complexity](/en/cs/data-structure/02-시간-복잡도) article.

## Practice Problem

[[BOJ] DFS and BFS](https://www.acmicpc.net/problem/1260): given a graph and a start vertex, print the DFS and BFS visiting orders. If several vertices can be visited, visit the one with the smaller number first. The code above works exactly according to this rule.

Example) 5 vertices, start vertex 3, edges `5-4`, `4-3`, `5-2`, `1-2`, `3-4`, `3-1` → DFS `3 1 2 5 4`, BFS `3 1 4 2 5`

## Trying It in Mini Git

This covers two ways to explore the commit graph: BFS for finding the shortest path and DFS for collecting ancestors.

### BFS (Breadth-First Search) - Finding the Shortest Path

`PATH <c1> <c2>`: finds **the shortest connection** (fewest edges) between two commits.
Here, commit-parent links are treated as **undirected** edges (you can travel both ways).

**BFS** = starting from the start point, it explores by expanding **step by step from the nearest neighbors**.
Property: with BFS, **the moment you first reach a vertex is its shortest distance**.

Tools you need:
- **Queue**: a list of places to visit next. Takes out what was put in first (`collections` is not allowed, but you can implement it with a list's `append`/`pop(0)` or with an index pointer)
- **visited set**: prevents revisiting commits that have already been visited (in case of cycles)

Path reconstruction: if you record "where it came from (came_from)" when putting a commit in the queue, you can build the path by following it backward from the destination to the start.

Tie-breaking (requirement): if there are several shortest paths, choose the **lexicographically smallest** one based on the `hash1->hash2->...` string.
Implementation tip: sort neighbors by hash string when scheduling visits, or make sure that among candidates at the same distance, the lexicographically earlier one is chosen first.

### DFS/Set Tracking - Finding Ancestors

`ANCESTORS <hash>`: prints **every parent-side commit reachable** from a given commit.

Method: start from hash, follow parents all the way, and add each commit that has not been visited yet to the result.

```python
def find_ancestors(start):
    """Collects all ancestors of the start commit (BFS or DFS, either works)"""
    result = []
    visited = set()
    stack = [start]               # DFS uses a stack (or recursion) instead of a queue
    while stack:
        cur = stack.pop()
        for p in cur.parents:
            if p.hash not in visited:
                visited.add(p.hash)
                result.append(p)
                stack.append(p)   # Keep exploring the parents' parents too
    return result
```

The key is **preventing duplicate visits with visited**, because in a graph where branches merge, the same ancestor is reached through multiple paths.

## Summary

| Concept | Plain-language summary |
|------|-------------------|
| DFS | Follow one path all the way to a dead end; when blocked, come back and take another path |
| BFS | A shortest-path search that expands outward from the nearest places |
| Stack / Queue | A stack takes out the last thing put in first; a queue takes out the first thing put in first |
| visited | Mark places you have been so you do not go there twice |
| Ancestor search | Follow the parent line to the end and collect everything |

> Reference: [developer-mac.tistory.com/64](https://developer-mac.tistory.com/64)

> Source: [Codyssey-B1/B5-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B5-2) (includes study notes)
