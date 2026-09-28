---
title: "reflog - 커밋 아이디를 모를 때"
sidebar: "reflog"
---

![](/images/git/eba677f60e8c.png)

## git reflog (git Reference Log)란?

- **git reflog**는 Git에서 HEAD, 브랜치 등의 레퍼런스(참조)가 이동한 모든 기록을 보여주는 명령어예요.
- 쉽게 말하면, "HEAD가 가리켰던 모든 커밋의 이력"을 시간순으로 기록해 놓은 로그라고 생각하면 돼요.

![](/images/git/e77eb28654cc.png)

## 주요 특징 및 활용

1. **헤드의 이동 이력 확인**
   - 커밋, 체크아웃, 리셋 등으로 HEAD가 이동할 때마다 그 기록이 남아요.
   - 실수로 브랜치를 옮기거나 커밋을 지워도, reflog에서 예전 위치를 찾을 수 있어요.
2. **커밋 복구**
   - `git reset`, `git checkout`, `git commit --amend` 등으로 인해 사라진(보이지 않는) 커밋도 되살릴 수 있어요.
   - 예를 들어, reset 때문에 사라진 커밋으로 쉽게 되돌아갈 수 있습니다.

      ```bash
      git reflog           # 로그에서 원하는 커밋 해시 또는 HEAD@{n} 확인
      git reset --hard HEAD@{2}   # 해당 위치로 복구
      ```

3. **커밋 아이디를 몰라도 확인 가능**
   - 커밋 해시를 까먹어도 reflog로 전체 이동 히스토리를 확인한 뒤, 원하는 지점에 다시 돌아갈 수 있어요.

## 사용 방법

1. 기본 사용

   ```bash
   git reflog
   ```

   - HEAD 기준 이동 이력을 보여줘요.
2. 원하는 지점으로 복구

   ```bash
   git reset --hard [커밋 아이디 또는 HEAD@{n}]
   ```

## 정리

- `git reflog`: HEAD가 가리켜 온 모든 위치의 기록
- reset 등으로 사라진 것처럼 보이는 커밋도 `git reset --hard HEAD@{n}`으로 복구 가능

> 참고: 개인 Notion 학습 노트 (Git 공부)
