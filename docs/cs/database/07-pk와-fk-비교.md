# PK와 FK 비교

| 구분 | PK (기본키) | FK (외래키) |
|---|---|---|
| 역할 | 자기 테이블에서 각 행을 유일하게 식별 | 다른 테이블의 PK를 가리킴 |
| 중복 | 불가능 | 가능 (여러 자식 행이 같은 부모를 가리킬 수 있음) |
| NULL 허용 | 불가능 | 컬럼 설계에 따라 다름 (이 프로젝트는 전부 `NOT NULL`) |
| 테이블당 개수 | 보통 1개 | 여러 개 가능 (`likes`, `comments`는 FK가 2개씩) |


> 출처: [Codyssey-B1/B6-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B6-1)