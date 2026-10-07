---
title: "Vue.js와 React의 차이"
sidebar: "Vue와 React"
---

**Vue.js와 React는 둘 다 화면을 컴포넌트 단위로 나눠 만들고, 데이터가 바뀌면 화면을 자동으로 다시 그려 주는 자바스크립트 UI 라이브러리입니다.** 목적은 같지만 "화면을 어떻게 적느냐(템플릿 vs JSX)"와 "데이터가 바뀐 걸 어떻게 알아채느냐(반응성)"에서 성격이 크게 갈립니다.

> 이 사이트를 만든 VitePress도 Vue로 만들어졌습니다. 홈 화면의 카드 목록, 하단 독, 검색창이 모두 Vue 컴포넌트입니다.

## 한눈에 보기

- 두 라이브러리 모두 **"데이터(상태)만 바꾸면 화면은 알아서 따라온다"** 는 생각에서 출발합니다. 개발자가 `document.querySelector`로 요소를 찾아 글자를 하나하나 고치던 방식에서 벗어나게 해 줍니다.
- 비유하면 둘 다 **자동 업데이트되는 전광판**입니다.
  - **Vue**는 전광판에 **센서**가 달려 있어서, 숫자 판(데이터)을 손으로 그냥 바꿔 끼우면 센서가 알아채고 그 숫자를 쓰는 칸만 다시 켭니다.
  - **React**는 **"바꿔 주세요" 버튼**(setter 함수)을 눌러야 합니다. 버튼이 눌리면 그 전광판 구역(컴포넌트)을 통째로 다시 계산한 뒤, 이전 화면과 달라진 칸만 실제로 바꿉니다.

![Vue.js와 React 로고를 나란히 놓은 비교 이미지](/images/web/vue-react-1.png)

*그림 출처: [Medium - 난 React와 Vue에서 완전히 같은 앱을 만들었다](https://medium.com/@erwinousy/%EB%82%9C-react%EC%99%80-vue%EC%97%90%EC%84%9C-%EC%99%84%EC%A0%84%ED%9E%88-%EA%B0%99%EC%9D%80-%EC%95%B1%EC%9D%84-%EB%A7%8C%EB%93%A4%EC%97%88%EB%8B%A4-%EC%9D%B4%EA%B2%83%EC%9D%80-%EA%B7%B8-%EC%B0%A8%EC%9D%B4%EC%A0%90%EC%9D%B4%EB%8B%A4-5cffcbfe287f)*

## 공통점

### 컴포넌트

화면을 버튼, 카드, 목록 같은 **재사용 가능한 조각(컴포넌트)** 으로 나눠 만듭니다. 컴포넌트 하나는 "생김새(HTML) + 동작(JS) + 상태(데이터)"를 함께 가지고 있어서, 레고 블록처럼 조립해 페이지를 완성합니다.

### 가상 DOM (Virtual DOM)

실제 DOM을 바꾸는 작업은 브라우저가 레이아웃 계산과 그리기를 다시 해야 해서 비용이 큽니다. ([브라우저 동작 원리](/web/knowledge/01-브라우저-동작-원리) 참고) 그래서 두 라이브러리 모두 화면 구조를 자바스크립트 객체로 된 **가상 DOM**으로 먼저 만들고, 이전 가상 DOM과 비교(diff)해서 **달라진 부분만** 실제 DOM에 반영합니다.

```
데이터 변경
   │
   ▼
새 가상 DOM 생성 ──▶ 이전 가상 DOM과 비교 (diff)
                           │
                           ▼
                 달라진 부분만 실제 DOM에 반영 (patch)
```

아래 그림은 메뉴에서 선택된 항목이 풀리는 경우입니다. 이전 가상 DOM(왼쪽)과 새 가상 DOM(가운데)을 비교하면 첫 번째 `li`의 `className`만 달라졌으므로, 실제 DOM(오른쪽)에서는 `class="selected"` 하나만 지웁니다. 나머지 요소는 건드리지 않습니다.

![가상 DOM 비교: 이전과 새 가상 DOM에서 달라진 className만 찾아 실제 DOM에 반영하는 모습](/images/web/vue-react-virtual-dom.png)

*그림 출처: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:React-example-virtual-dom-diff.svg) (CC BY-SA 4.0)*

### 단방향 데이터 흐름

데이터는 **부모 컴포넌트에서 자식 컴포넌트로만** 내려갑니다(Vue는 props, React도 props). 자식이 부모의 데이터를 바꾸고 싶으면 직접 고치지 않고 "바꿔 달라"고 알립니다(Vue는 이벤트 `emit`, React는 부모가 내려준 함수 호출). 이렇게 흐름을 한쪽으로 고정하면 "이 값을 누가 바꿨는지" 추적하기 쉬워집니다.

```
   [부모]  상태를 가지고 있음
     │ props로 값 전달 ▼        ▲ 이벤트(Vue) / 콜백 함수(React)로 변경 요청
   [자식]  받은 값을 화면에 표시
```

> Vue의 `v-model`은 양방향 바인딩처럼 보이지만, 실제로는 "props로 값 전달 + 이벤트로 변경 요청"을 짧게 써 주는 문법입니다. 데이터 흐름 자체는 단방향입니다.

## 차이점

### 화면을 적는 방식: 템플릿 vs JSX

Vue는 HTML에 가까운 **템플릿** 문법을 쓰고, React는 자바스크립트 안에 HTML 모양을 적는 **JSX**를 씁니다. 같은 카운터를 두 방식으로 만들면 다음과 같습니다.

Vue 3 (단일 파일 컴포넌트, Composition API):

```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}번 눌렀어요</button>
</template>

<style scoped>
button { font-weight: bold; }
</style>
```

React (함수 컴포넌트, Hooks):

```jsx
import { useState } from 'react'
import './Counter.css'

export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>{count}번 눌렀어요</button>
  )
}
```

- Vue는 `.vue` 파일 하나에 스크립트, 템플릿, 스타일 세 구역을 나눠 담습니다. 반복과 조건은 `v-for`, `v-if` 같은 **디렉티브**로 적습니다.
- React는 화면 구조도 자바스크립트이기 때문에 반복은 `map()`, 조건은 `&&`나 삼항 연산자처럼 **자바스크립트 문법 그대로** 씁니다.

### 데이터를 바꾸는 방식: 반응성

| 구분 | Vue 3 | React |
| --- | --- | --- |
| 상태 만들기 | `ref()`, `reactive()` | `useState()` |
| 값 바꾸기 | 그냥 대입 (`count.value++`, `user.name = 'lee'`) | setter 호출 (`setCount(count + 1)`) |
| 변경을 알아채는 방법 | `Proxy`가 값의 읽기/쓰기를 감시해서 자동으로 알아챔 | setter가 호출되면 "다시 그려야 한다"고 표시됨 |
| 다시 실행되는 범위 | 바뀐 값을 실제로 사용하는 컴포넌트만 | setter를 부른 컴포넌트 함수 전체와 그 자식들 |
| 불필요한 재계산 줄이기 | 의존성 추적이 자동이라 대부분 신경 쓸 필요 없음 | `useMemo`, `useCallback`, `memo`로 직접 최적화 (React Compiler로 자동화하는 추세) |
| 객체/배열 수정 | 직접 수정해도 됨 (`list.push(x)`) | 새 객체/배열을 만들어 교체해야 함 (`setList([...list, x])`) |

React에서 객체를 직접 고치면 안 되는 이유는, React가 이전 값과 새 값을 `Object.is`로 비교해서 "같은 객체"면 바뀌지 않았다고 판단하기 때문입니다. 반대로 Vue는 객체 안의 값이 바뀌는 순간을 Proxy가 직접 잡아냅니다.

### 항목별 비교

| 구분 | Vue | React |
| --- | --- | --- |
| 성격 | 프레임워크에 가까움 (라우터 Vue Router, 상태 관리 Pinia를 공식 제공) | 화면을 그리는 라이브러리 (라우터, 상태 관리는 생태계에서 골라 씀) |
| 화면 문법 | 템플릿 + 디렉티브 (`v-if`, `v-for`) | JSX (자바스크립트 표현식) |
| 스타일 | `.vue` 파일 안 `style scoped`로 컴포넌트 전용 CSS 작성 가능 | CSS 파일 import, CSS Modules, CSS-in-JS 등 방식을 골라 씀 |
| 상태 변경 | 대입하면 자동 반영 | setter 함수 호출, 불변성 유지 |
| 프로젝트 시작 | `npm create vue@latest` (Vite 기반) | Next.js 같은 프레임워크나 Vite로 시작 |
| 서버 렌더링 프레임워크 | Nuxt | Next.js |
| 학습 곡선 | HTML/CSS를 알면 진입이 쉬움 | 자바스크립트 실력이 그대로 드러남, 대신 자유도가 큼 |

서버 렌더링(SSR)이 무엇인지는 [CSR과 SSR](/web/knowledge/11-csr과-ssr) 글에서 다룹니다.

## 코드로 감 잡기: 두 가지 반응성을 직접 만들어 보기

라이브러리 없이 순수 자바스크립트로 두 방식의 차이만 흉내 내 봅니다. Vue는 `Proxy`로 대입을 감시하고, React는 setter 함수를 거쳐야만 다시 그립니다.

```js
// 1) Vue 방식: 값을 "그냥 바꾸면" 알아서 화면 함수가 다시 실행된다 (Proxy로 감시)
function reactive(obj, onChange) {
  return new Proxy(obj, {
    set(target, key, value) {
      target[key] = value
      onChange()          // 값이 바뀐 걸 Proxy가 눈치채고 다시 그림
      return true
    },
  })
}
const vueState = reactive({ name: 'kim' }, () => console.log('[Vue]   화면:', `안녕하세요, ${vueState.name}`))
vueState.name = 'lee'     // 그냥 대입

// 2) React 방식: 값은 직접 못 바꾸고, setter 함수를 불러야 다시 그린다
function useState(initial, render) {
  let value = initial
  const get = () => value
  const set = (next) => {
    if (Object.is(next, value)) return  // 같은 값이면 다시 그리지 않음
    value = next
    render()
  }
  return [get, set]
}
const [getName, setName] = useState('kim', () => console.log('[React] 화면:', `안녕하세요, ${getName()}`))
setName('lee')            // setter 호출
setName('lee')            // 같은 값이라 다시 그리지 않음
```

실행 결과 (Node.js):

```
[Vue]   화면: 안녕하세요, lee
[React] 화면: 안녕하세요, lee
```

- Vue 쪽은 `vueState.name = 'lee'` 라는 평범한 대입만으로 화면 함수가 실행됐습니다. Proxy의 `set`이 대입을 가로챘기 때문입니다.
- React 쪽은 `setName('lee')`를 두 번 불렀지만 화면은 한 번만 그려졌습니다. 두 번째는 값이 같아서(`Object.is`) 건너뛰었습니다.
- 실제 Vue는 "어떤 화면이 어떤 값을 읽었는지"까지 기록해서 그 화면만 다시 그리고, 실제 React는 여러 setter 호출을 모아서 한 번에 다시 그리는(batching) 등 훨씬 정교하지만 기본 원리는 같습니다.

## 예전 자료를 볼 때 주의할 점

인터넷에 있는 비교 글 중에는 Vue 2와 React 클래스 컴포넌트 시절 기준이 많습니다. 지금 기준과 다른 부분은 다음과 같습니다.

| 예전 설명 | 지금 기준 |
| --- | --- |
| React는 `this.setState({ name: 'lee' })`로 상태를 바꾼다 | 클래스 컴포넌트 대신 함수 컴포넌트 + Hooks가 표준. `const [name, setName] = useState('kim')` 후 `setName('lee')` |
| Vue는 `this.name = 'lee'`로 바꾼다 | Vue 3 Composition API에서는 `const name = ref('kim')` 후 `name.value = 'lee'` (템플릿 안에서는 `.value` 생략) |
| Vue는 처음 `data`에 선언한 속성만 반응형이다 | Vue 2의 `Object.defineProperty` 방식 한계. Vue 3는 `Proxy`를 써서 나중에 추가한 속성, 배열 인덱스 변경도 감지 |
| 프로젝트는 `vue-cli`, `create-react-app`으로 만든다 | 둘 다 사실상 지원 종료. Vue는 `create-vue`(Vite), React는 Next.js 같은 프레임워크나 Vite를 권장 |
| Vue는 CSS 파일이 없고 React는 CSS 파일이 있다 | 둘 다 CSS 파일을 쓸 수 있음. Vue는 컴포넌트 파일 안에 범위가 제한된 스타일을 쓰는 방법을 기본 제공한다는 차이일 뿐 |

## 면접에서 자주 나오는 질문

**Q. 가상 DOM은 왜 쓰나요?**
실제 DOM을 자주 바꾸면 브라우저가 레이아웃과 그리기를 반복해야 해서 느려집니다. 가상 DOM에서 변경 전후를 먼저 비교하고 달라진 부분만 실제 DOM에 반영하면, 개발자는 "최종 화면 모습"만 선언하고 최소한의 DOM 조작은 라이브러리에 맡길 수 있습니다.

**Q. Vue와 React의 가장 큰 차이는 무엇인가요?**
반응성 방식입니다. Vue는 Proxy로 데이터 변경을 자동으로 감지해서 그 값을 쓰는 곳만 다시 그리고, React는 setter 함수가 호출되면 해당 컴포넌트 함수를 다시 실행해 결과를 비교합니다. 화면 문법도 Vue는 템플릿, React는 JSX로 다릅니다.

**Q. 단방향 데이터 흐름이 무엇인가요?**
데이터가 부모에서 자식으로 props를 통해서만 내려가고, 자식은 이벤트나 콜백으로 부모에게 변경을 요청하는 구조입니다. 값을 바꾸는 주체가 한 곳으로 정해져 있어 버그를 추적하기 쉽습니다.

**Q. React에서 상태 객체를 직접 수정하면 안 되는 이유는 무엇인가요?**
React는 이전 값과 새 값을 참조 비교(`Object.is`)해서 변경 여부를 판단합니다. 같은 객체를 직접 고치면 참조가 그대로라 변경을 알아채지 못해 화면이 갱신되지 않습니다. 그래서 새 객체를 만들어 setter에 넘깁니다.

**Q. 어떤 상황에서 무엇을 고르나요?**
HTML 템플릿에 익숙한 팀이 빠르게 만들고 싶거나 공식 도구(라우터, 상태 관리)를 한 세트로 쓰고 싶다면 Vue, 큰 생태계와 채용 시장, React Native 같은 확장이 중요하다면 React를 많이 고릅니다. 정답은 없고 팀 상황에 따라 고르는 것이 맞습니다.

## 정리

- 둘 다 컴포넌트, 가상 DOM, 단방향 데이터 흐름이라는 같은 바탕 위에 있습니다.
- **Vue**: 템플릿 문법, `ref`/`reactive`에 값을 그냥 대입하면 Proxy가 알아채고 필요한 곳만 다시 그립니다.
- **React**: JSX 문법, `useState`의 setter를 불러야 컴포넌트가 다시 실행되며, 객체와 배열은 새로 만들어 교체해야 합니다.
- `this.setState`, `vue-cli`, `create-react-app`이 나오는 자료는 예전 기준이니 Hooks와 Vue 3 Composition API 기준으로 읽어야 합니다.
