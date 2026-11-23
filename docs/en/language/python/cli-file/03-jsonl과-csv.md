---
title: "JSONL and CSV - Storage File Formats"
sidebar: "JSONL and CSV"
---

## JSONL (JSON Lines)

One piece of data per line (in JSON form). It converts almost 1:1 with Python dictionaries, which makes it convenient.

```
{"id": "TX-000001", "type": "expense", "date": "2024-01-15", "amount": 15000}
{"id": "TX-000002", "type": "income", "date": "2024-01-14", "amount": 3000000}
```

```python
import json
obj = json.loads(line)          # text → Python dictionary
text = json.dumps(obj, ensure_ascii=False)  # dictionary → text
```

## CSV

A format that splits cells with commas, like Excel. The import/export schema is fixed to CSV.

```python
import csv
with open("export.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["date", "type", "category", "amount", "memo", "tags"])  # header
    writer.writerow(["2024-01-15", "expense", "food", 15000, "lunch", "meal"])
```

> For storage you can choose **one** of JSONL or CSV, but import/export is **fixed to the CSV schema**.
> (Tip: if you use CSV for both, you can reuse import/export without any conversion.)

## Summary

| Concept | Summary |
| --- | --- |
| JSONL/CSV | One record per line / an Excel-style table |

> Source: [Codyssey-B1/B2-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B2-1)
