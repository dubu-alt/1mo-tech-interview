---
title: "GitHub API 상태를 하나의 진실 공급원으로"
---

로딩·에러·빈 데이터·성공, 이 네 가지 화면은 모두 `state.projects` / `state.filteredProjects` 두 값과 `renderStatus()`가 만드는 문구 하나로 결정됩니다. 별도의 `isLoading`, `hasError` 같은 boolean 플래그를 여러 개 두지 않고, "지금 프로젝트 배열에 무엇이 들어있는가"만으로 화면을 판단하기 때문에 상태가 서로 어긋날 여지가 줄어듭니다. 이런 방식을 **단일 진실 공급원(single source of truth)** 이라고 부릅니다.


> 출처: [Codyssey-B1/B1-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B1-1)