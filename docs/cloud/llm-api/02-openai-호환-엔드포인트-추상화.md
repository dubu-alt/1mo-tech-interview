---
title: "OpenAI 호환 엔드포인트"
sidebar: "OpenAI 호환 엔드포인트"
---

LLM 제공자마다 API 모양이 다르면 제공자를 바꿀 때마다 코드를 고쳐야 합니다. ai-gitgen은 **OpenAI Chat Completions 형식** 하나로만 요청을 보내고, 주소(base URL)와 키만 바꿔서 여러 제공자에 연결했습니다.

## OpenAI 호환 형식

많은 제공자와 게이트웨이가 OpenAI와 같은 모양의 엔드포인트를 따로 열어 둡니다. 그래서 요청은 항상 이 모양입니다.

```
POST {base_url}/chat/completions
Authorization: Bearer {API Key}

{
  "model": "gemini-3-flash",
  "temperature": 0.3,
  "max_tokens": 800,
  "messages": [
    {"role": "system", "content": "커밋/PR 양식 규칙"},
    {"role": "user",   "content": "git status / diff 내용"}
  ]
}
```

응답에서는 `choices[0].message.content`만 꺼내 씁니다. 요청 라이브러리도 `requests` 없이 표준 라이브러리 `urllib.request`로 보냈습니다.

## base URL을 정하는 순서

```python
self.base_url = (base_url or os.environ.get("AI_API_BASE_URL") or DEFAULT_BASE_URL).rstrip("/")
```

인자 → 환경변수 `AI_API_BASE_URL` → 기본값(Google AI Studio) 순입니다. 끝의 `/`를 지워서 `.../v1/`처럼 적어도 주소가 `//chat/completions`로 꼬이지 않게 했습니다.

## 연결 방법

### Google AI Studio (기본값)

[Google AI Studio](https://aistudio.google.com/)에서 키를 발급받으면 주소는 설정하지 않아도 됩니다.

```bash
export AI_API_KEY="AIza..."
# 기본값: https://generativelanguage.googleapis.com/v1beta/openai
python main.py commit
```

### Codyssey Public API Console

`usr.codyssey.kr/public-api-console` → **API 키** 탭 → **키 발급**에서 **API 호환 방식을 OpenAI**로 골라 발급합니다. 키는 한 번만 보이니 바로 복사해 둡니다.

```bash
export AI_API_KEY="sk-cody-live-..."
export AI_API_BASE_URL="https://copa.codyssey.kr/v1"
python main.py commit --model gemini-3-flash
```

게이트웨이라 하나의 키로 Gemini, Claude, GPT 계열 모델을 `--model`만 바꿔 쓸 수 있습니다. 테스트 때 `gemini-3-flash`는 잘 됐고 `gpt-5-mini`는 HTTP 502가 났습니다. 모델별로 토큰 차감 배수가 달라서(예: `gemini-3-flash` 0.5배, `claude-sonnet-4` 1배) 가벼운 모델을 기본으로 썼습니다.

### 그 밖의 OpenAI 호환 API

코드상으로는 OpenAI 호환 엔드포인트라면 `AI_API_BASE_URL`과 키만 바꾸면 됩니다. 직접 테스트한 것은 위 두 곳뿐입니다.

## 쓸 수 있는 모델 확인: GET /models

모델 이름을 틀리면 `404 Model not found`가 납니다. 그래서 같은 호환 규칙의 `GET {base_url}/models`를 불러 목록을 보여 주는 `python main.py models` 명령을 만들었습니다. 하드코딩한 목록이 아니라 서버가 지금 응답하는 목록이라 게이트웨이에 모델이 추가돼도 코드를 고칠 필요가 없습니다.

## 오류를 하나로 묶기

제공자가 바뀌어도 실패 원인은 비슷해서, 모두 `AIAPIError` 하나로 바꿔 메시지만 다르게 했습니다.

| 상황 | 안내 |
|---|---|
| 401 | API Key가 유효하지 않음 |
| 429 | 요청 한도 초과, 잠시 후 재시도 |
| 그 밖의 4xx/5xx | 상태 코드와 응답 본문 앞부분 500자 |
| 연결 실패 | 네트워크 오류 |
| 시간 초과 | 60초 안에 응답 없음 |
| 응답 모양이 다름 / 빈 응답 | 원본 일부를 보여 주고 종료 |

## 한계

- 호환이라고 해도 제공자마다 지원하는 옵션이나 오류 형식이 조금씩 다를 수 있습니다.
- 502 같은 일시적 오류에도 자동 재시도나 다른 모델로 넘어가는 기능은 없습니다. 사용자가 다시 실행해야 합니다.

## 면접에서 나올 만한 질문

### Q. 여러 LLM 제공자를 어떻게 지원했나요?

제공자마다 코드를 따로 만들었는지, 공통 인터페이스로 묶었는지 봅니다.

> OpenAI Chat Completions 형식 하나로만 요청을 만들고, base URL과 키를 환경변수로 받게 했습니다. 기본은 Google AI Studio의 OpenAI 호환 엔드포인트이고, Codyssey 콘솔도 주소만 바꿔서 코드 수정 없이 썼습니다. 모델 이름 실수를 줄이려고 `GET /models`로 실제 목록을 보여 주는 명령도 만들었습니다.

### 꼬리질문

- 특정 모델이 502를 내면 어떻게 했나요?
  → 자동 재시도는 없어서 `--model`을 다른 모델로 바꿔 다시 실행했습니다. 다음에 고친다면 지수 백오프 재시도나 대체 모델 목록을 넣겠습니다.

> 출처: [Codyssey-B1/B3-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B3-2)
