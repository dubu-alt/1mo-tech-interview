---
title: "REST API"
---

REST는 **웹(HTTP)이 원래 가진 장점을 그대로 살려서, 모든 것을 "자원(명사)"으로 보고 주소(URI)로 이름 붙인 뒤 HTTP 메서드(동사)로 다루자는 설계 방식**이고, REST API는 이 방식을 따라 만든 API입니다.

## 핵심 아이디어

- REST는 Representational State Transfer(표현 상태 전송)의 줄임말입니다. 2000년에 HTTP 표준을 만든 사람 중 한 명인 로이 필딩(Roy Fielding)이 박사 논문에서 정리했습니다.
- 비유: 잘 정리된 도서관입니다.
  - 책 한 권 한 권이 **자원(Resource)** 입니다.
  - 책마다 붙은 청구기호가 **URI** 입니다. (`/books/42`)
  - "빌려 주세요, 반납할게요, 폐기해 주세요" 같은 요청이 **HTTP 메서드** 입니다.
  - 책 자체를 주는 대신 건네주는 책 정보 카드(제목, 저자)가 **표현(Representation)** 입니다. 같은 책이라도 카드는 한국어판(JSON), 영어판(XML)처럼 여러 형태가 될 수 있습니다.
- 어느 도서관에 가도 청구기호와 대출 규칙이 비슷하면 처음 가도 바로 이용할 수 있듯이, REST 규칙을 따르면 **처음 보는 API도 주소와 메서드만 보고 무슨 일을 하는지 짐작**할 수 있습니다.

## REST를 이루는 세 가지 요소

```
DELETE  /users/1        ← 행위(Method) + 자원(URI)
Accept: application/json

{"id": 1, "name": "kim"} ← 표현(Representation)
```

### 자원 (Resource)

서버가 관리하는 모든 것(회원, 글, 댓글, 주문)을 자원으로 보고, **URI로 이름**을 붙입니다.

- 컬렉션(목록): `/users`
- 컬렉션 안의 하나: `/users/1`
- 하위 자원: `/users/1/posts` (1번 회원이 쓴 글 목록)

### 행위 (Method)

자원에 대해 무엇을 할지는 URI가 아니라 **HTTP 메서드**로 표현합니다. 각 메서드의 성질은 [HTTP 요청 메서드](/web/knowledge/02-http-요청-메서드)에서 자세히 다룹니다.

### 표현 (Representation)

클라이언트와 서버는 자원 그 자체가 아니라, 자원의 **현재 상태를 담은 표현**을 주고받습니다. 예전에는 XML도 많이 썼지만 지금은 대부분 JSON을 씁니다. 클라이언트는 `Accept` 헤더로 원하는 형식을 말하고, 서버는 `Content-Type` 헤더로 실제로 보낸 형식을 알려 줍니다.

```
POST /users
Content-Type: application/json

{"name": "terry"}
```

> 원문 예시는 `{"users": {"name": "terry"}}`처럼 한 단계 더 감쌌는데, 만들 대상이 회원 한 명이라면 위처럼 그 회원의 필드만 보내는 형태가 더 일반적입니다.

## REST의 6가지 제약 조건

필딩이 정의한 REST는 아래 6가지 조건을 지키는 아키텍처입니다. 이 조건을 잘 지킨 API를 "RESTful하다"고 부릅니다.

### 1. 클라이언트-서버 (Client-Server)

화면을 담당하는 쪽(클라이언트)과 데이터와 로직을 담당하는 쪽(서버)을 나눕니다. 서로 약속한 API만 지키면 웹, 앱, 다른 서버 등 어떤 클라이언트든 같은 서버를 쓸 수 있고, 양쪽을 따로 개발하고 배포할 수 있습니다.

### 2. 무상태 (Stateless)

서버는 **요청과 요청 사이에 클라이언트의 상태를 기억하지 않습니다**. 각 요청에는 그 요청을 처리하는 데 필요한 정보(누가 보냈는지 알려 주는 토큰 등)가 모두 담겨 있어야 합니다.

- 장점: 어떤 서버가 요청을 받아도 똑같이 처리할 수 있으니, 서버를 여러 대로 늘리기(수평 확장) 쉽습니다.
- 단점: 매 요청마다 인증 정보 같은 내용을 반복해서 보내야 합니다.
- 예: 로그인 상태를 서버 세션에 저장하는 대신, 요청마다 [JWT](/web/knowledge/07-jwt) 같은 토큰을 `Authorization` 헤더에 담아 보냅니다. ([쿠키와 세션](/web/knowledge/05-쿠키와-세션)과 비교해 보세요.)

> 원문에는 "REST API 실행 중 실패하면 트랜잭션 복구를 위해 기존 상태를 저장할 필요가 있다"는 문장이 있는데, 무상태 조건과는 관계가 없는 설명입니다. 무상태는 **서버가 클라이언트의 대화 맥락(세션)을 기억하지 않는다**는 뜻이고, DB에 데이터를 저장하지 않는다는 뜻이 아닙니다. 회원 정보나 주문 같은 자원의 상태는 당연히 서버의 DB에 저장됩니다.

### 3. 캐시 가능 (Cacheable)

응답에 "이 응답을 저장해 두고 다시 써도 되는지"를 표시해야 합니다(`Cache-Control`, `ETag` 등). HTTP의 캐시 기능을 그대로 쓸 수 있어서, 같은 데이터를 반복해서 요청할 때 서버 부담과 응답 시간이 줄어듭니다. ([HTTP 상태 코드](/web/knowledge/03-http-상태-코드)의 304 예제 참고)

### 4. 균일한 인터페이스 (Uniform Interface)

REST를 다른 방식과 구분 짓는 가장 핵심적인 조건입니다. **모든 자원을 같은 방식으로 다룬다**는 뜻이며, 다시 4가지로 나뉩니다.

| 하위 조건 | 뜻 | 예 |
| --- | --- | --- |
| 자원 식별 (Identification of Resources) | 모든 자원은 URI로 구분됨 | `/users/1` |
| 표현을 통한 자원 조작 (Manipulation through Representations) | 자원을 직접 건드리지 않고, 표현(JSON)을 주고받아 조작함 | PATCH 본문에 `{"age": 21}` |
| 자기 서술적 메시지 (Self-descriptive Messages) | 메시지만 보고 무슨 뜻인지 알 수 있어야 함 | 메서드, 상태 코드, `Content-Type` 헤더 |
| HATEOAS | 응답에 "다음에 할 수 있는 행동"의 링크를 담음 | 아래 예시 |

HATEOAS(Hypermedia As The Engine Of Application State)는 웹 페이지에서 링크를 눌러 다음 페이지로 이동하듯, API 응답에도 다음에 할 수 있는 일의 주소를 넣어 주는 방식입니다.

```json
{
  "id": 1,
  "name": "kim",
  "links": [
    { "rel": "self",  "href": "/users/1" },
    { "rel": "posts", "href": "/users/1/posts" }
  ]
}
```

이렇게 하면 클라이언트가 주소를 코드에 하드코딩하지 않고 응답의 링크를 따라갈 수 있어, 서버가 주소를 바꿔도 클라이언트가 덜 깨집니다. 다만 실제로 HATEOAS까지 지키는 API는 많지 않습니다.

### 5. 계층화 시스템 (Layered System)

클라이언트는 자신이 실제 서버와 이야기하는지, 중간의 로드 밸런서, 캐시 서버, API 게이트웨이와 이야기하는지 몰라도 됩니다. 그래서 중간에 보안, 캐시, 부하 분산 계층을 자유롭게 끼워 넣을 수 있습니다.

### 6. 코드 온 디맨드 (Code on Demand, 선택)

서버가 실행 가능한 코드(자바스크립트 등)를 내려보내 클라이언트 기능을 늘릴 수 있다는 조건입니다. 6개 중 **유일하게 선택 사항**입니다.

> 원문에는 "자원 지향 아키텍처(ROA)"도 REST 특징으로 함께 나열되어 있는데, ROA는 REST를 따르는 설계를 부르는 다른 이름에 가깝고 필딩의 6가지 제약 조건에는 들어가지 않습니다.

## HTTP 메서드와 CRUD 매핑

데이터를 다루는 네 가지 기본 동작인 CRUD(Create, Read, Update, Delete)를 HTTP 메서드에 대응시키면 아래와 같습니다.

| CRUD | 메서드 | 컬렉션 `/users` | 단일 자원 `/users/1` | 성공 응답 |
| --- | --- | --- | --- | --- |
| Create (생성) | POST | 새 회원 만들기 | (보통 사용 안 함) | 201 Created + `Location` |
| Read (조회) | GET | 회원 목록 조회 | 1번 회원 조회 | 200 OK |
| Update (전체 수정) | PUT | (보통 사용 안 함) | 1번 회원 전체 교체 | 200 OK 또는 204 |
| Update (일부 수정) | PATCH | (보통 사용 안 함) | 1번 회원 일부 수정 | 200 OK 또는 204 |
| Delete (삭제) | DELETE | (전체 삭제는 위험해서 보통 막음) | 1번 회원 삭제 | 204 No Content |

> 원문 표에는 PATCH가 빠져 있고, 조회를 SQL처럼 "Select"라고 적었습니다. CRUD에서는 Read라고 부르며, 일부 수정은 PATCH로 표현합니다.

## URI 설계 규칙

1. **URI는 자원(명사)을 나타내고, 동작은 메서드로 표현합니다.** `/getUsers`, `/deleteUser`처럼 동사를 넣지 않습니다.
2. **컬렉션은 복수형 명사**를 씁니다. `/users`, `/users/1`
3. **계층 관계는 슬래시(`/`)로** 나타냅니다. `/users/1/posts`
4. **마지막에 슬래시를 붙이지 않습니다.** `/users/`가 아니라 `/users`
5. **소문자를 쓰고, 단어는 하이픈(`-`)으로** 연결합니다. 밑줄(`_`)은 링크 밑줄에 가려 보이지 않을 수 있습니다. `/blog-posts`
6. **파일 확장자를 넣지 않습니다.** 형식은 `Accept` 헤더로 정합니다. `/users/1.json`이 아니라 `/users/1`
7. **검색, 정렬, 페이지는 쿼리 스트링**으로 표현합니다. `/users?role=admin&sort=-created_at&page=2`
8. **자원으로 표현하기 어려운 동작**(로그인, 결제 승인 등)은 무리하게 끼워 맞추지 말고, 동작 자체를 자원처럼 이름 붙이거나(`POST /sessions`), 하위 자원으로 둡니다(`POST /orders/1/cancel`).
9. **버전**이 필요하면 `/v1/users`처럼 앞에 붙이거나 헤더로 구분합니다.

## 좋은 예와 나쁜 예

| 하고 싶은 일 | 나쁜 예 | 좋은 예 |
| --- | --- | --- |
| 회원 목록 조회 | `GET /getUserList` | `GET /users` |
| 회원 한 명 조회 | `GET /users?id=1` 또는 `GET /user/1` | `GET /users/1` |
| 회원 가입 | `POST /users/create` | `POST /users` |
| 회원 정보 수정 | `POST /updateUser?id=1` | `PATCH /users/1` |
| 회원 탈퇴 | `GET /users/1/delete` | `DELETE /users/1` |
| 1번 회원의 글 목록 | `GET /posts?userId=1` (가능은 하지만 관계가 덜 드러남) | `GET /users/1/posts` |
| 관리자만 필터링 | `GET /users/admins` | `GET /users?role=admin` |
| 대소문자, 구분자 | `GET /Blog_Posts/` | `GET /blog-posts` |
| 응답 형식 지정 | `GET /users/1.json` | `GET /users/1` + `Accept: application/json` |

특히 **GET으로 삭제하는 주소**(`GET /users/1/delete`)는 위험합니다. 검색 엔진 로봇이나 브라우저 미리 불러오기가 그 링크를 방문하기만 해도 데이터가 지워질 수 있습니다.

## 응답 설계

- 결과의 종류는 **상태 코드**로 알리고, 자세한 이유는 본문에 담습니다. 에러인데 200을 돌려주지 않습니다. 코드 고르는 요령은 [HTTP 상태 코드](/web/knowledge/03-http-상태-코드)를 참고하세요.
- 에러 본문은 API 전체에서 같은 모양으로 맞춥니다.

```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "1번 회원을 찾을 수 없습니다"
  }
}
```

- 목록 응답은 데이터가 많아질 수 있으므로 처음부터 페이지 나누기(`?page=2&size=20`)를 고려합니다.

## REST의 한계

REST는 단순하고 널리 쓰이지만 만능은 아닙니다.

| 한계 | 설명 | 대안 |
| --- | --- | --- |
| 오버페칭 (Over-fetching) | 이름만 필요한데 회원의 모든 필드가 옴 | GraphQL (필요한 필드만 골라 요청) |
| 언더페칭 (Under-fetching) | 화면 하나를 그리려고 `/users/1`, `/users/1/posts`, `/posts/3/comments`를 여러 번 요청 | GraphQL, 화면 전용 API |
| 표준 규칙의 부재 | "RESTful"의 기준이 팀마다 달라 일관성이 깨지기 쉬움 | OpenAPI(Swagger) 문서로 약속을 명시 |
| 실시간 통신 | 요청해야만 응답이 오는 구조 | 웹소켓, SSE |
| 서버 간 고성능 통신 | 텍스트 JSON은 상대적으로 무거움 | gRPC (이진 형식) |

## 코드로 감 잡기: 회원 API를 curl로 다뤄 보기

[HTTP 요청 메서드](/web/knowledge/02-http-요청-메서드)의 작은 Python 서버(`mini_api.py`)는 위 규칙대로 `/users` 컬렉션 하나를 제공합니다. 같은 주소에 메서드만 바꿔 CRUD를 모두 할 수 있다는 점, 그리고 결과에 맞는 상태 코드가 오는 점을 확인해 보세요.

### 조회 (Read)

```
$ curl -i http://127.0.0.1:8765/users
HTTP/1.0 200 OK
Server: MiniAPI/1.0 
Date: Sat, 03 Oct 2026 20:58:52 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 37

[{"id": 1, "name": "kim", "age": 20}]
```

### 생성 (Create) 성공과 실패

```
$ curl -i -X POST http://127.0.0.1:8765/users -H 'Content-Type: application/json' -d '{"name": "lee", "age": 25}'
HTTP/1.0 201 Created
Server: MiniAPI/1.0 
Date: Sat, 03 Oct 2026 20:58:52 GMT
Location: /users/2
Content-Type: application/json; charset=utf-8
Content-Length: 35

{"id": 2, "name": "lee", "age": 25}

$ curl -i -X POST http://127.0.0.1:8765/users -H 'Content-Type: application/json' -d '{"age": 30}'
HTTP/1.0 400 Bad Request
Server: MiniAPI/1.0 
Date: Sat, 03 Oct 2026 20:58:52 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 36

{"error": "name이 필요합니다"}
```

생성에 성공하면 201과 함께 새 자원의 주소(`Location: /users/2`)가 오고, 필수 값이 빠지면 400과 이유가 옵니다.

### 수정 (Update)과 삭제 (Delete)

```
$ curl -i -X PATCH http://127.0.0.1:8765/users/1 -H 'Content-Type: application/json' -d '{"age": 21}'
HTTP/1.0 200 OK
Server: MiniAPI/1.0 
Date: Sat, 03 Oct 2026 20:58:52 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 35

{"id": 1, "name": "kim", "age": 21}

$ curl -i -X DELETE http://127.0.0.1:8765/users/2
HTTP/1.0 204 No Content
Server: MiniAPI/1.0 
Date: Sat, 03 Oct 2026 20:58:52 GMT
Content-Length: 0
```

### 없는 자원

```
$ curl -i http://127.0.0.1:8765/posts
HTTP/1.0 404 Not Found
Server: MiniAPI/1.0 
Date: Sat, 03 Oct 2026 20:58:52 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 26

{"error": "없는 주소"}
```

주소에 `get`, `create`, `delete` 같은 동사가 하나도 없지만, **메서드 + 자원 주소 + 상태 코드** 만으로 무슨 일이 일어났는지 모두 알 수 있습니다. 이것이 "자기 서술적 메시지"입니다.

## 면접에서 자주 나오는 질문

**Q. REST API란 무엇인가요?**
자원을 URI로 표현하고, 그 자원에 대한 행위를 HTTP 메서드로, 결과를 상태 코드로 표현하는 설계 방식을 따르는 API입니다. 주고받는 데이터는 주로 JSON 같은 표현으로 전달합니다.

**Q. REST의 제약 조건에는 무엇이 있나요?**
클라이언트-서버, 무상태, 캐시 가능, 균일한 인터페이스, 계층화 시스템, 코드 온 디맨드(선택) 6가지입니다. 이 중 균일한 인터페이스가 REST를 가장 잘 드러내는 조건입니다.

**Q. REST가 무상태라는 것은 무슨 뜻이고 장점은 무엇인가요?**
서버가 요청 사이에 클라이언트의 세션 상태를 기억하지 않고, 각 요청이 필요한 정보를 모두 담고 온다는 뜻입니다. 어떤 서버가 요청을 받아도 처리할 수 있어서 서버를 늘리기 쉽습니다.

**Q. URI에 동사를 넣으면 안 되는 이유는 무엇인가요?**
동작은 이미 HTTP 메서드가 표현하기 때문입니다. `/deleteUser`처럼 동사를 넣으면 같은 자원에 주소가 여러 개 생겨 일관성이 깨지고, 메서드의 안전성과 멱등성 같은 HTTP의 약속을 활용하기 어렵습니다.

**Q. PUT과 PATCH 중 수정 API에 무엇을 써야 하나요?**
자원 전체를 교체하는 경우 PUT, 일부 필드만 바꾸는 경우 PATCH가 맞습니다. 회원 정보 수정처럼 일부만 바꾸는 기능은 대부분 PATCH가 자연스럽습니다.

## 정리

| 개념 | 한 줄 요약 |
| --- | --- |
| REST | HTTP의 장점을 살려 자원을 URI로, 행위를 메서드로 표현하는 설계 방식 |
| 3요소 | 자원(URI), 행위(메서드), 표현(JSON 등) |
| 6가지 제약 | 클라이언트-서버, 무상태, 캐시 가능, 균일한 인터페이스, 계층화, 코드 온 디맨드(선택) |
| 균일한 인터페이스 | 자원 식별, 표현을 통한 조작, 자기 서술적 메시지, HATEOAS |
| CRUD 매핑 | POST 생성, GET 조회, PUT 전체 수정, PATCH 일부 수정, DELETE 삭제 |
| URI 규칙 | 복수형 명사, 소문자와 하이픈, 동사와 확장자와 끝 슬래시 금지, 필터는 쿼리 스트링 |
| 응답 | 결과는 상태 코드로, 이유는 일관된 모양의 본문으로 |
