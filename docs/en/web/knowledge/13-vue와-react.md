---
title: "Vue.js vs. React"
sidebar: "Vue and React"
---

**Vue.js and React are both JavaScript UI libraries that build the screen out of components and automatically redraw it when the data changes.** Their goal is the same, but they differ sharply in "how you write the screen (templates vs. JSX)" and "how they notice that data has changed (reactivity)."

> VitePress, which this site is built with, is also built on Vue. The card list on the home page, the bottom dock and the search box are all Vue components.

## At a Glance

- Both libraries start from the idea that **"if you just change the data (state), the screen follows on its own."** They free developers from finding elements with `document.querySelector` and editing text one piece at a time.
- As an analogy, both are **self-updating scoreboards**.
  - **Vue** has a **sensor** attached to the scoreboard, so when you simply swap a number plate (data) by hand, the sensor notices and relights only the cells that use that number.
  - **React** requires you to press a **"please update" button** (a setter function). When the button is pressed, it recalculates that whole section of the board (the component), then actually changes only the cells that differ from the previous screen.

![A comparison image with the Vue.js and React logos side by side](/images/web/vue-react-1.png)

*Image source: [Medium - I built the exact same app in React and Vue](https://medium.com/@erwinousy/%EB%82%9C-react%EC%99%80-vue%EC%97%90%EC%84%9C-%EC%99%84%EC%A0%84%ED%9E%88-%EA%B0%99%EC%9D%80-%EC%95%B1%EC%9D%84-%EB%A7%8C%EB%93%A4%EC%97%88%EB%8B%A4-%EC%9D%B4%EA%B2%83%EC%9D%80-%EA%B7%B8-%EC%B0%A8%EC%9D%B4%EC%A0%90%EC%9D%B4%EB%8B%A4-5cffcbfe287f)*

## What They Have in Common

### Components

The screen is split into **reusable pieces (components)** such as buttons, cards and lists. Each component holds "appearance (HTML) + behavior (JS) + state (data)" together, and pages are completed by assembling them like LEGO blocks.

### Virtual DOM

Changing the real DOM is expensive because the browser has to redo layout calculation and painting. (See [How Browsers Work](/en/web/knowledge/01-브라우저-동작-원리).) So both libraries first build the screen structure as a **virtual DOM** made of JavaScript objects, compare it with the previous virtual DOM (diff), and apply **only the changed parts** to the real DOM.

```
Data changes
   │
   ▼
Create new virtual DOM ──▶ Compare with previous virtual DOM (diff)
                           │
                           ▼
                 Apply only the changed parts to the real DOM (patch)
```

The figure below shows the case where the selected item in a menu is deselected. Comparing the previous virtual DOM (left) with the new virtual DOM (center), only the first `li`'s `className` has changed, so in the real DOM (right) only `class="selected"` is removed. The other elements are left untouched.

![Virtual DOM diff: finding only the changed className between the old and new virtual DOM and applying it to the real DOM](/images/web/vue-react-virtual-dom.png)

*Image source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:React-example-virtual-dom-diff.svg) (CC BY-SA 4.0)*

### One-Way Data Flow

Data flows **only from parent components down to child components** (props in Vue, props in React too). If a child wants to change the parent's data, it does not modify it directly but signals "please change this" (an `emit` event in Vue, calling a function passed down by the parent in React). Fixing the flow in one direction like this makes it easy to track "who changed this value."

```
   [Parent]  Holds the state
     │ Passes values via props ▼        ▲ Requests changes via events (Vue) / callback functions (React)
   [Child]   Displays the received values on screen
```

> Vue's `v-model` looks like two-way binding, but it is really shorthand for "pass the value via props + request changes via an event." The data flow itself is one-way.

## Differences

### How You Write the Screen: Templates vs. JSX

Vue uses a **template** syntax close to HTML, and React uses **JSX**, which writes HTML-like markup inside JavaScript. Building the same counter both ways looks like this.

Vue 3 (Single File Component, Composition API):

```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">Clicked {{ count }} times</button>
</template>

<style scoped>
button { font-weight: bold; }
</style>
```

React (function component, Hooks):

```jsx
import { useState } from 'react'
import './Counter.css'

export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
  )
}
```

- Vue puts three sections, script, template and style, into a single `.vue` file. Loops and conditions are written with **directives** such as `v-for` and `v-if`.
- In React, the screen structure is also JavaScript, so loops use `map()` and conditions use `&&` or the ternary operator, **plain JavaScript syntax as is**.

### How Data Is Changed: Reactivity

| Category | Vue 3 | React |
| --- | --- | --- |
| Creating state | `ref()`, `reactive()` | `useState()` |
| Changing a value | Plain assignment (`count.value++`, `user.name = 'lee'`) | Call the setter (`setCount(count + 1)`) |
| How changes are detected | A `Proxy` watches reads/writes of values and notices automatically | Calling the setter marks it as "needs to be redrawn" |
| What runs again | Only the components that actually use the changed value | The entire component function that called the setter, plus its children |
| Reducing unnecessary recalculation | Dependency tracking is automatic, so mostly nothing to worry about | Optimize manually with `useMemo`, `useCallback`, `memo` (trending toward automation with React Compiler) |
| Modifying objects/arrays | Modifying directly is fine (`list.push(x)`) | You must create a new object/array and replace it (`setList([...list, x])`) |

The reason you should not modify an object directly in React is that React compares the old and new values with `Object.is`, and if they are "the same object," it decides nothing changed. Vue, on the other hand, has the Proxy catch the exact moment a value inside the object changes.

### Side-by-Side Comparison

| Category | Vue | React |
| --- | --- | --- |
| Nature | Closer to a framework (officially provides the Vue Router router and the Pinia state management library) | A library for drawing the screen (routing and state management are chosen from the ecosystem) |
| Screen syntax | Templates + directives (`v-if`, `v-for`) | JSX (JavaScript expressions) |
| Styles | Component-only CSS can be written with `style scoped` inside the `.vue` file | Choose an approach: importing CSS files, CSS Modules, CSS-in-JS, etc. |
| Changing state | Assignment is reflected automatically | Call a setter function, keep immutability |
| Starting a project | `npm create vue@latest` (Vite-based) | Start with a framework like Next.js, or with Vite |
| Server rendering framework | Nuxt | Next.js |
| Learning curve | Easy to get into if you know HTML/CSS | Your JavaScript skills show directly, but you get more freedom |

What server rendering (SSR) is is covered in the article [CSR and SSR](/en/web/knowledge/11-csr과-ssr).

## Getting a Feel Through Code: Building Both Kinds of Reactivity Yourself

Without any library, we imitate only the difference between the two approaches in plain JavaScript. Vue watches assignments with a `Proxy`, while React redraws only when you go through the setter function.

```js
// 1) The Vue way: "just change" the value and the render function runs again on its own (watched by a Proxy)
function reactive(obj, onChange) {
  return new Proxy(obj, {
    set(target, key, value) {
      target[key] = value
      onChange()          // The Proxy notices the value changed and redraws
      return true
    },
  })
}
const vueState = reactive({ name: 'kim' }, () => console.log('[Vue]   Screen:', `Hello, ${vueState.name}`))
vueState.name = 'lee'     // Plain assignment

// 2) The React way: you cannot change the value directly; you must call the setter to redraw
function useState(initial, render) {
  let value = initial
  const get = () => value
  const set = (next) => {
    if (Object.is(next, value)) return  // Do not redraw if the value is the same
    value = next
    render()
  }
  return [get, set]
}
const [getName, setName] = useState('kim', () => console.log('[React] Screen:', `Hello, ${getName()}`))
setName('lee')            // Call the setter
setName('lee')            // Same value, so no redraw
```

Output (Node.js):

```
[Vue]   Screen: Hello, lee
[React] Screen: Hello, lee
```

- On the Vue side, a plain assignment, `vueState.name = 'lee'`, was enough to run the render function. That is because the Proxy's `set` intercepted the assignment.
- On the React side, `setName('lee')` was called twice, but the screen was drawn only once. The second call was skipped because the value was the same (`Object.is`).
- Real Vue goes as far as recording "which screen read which value" and redraws only that screen, and real React collects multiple setter calls and redraws once (batching), among other refinements, but the basic principle is the same.

## Watch Out When Reading Older Material

Many comparison articles online are based on the era of Vue 2 and React class components. Here is how they differ from today's standard.

| Older explanation | Current standard |
| --- | --- |
| React changes state with `this.setState({ name: 'lee' })` | Function components + Hooks are standard instead of class components. `const [name, setName] = useState('kim')`, then `setName('lee')` |
| Vue changes state with `this.name = 'lee'` | In the Vue 3 Composition API, `const name = ref('kim')`, then `name.value = 'lee'` (`.value` is omitted inside templates) |
| In Vue, only properties declared up front in `data` are reactive | A limitation of Vue 2's `Object.defineProperty` approach. Vue 3 uses `Proxy` and also detects properties added later and array index changes |
| Projects are created with `vue-cli` or `create-react-app` | Both are effectively discontinued. Vue recommends `create-vue` (Vite), and React recommends a framework like Next.js, or Vite |
| Vue has no CSS files and React has CSS files | Both can use CSS files. The only difference is that Vue provides a built-in way to write scoped styles inside the component file |

## Interview Questions

**Q. Why use a virtual DOM?**
Changing the real DOM frequently forces the browser to repeat layout and painting, which slows things down. By first comparing before and after in the virtual DOM and applying only the changed parts to the real DOM, developers can just declare "what the final screen should look like" and leave the minimal DOM manipulation to the library.

**Q. What is the biggest difference between Vue and React?**
The reactivity approach. Vue automatically detects data changes with a Proxy and redraws only the places that use that value, while React reruns the component function when a setter is called and compares the result. The screen syntax also differs: templates in Vue, JSX in React.

**Q. What is one-way data flow?**
It is a structure where data flows from parent to child only through props, and the child requests changes from the parent through events or callbacks. Because the place that changes a value is fixed to one spot, bugs are easy to trace.

**Q. Why shouldn't you modify a state object directly in React?**
React decides whether something changed by comparing the old and new values by reference (`Object.is`). If you modify the same object directly, the reference stays the same, so React does not notice the change and the screen is not updated. That is why you create a new object and pass it to the setter.

**Q. Which do you choose in which situation?**
Teams familiar with HTML templates that want to build quickly, or that want to use the official tools (router, state management) as one set, often choose Vue. When a large ecosystem, the job market, and extensions like React Native matter, React is often chosen. There is no single right answer; the right choice depends on the team's situation.

## Summary

- Both sit on the same foundation: components, a virtual DOM and one-way data flow.
- **Vue**: template syntax; just assign a value to `ref`/`reactive` and the Proxy notices and redraws only where needed.
- **React**: JSX syntax; the component reruns only when you call the `useState` setter, and objects and arrays must be recreated and replaced.
- Material that mentions `this.setState`, `vue-cli` or `create-react-app` is based on older standards, so read it with Hooks and the Vue 3 Composition API in mind.
