# 데드락 (Deadlock)

### 비유: 좁은 골목에서 마주친 두 차

```
Thread A가 가진 것: 자원 🔑1
Thread A가 필요한 것: 자원 🔑2

Thread B가 가진 것: 자원 🔑2
Thread B가 필요한 것: 자원 🔑1

결과:
Thread A: "🔑2 줘!" → Thread B: "🔑1 먼저 줘!"
Thread B: "🔑1 줘!" → Thread A: "🔑2 먼저 줘!"

→ 둘 다 영원히 대기... 💀 데드락!
```

### 데드락 발생 4가지 조건 (모두 만족해야 발생)

```
1. 상호 배제 (Mutual Exclusion)
   → 자원을 한 번에 하나의 스레드만 사용 가능

2. 점유 대기 (Hold and Wait)
   → 자원을 가진 채로 다른 자원을 기다림

3. 비선점 (No Preemption)
   → 강제로 자원을 빼앗을 수 없음

4. 순환 대기 (Circular Wait)
   → A→B→C→A 형태로 순환하며 대기
```

---


> 출처: [Codyssey-B1/B4-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B4-2)