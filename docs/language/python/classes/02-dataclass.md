---
title: "dataclass - 데이터 담는 그릇"
sidebar: "dataclass"
---

거래 내역 하나에는 여러 정보가 들어갑니다: id, 날짜, 타입, 카테고리, 금액...

이걸 그냥 변수 여러 개로 관리하면 헷갈립니다. **dataclass**는 "이런 정보를 담는 상자"를 선언하는 방법입니다.

```python
from dataclasses import dataclass

@dataclass
class Transaction:
    """거래 내역 하나를 담는 상자"""
    id: str            # 거래 고유 번호
    type: str          # income(수입) 또는 expense(지출)
    date: str          # YYYY-MM-DD 형식
    amount: int        # 양수만 허용
    category: str      # food, transport 등
    memo: str = ""     # 선택 사항 (없으면 빈 문자열)
    tags: list = None  # 선택 사항
```

- `@dataclass`를 붙이면 `__init__`(상자 초기화 코드, [클래스 기초](./01-클래스-기초) 참고)을 자동으로 만들어줌
- 요구사항: 데이터 모델은 dataclass 또는 그에 준하는 구조로 정의

## 정리

| 개념 | 요약 |
| --- | --- |
| dataclass | 데이터를 담는 정형화된 상자 |

> 출처: [Codyssey-B1/B2-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B2-1)
