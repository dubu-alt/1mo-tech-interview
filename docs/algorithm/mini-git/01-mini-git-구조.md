---
title: "Mini Git 구조 (커밋 · 브랜치 · HEAD · 명령 파싱)"
sidebar: "Mini Git 구조"
---

Mini Git을 만들 때 기본 뼈대가 되는 커밋, 브랜치와 HEAD, 그리고 명령을 입력받아 실행하는 REPL과 명령 파싱을 한 페이지에 모았습니다.

## Git과 커밋이란?

**Git** = 파일들의 변경 이력을 기록하는 도구.
**커밋(commit)** = "이 시점의 스냅샷 저장" 한 건. 누가(author), 언제(timestamp), 무슨 이유(message)로 저장했는지 메타데이터를 가집니다.

커밋은 **부모 커밋**을 가리킵니다: "이 변경은 저 변경 다음이다".
이 부모 가리키기가 쌓이면 **그래프**가 됩니다.

```
[초기커밋] ← [로그인추가] ← [결제추가]   (화살표는 자식→부모)
```

이 미션에서는 파일 내용 자체는 안 따지고, **이 메타데이터 그래프**만 만듭니다.

## 브랜치와 HEAD - "지금 어디 작업 중?" 표시판

- **브랜치(branch)** = 어떤 커밋 하나를 가리키는 이름표. 병렬 작업용.
- **HEAD** = "내가 지금 서 있는 위치". 현재 체크아웃된 브랜치(또는 커밋)를 가리킴.

```
main      ──→ [c3 결제추가]
feature   ──→ [c2 로그인추가]
HEAD ──→ main
```

동작:
- `BRANCH feature`: 지금 HEAD가 보는 커밋을 feature도 함께 가리키게 함 (복사 X, 같은 커밋 공유)
- `SWITCH feature`: HEAD만 feature로 옮김
- `COMMIT`: 새 커밋을 만들고, 그 부모를 현재 HEAD 커밋으로 설정 + 현재 브랜치가 새 커밋을 가리키게 갱신

> 구현 팁: 커밋 조회가 빨라야 하니 "hash → 커밋 객체" 조회는 dict 사용 가능합니다.

## REPL과 명령 파싱

이렇게 만든 커밋·브랜치 구조는 사용자가 입력한 명령을 받아 실행하는 REPL을 통해 조작합니다.

```python
while True:
    line = input("mini-git> ")
    if line.strip().lower() in ("exit", "quit"):
        break
    tokens = smart_split(line)   # 따옴표 안 공백은 하나의 인자로
    run(tokens)
```

파싱 주의점:
- `COMMIT "Add login feature"` → `"Add login feature"`는 **따옴표째 하나의 인자**. 단순 `.split()`으로는 안 되고, 따옴표를 인식하는 분리 함수 필요
- 명령어 비교 전 `.upper()`로 통일 (대소문자 무시 요구사항)
- `--author=Alice`, `--sort-by=date` 같은 옵션은 `=` 기준으로 key/value 분리

## 이 과제에 쓰인 알고리즘

Mini Git을 만들며 쓴 알고리즘은 개념별 분류로 옮겨 두었습니다. 각 글 끝의 "Mini Git에서 써 보기"에 과제용 내용이 그대로 있습니다.

| 명령 | 쓰인 알고리즘 | 글 |
|------|--------------|-----|
| `LOG` | 위상 정렬 (부모 커밋 먼저) | [DAG와 위상 정렬](/algorithm/graph/03-dag와-위상-정렬) |
| `PATH`, `ANCESTORS` | BFS 최단 경로, DFS 조상 찾기 | [DFS & BFS](/algorithm/search/02-dfs와-bfs) |
| `LOG --sort-by` | 병합 정렬 (`sorted()` 금지) | [병합 정렬](/algorithm/sort/05-병합-정렬) |
| `SEARCH` | 역색인 | [역색인](./02-역색인) |

## 정리

| 개념 | 비전공자 버전 요약 |
|------|-------------------|
| 커밋/DAG | "누가 언제 뭘 했다" 기록 + 루프 없는 부모 가리키기 |
| 브랜치/HEAD | 커밋을 가리키는 이름표 / 내 현재 위치 |
| REPL | 입력→실행→출력 무한 반복 대화창 |

> 출처: [Codyssey-B1/B5-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B5-2)
