# TTL - 데이터의 유통기한

**TTL (Time To Live)** = 키에 만료 시간을 설정하는 기능.

- `EXPIRE user:2 3` → user:2는 지금부터 3초 후 만료 예약 (힙에 `(만료시각, 키)` push)
- 키 조회 시점에 **먼저 만료 여부 검사**: `time.time() >= expire_at`이면 삭제 후 없는 키처럼 처리
- 힙에 쌓인 오래된 항목은 나중에 pop될 때 "이미 삭제된 키면 무시"하는 방식(lazy deletion)으로 처리 가능

TTL 코드 반환값 규칙 (헷갈리기 쉬움):
| 상황 | 반환 |
|------|------|
| 키 없음 | `(integer) -2` |
| 키 있는데 만료 설정 없음 | `(integer) -1` |
| 남은 초 | `(integer) N` |

---


> 출처: [Codyssey-B1/B5-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B5-1)