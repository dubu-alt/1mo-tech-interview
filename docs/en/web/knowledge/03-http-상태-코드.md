---
title: "HTTP Status Codes"
sidebar: "HTTP Status Codes"
---

An HTTP status code is **a three-digit result report in which the server tells you how it handled the request**. The first digit alone tells you whether it "succeeded, wants you to go somewhere else, is your fault, or is the server's fault."

## At a Glance

- When you send a request, the status code comes attached to the very first line of the response. Programs look at this number first, before reading the body, and decide what to do next.
- Analogy: it is like a parcel tracking result.
  - 2xx: "Delivered"
  - 3xx: "The address changed; please send it again to the new address"
  - 4xx: "The sender wrote the wrong address" (a problem on the requesting side)
  - 5xx: "Something went wrong at the logistics center" (a problem on the server side)
- If you pick status codes accurately when building an API, the client can decide "whether to retry, send the user to the login screen, or ask the user to fix their input" without parsing error messages one by one.

## The First Line of a Response

```
HTTP/1.1 404 Not Found      ← status line: HTTP version, status code, reason phrase
Content-Type: application/json
Content-Length: 26

{"error": "no such user"}
```

As in the image below, the status line is split into three pieces: **protocol version, status code, and reason phrase (status message)**.

![The status line of an HTTP response: protocol version HTTP/1.1, status code 200, status message OK, with headers below](/images/web/http-status-response-line.png)

*Image source: [MDN, Overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) (CC BY-SA 2.5)*

- **Status code (404)**: the number programs use to make decisions
- **Reason phrase (Not Found)**: an explanation for humans to read. From HTTP/2 on it is not sent at all, so programs must decide based only on the number.

## The Five Classes

| Class | Meaning | Whose side is it on | Typical codes |
| --- | --- | --- | --- |
| 1xx Informational | Request received, processing continues | In progress | 100, 101 |
| 2xx Success | The request was handled successfully | Success | 200, 201, 204 |
| 3xx Redirection | You need to go elsewhere to get what you want | Further action needed | 301, 302, 304 |
| 4xx Client error | Something is wrong with the request itself | Requesting side | 400, 401, 403, 404 |
| 5xx Server error | The request is fine but the server could not handle it | Server side | 500, 502, 503 |

> The original source wrote the classes as `10x, 20x`, but `10x` only refers to 100 to 109, so it is inaccurate. Since the class means all of 200 to 299, writing `2xx` is correct.

Even if you receive a code you do not know, you can **judge the class by the first digit**. For example, if you get an unfamiliar `418`, treat it as "a kind of client error."

## Commonly Used Status Codes

### 1xx Informational

| Code | Name | Meaning |
| --- | --- | --- |
| 100 | Continue | "Keep sending" in reply to "May I send?" before sending a large body |
| 101 | Switching Protocols | Switches protocols. Used when opening a WebSocket connection |

### 2xx Success

| Code | Name | Meaning and usage |
| --- | --- | --- |
| 200 | OK | Request succeeded. Used not only for retrieval (GET) but also when returning the result of an update in the body |
| 201 | Created | A new resource was created. Usually a response to POST (or a PUT that creates), with the new address in the `Location` header |
| 202 | Accepted | The request was accepted but processing is not finished yet. For long-running jobs like video conversion |
| 204 | No Content | Succeeded but there is no body to return. Often used for successful deletes and saves |

### 3xx Redirection

| Code | Name | Meaning and usage |
| --- | --- | --- |
| 300 | Multiple Choices | There are several resources to choose from. Rarely used in practice |
| 301 | Moved Permanently | The address changed **permanently**. The new address is in the `Location` header |
| 302 | Found | The address changed **temporarily**. E.g. sending the user back to the original page after login |
| 303 | See Other | Retrieve another address with GET. Used to send the user to a result page after a form submission |
| 304 | Not Modified | The cached content is still up to date, so keep using it. No body |
| 307 | Temporary Redirect | Same as 302 but explicitly requires **keeping the method and body as they are** |
| 308 | Permanent Redirect | Same as 301 but keeps the method and body as they are |

### 4xx Client Errors

| Code | Name | Meaning and usage |
| --- | --- | --- |
| 400 | Bad Request | The request format is wrong. JSON syntax errors, missing required values, etc. |
| 401 | Unauthorized | **Not authenticated**. Not logged in, or the token has expired |
| 403 | Forbidden | The server knows who you are but you **have no permission**. A regular user accessing an admin page |
| 404 | Not Found | The requested resource does not exist |
| 405 | Method Not Allowed | A method that address does not allow. The response lists the allowed ones in the `Allow` header |
| 406 | Not Acceptable | The server cannot provide the format (e.g. XML) the client asked for in the `Accept` header |
| 408 | Request Timeout | The client sent the request too slowly, so the server gave up waiting and closed the connection |
| 409 | Conflict | Conflicts with the current state of the resource. Signing up with an ID that already exists, two people editing the same post at once |
| 422 | Unprocessable Content | The format is right but the content breaks the rules. Entering a negative age, etc. (many places just use 400 for everything) |
| 429 | Too Many Requests | Sent too many requests within a set time. The `Retry-After` header tells you when to try again |

### 5xx Server Errors

| Code | Name | Meaning and usage |
| --- | --- | --- |
| 500 | Internal Server Error | An unexpected error in the server code (missing exception handling, etc.) |
| 502 | Bad Gateway | An intermediate server (a proxy like Nginx, a gateway) received an **invalid response** from the server behind it. Common when the backend server is down |
| 503 | Service Unavailable | The server cannot accept requests right now. Under maintenance or overloaded. Sometimes sent with `Retry-After` |
| 504 | Gateway Timeout | The intermediate server **timed out waiting** for a response from the server behind it |

## Comparing Confusing Pairs

### 401 vs 403

| Aspect | 401 Unauthorized | 403 Forbidden |
| --- | --- | --- |
| What the server thinks | "I don't know who you are" | "I know who you are, but you can't do this" |
| Problem | Authentication failure | Authorization failure |
| Examples | Not logged in, expired token, invalid token | A regular user calling an admin feature, deleting someone else's post |
| Client response | Send to the login screen or reissue the token | Logging in again won't help. Show "You don't have permission" |
| Accompanying header | `WWW-Authenticate` (which method to authenticate with) | None |

The name Unauthorized is confusing, but the actual meaning is **Unauthenticated**. It is famous for being misnamed when the standard was created. The difference between authentication and authorization is covered in detail in [Authentication Methods](/en/web/knowledge/06-인증-방식).

> Hiding things on purpose with 404: when you want to **hide the very fact that a private resource exists**, you may return 404 instead of 403. When someone without permission accesses a private repository's address, GitHub shows 404, not 403.

### 301 vs 302 (and 307, 308)

| Aspect | 301 Moved Permanently | 302 Found |
| --- | --- | --- |
| Meaning | Permanent move | Temporary move |
| Browser | Remembers the new address for a long time and goes straight there next time | Asks the original address every time |
| Search engines | Move the search result address and reputation to the new address | Keep the original address in search results |
| Usage | `http` to `https`, an old domain to a new domain | Sending a logged-out user to the login page, a maintenance notice page |

A redirect means the request goes back and forth twice. When the server sends a 3xx status code and the new address in the `Location` header, the browser requests that address again.

![301 redirect flow: a GET /doc request gets 301 with Location: /doc_new, then the client requests the new address and gets 200](/images/web/http-status-301-redirect.png)

*Image source: [MDN, Redirections in HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Redirections) (CC BY-SA 2.5)*

- Because browsers remember a 301 for a long time, if you set it up wrong, it lingers in users' browsers for a while even after you fix it on the server. If you are not sure, it is safer to test with 302 first and then switch to 301.
- With 301 and 302, older browsers had a problem of turning a POST request into a GET when following the redirect. So **when the method must be kept**, use 307 (temporary) or 308 (permanent).

### 502 vs 504

Both involve an "intermediate server (gateway)." Usually a web server like Nginx receives the user's request first, and the application server (WAS) behind it does the actual processing. (See [Web Server and WAS](/en/web/knowledge/10-웹-서버와-was).)

```
Browser ──▶ Nginx (gateway) ──▶ Application server
                │
                ├─ Backend server is off or gives a strange response → 502 Bad Gateway
                └─ Backend server takes too long to respond          → 504 Gateway Timeout
```

## A Real Case: GitHub API's 403

This site's [State Management & GitHub API Integration](/en/web/features/07-상태-관리와-github-api-연동) article shows a different message when the GitHub API responds with 403. Calling the GitHub API without logging in has a per-hour request limit, and when you exceed it, GitHub returns **403 or 429** along with the `x-ratelimit-remaining: 0` header.

- Strictly by the standard, exceeding a limit should be 429, but real services sometimes use other codes for their own reasons.
- So rather than looking only at the status code number, you need to check **the API documentation and response headers** (`x-ratelimit-remaining`, `Retry-After`) together to tell a "no-permission 403" from a "too-many-requests 403."

## Getting a Feel with Code: Receiving Status Codes by Situation

Let's build a practice server with Python's built-in modules that returns a different status code for each situation.

```python
# status_api.py : a practice server that returns status codes by situation
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
            # the address changed permanently
            return self.reply(301, headers={"Location": "/new-page"})
        if self.path == "/new-page":
            return self.reply(200, "new page\n")
        if self.path == "/profile":
            if token is None:
                # unknown user: login (authentication) required
                return self.reply(401, "login required\n", {"WWW-Authenticate": "Bearer"})
            return self.reply(200, "my profile\n")
        if self.path == "/admin":
            if token is None:
                return self.reply(401, "login required\n", {"WWW-Authenticate": "Bearer"})
            if token != "Bearer admin-token":
                # we know who it is, but they have no permission
                return self.reply(403, "admin only\n")
            return self.reply(200, "admin page\n")
        if self.path == "/logo":
            # if unchanged, 304 with no body
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
                1 / 0  # a mistake in the server code
            except ZeroDivisionError:
                return self.reply(500, "internal server error\n")
        self.reply(404, "not found\n")

    def log_message(self, *args):
        pass


HTTPServer(("127.0.0.1", 8766), Handler).serve_forever()
```

### 301 Redirect

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

With the `-L` option, curl follows `Location` like a browser, so two responses (301, 200) are printed.

### 401 and 403

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

A request without a token gets 401 together with a `WWW-Authenticate` header saying "authenticate with the Bearer scheme." With a regular user's token, the server now knows who you are, but you are not an admin, so you get 403.

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

If you remember the `ETag` (a version marker for the content) from the first response and ask with `If-None-Match`, "I have v1; has it changed?", it has not changed, so only a 304 comes back with no body. Browser caches work like this so they do not download the same image again every time.

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

From the third request on, you get 429. In a real service, the client should read `Retry-After: 60` and try again after 60 seconds.

### Check Names Against the Standard List

Python includes the standard status code names, so you can check right away when you mix up a name.

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

## Tips for Choosing Status Codes When Building an API

1. Did it succeed? → 201 if something was created, 204 if there is nothing to return, otherwise 200
2. Is the request format wrong? → 400 (422 if you want to separate rule violations)
3. Don't know who it is? → 401
4. Know who it is but they lack permission? → 403 (404 to hide that it exists at all)
5. Does the target not exist? → 404
6. Does it already exist or clash with the current state? → 409
7. Too many requests? → 429
8. Did the server code throw an unexpected error? → 500

A common mistake is **returning 200 for an error and writing `"success": false` only in the body**. Then browsers, monitoring tools, and retry logic all mistake it for success. It is better to signal the overall result with the status code and put the detailed reason in the body.

```json
{
  "error": {
    "code": "DUPLICATE_EMAIL",
    "message": "This email is already registered"
  }
}
```

## Interview Questions

**Q. What is the difference between 401 and 403?**
401 is an authentication failure: the server does not know who sent the request. Logging in or getting a new token fixes it. 403 is an authorization failure: the server knows who you are, but you have no permission for that action, so logging in again does not fix it.

**Q. How do 301 and 302 differ?**
301 is a permanent move, so browsers and search engines remember the new address. 302 is a temporary move, so the original address keeps being used. If the method must be preserved, use 308 (permanent) or 307 (temporary).

**Q. When does 304 Not Modified come back?**
When the client sends the version information it cached (an ETag in `If-None-Match` or a date in `If-Modified-Since`) and the content on the server has not changed. The response has no body, which saves network traffic.

**Q. What is the difference between 502 and 504?**
Both are problems with the server behind a proxy or gateway. 502 is when an invalid response came from the backend server or it could not be reached, and 504 is when waiting for the backend server's response timed out.

**Q. Can't you just return 200 on an error and write the failure in the body?**
It is not recommended. Client libraries, caches, monitoring, and retry logic work based on the status code, so they mistake the failure for success. Signal the kind of result with the status code and put the detailed reason in the body.

## Summary

| Class | One-line summary | Codes to remember |
| --- | --- | --- |
| 1xx | In progress | 101 (switch to WebSocket) |
| 2xx | Success | 200 OK, 201 Created, 204 No Content |
| 3xx | Go elsewhere or use the cache | 301 permanent move, 302 temporary move, 304 use the cache as is |
| 4xx | A problem on the requesting side | 400 bad format, 401 authentication required, 403 no permission, 404 not found, 409 conflict, 429 too many |
| 5xx | A problem on the server side | 500 internal error, 502 bad gateway response, 503 unavailable, 504 gateway timeout |

- Which method to use for a request continues in [HTTP Request Methods](/en/web/knowledge/02-http-요청-메서드), and how to design an API by combining methods and status codes continues in [REST API](/en/web/knowledge/04-rest-api).
