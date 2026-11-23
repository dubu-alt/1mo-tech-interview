---
title: "State Management & GitHub API Integration"
---

## A State-Centered Structure

`main.js` is not split into multiple files. Inside a single file, a `state` object and a `selectors` object sit at the very top, and the remaining functions refer to these two objects.

```js
const state = {
  projects: [],
  filteredProjects: [],
  currentFilter: 'all',
  isMenuOpen: false,
};
```

User events such as button clicks always follow the flow **"① change the state → ② redraw the screen based on the state."** Here are 3 typical examples of this flow in the project.

1. Hamburger button click → `state.isMenuOpen` changes → the `is-open` class is reflected on `.nav-links`
2. Filter button click → `state.currentFilter` / `state.filteredProjects` change → the project card list is re-rendered
3. Dark mode button click → the `localStorage` value changes → the `data-theme` attribute and toggle icon are updated

## GitHub API Integration

`fetchProjects()` reflects loading → success/error/empty states in order, based on a single piece of state, `state.projects`.

| State | Handling |
| --- | --- |
| Loading | Calls `renderStatus('Loading...')` right before the request and empties the list |
| Success | Saves the repository array to `state.projects`, then renders cards with `renderProjects()` |
| Empty data | Prints `'No projects to display'` if `state.filteredProjects.length === 0` |
| Error | Caught with `try/catch` to show a message based on `error.message` plus a retry button; `403` branches to a separate message |

Forked repositories (`fork: true`) are excluded with `filter()`, and only the fields needed on screen are picked out with `map()` and saved. The `data-github-username` attribute value (`octocat`) is a placeholder for the example, so it must be replaced with your own GitHub ID before deploying.

## Single Source of Truth

The four screens, loading, error, empty data and success, are all decided by the two values `state.projects` / `state.filteredProjects` and the single message produced by `renderStatus()`.

Since the screen is judged only by "what is in the project array right now," without several separate boolean flags like `isLoading` and `hasError`, there is less room for states to fall out of sync with each other. This approach is called a **single source of truth**.

## Asynchronous Error Handling

`fetchProjects()` is written with `async/await` + `try/catch`.

- It first branches separately on the GitHub API request limit (403) to show a different message.
- Other failures are handled with a common error message.
- In the `catch` block, both `state.projects` and `state.filteredProjects` are emptied so that data from a previous request doesn't remain on the screen.

## Filtering Projects by Language

`renderFilters()` removes duplicate language values from `state.projects` with a `Set` and creates the filter buttons dynamically. Filter button clicks are detected through event delegation on `.filter-group`, and `applyProjectFilter(filter)` updates `state.currentFilter` and re-renders only the matching projects with `filter()`.

## Looking at It Again from an HTTP Perspective

Explaining what `fetchProjects()` does in terms of web basics: it **sends a [GET request](/en/web/knowledge/02-http-요청-메서드) to GitHub's [REST API](/en/web/knowledge/04-rest-api) and picks the screen based on the response's [status code](/en/web/knowledge/03-http-상태-코드)**.

```
GET https://api.github.com/users/{username}/repos?sort=updated&per_page=12

  users          → the kind of resource (users)
  {username}     → one of them
  repos          → that user's list of repositories
  ?sort=updated  → sort by most recently updated (query string: conditions go after ?)
  &per_page=12   → only 12 at a time
```

The address only contains "what" (the resource), and "how" (retrieval) is expressed by the GET method. It's an example that shows the REST API design approach as it is.

### What can happen for each status code

| Status code | Situation in this project | Screen handling |
| --- | --- | --- |
| 200 OK | The repository list was received normally | Render cards (empty-state message if the array is empty) |
| 404 Not Found | A nonexistent ID was put in `data-github-username` | Common error message |
| 403 Forbidden | Used up the number of requests allowed without logging in | Request-limit message (`response.status === 403` branch) |
| 429 Too Many Requests | Sent too many requests in a short time | Currently the common error message |
| 5xx | A problem on GitHub's server side | Common error message + retry guidance |

When called without logging in (no token), the GitHub API only accepts up to **60 requests per hour per IP**. The remaining count comes along in the response headers, so when you get a 403 you can look at this value to check "whether it's because of the request limit." GitHub's documentation says you may get either 403 or 429 when you exceed the limit. The current code only branches on 403, so grouping 429 under the same message would be safer.

```
x-ratelimit-limit: 60        ← maximum number of requests allowed per hour
x-ratelimit-remaining: 59    ← remaining requests (limited once it hits 0)
x-ratelimit-reset: 1791064724  ← the time the count is refilled (Unix time)
```

### fetch does not throw on 404 or 500

A common mistake is thinking "there's a `try/catch`, so every failure goes to `catch`." `fetch()` **finishes successfully as long as the server sends back a response, whether the status code is 404 or 500.** It only goes to `catch` when no response is received at all, such as when the internet is down or the server at the address can't be found.

```js
// Try requests to a nonexistent ID and a nonexistent server (Node.js 18 or later)
const url = 'https://api.github.com/users/this-user-should-not-exist-zzqq-1mo/repos';
try {
  const res = await fetch(url);
  console.log('No exception, status =', res.status, ', ok =', res.ok);
  console.log('Remaining requests =', res.headers.get('x-ratelimit-remaining'), '/', res.headers.get('x-ratelimit-limit'));
} catch (e) {
  console.log('Caught by catch:', e.message);
}
try {
  await fetch('https://no-such-host.invalid/');
} catch (e) {
  console.log('Caught by catch:', e.name, e.message);
}
```

```
No exception, status = 404 , ok = false
Remaining requests = 57 / 60
Caught by catch: TypeError fetch failed
```

So if you want status code failures handled in `catch` too, you have to check `response.ok` (`true` if the status code is 200-299) right after receiving the response and throw the error yourself. This project's `fetchProjects()` is written this way as well.

```js
const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`);

// Distinguish the GitHub API rate limit (403) error and inform the user clearly
if (response.status === 403) {
  throw new Error('GitHub API request limit reached. Please try again in a moment.');
}

if (!response.ok) {
  throw new Error('Unable to load projects');
}

const repos = await response.json();
```

Without the `response.ok` check, the body of the 404 response (`{"message": "Not Found"}`) would go straight into `repos`, and since it isn't an array, `.filter()` would throw an unrelated error. If you want to cover 429 as well, change the first condition to `response.status === 403 || response.status === 429`.

## Summary

- Every screen is redrawn based on a single `state` object
- API results (loading/success/empty data/error) are also judged by looking only at `state`, without separate flags
- When an error occurs, previous data is cleared so the screen and state don't fall out of sync
- Calling the GitHub API means sending a GET request to a REST API, and unauthenticated requests are limited to 60 per hour
- `fetch()` doesn't throw an exception even on 404 or 500, so you must check `response.ok` yourself

> Source: [Codyssey-B1/B1-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B1-1)
