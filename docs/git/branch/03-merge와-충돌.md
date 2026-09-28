---
title: "Merge와 충돌 해결"
---

1. **브랜치 개념**
   - master 브랜치(무료 버전)와 premium 브랜치(유료 버전)로 작업을 분리해서 관리합니다.
2. **작업 흐름**
   - 무료 버전에 필요한 기능(divide 함수)을 master 브랜치에서 추가하고 커밋합니다.
   - 유료 버전에 같은 기능이 필요하다는 요구가 생기면 premium 브랜치에도 해당 기능을 반영해야 합니다.
3. **merge(병합)**
   - 직접 premium 브랜치에서 코드를 추가할 수도 있지만, Git의 merge 기능을 사용하면 master 브랜치에서 했던 커밋을 premium 브랜치로 쉽게 가져올 수 있습니다.
   - premium 브랜치로 이동한 뒤 `git merge master` 명령어를 사용하면 master 브랜치의 커밋 내용이 premium 브랜치에 반영됩니다.
   - merge 시, merge 커밋 메시지를 입력하는 창이 뜨는데 저장 후 종료하면 병합이 완료됩니다.
4. **결과**
   - premium 브랜치에서도 master 브랜치에서 추가했던 divide 함수가 보이게 됩니다.
   - merge는 다른 브랜치의 작업 내용을 현재 브랜치에 합치고 싶을 때 사용합니다.

## Merge Conflict (충돌 해결 방법)

1. Conflict가 발생한 파일을 연다
2. 머지의 결과가 되었으면 하는 모습대로 코드를 수정한다.
3. 커밋을 다시 시도한다.

## 여러개의 파일 Merge (충돌 해결 방법)

1. 파일 하나씩 conflict를 해결하고 **git add [파일 이름]** 커맨드로 하나씩 staging area에 올리거나
(중간중간에 git status 커맨드로 현재 상태 확인하면서)

2. 모든 파일들의 conflict를 다 해결하고, **git add .** 커맨드로 한번에 staging area에 올리고
3. 다시 커밋을 시도한다.

## 브랜치 머지(Merge) 자체를 취소하는 방법

```bash
git merge --abort
```

![](/images/git/c299a76caafe.png)

**머지를 시도하기 이전의 상태로 돌아가는 방법**으로 그냥 머지 자체를 취소하는 방법임.

## 정리

- `git merge 브랜치`: 다른 브랜치의 작업을 현재 브랜치에 합치기
- 충돌이 나면: 파일 열기 → 원하는 모습으로 수정 → `git add` → 다시 커밋
- `git merge --abort`: 머지 자체를 취소하고 이전 상태로 돌아가기

> 참고: 개인 Notion 학습 노트 (Git 공부)
