---
title: "CSR and SSR"
sidebar: "CSR and SSR"
---

**CSR (Client Side Rendering) is a method where the browser draws the screen itself with JavaScript, and SSR (Server Side Rendering) is a method where the server builds the whole screen (HTML) and sends it.** The difference between them comes down to "who builds the finished HTML."

## At a Glance

- The names come from **where** rendering happens.
  - **SSR**: the server completes the HTML and sends it.
  - **CSR**: the server sends an empty HTML file and JavaScript files, and the browser fetches the data and builds the HTML itself.
- Analogy: it is similar to **buying furniture**.
  - SSR is **delivery of fully assembled furniture**. You can use it as soon as it arrives, but the factory (server) has to assemble every order, so the factory is busy.
  - CSR is **flat-pack furniture (IKEA)**. First the instructions and parts (JS files) arrive, and you (the browser) have to assemble them before use. But once you know how to assemble it, you can afterward receive just the parts (data) and swap them in quickly.

## How Rendering Has Changed

### Traditional SSR (Multi Page Applications)

Older websites had the server build and send an entire new HTML page every time you clicked a link. This approach, where each page has its own HTML document, is called an **MPA (Multi Page Application)**.

- Every time you move to another page, the screen flashes white and a **full reload** happens.
- Even parts that did not change, like menus and headers, are downloaded and redrawn every time.
- Because the server handles all rendering, services with many users and frequently changing screens use more server resources and traffic.

As the amount of information and user actions (clicks, input, filtering) on the web grew, this approach of reloading the whole page for even small changes became inefficient.

### The Rise of SPAs and CSR

To solve this problem, **SPAs (Single Page Applications)** became widespread in the mobile era.

> **SPA**: an application that loads the full page once at the start and then updates the screen by swapping in only the data it needs

- Instead of drawing HTML, the server sends **only data such as JSON**.
- Drawing the screen is handled by JavaScript in the browser. This is **CSR**.
- Moving between pages does not trigger a reload. JavaScript changes the screen content, and the HTML5 **History API** (`history.pushState`) changes only the URL in the address bar. That is why the back button and sharing links still work as usual.
- Libraries such as React and Vue make it easy to build SPAs like this. The difference between the two is covered in [Vue and React](/en/web/knowledge/13-vue와-react).

CSR reloads **only the parts needed** based on user actions, so it responds faster than reloading the whole page.

## Comparing the Order of Operations

```
[SSR]
 Browser ──request──▶ Server: fetch data + complete the HTML
 Browser ◀─finished HTML── Server
   → Content is visible right away
   → Once the JS is downloaded and run, buttons and the like start working

[CSR]
 Browser ──request──▶ Server
 Browser ◀─empty HTML + JS files── Server
   → Download and run JS (blank screen or loading indicator in the meantime)
 Browser ──API request──▶ Server
 Browser ◀─JSON data── Server
   → JS builds the HTML and draws it on screen
```

Drawing the same flow on a timeline makes the difference clearer. In the figures, **FCP** (First Contentful Paint) is the moment content first appears on screen, and **TTI** (Time to Interactive) is the moment buttons start responding when clicked. The `net` row is network requests and the `JS` row is JavaScript execution.

With SSR, content appears as soon as the HTML drawn by the server arrives (FCP), and after running a small amount of JS you can click right away (TTI).

![SSR timeline: thanks to the server-rendered HTML, FCP and TTI are almost side by side](/images/web/csr-ssr-ssr-timeline.png)

With CSR, after receiving an empty HTML file the browser has to download `bundle.js` and run `render(app)` before the screen is complete. In the meantime, the user sees only a blank screen or a loading indicator.

![CSR timeline: after the HTML arrives, painting is blocked until the JS bundle is downloaded and run](/images/web/csr-ssr-csr-timeline.png)

*Image source: [web.dev - Rendering on the Web](https://web.dev/articles/rendering-on-the-web) (CC BY 4.0)*

## Pros and Cons of CSR

### Pros

- **Less traffic**: after the first load, only the needed data is received.
- **User experience**: the screen changes without reloading, so it feels as smooth as a native app.
- **Less server load**: the user's browser shares the work of drawing the screen, so the server only has to process data.

### Cons

- **Slow initial load**: to see the first screen, the browser has to download and run the whole app's JS files, so a blank screen may appear in the meantime.
- **Disadvantage for search engine optimization (SEO)**: if you open the page source of a web app built with React, you see only `<div id="root"></div>` with no content.
  - Google's search crawler can run JavaScript to read the content, but it postpones that execution, so indexing may be delayed.
  - Crawlers that cannot run JavaScript properly, and bots that build link previews for KakaoTalk or Slack, see only an empty page.
  - So pages where search visibility matters need the extra effort of adding SSR separately.
- **Depends on the user's device performance**: on old phones, JS runs slowly and the screen appears late.

## Pros and Cons of SSR

### Pros

- **Search engine optimization (SEO)**: the first HTML response contains all the content, so any crawler can read it.
- **Fast first screen**: the server sends HTML it has already drawn, so content appears even before all the JS arrives.

### Cons

- **Server load**: the server has to build HTML for every request, so many users means heavy use of server resources.
- **Flashing on page navigation**: traditional SSR downloads everything again on every page move.
- **A period where things are visible but not clickable**: the screen shows up first, but the JS is not hooked up yet, so there can be a moment when clicking a button does nothing. (See hydration below.)
- **Project complexity**: the same code has to run on both the server and the browser, so you have to be careful with browser-only features like `window`, and the setup becomes more complex.

## SSG and Hydration

These days, rather than picking only CSR or SSR, people mix the strengths of both.

### SSG (Static Site Generation)

**SSG** does not build HTML when a request arrives; it **builds everything in advance before deployment (at build time)**.

- The server only has to hand over prebuilt files, so it is very fast and can run on just a static file server or a CDN.
- On the other hand, the site has to be rebuilt whenever content changes, so it fits **content that does not change often**, like blogs and documentation.
- There is also a middle ground called **ISR (Incremental Static Regeneration)**, which regenerates only some pages at set intervals (Next.js).

> A real example: this site (1mo.dev) is SSG. VitePress turns every article into an HTML file at build time, and GitHub Pages delivers those files as they are. That is why it runs without a server program (WAS). The difference between a web server and a WAS is covered in [Web Server and WAS](/en/web/knowledge/10-웹-서버와-was).

### Hydration

**Hydration** is **the process of attaching JavaScript to static HTML built on the server (or at build time) to bring it to life**.

- Analogy: hydration means "adding water." It is like pouring water (JS) onto bone-dry instant food (static HTML) to bring it back to an edible state.
- The first screen is shown quickly as HTML, and once the JS arrives, events such as button clicks are attached.
- After hydration finishes, the page behaves like CSR. This site also loads its first page as HTML, but after that, clicking another article in the left menu navigates like an SPA without a reload.

As the figure below shows, the server-built HTML makes the content appear early (FCP), but clicking does nothing until the JS is downloaded and `render(app, DATA)` attaches the events (TTI). The "visible but not clickable" period mentioned earlier is exactly the gap between FCP and TTI.

![Hydration timeline: thanks to server rendering, content appears early, but interaction is blocked until the JS is downloaded and run](/images/web/csr-ssr-hydration-timeline.png)

*Image source: [web.dev - Rendering on the Web](https://web.dev/articles/rendering-on-the-web) (CC BY 4.0)*

| Method | When the HTML is built | Where it is built | Good fit for |
| --- | --- | --- | --- |
| CSR | After the page is opened | Browser | Admin screens, dashboards used after login |
| SSR | On every request | Server | Online store product pages, news, and other frequently changing pages where search matters |
| SSG | Once at build time | Build server | Blogs, documentation sites, company introduction pages |

As for typical tools, React-based **Next.js** and Vue-based **Nuxt** support both SSR and SSG, while **VitePress** and **Astro** are strong at SSG.

## Getting a Feel Through Code: What Is in the First Response?

Let's compare whether the HTML the server sends first contains the actual content. A crawler that does not run JavaScript judges the page by this first response alone.

```python
import json

posts = [{"title": "How Browsers Work"}, {"title": "CSR and SSR"}]

# SSR: the server fills in the data and sends finished HTML
def ssr_response():
    items = "".join(f"<li>{p['title']}</li>" for p in posts)
    return f"<html><body><ul>{items}</ul></body></html>"

# CSR: the server first sends an empty shell HTML and a JS file,
#      and the data is sent separately later as JSON
def csr_shell():
    return '<html><body><div id="app"></div><script src="app.js"></script></body></html>'

def csr_api():
    return json.dumps(posts, ensure_ascii=False)

print("[SSR] first response =", ssr_response())
print("[CSR] first response =", csr_shell())
print("[CSR] later API response =", csr_api())

# What if a crawler looks only at the first response without running JS?
for name, html in [("SSR", ssr_response()), ("CSR", csr_shell())]:
    print(name, "first response contains the article title:", "CSR and SSR" in html)
```

Output:

```
[SSR] first response = <html><body><ul><li>How Browsers Work</li><li>CSR and SSR</li></ul></body></html>
[CSR] first response = <html><body><div id="app"></div><script src="app.js"></script></body></html>
[CSR] later API response = [{"title": "How Browsers Work"}, {"title": "CSR and SSR"}]
SSR first response contains the article title: True
CSR first response contains the article title: False
```

The first CSR response contains only an empty `div`, and the article titles appear on screen only after the JS calls the API.

## Interview Questions

**Q. What is the difference between CSR and SSR?**
In CSR, the server sends empty HTML and JS, and the browser fetches the data and draws the screen. In SSR, the server fills in the data and sends finished HTML. CSR makes page navigation fast and puts less load on the server, but it is weaker for the first load and SEO. SSR is better for the first screen and SEO, but puts more load on the server.

**Q. What is an SPA, and how does the URL change without a reload?**
It is an application that loads the page once at the start and then updates the screen by swapping in only data. JavaScript changes the screen, and the History API (`pushState`) changes the URL without a reload.

**Q. How do you solve the SEO problem in CSR?**
The most reliable way is to apply SSR or SSG to pages where search matters. You can use frameworks like Next.js or Nuxt, or use prerendering, which serves pre-drawn HTML only to crawlers.

**Q. What is hydration?**
It is the process of attaching JavaScript to static HTML built on the server or at build time so that events work. The first screen is shown quickly as HTML, and after that the page behaves like CSR.

**Q. When do you use SSG?**
For content that does not change often, like blogs and documentation sites. Because all the HTML is built in advance at build time, it is fast and cheap to serve, but the site has to be rebuilt whenever content changes.

## Summary

| Category | CSR | SSR | SSG |
| --- | --- | --- | --- |
| Where HTML is built | Browser | Server (per request) | Build server (once before deployment) |
| First screen | Slow (after JS runs) | Fast | Fastest |
| Page navigation | Fast (no reload) | Reload in the traditional approach | Fast after hydration |
| SEO | Weak | Strong | Strong |
| Server load | Low (data only) | High | Almost none (file delivery only) |
| Typical examples | Basic React, Vue SPAs | Next.js, Nuxt | VitePress, Astro, Next.js |
