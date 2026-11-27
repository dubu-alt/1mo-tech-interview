---
title: "안전한 API Key 관리 패턴"
sidebar: "안전한 API Key 관리 패턴"
---

LLM API를 쓰려면 API Key가 필요합니다. 이 키를 어디에 두고 어떻게 읽을지가 ai-gitgen에서 처음 정한 설계였습니다.

## 키를 코드에 쓰면 안 되는 이유

```python
API_KEY = "AIza..."              # 하드코딩: 커밋하는 순간 저장소에 남음
key = os.environ.get("AI_API_KEY")  # 환경변수: 코드에는 이름만 남음
```

- **저장소와 분리**: 코드를 공개 저장소에 올려도 키는 따라가지 않습니다. 한 번 커밋된 키는 지워도 히스토리에 남기 때문에 처음부터 넣지 않는 것이 맞습니다.
- **환경마다 다른 키**: 같은 코드로 내 PC, 팀원 PC, 서버에서 각자 다른 키를 씁니다.
- **교체가 쉬움**: 키가 새면 발급처에서 폐기하고 환경변수만 바꾸면 됩니다. 코드는 건드리지 않습니다.

## 여러 이름을 순서대로 찾기

ai-gitgen은 환경변수 세 개를 정해진 순서로 확인하고, 처음 값이 있는 것을 씁니다.

```python
for env_name in ("AI_API_KEY", "GOOGLE_API_KEY", "GEMINI_API_KEY"):
    key = os.environ.get(env_name, "").strip()
    if key:
        return key
raise AIAPIError("AI_API_KEY 환경변수가 설정되지 않았습니다. ...")
```

- `AI_API_KEY`는 어떤 제공자를 쓰든 통하는 공통 이름입니다.
- `GOOGLE_API_KEY`, `GEMINI_API_KEY`는 Google AI Studio 키를 이미 이 이름으로 설정해 둔 사람이 그대로 쓸 수 있게 받아 줍니다.
- 셋 다 없으면 API를 부르기 전에 바로 멈추고 설정 방법을 알려 줍니다. 키 없이 요청을 보내 401을 받는 것보다 원인을 빨리 알 수 있습니다.

## .env 자동 로드와 우선순위

매번 `export`를 치기 번거로워서, 실행할 때 프로젝트 루트의 `.env`를 읽어 환경변수로 올리는 기능을 `python-dotenv` 없이 직접 만들었습니다.

```python
os.environ.setdefault(key, value)  # 이미 있는 값은 덮어쓰지 않음
```

`setdefault`를 쓴 이유는 **셸에서 직접 export한 값이 항상 이기게** 하기 위해서입니다. `.env`는 기본값, `export`는 그때그때 바꾸는 값이라는 역할 구분입니다. `.env`는 `.gitignore`에 등록해서 커밋되지 않게 했습니다.

## 이 방식의 한계

- 환경변수도 같은 PC의 다른 프로세스나 셸 히스토리(`export AI_API_KEY=...`를 직접 친 경우)에 남을 수 있습니다. 완전한 비밀 보관소는 아닙니다.
- `.env`는 평문 파일이라 PC가 털리면 그대로 노출됩니다. 서버라면 클라우드의 비밀 관리 서비스(AWS Secrets Manager 등)를 쓰는 편이 낫습니다.

## 면접에서 나올 만한 질문

### Q. API Key를 어떻게 관리했나요?

키를 코드와 분리했는지, 우선순위를 의도해서 정했는지 봅니다.

> 코드에는 키를 쓰지 않고 `AI_API_KEY`, `GOOGLE_API_KEY`, `GEMINI_API_KEY` 순서로 환경변수를 찾게 했습니다. 편의를 위해 `.env`도 자동으로 읽는데, `setdefault`로 넣어서 셸에서 export한 값이 항상 우선하게 했습니다. `.env`는 `.gitignore`에 넣었습니다. 키가 없으면 API를 부르기 전에 종료하고 설정 방법을 보여 줍니다.

### 꼬리질문

- 실수로 키를 커밋했다면 어떻게 하나요?
  → 커밋을 지워도 히스토리나 포크에 남을 수 있으니 먼저 발급처에서 키를 폐기하고 새로 발급받습니다. 히스토리 정리는 그다음입니다.
- 서버에 배포한다면 `.env`를 그대로 쓰나요?
  → 이 프로젝트는 로컬 CLI라 `.env`로 충분했지만, 서버라면 배포 플랫폼의 환경변수 설정이나 비밀 관리 서비스를 쓰겠습니다. 직접 해 보지는 않았습니다.

> 출처: [Codyssey-B1/B3-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B3-2)
