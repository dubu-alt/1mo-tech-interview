---
title: "Web Server vs. WAS"
sidebar: "Web Server and WAS"
---

**A web server is a server that returns files prepared in advance (static content) as they are, while a WAS (Web Application Server) is a server that runs a program on every request and builds a fresh result (dynamic content) to return.** Real services often split the two, placing the web server in front and the WAS behind it.

## At a Glance

- Content exchanged on the web falls into two broad types.
  - **Static content**: files that are the same no matter who requests them or when (HTML, CSS, images, JS files)
  - **Dynamic content**: results that change depending on who is asking or what values they send (your shopping cart, search results, the logged-in user's name)
- Analogy: think of a **restaurant**.
  - The web server is the **counter staff**. Things that are already prepared, like water, napkins and bottled drinks, are handed over right away without asking the kitchen.
  - The WAS is the **kitchen (the cook)**. It takes ingredients from the fridge (the DB) and cooks each order as it comes in.
  - If the cook also had to pour water, the food would come out late. So the work is divided.

## Static Pages and Dynamic Pages

```
[Static request]  /logo.png
   Browser ──▶ Web server ──▶ Sends logo.png from disk as is

[Dynamic request]  /cart?id=7
   Browser ──▶ Web server ──▶ WAS ──▶ Looks up member 7's cart in the DB
                              │
                              └──▶ Builds new HTML (or JSON) from the result and sends it
```

In the figure below, the left side is a static request and the right side is a dynamic request. The web server takes a stored file and returns it as is, while the WAS builds a different result for Alice and for Bob even when they request the same address.

![Static vs. dynamic pages: the web server returns files as they are, while servlets in the WAS build a different response for each person](/images/web/web-server-vs-was-1.png)

*Image source: [Heee's Development Blog - Differences Between Web Server and WAS, and Web Service Architecture](https://gmlwjd9405.github.io/2018/10/27/webserver-vs-was.html)*

### Static Pages

> Pages that do not change

- When the web server receives a **file path**, it returns the **contents of the matching file as they are**.
- So it always returns the same page.
- Examples: images, HTML, CSS and JavaScript files stored on the computer

### Dynamic Pages

> Pages that change depending on the values (arguments) in the request

- The server **builds the result on the spot** to match the request and returns it.
- This result is produced by a **program** running on the WAS.
- In the Java world, this program is called a **Servlet**. Developers implement methods inside the servlet such as `doGet()`, which handles GET requests, and `doPost()`, which handles POST requests. The difference between GET and POST is covered in [HTTP Request Methods](/en/web/knowledge/02-http-요청-메서드).

## Web Server

The term "web server" is used in two senses.

| Type | Meaning |
| --- | --- |
| Hardware | The computer on which a web server program is installed |
| Software | A program that receives HTTP requests from a browser (client) and serves static content (HTML, CSS, etc.) |

### What a Web Server Does

A web server handles client requests over the HTTP protocol and, depending on the request, does one of two things.

1. **Serves static content**: it returns files it holds directly, without going through the WAS.
2. **Forwards dynamic content requests**: it passes the request to the WAS, receives the processed result, and delivers it to the client. This role of forwarding requests to a server behind it on the client's behalf is called a **Reverse Proxy**.

Modern web servers often take on these jobs as well:

- **HTTPS handling (SSL/TLS termination)**: the web server handles encryption and decryption, so the WAS behind it does not have to worry about encryption.
- **Load balancing**: it spreads requests evenly across several WAS instances.
- **Compression and caching**: it compresses files with gzip and similar methods, or stores frequently requested responses and returns them immediately.

**Popular web servers**: Apache HTTP Server, Nginx, IIS (Microsoft)

## WAS (Web Application Server)

> An application server built to **serve dynamic content** for requests that need DB lookups or various kinds of logic

- It is **middleware** that runs applications over HTTP. Middleware is software that sits between the operating system and applications and handles common functions for them (communication, thread management, DB connections, etc.).
- In the Java world, the component that runs JSP and servlets is called a **web container (servlet container)**, and the WAS contains this container. That is why it is often described as **WAS = web server features + web container**.

![Structure of a WAS: the web server part that receives and passes on requests, the web container that runs JSP and servlets, and the DB connection](/images/web/web-server-vs-was-2.png)

*Image source: [Heee's Development Blog - Differences Between Web Server and WAS, and Web Service Architecture](https://gmlwjd9405.github.io/2018/10/27/webserver-vs-was.html)*

### Main Functions of a WAS

1. Provides a program execution environment and DB access
2. Manages multiple transactions (units of work that must be processed as a single bundle)
3. Runs the business logic that handles the actual work

It also provides features needed when several servers work together, such as security, thread handling and distributed transactions, and it is usually used together with a DB server.

**Popular WAS products**: Apache Tomcat, JBoss (WildFly), Jetty, WebLogic, JEUS

> Note: "WAS" is a term used mainly in the Java world. The role is the same in other languages: Gunicorn or Uvicorn running Python's Django or FastAPI, or an Express server built with Node.js, sit in the same position as a WAS because they generate dynamic content. Spring Boot even embeds Tomcat, so you do not need to install it separately.

## Why Split the Two

### Why a Web Server Is Needed

If the web server handles only static content, the load on the WAS goes down.

```
When a browser receives an HTML document, the images in it do not arrive with it.
The browser first receives the HTML document, then requests each image listed in it from the server separately.

Static files like images do not need to go all the way to the WAS.
The web server in front can return them quickly.
```

### Why a WAS Is Needed

It is **impossible to prepare every result each user wants in advance**. With 1 million members, you would have to build 1 million shopping cart pages ahead of time. A WAS uses the DB and business logic to build only the results needed, each time a request arrives, which makes efficient use of resources.

### Can't the WAS Do the Web Server's Job Too?

It can. Tomcat can also return static files. But real services usually split them.

- **Load distribution**: the WAS should focus on DB lookups and logic. If it also handles simple static file requests, its load grows, dynamic content processing slows down, and pages load slowly.
- **Connecting multiple WAS instances**: you can place several WAS instances behind one web server and distribute requests among them.
- **Handling failures**: the web server checks the health of each WAS, and if one has a problem, it stops sending requests there while that WAS is restarted. Users barely notice any errors.
- **Security**: only the web server is exposed to the outside, while the WAS and DB can be hidden in the internal network.
- **Deployment and maintenance**: when only static files change, the WAS does not need to be touched.

In short, the web server and the WAS are split for **efficient use of resources, fault tolerance, and easier deployment and maintenance**.

> A real example: this site (1mo.dev) is a static site where every page is prebuilt as HTML, so it runs on GitHub Pages, a static file server, with no WAS. The moment you need results that differ per person, such as login or comments, you need a WAS (or an external API).

## The Most Efficient Setup and the Request Flow

Placing the web server in front of the WAS and connecting the needed WAS instances to it lets requests be distributed and processed efficiently.

```
                         ┌──▶ WAS 1 ──┐
 Browser ──▶ Web server ─┤            ├──▶ DB
              (Nginx)    └──▶ WAS 2 ──┘
                 │
                 └──▶ Static files are answered right here
```

Drawn in more detail from the Java servlet point of view, the setup looks like this. When the web server passes a dynamic request to the web container, the container assigns a thread, and the servlet's `service()` calls `doGet()`/`doPost()`, which work with the DB to build the result.

![Web service structure: client, web server, the web container and threads inside the WAS, servlet methods, and the DB](/images/web/web-server-vs-was-3.png)

*Image source: [Heee's Development Blog - Differences Between Web Server and WAS, and Web Service Architecture](https://gmlwjd9405.github.io/2018/10/27/webserver-vs-was.html)*

From the Java servlet point of view, a single dynamic request is processed as follows.

1. The **web server** receives the client's request first and, if it is a dynamic request, passes it to the **WAS**.
2. The WAS looks at its configuration (`web.xml` or annotations) to find the **servlet** that handles this request. The servlet object is loaded into memory only once, on the first request, and is reused after that.
3. The WAS takes an idle thread from the **thread pool** and assigns it to this request.
4. It creates an `HttpServletRequest` object holding the request information and an `HttpServletResponse` object to hold the response, and passes them to the servlet.
5. The thread calls the servlet's `service()` method, and `service()` calls `doGet()` or `doPost()` depending on the request method.
6. `doGet()`/`doPost()` builds the dynamic page for the request and puts it in the Response object.
7. The WAS turns the Response object into an HTTP response and sends it to the web server, which delivers it to the client.
8. The used Request/Response objects are discarded, and **the thread is not terminated but returned to the thread pool** to be reused for the next request.

> Creating and destroying a thread for every request is expensive, so a **thread pool** is used: threads created in advance are borrowed and returned. For what a thread is, see [Processes and Threads](/en/cs/os/02-프로세스와-스레드).

## Getting a Feel Through Code: Static and Dynamic Responses

Using Python's built-in `http.server`, we build a tiny server and split it into a "path that returns a file as is" and a "path that builds the response on the spot." In a real service, a web server like Nginx handles the first path and a WAS handles the second.

```python
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from datetime import datetime
from pathlib import Path

STATIC_DIR = Path("static")

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        url = urlparse(self.path)

        # 1) Static content: read the file and return it as is (the web server's job)
        if url.path.startswith("/static/"):
            file = STATIC_DIR / url.path.removeprefix("/static/")
            body = file.read_bytes()
            self.reply(body, "text/html; charset=utf-8")

        # 2) Dynamic content: build the result on the spot from the request values (the WAS's job)
        elif url.path == "/hello":
            name = parse_qs(url.query).get("name", ["Guest"])[0]
            now = datetime.now().strftime("%H:00")
            body = f"<h1>Hi {name}, it is now {now}</h1>".encode()
            self.reply(body, "text/html; charset=utf-8")
        else:
            self.send_error(404)

    def reply(self, body, ctype):
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args):   # skip printing access logs
        pass

HTTPServer(("127.0.0.1", 8765), Handler).serve_forever()
```

Put `<h1>Always the same page</h1>` in a `static/index.html` file, start the server, and send requests from the terminal.

```bash
curl -s http://127.0.0.1:8765/static/index.html
curl -s http://127.0.0.1:8765/static/index.html
# Non-ASCII values cannot go into the URL as is and must be encoded, so we use --data-urlencode
curl -s -G http://127.0.0.1:8765/hello --data-urlencode "name=Alice"
curl -s -G http://127.0.0.1:8765/hello --data-urlencode "name=Bob"
```

Output:

```
<h1>Always the same page</h1>
<h1>Always the same page</h1>
<h1>Hi Alice, it is now 06:00</h1>
<h1>Hi Bob, it is now 06:00</h1>
```

The static file is identical no matter how many times you request it, while the dynamic response changes with the request value (the name) and the time it runs.

## Interview Questions

**Q. What is the difference between a web server and a WAS?**
A web server serves static content such as HTML, CSS and images as is, and forwards dynamic requests to the WAS. A WAS runs DB lookups and business logic to produce dynamic content that differs per request. Typical examples are Nginx and Apache for web servers, and Tomcat for a WAS.

**Q. A service can run on a WAS alone, so why add a separate web server?**
Handing static files to the web server reduces the load on the WAS, the web server can distribute requests across several WAS instances (load balancing), and it can route requests around a failed WAS. It can also take over HTTPS handling and improve security by keeping the WAS hidden from the outside.

**Q. What is a reverse proxy?**
A server that forwards requests to the servers behind it on the client's behalf. The client thinks it is talking only to the web server, but in fact the web server passes the request to the WAS behind it, receives the response, and delivers it.

**Q. Does a servlet container create a new thread for every request?**
No. It takes a thread from a pre-created thread pool, assigns it to the request, and returns it to the pool when processing is done. Only one servlet object is created as well, and multiple threads share it.

## Summary

| Category | Web Server | WAS |
| --- | --- | --- |
| Content handled | Static content (files as they are) | Dynamic content (newly built per request) |
| Main role | Serving files, forwarding requests (reverse proxy), HTTPS handling, load balancing | Running business logic, DB integration, transaction management |
| Analogy | Counter staff | Kitchen cook |
| Typical examples | Nginx, Apache HTTP Server, IIS | Tomcat, JBoss (WildFly), Jetty |
| Why split them | Load distribution, fault tolerance, security, easier deployment and maintenance | |
