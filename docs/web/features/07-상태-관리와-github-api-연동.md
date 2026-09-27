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

## 정리

- 모든 화면은 `state` 객체 하나를 기준으로 다시 그림
- API 결과(로딩/성공/빈 데이터/에러)도 따로 플래그 없이 `state`만 보고 판단
- 에러가 나면 이전 데이터를 비워서 화면과 상태가 어긋나지 않게 함

> 출처: [Codyssey-B1/B1-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B1-1)
