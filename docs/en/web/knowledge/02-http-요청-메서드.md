---
title: "HTTP Request Methods (GET · POST · PUT · PATCH · DELETE)"
sidebar: "HTTP Request Methods"
---

An HTTP request method is **the verb a client (a browser or an app) uses to tell the server "what I want to do with this resource."** For the same address (`/users/1`), sending GET means "please show it to me," while sending DELETE means "please remove it."

## At a Glance

- The address (URL) says **what** (the noun), and the method says **how** (the verb).
- Analogy: you hand a slip with a book number to the desk at a library.
  - "Please show me this book" → GET
  - "I'd like to donate a new book" → POST
  - "Please replace this book with the new edition, entirely" → PUT
  - "Please change only the cover" → PATCH
  - "Please discard this book" → DELETE
  - "What kinds of things does this desk handle?" → OPTIONS
- Each method has defined rules about **whether it is safe, whether sending it many times gives the same result (idempotent), and whether it can be cached**. Browsers, servers, and proxies in between rely on these promises.

## What Does an HTTP Request Look Like?

An HTTP request is human-readable text. The method goes on the very first line.

```
PATCH /users/1 HTTP/1.1          ← request line: method, path, HTTP version
Host: api.example.com            ← headers: extra information about the request
Content-Type: application/json
Content-Length: 11
                                 ← empty line (end of headers)
{"age": 21}                      ← body: data to send to the server
```

Both requests and responses follow the order **start line, headers, empty line, body**. The request's start line holds the method, and the response's start line holds the [status code](/en/web/knowledge/03-http-상태-코드).

![Structure of HTTP request and response messages: start line, headers, empty line, body](/images/web/http-methods-message-anatomy.png)

*Image source: [MDN, HTTP messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages) (CC BY-SA 2.5)*

Requests that only receive data, like GET, usually have no body. Requests that send data, like POST/PUT/PATCH, put content such as JSON in the body.

## What Each Method Does

| Method | What it does | Body | Typical example |
| --- | --- | --- | --- |
| GET | Retrieve a resource | Usually none | View the user list `GET /users` |
| HEAD | Same as GET but receives headers only | None | Check only the file size |
| POST | Create a new resource, submit data | Yes | Sign up `POST /users` |
| PUT | Replace the entire resource (may create it if missing) | Yes | Update all user info `PUT /users/1` |
| PATCH | Modify only part of a resource | Yes | Update only the age `PATCH /users/1` |
| DELETE | Delete a resource | Usually none | Delete an account `DELETE /users/1` |
| OPTIONS | Check the methods or CORS policy the server allows | None | Browser's CORS preflight request |
| CONNECT | Open a tunnel through a proxy | None | HTTPS connection through a proxy |
| TRACE | Get back the request exactly as the server received it | None | Path diagnosis (mostly disabled for security) |

### GET

**Retrieves** a resource. Any conditions go in the query string after the address (`?page=2&sort=name`).

- It must not change data on the server. Search engine bots and the browser's prefetch feature should be able to follow GET links freely without causing problems.
- Putting a body in a GET request has no defined meaning in the HTTP standard, so servers or proxies may ignore or reject it. As a rule, conditions are sent in the query string.

### HEAD

Requests exactly like GET but receives **only the headers, without a response body**. It is used to check just the size (`Content-Length`) or modification time (`Last-Modified`) before downloading a large file.

### POST

**Creates a new resource or submits data to the server.** The data goes in the body.

- It is widely used for "please process this" requests, such as signing up, writing a post, or requesting a payment.
- When a new resource is created, the server usually returns `201 Created` and tells you the new resource's address in the `Location` header.
- Sending the same request twice can create two posts. So to prevent accidents like pressing the payment button twice, you need an extra safeguard (disabling the button, a duplicate-prevention key).

### PUT

**Replaces the entire resource with the content you send.** The original source describes it as "similar to POST but updates existing data," but more precisely it means "replace the resource at this address entirely with this content."

- Fields missing from what you send may disappear. (See PUT vs PATCH below.)
- If no resource exists at that address, it may create a new one. In that case the client decides the resource's address. (With POST, the server decides the address.)

### PATCH

**Modifies only part** of a resource. You only send the fields you want to change.

### DELETE

**Deletes** a resource.

- The original source says "it is set up to deactivate rather than actually delete," but that is not a rule of the DELETE method. It is **an implementation choice made by whoever builds the server**. Marking a row with something like `deleted_at` instead of removing it from the DB right away, so you can restore accidentally deleted data or keep records, is called **soft delete**.
- From the client's point of view, whether it is a soft delete or a real delete, it just needs to look the same: "this resource no longer exists."

### OPTIONS

Asks the server **"Which methods can I use at this address?"** The server answers with the `Allow` header. Today it is used most often for the browser's **CORS preflight request**, explained separately below.

### CONNECT and TRACE

- **CONNECT**: Asks a proxy server to "open a tunnel to the destination server." When you connect to an HTTPS site through a company proxy, the proxy cannot see the encrypted content, so it just connects the tunnel and passes the data through as is.
- **TRACE**: The server sends back the request it received, unchanged, in the body. It was meant for diagnosing how intermediate proxies change requests, but it can be abused for attacks that steal information like cookies (XST, Cross-Site Tracing), so most servers disable it.

## Safe, Idempotent, Cacheable

The most important criteria when choosing a method are the following three properties.

### Safe Methods

Methods that **do not change data on the server**. They only read. GET, HEAD, OPTIONS, and TRACE belong here.

> Being safe does not mean nothing happens on the server. Access logs may pile up or a view count may go up when you read something. It just means the client did not ask to "change the data."

### Idempotent Methods

Methods where **the final state of the server is the same whether you send the same request once or ten times**. It is like pressing the elevator's "3rd floor" button many times: it still stops at the 3rd floor once.

- GET, HEAD, OPTIONS, TRACE: they change nothing to begin with, so they are idempotent
- PUT: doing "change user 1 to this content" ten times gives the same result
- DELETE: doing "delete user 1" twice leaves the same state where user 1 does not exist (the second response code may differ as 404, but idempotency is based on **server state, not the response**)
- POST: a new post is created each time, so it is not idempotent
- PATCH: depends on what you send. A request that sets a value like `{"age": 21}` is idempotent, but a request like "increase age by 1" gives a different result each time, so the standard does not guarantee PATCH is idempotent.

Idempotency matters because of **retries**. When the network drops and you get no response, you can safely resend an idempotent request, but resending a POST could place an order twice.

### Cacheable Methods

Methods whose response can be stored and reused next time.

- GET, HEAD: cacheable (browser caches and CDNs mainly store these)
- POST, PATCH: allowed by the standard if the response clearly says "how long it stays fresh," but in practice they are almost never cached
- PUT, DELETE, etc.: not cached

### The Three Properties in One Table

| Method | Safe | Idempotent | Cacheable |
| --- | --- | --- | --- |
| GET | O | O | O |
| HEAD | O | O | O |
| OPTIONS | O | O | X |
| TRACE | O | O | X |
| PUT | X | O | X |
| DELETE | X | O | X |
| POST | X | X | Conditional (rarely done) |
| PATCH | X | X (not guaranteed) | Conditional (rarely done) |
| CONNECT | X | X | X |

The same information, with request/response body presence added and color-coded, looks like this.

![Comparison table of HTTP methods: request body, response body, safe, idempotent, cacheable](/images/web/http-methods-table.png)

*Image source: [gyoogle, HTTP Request Methods](https://gyoogle.dev/blog/web-knowledge/HTTP%20Request%20Methods.html)*

> Note: The image marks POST as cacheable "Yes," but in reality it is conditional, only possible when the response says how long it stays fresh, and it is rarely cached. Use the table above as the reference.

## PUT vs PATCH

Both mean "update," but PUT **replaces the whole thing**, and PATCH **changes only part of it**.

```
Current user 1: {"id": 1, "name": "kim", "age": 20}

PATCH /users/1  {"age": 21}
→ {"id": 1, "name": "kim", "age": 21}     only age changed

PUT /users/1    {"name": "kim"}
→ {"id": 1, "name": "kim", "age": null}   age, which was not sent, disappeared
```

| Aspect | PUT | PATCH |
| --- | --- | --- |
| Meaning | Replace the whole resource with this content | Modify only part of the resource |
| Data sent | The whole resource | Only the fields to change |
| Omitted fields | Disappear or become defaults | Stay as they are |
| When the resource is missing | May create it | Usually 404 |
| Idempotency | Guaranteed | Not guaranteed |

In practice, features that change only some fields, like an "edit profile" screen, fit PATCH more naturally. If you build it with PUT, the client must always send the full data.

## GET vs POST

| Aspect | GET | POST |
| --- | --- | --- |
| Purpose | Retrieve | Create, submit |
| Where data goes | URL query string | Request body |
| Length limit | URL length is limited (differs by browser and server) | Practically none (depends on server settings) |
| Browser history, bookmarks | Data stays in the address | Not kept |
| Cache | Yes | Usually no |
| Safe, idempotent | Both O | Both X |
| Refresh | Simply requests again | "Resubmit the form?" warning |

A common misconception is **"POST is more secure than GET."** POST is better in that the data does not remain in the address bar, browsing history, or server access logs, but without HTTPS the body is visible as plain text too. Sensitive data like passwords must be sent with **POST + HTTPS**; changing the method alone does not encrypt anything.

## OPTIONS and the CORS Preflight

### What Is CORS?

For security, browsers by default restrict JavaScript from sending requests to a server of a **different origin**. An origin is `protocol + domain + port` combined, and if any one of the three differs, it is a different origin.

- `https://1mo.dev` and `https://api.1mo.dev` → different domains, so different origins
- `http://localhost:5173` and `http://localhost:8000` → different ports, so different origins

**CORS (Cross-Origin Resource Sharing)** is the rule where the server tells the browser through response headers that "requests from this origin are allowed," so the browser permits the cross-origin request.

### When a Preflight Happens

For requests that could change server data, the browser **first asks with OPTIONS before sending the real request**. This is called a **preflight** request. A preflight occurs if any of the following conditions apply.

- The method is not GET, HEAD, or POST (PUT, PATCH, DELETE, etc.)
- The `Content-Type` is not `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain` (e.g. `application/json`)
- A custom header such as `Authorization` is included

### Flow

```
Browser (https://1mo.dev)                        API server
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
   │ 3) Allowed, so the real request: PATCH /users/1│
   │ ───────────────────────────────────────────▶ │
```

MDN's example follows the same flow. The top part is the preflight that asks first with OPTIONS, and the bottom part is the real request sent after permission is granted.

![CORS preflight flow: an OPTIONS preflight and 204 response, followed by the real POST request and 200 response](/images/web/http-methods-cors-preflight.png)

*Image source: [MDN, Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) (CC BY-SA 2.5)*

- If the server does not return the allow headers, the browser does not send request 3 and shows a CORS error in the console.
- CORS is **a rule enforced by the browser**. So it does not apply to curl or server-to-server requests. Most cases of "It works in Postman but not in the browser" are this.
- With the `Access-Control-Max-Age` header, the server can make the browser remember the preflight result for a while, reducing the cost of sending OPTIONS every time.

## Getting a Feel with Code: Sending Each Method to a Small Server

Using only Python's built-in modules, let's build a small API server that stores a user list in memory, and send methods one by one with `curl`.

```python
# mini_api.py : a tiny REST API server that stores a user list in memory
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
            return self.send_json(404, {"error": "no such path"})
        if uid is None:
            return self.send_json(200, list(users.values()))
        if uid not in users:
            return self.send_json(404, {"error": "no such user"})
        self.send_json(200, users[uid])

    do_HEAD = do_GET

    def do_POST(self):
        global next_id
        body = self.read_body()
        if "name" not in body:
            return self.send_json(400, {"error": "name is required"})
        user = {"id": next_id, "name": body["name"], "age": body.get("age")}
        users[next_id] = user
        next_id += 1
        self.send_json(201, user, {"Location": f"/users/{user['id']}"})

    def do_PUT(self):
        uid = self.user_id()
        body = self.read_body()
        # PUT replaces the whole resource with the values sent (missing fields disappear)
        users[uid] = {"id": uid, "name": body.get("name"), "age": body.get("age")}
        self.send_json(200, users[uid])

    def do_PATCH(self):
        uid = self.user_id()
        if uid not in users:
            return self.send_json(404, {"error": "no such user"})
        # PATCH changes only the fields sent
        users[uid].update(self.read_body())
        self.send_json(200, users[uid])

    def do_DELETE(self):
        uid = self.user_id()
        if uid not in users:
            return self.send_json(404, {"error": "no such user"})
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

Start the server with `python3 mini_api.py` and send requests from another terminal. `curl -i` is the option that also shows the response headers.

### GET and HEAD

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

HEAD (`curl -I`) tells you the body size with `Content-Length: 35`, but the body itself does not come. (The first response line being `HTTP/1.0` is because Python's built-in server responds with HTTP/1.0; it has nothing to do with how the methods behave.)

### Creating with POST

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

The server decided the new user's number (2) and tells you the new resource's address in the `Location` header.

### The Difference Between PATCH and PUT

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

PATCH changed only `age`, and `name` stayed the same. With PUT, sending only `name` made `age` become `null`, because the whole resource was replaced.

### Sending DELETE Twice

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

{"error": "no such user"}
```

The response codes differ (204 and 404), but the server state is the same both times: "user 2 does not exist." That is why DELETE is idempotent.

### OPTIONS (Imitating a Preflight)

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

We sent the same headers a browser's preflight would send. Since the server answered that it allows `https://1mo.dev` and `PATCH`, a browser would go on to send the real PATCH request.

### Checking Idempotency Yourself: POST Twice vs PUT Twice

After restarting the server (1 user), send the same request twice each.

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

print("[POST twice]")
for _ in range(2):
    print(call("POST", "/users", {"name": "park", "age": 30}))
print("User count:", len(call("GET", "/users")[1]))

print("[PUT twice]")
for _ in range(2):
    print(call("PUT", "/users/1", {"name": "kim", "age": 22}))
print("User count:", len(call("GET", "/users")[1]))
```

```
[POST twice]
(201, {'id': 2, 'name': 'park', 'age': 30})
(201, {'id': 3, 'name': 'park', 'age': 30})
User count: 3
[PUT twice]
(200, {'id': 1, 'name': 'kim', 'age': 22})
(200, {'id': 1, 'name': 'kim', 'age': 22})
User count: 3
```

POST added one user each time it was sent (2 and 3), but with PUT, user 1's state is exactly the same even after sending it twice.

## Interview Questions

**Q. What is the difference between GET and POST?**
GET is for retrieval, so it puts data in the URL query string, and it is safe, idempotent, and cacheable. POST is for creating or submitting, so it puts data in the body, is not idempotent, and is usually not cached. Security must come from HTTPS, not from the method.

**Q. How do PUT and PATCH differ?**
PUT replaces the whole resource with the content sent, and PATCH modifies only the fields sent. PUT is guaranteed to be idempotent, but PATCH is not, because it depends on the request content.

**Q. What is idempotency and why does it matter?**
It is the property where sending the same request many times leaves the server in the same state as sending it once. It matters because it determines whether you can safely retry when a network error means you got no response. GET, PUT, and DELETE are idempotent; POST is not.

**Q. If you send DELETE twice, the second one returns 404. Is it still idempotent?**
Yes. Idempotency is judged by the server's state, not the response code. Both times it ends in the "that resource does not exist" state, so it is idempotent.

**Q. Why does the browser send an OPTIONS request I never sent?**
When you send a request with PUT, DELETE, a JSON body, or an auth header to a server of a different origin, the browser first asks the server whether it is allowed. This is the CORS preflight. The real request is sent only if the server answers with the allow headers.

## Summary

| Concept | One-line summary |
| --- | --- |
| Request method | A marker that says what to do (verb) with the URL (what) |
| GET / HEAD | Retrieve / retrieve headers only. Safe, idempotent, cacheable |
| POST | Create, submit. Not idempotent, so watch out for duplicate requests |
| PUT / PATCH | Full replacement (idempotent) / partial update (idempotency not guaranteed) |
| DELETE | Delete. Idempotent. Soft delete is a server implementation choice |
| OPTIONS | Check allowed methods, used for the CORS preflight |
| CONNECT / TRACE | Proxy tunnel / echo back the request (mostly disabled for security) |
| Safe | Does not change server data |
| Idempotent | Server state is the same even when sent many times (whether retry is possible) |

- Which response codes go with each method continues in [HTTP Status Codes](/en/web/knowledge/03-http-상태-코드), and how to design an API by combining methods and URLs continues in [REST API](/en/web/knowledge/04-rest-api).
