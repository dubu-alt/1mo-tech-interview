---
title: "콘솔 프로그램과 CLI (argparse)"
sidebar: "콘솔 프로그램과 CLI"
---

콘솔 프로그램이 무엇인지부터, 사용자가 입력한 명령어를 `argparse`로 파싱하는 방법까지 정리합니다.

## 콘솔 프로그램이란?

마우스로 클릭하는 프로그램(GUI)과 달리, **글자(명령어)를 입력해서** 사용하는 프로그램입니다.

- 윈도우: `명령 프롬프트` 또는 `PowerShell`
- 맥: `터미널(Terminal)`

우리가 만들 가계부는 이렇게 사용합니다:

```
python -m budget_app add      ← "add 명령 실행해줘" 라는 뜻
python -m budget_app list     ← "목록 보여줘"
```

## CLI와 명령어 파싱 (argparse)

이렇게 입력된 명령어를 프로그램이 이해하려면 파싱이 필요합니다.

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

## 정리

| 개념 | 비전공자 버전 요약 |
|------|-------------------|
| 콘솔 프로그램 | 클릭(GUI) 대신 글자 명령어로 사용하는 프로그램 |
| CLI/argparse | 글자 명령을 받아서 쪼개주는 접수원 |

> 출처: [Codyssey-B1/B2-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B2-1)
