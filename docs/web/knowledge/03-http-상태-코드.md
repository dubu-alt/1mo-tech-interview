---
title: "HTTP 상태 코드 (Status Code)"
sidebar: "HTTP 상태 코드"
---

HTTP 상태 코드는 **서버가 요청을 어떻게 처리했는지 세 자리 숫자로 알려 주는 결과표**입니다. 첫 번째 숫자만 봐도 "성공인지, 다른 곳으로 가라는 건지, 내 잘못인지, 서버 잘못인지"를 알 수 있습니다.

## 한눈에 보기

- 요청을 보내면 응답의 맨 첫 줄에 상태 코드가 붙어 옵니다. 프로그램은 본문을 읽기 전에 이 숫자부터 보고 다음 행동을 정합니다.
- 비유: 택배 배송 조회 결과와 같습니다.
  - 2xx: "배송 완료"
  - 3xx: "주소가 바뀌어 새 주소로 다시 보내 주세요"
  - 4xx: "보내는 분이 주소를 잘못 적었어요" (요청한 쪽의 문제)
  - 5xx: "물류 센터에 문제가 생겼어요" (서버 쪽의 문제)
- API를 만들 때 상태 코드를 정확히 고르면, 클라이언트는 에러 문구를 일일이 해석하지 않고도 "다시 시도할지, 로그인 화면으로 보낼지, 사용자에게 입력을 고치라고 할지"를 결정할 수 있습니다.

## 응답의 첫 줄

```
HTTP/1.1 404 Not Found      ← 상태 줄: HTTP 버전, 상태 코드, 이유 문구
Content-Type: application/json
Content-Length: 26

{"error": "없는 회원"}
```

아래 그림처럼 상태 줄은 **프로토콜 버전, 상태 코드, 이유 문구(상태 메시지)** 세 조각으로 나뉩니다.

![HTTP 응답의 상태 줄: 프로토콜 버전 HTTP/1.1, 상태 코드 200, 상태 메시지 OK, 그 아래 헤더](/images/web/http-status-response-line.png)

*그림 출처: [MDN, Overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) (CC BY-SA 2.5)*

- **상태 코드(404)**: 프로그램이 판단에 쓰는 숫자
- **이유 문구(Not Found)**: 사람이 읽기 위한 설명. HTTP/2부터는 아예 전송하지 않으므로, 프로그램은 숫자만 보고 판단해야 합니다.

## 다섯 가지 범주

| 범주 | 뜻 | 누구 쪽 일인가 | 대표 코드 |
| --- | --- | --- | --- |
| 1xx 정보 | 요청을 받았고 처리를 계속하는 중 | 진행 중 | 100, 101 |
| 2xx 성공 | 요청을 정상적으로 처리함 | 성공 | 200, 201, 204 |
| 3xx 리다이렉션 | 원하는 걸 받으려면 다른 곳으로 가야 함 | 추가 행동 필요 | 301, 302, 304 |
| 4xx 클라이언트 오류 | 요청 자체에 문제가 있음 | 요청한 쪽 | 400, 401, 403, 404 |
| 5xx 서버 오류 | 요청은 맞지만 서버가 처리하지 못함 | 서버 쪽 | 500, 502, 503 |

> 원문은 범주를 `10x, 20x`처럼 적었는데, `10x`는 100~109만 가리키는 표기라 정확하지 않습니다. 200~299 전체를 뜻하므로 `2xx`로 적는 것이 맞습니다.

모르는 코드를 받아도 **첫 자리로 범주를 판단**하면 됩니다. 예를 들어 처음 보는 `418`을 받으면 "클라이언트 오류의 한 종류"로 처리합니다.

## 자주 쓰는 상태 코드

### 1xx 정보

| 코드 | 이름 | 의미 |
| --- | --- | --- |
| 100 | Continue | 큰 본문을 보내기 전에 "보내도 되나요?"라고 물었을 때 "계속 보내세요" |
| 101 | Switching Protocols | 프로토콜을 바꿈. 웹소켓(WebSocket) 연결을 열 때 사용 |

### 2xx 성공

| 코드 | 이름 | 의미와 사용 예 |
| --- | --- | --- |
| 200 | OK | 요청 성공. 조회(GET)뿐 아니라 수정 결과를 본문에 담아 돌려줄 때도 사용 |
| 201 | Created | 새 자원이 만들어짐. 보통 POST(또는 새로 만드는 PUT) 응답이며 `Location` 헤더에 새 주소를 담음 |
| 202 | Accepted | 요청을 접수했지만 처리는 아직 안 끝남. 영상 변환처럼 오래 걸리는 작업을 맡길 때 |
| 204 | No Content | 성공했지만 돌려줄 본문이 없음. 삭제 성공, 저장 성공 응답에 자주 사용 |

### 3xx 리다이렉션

| 코드 | 이름 | 의미와 사용 예 |
| --- | --- | --- |
| 300 | Multiple Choices | 고를 수 있는 자원이 여러 개. 실제로는 거의 쓰지 않음 |
| 301 | Moved Permanently | 주소가 **영구히** 바뀜. 새 주소는 `Location` 헤더에 |
| 302 | Found | 주소가 **잠시** 바뀜. 로그인 후 원래 페이지로 보내기 등 |
| 303 | See Other | 다른 주소를 GET으로 조회하라. 폼 제출 후 결과 페이지로 보낼 때 |
| 304 | Not Modified | 캐시해 둔 내용이 아직 최신이니 그대로 써라. 본문 없음 |
| 307 | Temporary Redirect | 302와 같지만 **메서드와 본문을 그대로 유지**하라고 명확히 정함 |
| 308 | Permanent Redirect | 301과 같지만 메서드와 본문을 그대로 유지 |

### 4xx 클라이언트 오류

| 코드 | 이름 | 의미와 사용 예 |
| --- | --- | --- |
| 400 | Bad Request | 요청 형식이 잘못됨. JSON 문법 오류, 필수 값 누락 등 |
| 401 | Unauthorized | **인증이 안 됨**. 로그인하지 않았거나 토큰이 만료됨 |
| 403 | Forbidden | 누군지는 알지만 **권한이 없음**. 일반 회원이 관리자 페이지 접근 |
| 404 | Not Found | 요청한 자원이 없음 |
| 405 | Method Not Allowed | 그 주소에서 허용하지 않는 메서드. 응답에 `Allow` 헤더로 허용 목록을 알려 줌 |
| 406 | Not Acceptable | 클라이언트가 `Accept` 헤더로 원한 형식(예: XML)을 서버가 줄 수 없음 |
| 408 | Request Timeout | 클라이언트가 요청을 너무 늦게 보내 서버가 기다리다 연결을 끊음 |
| 409 | Conflict | 현재 자원 상태와 충돌. 이미 있는 아이디로 가입, 동시에 같은 글 수정 |
| 422 | Unprocessable Content | 형식은 맞지만 내용이 규칙에 어긋남. 나이에 음수 입력 등 (400으로 통일하는 곳도 많음) |
| 429 | Too Many Requests | 정해진 시간 안에 요청을 너무 많이 보냄. `Retry-After` 헤더로 언제 다시 시도할지 알려 줌 |

### 5xx 서버 오류

| 코드 | 이름 | 의미와 사용 예 |
| --- | --- | --- |
| 500 | Internal Server Error | 서버 코드에서 예상하지 못한 오류 (예외 처리 누락 등) |
| 502 | Bad Gateway | 중간 서버(Nginx 같은 프록시, 게이트웨이)가 뒤쪽 서버로부터 **잘못된 응답**을 받음. 뒤쪽 서버가 죽어 있을 때 흔함 |
| 503 | Service Unavailable | 서버가 지금은 요청을 받을 수 없음. 점검 중이거나 과부하. `Retry-After`를 함께 보내기도 함 |
| 504 | Gateway Timeout | 중간 서버가 뒤쪽 서버의 응답을 **기다리다 시간 초과** |

## 헷갈리는 짝 비교

### 401 vs 403

| 구분 | 401 Unauthorized | 403 Forbidden |
| --- | --- | --- |
| 서버의 생각 | "당신이 누군지 모르겠어요" | "누군지 알지만 이건 안 돼요" |
| 문제 | 인증(Authentication) 실패 | 인가(Authorization) 실패 |
| 예 | 로그인 안 함, 토큰 만료, 잘못된 토큰 | 일반 회원이 관리자 기능 호출, 남의 글 삭제 |
| 클라이언트 대응 | 로그인 화면으로 보내거나 토큰 재발급 | 다시 로그인해도 소용없음. "권한이 없습니다" 안내 |
| 함께 오는 헤더 | `WWW-Authenticate` (어떤 방식으로 인증할지) | 없음 |

이름이 Unauthorized(인가되지 않음)라서 헷갈리지만, 실제 의미는 **인증되지 않음(Unauthenticated)** 입니다. 표준을 만들 당시 이름을 잘못 붙인 것으로 유명합니다. 인증과 인가의 차이는 [인증 방식](/web/knowledge/06-인증-방식)에서 자세히 다룹니다.

> 일부러 404로 숨기기: 비공개 자원이 **존재한다는 사실 자체를 숨기고 싶을 때**는 403 대신 404를 돌려주기도 합니다. GitHub는 권한이 없는 사람이 비공개 저장소 주소에 접근하면 403이 아니라 404를 보여 줍니다.

### 301 vs 302 (그리고 307, 308)

| 구분 | 301 Moved Permanently | 302 Found |
| --- | --- | --- |
| 의미 | 영구 이동 | 일시 이동 |
| 브라우저 | 새 주소를 오래 기억해서 다음부터 바로 새 주소로 감 | 매번 원래 주소로 물어봄 |
| 검색 엔진 | 검색 결과의 주소와 평판을 새 주소로 옮김 | 원래 주소를 계속 검색 결과에 유지 |
| 사용 예 | `http`를 `https`로, 옛 도메인을 새 도메인으로 | 로그인 안 한 사용자를 로그인 페이지로 보냄, 점검 안내 페이지 |

리다이렉트는 요청이 두 번 오갑니다. 서버가 3xx 상태 코드와 함께 `Location` 헤더에 새 주소를 알려 주면, 브라우저가 그 주소로 다시 요청합니다.

![301 리다이렉트 흐름: GET /doc 요청에 301과 Location: /doc_new로 응답하면 클라이언트가 새 주소로 다시 요청해 200을 받음](/images/web/http-status-301-redirect.png)

*그림 출처: [MDN, Redirections in HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Redirections) (CC BY-SA 2.5)*

- 301은 브라우저가 오래 기억하기 때문에, 잘못 설정하면 서버에서 고쳐도 사용자 브라우저에 한동안 남습니다. 확실하지 않으면 302로 시험해 보고 301로 바꾸는 편이 안전합니다.
- 301과 302는 오래된 브라우저들이 POST 요청을 리다이렉트할 때 GET으로 바꿔 버리는 문제가 있었습니다. 그래서 **메서드를 반드시 유지해야 할 때**는 307(일시), 308(영구)을 씁니다.

### 502 vs 504

둘 다 "중간 서버(게이트웨이)"가 등장합니다. 보통 사용자 요청은 Nginx 같은 웹 서버가 먼저 받고, 실제 처리는 뒤쪽의 애플리케이션 서버(WAS)가 합니다. ([웹 서버와 WAS](/web/knowledge/10-웹-서버와-was) 참고)

```
브라우저 ──▶ Nginx (게이트웨이) ──▶ 애플리케이션 서버
                │
                ├─ 뒤쪽 서버가 꺼져 있거나 이상한 응답을 줌 → 502 Bad Gateway
                └─ 뒤쪽 서버가 너무 오래 응답이 없음       → 504 Gateway Timeout
```

## 실제 사례: GitHub API의 403

이 사이트의 [상태 관리 & GitHub API 연동](/web/features/07-상태-관리와-github-api-연동) 글에서는 GitHub API 응답이 403일 때 다른 안내 문구를 보여 줍니다. 로그인 없이 GitHub API를 호출하면 시간당 요청 횟수 제한이 있는데, 이 제한을 넘기면 GitHub는 **403 또는 429** 를 돌려주고 `x-ratelimit-remaining: 0` 헤더를 함께 보냅니다.

- 표준대로라면 횟수 초과는 429가 정확하지만, 실제 서비스는 사정에 따라 다른 코드를 쓰기도 합니다.
- 그래서 상태 코드 숫자만 보지 말고 **API 문서와 응답 헤더**(`x-ratelimit-remaining`, `Retry-After`)를 함께 확인해야 "권한이 없는 403"과 "요청이 너무 많은 403"을 구분할 수 있습니다.

## 코드로 감 잡기: 상황별 상태 코드 직접 받아 보기

Python 기본 모듈로 상황마다 다른 상태 코드를 돌려주는 연습용 서버를 만들어 보겠습니다.

```python
# status_api.py : 상태 코드를 상황별로 돌려주는 연습용 서버
from http.server import BaseHTTPRequestHandler, HTTPServer

ETAG = '"v1"'
calls = {"count": 0}


class Handler(BaseHTTPRequestHandler):
    server_version = "StatusDemo/1.0"
    sys_version = ""

    def reply(self, status, text="", headers=None):
        data = text.encode()
        self.send_response(status)
        for k, v in (headers or {}).items():
            self.send_header(k, v)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        token = self.headers.get("Authorization")
        if self.path == "/old-page":
            # 주소가 영구히 바뀜
            return self.reply(301, headers={"Location": "/new-page"})
        if self.path == "/new-page":
            return self.reply(200, "new page\n")
        if self.path == "/profile":
            if token is None:
                # 누군지 모름: 로그인(인증) 필요
                return self.reply(401, "login required\n", {"WWW-Authenticate": "Bearer"})
            return self.reply(200, "my profile\n")
        if self.path == "/admin":
            if token is None:
                return self.reply(401, "login required\n", {"WWW-Authenticate": "Bearer"})
            if token != "Bearer admin-token":
                # 누군지는 알지만 권한이 없음
                return self.reply(403, "admin only\n")
            return self.reply(200, "admin page\n")
        if self.path == "/logo":
            # 바뀌지 않았으면 본문 없이 304
            if self.headers.get("If-None-Match") == ETAG:
                return self.reply(304, headers={"ETag": ETAG})
            return self.reply(200, "logo-bytes\n", {"ETag": ETAG})
        if self.path == "/limited":
            calls["count"] += 1
            if calls["count"] > 2:
                return self.reply(429, "too many requests\n", {"Retry-After": "60"})
            return self.reply(200, f"ok {calls['count']}\n")
        if self.path == "/crash":
            try:
                1 / 0  # 서버 코드의 실수
            except ZeroDivisionError:
                return self.reply(500, "internal server error\n")
        self.reply(404, "not found\n")

    def log_message(self, *args):
        pass


HTTPServer(("127.0.0.1", 8766), Handler).serve_forever()
```

### 301 리다이렉트

```
$ curl -si http://127.0.0.1:8766/old-page
HTTP/1.0 301 Moved Permanently
Server: StatusDemo/1.0 
Date: Sat, 03 Oct 2026 20:59:13 GMT
Location: /new-page
Content-Length: 0

$ curl -siL http://127.0.0.1:8766/old-page
HTTP/1.0 301 Moved Permanently
Server: StatusDemo/1.0 
Date: Sat, 03 Oct 2026 20:59:13 GMT
Location: /new-page
Content-Length: 0

HTTP/1.0 200 OK
Server: StatusDemo/1.0 
Date: Sat, 03 Oct 2026 20:59:13 GMT
Content-Length: 9

new page
```

`-L` 옵션을 주면 curl이 브라우저처럼 `Location`을 따라가서, 응답이 두 번(301, 200) 찍힙니다.

### 401과 403

```
$ curl -si http://127.0.0.1:8766/profile
HTTP/1.0 401 Unauthorized
Server: StatusDemo/1.0 
Date: Sat, 03 Oct 2026 20:59:13 GMT
WWW-Authenticate: Bearer
Content-Length: 15

login required

$ curl -si http://127.0.0.1:8766/admin -H 'Authorization: Bearer user-token'
HTTP/1.0 403 Forbidden
Server: StatusDemo/1.0 
Date: Sat, 03 Oct 2026 20:59:13 GMT
Content-Length: 11

admin only
```

토큰 없이 요청하면 401과 함께 "Bearer 방식으로 인증하세요"라는 `WWW-Authenticate` 헤더가 옵니다. 일반 사용자 토큰을 넣으면 누군지는 알게 되었지만 관리자가 아니므로 403이 옵니다.

### 304 Not Modified

```
$ curl -si http://127.0.0.1:8766/logo
HTTP/1.0 200 OK
Server: StatusDemo/1.0 
Date: Sat, 03 Oct 2026 20:59:13 GMT
ETag: "v1"
Content-Length: 11

logo-bytes

$ curl -si http://127.0.0.1:8766/logo -H 'If-None-Match: "v1"'
HTTP/1.0 304 Not Modified
Server: StatusDemo/1.0 
Date: Sat, 03 Oct 2026 20:59:13 GMT
ETag: "v1"
Content-Length: 0
```

첫 응답의 `ETag`(내용의 버전 표시)를 기억했다가 `If-None-Match`로 "내가 가진 건 v1인데 바뀌었나요?"라고 물으면, 바뀌지 않았으니 본문 없이 304만 옵니다. 브라우저 캐시가 이렇게 동작해서 같은 이미지를 매번 다시 내려받지 않습니다.

### 429, 500, 404

```
$ for i in 1 2 3; do curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8766/limited; done
200
200
429

$ curl -si http://127.0.0.1:8766/limited | head -3
HTTP/1.0 429 Too Many Requests
Server: StatusDemo/1.0 
Date: Sat, 03 Oct 2026 20:59:13 GMT

$ curl -si http://127.0.0.1:8766/crash
HTTP/1.0 500 Internal Server Error
Server: StatusDemo/1.0 
Date: Sat, 03 Oct 2026 20:59:13 GMT
Content-Length: 22

internal server error

$ curl -si http://127.0.0.1:8766/nothing
HTTP/1.0 404 Not Found
Server: StatusDemo/1.0 
Date: Sat, 03 Oct 2026 20:59:13 GMT
Content-Length: 10

not found
```

세 번째 요청부터 429가 옵니다. 실제 서비스라면 클라이언트는 `Retry-After: 60`을 보고 60초 뒤에 다시 시도해야 합니다.

### 이름은 표준 목록에서 확인하기

Python에는 표준 상태 코드 이름이 들어 있어서, 이름을 헷갈릴 때 바로 확인할 수 있습니다.

```python
from http import HTTPStatus
for code in [100, 200, 201, 202, 204, 300, 301, 302, 304, 307, 308, 400, 401, 403, 404, 405, 409, 429, 500, 502, 503, 504]:
    print(code, HTTPStatus(code).phrase)
```

```
100 Continue
200 OK
201 Created
202 Accepted
204 No Content
300 Multiple Choices
301 Moved Permanently
302 Found
304 Not Modified
307 Temporary Redirect
308 Permanent Redirect
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
405 Method Not Allowed
409 Conflict
429 Too Many Requests
500 Internal Server Error
502 Bad Gateway
503 Service Unavailable
504 Gateway Timeout
```

## API를 만들 때 상태 코드를 고르는 요령

1. 성공했나? → 새로 만들었으면 201, 돌려줄 내용이 없으면 204, 나머지는 200
2. 요청 형식이 틀렸나? → 400 (규칙 위반을 따로 구분하고 싶으면 422)
3. 누군지 모르나? → 401
4. 누군지 알지만 권한이 없나? → 403 (존재 자체를 숨기려면 404)
5. 대상이 없나? → 404
6. 이미 있거나 현재 상태와 부딪히나? → 409
7. 너무 자주 요청했나? → 429
8. 서버 코드가 예상 못 한 오류를 냈나? → 500

자주 하는 실수는 **에러인데 200을 돌려주고 본문에만 `"success": false`를 적는 것**입니다. 이렇게 하면 브라우저, 모니터링 도구, 재시도 로직이 모두 성공으로 착각합니다. 상태 코드로 큰 결과를 알리고, 본문에는 자세한 이유를 담는 것이 좋습니다.

```json
{
  "error": {
    "code": "DUPLICATE_EMAIL",
    "message": "이미 가입된 이메일입니다"
  }
}
```

## 면접에서 자주 나오는 질문

**Q. 401과 403의 차이는 무엇인가요?**
401은 인증 실패로, 서버가 요청한 사람이 누군지 모르는 상태입니다. 로그인하거나 토큰을 다시 받으면 해결됩니다. 403은 인가 실패로, 누군지는 알지만 그 작업을 할 권한이 없는 상태라 다시 로그인해도 해결되지 않습니다.

**Q. 301과 302는 어떻게 다른가요?**
301은 영구 이동이라 브라우저와 검색 엔진이 새 주소를 기억하고, 302는 일시 이동이라 원래 주소를 계속 사용합니다. 메서드를 그대로 유지해야 하면 308(영구), 307(일시)을 씁니다.

**Q. 304 Not Modified는 언제 오나요?**
클라이언트가 캐시한 버전 정보(`If-None-Match`의 ETag나 `If-Modified-Since`의 날짜)를 보냈는데 서버의 내용이 바뀌지 않았을 때 옵니다. 본문 없이 응답하므로 네트워크를 아낄 수 있습니다.

**Q. 502와 504의 차이는 무엇인가요?**
둘 다 프록시나 게이트웨이 뒤의 서버 문제입니다. 502는 뒤쪽 서버로부터 잘못된 응답을 받았거나 연결이 안 될 때, 504는 뒤쪽 서버의 응답을 기다리다 시간이 초과됐을 때입니다.

**Q. 에러가 났을 때 200을 주고 본문에 실패를 적으면 안 되나요?**
권장하지 않습니다. 클라이언트 라이브러리, 캐시, 모니터링, 재시도 로직이 상태 코드를 기준으로 동작하기 때문에 실패를 성공으로 착각합니다. 상태 코드로 결과의 종류를 알리고, 자세한 이유는 본문에 담습니다.

## 정리

| 범주 | 한 줄 요약 | 꼭 기억할 코드 |
| --- | --- | --- |
| 1xx | 처리 중 | 101 (웹소켓 전환) |
| 2xx | 성공 | 200 OK, 201 Created, 204 No Content |
| 3xx | 다른 곳으로 가거나 캐시를 써라 | 301 영구 이동, 302 일시 이동, 304 캐시 그대로 사용 |
| 4xx | 요청한 쪽 문제 | 400 형식 오류, 401 인증 필요, 403 권한 없음, 404 없음, 409 충돌, 429 너무 많음 |
| 5xx | 서버 쪽 문제 | 500 내부 오류, 502 잘못된 게이트웨이 응답, 503 이용 불가, 504 게이트웨이 시간 초과 |

- 같은 요청에 어떤 메서드를 쓰는지는 [HTTP 요청 메서드](/web/knowledge/02-http-요청-메서드), 메서드와 상태 코드를 조합해 API를 설계하는 방법은 [REST API](/web/knowledge/04-rest-api)에서 이어집니다.
