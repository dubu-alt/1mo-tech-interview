---
title: "REPL - 대화형 프로그램 만들기"
---

REPL = Read(읽기) → Eval(실행) → Print(출력) → Loop(반복).

```python
while True:
    line = input("mini-redis> ")   # 1. Read: 입력받기
    if line.strip().lower() in ("exit", "quit"):
        break                       # 종료 조건
    result = execute(line)          # 2. Eval: 파싱해서 실행
    print(result)                   # 3. Print: 출력
                                    # 4. Loop: 반복
```

파싱은 `line.split()`으로 쪼개되, `"Alice"`처럼 따옴표로 감싼 값은 따옴표를 벗겨서 처리하면 됩니다.

---


> 출처: [Codyssey-B1/B5-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B5-1)