---
title: "외래키(Foreign Key, FK)"
---

다른 테이블의 PK 값을 그대로 저장해서 두 테이블을 연결하는 컬럼입니다. FK가 걸려 있으면
DB 엔진이 "이 값이 부모 테이블에 실제로 존재하는가"를 강제로 검사합니다. 존재하지 않는
값을 넣으려고 하면 `FOREIGN KEY constraint failed` 에러로 막히는데, 이건 `03_queries.sql`의
무결성 검증 부분에서 직접 확인했던 바로 그 내용입니다.


> 출처: [Codyssey-B1/B6-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B6-1)