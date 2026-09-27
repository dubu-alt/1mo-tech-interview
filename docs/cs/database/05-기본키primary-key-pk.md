---
title: "기본키(Primary Key, PK)"
---

한 테이블 안에서 각 행을 유일하게 식별하는 값입니다. `NULL`이 될 수 없고, 중복될 수 없습니다.
이 프로젝트에서는 4개 테이블 모두 `INTEGER PRIMARY KEY AUTOINCREMENT`를 써서, 행을 추가할
때마다 SQLite가 1씩 증가하는 ID를 자동으로 채워줍니다.


> 출처: [Codyssey-B1/B6-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B6-1)