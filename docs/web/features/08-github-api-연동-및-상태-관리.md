---
title: "GitHub API 연동 및 상태 관리"
---

`fetchProjects()`는 `state.projects`라는 단일 상태를 기준으로 로딩 → 성공/에러/빈 상태를 순서대로 반영합니다.

| 상태 | 처리 |
| --- | --- |
| 로딩 | 요청 직전 `renderStatus('로딩 중...')` 호출, 리스트 비움 |
| 성공 | 저장소 배열을 `state.projects`에 저장 후 `renderProjects()`로 카드 렌더링 |
| 빈 데이터 | `state.filteredProjects.length === 0`이면 `'표시할 프로젝트가 없습니다'` 출력 |
| 에러 | `try/catch`로 잡아 `error.message` 기반 메시지 + 재시도 버튼 안내 표시, `403`은 별도 메시지로 분기 |

포크한 저장소(`fork: true`)는 `filter()`로 제외하고, 화면에 필요한 필드만 `map()`으로 추려서 저장합니다. `data-github-username` 속성 값(`octocat`)은 예시용 플레이스홀더이므로 배포 전 본인 GitHub 아이디로 교체가 필요합니다.


> 출처: [Codyssey-B1/B1-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B1-1)