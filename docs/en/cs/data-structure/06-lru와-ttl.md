---
title: "LRU & TTL (Cache Eviction Strategies)"
sidebar: "LRU & TTL"
---

This page covers the two rules for clearing data out of a cache: LRU, for when memory is full, and TTL, for when time has run out.

## LRU - Throw Out What Has Gone Unused the Longest

**LRU (Least Recently Used)** = a policy that, when memory is full, deletes **the data whose last use was longest ago** first.

You combine three data structures:

| Structure | Role |
|------|------|
| Hash map | Stores key → value (fast lookup) |
| Doubly linked list | Records usage order (front = newest, back = oldest) |
| Heap | Tracks TTL expiration (a separate job) |

Flow:
1. `SET` succeeds → list **move_to_front** (mark as newest)
2. `GET` succeeds → list **move_to_front**
3. After `SET`, if used_memory > maxmemory → remove from the **back of the list** (the oldest), `evicted_keys += 1`

Thanks to the hash map, you can find "where this key sits in the list" in O(1),
and thanks to the linked list, moving and deleting are also O(1). **The combination of the two makes O(1) LRU possible.**

used_memory follows the required formula: the sum of `len(key.encode('utf-8')) + len(value.encode('utf-8'))`.

## TTL - An Expiration Date for Data

This is the TTL expiration tracking that the heap handles separately in the table above.

**TTL (Time To Live)** = a feature that sets an expiration time on a key.

- `EXPIRE user:2 3` → user:2 is scheduled to expire 3 seconds from now (push `(expire time, key)` onto the heap)
- When a key is looked up, **check for expiration first**: if `time.time() >= expire_at`, delete it and treat it as a missing key
- Stale entries piled up in the heap can be handled later when they are popped by "ignoring them if the key is already deleted" (lazy deletion)

TTL return value rules (easy to mix up):

| Situation | Return |
|------|------|
| Key does not exist | `(integer) -2` |
| Key exists but has no expiration set | `(integer) -1` |
| Seconds remaining | `(integer) N` |

## Summary

| Concept | Plain-language summary |
|------|-------------------|
| LRU | Throw out what has gone unused the longest first (hash map + linked list combo) |
| TTL | An expiration date for data. Scheduled expirations are managed with a heap |

> Source: [Codyssey-B1/B5-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B5-1)
