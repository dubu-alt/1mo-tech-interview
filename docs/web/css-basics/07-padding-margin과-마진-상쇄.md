---
title: "padding, margin과 마진 상쇄"
---

## padding과 margin 한 번에 지정하기

`padding`(안쪽 여백)과 `margin`(바깥 여백) 모두, 위/오른쪽/아래/왼쪽 값을 한 줄에 순서대로 적을 수 있습니다. 순서는 시계 방향으로 **상 → 우 → 하 → 좌**입니다.

```css
padding: 16px 8px 24px 10px;
```

이걸 방향별 속성으로 풀어 쓰면 완전히 같은 뜻입니다.

```css
padding-top: 16px;
padding-right: 8px;
padding-bottom: 24px;
padding-left: 10px;
```

`margin`도 똑같은 방식입니다.

```css
margin: 16px 8px 24px 10px;
/* 아래와 동일 */
margin-top: 16px;
margin-right: 8px;
margin-bottom: 24px;
margin-left: 10px;
```

## 마진 상쇄 (Margin Collapsing)

세로 방향(`margin-top`, `margin-bottom`) 마진은 서로 **더해지지 않고 겹칩니다**. 이웃한 두 요소의 세로 마진이 만나면, 두 값 중 **더 큰 값 하나만** 적용됩니다. 이걸 **마진 상쇄**라고 부릅니다.

원하는 만큼 세로 간격이 안 나온다면, 마진을 잘못 계산해서가 아니라 이 마진 상쇄 때문일 가능성이 높습니다.

### 부모-자식 사이에서도 발생

```html
<div id="a">a</div>
<div id="b">
  <div id="c">c</div>
  b
</div>
```

```css
#a { margin: 30px; }
#b { margin: 20px; }
#c { margin: 40px; }
```

`#b`와 `#c`는 부모-자식 관계입니다. `#b`에 테두리나 패딩이 따로 없으면, 자식 `#c`의 위쪽 마진(`40px`)이 부모 `#b`의 위쪽 마진(`20px`)과 겹쳐서 둘 중 큰 값인 `40px`이 적용됩니다. 이 `40px`이 다시 이웃한 `#a`의 아래쪽 마진(`30px`)과 겹치면서, 결국 `#a`와 `#b` 사이의 실제 간격은 `40px`이 됩니다.

단, 부모 요소에 `padding`이나 `border`가 있으면 부모-자식 사이의 마진 상쇄는 일어나지 않습니다. 세로 간격이 예상과 다르게 나온다면, 이 마진 상쇄 현상부터 의심해보면 됩니다.

> 참고: 개인 Notion 학습 노트
