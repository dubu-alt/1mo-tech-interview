---
title: "참조(Reference)란"
---

자식 테이블은 부모 행 전체를 복사해서 저장하지 않고, 부모의 PK 값 하나만 저장해서 "이 값을
가진 행을 가리킨다"는 식으로 연결합니다. 예를 들어 `reels.user_id = 4`는 `traveler_ji`라는
이름을 직접 저장하는 게 아니라, `users` 테이블에서 `user_id = 4`인 행을 "참조"만 합니다.
그래서 `users.full_name`을 나중에 바꿔도 `reels`를 하나하나 고칠 필요가 없습니다.


> 출처: [Codyssey-B1/B6-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B6-1)