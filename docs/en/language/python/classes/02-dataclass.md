---
title: "dataclass - A Container for Data"
sidebar: "dataclass"
---

A single transaction record contains many pieces of information: id, date, type, category, amount...

Managing these as a bunch of separate variables gets confusing. A **dataclass** is a way to declare "a box that holds this kind of information."

```python
from dataclasses import dataclass

@dataclass
class Transaction:
    """A box that holds one transaction record"""
    id: str            # unique transaction number
    type: str          # income or expense
    date: str          # YYYY-MM-DD format
    amount: int        # only positive numbers allowed
    category: str      # food, transport, etc.
    memo: str = ""     # optional (empty string if missing)
    tags: list = None  # optional
```

- Adding `@dataclass` automatically generates `__init__` (the code that initializes the box; see [Class Basics](./01-클래스-기초))
- Requirement: define the data model with a dataclass or an equivalent structure

## Summary

| Concept | Summary |
| --- | --- |
| dataclass | A standardized box for holding data |

> Source: [Codyssey-B1/B2-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B2-1)
