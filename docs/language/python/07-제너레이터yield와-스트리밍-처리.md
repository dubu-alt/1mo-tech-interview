---
title: "제너레이터(yield)와 스트리밍 처리"
---

**문제**: 파일에 내역이 100만 줄이 있으면, 전부 메모리에 올리면 오래 걸리고 메모리도 많이 먹습니다.

**해결**: **한 줄씩 흘려보내기**. 물을통째로 붓지 않고 수도꼭지처럼 조금씩 틀어주는 방식.

```python
def read_lines(path):
    """파일을 한 줄씩 순서대로 넘겨주는 제너레이터"""
    with open(path, encoding="utf-8") as f:
        for line in f:              # 파일 전체를 메모리에 올리지 않고
            yield line              # 한 줄씩 '흘려보낸다'
```

- 일반 함수는 `return`으로 값을 한 번에 돌려주지만,
- **`yield`**를 쓰면 값을 하나 넘기고 잠깐 멈췄다가, 다음 요청 때 이어서 실행됩니다.

```python
for tx in read_lines("data/transactions.jsonl"):
    if 조건(tx):
        print(tx)   # 필요한 만큼만 읽으니 빠르고 가볍다
```

> 요구사항: `list`, `search`는 제너레이터 기반 스트리밍 처리로 구현

---


> 출처: [Codyssey-B1/B2-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B2-1)