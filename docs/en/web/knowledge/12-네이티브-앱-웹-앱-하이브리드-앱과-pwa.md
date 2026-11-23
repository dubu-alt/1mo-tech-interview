---
title: "Native Apps, Web Apps, Hybrid Apps and PWA"
sidebar: "Native, Web, Hybrid Apps and PWA"
---

**Mobile apps are divided into native apps, web apps and hybrid apps depending on what they are built with and where they run, and a PWA is a bundle of technologies that lets a web app be used like an installed app.** Interviews often ask about "the pros and cons of each approach, and which one you would choose in a given situation."

## At a Glance

- The difference between the three comes down to **"who draws the screen, and how directly the app can use the phone's features."**
  - **Native app**: an app built directly with the language and tools of the operating system (Android, iOS)
  - **Web app**: a website running inside the browser, made to work like an app
  - **Hybrid app**: an app that shows web screens inside a native app shell
- Analogy: think of **building a house**.
  - A native app is a **detached house built specifically for that plot of land** (the operating system). It is sturdy and fast, but on a different plot (a different operating system) you have to build it again from scratch.
  - A web app is a **hotel room**. Anyone can walk in and use it right away without luggage (installation), but hammering a nail into the wall (using phone features) is allowed only as far as the hotel (the browser) permits.
  - A hybrid app is a **house with prefab rooms placed inside a detached-house frame**. The rooms (web screens) can be reused on any plot, and the frame (the native part) lets you use the features of the land.
  - A PWA is **a hotel room that gives you your own key and mailbox**. It is still a hotel, but you get a shortcut on your home screen, it opens even offline, and it can receive notifications.

![A glossary table defining hybrid apps, native apps, mobile web and web apps](/images/web/app-types-compare.png)

*Image source: [Acorn Academy Blog - Native App vs Mobile Web App vs Hybrid App](https://blog.naver.com/acornedu/221012420292)*

> Note: the figure is as of 2017. Today Android mainly uses Kotlin rather than Java, and iOS mainly uses Swift rather than Objective-C. Also, where the figure describes a web app as "a combination of mobile web and native app," it means that an app-like experience was added; in reality a web app runs inside the browser. The one wrapped in a native shell is the hybrid app.

## Native App

This is the **ordinary app** you usually download from an app store (Google Play, Apple App Store).

![Native app screens installed on a phone and a tablet](/images/web/app-types-native.png)

*Image source: [Acorn Academy Blog - Native App vs Mobile Web App vs Hybrid App](https://blog.naver.com/acornedu/221012420292)*

- It is built with the language and development tools (SDK) for each mobile operating system.
  - **Android**: the Android SDK with **Kotlin** (Google's currently recommended language) or Java
  - **iOS**: the iOS SDK with **Swift** or Objective-C
- The code is turned into a form close to machine code and runs directly on the operating system.

```
App (Kotlin / Swift code)
   │
   ▼  Calls operating system APIs directly
Android / iOS
   │
   ▼
Camera, GPS, Bluetooth, notifications, contacts ...
```

### Pros

- It has **the best performance** of the three. Screen transitions and animations are the smoothest.
- Because it **calls the native APIs** provided by the operating system **directly**, it can use device features like the camera, Bluetooth and sensors without restriction.
- It is easy to build natural-looking screens that follow each operating system's design guidelines.
- It is discovered and installed by users through the app store.

### Cons

- **It is tied to a platform.** You have to build an Android app and an iOS app separately, which doubles development cost and staffing.
- Each operating system has its own designated languages, so **you are not free to choose the language**.
- Every update has to go through **app store review**, and it only takes effect once users install the update.

## Web App

It is **a website running inside the browser, built to be convenient to use like an app**. You use it by visiting an address, without installing anything. As the figure below shows, the same web app can be opened on a phone, tablet or PC.

![The same web app opened on a phone, tablet, laptop and monitor](/images/web/app-types-web.png)

*Image source: [Acorn Academy Blog - Native App vs Mobile Web App vs Hybrid App](https://blog.naver.com/acornedu/221012420292)*

It helps to first distinguish two similar terms.

| Type | Description | Example |
| --- | --- | --- |
| Mobile web | A **website** that shrinks a PC homepage to fit a phone screen. Its focus is on showing information. | The mobile version of a company introduction page |
| Mobile web app | A website built not just to fit the screen size but for an **app-like experience**, with touch controls, screen transitions and so on. It is usually built as an [SPA](/en/web/knowledge/11-csr과-ssr), so screen transitions are fast. | Web mail or maps used in a mobile browser |

For how to change the layout to fit the screen size, see this site's article on [Responsive Layout](/en/web/features/01-반응형-레이아웃과-햄버거-메뉴).

### Pros

- Since you are just opening a website, **there is no need to install anything**.
- As long as there is a browser, it can be accessed on Android, iOS or a PC **with the same code**.
- Just uploading it to the server, without app store review, **applies changes to every user immediately**, which makes maintenance easy.
- It shows up in search engines and can be shared with a single link.

### Cons

- It cannot use operating system APIs directly; it can use **only the web APIs the browser exposes**. Features like location, camera and notifications are fairly usable through web APIs, but many features, such as Bluetooth and contacts, are supported differently by each browser or blocked entirely.
- Because it goes through the browser, **it is slower than a native app**, and smooth touch responses take a bit more effort to build.
- Launching it is inconvenient. Instead of tapping a home screen icon, you have to open the browser and type the address or search for it. (A PWA addresses this drawback.)

## Hybrid App

> Native app + web app

It is **an approach that places a WebView inside a native app shell and runs a web app inside it**. A WebView is **a small browser screen** embedded in an app.

![An example hybrid app that shows its booking and payment screens as web screens](/images/web/app-types-hybrid.png)

*Image source: [Acorn Academy Blog - Native App vs Mobile Web App vs Hybrid App](https://blog.naver.com/acornedu/221012420292)*

```
Native shell (distributed through the app store)
 └─ WebView: screens built with HTML / CSS / JS
      │
      ▼  Asks through the Bridge
    Native APIs (camera, push notifications, etc.)
```

The screens are built with web technology, and features the web cannot handle well, like the camera, are requested from native code through a **bridge**. Tools like Cordova and Ionic (Capacitor) use this approach. Many banking and shopping apps also show some of their screens in a WebView.

### Pros

- It can use **both native APIs and web APIs**.
- You can **build an app with web development skills (HTML, CSS, JS)**.
- Web screens developed once can be **reused across multiple platforms**.
- The web screen parts can be fixed directly on the server without app store review.
- It can be published to the app store, so it is installed and launched from the home screen like a regular app.

### Cons

- Using native features ultimately requires **native development knowledge**.
- Because screens are drawn inside a WebView, **performance is lower than a native app**, and screen transitions may feel less natural.
- Without a UI framework (such as Ionic), developers have to build app-like screens themselves.

> A common point of confusion: **React Native** and **Flutter** are not hybrid apps but are classified separately as **cross-platform apps**. They share the idea of building apps for both operating systems from one codebase, but instead of showing web pages in a WebView, React Native uses real native UI components and Flutter uses its own rendering engine to draw the screen. That is why their performance is close to native.

## PWA (Progressive Web App)

> It combines the strengths of the web and the strengths of apps.
> Its goal is to **deliver an app-level user experience on the web**.

A PWA is not a new language or framework; it is a web app with a few technologies added so it can be used **like an installed app**.

- Anyone with the web address can use it right away, without going through an app store.
- When you **install** it with the browser's "Add to Home Screen," an icon appears, and it opens full screen like an app without an address bar.
- It takes up **far less storage** than a native app. (It does use as much storage as its cached files.)

The figure below shows a PWA being installed in Chrome on Android. When you open an ordinary web page (left), an "Add to Home Screen" prompt appears at the bottom (center), and tapping it shows an installation confirmation dialog (right). The text on the screen is in Spanish.

![Installing a web app as a PWA by adding it to the home screen in Chrome on Android](/images/web/app-types-pwa-install.png)

*Image source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:From_WebApp_to_PWA.png) (CC0)*

### The Three Building Blocks of a PWA

| Component | What it does |
| --- | --- |
| **HTTPS** | For security, service workers only run over HTTPS. (`localhost` during development is an exception.) |
| **Web app manifest** (`manifest.json`) | A file describing the app name, icons, start URL, display mode and so on. The browser reads this file to recognize the site as an "installable app." |
| **Service Worker** | JavaScript that intercepts requests between the browser and the network. It **caches** important files so the app opens quickly next time, keeps working even on a bad network (or offline), and makes it possible to receive **push notifications**. |

A manifest file looks like this.

```json
{
  "name": "1mo Tech Interview Notes",
  "short_name": "1mo",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3c8772",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

`"display": "standalone"` is the setting that makes it open like an app without an address bar.

### Features a PWA Provides

| Feature | Description |
| --- | --- |
| Progressive (progressive enhancement) | Basic features work in every browser, and more features turn on in newer browsers. This is what "Progressive" in the name means. |
| Responsive | It fits every screen size: desktop, mobile, tablet and more. |
| Connectivity independent | Thanks to the service worker, it works offline or on slow networks. |
| Safe | It is served over HTTPS, so nobody in the middle can eavesdrop (snooping) or tamper with the content. |
| Discoverable | The manifest and service worker let it be recognized as an "app," but since it is the web, it can still be found through search engines. |
| Re-engageable | Features like push notifications can bring users back. |
| Installable | It can be installed on the home screen without an app store. |
| Linkable | It can be shared with a single address (URL). |

> Platform support differences: Chrome on Android supports PWAs broadly. iOS support is relatively narrower, for example supporting push notifications only for PWAs added to the home screen starting with iOS 16.4, and it can vary with Safari's policies.

## Getting a Feel Through Code: The Service Worker's Cache First Strategy

Let's imitate in Python how a service worker opens pages even offline. When a request comes in, it **checks the cache first** and only goes to the network when the item is missing, saving the result in the cache. This is the **Cache First** strategy. A real service worker does the same thing with JavaScript's `fetch` event and the Cache API.

```python
# Code imitating the service worker's "Cache First" strategy
cache = {}               # The cache storage managed by the service worker
online = True            # Whether the network is currently connected

def network_fetch(url):
    if not online:
        raise ConnectionError("no network")
    return f"{url} content (received from server)"

def sw_fetch(url):
    if url in cache:                     # 1) If it is in the cache, return it right away
        return cache[url] + " [cache]"
    body = network_fetch(url)            # 2) If not, request it from the network
    cache[url] = body                    # 3) Save what was received in the cache
    return body + " [network]"

print(sw_fetch("/index.html"))           # First visit
print(sw_fetch("/index.html"))           # Second visit

online = False                           # Signal lost on the subway
print(sw_fetch("/index.html"))           # Opens thanks to the cache
try:
    print(sw_fetch("/new-post.html"))    # A page never fetched before
except ConnectionError as e:
    print("/new-post.html failed:", e)
```

Output:

```
/index.html content (received from server) [network]
/index.html content (received from server) [cache]
/index.html content (received from server) [cache]
/new-post.html failed: no network
```

A page fetched once opens even when the network is down, but a page never fetched does not. That is why a PWA caches essential files (the first screen, an offline notice page) in advance at first install. Trusting the cache for too long can stop new versions from showing up, so for frequently changing data, a **Network First** strategy is mixed in.

## Interview Questions

**Q. What is the difference between native apps, web apps and hybrid apps?**
Native apps are built with each operating system's own language and offer the best performance and device feature access, but have to be developed separately for each platform. Web apps run in the browser, so they can be used anywhere without installation and are easy to deploy, but they are limited in device features and performance. Hybrid apps run a web app in a WebView inside a native shell, supporting multiple platforms with web technology while still using native features.

**Q. If you were building a new service, which approach would you choose?**
If you need to validate quickly and release on many devices at once, a web app or PWA. If you need app store presence and some device features, hybrid or cross-platform. If performance and device features are central, as with games or camera processing, native. More than a single right answer, what matters is explaining your reasons based on the team's skills, the budget and the features needed.

**Q. What is a PWA?**
It is a website that adds HTTPS, a web app manifest and a service worker to a web app to provide app experiences such as installation, offline operation and push notifications. It can be distributed without an app store and shared by URL.

**Q. What is a service worker, and why does it need HTTPS?**
It is background JavaScript that intercepts requests between the browser and the network to return cached responses or handle push notifications. It is powerful enough to intercept every request, so it only runs over HTTPS to prevent anyone in the middle from tampering with it.

**Q. Are hybrid apps the same as React Native and Flutter?**
No. Hybrid apps show web pages inside a WebView, while React Native and Flutter are cross-platform approaches that draw the screen without a WebView, using native UI components or their own rendering engine.

## Summary

| Category | Native App | Web App | Hybrid App | PWA |
| --- | --- | --- | --- | --- |
| Built with | Kotlin/Java, Swift | HTML, CSS, JS | Web tech + native shell | Web tech + manifest + service worker |
| Runs in | Operating system | Browser | WebView inside the app | Browser (app-like once installed) |
| Installation | App store | Not needed | App store | Add to home screen (optional) |
| Performance | Best | Low | Medium | Better than a web app (cache) |
| Device features | All | Browser APIs only | Native + browser APIs | Browser APIs + push, offline |
| Multiple platforms | Developed separately | One codebase | Mostly shared | One codebase |
| Updates | Store review needed | Immediate | Web parts immediate | Immediate |
