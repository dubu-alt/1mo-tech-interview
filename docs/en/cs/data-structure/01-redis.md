---
title: "Building Redis Yourself"
---

This page covers what Redis is, why we build one ourselves, and the structure of a REPL, an interactive program that reads commands and runs them.

## What Is Redis, and Why Build One?

**Redis (REmote DIctionary Server)** = an open-source NoSQL database that handles data as key-value pairs.
It stores and reads data directly in **memory (RAM)** instead of on disk, so if you know the key you can pull out the value right away without a query, and that makes it fast.
It is used all over the world for caching (temporary storage), session storage, and more.

### Why Is It So Often Used as a Cache?

A cache is "a space that keeps data you have already read somewhere close, so it can be handed back quickly the next time you look for it."
Instead of going all the way to a slow disk-based DB every time, the server checks a cache like Redis first.

```
1. Client → Server: request data
2. Server → Cache (Redis): "Do you have this data?"
   If yes → return it straight from the cache (fast, done here)
   If no  → go to step 3
3. Server → DB: look it up in the disk-based DB
4. Server: store the fetched data in the cache too, then return it to the client
```

Once data is in the cache, later requests finish at step 2, so things get much faster.

### In-Memory DB vs Disk-Based DB

A typical (disk-based) DB keeps only "some" frequently used data in memory and reads the rest from disk.
An **in-memory DB** like Redis does the opposite: it updates the data itself in memory and leaves only backups and logs on disk.

- Since it only works with memory, there is no disk I/O bottleneck, so it is much faster.
- On the other hand, memory contents can be lost when the server shuts down, so the real Redis provides separate redundancy mechanisms such as snapshots and logs.

The goal of this mission is not Redis **itself**, but to learn the principles by implementing by hand the **three internal data structures** (hash map, doubly linked list, heap) that make Redis fast.
That is why using Python's built-in `dict`, `set`, and `collections` is **forbidden**.

## REPL - Building an Interactive Program

The mini-redis you build is used as a REPL that reads and runs commands one line at a time.

REPL = Read → Eval → Print → Loop.

```python
while True:
    line = input("mini-redis> ")   # 1. Read: get input
    if line.strip().lower() in ("exit", "quit"):
        break                       # exit condition
    result = execute(line)          # 2. Eval: parse and run
    print(result)                   # 3. Print: output
                                    # 4. Loop: repeat
```

For parsing, split with `line.split()`, and for values wrapped in quotes like `"Alice"`, strip the quotes before handling them.

## Summary

| Concept | Plain-language summary |
|------|-------------------|
| Redis | A fast DB that stores key-value data in memory (RAM) for instant access, mainly used as a cache |
| Mission goal | Implement a hash map, doubly linked list, and heap yourself without `dict`/`set`/`collections` |
| REPL | A chat-like window that repeats input → run → output forever |

> Source: [Codyssey-B1/B5-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B5-1)
