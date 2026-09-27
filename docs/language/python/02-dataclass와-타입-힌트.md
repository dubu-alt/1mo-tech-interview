---
title: "dataclass & 타입 힌트"
---

데이터를 담는 상자(dataclass)와, 함수가 주고받는 값의 타입을 표시하는 타입 힌트를 함께 정리합니다.

## dataclass - 데이터 담는 그릇

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

- `@dataclass`를 붙이면 `__init__`(상자 초기화 코드)을 자동으로 만들어줌
- 요구사항: 데이터 모델은 dataclass 또는 그에 준하는 구조로 정의

## 타입 힌트 - 함수의 설명서

위 `Transaction`의 `id: str`, `amount: int`처럼 타입을 적어두는 표기는 함수에도 쓸 수 있습니다.

타입 힌트 = "이 함수는 이런 타입을 받아서 이런 타입을 돌려준다"고 표시하는 것.

```python
def get_month_summary(month: str) -> dict:
    ...

def add_transaction(amount: int, category: str) -> Transaction:
    ...
```

- `month: str` = month는 글자여야 함, `-> dict` = 결과는 딕셔너리
- 실행할 때 강제력은 약하지만, **잘못된 사용을 미리 잡아주고**(에디터 경고), **읽는 사람이 바로 이해**됩니다
- 이게 "입출력 계약"입니다: 함수끼리 주고받는 약속을 코드에 명시

## 정리

| 개념 | 비전공자 버전 요약 |
|------|-------------------|
| dataclass | 데이터를 담는 정형화된 상자 |
| 타입 힌트 | 함수 입출력의 설명서/약속 |

> 출처: [Codyssey-B1/B2-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B2-1)
