---
title: "Memory Leaks & OOM"
---

This page walks step by step through how a memory leak starts, the pattern in which it builds up, and how the process is finally terminated by OOM and SIGKILL.

## Memory Leak

### Analogy: Filling a Bathtub Without Pulling the Plug

```
Normal memory use:            Memory leak:

malloc() → allocate 🪣        malloc() → allocate 🪣
use...                        use...
free()   → release 🚿         no free()! ❌

[fill → drain → repeat]       [fill → fill → fill → overflow!]
```

### The Difference in Code

```c
// Normal: allocate, then free
void normal_function() {
    char* data = malloc(25MB);  // allocate
    // ... use ...
    free(data);                 // ← always free it!
}

// ❌ Leak: no free
void leaky_function() {
    char* data = malloc(25MB);  // allocate
    // ... use ...
    // free(data); ← this is missing!
}   // the memory stays occupied even after the function ends
```

### The Pattern in This Document

```
T+2s:  malloc(25MB)  no free → 25MB occupied
T+5s:  malloc(25MB)  no free → 50MB occupied
T+8s:  malloc(25MB)  no free → 75MB occupied
T+11s: malloc(25MB)  no free → 100MB occupied → terminated
```

## Analyzing the Linear Growth Pattern

### What the Observed Pattern Means

```
Memory(MB)
100 |                    ●  ← terminated
 75 |               ●
 50 |          ●
 25 |     ●
  0 +----+----+----+----+
    0    3    6    9   (s)

Slope = 25MB / 3s ≈ 8.3MB/s
→ constant slope = regular leak
→ not random = intended behavior or a repeating loop
```

> **What the pattern tells you**
> - **Random leak**: irregular growth → a bug-type leak
> - **Linear leak (this case)**: regular growth → allocation without release inside a repeating loop

```python
# Presumed internal behavior (pseudocode)
def memory_worker():
    while True:
        data = allocate(25 * MB)  # allocate
        # free(data) ← this is missing!
        time.sleep(3)             # wait 3 seconds
```

## OOM (Out of Memory)

### Analogy: A Full Parking Lot

> The parking lot (memory) is full, but a new car (process) wants to get in
> → the attendant (OS) forcibly tows a car away (terminates a process)

```
How OOM happens:

Memory request
    │
    ▼
Free memory available? ──YES──→ Allocation succeeds ✅
    │
    NO
    │
    ▼
Swap space available? ──YES──→ Use swap (slows down ⚠️)
    │
    NO
    │
    ▼
OOM Killer triggered! 💀
    │
    ▼
Pick a victim process → send SIGKILL → forced termination
```

### Linux OOM Killer vs This Document's MemoryGuard

| Item | Linux OOM Killer | MemoryGuard (this document) |
|------|-----------------|----------------------|
| Who acts | OS kernel | The application itself |
| Trigger | System-wide memory shortage | Process reaches its limit |
| Purpose | Protect the system | Process protects itself |
| Signal | SIGKILL | SIGKILL (to itself) |

## Signals - SIGKILL

### Analogy: Messages Sent to a Process

```
Signal types:
┌──────────┬──────────────────────────────────────────┐
│ SIGTERM  │ "Please clean up and exit" (gentle request) │
│ SIGKILL  │ "Exit now!" (cannot be refused, OS enforces) │
│ SIGINT   │ "Ctrl+C" (interrupt)                      │
│ SIGSEGV  │ "Invalid memory access!" (segfault)       │
└──────────┴──────────────────────────────────────────┘

This document:
MemoryGuard → SIGKILL → process ID 7 terminated immediately
                ↑
         no handler can be registered
         = the process has no way to stop it
```

## Map of How the Concepts Connect

This is the whole flow, starting from a multithreaded environment and leading to leak → linear growth → MemoryGuard → SIGKILL → OOM.

```
MULTI_THREAD_ENABLE=True
        │
        ▼
  Multithreaded environment
        │
        ├──→ Deadlock risk ⚠️
        │
        └──→ Several threads access the Heap at once
                    │
                    ▼
              Memory Leak
              [malloc exists, free does not]
                    │
                    ▼
              Heap grows linearly
              (+25MB every 3 seconds)
                    │
                    ▼
              MEMORY_LIMIT reached
              (100MB >= 100MB)
                    │
                    ▼
              MemoryGuard triggered
                    │
                    ▼
              SIGKILL → OOM 
```

## Summary

| Stage | Details |
| --- | --- |
| Memory leak | `malloc()` exists but `free()` does not → memory stays occupied after the function ends |
| Linear growth | +25MB every 3 seconds (≈ 8.3MB/s); regular growth = allocation without release inside a repeating loop |
| OOM | When both memory and swap run out, the OOM Killer sends SIGKILL to a victim process |
| MemoryGuard | When the application reaches its limit (100MB), it sends SIGKILL to itself |
| SIGKILL | Cannot be refused, no handler can be registered → the process has no way to stop it |

> Source: [Codyssey-B1/B4-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B4-2)
