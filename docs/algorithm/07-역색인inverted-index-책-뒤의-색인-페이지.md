# 역색인(Inverted Index) - 책 뒤의 색인 페이지

**문제**: "login이 들어간 커밋 찾아줘" 할 때마다 커밋 10만 개를 하나씩 읽으면 느림 (O(n)).

**해결**: 커밋을 만들 때 **미리 단어별 목록**을 만들어두기.

```
keyword_index:
  "login"   → [d4e5f6, ...]
  "payment" → [g7h8i9, ...]
author_index:
  "Alice"   → [a1b2c3, d4e5f6, g7h8i9]
```

검색할 땐 딱 그 단어의 목록만 꺼내면 됨 → 사실상 O(1) 조회 + 결과 개수만큼만 출력.

- 키워드 정규화 규칙: 메시지를 공백 split → 전부 소문자(lower)
- `COMMIT`할 때마다 두 인덱스를 **갱신**해주는 게 포인트

---


> 출처: [Codyssey-B1/B5-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B5-2)