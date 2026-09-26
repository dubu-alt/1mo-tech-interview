# 상태(state) 중심 구조

`main.js`는 파일을 여러 개로 쪼개지 않고 하나의 파일 안에서 `state` 객체와 `selectors` 객체를 최상단에 둔 뒤, 나머지 함수들이 이 두 객체를 참조하는 구조입니다.

```js
const state = {
  projects: [],
  filteredProjects: [],
  currentFilter: 'all',
  isMenuOpen: false,
};
```

버튼 클릭 같은 사용자 이벤트는 항상 "① 상태를 바꾼다 → ② 상태를 기준으로 화면을 다시 그린다"의 흐름을 따릅니다. 예를 들어 필터 버튼을 클릭하면 `state.currentFilter`를 바꾸고, 그 값을 기준으로 `state.filteredProjects`를 다시 계산한 뒤 `renderProjects()`가 DOM을 새로 그립니다. 이 프로젝트에서 이 흐름이 적용된 대표적인 예시 3가지는 다음과 같습니다.

1. 햄버거 버튼 클릭 → `state.isMenuOpen` 변경 → `.nav-links`에 `is-open` 클래스 반영
2. 필터 버튼 클릭 → `state.currentFilter` / `state.filteredProjects` 변경 → 프로젝트 카드 목록 재렌더링
3. 다크 모드 버튼 클릭 → `localStorage` 값 변경 → `data-theme` 속성 및 토글 아이콘 갱신


> 출처: [Codyssey-B1/B1-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B1-1)