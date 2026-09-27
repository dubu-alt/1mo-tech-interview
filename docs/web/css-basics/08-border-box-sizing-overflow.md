---
title: "border, box-sizing, overflow"
---

## border와 border-radius

`border`는 요소에 테두리(선)를 만드는 속성입니다.

```css
.box {
  border: 2px solid #333333;
  /*      두께 스타일 색 */
}
```

모서리를 둥글게 만들고 싶으면 `border-radius`를 씁니다.

```css
.box {
  border-radius: 12px;
}
```

`border`와 `border-radius`는 카드, 버튼 등 어디서나 자주 쓰이는 속성이니 꼭 기억해두는 게 좋습니다.

## box-sizing

박스 모델에서 `width`/`height`는 **기본적으로 content 영역만**의 크기를 뜻합니다. 즉, `width: 200px`이라고 지정해도 여기에 `padding`과 `border`가 더해지면 실제 박스는 200px보다 커집니다.

```css
.box {
  width: 200px;
  padding: 20px;
  border: 5px solid black;
  /* 실제 너비 = 200 + 20*2 + 5*2 = 250px */
}
```

레이아웃을 짤 때 이 계산 때문에 예상보다 박스가 커져서 배치가 틀어지는 문제가 자주 생깁니다. 이럴 때 `box-sizing: border-box;`를 지정하면, `width`/`height`가 **padding과 border까지 포함한** 전체 크기를 뜻하게 바뀝니다.

```css
.box {
  box-sizing: border-box;
  width: 200px; /* padding, border 포함해서 실제로 딱 200px */
  padding: 20px;
  border: 5px solid black;
}
```

결론적으로, 레이아웃 계산을 훨씬 예측하기 쉬워지기 때문에 `box-sizing: border-box`를 기본값처럼 깔고 시작하는 경우가 많습니다.

## overflow

긴 내용을 작은 박스(컨테이너)에 담으면, 내용이 박스 밖으로 삐져나오는 현상이 생길 수 있습니다. 이걸 **오버플로우(overflow)**라고 합니다. `overflow` 속성으로 이 넘치는 내용을 어떻게 처리할지 정할 수 있습니다.

```css
.container {
  overflow: hidden;  /* 넘치는 부분을 잘라서 숨김 */
  /* 또는 */
  overflow: scroll;  /* 스크롤을 만들어서 넘긴 부분을 볼 수 있게 함 */
}
```

가로 스크롤을 만들고 싶다면 `overflow-x`를 활용하면 됩니다. 참고로 마우스 사용자는 **Shift** 키를 누른 채 휠을 돌리면 가로 스크롤을 조작할 수 있습니다. 약관처럼 긴 텍스트를 작은 박스 안에 깔끔하게 담을 때 실무에서 자주 쓰는 기법입니다.

> 참고: 개인 Notion 학습 노트
