---
title: "origin과 upstream (리모트 브랜치)"
sidebar: "origin과 upstream"
---

> **git remote add origin https://github.com/username/Math_Box.git**

> **git push -u origin master**

로컬 레포지토리를 GitHub에 처음 올릴 때 흔히 복사-붙여넣기로 실행하는 위 2개의 커맨드가 정확히 무슨 뜻인지 알아보겠습니다.

## 1. origin이란?

먼저 첫 번째 커맨드를 봅시다.

> **git remote add origin https://github.com/username/Math_Box.git**

이 커맨드에서 **remote**는 리모트 레포지토리에 관한 작업을 할 때 쓰는 커맨드입니다.

그리고 그 뒤의 **add**는 새로운 리모트 레포지토리를 등록하겠다는 뜻입니다.

그 다음에는 **origin https://github.com/username/Math_Box.git**이라고 써있죠?

이 표현은 **https://github.com/username/Math_Box.git** 리모트 레포지토리를 **origin**이라는 이름으로 등록하겠다는 뜻입니다.

그러니까 이 커맨드를 실행하고 나면 **https://github.com/username/Math_Box.git**를 **origin**으로 간단하게 나타낼 수 있게 되는 거죠.

그럼 왜 하필 **origin**이라고 하는 걸까요? origin이 아닌 여러분이 원하는 다른 단어를 입력해도 큰 상관은 없습니다. 하지만 Git에서는 리모트 레포지토리를 최초로 추가할 때 origin이라는 이름으로 가리키는 것이 관례화되어 있습니다.

origin은 ‘근원’, ‘기원’이라는 뜻을 가집니다. 아마도 다른 사람의 리모트 레포지토리를 자신의 컴퓨터로 가져와서 작업을 하는 사람의 입장에서는 리모트 레포지토리가 프로젝트의 근원이 되는 존재이기 때문에 그런 관습이 생긴 것으로 추측됩니다.

사실

> git remote add **hello** https://github.com/username/Math_Box.git

처럼 origin 대신 우리가 원하는 단어(hello)를 써도 상관은 없지만, 되도록 관례에 따라 origin을 써주는 게 좋겠죠?

## 2. Remote Repository에 있는 브랜치

이제 두 번째 커맨드를 설명해드릴게요.

> **git push -u origin master**

이 커맨드의 뜻은

- 현재 로컬 레포지토리에 있는 master 브랜치의 내용(=master 브랜치와 관계된 모든 커밋들)을
- origin이라는 리모트 레포지토리로 보낸다는 뜻입니다.

이때 같은 이름의 브랜치로 전송하게 되는데 만약 origin이라는 리모트 레포지토리에 master 브랜치가 **없으면 master 브랜치를 새로 생성하고 푸시합니다.**
그런데 여기서 옵션 **-u**는 무슨 뜻일까요? **-u**는 **--set-upstream**이라는 옵션의 약자입니다.

이렇게 **--set-upstream(-u) 옵션**을 주면

- 로컬 레포지토리에 있는 master 브랜치가
- origin에 있는 master 브랜치를 **tracking(추적)**하는 걸로 설정됩니다.

**tracking이라는 건 로컬 레포지토리의 한 브랜치가 리모트 레포지토리의 한 브랜치와 연결되어 그것을 계속 바라보는 상태가 되는 것**이라고 생각하시면 됩니다. 이렇게 맺어진 연결 상태를 **tracking connection**이라고 합니다.

만약

- 로컬 레포지토리에 A라는 브랜치가 있고,
- 리모트 레포지토리에 B라는 브랜치가 있을 때
- 이런 **tracking connection**이 서로 맺어진 경우,
- B 브랜치를 A 브랜치의 **upstream branch**라고 합니다.
- 지금은 구별하기 위해서 A와 B라고 표현했지만 보통은 같은 이름인 경우가 대부분입니다.

이렇게 **tracking connection**이 한번 설정되고 나면,
사용자가 현재 master 브랜치에 위치해있을 때,

```bash
git push
```

라고만 써도 자동으로 리모트 레포지토리의 master 브랜치를 대상으로 git push가 동작하고,

```bash
git pull
```

라고만 써도 리모트 레포지토리의 master 브랜치를 대상으로 git pull이 동작합니다.

사실 **--set-upstream(-u)** 옵션을 주지 않아도 그 후에 git push와 git pull을 할 수 있기는 합니다. 하지만 맨 처음에 이 옵션을 주지 않으면 tracking connection이 없기 때문에 나중에 git push를 하고 싶을 때

```bash
git push origin master:master
```

이런 식으로 적어줘야 합니다. 여기서

- origin은 리모트 레포지토리를 나타내고,
- master:master에서 더 먼저 나오는 master는 로컬 레포지토리의 master 브랜치(~에서)/더 뒤에 나오는 master는 리모트 레포지토리의 master 브랜치(~으로)를 나타냅니다.

그러니까 tracking connection이 없으면 매번 이런 식으로 git push를 해줘야 합니다. git pull도 마찬가지로 이런 식의 복잡한 표현이 필요하게 됩니다.

그러니까 그냥 처음부터 tracking connection을 설정하고 그 이후부터는 git push, git pull이라고만 써서 편하게 푸시와 풀을 하는 게 좋겠죠? 이게 바로 제가 맨 처음에 로컬 레포지토리의 내용을 리모트 레포지토리로 보낼 때 -u라는 옵션을 썼던 이유입니다.

## 3. origin/master의 의미

자, 이제

- 로컬 레포지토리의 master 브랜치
- 리모트 레포지토리의 master 브랜치

이렇게 같은 이름이지만, 서로 다른 2개의 브랜치가 있다는 걸 알겠죠?

그럼 리모트 레포지토리에 있는 master 브랜치는 어떻게 볼 수 있을까요? GitHub 페이지에서 보면 될 겁니다.

하지만 제 컴퓨터에서도 확인할 수 있는 방법이 있습니다. 잠깐 커밋 히스토리를 살펴보면

![](/images/git/d2b845d7b2c2.png)

위 그림에서

- **master**가 로컬 레포지토리의 master 브랜치를 나타내고
- **origin/master**가 리모트 레포지토리의 master 브랜치를 나타냅니다.

이때까지 로컬 레포지토리의 master 브랜치에서 여러 커밋을 했지만 그러고나서 git push를 해준 적은 없었습니다. 그래서 위 그림처럼 **origin/master**가 **master**보다 이전의 커밋을 가리키고 있는 겁니다.

master, premium 브랜치 둘 다에서 리모트 레포지토리로 **git push** 하겠습니다. 그러고 나면 이제 origin/master도 master와 같은 커밋을 가리키게 될 것입니다.

## 정리

- `git remote add origin <주소>`: 리모트 레포지토리를 origin이라는 이름으로 등록 (origin은 관례)
- `git push -u origin master`: master를 올리면서 리모트 master를 **upstream**으로 연결(tracking)
- 한 번 연결하면 이후에는 `git push`, `git pull`만 입력해도 됨
- `origin/master` = 내 컴퓨터에서 보이는 리모트 master 브랜치의 위치

> 참고: 개인 Notion 학습 노트 (Git 공부)
