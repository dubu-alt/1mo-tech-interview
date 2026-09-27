---
title: "UNIQUE와 PRIMARY KEY의 차이"
---

둘 다 "중복을 막는다"는 점은 같지만, PK는 테이블마다 사실상 하나(그 테이블의 정체성)이고
`NULL`을 허용하지 않는 반면, `UNIQUE`는 한 테이블에 여러 개 걸 수 있습니다. 이 프로젝트에서는
`users.username`, `users.email`에 각각 `UNIQUE`를 걸어서 "식별자로 쓰진 않지만 중복은
안 되는 값"을 표현했고, `likes(user_id, reel_id)`에는 두 컬럼을 묶은 복합 `UNIQUE`를 걸어서
"이 조합은 한 번만 존재해야 한다"를 표현했습니다.


> 출처: [Codyssey-B1/B6-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B6-1)