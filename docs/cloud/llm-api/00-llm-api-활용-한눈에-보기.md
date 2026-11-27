---
title: "LLM API 활용 한눈에 보기 (B3-2)"
sidebar: "LLM API 활용 한눈에 보기"
---

코디세이 B3-2 미션에서 `git diff`를 LLM API에 보내 커밋 메시지와 PR 초안을 만드는 Python CLI(`ai-gitgen`)를 만들면서, 외부 LLM API를 안전하고 싸게 쓰는 방법을 익혔습니다. 이 페이지에서 전체 흐름과 개념을 먼저 훑고 자세한 내용은 개념별 글에서 보면 됩니다.

## 무엇을 만들었나

`python main.py commit` 또는 `pr`을 실행하면 Git 변경 사항을 모아 OpenAI 호환 Chat Completions API(기본: Google AI Studio Gemini)에 한 번 보내고, 받은 초안을 검사해서 터미널에 보여 줍니다. 외부 라이브러리 없이 표준 라이브러리만 썼고, 커밋이나 PR 반영은 사람이 직접 합니다.

## 한 번 실행할 때의 흐름

```
API Key 확인 (환경변수 / .env)
 → git status / git diff 수집 (변경 없으면 종료)
 → (safe-mode) 민감정보 마스킹 → 전송량 제한
 → 프롬프트 조립 → API 1회 호출 ({base_url}/chat/completions)
 → 출력 검증·후처리 (길이 자르기, 헤더 정규화, 경고)
 → 초안 출력 + 호출 횟수 표시
```

## 개념 한 줄 정리

| 개념 | 한 줄 뜻 | 자세히 |
|---|---|---|
| 환경변수 키 관리 | 키를 코드에 쓰지 않고 환경변수에서 우선순위대로 읽음 | [안전한 API Key 관리 패턴](./01-안전한-api-key-관리-패턴) |
| `.env` 자동 로드 | 파일에서 읽되 셸 export 값을 덮어쓰지 않음 | [안전한 API Key 관리 패턴](./01-안전한-api-key-관리-패턴) |
| OpenAI 호환 엔드포인트 | 요청 모양은 하나, base URL과 키만 바꿔 여러 제공자에 연결 | [OpenAI 호환 엔드포인트](./02-openai-호환-엔드포인트-추상화) |
| GET /models | 서버가 지원하는 모델 목록을 실시간으로 조회 | [OpenAI 호환 엔드포인트](./02-openai-호환-엔드포인트-추상화) |
| 출력 검증 | LLM 응답을 길이·섹션 규칙으로 검사 | [LLM 출력 검증과 후처리](./03-llm-출력-검증과-정규화) |
| 후처리(정규화) | 다시 요청하지 않고 자르기·헤더 통일로 고침 | [LLM 출력 검증과 후처리](./03-llm-출력-검증과-정규화) |
| 민감정보 마스킹 | 키·토큰·이메일을 `[MASKED:종류]`로 바꾼 뒤 전송 | [민감정보 마스킹](./04-민감정보-마스킹-설계) |
| 마스킹 후 자르기 | 잘린 경계에 비밀 일부가 남지 않게 하는 순서 | [민감정보 마스킹](./04-민감정보-마스킹-설계) |
| 토큰 비용 | 입력+출력 토큰 × 모델 단가 | [LLM API 호출 비용 관리](./05-llm-api-호출-경제학) |
| 1회 호출 원칙 | 실행당 한 번만 부르고 쓸모없는 호출은 만들지 않음 | [LLM API 호출 비용 관리](./05-llm-api-호출-경제학) |

## B3-2에서 남긴 것

| 항목 | 내용 |
|---|---|
| 모듈 | `git_collector`(수집), `prompts`(프롬프트), `ai_client`(API 호출), `validators`(검증), `safe_mode`(마스킹) |
| 명령 | `commit`, `pr`, `models` |
| 연결해 본 곳 | Google AI Studio, Codyssey Public API Console |
| 가장 큰 한계 | safe-mode가 기본으로 꺼져 있고, 정규식에 없는 비밀은 못 잡음. 일시 오류 자동 재시도 없음 |

> 출처: [Codyssey-B1/B3-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B3-2)
