---
title: "CSS 변수"
---

`base.css`의 `:root`에 색상, 폰트, 여백, radius, 그림자, transition 값을 변수로 정의했습니다. 다크 모드는 별도 색상 체계를 만드는 대신, `[data-theme="dark"]` 선택자 안에서 **같은 변수 이름**에 다른 값을 다시 할당하는 방식입니다. 그 결과 버튼, 카드, 폼 등 나머지 CSS는 다크 모드를 전혀 몰라도 되고, 변수 값만 바뀌면 화면 전체 색상이 자동으로 따라갑니다.


> 출처: [Codyssey-B1/B1-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B1-1)