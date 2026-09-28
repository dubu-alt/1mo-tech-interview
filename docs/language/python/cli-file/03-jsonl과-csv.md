---
title: "JSONL과 CSV - 저장 파일 형식"
sidebar: "JSONL과 CSV"
---

## JSONL (JSON Lines)

한 줄에 데이터 하나(JSON 형태). Python의 딕셔너리와 거의 1:1로 변환되어 편합니다.

```
{"id": "TX-000001", "type": "expense", "date": "2024-01-15", "amount": 15000}
{"id": "TX-000002", "type": "income", "date": "2024-01-14", "amount": 3000000}
```

```python
import json
obj = json.loads(line)          # 글자 → 파이썬 딕셔너리
text = json.dumps(obj, ensure_ascii=False)  # 딕셔너리 → 글자
```

## CSV

엑셀처럼 쉼표로 칸을 나눈 형식. import/export 스키마는 CSV로 고정되어 있습니다.

```python
import csv
with open("export.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["date", "type", "category", "amount", "memo", "tags"])  # 헤더
    writer.writerow(["2024-01-15", "expense", "food", 15000, "점심", "meal"])
```

> 저장은 JSONL 또는 CSV 중 **1개** 선택하면 되지만, import/export는 **CSV 스키마로 고정**입니다.
> (팁: 둘 다 CSV로 하면 변환 없이 import/export를 재활용할 수 있습니다.)

## 정리

| 개념 | 요약 |
| --- | --- |
| JSONL/CSV | 한 줄에 한 건씩 / 엑셀식 표 |

> 출처: [Codyssey-B1/B2-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B2-1)
