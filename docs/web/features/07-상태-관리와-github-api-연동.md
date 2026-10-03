---
title: "상태 관리 & GitHub API 연동"
---

## 상태(state) 중심 구조

`main.js`는 파일을 여러 개로 쪼개지 않고 하나의 파일 안에서 `state` 객체와 `selectors` 객체를 최상단에 둔 뒤, 나머지 함수들이 이 두 객체를 참조하는 구조입니다.

```js
const state = {
  projects: [],
  filteredProjects: [],
  currentFilter: 'all',
  isMenuOpen: false,
};
```

버튼 클릭 같은 사용자 이벤트는 항상 **"① 상태를 바꾼다 → ② 상태를 기준으로 화면을 다시 그린다"** 의 흐름을 따릅니다. 이 프로젝트에서 이 흐름이 적용된 대표적인 예시 3가지는 다음과 같습니다.

1. 햄버거 버튼 클릭 → `state.isMenuOpen` 변경 → `.nav-links`에 `is-open` 클래스 반영
2. 필터 버튼 클릭 → `state.currentFilter` / `state.filteredProjects` 변경 → 프로젝트 카드 목록 재렌더링
3. 다크 모드 버튼 클릭 → `localStorage` 값 변경 → `data-theme` 속성 및 토글 아이콘 갱신

## GitHub API 연동

`fetchProjects()`는 `state.projects`라는 단일 상태를 기준으로 로딩 → 성공/에러/빈 상태를 순서대로 반영합니다.

| 상태 | 처리 |
| --- | --- |
| 로딩 | 요청 직전 `renderStatus('로딩 중...')` 호출, 리스트 비움 |
| 성공 | 저장소 배열을 `state.projects`에 저장 후 `renderProjects()`로 카드 렌더링 |
| 빈 데이터 | `state.filteredProjects.length === 0`이면 `'표시할 프로젝트가 없습니다'` 출력 |
| 에러 | `try/catch`로 잡아 `error.message` 기반 메시지 + 재시도 버튼 안내 표시, `403`은 별도 메시지로 분기 |

포크한 저장소(`fork: true`)는 `filter()`로 제외하고, 화면에 필요한 필드만 `map()`으로 추려서 저장합니다. `data-github-username` 속성 값(`octocat`)은 예시용 플레이스홀더이므로 배포 전 본인 GitHub 아이디로 교체가 필요합니다.

## 단일 진실 공급원 (Single Source of Truth)

로딩·에러·빈 데이터·성공, 이 네 가지 화면은 모두 `state.projects` / `state.filteredProjects` 두 값과 `renderStatus()`가 만드는 문구 하나로 결정됩니다.

별도의 `isLoading`, `hasError` 같은 boolean 플래그를 여러 개 두지 않고, "지금 프로젝트 배열에 무엇이 들어있는가"만으로 화면을 판단하기 때문에 상태가 서로 어긋날 여지가 줄어듭니다. 이런 방식을 **단일 진실 공급원(single source of truth)** 이라고 부릅니다.

## 비동기 에러 처리

`fetchProjects()`는 `async/await` + `try/catch`로 작성되어 있습니다.

- GitHub API의 요청 제한(403)을 먼저 별도로 분기해 안내 메시지를 다르게 보여줍니다.
- 그 외 실패는 공통 에러 메시지로 처리합니다.
- `catch` 블록에서 `state.projects`, `state.filteredProjects`를 모두 비워, 이전 요청의 데이터가 화면에 남아있지 않도록 정리합니다.

## 프로젝트 언어 필터링

`renderFilters()`가 `state.projects`에서 언어 값을 `Set`으로 중복 제거해 필터 버튼을 동적으로 생성합니다. 필터 버튼 클릭은 `.filter-group`에 이벤트 위임으로 감지되며, `applyProjectFilter(filter)`가 `state.currentFilter`를 갱신하고 `filter()`로 조건에 맞는 프로젝트만 다시 렌더링합니다.

## HTTP 관점에서 다시 보기

`fetchProjects()`가 하는 일을 웹 기초 지식으로 다시 풀어 보면, **GitHub의 [REST API](/web/knowledge/04-rest-api)에 [GET 요청](/web/knowledge/02-http-요청-메서드)을 보내고, 응답의 [상태 코드](/web/knowledge/03-http-상태-코드)를 보고 화면을 고르는 일**입니다.

```
GET https://api.github.com/users/{아이디}/repos?sort=updated&per_page=12

  users          → 자원의 종류 (사용자들)
  {아이디}        → 그중 한 명
  repos          → 그 사용자의 저장소 목록
  ?sort=updated  → 최근 수정 순으로 정렬 (쿼리 스트링: 조건은 ? 뒤에)
  &per_page=12   → 한 번에 12개만
```

주소에는 "무엇을"(자원)만 들어 있고, "어떻게"(조회)는 GET이라는 메서드가 표현합니다. REST API 설계 방식이 그대로 드러나는 예입니다.

### 상태 코드별로 생길 수 있는 일

| 상태 코드 | 이 프로젝트에서 생기는 상황 | 화면 처리 |
| --- | --- | --- |
| 200 OK | 저장소 목록을 정상으로 받음 | 카드 렌더링 (배열이 비면 빈 상태 문구) |
| 404 Not Found | `data-github-username`에 없는 아이디를 넣음 | 공통 에러 메시지 |
| 403 Forbidden | 로그인 없이 쓸 수 있는 요청 수를 다 씀 | 요청 제한 안내 메시지 (`response.status === 403` 분기) |
| 429 Too Many Requests | 짧은 시간에 요청을 너무 많이 보냄 | 현재는 공통 에러 메시지 |
| 5xx | GitHub 서버 쪽 문제 | 공통 에러 메시지 + 재시도 안내 |

GitHub API는 로그인(토큰) 없이 호출하면 **IP 하나당 1시간에 60번**까지만 받아 줍니다. 응답 헤더에 남은 횟수가 함께 오기 때문에, 403이 왔을 때 이 값을 보면 "요청 제한 때문인지"를 확인할 수 있습니다. GitHub 문서는 제한을 넘으면 403 또는 429가 올 수 있다고 안내합니다. 지금 코드는 403만 따로 분기하므로, 429도 같은 안내 메시지로 묶어 두면 더 안전합니다.

```
x-ratelimit-limit: 60        ← 1시간에 받을 수 있는 최대 요청 수
x-ratelimit-remaining: 59    ← 남은 요청 수 (0이 되면 제한)
x-ratelimit-reset: 1791064724  ← 횟수가 다시 채워지는 시각 (유닉스 시간)
```

### fetch는 404나 500에서 에러를 던지지 않는다

자주 하는 실수가 "`try/catch`가 있으니 실패는 다 `catch`로 간다"고 생각하는 것입니다. `fetch()`는 **서버가 응답을 돌려주기만 하면 상태 코드가 404든 500이든 성공으로 끝납니다.** `catch`로 가는 것은 인터넷이 끊겼거나 주소의 서버를 아예 찾지 못한 경우처럼, 응답 자체를 받지 못했을 때뿐입니다.

```js
// 없는 아이디와 없는 서버로 각각 요청해 보기 (Node.js 18 이상)
const url = 'https://api.github.com/users/this-user-should-not-exist-zzqq-1mo/repos';
try {
  const res = await fetch(url);
  console.log('예외 없음, status =', res.status, ', ok =', res.ok);
  console.log('남은 요청 수 =', res.headers.get('x-ratelimit-remaining'), '/', res.headers.get('x-ratelimit-limit'));
} catch (e) {
  console.log('catch로 잡힘:', e.message);
}
try {
  await fetch('https://no-such-host.invalid/');
} catch (e) {
  console.log('catch로 잡힘:', e.name, e.message);
}
```

```
예외 없음, status = 404 , ok = false
남은 요청 수 = 57 / 60
catch로 잡힘: TypeError fetch failed
```

그래서 상태 코드 실패를 `catch`에서 함께 처리하려면, 응답을 받은 직후 `response.ok`(상태 코드가 200~299이면 `true`)를 확인해서 직접 에러를 던져야 합니다. 이 프로젝트의 `fetchProjects()`도 이렇게 작성되어 있습니다.

```js
const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`);

// GitHub API 레이트 리밋(403) 에러를 구분해서 사용자에게 명확히 안내
if (response.status === 403) {
  throw new Error('GitHub API 요청 제한에 도달했습니다. 잠시 후 다시 시도해 주세요.');
}

if (!response.ok) {
  throw new Error('프로젝트를 불러올 수 없습니다');
}

const repos = await response.json();
```

`response.ok` 검사가 없었다면 404 응답의 본문(`{"message": "Not Found"}`)이 그대로 `repos`에 들어가고, 배열이 아니라서 `.filter()`에서 엉뚱한 에러가 났을 것입니다. 429까지 묶고 싶다면 첫 조건을 `response.status === 403 || response.status === 429`로 바꾸면 됩니다.

## 정리

- 모든 화면은 `state` 객체 하나를 기준으로 다시 그림
- API 결과(로딩/성공/빈 데이터/에러)도 따로 플래그 없이 `state`만 보고 판단
- 에러가 나면 이전 데이터를 비워서 화면과 상태가 어긋나지 않게 함
- GitHub API 호출은 REST API에 GET 요청을 보내는 것이고, 비로그인 요청은 1시간에 60번으로 제한됨
- `fetch()`는 404·500에서도 예외를 던지지 않으므로 `response.ok`를 직접 확인해야 함

> 출처: [Codyssey-B1/B1-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B1-1)
