# 브랜치와 HEAD - "지금 어디 작업 중?" 표시판

- **브랜치(branch)** = 어떤 커밋 하나를 가리키는 이름표. 병렬 작업용.
- **HEAD** = "내가 지금 서 있는 위치". 현재 체크아웃된 브랜치(또는 커밋)를 가리킴.

```
main      ──→ [c3 결제추가]
feature   ──→ [c2 로그인추가]
HEAD ──→ main
```

동작:
- `BRANCH feature`: 지금 HEAD가 보는 커밋을 feature도 함께 가리키게 함 (복사 X, 같은 커밋 공유)
- `SWITCH feature`: HEAD만 feature로 옮김
- `COMMIT`: 새 커밋을 만들고, 그 부모를 현재 HEAD 커밋으로 설정 + 현재 브랜치가 새 커밋을 가리키게 갱신

> 구현 팁: 커밋 조회가 빨라야 하니 "hash → 커밋 객체" 조회는 dict 사용 가능합니다.

---


> 출처: [Codyssey-B1/B5-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B5-2)