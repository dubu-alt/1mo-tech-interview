---
title: "프로세스 & 스레드 (Process & Thread)"
---

### 비유: 식당으로 이해하기

```
프로세스 = 식당 전체
┌─────────────────────────────────┐
│           식당 (Process)         │
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │웨이터1│ │웨이터2│ │웨이터3│   │ ← 스레드들
│  │Thread│ │Thread│ │Thread│   │
│  └──────┘ └──────┘ └──────┘   │
│                                 │
│  [공유 주방 = 공유 메모리(Heap)] │ ← 모든 스레드가 같은 Heap 사용!
└─────────────────────────────────┘
```

> **이 문서의 위험 포인트**
> `MULTI_THREAD_ENABLE=True` 상태에서
> 여러 스레드가 **같은 Heap**에 동시 접근
> → 메모리 누수가 더 빠르게 진행될 수 있음

### 멀티스레드 환경의 추가 위험

```
Thread 1: malloc(25MB) ──┐
Thread 2: malloc(25MB) ──┼──→ Heap 동시 접근
Thread 3: malloc(25MB) ──┘    (동기화 없으면 더 위험!)

경고 메시지가 나온 이유:
"POTENTIAL DEADLOCK IN CONCURRENT MODE"
→ 스레드들이 서로 자원을 기다리다 멈출 수 있음
```

---


> 출처: [Codyssey-B1/B4-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B4-2)