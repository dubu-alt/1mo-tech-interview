---
title: "REST API"
---

REST is **a design approach that keeps the strengths the web (HTTP) already has: treat everything as a "resource (noun)," name it with an address (URI), and handle it with HTTP methods (verbs)**. A REST API is an API built following this approach.

## At a Glance

- REST stands for Representational State Transfer. Roy Fielding, one of the people who created the HTTP standard, laid it out in his doctoral dissertation in 2000.
- Analogy: a well-organized library.
  - Each book is a **resource**.
  - The call number attached to each book is the **URI**. (`/books/42`)
  - Requests like "please lend it to me, I'm returning it, please discard it" are **HTTP methods**.
  - The book information card (title, author) handed over instead of the book itself is the **representation**. Even for the same book, the card can take several forms, like a Korean edition (JSON) or an English edition (XML).
- Just as you can use any library right away on your first visit if the call numbers and lending rules are similar, following REST rules lets you **guess what an unfamiliar API does just by looking at the address and method**.

## The Three Elements of REST

```
DELETE  /users/1        ← action (Method) + resource (URI)
Accept: application/json

{"id": 1, "name": "kim"} ← representation
```

### Resource

Everything the server manages (users, posts, comments, orders) is treated as a resource and **named with a URI**.

- Collection (list): `/users`
- One item in a collection: `/users/1`
- Sub-resource: `/users/1/posts` (the list of posts written by user 1)

### Action (Method)

What to do with a resource is expressed by the **HTTP method**, not the URI. The properties of each method are covered in detail in [HTTP Request Methods](/en/web/knowledge/02-http-요청-메서드).

### Representation

The client and server exchange not the resource itself but a **representation of the resource's current state**. XML used to be common, but today most APIs use JSON. The client states the format it wants with the `Accept` header, and the server tells you the format it actually sent with the `Content-Type` header.

```
POST /users
Content-Type: application/json

{"name": "terry"}
```

> The original example wrapped it one more level, like `{"users": {"name": "terry"}}`, but if you are creating a single user, sending only that user's fields as above is more common.

## The 6 Constraints of REST

REST, as defined by Fielding, is an architecture that follows the 6 conditions below. An API that follows these conditions well is called "RESTful."

### 1. Client-Server

Separate the side responsible for the screen (the client) from the side responsible for data and logic (the server). As long as both keep the agreed API, any client, such as a website, an app, or another server, can use the same server, and each side can be developed and deployed separately.

### 2. Stateless

The server **does not remember the client's state between requests**. Each request must contain all the information needed to process it (such as a token that says who sent it).

- Pro: since any server can handle a request the same way, it is easy to add more servers (horizontal scaling).
- Con: you have to send things like authentication info over and over with every request.
- Example: instead of storing login state in a server session, each request carries a token such as a [JWT](/en/web/knowledge/07-jwt) in the `Authorization` header. (Compare with [Cookies and Sessions](/en/web/knowledge/05-쿠키와-세션).)

> The original source has a sentence saying "if a REST API fails during execution, the existing state needs to be saved for transaction recovery," but that explanation has nothing to do with the stateless constraint. Stateless means **the server does not remember the client's conversation context (session)**; it does not mean the server stores no data in a DB. The state of resources such as user info or orders is of course stored in the server's DB.

### 3. Cacheable

Responses must indicate "whether this response can be stored and reused" (`Cache-Control`, `ETag`, etc.). Because HTTP's caching features can be used as they are, server load and response time drop when the same data is requested repeatedly. (See the 304 example in [HTTP Status Codes](/en/web/knowledge/03-http-상태-코드).)

### 4. Uniform Interface

This is the most essential condition that sets REST apart from other approaches. It means **all resources are handled the same way**, and it breaks down into 4 parts.

| Sub-condition | Meaning | Example |
| --- | --- | --- |
| Identification of Resources | Every resource is identified by a URI | `/users/1` |
| Manipulation through Representations | Resources are not touched directly but manipulated by exchanging representations (JSON) | `{"age": 21}` in a PATCH body |
| Self-descriptive Messages | You should be able to understand a message just by looking at it | Method, status code, `Content-Type` header |
| HATEOAS | The response includes links for "what you can do next" | Example below |

HATEOAS (Hypermedia As The Engine Of Application State) is the idea that, just as you click a link on a web page to go to the next page, the API response includes the addresses of what you can do next.

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

This way the client can follow the links in the response instead of hardcoding addresses, so the client breaks less when the server changes addresses. That said, not many real APIs go as far as HATEOAS.

### 5. Layered System

The client does not need to know whether it is talking to the actual server or to a load balancer, cache server, or API gateway in between. So you can freely insert security, caching, and load-balancing layers in the middle.

As in the image below, a request passes through several proxies to reach the server, and the response returns along the same path. The client only needs to talk to the one hop right in front of it.

![Layered system: a client's request passes through two proxies to the server, and the response returns along the same path](/images/web/rest-api-layered-system.png)

*Image source: [MDN, Overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) (CC BY-SA 2.5)*

### 6. Code on Demand (Optional)

The condition that the server can send executable code (JavaScript, etc.) to extend the client's functionality. It is **the only optional one** of the six.

> The original source also lists "Resource Oriented Architecture (ROA)" as a REST characteristic, but ROA is closer to another name for designs that follow REST, and it is not one of Fielding's 6 constraints.

## Mapping HTTP Methods to CRUD

Mapping CRUD (Create, Read, Update, Delete), the four basic operations on data, to HTTP methods gives the following.

| CRUD | Method | Collection `/users` | Single resource `/users/1` | Success response |
| --- | --- | --- | --- | --- |
| Create | POST | Create a new user | (usually not used) | 201 Created + `Location` |
| Read | GET | Get the user list | Get user 1 | 200 OK |
| Update (full) | PUT | (usually not used) | Replace user 1 entirely | 200 OK or 204 |
| Update (partial) | PATCH | (usually not used) | Partially update user 1 | 200 OK or 204 |
| Delete | DELETE | (deleting everything is dangerous, so usually blocked) | Delete user 1 | 204 No Content |

> The original table left out PATCH and called retrieval "Select," as in SQL. In CRUD it is called Read, and partial updates are expressed with PATCH.

## URI Design Rules

1. **A URI represents a resource (noun), and the action is expressed by the method.** Do not put verbs in it, like `/getUsers` or `/deleteUser`.
2. **Use plural nouns for collections.** `/users`, `/users/1`
3. **Show hierarchy with slashes (`/`).** `/users/1/posts`
4. **Do not add a trailing slash.** `/users`, not `/users/`
5. **Use lowercase, and join words with hyphens (`-`).** Underscores (`_`) can be hidden by link underlines. `/blog-posts`
6. **Do not include file extensions.** The format is set by the `Accept` header. `/users/1`, not `/users/1.json`
7. **Express search, sorting, and paging with the query string.** `/users?role=admin&sort=-created_at&page=2`
8. **For actions that are hard to express as resources** (login, payment approval, etc.), don't force them in; name the action itself like a resource (`POST /sessions`) or put it under a sub-resource (`POST /orders/1/cancel`).
9. If you need **versions**, prefix them like `/v1/users` or distinguish them with a header.

## Good and Bad Examples

| What you want to do | Bad example | Good example |
| --- | --- | --- |
| Get the user list | `GET /getUserList` | `GET /users` |
| Get one user | `GET /users?id=1` or `GET /user/1` | `GET /users/1` |
| Sign up | `POST /users/create` | `POST /users` |
| Update user info | `POST /updateUser?id=1` | `PATCH /users/1` |
| Delete an account | `GET /users/1/delete` | `DELETE /users/1` |
| User 1's post list | `GET /posts?userId=1` (possible, but the relationship is less visible) | `GET /users/1/posts` |
| Filter admins only | `GET /users/admins` | `GET /users?role=admin` |
| Case, separators | `GET /Blog_Posts/` | `GET /blog-posts` |
| Specify response format | `GET /users/1.json` | `GET /users/1` + `Accept: application/json` |

**Addresses that delete with GET** (`GET /users/1/delete`) are especially dangerous. Data could be deleted just because a search engine bot or the browser's prefetch visited that link.

## Response Design

- Signal the kind of result with the **status code**, and put the detailed reason in the body. Do not return 200 for an error. For tips on choosing codes, see [HTTP Status Codes](/en/web/knowledge/03-http-상태-코드).
- Keep error bodies in the same shape across the whole API.

```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User 1 could not be found"
  }
}
```

- List responses can grow large, so plan for pagination (`?page=2&size=20`) from the start.

## Limitations of REST

REST is simple and widely used, but it is not a silver bullet.

| Limitation | Description | Alternative |
| --- | --- | --- |
| Over-fetching | You only need the name, but every field of the user comes back | GraphQL (request only the fields you need) |
| Under-fetching | To draw one screen, you request `/users/1`, `/users/1/posts`, `/posts/3/comments` several times | GraphQL, screen-specific APIs |
| No standard rules | The bar for "RESTful" differs by team, so consistency breaks easily | Spell out the agreement with OpenAPI (Swagger) docs |
| Real-time communication | Responses come only when you request | WebSocket, SSE |
| High-performance server-to-server communication | Text JSON is relatively heavy | gRPC (binary format) |

## Getting a Feel with Code: Handling the User API with curl

The small Python server (`mini_api.py`) from [HTTP Request Methods](/en/web/knowledge/02-http-요청-메서드) provides a single `/users` collection that follows the rules above. Notice that you can do all of CRUD on the same address just by changing the method, and that a status code matching the result comes back.

### Read

```
$ curl -i http://127.0.0.1:8765/users
HTTP/1.0 200 OK
Server: MiniAPI/1.0 
Date: Sat, 03 Oct 2026 20:58:52 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 37

[{"id": 1, "name": "kim", "age": 20}]
```

### Create: Success and Failure

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

{"error": "name is required"}
```

When creation succeeds, you get 201 along with the new resource's address (`Location: /users/2`), and when a required value is missing, you get 400 with the reason.

### Update and Delete

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

### A Resource That Does Not Exist

```
$ curl -i http://127.0.0.1:8765/posts
HTTP/1.0 404 Not Found
Server: MiniAPI/1.0 
Date: Sat, 03 Oct 2026 20:58:52 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 26

{"error": "no such path"}
```

There is not a single verb like `get`, `create`, or `delete` in the addresses, yet **the method + resource address + status code** alone tell you everything that happened. This is what "self-descriptive messages" means.

## Interview Questions

**Q. What is a REST API?**
An API that follows a design approach where resources are expressed with URIs, actions on those resources with HTTP methods, and results with status codes. The data exchanged is mostly delivered as representations such as JSON.

**Q. What are the constraints of REST?**
There are 6: client-server, stateless, cacheable, uniform interface, layered system, and code on demand (optional). Of these, the uniform interface is the one that best characterizes REST.

**Q. What does it mean that REST is stateless, and what is the advantage?**
It means the server does not remember the client's session state between requests, and each request brings all the information it needs. Any server can handle the request, so it is easy to add more servers.

**Q. Why shouldn't you put verbs in a URI?**
Because the HTTP method already expresses the action. Putting verbs in, like `/deleteUser`, creates multiple addresses for the same resource and breaks consistency, and it makes it hard to use HTTP's promises such as the safety and idempotency of methods.

**Q. Should an update API use PUT or PATCH?**
PUT is right when replacing the whole resource, and PATCH when changing only some fields. For features that change only part of the data, like editing user info, PATCH is usually the natural choice.

## Summary

| Concept | One-line summary |
| --- | --- |
| REST | A design approach that uses HTTP's strengths to express resources as URIs and actions as methods |
| 3 elements | Resource (URI), action (method), representation (JSON, etc.) |
| 6 constraints | Client-server, stateless, cacheable, uniform interface, layered, code on demand (optional) |
| Uniform interface | Resource identification, manipulation through representations, self-descriptive messages, HATEOAS |
| CRUD mapping | POST create, GET read, PUT full update, PATCH partial update, DELETE delete |
| URI rules | Plural nouns, lowercase and hyphens, no verbs, extensions, or trailing slashes, filters in the query string |
| Responses | Result via status code, reason via a consistently shaped body |
