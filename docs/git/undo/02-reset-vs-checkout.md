---
title: "reset vs checkout (Detached HEAD)"
sidebar: "reset vs checkout"
---

## 1. git reset 복습

[git reset](./01-reset) 글에서 본 것처럼, 아래 그림과 같은 상태에서

![](/images/git/c5f5ca27f07d.png)

> git reset 9033

를 실행하면

![](/images/git/fd8f3ed70e09.png)

이 그림과 같은 결과가 된다고 했습니다. 이렇게 HEAD는 **보통** 본인이 직접 커밋을 가리키는 게 아니라 브랜치를 통해서 **간접적으로 커밋을 가리킵니다.**

## 2. git checkout이 하는 일

하지만 HEAD 자체가 가리키던 것을 바꿀 수도 있습니다. 사실 HEAD가 아예 커밋을 직접적으로 가리키게 하는 것도 가능한데요.

바로 **git checkout** 커맨드를 쓰면 됩니다.

![](/images/git/c902312c31a0.png)

원래의 이 상태에서

> git checkout 9033

를 실행하면 아래 그림처럼 바뀝니다.

![](/images/git/c8bb3e057b7d.png)

이 그림을 자세히 보세요. 이제 HEAD가 master 브랜치를 가리키는 게 아니라 본인이 직접 **9033.. 커밋**을 가리키고 있죠?

이렇게 브랜치를 통해서 커밋을 가리키는 게 아니라 본인이 직접 커밋을 가리키고 있는 상태의 HEAD를 특별히 가리키는 말이 있습니다.

바로 **Detached HEAD**입니다. Detached는 우리말로 ‘~로부터 떨어진, 분리된’이라는 뜻을 갖는데요. 브랜치로부터 떨어진 상태이기 때문에 이렇게 부르는 겁니다.

이렇게 HEAD가 특정 커밋을 직접 가리키게 하는 이유는 여러가지가 있을 수 있는데요.

그 중에서 주된 이유 한 가지는 바로 과거의 특정 커밋에서 새로운 브랜치를 만들고 싶을 때입니다.

예를 들어 지금 위의 그림과 같이 Detached HEAD인 상태에서

> git branch premium

으로 premium 브랜치를 새로 만들면 아래 그림과 같은 결과가 됩니다.

![](/images/git/c9836a379433.png)

1. 지금 premium이라는 브랜치가 새로 생성되었고
2. premium 브랜치는 HEAD가 가리키던 커밋을 똑같이 가리키게 됩니다.

자, 그리고 여기서 새로운 사실을 하나 알려드릴게요.

git checkout 커맨드로는

- HEAD가 커밋을 직접적으로 가리키게 할 수도 있을 뿐만 아니라
- 브랜치를 직접 가리키게 만들 수도 있습니다.

HEAD가 브랜치를 가리키도록 해볼게요. 이렇게 쓰면

> git checkout premium

HEAD가 premium 브랜치를 가리키게 됩니다.

그러니까 아래 그림과 같이 이제 HEAD가 premium 브랜치를 가리키게 되는 겁니다. 그리고 이것은 곧 Detached HEAD 상태에서 벗어나 HEAD가 브랜치를 가리키는 정상적인 상태로 돌아오는 거죠.

![](/images/git/c4c320aab863.png)

그리고 이렇게 HEAD가 premium 브랜치를 가리키는 상태일 때 **새 커밋**을 하면

![](/images/git/c0089b1b3edd.png)

**이제 premium 브랜치로 master 브랜치와 다른 새로운 코드 관리 흐름을 가져갈 수 있게 되는 겁니다.**

방금 한 것처럼 특정 커밋을 시작점으로 하는 새로운 브랜치를 만들고 싶을 때 HEAD를 잠시 Detached HEAD 상태로 두는 경우가 많습니다.

이 내용을 정리하면

- git checkout 커맨드로는 HEAD가 직접적으로 가리키는 것을 바꿀 수 있고
- git checkout 뒤에는 커밋 아이디 또는 브랜치의 이름을 줘서
- HEAD가 직접 커밋을 가리키거나, 브랜치를 가리키도록 할 수 있다는 뜻입니다.

그런데 사실 git checkout 뒤에 브랜치의 이름이 오는 경우는 이미 우리가 배웠습니다. 우리가 어떤 브랜치로 가고 싶을 때

```bash
git checkout [가고 싶은 브랜치 이름]
```

형식의 커맨드를 쓴다고 배웠죠?

이제 이 커맨드가 좀 새로운 시각에서 느껴지지 않나요? 자, 그림으로 바로 보여드릴게요.

지금 위 그림과 같은 상태에서

> git checkout master

를 실행하면

![](/images/git/f6cea80b2d3e.png)

이렇게 HEAD가 master 브랜치를 가리키게 됩니다. 바로 이게 우리가 이전에 **git checkout 커맨드를 사용해서 다른 브랜치로 이동할 때 벌어지는 일**이었던 겁니다.

이렇게

- HEAD가 다른 브랜치가 가리키던 커밋을 가리키게 되면
- 그에 맞게 working directory 내부도 바뀌게 되고,
- 그 결과 우리는 브랜치가 변경되었다는 걸 실감할 수 있었던 겁니다.

이해하기 쉽게 다시 한번 풀어서 말하자면

```bash
git checkout master
```

이 커맨드의 뜻은 다음과 같이 해석됩니다.

= master 브랜치로 이동하라

= HEAD가 master 브랜치를 가리키도록 하라

= HEAD가 master 브랜치가 가리키던 커밋을 간접적으로 가리키게 됨으로써

= working directory의 내부도 그 커밋에 맞게 변함으로써

= master 브랜치로 이동한 것을 사용자는 실감하게 됨

이렇게 되는 거죠.

자, git checkout의 비밀을 이제 알겠죠?

## 3. git reset vs git checkout

마지막으로 git reset과 git checkout의 차이점을 짚고 넘어갈게요.
둘의 차이점은 아래 표와 같습니다.

| **git reset** | **git checkout** |
| --- | --- |
| **HEAD가 가리키던 브랜치가 다른 커밋을 가리키도록 한다** | **HEAD 자체가 다른 커밋이나 브랜치를 가리키도록 한다** |
| **HEAD도 결국 간접적으로 다른 커밋을 가리키게되는 효과가 생긴다** | **브랜치를 통하지 않고, 커밋을 직접적으로 가리키는 HEAD를 Detached HEAD라고 한다** |

## 정리

| git reset | git checkout |
| --- | --- |
| HEAD가 가리키던 **브랜치**를 다른 커밋으로 옮김 | **HEAD 자체**가 다른 커밋이나 브랜치를 가리키게 함 |
| HEAD는 계속 같은 브랜치를 가리킴 | 커밋을 직접 가리키면 Detached HEAD 상태 |

> 참고: 개인 Notion 학습 노트 (Git 공부)
