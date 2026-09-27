---
title: "조인(JOIN)"
---

여러 테이블에 나뉘어 저장된 데이터를, 공통 컬럼(주로 FK-PK 관계)을 기준으로 한 화면에서
합쳐 보는 것이 조인입니다. 이 프로젝트는 정보를 `users`/`reels`/`likes`/`comments`로 쪼개서
저장하기 때문에, "릴스 제목과 그 업로더의 이름을 같이 보고 싶다" 같은 요구는 조인으로 해결합니다.

- **INNER JOIN (교집합)**: 양쪽 테이블에 **모두 매칭되는 행만** 남깁니다. Q6에서 `reels`와
  `users`를 `reels.user_id = users.user_id`로 이어 붙여 "릴스 + 업로더 이름"을 만들었고,
  Q7·Q9처럼 `comments`/`likes`를 가운데 두고 INNER JOIN을 두 번 걸면 "댓글 -> 작성자 -> 대상 릴스",
  "릴스 -> 좋아요 -> 누른 사용자"까지 한 줄로 이어집니다.
- **LEFT JOIN (왼쪽 기준)**: 왼쪽(기준) 테이블의 행은 **매칭이 없어도 전부 남기고**, 오른쪽에
  짝이 없으면 그 자리를 `NULL`로 채웁니다. Q8에서 `reels LEFT JOIN comments` 후
  `WHERE comments.comment_id IS NULL` 조건을 걸면, "댓글이 하나도 안 달린 릴스"만 걸러낼 수
  있습니다. 이 "LEFT JOIN + IS NULL"은 "한쪽에는 있는데 다른 쪽에는 없는 것"을 찾는 대표적인
  패턴입니다.
- **ON과 WHERE의 역할 구분**: `ON`은 두 테이블을 **어떤 조건으로 연결할지**(연결 열쇠)를,
  `WHERE`는 연결된 결과에서 **어떤 행만 남길지**(필터)를 정합니다. Q8이 조인 조건은 `ON`에,
  걸러내는 조건(`IS NULL`)은 `WHERE`에 나눠 쓴 이유입니다.

| 종류 | 남는 행 | 이 프로젝트 예시 |
|---|---|---|
| `INNER JOIN` | 양쪽에 다 있는 행만 | Q6(릴스+업로더), Q7(댓글+작성자+릴스), Q9(릴스+좋아요 누른 사람) |
| `LEFT JOIN` | 왼쪽 전부 + 오른쪽은 있으면 채움 | Q8(댓글 없는 릴스 = `LEFT JOIN` + `IS NULL`) |

조인의 연결 열쇠가 되는 `reels.user_id`에 인덱스를 건 이유("인덱스 적용" 항목 참고)도, 이렇게
`user_id`를 기준으로 한 조인이 자주 일어나기 때문입니다.


> 출처: [Codyssey-B1/B6-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B6-1)