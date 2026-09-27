---
title: "CLI와 명령어 파싱 (argparse)"
---

**파싱(parsing)** = 사용자가 입력한 글자를 의미별로 쪼개서 이해하는 것.

```
python -m budget_app list --limit 3 --data-dir ./mydata
       └─모듈 이름┘   └명령┘ └──옵션──┘ └────옵션────┘
```

Python에는 **`argparse`**(표준 라이브러리)라는 도구가 있어서 이 쪼개기 작업을 대신 해줍니다.

```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("command")                      # add, list 같은 명령어
parser.add_argument("--limit", type=int, default=10) # --limit 옵션 (기본값 10)
args = parser.parse_args()
print(args.command, args.limit)
```

- `--help` 옵션은 argparse가 **알아서 만들어줍니다** (요구사항 충족!)
- 요구사항에서 옵션 표기를 `--`(두 개)로 통일하라고 한 이유: 리눅스 세계의 표준 규칙이라서

---


> 출처: [Codyssey-B1/B2-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B2-1)