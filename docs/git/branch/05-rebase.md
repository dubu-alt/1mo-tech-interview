---
title: "rebase - 깔끔한 커밋 히스토리"
sidebar: "rebase"
---

## 1. 상황 설명

- **premium** 브랜치에서 작업하다가, 실험이 필요한 함수는 별도의 **test** 브랜치에서 작업함.
- 간단한 함수는 premium 브랜치에서 바로 추가하고, 실험이 끝난 코드는 test 브랜치에서 추가 후 premium에 반영함.

## 2. 기존 방식: git merge

- 브랜치를 합칠 때 주로 `git merge`를 사용함.
- merge를 하면 **새로운 merge 커밋**이 생깁니다.
- 커밋 히스토리 상에 브랜치가 나뉘었다 합쳐지는 모습이 남고, 조금 복잡해 보일 수 있음.

![**git merge [브랜치명]**](/images/git/d20afa789073.png)

## 3. rebase란?

- `git rebase`는 "커밋을 재배치"한다는 뜻임.
- 내가 있는 브랜치의 **베이스(기반)**를 다른 브랜치의 커밋으로 바꿔준다.
- 커밋 히스토리를 일직선으로 깔끔하게 만들어줌.
- rebase를 하면서 충돌(conflict)이 나면 merge처럼 직접 해결해주고, `git rebase --continue`로 계속 진행함.

![**git rebase [브랜치명]**](/images/git/c3276ddb2aee.png)

## 4. merge vs rebase 차이점

- **merge**: 히스토리에 branch가 합쳐지는 merge 커밋이 남음 → 분기와 합쳐진 흔적이 보임.
- **rebase**: 새로운 커밋을 만들지 않고, 한 줄로 쭉 이어지는 히스토리로 보임 → 깔끔함.
- 결과(코드)는 같지만 커밋 히스토리 구조가 다름.

![](/images/git/de8f9ee2243c.png)

![](/images/git/c22ec4c4b1a4.png)

## 5. 언제 merge, 언제 rebase?

- 합쳤다는 이력이 꼭 필요하다면 **merge** 사용.
- 커밋 히스토리를 한 줄로 예쁘게 유지하고 싶다면 **rebase** 사용.

![](/images/git/f5b21c7a133c.png)

![](/images/git/c23bef33284b.png)

## 정리

| | merge | rebase |
| --- | --- | --- |
| 히스토리 | 갈라졌다 합쳐진 흔적 + merge 커밋이 남음 | 한 줄로 이어짐 |
| 언제 | 합쳤다는 이력이 필요할 때 | 히스토리를 깔끔하게 유지하고 싶을 때 |

> 참고: 개인 Notion 학습 노트 (Git 공부)
