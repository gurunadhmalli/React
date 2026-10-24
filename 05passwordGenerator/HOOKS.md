# React Hooks: useState, useCallback, useEffect, useRef

Notes from the **Password Generator** project ([src/App.jsx](src/App.jsx)).

A **hook** is a special React function (its name always starts with `use`) that lets a component *remember things*, *react to changes*, or *reach into the DOM*.

**Rules of hooks:**
1. Call hooks only at the **top level** of a component, never inside `if`, loops or nested functions.
2. Call hooks only inside **React components** (or custom hooks), not in plain JS functions.

---

## How the four hooks work together

```
User moves slider / ticks a checkbox
        │
        ▼
  useState value changes  (length, numbersAllowed, charactersAllowed)
        │
        ▼
  useCallback creates a NEW passwordGenerator (because its dependencies changed)
        │
        ▼
  useEffect notices passwordGenerator changed  ──►  runs it
        │
        ▼
  setPassword(newPass)  ──►  re-render  ──►  input shows new password
        │
 User clicks "copy"
        │
        ▼
  useRef (passwordRef) points at the input  ──►  select text + copy to clipboard
```

---

## 1. `useState`: remembering values

### What it is
`useState` gives a component a value that **survives re-renders**. When you update it, React **re-renders** the component so the UI shows the new value.

### Syntax
```js
const [value, setValue] = useState(initialValue);
```
- `value`: the current value
- `setValue`: the function to change it
- `initialValue`: used only on the first render

### Why not a normal variable?
```js
let length = 8;
length = 12;   // ❌ the value changes but React doesn't know, so the screen is NOT updated
               // ❌ and on the next render it resets to 8 anyway
```
```js
const [length, setLength] = useState(8);
setLength(12); // ✅ React stores 12 and re-renders the UI
```

### In this project
```js
const [length, setLength] = useState(8);                       // slider value
const [numbersAllowed, setNumbersAllowed] = useState(false);   // "Numbers" checkbox
const [charactersAllowed, setCharactersAllowed] = useState(false); // "Characters" checkbox
const [password, setPassword] = useState("");                  // the generated password
```

### Updating from the previous value
```js
onChange={() => setNumbersAllowed((prev) => !prev)}
```
Passing a **function** to the setter gives you the latest previous value (`prev`). Use this whenever the new value depends on the old one (toggles, counters).

### Controlled inputs
```js
<input type="range" value={length} onChange={(e) => setLength(Number(e.target.value))} />
<input type="checkbox" checked={numbersAllowed} onChange={...} />
```
The input shows the state (`value` / `checked`) and updates the state (`onChange`), so state is the **single source of truth**.
`e.target.value` is always a **string**, so `Number(...)` converts it.

---

## 2. `useCallback`: remembering a function

### 🟢 Simple version: 3 facts

**Fact 1️⃣: React runs your `App()` function again and again.**
Every time state changes (slider moves, checkbox ticks), React runs `App()` **again from the first line to the last line**. It's like pressing **refresh** on the component.

**Fact 2️⃣: Every refresh makes the function again.**
```js
const passwordGenerator = () => { ... };
```
This line runs on each refresh, so React gets a **new** `passwordGenerator`. Same code, but new.
Like buying a new pen every day: same type of pen, but a different pen.

**Fact 3️⃣: `useEffect` runs again if anything in `[ ]` is new.**
```js
useEffect(() => {
  passwordGenerator();
}, [passwordGenerator]);
```
`useEffect` asks one question: **"Is `passwordGenerator` new?"** If it's new, it runs. If it's the same, it does nothing.

**Put them together (without `useCallback`):**
```
refresh → new function (Fact 2) → useEffect sees something new → runs (Fact 3)
→ new password → state changes → refresh (Fact 1) → new function → runs → … never stops 🔁
```

**`useCallback` = "don't make a new one"**
```js
const passwordGenerator = useCallback(() => { ... }, [length, numbersAllowed, charactersAllowed]);
```
This tells React: *"Don't make a new function on refresh. Keep the old one. Only make a new one if `length`, `numbersAllowed` or `charactersAllowed` changed."*

- Refresh with nothing changed → same function → `useEffect` stays quiet ✅
- Slider moved → new function → `useEffect` runs → new password ✅

> **One sentence:** `useCallback` = "React, keep this function the same until these values change."

#### 💡 It's also fine to skip it for now
You can build the same app **without** `useCallback` by putting the password code directly inside `useEffect`:
```js
useEffect(() => {
  let pass = "";
  let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  if (numbersAllowed) str += "0123456789";
  if (charactersAllowed) str += "!@#$%^&*-_+=[]{}~`";
  for (let i = 0; i < length; i++) {
    pass += str.charAt(Math.floor(Math.random() * str.length));
  }
  setPassword(pass);
}, [length, numbersAllowed, charactersAllowed]);
```
`useState`, `useEffect` and `useRef` are the important ones to learn first. `useCallback` usually makes sense later, once re-renders feel natural.

#### 🧪 See it for yourself
1. Add `console.log("effect ran");` inside the `useEffect` in [src/App.jsx](src/App.jsx).
2. Run `npm run dev`, open the browser console (F12) and move the slider. You'll see **one** log per change.
3. Change `useCallback(() => { ... }, [...])` to a plain `() => { ... }` and reload. The logs never stop and the password flickers. That's the infinite loop.
4. Put `useCallback` back and it stops.

---

### 🔵 Detailed version

### The problem it solves

#### a) "The whole component function re-runs"
A component is just a JavaScript function:

```js
function App() {
  const [length, setLength] = useState(8);

  const passwordGenerator = () => { ... };

  return <div>...</div>;
}
```

To show it on screen, React **calls** `App()`. Whenever state changes, React calls `App()` **again from the top**. That's a **re-render**.

```
First load      → React calls App()   (render 1)
Move slider     → React calls App()   (render 2)
Tick checkbox   → React calls App()   (render 3)
```

Every line inside `App` runs again on each call, including:
```js
const passwordGenerator = () => { ... };
```
So the function is **built again on every render**.

#### b) "A brand-new object"
In JavaScript, **functions are objects**. Two functions with exactly the same code are still **two different objects** in memory:

```js
const a = () => console.log("hi");
const b = () => console.log("hi");

a === b   // false ❌  same code, but two different objects
```

Think of two photocopies of the same page: same content, but two separate sheets of paper.

The same thing happens across renders:
```
render 1 → passwordGenerator = function #1
render 2 → passwordGenerator = function #2   (new copy)
render 3 → passwordGenerator = function #3   (new copy)

function #1 === function #2  →  false
```

#### c) Why that matters
`useEffect` decides whether to run by comparing each dependency with its value from the last render, using `===`:

```js
useEffect(() => {
  passwordGenerator();
}, [passwordGenerator]);
```

**Without `useCallback`:**
```
render 1: function #1 → effect runs → setPassword → re-render
render 2: function #2 → #1 === #2? false → effect runs again → setPassword → re-render
render 3: function #3 → false → runs again...  🔁 infinite loop
```

**With `useCallback`:**
```
render 1: function #1 → effect runs → setPassword → re-render
render 2: length unchanged → React returns the SAME function #1
          #1 === #1? true → effect does NOT run ✅ (loop stops)

move slider → length changed → React makes function #2
          #1 === #2? false → effect runs → new password ✅
```

> **In one line:** each render calls `App()` again, so every function inside it is rebuilt as a new copy. `useCallback` tells React to **keep the old copy** unless the values in `[ ]` have changed, so `useEffect` only runs when a setting really changes.

### What it does
`useCallback` returns the **same function** between renders and only creates a new one when something in the dependency array changes.

### Syntax
```js
const fn = useCallback(() => {
  // function body
}, [dep1, dep2]);
```

### In this project
```js
const passwordGenerator = useCallback(() => {
  let pass = "";
  let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  if (numbersAllowed) str += "0123456789";
  if (charactersAllowed) str += "!@#$%^&*-_+=[]{}~`";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * str.length); // 0 … str.length - 1
    pass += str.charAt(index);
  }

  setPassword(pass);
}, [length, numbersAllowed, charactersAllowed]);
```
In plain words: *"Remember how to build a password. Only update this recipe when the length, numbers or characters setting changes."*

`setPassword` doesn't need to be a dependency because React guarantees setter functions never change.

```js
const copyPasswordToClipboard = useCallback(() => {
  passwordRef.current?.select();
  passwordRef.current?.setSelectionRange(0, 101);
  window.navigator.clipboard.writeText(password);
}, [password]);
```
It depends on `password` because it copies that value.

### ⚠️ Stale values
If you **forget** a dependency, the function keeps using the **old** value it saw when it was created.
Example: leave out `length` and the password stays 8 characters long even after you move the slider.
**Rule:** every state/prop used inside the function goes into the array.

### Remember
- `useCallback` **does not run** the function. It only **stores** it.
- It's usually an **optimization**. But here it's **required**: `passwordGenerator` is a `useEffect` dependency, so without `useCallback` the effect would loop forever (see above).

---

## 3. `useEffect`: running code after a render

### 🟢 Simple version: 3 facts

**Fact 1️⃣: `useEffect` = "do this job after the screen is shown".**
```js
useEffect(() => {
  passwordGenerator();
}, [passwordGenerator]);
```
React first draws the page (slider, checkboxes, input box). **Then** it runs the code inside `useEffect`.
Like a shop: first open the doors (show the page), then start the work (make a password).

**Fact 2️⃣: The `[ ]` is a watch list.**
```js
}, [length, numbersAllowed, charactersAllowed]);
```
React reads it as: *"Watch these values. If any of them changes, do the job again."*
Like a guard 👮 watching three things: the slider, the Numbers checkbox and the Characters checkbox.

- Slider moved → `length` changed → job runs → new password ✅
- Numbers ticked → `numbersAllowed` changed → job runs → new password ✅
- Nothing changed → guard does nothing ✅

**Fact 3️⃣: The watch list decides how often it runs.**

| What you write | Meaning | When it runs |
|---|---|---|
| `useEffect(fn)` | no watch list | after **every** refresh ⚠️ |
| `useEffect(fn, [])` | empty watch list | **only once**, when the page first loads |
| `useEffect(fn, [a, b])` | watch `a` and `b` | once at the start, then **whenever `a` or `b` changes** |

In the password generator we use the third one.

**Why not just call the function directly?**
```js
function App() {
  ...
  passwordGenerator();   // ❌ runs on every refresh
  return (...);
}
```
```
refresh → passwordGenerator() → setPassword → state changed → refresh
→ passwordGenerator() → setPassword → refresh → … never stops 🔁
```
`useEffect` with a watch list fixes this. It runs the job **only when something on the list changes**, not on every refresh.

**Put it together for the password generator:**
```
Page loads        → screen shown → useEffect runs → first password ✅
Move the slider   → length changes → useEffect runs → new password ✅
Tick "Numbers"    → numbersAllowed changes → useEffect runs → new password ✅
Click "copy"      → nothing on the watch list changed → useEffect does nothing ✅
```
That's why there's **no "Generate" button**. `useEffect` does it for you automatically.

> **One sentence:** `useEffect` = "After showing the screen, do this job, and do it again whenever something on my watch list changes."

#### 🧪 Try it
Add this inside the `useEffect` in [src/App.jsx](src/App.jsx):
```js
console.log("new password made, length =", length);
```
Run `npm run dev` and open the console (F12):
- You'll see one log on page load.
- Moving the slider or ticking a checkbox adds a log.
- Clicking **copy** adds nothing, because it isn't on the watch list.

---

### 🔵 Detailed version

### What it is
`useEffect` runs **side effects**, meaning work that isn't just "return some JSX": fetching data, timers, subscriptions, talking to the DOM, or (here) generating a password when settings change.

### Syntax
```js
useEffect(() => {
  // effect code
  return () => {
    // optional cleanup (runs before the next effect / when the component is removed)
  };
}, [dependencies]);
```

### When does it run?
| Dependency array | Runs when |
|------------------|-----------|
| *(none)* `useEffect(fn)` | after **every** render |
| `[]` | **once**, after the first render |
| `[a, b]` | after the first render, then **whenever `a` or `b` changes** |

### In this project
```js
useEffect(() => {
  passwordGenerator();
}, [passwordGenerator]);
```
- On first load → a password is generated immediately (no button needed).
- `passwordGenerator` only changes when `length`, `numbersAllowed` or `charactersAllowed` change (thanks to `useCallback`).
- So: **change a setting → new function → effect runs → new password.**

> Many tutorials write `[length, numbersAllowed, charactersAllowed, passwordGenerator]`. That works too, but `[passwordGenerator]` is enough because the function already depends on those values.

### ⚠️ Infinite loop trap
```js
useEffect(() => {
  setPassword(Math.random().toString());
}); // ❌ no dependency array: set state → re-render → effect again → forever
```
Always give a dependency array unless you really want "every render".

### `useCallback` vs `useEffect`
| | `useCallback` | `useEffect` |
|--|--|--|
| Purpose | **Stores** a function | **Runs** code |
| Returns | the memoized function | nothing (optionally a cleanup) |
| When the body runs | only when *you* call it | automatically after render, when deps change |

---

## 4. `useRef`: a reference to a DOM element (or any value)

### What it is
`useRef` returns an object `{ current: ... }` that:
- **persists** between renders, and
- **does not trigger a re-render** when you change `.current`.

Its most common use is getting a handle on a real HTML element, React's version of `document.getElementById()`.

### Syntax
```js
const myRef = useRef(initialValue);
<input ref={myRef} />
// after render: myRef.current === the actual <input> DOM element
```

### In this project
```js
const passwordRef = useRef(null);

<input value={password} readOnly ref={passwordRef} />
```
Then in the copy function:
```js
passwordRef.current?.select();                  // highlight the text so the user SEES it was copied
passwordRef.current?.setSelectionRange(0, 101); // select up to 101 characters (max length is 100)
window.navigator.clipboard.writeText(password); // the actual copy
```
- `?.` (optional chaining) means "only call this if `current` isn't `null`". That avoids a crash if the element isn't on screen yet.
- The **copy itself** uses the `password` state. The ref is used for the **visual selection**.

### `useRef` vs `useState`
| | `useState` | `useRef` |
|--|--|--|
| Persists between renders | ✅ | ✅ |
| Changing it re-renders the UI | ✅ | ❌ |
| Typical use | data shown on screen | DOM elements, timers, previous values |

---

## Quick summary

| Hook | One-line job | In the password generator |
|------|--------------|---------------------------|
| `useState` | Remember a value and re-render when it changes | length, checkboxes, password |
| `useCallback` | Remember a function until its dependencies change | `passwordGenerator`, `copyPasswordToClipboard` |
| `useEffect` | Run code after render when dependencies change | auto-generate a password when settings change |
| `useRef` | Hold a reference without re-rendering | select the password input before copying |

---

## Bugs fixed compared to the tutorial version

1. **Off-by-one in the random index**
   ```js
   Math.floor(Math.random() * str.length + 1) // ❌ can return str.length → charAt gives "" → password too short; "A" never picked
   Math.floor(Math.random() * str.length)     // ✅ 0 … str.length - 1
   ```
2. **Slider value is a string.** `setLength(Number(e.target.value))` keeps `length` a number.
3. **Checkboxes** use `checked={...}` (controlled) instead of `defaultChecked`, so the UI always matches state.
