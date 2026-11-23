---
title: "NumPy and Pandas"
sidebar: "NumPy and Pandas"
---

This page covers the two libraries used for handling data in A1-1. NumPy handled array computation, and Pandas handled organizing tabular data.

## NumPy and Vectorized Operations

**NumPy** is a Python library for fast computation on numeric arrays. Its core is a multidimensional array called `ndarray`. Because it stores values of the same data type packed tightly together in memory, you can apply an operation to the whole array at once instead of pulling values out one by one with a Python `for` loop. This is called a **vectorized operation**.

```python
import numpy as np

prices = np.array([1200, 3500, 800])
prices * 1.1        # adds 10% to all three values at once → [1320. 3850.  880.]
```

In A1-1, it was used to compute the mean and standard deviation of 60,000 images without loops (see [Feature Engineering](./04-피처-엔지니어링)). For scoring RFM, `np.searchsorted` (finding which bin a value falls into) was used, and `np.select` was used to attach group names by condition.

## Pandas

**Pandas** is a library for handling tabular data with rows and columns, like Excel. The whole table is called a **DataFrame**, and a single column is called a **Series**. Internally it is built on top of NumPy arrays, so computation is fast, and features like column names, date handling, missing value handling, and group-wise aggregation are added on top.

| What you want to do | Pandas code |
|---|---|
| Read Excel/CSV | `pd.read_excel()`, `pd.read_csv()` |
| Get an overview of the structure | `info()`, `describe()`, `head()` |
| Count / fill blanks | `isna().sum()`, `fillna()` |
| Remove identical rows | `drop_duplicates()` |
| Aggregate by group | `groupby("customer_id").agg(...)` |
| Quartiles / limit range | `quantile([0.25, 0.75])`, `clip()` |

In A1-1, two Excel sheets were combined into a 1,067,371-row × 8-column table and saved as CSV so it could be read quickly on later runs.

## NumPy vs Pandas

| Category | NumPy | Pandas |
|---|---|---|
| What it handles | Numeric arrays of the same data type | Tables with named columns (each column can have a different data type) |
| Basic unit | `ndarray` | `DataFrame`, `Series` |
| Good at | Large-scale numeric computation, images, matrices | Reading files, cleaning, missing values, group aggregation, dates |
| In A1-1 | Turning 60,000 images into numbers, RFM score bins | Cleaning 1.07 million transactions, per-customer aggregation |

## Interview Questions

### Q. Why are NumPy array operations faster than Python loops?

This question checks whether you can explain why it is faster, more than the fact that you used NumPy.

> An `ndarray` stores values of the same data type contiguously in memory. So there is no need to check the type of each value, and an internal loop implemented in C processes the whole array at once. A Python `for` loop is slow because it checks the object and goes through the interpreter every time it pulls out one element. In A1-1, the mean and standard deviation of 60,000 images were computed without loops, with one line each: `mean(axis=(1, 2))` and `std(axis=(1, 2))`.

Answering only "It's fast because it's written in C" is not enough. It is better to go on and mention that values of the same type are stored contiguously, so they can be processed in one go.

### Follow-up Questions

- In what order does Pandas' `groupby` work?
  → It splits rows by the key column (split), applies an aggregate function to each group (apply), then merges the results back into one table (combine).

> Source: [dubu-alt/A1-1](https://github.com/dubu-alt/A1-1) (Codyssey AI Advanced A1-1 mission)
