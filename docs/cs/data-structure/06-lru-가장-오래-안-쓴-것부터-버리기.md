---
title: "LRU - 가장 오래 안 쓴 것부터 버리기"
---

**LRU (Least Recently Used)** = 메모리가 가득 차면 **가장 오래전에 마지막으로 사용된 데이터**부터 삭제하는 정책.

세 자료구조를 조합하면 됩니다:

| 구조 | 역할 |
|------|------|
| 해시맵 | key → 값 저장 (빠른 찾기) |
| 이중 연결 리스트 | 사용 순서 기록 (맨 앞 = 최신, 맨 뒤 = 가장 오래됨) |
| 힙 | TTL 만료 추적 (별개 담당) |

동작 흐름:
1. `SET` 성공 → 리스트 **move_to_front** (최신 표시)
2. `GET` 성공 → 리스트 **move_to_front**
3. `SET` 후 used_memory > maxmemory → 리스트 **맨 뒤부터**(가장 오래된 것) 제거, `evicted_keys += 1`

해시맵 덕분에 "이 키가 리스트 어디 있나"를 O(1)에 알 수 있고,
연결 리스트 덕분에 이동/삭제도 O(1)입니다. **둘의 조합이 LRU를 O(1)로 가능하게 합니다.**

used_memory는 요구 공식대로: `len(key.encode('utf-8')) + len(value.encode('utf-8'))`의 합계.

---


> 출처: [Codyssey-B1/B5-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B5-1)