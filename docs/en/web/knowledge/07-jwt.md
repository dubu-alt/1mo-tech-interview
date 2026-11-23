---
title: "JWT (JSON Web Token)"
sidebar: "JWT"
---

**JWT is a token format that holds data such as user info (claims) as JSON, attaches a signature that lets you check for forgery, and turns it all into a single-line string.** It is defined as a web standard (RFC 7519), and its key point is that the server can decide "whether the token can be trusted" just by checking the signature, without searching a store.

## At a Glance

- With the [session approach](/en/web/knowledge/05-쿠키와-세션), the server holds a ledger (the session store) and looks it up on every request. JWT **writes the needed information directly into the token, stamps it with the server's seal (signature)**, and sends it off with the client.
- Analogy: a JWT is like **a transparent envelope with a tamper-evident seal sticker**.
  - The envelope is transparent, so **anyone can read** what is inside (who it is, how long it is valid).
  - But if you open the envelope to change the contents, the seal sticker tears, so **the change is obvious right away**.
  - The seal sticker can only be made with the stamp (secret key) that only the server has.
- So JWT is not a technology that "hides the contents" but one that **"guarantees the contents have not been changed."** This is the most important point in understanding JWT.

## What a JWT Looks Like

A JWT consists of three parts separated by dots (`.`).

```
xxxxx.yyyyy.zzzzz
header.payload.signature
```

| Part | Name | What it contains |
| --- | --- | --- |
| First | Header | Token type, signing algorithm |
| Second | Payload | Claims (user ID, expiration time, etc.) |
| Third | Signature | A value proving the header and payload have not been changed |

Each part is encoded with a scheme called **Base64URL**. Base64URL is regular Base64 with `+` and `/`, which cause problems in URLs, replaced by `-` and `_`, and with the trailing `=` removed, so the token can be put in a URL or HTTP header as is.

### Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `typ`: the token type. Since it is a JWT, it is `"JWT"`.
- `alg`: the **signing algorithm**. Common values are as follows.

| alg value | Scheme | Keys |
| --- | --- | --- |
| `HS256` | HMAC + SHA-256 | Uses **one shared secret key** for both signing and verifying |
| `RS256` | RSA digital signature + SHA-256 | Signs with a **private key**, verifies with a **public key** |
| `ES256` | Elliptic curve (ECDSA) digital signature + SHA-256 | Signs with a private key, verifies with a public key. Keys are shorter than RSA |

`HS256` is simple when only servers holding the secret key use it, while `RS256`/`ES256` are convenient when the server issuing the token and the server verifying it are different (e.g. when several services trust one login server), because you only need to hand out the public key.

### Payload and Claims

The payload holds the information to put in the token. One piece of information (a name-value pair) is called a **claim**. The more claims you add, the longer the token gets, and since the token travels with every request, include only what you really need.

Claims fall into three kinds.

#### 1. Registered Claims

Claims whose names and meanings are predefined by the standard. All of them are optional, but `exp` is practically always included.

| Claim | Meaning | Description |
| --- | --- | --- |
| `iss` | Issuer | The server that created the token. E.g. `"auth.example.com"` |
| `sub` | Subject | **Who the token is about**. Usually the user ID |
| `aud` | Audience | The service that will receive and use this token. Used to reject tokens meant for other services |
| `exp` | Expiration | After this time, the verifying side must reject the token |
| `nbf` | Not before | The token cannot be used before this time |
| `iat` | Issued at | When the token was created. Used to calculate the token's age |
| `jti` | JWT ID | A unique value per token. Used to prevent the same token from being used twice (replay) |

Time values are written as a **NumericDate**, that is, an integer number of seconds since January 1, 1970. For example, `1790000000` is around September 21, 2026.

#### 2. Public Claims

Claims made to be shared across many places. To avoid name collisions with other claims, they use names registered with an organization called IANA (e.g. `email`, `name`) or are named in URI form.

```json
{
  "https://example.com/claims/is_admin": true
}
```

#### 3. Private Claims

Claims that are neither registered nor public, **agreed upon just between the server and client**. For example, something like `"role": "user"`. Their names could collide with claims from other systems, so use them with care.

### Signature

The signature is made like this.

```
signature = HMAC-SHA256( Base64URL(header) + "." + Base64URL(payload), secret key )
```

- It is the value computed with the secret key over the string formed by joining the header and payload. The result is converted to Base64URL again and attached as the third part.
- The verifying side **recomputes the signature** from the received header and payload and compares it with the signature attached to the token.
- Even a one-character change in the payload completely changes the result, so someone who doesn't know the secret key cannot create a signature that matches the changed content.

## The Payload Is Not Encrypted

The most common misconception is "JWT is an encrypted token, so it is safe."

| Misconception | Fact |
| --- | --- |
| The payload is encrypted | It is only **encoded** with Base64URL, so anyone can read it |
| It has a signature, so the contents are secret | The signature only guarantees it **has not been changed**; it does not hide the contents |
| So it's fine to put a password in it | Sensitive info like passwords, resident registration numbers, and card numbers must **never** go in it |

If the contents themselves must be hidden, use **JWE** (JSON Web Encryption), a separate standard for encrypting JWTs. What we commonly call a JWT is, precisely speaking, the **JWS (JSON Web Signature)** form with only a signature attached.

There is one more security caveat to know. The verifying side must not blindly trust the `alg` value in the token header and should accept **only the algorithms the server has decided on in advance**. This is because there have been real attacks that changed the header to `"alg": "none"` (no signature) to skip verification.

## Access Token and Refresh Token

Deciding a token's validity period raises a dilemma.

- If the validity period is **short**, users have to log in again often, which is inconvenient.
- If the validity period is **long**, a stolen token can be abused for a long time. Since the server doesn't store JWTs, once one is issued it is hard to block before it expires.

So the token is split into two.

| Aspect | Access Token | Refresh Token |
| --- | --- | --- |
| What it does | The pass sent every time you call an API | The voucher used to get a new Access Token when it expires |
| Validity period | Short (e.g. 15 minutes to 1 hour) | Long (e.g. 1 to 2 weeks) |
| Where it is sent | Every API request | Only token reissue requests |
| Format | Mostly JWT | Could be a JWT, but often a **random string** stored in the server DB |
| Stored on the server | Usually not | Stored, and deleted on logout or suspected theft |

```
[1] Login succeeds           → server issues an Access Token (1 hour) + Refresh Token (2 weeks)
[2] API request              → Authorization: Bearer (Access Token)
[3] API request 1 hour later → 401 response (Access Token expired)
[4] Reissue request          → send the Refresh Token
[5] Server checks the Refresh Token → issues a new Access Token (sometimes a new Refresh Token too)
[6] API request again        → handled normally with the new Access Token
[7] 2 weeks later the Refresh Token also expires → log in again
```

The same flow as a picture looks like this. In (A) to (B) the client receives both tokens, uses resources with the Access Token as in (C) to (D), and when an expiry error occurs in (E) to (F), it gets a new Access Token with the Refresh Token in (G) to (H).

![Refresh Token flow: the client receives an Access Token and Refresh Token from the authorization server, and when it gets an Invalid Token Error from the resource server, it obtains a new Access Token with the Refresh Token](/images/web/jwt-refresh-token-flow.jpg)

*Image source: [gyoogle, JWT (JSON Web Token)](https://gyoogle.dev/blog/web-knowledge/JWT.html)*

- Even if an Access Token is stolen, **it becomes useless within a short time**, so the damage is reduced.
- If the Refresh Token is stored on the server, you can delete it on logout or when suspicious use appears, blocking any further reissue.
- Replacing the Refresh Token with a new one every time it is used and discarding the old one is called **Refresh Token Rotation**. If an already-discarded Refresh Token comes in again, you can treat it as theft and cut off all of that user's tokens.

## Where Should Tokens Be Stored?

Where to keep tokens in the browser is a frequent interview topic too. Rather than having one right answer, it is a matter of knowing the trade-offs and choosing.

| Storage location | Pros | Risks |
| --- | --- | --- |
| `localStorage` | Easy to implement, survives refresh | Readable by JavaScript, so an [XSS](/en/web/knowledge/09-csrf와-xss) attack steals the token outright |
| `sessionStorage` | Disappears when the tab closes | Same XSS risk as localStorage |
| JavaScript variable (memory) | Relatively hard to extract even with XSS | Disappears on refresh, so you have to get it again with the Refresh Token |
| `HttpOnly` cookie | JavaScript can't read it, so it is hard to steal with XSS | Cookies are sent automatically, so you need **CSRF defenses** (`SameSite`, CSRF tokens) |

A common combination is to keep **the Access Token in memory and the Refresh Token in an `HttpOnly; Secure; SameSite` cookie**. Whichever approach you choose, preventing XSS itself (escaping input, CSP, etc.) is the most basic step.

## Getting a Feel with Code: Building and Verifying a JWT Yourself

Let's create and verify an HS256 JWT using only the Python standard library (`hmac`, `hashlib`, `base64`, `json`), without any JWT library. Real services use proven libraries (PyJWT etc. for Python), but building one yourself makes the structure really clear.

```python
import base64
import hashlib
import hmac
import json

SECRET = b"example-secret-key"  # example secret key (in practice use a long, random value)

def b64url(data: bytes) -> str:
    # JWT uses URL-safe Base64URL and drops the trailing '='
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
        return "Verification failed: signature mismatch (forged or tampered)"
    payload = json.loads(b64url_decode(p))
    if payload["exp"] < now:
        return "Verification failed: expired token"
    return f"Verification succeeded: {payload}"

NOW = 1790000000  # example current time (Unix time, seconds)
token = make_jwt({"sub": "1mo", "role": "user", "iat": NOW, "exp": NOW + 3600})
print("1) The token we made")
print(token)

print("\n2) Anyone can read the payload without the secret key")
print(b64url_decode(token.split(".")[1]).decode())

print("\n3) Verifying a valid token")
print(verify_jwt(token, NOW + 60))

print("\n4) Verifying a token with role swapped to admin")
h, p, s = token.split(".")
fake = json.loads(b64url_decode(p))
fake["role"] = "admin"
tampered = f"{h}.{b64url(json.dumps(fake, separators=(',', ':')).encode())}.{s}"
print(verify_jwt(tampered, NOW + 60))

print("\n5) Verifying after 1 hour has passed")
print(verify_jwt(token, NOW + 7200))
```

Output:

```
1) The token we made
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxbW8iLCJyb2xlIjoidXNlciIsImlhdCI6MTc5MDAwMDAwMCwiZXhwIjoxNzkwMDAzNjAwfQ.mKji1pJBhEGm84gaa56SJMvYq7e-d7ynnnhEQz8LeuY

2) Anyone can read the payload without the secret key
{"sub":"1mo","role":"user","iat":1790000000,"exp":1790003600}

3) Verifying a valid token
Verification succeeded: {'sub': '1mo', 'role': 'user', 'iat': 1790000000, 'exp': 1790003600}

4) Verifying a token with role swapped to admin
Verification failed: signature mismatch (forged or tampered)

5) Verifying after 1 hour has passed
Verification failed: expired token
```

- **Step 2**: we only decoded the Base64URL without the secret key, and the contents are fully visible. This means the payload is not encrypted.
- **Step 4**: we changed only `role` in the payload to `admin` and kept the original signature, and it was rejected because it differed from the signature the server recomputed. Without the secret key, you cannot create a signature that matches the changed content.
- **Step 5**: even if the signature is correct, the token is rejected once `exp` has passed. You must do **both** signature verification and the expiry check.
- For why we used `hmac.compare_digest` instead of `==` to compare signatures, see the timing attack explanation in the [Authentication Methods](/en/web/knowledge/06-인증-방식) article.

## Pros and Cons of JWT

| Pros | Cons |
| --- | --- |
| The server verifies with just the signature, without a session store (stateless) | Hard to invalidate an issued token before it expires |
| Even with many servers, you only need to share the key | Longer than a session ID, so each request carries more data |
| Easy to use for mobile apps and APIs on other domains | The payload is exposed, so you cannot put sensitive info in it |
| Needed info (user ID, permissions) is in the token, reducing DB lookups | Even if the permission info changes, the old value stays in the token until it expires |

If you truly need invalidation before expiry, you can keep a **blocklist** (blacklist) based on `jti` in Redis or similar. But keep in mind that this means checking a store on every request, which makes it effectively similar to sessions.

## Interview Questions

**Q. Please explain the structure of a JWT.**
A. It has three parts separated by dots: header, payload, and signature. The header holds the signing algorithm, the payload holds claims such as the user ID and expiration time, and the signature holds a value computed over the header and payload with the secret key. Each part is Base64URL-encoded.

**Q. Can you put a password in a JWT's payload?**
A. No. The payload is encoded, not encrypted, so anyone can decode and read it. The signature only checks whether it was tampered with; it does not hide the contents.

**Q. Why is a Refresh Token needed?**
A. To keep the Access Token short-lived and reduce damage from theft, while keeping users from having to log in again often. When the Access Token expires, you get a new one with the Refresh Token.

**Q. How is logout handled with JWT?**
A. A JWT itself stays valid until it expires, so the client deletes the token and the server deletes the stored Refresh Token. If immediate blocking is needed, keep the Access Token's validity period short or also use a `jti`-based blocklist.

**Q. What gets better when you use JWT instead of sessions?**
A. The server doesn't need to store user state, so it is easy to add servers, and it is easy for multiple services or mobile apps to verify the same token. The downsides are that forced expiry is hard and tokens get bigger.

## Summary

| Concept | One-line summary |
| --- | --- |
| JWT | A token holding claims as JSON with a signature attached (RFC 7519) |
| Structure | header.payload.signature, each part in Base64URL |
| alg | Signing algorithm. HS256 uses one secret key, RS256/ES256 use a private and public key |
| Claims | Registered (iss, sub, aud, exp, nbf, iat, jti), public, and private claims |
| Signature | Guarantees the contents have not changed. Does not hide the contents |
| Access Token | A short-lived pass |
| Refresh Token | A long-lived voucher, stored on the server and revocable |
| Storage location | Watch out for XSS with localStorage and CSRF with cookies. Memory + HttpOnly cookie is a common combination |
