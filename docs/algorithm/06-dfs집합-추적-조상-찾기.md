# DFS/집합 추적 - 조상 찾기

`ANCESTORS <hash>`: 특정 커밋에서 **도달 가능한 모든 부모 쪽 커밋**을 전부 출력.

방법: hash에서 출발해 parents를 따라 쭉쭉 방문하면서, 방문한 적 없는 커밋마다 결과에 추가.

```python
def find_ancestors(start):
    """시작 커밋의 모든 조상을 모으는 함수 (BFS/DFS 아무거나)"""
    result = []
    visited = set()
    stack = [start]               # DFS는 줄 대신 스택(또는 재귀)
    while stack:
        cur = stack.pop()
        for p in cur.parents:
            if p.hash not in visited:
                visited.add(p.hash)
                result.append(p)
                stack.append(p)   # 부모의 부모도 계속 탐색
    return result
```

핵심은 **visited로 중복 방문 막기**. 브랜치가 합쳐진 그래프에서는 같은 조상에 여러 경로로 도달하기 때문입니다.

---


> 출처: [Codyssey-B1/B5-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B5-2)