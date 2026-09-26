# 참조 무결성(Referential Integrity)

"자식 테이블의 FK 값은 반드시 부모 테이블에 실제로 존재해야 한다"는 규칙입니다. SQLite는
이 검사가 기본적으로 꺼져 있어서, 모든 스크립트 맨 위에 `PRAGMA foreign_keys = ON;`을 켜야만
이 규칙이 실제로 동작합니다. 이걸 켜지 않으면 존재하지 않는 `user_id`로도 릴스가 그냥
삽입되어 버립니다.


> 출처: [Codyssey-B1/B6-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B6-1)