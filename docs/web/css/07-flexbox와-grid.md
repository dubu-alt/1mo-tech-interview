---
title: "Flexbox & Grid 레이아웃"
---

포트폴리오 프로젝트에서 Flexbox와 Grid를 각각 어디에, 왜 썼는지 정리하고, 그 밖의 CSS 설계 포인트를 함께 모았습니다.

## Flexbox를 사용한 곳

| 영역 | 이유 |
| --- | --- |
| `.navbar` | 로고 – 메뉴 – 버튼을 한 줄에서 좌우로 배치 (`justify-content: space-between`) |
| `.nav-links` | 메뉴 항목들을 가로로 나란히 정렬 |
| `.hero__actions` | 버튼 2개를 가운데 정렬하고 줄바꿈 허용 (`flex-wrap`) |
| `.project-card__meta` | 언어/스타/포크 정보를 한 줄로 나열, `margin-top: auto`로 카드 하단에 고정 |
| `.filter-group` | 필터 버튼들을 가로로 나열하고 줄바꿈 허용 |
| `.footer-content` | 저작권 문구와 링크를 좌우로 배치 |

한 방향(가로 또는 세로) 정렬만 필요한 곳에는 전부 Flexbox를 썼습니다.

## Grid를 사용한 곳

| 영역 | 이유 |
| --- | --- |
| `.section-grid` (About, Contact) | 텍스트 영역과 이미지/폼 영역을 좌우 두 칸으로 명확히 나눔 |
| `.skills-grid` | 기술 카드들을 `repeat(auto-fit, minmax(240px, 1fr))`로 배치해, 화면 너비에 따라 열 개수가 자동 조정 |
| `.projects-grid` | GitHub API 응답 개수가 가변적이므로, 카드 개수와 무관하게 자동으로 줄바꿈되는 `auto-fit` 그리드가 적합 |

여러 개의 카드를 반응형으로 나열하거나, 화면을 큰 두 영역으로 나눠야 하는 곳은 Grid를 선택했습니다.

## 그 외 설계 포인트

- 버튼, 카드류에 `transition`을 공통으로 걸어 hover 시 `translateY`, 그림자 변화가 부드럽게 나타나도록 했습니다.
- `.reveal` / `.reveal.is-visible`은 `utilities.css`에 두어, 특정 섹션에 종속되지 않고 어떤 요소에도 재사용할 수 있게 했습니다.

## 정리

| 구분 | 선택 기준 | 사용한 곳 |
| --- | --- | --- |
| Flexbox | 한 방향(가로 또는 세로) 정렬만 필요할 때 | `.navbar`, `.nav-links`, `.hero__actions`, `.project-card__meta`, `.filter-group`, `.footer-content` |
| Grid | 카드를 반응형으로 나열하거나 화면을 큰 두 영역으로 나눌 때 | `.section-grid`, `.skills-grid`, `.projects-grid` |
| 그 외 | 공통 `transition`으로 hover 효과, `.reveal`은 `utilities.css`에서 재사용 | 버튼·카드류, 스크롤 등장 요소 |

> 출처: [Codyssey-B1/B1-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B1-1)
