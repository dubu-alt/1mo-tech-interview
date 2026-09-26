# 정렬 알고리즘 직접 구현하기 (merge sort)

`sorted()`, `list.sort()` 금지! 직접 만듭니다. 추천은 **병합 정렬(merge sort)**:

원리: "절반씩 쪼개서 각각 정렬한 뒤, 두 덩어리를 순서대로 섞기"

```
[38, 27, 43, 10]
   ├→ [38, 27] → [27, 38]
   └→ [43, 10] → [10, 43]
   섞기 → [10, 27, 38, 43]
```

```python
def merge_sort(items, compare):
    """compare 함수 기준으로 items를 정렬하는 병합 정렬"""
    if len(items) <= 1:
        return items                       # 원소 1개면 이미 정렬됨
    mid = len(items) // 2
    left = merge_sort(items[:mid], compare)   # 왼쪽 절반 정렬
    right = merge_sort(items[mid:], compare)  # 오른쪽 절반 정렬
    merged = []                            # 두 덩어리를 섞는 중
    i = j = 0
    while i < len(left) and j < len(right):
        if compare(left[i], right[j]) <= 0:  # 왼쪽이 작거나 같으면
            merged.append(left[i]); i += 1
        else:
            merged.append(right[j]); j += 1
    return merged + left[i:] + right[j:]     # 남은 것들 붙이기
```

설명용 지식 (과제 목표):
| 알고리즘 | 평균 | 최악 | 안정 정렬? |
|----------|------|------|-----------|
| merge sort | O(n log n) | O(n log n) | O (안정) |
| quick sort | O(n log n) | O(n²) | X |
| bubble sort | O(n²) | O(n²) | O |

**안정 정렬** = 값이 같은 원소끼리는 원래 순서가 유지되는 정렬.
비교 기준 교체: `compare = lambda a, b: a.timestamp - b.timestamp` 처럼 기준 함수만 바꿔서 같은 merge_sort 재사용.

---


> 출처: [Codyssey-B1/B5-2](https://github.com/dubu-alt/Codyssey-B1/tree/main/B5-2)