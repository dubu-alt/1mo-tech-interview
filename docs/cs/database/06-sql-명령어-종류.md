---
title: "SQL 명령어 종류 (DDL · DML · DQL)"
sidebar: "SQL 명령어 종류"
---

SQL 명령어는 하는 일에 따라 이렇게 나뉩니다.

| 구분 | 의미 | 이 프로젝트에서 |
|---|---|---|
| DDL (Data Definition Language) | 테이블 구조를 정의 | `CREATE TABLE`, `CREATE INDEX`, `DROP TABLE` -> `01_schema.sql` |
| DML (Data Manipulation Language) | 데이터를 조작 | `INSERT`, `UPDATE`, `DELETE` -> `02_sample_data.sql`, `03_queries.sql`의 Q15/Q16 |
| DQL (Data Query Language) | 데이터를 조회 | `SELECT` -> `03_queries.sql`의 대부분 |

## 정리

- DDL은 구조 정의(`CREATE`/`DROP`), DML은 데이터 조작(`INSERT`/`UPDATE`/`DELETE`), DQL은 조회(`SELECT`)입니다.

> 출처: [Codyssey-B1/B6-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B6-1)
