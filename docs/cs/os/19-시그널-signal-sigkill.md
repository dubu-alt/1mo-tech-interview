---
title: "시그널 (Signal) - SIGKILL"
---

### 비유: 프로세스에게 보내는 메시지

```
Signal 종류:
┌──────────┬──────────────────────────────────────────┐
│ SIGTERM  │ "정리하고 종료해줘" (부드러운 요청)        │
│ SIGKILL  │ "즉시 종료!" (거부 불가, OS가 강제 실행)   │
│ SIGINT   │ "Ctrl+C" (인터럽트)                       │
│ SIGSEGV  │ "잘못된 메모리 접근!" (세그폴트)           │
└──────────┴──────────────────────────────────────────┘

이 문서:
MemoryGuard → SIGKILL → 프로세스 ID 7 즉시 종료
                ↑
         핸들러 등록 불가
         = 프로세스가 막을 방법 없음
```

---


> 출처: [Codyssey-B1/B4-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B4-2)