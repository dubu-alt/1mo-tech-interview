---
title: "💧 메모리 누수 (Memory Leak)"
---

### 비유: 욕조에 물을 받는데 마개를 안 뽑는 것

```
정상적인 메모리 사용:          메모리 누수:

malloc() → 할당 🪣             malloc() → 할당 🪣
사용...                        사용...
free()   → 해제 🚿             free() 없음! ❌

[물 받고 → 빼고 → 반복]        [물 받고 → 받고 → 받고 → 넘침!]
```

### 코드로 보는 차이

```c
// 정상: 할당 후 해제
void 정상함수() {
    char* data = malloc(25MB);  // 할당
    // ... 사용 ...
    free(data);                 // ← 반드시 해제!
}

// ❌ 누수: 해제 없음
void 누수함수() {
    char* data = malloc(25MB);  // 할당
    // ... 사용 ...
    // free(data); ← 이게 없음!
}   // 함수 끝나도 메모리는 그대로 점유 중
```

### 이 문서에서의 패턴

```
T+2초:  malloc(25MB)  free 없음 → 25MB 점유
T+5초:  malloc(25MB)  free 없음 → 50MB 점유
T+8초:  malloc(25MB)  free 없음 → 75MB 점유
T+11초: malloc(25MB)  free 없음 → 100MB 점유 → 종료
```

---


> 출처: [Codyssey-B1/B4-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B4-2)