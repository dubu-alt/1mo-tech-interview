---
title: "JWT (JSON Web Token)"
sidebar: "JWT"
---

**JWT는 사용자 정보 같은 데이터(클레임)를 JSON으로 담고, 위조 여부를 확인할 수 있는 서명을 붙여 한 줄 문자열로 만든 토큰 형식입니다.** 웹 표준(RFC 7519)으로 정해져 있으며, 서버가 저장소를 뒤지지 않고 서명만 확인해서 "믿을 수 있는 토큰인지"를 판단할 수 있다는 점이 핵심입니다.

## 핵심 아이디어

- [세션 방식](/web/knowledge/05-쿠키와-세션)에서는 서버가 장부(세션 저장소)를 들고 있다가 요청마다 찾아봅니다. JWT는 **필요한 정보를 토큰 안에 직접 적어 두고, 서버의 도장(서명)을 찍어서** 클라이언트에게 들려 보냅니다.
- 비유: JWT는 **봉인 스티커가 붙은 투명 봉투**와 비슷합니다.
  - 봉투가 투명해서 안에 든 내용(누구인지, 언제까지 유효한지)은 **누구나 읽을 수 있습니다.**
  - 하지만 내용을 바꾸려고 봉투를 열면 봉인 스티커가 찢어져서 **바꿨다는 사실이 바로 드러납니다.**
  - 봉인 스티커는 서버만 가진 도장(비밀키)으로만 만들 수 있습니다.
- 그래서 JWT는 "내용을 숨기는" 기술이 아니라 **"내용이 바뀌지 않았음을 보증하는"** 기술입니다. 이 점이 JWT를 이해하는 데 가장 중요합니다.

## JWT의 생김새

JWT는 점(`.`)으로 구분된 세 부분으로 이루어집니다.

```
xxxxx.yyyyy.zzzzz
헤더.내용.서명
```

| 부분 | 이름 | 들어 있는 것 |
| --- | --- | --- |
| 첫 번째 | 헤더 (Header) | 토큰 종류, 서명 알고리즘 |
| 두 번째 | 내용 (Payload) | 클레임 (사용자 ID, 만료 시각 등) |
| 세 번째 | 서명 (Signature) | 헤더와 내용이 바뀌지 않았음을 증명하는 값 |

각 부분은 **Base64URL**이라는 방식으로 인코딩되어 있습니다. Base64URL은 일반 Base64에서 URL에 문제가 되는 `+`, `/`를 `-`, `_`로 바꾸고 끝의 `=`를 뺀 형태라서, 토큰을 URL이나 HTTP 헤더에 그대로 넣을 수 있습니다.

### 헤더 (Header)

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `typ`: 토큰 종류. JWT라서 `"JWT"`입니다.
- `alg`: **서명 알고리즘**입니다. 자주 쓰는 값은 다음과 같습니다.

| alg 값 | 방식 | 키 |
| --- | --- | --- |
| `HS256` | HMAC + SHA-256 | 서명과 검증에 **같은 비밀키** 하나를 씀 |
| `RS256` | RSA 전자서명 + SHA-256 | **개인키**로 서명, **공개키**로 검증 |
| `ES256` | 타원곡선(ECDSA) 전자서명 + SHA-256 | 개인키로 서명, 공개키로 검증. RSA보다 키가 짧음 |

`HS256`은 비밀키를 가진 서버끼리만 쓸 때 간단하고, `RS256`/`ES256`은 토큰을 발급하는 서버와 검증하는 서버가 다를 때(예: 여러 서비스가 하나의 로그인 서버를 믿을 때) 공개키만 나눠 주면 되어 편리합니다.

### 내용 (Payload)과 클레임

Payload에는 토큰에 담을 정보가 들어갑니다. 정보 한 조각(이름과 값 한 쌍)을 **클레임(claim)** 이라고 부릅니다. 클레임을 많이 넣을수록 토큰이 길어지고, 토큰은 요청마다 함께 오가므로 꼭 필요한 것만 넣습니다.

클레임은 세 종류로 나뉩니다.

#### 1. 등록된 클레임 (Registered Claims)

표준에서 이름과 의미를 미리 정해 둔 클레임입니다. 모두 선택 사항이지만 `exp`는 사실상 꼭 넣습니다.

| 클레임 | 뜻 | 설명 |
| --- | --- | --- |
| `iss` | 발급자 (issuer) | 토큰을 만든 서버. 예: `"auth.example.com"` |
| `sub` | 주체 (subject) | 토큰이 **누구에 관한 것인지**. 보통 사용자 ID |
| `aud` | 대상 (audience) | 이 토큰을 받아 쓸 서비스. 다른 서비스용 토큰을 거절하는 데 씀 |
| `exp` | 만료 시각 (expiration) | 이 시각이 지나면 검증하는 쪽이 반드시 거절해야 함 |
| `nbf` | 활성 시각 (not before) | 이 시각 전에는 아직 쓸 수 없음 |
| `iat` | 발급 시각 (issued at) | 토큰이 만들어진 시각. 토큰의 나이를 계산할 때 씀 |
| `jti` | 토큰 ID (JWT ID) | 토큰마다 고유한 값. 같은 토큰을 두 번 쓰는 것(재사용)을 막을 때 씀 |

시각 값은 **NumericDate**, 즉 1970년 1월 1일부터 지난 초를 정수로 적습니다. 예를 들어 `1790000000`은 2026년 9월 21일 무렵입니다.

#### 2. 공개 클레임 (Public Claims)

여러 곳에서 함께 쓸 목적으로 만든 클레임입니다. 다른 클레임과 이름이 겹치지 않도록 IANA라는 기관에 등록된 이름(예: `email`, `name`)을 쓰거나, URI 형태로 이름을 짓습니다.

```json
{
  "https://example.com/claims/is_admin": true
}
```

#### 3. 비공개 클레임 (Private Claims)

등록되지도 공개되지도 않은, **서버와 클라이언트가 둘이서 약속한** 클레임입니다. 예를 들어 `"role": "user"` 같은 것입니다. 다른 시스템의 클레임과 이름이 겹칠 수 있으니 주의해서 씁니다.

### 서명 (Signature)

서명은 다음과 같이 만듭니다.

```
서명 = HMAC-SHA256( Base64URL(헤더) + "." + Base64URL(내용), 비밀키 )
```

- 헤더와 내용을 이어 붙인 문자열을 비밀키로 계산한 값입니다. 결과는 다시 Base64URL로 바꿔 세 번째 부분에 붙입니다.
- 검증하는 쪽은 받은 헤더와 내용으로 **서명을 다시 계산**해서, 토큰에 붙은 서명과 같은지 비교합니다.
- 내용에서 글자 하나만 바뀌어도 계산 결과가 완전히 달라지므로, 비밀키를 모르는 사람은 바뀐 내용에 맞는 서명을 만들 수 없습니다.

## Payload는 암호화가 아니다

가장 흔한 오해가 "JWT는 암호화된 토큰이라 안전하다"는 생각입니다.

| 오해 | 사실 |
| --- | --- |
| Payload는 암호화되어 있다 | Base64URL로 **인코딩**만 되어 있어 누구나 읽을 수 있음 |
| 서명이 있으니 내용이 비밀이다 | 서명은 **바뀌지 않았음**을 보증할 뿐, 내용을 가려 주지 않음 |
| 그러니 비밀번호를 넣어도 된다 | 비밀번호, 주민번호, 카드번호 같은 민감한 정보는 **절대 넣으면 안 됨** |

내용 자체를 숨겨야 한다면 JWT를 암호화하는 별도 표준인 **JWE**(JSON Web Encryption)를 씁니다. 우리가 흔히 JWT라고 부르는 것은 정확히는 서명만 붙인 **JWS(JSON Web Signature)** 형태입니다.

또 하나 알아 둘 보안 주의점이 있습니다. 검증하는 쪽은 토큰 헤더의 `alg` 값을 그대로 믿지 말고, **서버가 미리 정해 둔 알고리즘만** 받아들여야 합니다. 헤더를 `"alg": "none"`(서명 없음)으로 바꿔 검증을 건너뛰게 하는 공격이 실제로 있었기 때문입니다.

## Access Token과 Refresh Token

토큰의 유효기간을 정할 때는 고민이 생깁니다.

- 유효기간이 **짧으면** 사용자가 자주 다시 로그인해야 해서 불편합니다.
- 유효기간이 **길면** 토큰을 도둑맞았을 때 오랫동안 악용됩니다. JWT는 서버가 따로 저장하지 않기 때문에, 한 번 발급하면 만료 전까지 막기 어렵습니다.

그래서 토큰을 두 개로 나눠 씁니다.

| 구분 | Access Token | Refresh Token |
| --- | --- | --- |
| 하는 일 | API를 부를 때 매번 보내는 출입증 | Access Token이 만료되면 새로 받아 오는 교환권 |
| 유효기간 | 짧게 (예: 15분 ~ 1시간) | 길게 (예: 1주 ~ 2주) |
| 보내는 곳 | 모든 API 요청 | 토큰 재발급 요청에만 |
| 형식 | 주로 JWT | JWT일 수도 있지만, 서버 DB에 저장해 두는 **임의 문자열**인 경우가 많음 |
| 서버 저장 | 보통 안 함 | 저장해 두고, 로그아웃하거나 탈취가 의심되면 삭제 |

```
[1] 로그인 성공          → 서버가 Access Token(1시간) + Refresh Token(2주) 발급
[2] API 요청             → Authorization: Bearer (Access Token)
[3] 1시간 뒤 API 요청     → 401 응답 (Access Token 만료)
[4] 재발급 요청           → Refresh Token 전송
[5] 서버가 Refresh Token 확인 → 새 Access Token 발급 (새 Refresh Token도 함께 주기도 함)
[6] 다시 API 요청         → 새 Access Token으로 정상 처리
[7] 2주 뒤 Refresh Token도 만료 → 다시 로그인
```

- Access Token을 도둑맞아도 **짧은 시간 안에 쓸모가 없어지므로** 피해가 줄어듭니다.
- Refresh Token은 서버에 저장해 두면, 로그아웃하거나 수상한 사용이 보일 때 지워서 더 이상 재발급을 못 하게 막을 수 있습니다.
- Refresh Token을 쓸 때마다 새 것으로 바꿔 주고 이전 것은 폐기하는 방식을 **Refresh Token Rotation**이라고 합니다. 이미 폐기된 Refresh Token이 다시 들어오면 탈취로 보고 그 사용자의 토큰을 모두 끊을 수 있습니다.

## 토큰은 어디에 저장해야 할까

브라우저에서 토큰을 어디에 두느냐는 면접에서도 자주 나오는 주제입니다. 정답이 하나라기보다 장단점을 알고 고르는 문제입니다.

| 저장 위치 | 장점 | 위험 |
| --- | --- | --- |
| `localStorage` | 구현이 쉬움, 새로고침해도 유지 | JavaScript로 읽을 수 있어 [XSS](/web/knowledge/09-csrf와-xss)에 당하면 토큰이 그대로 털림 |
| `sessionStorage` | 탭을 닫으면 사라짐 | XSS 위험은 localStorage와 같음 |
| JavaScript 변수 (메모리) | XSS로도 꺼내기 어려운 편 | 새로고침하면 사라져서 Refresh Token으로 다시 받아야 함 |
| `HttpOnly` 쿠키 | JavaScript가 읽을 수 없어 XSS로 훔치기 어려움 | 쿠키는 자동 전송되므로 **CSRF 대비** 필요 (`SameSite`, CSRF 토큰) |

자주 쓰는 조합은 **Access Token은 메모리에, Refresh Token은 `HttpOnly; Secure; SameSite` 쿠키에** 두는 방식입니다. 어떤 방식을 고르든 XSS 자체를 막는 것(입력값 이스케이프, CSP 등)이 가장 기본입니다.

## 코드로 감 잡기: JWT 직접 만들고 검증하기

라이브러리 없이 Python 표준 라이브러리(`hmac`, `hashlib`, `base64`, `json`)만으로 HS256 JWT를 만들고 검증해 봅니다. 실제 서비스에서는 검증된 라이브러리(Python은 PyJWT 등)를 쓰지만, 직접 만들어 보면 구조가 확실히 이해됩니다.

```python
import base64
import hashlib
import hmac
import json

SECRET = b"example-secret-key"  # 예시용 비밀키 (실제로는 길고 무작위한 값을 사용)

def b64url(data: bytes) -> str:
    # JWT는 URL에 넣어도 안전한 Base64URL을 쓰고, 끝의 '='는 뺍니다
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()

def b64url_decode(text: str) -> bytes:
    return base64.urlsafe_b64decode(text + "=" * (-len(text) % 4))

def make_jwt(payload: dict) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    h = b64url(json.dumps(header, separators=(",", ":")).encode())
    p = b64url(json.dumps(payload, separators=(",", ":")).encode())
    sig = hmac.new(SECRET, f"{h}.{p}".encode(), hashlib.sha256).digest()
    return f"{h}.{p}.{b64url(sig)}"

def verify_jwt(token: str, now: int) -> str:
    h, p, s = token.split(".")
    expected = b64url(hmac.new(SECRET, f"{h}.{p}".encode(), hashlib.sha256).digest())
    if not hmac.compare_digest(expected, s):
        return "검증 실패: 서명이 맞지 않음 (위조 또는 변조)"
    payload = json.loads(b64url_decode(p))
    if payload["exp"] < now:
        return "검증 실패: 만료된 토큰"
    return f"검증 성공: {payload}"

NOW = 1790000000  # 예시 현재 시각 (Unix 시간, 초)
token = make_jwt({"sub": "1mo", "role": "user", "iat": NOW, "exp": NOW + 3600})
print("1) 만든 토큰")
print(token)

print("\n2) Payload는 비밀키 없이도 누구나 읽을 수 있음")
print(b64url_decode(token.split(".")[1]).decode())

print("\n3) 정상 토큰 검증")
print(verify_jwt(token, NOW + 60))

print("\n4) role을 admin으로 바꿔치기한 토큰 검증")
h, p, s = token.split(".")
fake = json.loads(b64url_decode(p))
fake["role"] = "admin"
tampered = f"{h}.{b64url(json.dumps(fake, separators=(',', ':')).encode())}.{s}"
print(verify_jwt(tampered, NOW + 60))

print("\n5) 1시간이 지난 뒤 검증")
print(verify_jwt(token, NOW + 7200))
```

실행 결과:

```
1) 만든 토큰
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxbW8iLCJyb2xlIjoidXNlciIsImlhdCI6MTc5MDAwMDAwMCwiZXhwIjoxNzkwMDAzNjAwfQ.mKji1pJBhEGm84gaa56SJMvYq7e-d7ynnnhEQz8LeuY

2) Payload는 비밀키 없이도 누구나 읽을 수 있음
{"sub":"1mo","role":"user","iat":1790000000,"exp":1790003600}

3) 정상 토큰 검증
검증 성공: {'sub': '1mo', 'role': 'user', 'iat': 1790000000, 'exp': 1790003600}

4) role을 admin으로 바꿔치기한 토큰 검증
검증 실패: 서명이 맞지 않음 (위조 또는 변조)

5) 1시간이 지난 뒤 검증
검증 실패: 만료된 토큰
```

- **2번**: 비밀키 없이 Base64URL만 풀었는데 내용이 그대로 보입니다. Payload는 암호화가 아니라는 뜻입니다.
- **4번**: 내용의 `role`만 `admin`으로 바꾸고 원래 서명을 그대로 붙였더니, 서버가 다시 계산한 서명과 달라서 거절되었습니다. 비밀키가 없으면 바뀐 내용에 맞는 서명을 만들 수 없습니다.
- **5번**: 서명이 맞더라도 `exp`가 지났으면 거절합니다. 서명 검증과 만료 확인은 **둘 다** 해야 합니다.
- 서명 비교에 `==` 대신 `hmac.compare_digest`를 쓴 이유는 [인증 방식](/web/knowledge/06-인증-방식) 글의 타이밍 공격 설명을 참고하세요.

## JWT의 장단점

| 장점 | 단점 |
| --- | --- |
| 서버가 세션 저장소 없이 서명만으로 검증 (stateless) | 발급한 토큰을 만료 전에 무효화하기 어려움 |
| 서버를 여러 대로 늘려도 키만 공유하면 됨 | 세션 ID보다 길어서 요청마다 데이터가 커짐 |
| 모바일 앱, 다른 도메인의 API에도 쓰기 쉬움 | Payload가 노출되므로 민감한 정보를 넣을 수 없음 |
| 필요한 정보(사용자 ID, 권한)가 토큰에 들어 있어 DB 조회를 줄임 | 토큰 안의 권한 정보가 바뀌어도 만료 전까지는 옛날 값이 남음 |

만료 전 무효화가 꼭 필요하면 `jti`를 이용한 **차단 목록**(블랙리스트)을 Redis 등에 두기도 합니다. 다만 그러면 요청마다 저장소를 확인해야 해서, 사실상 세션과 비슷해진다는 점도 함께 기억해 두면 좋습니다.

## 면접에서 자주 나오는 질문

**Q. JWT의 구조를 설명해 주세요.**
A. 점으로 구분된 헤더, 페이로드, 서명 세 부분입니다. 헤더에는 서명 알고리즘, 페이로드에는 사용자 ID나 만료 시각 같은 클레임, 서명에는 헤더와 페이로드를 비밀키로 계산한 값이 들어가며, 각 부분은 Base64URL로 인코딩됩니다.

**Q. JWT의 Payload에 비밀번호를 넣어도 되나요?**
A. 안 됩니다. Payload는 암호화가 아니라 인코딩이라 누구나 디코딩해서 읽을 수 있습니다. 서명은 변조 여부만 확인해 줄 뿐 내용을 숨겨 주지 않습니다.

**Q. Refresh Token은 왜 필요한가요?**
A. Access Token을 짧게 만들어 탈취 피해를 줄이면서도, 사용자가 자주 다시 로그인하지 않도록 하기 위해서입니다. Access Token이 만료되면 Refresh Token으로 새 Access Token을 받습니다.

**Q. JWT는 로그아웃을 어떻게 처리하나요?**
A. JWT 자체는 만료 전까지 유효하므로, 클라이언트에서 토큰을 지우고 서버에 저장된 Refresh Token을 삭제합니다. 즉시 차단이 필요하면 Access Token 유효기간을 짧게 두거나 `jti` 기반 차단 목록을 함께 씁니다.

**Q. 세션 대신 JWT를 쓰면 무엇이 좋아지나요?**
A. 서버가 사용자 상태를 저장하지 않아도 되어 서버를 늘리기 쉽고, 여러 서비스나 모바일 앱에서 같은 토큰을 검증하기 쉽습니다. 대신 강제 만료가 어렵고 토큰이 커지는 단점이 있습니다.

## 정리

| 개념 | 한 줄 요약 |
| --- | --- |
| JWT | 클레임을 JSON으로 담고 서명을 붙인 토큰 (RFC 7519) |
| 구조 | 헤더.페이로드.서명, 각 부분은 Base64URL |
| alg | 서명 알고리즘. HS256은 비밀키 하나, RS256/ES256은 개인키와 공개키 |
| 클레임 | 등록된(iss, sub, aud, exp, nbf, iat, jti), 공개, 비공개 클레임 |
| 서명 | 내용이 바뀌지 않았음을 보증. 내용을 숨기지는 않음 |
| Access Token | 짧게 쓰는 출입증 |
| Refresh Token | 길게 쓰는 교환권, 서버에 저장해 두고 폐기 가능 |
| 저장 위치 | localStorage는 XSS, 쿠키는 CSRF를 조심. 메모리 + HttpOnly 쿠키 조합이 흔함 |
