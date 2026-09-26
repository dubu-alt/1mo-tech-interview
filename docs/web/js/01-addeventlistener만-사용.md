# `addEventListener`만 사용

HTML에는 `onclick` 같은 인라인 이벤트 속성이 없고, 모든 이벤트는 `main.js`의 `bindEvents()` 함수 안에서 `addEventListener`로 연결됩니다. `onclick`은 같은 이벤트에 하나만 등록할 수 있어 이후 코드가 덮어쓸 위험이 있는 반면, `addEventListener`는 같은 요소·같은 이벤트에 여러 핸들러를 안전하게 추가할 수 있고, HTML(구조)과 JS(동작)를 분리해 유지보수하기 쉽습니다.


> 출처: [Codyssey-B1/B1-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B1-1)