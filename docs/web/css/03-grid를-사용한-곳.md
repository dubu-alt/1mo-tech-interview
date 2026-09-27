---
title: "Grid를 사용한 곳"
---

| 영역 | 이유 |
| --- | --- |
| `.section-grid` (About, Contact) | 텍스트 영역과 이미지/폼 영역을 좌우 두 칸으로 명확히 나눔 |
| `.skills-grid` | 기술 카드들을 `repeat(auto-fit, minmax(240px, 1fr))`로 배치해, 화면 너비에 따라 열 개수가 자동 조정 |
| `.projects-grid` | GitHub API 응답 개수가 가변적이므로, 카드 개수와 무관하게 자동으로 줄바꿈되는 `auto-fit` 그리드가 적합 |

여러 개의 카드를 반응형으로 나열하거나, 화면을 큰 두 영역으로 나눠야 하는 곳은 Grid를 선택했습니다.


> 출처: [Codyssey-B1/B1-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B1-1)