---
title: "OAuth 2.0"
sidebar: "OAuth"
---

**OAuth is an open standard that lets users delegate permission so that another application can use part of their information or features, without handing over their password.** The name itself is short for Open Authorization. The version widely used today is OAuth 2.0 (RFC 6749), and features like "Log in with Kakao" and "Connect Google Calendar" all work this way.

## At a Glance

- In the past, to fetch your information from another service, you had to **hand that service's ID and password directly to the app**. Then the app could do anything with your account, and there was no way to stop it until you changed your password.
- OAuth instead gives the app **a pass with a set permission scope and expiry (an Access Token)** rather than a password.
- Analogy: think of a hotel's **valet parking key**.
  - The car owner (the user) does not hand over the key ring that also holds the house keys (the password), but gives the attendant (the app) only **a valet key that can just drive the car** (the Access Token).
  - The valet key cannot open the trunk or glovebox. This is the **permission scope**.
  - When the errand is done, you can take the valet key back or make it unusable. This is **token expiry and permission revocation**.

Below is an example of connecting an external tool to MediaWiki, which runs Wikipedia. The tool (client) sends the user to MediaWiki (1), the user logs in on MediaWiki and grants permission (2), MediaWiki sends the user back carrying proof of the permission (3), and the user returns to the tool with that proof (4). The tool never sees the user's password.

![The OAuth triangle: the user moves in order 1 to 4 between the user (resource owner), the tool (client), and MediaWiki (provider) to grant permission](/images/web/oauth-roles-triangle.png)

*Image source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Oauth_triangle.authorize.svg) (CC BY-SA 3.0)*

The provider (MediaWiki) in the image combines what are called the authorization server and resource server below.

## The 4 Roles in OAuth 2.0

OAuth 2.0 has four characters. The flows coming up are the story of what these four exchange.

| Role | English name | Who is it | Example: adding "Log in with Google" to your service |
| --- | --- | --- | --- |
| Resource owner | Resource Owner | The owner of the information, the person who grants permission | Me (the Google account owner) |
| Client | Client | The app that receives permission and wants to use the information | The web service I built |
| Authorization server | Authorization Server | Logs the user in, gets consent, and issues tokens | Google's login and consent server |
| Resource server | Resource Server | Holds the actual information and hands it over after checking the token | Google Profile API, Calendar API |

The authorization server and resource server are often run by the same company, but their roles are clearly different. The authorization server **issues tokens**, and the resource server **receives and checks tokens**.

Before starting, the client **registers in advance** with the authorization server. Registering gives it the following values.

- `client_id`: the app's public name tag
- `client_secret`: a password only the app knows (kept only on the server. Must never go in browser or mobile app code)
- `redirect_uri`: the address the user returns to after giving consent. Since users are only sent back to registered addresses, this prevents the code from leaking somewhere unexpected.

## Key Terms

| Term | Meaning |
| --- | --- |
| Scope | The range of permissions the app requests. E.g. `profile`, `email`, `calendar.readonly` |
| Authorization Code | A **short-lived (usually tens of seconds to 10 minutes), one-time code** the authorization server gives when the user consents. It cannot call APIs by itself and must be exchanged for a token |
| Access Token | The pass shown to the resource server. Short-lived |
| Refresh Token | A voucher for getting a new Access Token without user consent when it expires. Long-lived |
| Authorization Grant | The "proof of permission" the client presents to get a token, and the way it is done. The authorization code is the typical one |
| state | A random value that checks the request and response belong to the same flow. Prevents CSRF attacks |

## The Authorization Code Flow

This is the most widely used and currently recommended default flow. Let's go through, in order, what happens when you press the "Log in with Google" button.

```
Characters: user (browser), client (my service), authorization server (Google), resource server (Google API)

[1] User          → Client          Clicks the "Log in with Google" button
[2] Client        → User            Redirects to the authorization server's address
                                    (includes client_id, redirect_uri, scope, state)
[3] User          → Auth server     Logs in to Google and consents to "share profile, email"
[4] Auth server   → Client          Sends the user back to redirect_uri
                                    (includes ?code=one-time-code&state=...)
[5] Client        → Auth server     After checking state, sends code + client_secret (directly, server to server)
[6] Auth server   → Client          Issues an Access Token (+ Refresh Token)
[7] Client        → Resource server Calls the API with Authorization: Bearer (Access Token)
[8] Resource server → Client        Checks the token and responds with profile info
[9] Client        → User            Login complete screen
```

| Step | What happens | Why it is done this way |
| --- | --- | --- |
| 1-2 | The client sends the user to the authorization server's page | The password is entered **only on Google's page**. My service never sees the password |
| 3 | The user logs in and consents to the permission scope | The user directly sees what they are allowing |
| 4 | The authorization server sends the user back to `redirect_uri` with a **code** | Since it passes through the browser address bar, the only value that could be exposed is **a short-lived one-time code** |
| 5-6 | The client server exchanges the code and `client_secret` for a token | The token exchange happens **directly between servers**, so the token never passes through the browser |
| 7-8 | Calls the resource server's API with the Access Token | The resource server checks the token's validity period and scope, then responds |

How the resource server checks the token depends on the token type. If it is a meaningless string (an opaque token), it asks the authorization server "Is this token valid?" (token introspection), and if it is a [JWT](/en/web/knowledge/07-jwt), it checks the signature and expiration time itself.

### Other Flows (Grant Types)

| Flow | When it is used | Currently recommended? |
| --- | --- | --- |
| Authorization Code (+ PKCE) | Almost every case with a user: web, mobile apps, SPAs | **Default recommendation** |
| Client Credentials | When **servers talk to servers** without a user (e.g. a batch job calling an API) | Recommended |
| Device Code | Devices where typing is awkward (smart TVs, consoles). Approve by entering a code on your phone | Recommended |
| Refresh Token | Reissuing Access Tokens | Recommended |
| Implicit | For older SPAs. Receives the token directly via the address bar, without a code | **Deprecated** (the token is exposed in the address bar and history) |
| Resource Owner Password | The user types their ID and password directly into the app | **Deprecated** (defeats the purpose of using OAuth) |

The OAuth 2.0 Security Best Current Practice document (RFC 9700) and the OAuth 2.1 draft being finalized drop the Implicit and Password methods and recommend that **every client use PKCE together with Authorization Code**.

## PKCE: Making an Intercepted Code Useless

PKCE (Proof Key for Code Exchange, pronounced "pixie") is a safeguard added to the Authorization Code flow.

- Mobile apps and SPAs run their code on the user's device, so they cannot safely hide a `client_secret`.
- Then, if an attacker intercepts the authorization code in step 4, there is no way to stop them from getting a token with it.

PKCE solves this with **a secret value only the app that made the original request knows**.

```
[1] The app creates a long random string code_verifier and keeps it to itself
[2] Computes code_challenge = Base64URL( SHA-256(code_verifier) )
[3] Sends only the code_challenge in the authorization request (step 2) → the authorization server remembers it
[4] Sends the original code_verifier in the token exchange (step 5)
[5] The authorization server recomputes from the received code_verifier and issues a token if it matches the value from [3]
```

SHA-256 can only be computed in one direction, so even if an attacker snoops on the code and the `code_challenge`, they cannot figure out the original `code_verifier`. So the intercepted code alone is not enough to get a token.

## OAuth and OpenID Connect

"Log in with Google" is actually not done with OAuth alone. This is where many people get confused.

- **OAuth 2.0 is a set of rules for authorization.** An Access Token only means "this app may call APIs within this scope"; **it was not made to tell the client "who this person is."**
- **OpenID Connect (OIDC)** is a standard that adds **authentication** on top of OAuth 2.0. If you request with `openid` in the scope, an **ID Token** is issued along with the Access Token.

| Aspect | OAuth 2.0 | OpenID Connect |
| --- | --- | --- |
| Purpose | Authorization (delegating permission) | Authentication (login, verifying who you are) |
| Key output | Access Token | ID Token (+ Access Token) |
| Token format | Not specified (random string or JWT) | The ID Token is always a **JWT** |
| Who reads the token | Resource server (API) | Client (my service) |
| Information inside | The granted scope | User ID (`sub`), issuer (`iss`), audience (`aud`), email, name, etc. |
| Example | "Give this app permission to add events to my Google Calendar" | "Log in to this service with a Google account" |

In short, the correct division is to use **OIDC's ID Token for login and the Access Token for API calls**. The difference between authentication and authorization is covered in more detail in the [Authentication Methods](/en/web/knowledge/06-인증-방식) article.

## Getting a Feel with Code: Computing PKCE Values Yourself

Let's compute a PKCE `code_challenge` with the Python standard library and check that it matches the example value in the PKCE standard document (RFC 7636).

```python
import base64
import hashlib
import secrets

def make_challenge(verifier: str) -> str:
    digest = hashlib.sha256(verifier.encode("ascii")).digest()
    return base64.urlsafe_b64encode(digest).rstrip(b"=").decode()

# Check the computation using the example value from the RFC 7636 document
verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"
print("code_verifier :", verifier)
print("code_challenge:", make_challenge(verifier))

# In practice, create a new one for every request
new_verifier = secrets.token_urlsafe(32)
print("New verifier length:", len(new_verifier))

# The authorization server's check: recompute from the verifier received later and compare with the first challenge
saved_challenge = make_challenge(verifier)
print("Verifier sent by the real app :", make_challenge(verifier) == saved_challenge)
print("Attacker who intercepted code :", make_challenge("attacker-guess-value") == saved_challenge)
```

Output:

```
code_verifier : dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
code_challenge: E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
New verifier length: 43
Verifier sent by the real app : True
Attacker who intercepted code : False
```

- The computed `code_challenge` exactly matches the value `E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM` given in the RFC 7636 appendix.
- `code_verifier` must be between 43 and 128 characters, and `secrets.token_urlsafe(32)` turns 32 random bytes into 43 characters, which fits exactly.
- The attacker cannot work backward from the `code_challenge` to the original `code_verifier`, so they fail to get a token with the intercepted code.

## Interview Questions

**Q. What is OAuth?**
A. An authorization standard in which a user, without handing over their password, delegates access to their resources to another application through an Access Token with a set scope and expiry.

**Q. Please explain the four roles in OAuth 2.0.**
A. The resource owner, who owns the information; the client, which receives and uses the permission; the authorization server, which gets consent and issues tokens; and the resource server, which checks tokens and hands over the actual resources.

**Q. Why go through an authorization code instead of giving the token directly?**
A. The redirect in step 4 passes through the browser address bar, so its values may remain in history or logs. So only a short-lived one-time code is put there, and the actual token is obtained by the client server talking directly to the authorization server.

**Q. What is the difference between OAuth and OpenID Connect?**
A. OAuth is an authorization standard for delegating API access, and OpenID Connect is an authentication standard built on top of it that adds an ID Token (JWT) to verify who the user is. Social login usually uses OIDC.

**Q. What is PKCE and why is it needed?**
A. It sends the hash of a secret value created by the client (code_verifier) with the authorization request, then sends the original with the token exchange to confirm it is the same app. It prevents authorization code interception in mobile apps and SPAs that cannot hide a client_secret, and it is now recommended for all clients.

## Summary

| Concept | One-line summary |
| --- | --- |
| OAuth 2.0 | An authorization standard that delegates permission with a token of set scope and expiry instead of a password |
| Four roles | Resource owner, client, authorization server, resource server |
| Scope | The range of permissions the app requests. Request only as much as needed |
| Authorization Code flow | The default flow: receive a one-time code and exchange it for a token server to server |
| state | A value that pairs request and response to prevent CSRF |
| PKCE | Uses code_verifier and code_challenge to make an intercepted code useless |
| Implicit / Password | Deprecated due to security problems |
| OpenID Connect | An authentication layer on top of OAuth. Verifies who the user is with an ID Token (JWT) |
