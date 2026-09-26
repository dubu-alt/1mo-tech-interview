# REPL과 명령 파싱

```python
while True:
    line = input("mini-git> ")
    if line.strip().lower() in ("exit", "quit"):
        break
    tokens = smart_split(line)   # 따옴표 안 공백은 하나의 인자로
    run(tokens)
```

파싱 주의점:
- `COMMIT "Add login feature"` → `"Add login feature"`는 **따옴표째 하나의 인자**. 단순 `.split()`으로는 안 되고, 따옴표를 인식하는 분리 함수 필요
- 명령어 비교 전 `.upper()`로 통일 (대소문자 무시 요구사항)
- `--author=Alice`, `--sort-by=date` 같은 옵션은 `=` 기준으로 key/value 분리

---


> 출처: [Codyssey-B1/B5-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B5-2)