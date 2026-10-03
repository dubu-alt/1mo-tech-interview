---
title: "HTTP 요청 메서드 (GET · POST · PUT · PATCH · DELETE)"
sidebar: "HTTP 요청 메서드"
---

HTTP 요청 메서드는 **클라이언트(브라우저, 앱)가 서버에게 "이 자원으로 무엇을 하고 싶은지"를 알려 주는 동사**입니다. 같은 주소(`/users/1`)라도 GET을 보내면 "보여 주세요", DELETE를 보내면 "지워 주세요"라는 뜻이 됩니다.

## 핵심 아이디어

- 주소(URL)는 **무엇을**(명사), 메서드는 **어떻게**(동사)를 나타냅니다.
- 비유: 도서관 창구에 책 번호가 적힌 쪽지를 내미는 상황입니다.
  - "이 책 보여 주세요" → GET
  - "새 책을 기증할게요" → POST
  - "이 책을 새 판으로 통째로 바꿔 주세요" → PUT
  - "표지만 바꿔 주세요" → PATCH
  - "이 책은 폐기해 주세요" → DELETE
  - "이 창구에서는 어떤 일을 해 주시나요?" → OPTIONS
- 메서드마다 **안전한지, 여러 번 보내도 결과가 같은지(멱등), 캐시해도 되는지**가 정해져 있어서, 브라우저와 서버, 중간의 프록시가 이 약속을 믿고 동작합니다.

## HTTP 요청은 어떻게 생겼을까

HTTP 요청은 사람이 읽을 수 있는 텍스트입니다. 맨 첫 줄에 메서드가 들어갑니다.

```
PATCH /users/1 HTTP/1.1          ← 요청 줄: 메서드, 경로, HTTP 버전
Host: api.example.com            ← 헤더: 요청에 대한 부가 정보
Content-Type: application/json
Content-Length: 11
                                 ← 빈 줄 (헤더 끝)
{"age": 21}                      ← 본문(body): 서버에 보낼 데이터
```

GET처럼 데이터를 받기만 하는 요청은 보통 본문이 없고, POST/PUT/PATCH처럼 데이터를 보내는 요청은 본문에 JSON 같은 내용을 담습니다.

## 메서드 한눈에 보기

| 메서드 | 하는 일 | 본문 | 대표 예 |
| --- | --- | --- | --- |
| GET | 자원을 조회 | 보통 없음 | 회원 목록 보기 `GET /users` |
| HEAD | GET과 같지만 헤더만 받음 | 없음 | 파일 크기만 확인 |
| POST | 새 자원 생성, 데이터 제출 | 있음 | 회원 가입 `POST /users` |
| PUT | 자원 전체를 교체 (없으면 생성할 수도 있음) | 있음 | 회원 정보 전체 수정 `PUT /users/1` |
| PATCH | 자원의 일부만 수정 | 있음 | 나이만 수정 `PATCH /users/1` |
| DELETE | 자원 삭제 | 보통 없음 | 회원 탈퇴 `DELETE /users/1` |
| OPTIONS | 서버가 허용하는 메서드나 CORS 정책 확인 | 없음 | 브라우저의 CORS 사전 요청 |
| CONNECT | 프록시와 터널 연결 | 없음 | 프록시를 거친 HTTPS 연결 |
| TRACE | 서버가 받은 요청을 그대로 되돌려 받음 | 없음 | 경로 진단 (보안상 대부분 꺼 둠) |

### GET

자원을 **조회**합니다. 필요한 조건은 주소 뒤의 쿼리 스트링(`?page=2&sort=name`)에 담습니다.

- 서버의 데이터를 바꾸면 안 됩니다. 검색 엔진 로봇이나 브라우저의 미리 불러오기 기능이 GET 링크를 마음대로 눌러도 문제가 없어야 하기 때문입니다.
- GET 요청에 본문을 넣는 것은 HTTP 표준에서 의미가 정해져 있지 않아서, 서버나 프록시가 무시하거나 거절할 수 있습니다. 조건은 쿼리 스트링으로 보내는 것이 원칙입니다.

### HEAD

GET과 똑같이 요청하지만 **응답 본문 없이 헤더만** 받습니다. 큰 파일을 내려받기 전에 크기(`Content-Length`)나 수정 시각(`Last-Modified`)만 확인할 때 씁니다.

### POST

**새 자원을 만들거나, 서버에 데이터를 제출**합니다. 데이터는 본문에 담습니다.

- 회원 가입, 글쓰기, 결제 요청처럼 "처리해 주세요"라는 요청에 두루 쓰입니다.
- 새 자원이 만들어지면 서버는 보통 `201 Created`와 함께 새 자원의 주소를 `Location` 헤더로 알려 줍니다.
- 같은 요청을 두 번 보내면 글이 두 개 생길 수 있습니다. 그래서 결제 버튼을 두 번 누르는 사고를 막으려면 별도의 장치(버튼 비활성화, 중복 방지 키)가 필요합니다.

### PUT

**자원 전체를 보낸 내용으로 교체**합니다. 원문에서는 "POST와 비슷하지만 기존 데이터를 갱신"이라고 설명하지만, 정확히는 "이 주소의 자원을 통째로 이 내용으로 바꿔 달라"는 뜻입니다.

- 보낸 내용에 빠진 필드는 사라질 수 있습니다. (아래 PUT vs PATCH 참고)
- 해당 주소에 자원이 없으면 새로 만들 수도 있습니다. 이때 자원의 주소는 클라이언트가 정합니다. (POST는 서버가 주소를 정함)

### PATCH

자원의 **일부만 수정**합니다. 바꾸고 싶은 필드만 보내면 됩니다.

### DELETE

자원을 **삭제**합니다.

- 원문에는 "실제로 삭제하지 않고 비활성화로 구성한다"고 적혀 있는데, 이것은 DELETE 메서드의 규칙이 아니라 **서버를 만드는 쪽의 구현 선택**입니다. 실수로 지운 데이터를 되살리거나 기록을 남기기 위해, DB에서 바로 지우지 않고 `deleted_at` 같은 표시만 해 두는 방식을 **소프트 삭제(soft delete)** 라고 합니다.
- 클라이언트 입장에서는 소프트 삭제든 실제 삭제든 똑같이 "이제 이 자원은 없다"로 보이면 됩니다.

### OPTIONS

서버에게 **"이 주소에서 어떤 메서드를 쓸 수 있나요?"** 를 묻습니다. 서버는 `Allow` 헤더로 답합니다. 오늘날 가장 많이 쓰이는 곳은 브라우저의 **CORS 사전 요청(프리플라이트)** 입니다. 아래에서 따로 설명합니다.

### CONNECT와 TRACE

- **CONNECT**: 프록시 서버에게 "목적지 서버까지 터널을 뚫어 달라"고 요청합니다. 회사 프록시를 거쳐 HTTPS 사이트에 접속할 때, 프록시는 암호화된 내용을 볼 수 없으니 터널만 연결해 주고 데이터를 그대로 전달합니다.
- **TRACE**: 서버가 받은 요청을 본문에 그대로 담아 되돌려 줍니다. 중간 프록시가 요청을 어떻게 바꾸는지 진단하는 용도였지만, 쿠키 같은 정보를 빼낼 수 있는 공격(XST, Cross-Site Tracing)에 악용될 수 있어 대부분의 서버에서 꺼 둡니다.

## 안전, 멱등, 캐시 가능

메서드를 고를 때 가장 중요한 기준은 아래 세 가지 성질입니다.

### 안전한 메서드 (Safe)

**서버의 데이터를 바꾸지 않는** 메서드입니다. 읽기만 합니다. GET, HEAD, OPTIONS, TRACE가 여기에 속합니다.

> 안전하다고 해서 서버에서 아무 일도 안 일어난다는 뜻은 아닙니다. 조회할 때 접속 로그가 쌓이거나 조회수가 올라갈 수는 있습니다. 다만 클라이언트가 "데이터를 바꿔 달라"고 요청한 것은 아니라는 뜻입니다.

### 멱등한 메서드 (Idempotent)

**같은 요청을 한 번 보내든 열 번 보내든 서버의 최종 상태가 같은** 메서드입니다. 엘리베이터의 "3층" 버튼을 여러 번 눌러도 3층에 한 번 서는 것과 같습니다.

- GET, HEAD, OPTIONS, TRACE: 원래 바꾸는 게 없으니 멱등
- PUT: "1번 회원을 이 내용으로 바꿔라"를 열 번 해도 결과는 같음
- DELETE: "1번 회원을 지워라"를 두 번 해도 1번 회원이 없는 상태는 같음 (두 번째 응답 코드가 404로 달라질 수는 있지만, 멱등은 **응답이 아니라 서버 상태** 기준)
- POST: 보낼 때마다 새 글이 생기므로 멱등이 아님
- PATCH: 보내는 내용에 따라 다름. `{"age": 21}`처럼 값을 정하는 요청은 멱등이지만, "나이를 1 올려라" 같은 요청은 보낼 때마다 결과가 달라지므로 표준은 PATCH를 멱등으로 보장하지 않습니다.

멱등성이 중요한 이유는 **재시도** 때문입니다. 네트워크가 끊겨 응답을 못 받았을 때, 멱등한 요청은 안심하고 다시 보낼 수 있지만 POST를 다시 보내면 주문이 두 번 들어갈 수 있습니다.

### 캐시 가능한 메서드 (Cacheable)

응답을 저장해 두었다가 다음에 다시 써도 되는 메서드입니다.

- GET, HEAD: 캐시 가능 (브라우저 캐시, CDN이 주로 이것을 저장)
- POST, PATCH: 응답에 "언제까지 신선한지" 정보가 명확히 있으면 표준상 가능하지만, 실제로는 거의 캐시하지 않음
- PUT, DELETE 등: 캐시하지 않음

### 세 성질을 한 표에

| 메서드 | 안전 | 멱등 | 캐시 가능 |
| --- | --- | --- | --- |
| GET | O | O | O |
| HEAD | O | O | O |
| OPTIONS | O | O | X |
| TRACE | O | O | X |
| PUT | X | O | X |
| DELETE | X | O | X |
| POST | X | X | 조건부 (거의 안 함) |
| PATCH | X | X (보장 안 함) | 조건부 (거의 안 함) |
| CONNECT | X | X | X |

## PUT vs PATCH

둘 다 "수정"이지만, PUT은 **통째로 교체**, PATCH는 **일부만 변경**입니다.

```
현재 1번 회원: {"id": 1, "name": "kim", "age": 20}

PATCH /users/1  {"age": 21}
→ {"id": 1, "name": "kim", "age": 21}     age만 바뀜

PUT /users/1    {"name": "kim"}
→ {"id": 1, "name": "kim", "age": null}   보내지 않은 age가 사라짐
```

| 구분 | PUT | PATCH |
| --- | --- | --- |
| 의미 | 자원 전체를 이 내용으로 교체 | 자원의 일부만 수정 |
| 보내는 데이터 | 자원 전체 | 바꿀 필드만 |
| 빠뜨린 필드 | 사라지거나 기본값이 됨 | 그대로 유지 |
| 자원이 없을 때 | 새로 만들 수 있음 | 보통 404 |
| 멱등성 | 보장 | 보장 안 함 |

실무에서 "회원 정보 수정" 화면처럼 일부 필드만 바꾸는 기능은 PATCH가 더 자연스럽습니다. PUT으로 만들면 클라이언트가 항상 전체 데이터를 보내야 합니다.

## GET vs POST

| 구분 | GET | POST |
| --- | --- | --- |
| 목적 | 조회 | 생성, 제출 |
| 데이터 위치 | URL의 쿼리 스트링 | 요청 본문 |
| 길이 제한 | URL 길이 제한이 있음 (브라우저, 서버마다 다름) | 사실상 없음 (서버 설정에 따름) |
| 브라우저 기록, 북마크 | 주소에 데이터가 남음 | 남지 않음 |
| 캐시 | 됨 | 보통 안 됨 |
| 안전, 멱등 | 둘 다 O | 둘 다 X |
| 새로 고침 | 그냥 다시 요청 | "양식을 다시 제출할까요?" 경고 |

자주 하는 오해가 **"POST가 GET보다 보안상 안전하다"** 입니다. POST는 데이터가 주소창이나 방문 기록, 서버 접속 로그에 남지 않는다는 점에서는 낫지만, HTTPS가 아니면 본문도 그대로 보입니다. 비밀번호 같은 민감 정보는 **POST + HTTPS** 로 보내야 하고, 메서드만 바꾼다고 암호화되지는 않습니다.

## OPTIONS와 CORS 프리플라이트

### CORS란

브라우저는 보안을 위해 **다른 출처(origin)** 의 서버에 자바스크립트로 요청하는 것을 기본적으로 제한합니다. 출처는 `프로토콜 + 도메인 + 포트`를 합친 것으로, 셋 중 하나라도 다르면 다른 출처입니다.

- `https://1mo.dev` 와 `https://api.1mo.dev` → 도메인이 달라서 다른 출처
- `http://localhost:5173` 와 `http://localhost:8000` → 포트가 달라서 다른 출처

**CORS(Cross-Origin Resource Sharing)** 는 서버가 "이 출처에서 오는 요청은 허용한다"고 응답 헤더로 알려 주어, 브라우저가 다른 출처 요청을 허락하도록 하는 규칙입니다.

### 프리플라이트가 일어나는 경우

서버 데이터를 바꿀 수 있는 요청은 브라우저가 **본 요청을 보내기 전에 OPTIONS로 먼저 물어봅니다**. 이것을 **프리플라이트(preflight, 사전 요청)** 라고 합니다. 아래 조건 중 하나라도 해당하면 프리플라이트가 발생합니다.

- 메서드가 GET, HEAD, POST가 아닌 경우 (PUT, PATCH, DELETE 등)
- `Content-Type`이 `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain`이 아닌 경우 (예: `application/json`)
- `Authorization` 같은 사용자 정의 헤더를 넣은 경우

### 흐름

```
브라우저 (https://1mo.dev)                       API 서버
   │                                               │
   │ 1) OPTIONS /users                             │
   │    Origin: https://1mo.dev                    │
   │    Access-Control-Request-Method: PATCH       │
   │ ───────────────────────────────────────────▶ │
   │                                               │
   │ 2) 204 No Content                             │
   │    Access-Control-Allow-Origin: https://1mo.dev
   │    Access-Control-Allow-Methods: GET, PATCH ...│
   │ ◀─────────────────────────────────────────── │
   │                                               │
   │ 3) 허용됐으니 진짜 요청: PATCH /users/1        │
   │ ───────────────────────────────────────────▶ │
```

- 서버가 허용 헤더를 돌려주지 않으면 브라우저는 3번 요청을 보내지 않고 콘솔에 CORS 오류를 띄웁니다.
- CORS는 **브라우저가 지키는 규칙**입니다. 그래서 curl이나 서버끼리의 요청에는 적용되지 않습니다. "Postman에서는 되는데 브라우저에서는 안 돼요"의 대부분이 이 경우입니다.
- 서버는 `Access-Control-Max-Age` 헤더로 프리플라이트 결과를 일정 시간 기억하게 해서, 매번 OPTIONS를 보내는 비용을 줄일 수 있습니다.

## 코드로 감 잡기: 작은 서버에 메서드별로 요청해 보기

Python 기본 모듈만으로 회원 목록을 메모리에 저장하는 작은 API 서버를 만들고, `curl`로 메서드를 하나씩 보내 보겠습니다.

```python
# mini_api.py : 메모리에 회원 목록을 저장하는 아주 작은 REST API 서버
import json
from http.server import BaseHTTPRequestHandler, HTTPServer

users = {1: {"id": 1, "name": "kim", "age": 20}}
next_id = 2


class Handler(BaseHTTPRequestHandler):
    server_version = "MiniAPI/1.0"
    sys_version = ""

    def send_json(self, status, body=None, headers=None):
        data = b"" if body is None else json.dumps(body, ensure_ascii=False).encode()
        self.send_response(status)
        for k, v in (headers or {}).items():
            self.send_header(k, v)
        if body is not None:
            self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(data)

    def read_body(self):
        length = int(self.headers.get("Content-Length", 0))
        return json.loads(self.rfile.read(length) or b"{}")

    def user_id(self):
        # /users/1 -> 1, /users -> None
        parts = self.path.strip("/").split("/")
        if parts[0] != "users":
            return "bad"
        return int(parts[1]) if len(parts) > 1 else None

    def do_GET(self):
        uid = self.user_id()
        if uid == "bad":
            return self.send_json(404, {"error": "없는 주소"})
        if uid is None:
            return self.send_json(200, list(users.values()))
        if uid not in users:
            return self.send_json(404, {"error": "없는 회원"})
        self.send_json(200, users[uid])

    do_HEAD = do_GET

    def do_POST(self):
        global next_id
        body = self.read_body()
        if "name" not in body:
            return self.send_json(400, {"error": "name이 필요합니다"})
        user = {"id": next_id, "name": body["name"], "age": body.get("age")}
        users[next_id] = user
        next_id += 1
        self.send_json(201, user, {"Location": f"/users/{user['id']}"})

    def do_PUT(self):
        uid = self.user_id()
        body = self.read_body()
        # PUT은 리소스 전체를 보낸 값으로 바꾼다 (빠진 필드는 사라짐)
        users[uid] = {"id": uid, "name": body.get("name"), "age": body.get("age")}
        self.send_json(200, users[uid])

    def do_PATCH(self):
        uid = self.user_id()
        if uid not in users:
            return self.send_json(404, {"error": "없는 회원"})
        # PATCH는 보낸 필드만 바꾼다
        users[uid].update(self.read_body())
        self.send_json(200, users[uid])

    def do_DELETE(self):
        uid = self.user_id()
        if uid not in users:
            return self.send_json(404, {"error": "없는 회원"})
        del users[uid]
        self.send_json(204)

    def do_OPTIONS(self):
        self.send_json(204, headers={
            "Allow": "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS",
            "Access-Control-Allow-Origin": "https://1mo.dev",
            "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE",
            "Access-Control-Allow-Headers": "Content-Type",
        })

    def log_message(self, *args):
        pass


HTTPServer(("127.0.0.1", 8765), Handler).serve_forever()
```

`python3 mini_api.py`로 서버를 켜 두고, 다른 터미널에서 요청을 보냅니다. `curl -i`는 응답 헤더까지 보여 주는 옵션입니다.

### GET과 HEAD

```
$ curl -i http://127.0.0.1:8765/users
HTTP/1.0 200 OK
Server: MiniAPI/1.0 
Date: Sat, 03 Oct 2026 20:58:52 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 37

[{"id": 1, "name": "kim", "age": 20}]

$ curl -I http://127.0.0.1:8765/users/1
HTTP/1.0 200 OK
Server: MiniAPI/1.0 
Date: Sat, 03 Oct 2026 20:58:52 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 35
```

HEAD(`curl -I`)는 `Content-Length: 35`로 본문 크기는 알려 주지만, 본문 자체는 오지 않습니다. (응답 첫 줄이 `HTTP/1.0`인 것은 Python 기본 서버가 HTTP/1.0으로 응답하기 때문이며, 메서드 동작과는 관계없습니다.)

### POST로 만들기

```
$ curl -i -X POST http://127.0.0.1:8765/users -H 'Content-Type: application/json' -d '{"name": "lee", "age": 25}'
HTTP/1.0 201 Created
Server: MiniAPI/1.0 
Date: Sat, 03 Oct 2026 20:58:52 GMT
Location: /users/2
Content-Type: application/json; charset=utf-8
Content-Length: 35

{"id": 2, "name": "lee", "age": 25}
```

새 회원의 번호(2)는 서버가 정했고, `Location` 헤더로 새 자원의 주소를 알려 줍니다.

### PATCH와 PUT의 차이

```
$ curl -i -X PATCH http://127.0.0.1:8765/users/1 -H 'Content-Type: application/json' -d '{"age": 21}'
HTTP/1.0 200 OK
Server: MiniAPI/1.0 
Date: Sat, 03 Oct 2026 20:58:52 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 35

{"id": 1, "name": "kim", "age": 21}

$ curl -i -X PUT http://127.0.0.1:8765/users/1 -H 'Content-Type: application/json' -d '{"name": "kim"}'
HTTP/1.0 200 OK
Server: MiniAPI/1.0 
Date: Sat, 03 Oct 2026 20:58:52 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 37

{"id": 1, "name": "kim", "age": null}
```

PATCH는 `age`만 바꿨고 `name`은 그대로입니다. PUT은 `name`만 보냈더니 `age`가 `null`이 되었습니다. 자원 전체를 교체했기 때문입니다.

### DELETE를 두 번 보내면

```
$ curl -i -X DELETE http://127.0.0.1:8765/users/2
HTTP/1.0 204 No Content
Server: MiniAPI/1.0 
Date: Sat, 03 Oct 2026 20:58:52 GMT
Content-Length: 0

$ curl -i -X DELETE http://127.0.0.1:8765/users/2
HTTP/1.0 404 Not Found
Server: MiniAPI/1.0 
Date: Sat, 03 Oct 2026 20:58:52 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 26

{"error": "없는 회원"}
```

응답 코드는 204와 404로 다르지만, 서버 상태는 두 번 모두 "2번 회원이 없음"으로 같습니다. 그래서 DELETE는 멱등입니다.

### OPTIONS (프리플라이트 흉내)

```
$ curl -i -X OPTIONS http://127.0.0.1:8765/users -H 'Origin: https://1mo.dev' -H 'Access-Control-Request-Method: PATCH'
HTTP/1.0 204 No Content
Server: MiniAPI/1.0 
Date: Sat, 03 Oct 2026 20:58:52 GMT
Allow: GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Origin: https://1mo.dev
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type
Content-Length: 0
```

브라우저가 보내는 프리플라이트와 같은 헤더를 넣어 보냈습니다. 서버가 `https://1mo.dev`와 `PATCH`를 허용한다고 답했으니, 브라우저라면 이어서 진짜 PATCH 요청을 보냅니다.

### 멱등성 직접 확인하기: POST 두 번 vs PUT 두 번

서버를 새로 켠 뒤(회원 1명) 같은 요청을 두 번씩 보내 봅니다.

```python
import json
import urllib.request

BASE = "http://127.0.0.1:8765"

def call(method, path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(BASE + path, data=data, method=method,
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as res:
        return res.status, json.loads(res.read() or b"null")

print("[POST 두 번]")
for _ in range(2):
    print(call("POST", "/users", {"name": "park", "age": 30}))
print("회원 수:", len(call("GET", "/users")[1]))

print("[PUT 두 번]")
for _ in range(2):
    print(call("PUT", "/users/1", {"name": "kim", "age": 22}))
print("회원 수:", len(call("GET", "/users")[1]))
```

```
[POST 두 번]
(201, {'id': 2, 'name': 'park', 'age': 30})
(201, {'id': 3, 'name': 'park', 'age': 30})
회원 수: 3
[PUT 두 번]
(200, {'id': 1, 'name': 'kim', 'age': 22})
(200, {'id': 1, 'name': 'kim', 'age': 22})
회원 수: 3
```

POST는 보낼 때마다 회원이 하나씩 늘어났지만(2번, 3번), PUT은 두 번 보내도 1번 회원의 상태가 똑같습니다.

## 면접에서 자주 나오는 질문

**Q. GET과 POST의 차이는 무엇인가요?**
GET은 조회용이라 데이터를 URL 쿼리 스트링에 담고, 안전하고 멱등하며 캐시됩니다. POST는 생성이나 제출용이라 데이터를 본문에 담고, 멱등하지 않으며 보통 캐시하지 않습니다. 보안은 메서드가 아니라 HTTPS로 지켜야 합니다.

**Q. PUT과 PATCH는 어떻게 다른가요?**
PUT은 자원 전체를 보낸 내용으로 교체하고, PATCH는 보낸 필드만 수정합니다. PUT은 멱등이 보장되지만 PATCH는 요청 내용에 따라 달라서 보장되지 않습니다.

**Q. 멱등성이란 무엇이고 왜 중요한가요?**
같은 요청을 여러 번 보내도 서버 상태가 한 번 보낸 것과 같은 성질입니다. 네트워크 오류로 응답을 못 받았을 때 안전하게 재시도할 수 있는지를 결정하기 때문에 중요합니다. GET, PUT, DELETE는 멱등이고 POST는 아닙니다.

**Q. DELETE를 두 번 보내면 두 번째는 404인데, 그래도 멱등인가요?**
네. 멱등성은 응답 코드가 아니라 서버의 상태를 기준으로 판단합니다. 두 번 모두 "그 자원이 없는 상태"로 끝나므로 멱등입니다.

**Q. 브라우저가 내가 보내지도 않은 OPTIONS 요청을 보내는 이유는 무엇인가요?**
다른 출처의 서버에 PUT, DELETE나 JSON 본문, 인증 헤더가 포함된 요청을 보낼 때, 브라우저가 서버에 먼저 허용 여부를 묻는 CORS 프리플라이트입니다. 서버가 허용 헤더로 답해야 본 요청이 전송됩니다.

## 정리

| 개념 | 한 줄 요약 |
| --- | --- |
| 요청 메서드 | URL(무엇을)에 대해 무엇을 할지(동사) 알려 주는 표시 |
| GET / HEAD | 조회 / 헤더만 조회. 안전, 멱등, 캐시 가능 |
| POST | 생성, 제출. 멱등이 아니어서 중복 요청에 주의 |
| PUT / PATCH | 전체 교체(멱등) / 일부 수정(멱등 보장 안 함) |
| DELETE | 삭제. 멱등. 소프트 삭제는 서버 구현 선택 |
| OPTIONS | 허용 메서드 확인, CORS 프리플라이트에 사용 |
| CONNECT / TRACE | 프록시 터널 / 요청 되돌려 받기(보안상 대부분 비활성) |
| 안전 | 서버 데이터를 바꾸지 않음 |
| 멱등 | 여러 번 보내도 서버 상태가 같음 (재시도 가능 여부) |

- 메서드를 어떤 응답 코드와 함께 돌려주는지는 [HTTP 상태 코드](/web/knowledge/03-http-상태-코드)에서, 메서드와 URL을 조합해 API를 설계하는 방법은 [REST API](/web/knowledge/04-rest-api)에서 이어집니다.
