# OOM (Out of Memory)

### 비유: 주차장이 꽉 찬 상황

> 주차장(메모리)이 꽉 찼는데 새 차(프로세스)가 들어오려 함
> → 관리인(OS)이 강제로 차를 견인(프로세스 종료)

```
OOM 발생 흐름:

메모리 요청
    │
    ▼
사용 가능한 메모리 있음? ──YES──→ 할당 성공 ✅
    │
    NO
    │
    ▼
스왑(Swap) 공간 있음? ──YES──→ 스왑 사용 (느려짐 ⚠️)
    │
    NO
    │
    ▼
OOM Killer 발동! 💀
    │
    ▼
희생 프로세스 선택 → SIGKILL 전송 → 강제 종료
```

### Linux OOM Killer vs 이 문서의 MemoryGuard

| 구분 | Linux OOM Killer | MemoryGuard (이 문서) |
|------|-----------------|----------------------|
| 주체 | OS 커널 | 애플리케이션 자체 |
| 발동 조건 | 시스템 전체 메모리 부족 | 프로세스 한계치 도달 |
| 목적 | 시스템 보호 | 프로세스 자기 보호 |
| 신호 | SIGKILL | SIGKILL (자기 자신에게) |

---


> 출처: [Codyssey-B1/B4-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B4-2)