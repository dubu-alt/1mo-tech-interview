---
title: "Contact 폼 유효성 검사"
---

`handleFormSubmit`은 `event.preventDefault()`로 기본 제출을 막은 뒤 `validateContactForm()`을 실행합니다. 이름/메시지는 빈 값 여부를, 이메일은 정규식(`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)으로 형식을 검사하고, 실패한 필드마다 `setFieldError`로 에러 메시지를 표시합니다. 현재는 **제출 시점에만** 검사가 실행되며, 입력 중 실시간 검사는 구현되어 있지 않습니다. 또한 현재 코드는 검증 통과 시 폼을 초기화하고 성공 메시지만 보여줄 뿐, 실제 이메일 전송(Formspree 등)으로 이어지는 `fetch` 호출은 아직 포함되어 있지 않습니다. 보너스 항목의 "폼 실제 전송"을 체크하려면 이 부분을 추가로 연결해야 합니다.


> 출처: [Codyssey-B1/B1-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B1-1)