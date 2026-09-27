---
title: "가비지 컬렉션 (Garbage Collection)"
---

### 비유: 자동 청소부 vs 수동 청소

```
언어별 메모리 관리 방식:

C/C++ (수동)          Python/Java (자동 GC)
개발자가 직접 청소     청소부(GC)가 알아서 청소

malloc() → 할당       new Object() → 할당
...사용...            ...사용...
free()   → 해제 ✋    // 자동으로 해제됨 🤖
          ↑
       잊으면 누수!
```

### GC가 있어도 누수가 생기는 경우

```python
# Python에서도 누수 가능한 패턴!
cache = []  # 전역 리스트

def 문제있는함수():
    data = [0] * (25 * 1024 * 1024)  # 25MB
    cache.append(data)  # 전역에 추가
    # GC가 있어도 cache가 참조 중이라 해제 못 함!
    # → 참조가 남아있으면 GC도 수거 불가
```

> **GC의 한계**: 참조(Reference)가 남아있으면 수거 불가
> → 이 문서에서 "가비지 컬렉션 개선" 권장사항이 나온 이유

---


> 출처: [Codyssey-B1/B4-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B4-2)