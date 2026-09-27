---
title: "Flexbox를 사용한 곳"
---

| 영역 | 이유 |
| --- | --- |
| `.navbar` | 로고 – 메뉴 – 버튼을 한 줄에서 좌우로 배치 (`justify-content: space-between`) |
| `.nav-links` | 메뉴 항목들을 가로로 나란히 정렬 |
| `.hero__actions` | 버튼 2개를 가운데 정렬하고 줄바꿈 허용 (`flex-wrap`) |
| `.project-card__meta` | 언어/스타/포크 정보를 한 줄로 나열, `margin-top: auto`로 카드 하단에 고정 |
| `.filter-group` | 필터 버튼들을 가로로 나열하고 줄바꿈 허용 |
| `.footer-content` | 저작권 문구와 링크를 좌우로 배치 |

한 방향(가로 또는 세로) 정렬만 필요한 곳에는 전부 Flexbox를 썼습니다.


> 출처: [Codyssey-B1/B1-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B1-1)