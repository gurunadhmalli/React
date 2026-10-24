# Custom Hooks in React

## First, what is a hook?

A **hook** is a special React function whose name starts with `use`.
Hooks let a component **remember things** and **do things** besides drawing UI.

You already know two built-in hooks:

| Hook        | What it does                                                    |
| ----------- | --------------------------------------------------------------- |
| `useState`  | Remembers a value. Changing it re-draws the component.         |
| `useEffect` | Runs code **after** the component appears, e.g. fetching data.  |

## What is a custom hook?

A **custom hook** is a function **you write** that uses other hooks inside it.
It packs a piece of logic into one place so any component can reuse it.

Think of it like this:

| Plain JavaScript                        | React                               |
| --------------------------------------- | ----------------------------------- |
| You write a helper function to reuse code. | You write a custom hook to reuse **hook logic**. |

Two rules make it a hook:

1. The name **must start with `use`**, e.g. `useCurrencyInfo`. React uses the name to check hook rules.
2. It **calls other hooks** (`useState`, `useEffect`, ...) inside it.

## Our custom hook: `src/hooks/useCurrencyInfo.js`

Job: "Give me a currency code, and I'll give you back today's exchange rates."

```js
import { useEffect, useState } from "react";

function useCurrencyInfo(currency) {
  // 1. A box to store the rates. Starts as an empty object {}.
  const [data, setData] = useState({});

  // 2. Fetch the rates. Runs again every time `currency` changes.
  useEffect(() => {
    fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`,
    )
      .then((res) => res.json())          // turn the response into a JS object
      .then((res) => setData(res[currency])) // save only the rates part
      .catch((err) => console.error("Failed to fetch currency data:", err));
  }, [currency]);

  // 3. Hand the rates back to whoever called the hook.
  return data;
}

export default useCurrencyInfo;
```

### Step by step

1. **`useState({})`** creates `data`. It starts empty because the rates haven't arrived yet.
   Starting with `{}` (not `undefined`) means `Object.keys(data)` won't crash on the first render.
2. **`useEffect(..., [currency])`** fetches the rates.
   The `[currency]` part is the **dependency array**: React runs the effect again only when `currency` changes.
3. **`setData(...)`** stores the rates. React then re-draws the component with the new data.
4. **`return data`** gives the rates to the component.

### What does the API send back?

For `usd` the API returns something like:

```json
{
  "date": "2026-10-24",
  "usd": { "inr": 94.78, "eur": 0.92, "gbp": 0.79 }
}
```

`res[currency]` means `res["usd"]`, which is just the rates object `{ inr: 94.78, eur: 0.92, ... }`.

## Using the hook: `src/App.jsx`

```jsx
import useCurrencyInfo from "./hooks/useCurrencyInfo";

function App() {
  const [from, setFrom] = useState("usd");

  const currencyInfo = useCurrencyInfo(from); // { inr: 94.78, eur: 0.92, ... }
  const options = Object.keys(currencyInfo);  // ["inr", "eur", ...]

  const convert = () => {
    setConvertedAmount(amount * currencyInfo[to]); // e.g. 10 * 94.78
  };
}
```

You call it like any function. `App` doesn't need to know **how** the rates are fetched.
That logic lives in the hook.

## What happens when the user changes the currency?

```
User picks "eur" in the From box
   ↓
setFrom("eur")              → App re-renders
   ↓
useCurrencyInfo("eur")      → currency changed, so useEffect runs again
   ↓
fetch .../eur.json
   ↓
setData(rates for eur)      → App re-renders with the new rates
```

## Why bother? (without vs with a custom hook)

**Without** a custom hook, all of this sits inside `App`:

```jsx
function App() {
  const [data, setData] = useState({});
  useEffect(() => {
    fetch(`.../${from}.json`).then(/* ... */);
  }, [from]);
  // ...plus all the other App code
}
```

**With** a custom hook, `App` gets one clean line:

```jsx
const currencyInfo = useCurrencyInfo(from);
```

Benefits:

- **Reusable**: any other component can call `useCurrencyInfo("inr")`.
- **Cleaner**: components focus on the UI, hooks handle the logic.
- **Easier to fix**: if the API changes, you edit one file.

## Rules of hooks (apply to custom hooks too)

1. **Only call hooks at the top level** of a component or another hook.
   Not inside `if`, loops, or nested functions.

   ```jsx
   // ❌ Wrong
   if (from) {
     const info = useCurrencyInfo(from);
   }

   // ✅ Right
   const info = useCurrencyInfo(from);
   ```

2. **Only call hooks from React components or other hooks**, not from plain JS functions.
3. **Name must start with `use`**. `currencyInfo()` won't be treated as a hook.

## Common beginner mistakes (all were in this project once!)

| Mistake                                          | Fix                                             |
| ------------------------------------------------ | ----------------------------------------------- |
| Using `setData` without `useState`               | Add `const [data, setData] = useState({})`      |
| Forgetting `[currency]` in `useEffect`           | Without it the fetch runs on **every** render   |
| Typo in the name, e.g. `useCurrencuinfo`         | Keep file name, function name and import the same |
| Importing from a path outside the project        | Import with `./hooks/useCurrencyInfo`           |

## Quick summary

- A custom hook is a function starting with `use` that uses other hooks.
- It takes inputs (`currency`) and returns outputs (`data`).
- It keeps logic out of components and lets you reuse it.
- `useState` stores the data, `useEffect` fetches it, `return` hands it back.
