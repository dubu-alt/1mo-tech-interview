---
title: "OAuth 2.0"
sidebar: "OAuth"
---

**OAuth는 사용자가 자신의 비밀번호를 알려 주지 않고도, 다른 애플리케이션이 자신의 정보나 기능 일부를 쓸 수 있도록 권한을 위임하는 개방형 표준입니다.** 이름도 Open Authorization(개방형 인가)의 줄임말입니다. 지금 널리 쓰는 버전은 OAuth 2.0(RFC 6749)이며, "카카오로 로그인", "구글 캘린더 연동하기" 같은 기능이 모두 이 방식으로 동작합니다.

## 한눈에 보기

- 예전에는 다른 서비스의 내 정보를 가져오려면, 그 서비스의 **아이디와 비밀번호를 앱에 직접 맡겨야** 했습니다. 그러면 앱이 내 계정으로 무엇이든 할 수 있고, 비밀번호를 바꾸기 전까지 막을 방법도 없습니다.
- OAuth는 비밀번호 대신 **권한 범위와 기한이 정해진 출입증(Access Token)** 을 앱에 주는 방식입니다.
- 비유: 호텔의 **발레파킹 키**를 떠올리면 쉽습니다.
  - 차 주인(사용자)은 집 열쇠까지 달린 열쇠 꾸러미(비밀번호)를 주지 않고, **운전만 할 수 있는 발레 키**(Access Token)만 직원(앱)에게 줍니다.
  - 발레 키로는 트렁크나 글러브박스를 열 수 없습니다. 이것이 **권한 범위(scope)** 입니다.
  - 볼일이 끝나면 발레 키를 돌려받거나 못 쓰게 만들 수 있습니다. 이것이 **토큰 만료와 권한 철회**입니다.

아래는 위키백과를 운영하는 MediaWiki에 외부 도구를 연결하는 예시입니다. 도구(클라이언트)가 사용자를 MediaWiki로 보내고(1), 사용자가 MediaWiki에서 로그인하고 허락하면(2), MediaWiki가 허락받았다는 증거를 들려 사용자를 돌려보내고(3), 사용자가 그 증거를 들고 도구로 돌아옵니다(4). 도구는 끝까지 사용자의 비밀번호를 보지 못합니다.

![OAuth 삼각형: 사용자(자원 소유자), 도구(클라이언트), MediaWiki(제공자) 사이를 사용자가 1에서 4 순서로 오가며 권한을 허락함](/images/web/oauth-roles-triangle.png)

*그림 출처: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Oauth_triangle.authorize.svg) (CC BY-SA 3.0)*

그림의 provider(MediaWiki) 자리는 아래에서 말하는 인가 서버와 자원 서버를 합쳐 부른 것입니다.

## OAuth 2.0의 역할 4가지

OAuth 2.0에는 네 등장인물이 있습니다. 앞으로 나올 흐름은 이 넷이 주고받는 이야기입니다.

| 역할 | 영어 이름 | 누구인가요 | 예: 내 서비스에 "구글로 로그인"을 붙인 경우 |
| --- | --- | --- | --- |
| 자원 소유자 | Resource Owner | 정보의 주인, 권한을 허락하는 사람 | 나 (구글 계정 주인) |
| 클라이언트 | Client | 권한을 받아서 정보를 쓰려는 앱 | 내가 만든 웹 서비스 |
| 인가 서버 | Authorization Server | 사용자를 로그인시키고 동의를 받아 토큰을 발급 | 구글의 로그인·동의 서버 |
| 자원 서버 | Resource Server | 실제 정보를 가지고 있고, 토큰을 확인한 뒤 내줌 | 구글 프로필 API, 캘린더 API |

인가 서버와 자원 서버는 같은 회사가 운영하는 경우가 많지만, 역할은 분명히 다릅니다. 인가 서버는 **토큰을 발급**하고, 자원 서버는 **토큰을 받아 확인**합니다.

클라이언트는 시작하기 전에 인가 서버에 **미리 등록**해 둡니다. 등록하면 다음 값을 받습니다.

- `client_id`: 앱의 공개 이름표
- `client_secret`: 앱만 아는 비밀번호 (서버에서만 보관. 브라우저나 모바일 앱 코드에는 넣으면 안 됨)
- `redirect_uri`: 사용자가 동의를 마친 뒤 돌아올 주소. 등록된 주소로만 돌려보내므로 엉뚱한 곳으로 코드가 새는 것을 막습니다.

## 주요 용어

| 용어 | 뜻 |
| --- | --- |
| Scope (범위) | 앱이 요청하는 권한의 범위. 예: `profile`, `email`, `calendar.readonly` |
| Authorization Code (인가 코드) | 사용자가 동의하면 인가 서버가 주는 **짧은 수명(보통 수십 초~10분)의 일회용 코드**. 이것 자체로는 API를 부를 수 없고 토큰으로 바꿔야 함 |
| Access Token | 자원 서버에 보여 주는 출입증. 수명이 짧음 |
| Refresh Token | Access Token이 만료되면 사용자 동의 없이 새 Access Token을 받는 교환권. 수명이 김 |
| Authorization Grant (인가 그랜트) | 클라이언트가 토큰을 받기 위해 내미는 "허락받았다는 증거"와 그 방식. 인가 코드가 대표적 |
| state | 요청과 응답이 같은 흐름인지 확인하는 임의 값. CSRF 공격을 막음 |

## Authorization Code 흐름

가장 많이 쓰고, 지금 권장되는 기본 흐름입니다. "구글로 로그인" 버튼을 눌렀을 때 일어나는 일을 순서대로 보겠습니다.

```
등장인물: 사용자(브라우저), 클라이언트(내 서비스), 인가 서버(구글), 자원 서버(구글 API)

[1] 사용자     → 클라이언트   "구글로 로그인" 버튼 클릭
[2] 클라이언트 → 사용자       인가 서버 주소로 이동시킴
                              (client_id, redirect_uri, scope, state 포함)
[3] 사용자     → 인가 서버    구글에 로그인하고 "프로필, 이메일 제공"에 동의
[4] 인가 서버  → 클라이언트   사용자를 redirect_uri로 돌려보냄
                              (?code=일회용코드&state=... 포함)
[5] 클라이언트 → 인가 서버    state 확인 후 code + client_secret 전송 (서버끼리 직접)
[6] 인가 서버  → 클라이언트   Access Token (+ Refresh Token) 발급
[7] 클라이언트 → 자원 서버    Authorization: Bearer (Access Token) 로 API 호출
[8] 자원 서버  → 클라이언트   토큰 확인 후 프로필 정보 응답
[9] 클라이언트 → 사용자       로그인 완료 화면
```

| 단계 | 하는 일 | 왜 이렇게 하나요 |
| --- | --- | --- |
| 1~2 | 클라이언트가 사용자를 인가 서버 페이지로 보냄 | 비밀번호는 **구글 페이지에서만** 입력. 내 서비스는 비밀번호를 보지 못함 |
| 3 | 사용자가 로그인하고 권한 범위에 동의 | 사용자가 무엇을 허락하는지 직접 확인 |
| 4 | 인가 서버가 **코드**를 붙여 `redirect_uri`로 돌려보냄 | 브라우저 주소창을 거치므로 노출될 수 있는 값은 **수명이 짧은 일회용 코드**만 |
| 5~6 | 클라이언트 서버가 코드와 `client_secret`으로 토큰을 교환 | 토큰 교환은 **서버끼리 직접** 해서 토큰이 브라우저를 거치지 않음 |
| 7~8 | Access Token으로 자원 서버의 API 호출 | 자원 서버는 토큰의 유효기간과 범위를 확인한 뒤 응답 |

자원 서버가 토큰을 확인하는 방법은 토큰 종류에 따라 다릅니다. 의미 없는 문자열(불투명 토큰)이면 인가 서버에 "이 토큰 유효한가요?"라고 물어보고(토큰 조회, Introspection), [JWT](/web/knowledge/07-jwt) 형태면 서명과 만료 시각을 직접 확인합니다.

### 다른 흐름(Grant Type)들

| 흐름 | 언제 쓰나요 | 현재 권장 여부 |
| --- | --- | --- |
| Authorization Code (+ PKCE) | 웹, 모바일 앱, SPA 등 사용자가 있는 거의 모든 경우 | **기본 권장** |
| Client Credentials | 사용자 없이 **서버와 서버**가 통신할 때 (예: 배치 작업이 API 호출) | 권장 |
| Device Code | 키보드가 불편한 기기 (스마트 TV, 콘솔). 휴대폰으로 코드를 입력해 승인 | 권장 |
| Refresh Token | Access Token 재발급 | 권장 |
| Implicit | 예전 SPA용. 코드 없이 주소창으로 토큰을 바로 받음 | **사용 중단 권고** (토큰이 주소창과 기록에 노출) |
| Resource Owner Password | 사용자가 앱에 아이디와 비밀번호를 직접 입력 | **사용 중단 권고** (OAuth를 쓰는 의미가 없어짐) |

OAuth 2.0 보안 모범 사례 문서(RFC 9700)와 정리 중인 OAuth 2.1 초안은 Implicit과 Password 방식을 빼고, **모든 클라이언트가 Authorization Code에 PKCE를 함께 쓰도록** 권장합니다.

## PKCE: 코드를 가로채도 쓸 수 없게

PKCE(Proof Key for Code Exchange, "픽시"라고 읽음)는 Authorization Code 흐름에 붙이는 안전장치입니다.

- 모바일 앱이나 SPA는 코드가 사용자 기기에서 동작하므로 `client_secret`을 안전하게 숨길 수 없습니다.
- 그러면 4단계에서 공격자가 인가 코드를 가로챘을 때, 그 코드로 토큰을 받아 가는 것을 막을 방법이 없습니다.

PKCE는 **처음 요청한 앱만 아는 비밀 값**으로 이 문제를 풉니다.

```
[1] 앱이 임의의 긴 문자열 code_verifier를 만들어 혼자 보관
[2] code_challenge = Base64URL( SHA-256(code_verifier) ) 를 계산
[3] 인가 요청(2단계) 때 code_challenge만 보냄    → 인가 서버가 기억해 둠
[4] 토큰 교환(5단계) 때 code_verifier 원본을 보냄
[5] 인가 서버가 받은 code_verifier로 다시 계산해서 [3]의 값과 같으면 토큰 발급
```

SHA-256은 한쪽 방향으로만 계산되므로, 공격자가 코드와 `code_challenge`를 엿보더라도 원래 `code_verifier`를 알아낼 수 없습니다. 그래서 가로챈 코드만으로는 토큰을 받을 수 없습니다.

## OAuth와 OpenID Connect

"구글로 로그인"은 사실 OAuth만으로 하는 것이 아닙니다. 여기서 많이 헷갈립니다.

- **OAuth 2.0은 인가(Authorization)** 를 위한 규칙입니다. Access Token은 "이 앱이 이 범위의 API를 불러도 된다"는 뜻일 뿐, **"이 사람이 누구인지"를 클라이언트에게 알려 주려고 만든 것이 아닙니다.**
- **OpenID Connect(OIDC)** 는 OAuth 2.0 위에 **인증(Authentication)** 기능을 얹은 표준입니다. scope에 `openid`를 넣어 요청하면, Access Token과 함께 **ID Token**이 발급됩니다.

| 구분 | OAuth 2.0 | OpenID Connect |
| --- | --- | --- |
| 목적 | 인가 (권한 위임) | 인증 (로그인, 누구인지 확인) |
| 핵심 결과물 | Access Token | ID Token (+ Access Token) |
| 토큰 형식 | 정해져 있지 않음 (임의 문자열이나 JWT) | ID Token은 반드시 **JWT** |
| 토큰을 읽는 쪽 | 자원 서버 (API) | 클라이언트 (내 서비스) |
| 담긴 정보 | 허락된 범위(scope) | 사용자 ID(`sub`), 발급자(`iss`), 대상(`aud`), 이메일, 이름 등 |
| 예 | "내 구글 캘린더에 일정 추가 권한을 이 앱에 줌" | "구글 계정으로 이 서비스에 로그인" |

정리하면 **로그인에는 OIDC의 ID Token을, API 호출에는 Access Token을** 쓰는 것이 올바른 구분입니다. 인증과 인가의 차이는 [인증 방식](/web/knowledge/06-인증-방식) 글에서 더 자세히 다룹니다.

## 코드로 감 잡기: PKCE 값 직접 계산하기

Python 표준 라이브러리로 PKCE의 `code_challenge`를 계산하고, PKCE 표준 문서(RFC 7636)에 실린 예시 값과 같은지 확인해 봅니다.

```python
import base64
import hashlib
import secrets

def make_challenge(verifier: str) -> str:
    digest = hashlib.sha256(verifier.encode("ascii")).digest()
    return base64.urlsafe_b64encode(digest).rstrip(b"=").decode()

# RFC 7636 문서에 실린 예시 값으로 계산이 맞는지 확인
verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"
print("code_verifier :", verifier)
print("code_challenge:", make_challenge(verifier))

# 실제로는 요청할 때마다 새로 만듭니다
new_verifier = secrets.token_urlsafe(32)
print("새 verifier 길이:", len(new_verifier))

# 인가 서버의 확인: 나중에 받은 verifier로 다시 계산해서 처음 받은 challenge와 같은지 비교
saved_challenge = make_challenge(verifier)
print("진짜 앱이 보낸 verifier :", make_challenge(verifier) == saved_challenge)
print("코드를 가로챈 공격자     :", make_challenge("attacker-guess-value") == saved_challenge)
```

실행 결과:

```
code_verifier : dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
code_challenge: E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
새 verifier 길이: 43
진짜 앱이 보낸 verifier : True
코드를 가로챈 공격자     : False
```

- 계산한 `code_challenge`가 RFC 7636 부록에 실린 값 `E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM`과 정확히 같습니다.
- `code_verifier`는 43자 이상 128자 이하여야 하는데, `secrets.token_urlsafe(32)`는 32바이트 난수를 43자로 만들어 주어 딱 맞습니다.
- 공격자는 `code_challenge`만 보고 원래 `code_verifier`를 거꾸로 알아낼 수 없으므로, 가로챈 코드로 토큰을 받는 데 실패합니다.

## 면접에서 자주 나오는 질문

**Q. OAuth란 무엇인가요?**
A. 사용자가 비밀번호를 넘기지 않고, 정해진 범위와 기한의 Access Token을 통해 다른 애플리케이션에 자신의 자원 접근 권한을 위임하는 인가 표준입니다.

**Q. OAuth 2.0의 네 가지 역할을 설명해 주세요.**
A. 정보의 주인인 자원 소유자, 권한을 받아 쓰는 클라이언트, 동의를 받고 토큰을 발급하는 인가 서버, 토큰을 확인하고 실제 자원을 내주는 자원 서버입니다.

**Q. 왜 토큰을 바로 주지 않고 인가 코드를 거치나요?**
A. 4단계의 리다이렉트는 브라우저 주소창을 거치므로 값이 기록이나 로그에 남을 수 있습니다. 그래서 그곳에는 수명이 짧은 일회용 코드만 싣고, 실제 토큰은 클라이언트 서버가 인가 서버와 직접 통신해서 받습니다.

**Q. OAuth와 OpenID Connect의 차이는 무엇인가요?**
A. OAuth는 API 접근 권한을 위임하는 인가 표준이고, OpenID Connect는 그 위에 ID Token(JWT)을 추가해 사용자가 누구인지 확인하는 인증 표준입니다. 소셜 로그인은 보통 OIDC를 씁니다.

**Q. PKCE는 무엇이고 왜 필요한가요?**
A. 클라이언트가 만든 비밀 값(code_verifier)의 해시를 인가 요청 때 보내고, 토큰 교환 때 원본을 보내 같은 앱인지 확인하는 방식입니다. client_secret을 숨길 수 없는 모바일 앱과 SPA에서 인가 코드 가로채기를 막으며, 지금은 모든 클라이언트에 권장됩니다.

## 정리

| 개념 | 한 줄 요약 |
| --- | --- |
| OAuth 2.0 | 비밀번호 대신 범위와 기한이 정해진 토큰으로 권한을 위임하는 인가 표준 |
| 네 가지 역할 | 자원 소유자, 클라이언트, 인가 서버, 자원 서버 |
| Scope | 앱이 요청하는 권한 범위. 필요한 만큼만 요청 |
| Authorization Code 흐름 | 일회용 코드를 받아 서버끼리 토큰으로 교환하는 기본 흐름 |
| state | 요청과 응답을 짝지어 CSRF를 막는 값 |
| PKCE | code_verifier와 code_challenge로 가로챈 코드를 무용지물로 만듦 |
| Implicit / Password | 보안 문제로 사용 중단 권고 |
| OpenID Connect | OAuth 위의 인증 계층. ID Token(JWT)으로 사용자가 누구인지 확인 |
