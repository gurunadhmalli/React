# 04 - The Vite + React Project, Explained File by File

This note explains the project **exactly as `create-vite` generates it** (React + JavaScript template, Vite 8 / React 19), before you change anything: every file, what it's for, how the files connect, and why we use `.jsx`. A question bank is at the end.

---

## Part 1: Creating the project

```powershell
npm create vite@latest my-react-app
```

It asks:

```
◆ Project name:    my-react-app
◆ Select a framework:  Vanilla / Vue / ▶ React / Preact / Lit / Svelte / Solid / Qwik / ...
◆ Select a variant:    TypeScript / ▶ JavaScript / ...
```

Then:

```powershell
cd my-react-app
npm install      # download libraries → creates node_modules/ and package-lock.json
npm run dev      # start dev server → http://localhost:5173
```

### ⚠️ PowerShell gotcha (Windows)

The one-line version with flags:

```powershell
npm create vite@latest my-react-app -- --template react
```

In **PowerShell**, npm can swallow the `--`, so `--template react` gets ignored and you end up with the **wrong template** (for example vanilla TypeScript). npm warns: *"Unknown cli config --template"*. Safer on Windows:

```powershell
npx create-vite@latest my-react-app --template react
```

Or use the interactive version (no flags) and pick from the menu.

---

## Part 2: What files exist, and when

### Right after `npm create vite` (only the template)

```
my-react-app/
├── index.html            ← The one HTML page; loads src/main.jsx
├── package.json          ← Project info, scripts, dependency list
├── vite.config.js        ← Vite settings (enables the React plugin)
├── .oxlintrc.json        ← Linter rules (finds mistakes in code)
├── .gitignore            ← Files git should NOT track
├── README.md             ← Info about the template
├── public/               ← Static files, served as-is
│   ├── favicon.svg       ← Browser tab icon
│   └── icons.svg         ← SVG "sprite": many icons in one file
└── src/                  ← YOUR source code
    ├── main.jsx          ← Entry point: starts React
    ├── index.css         ← Global styles (whole page)
    ├── App.jsx           ← Root component (the starter page)
    ├── App.css           ← Styles for App
    └── assets/           ← Images imported in code
        ├── hero.png
        ├── react.svg
        └── vite.svg
```

### After `npm install`

```
├── node_modules/         ← React, Vite and hundreds of sub-packages
└── package-lock.json     ← Exact version of every installed package
```

### After `npm run build`

```
└── dist/                 ← Optimized files to deploy
    ├── index.html
    ├── favicon.svg, icons.svg          ← copied from public/
    └── assets/
        ├── index-[hash].js             ← all JSX + React, bundled & minified
        ├── index-[hash].css            ← index.css + App.css combined
        └── hero-[hash].png, react-[hash].svg, vite-[hash].svg
```

| Type | Files |
|---|---|
| **You write** | `src/**`, `public/**`, sometimes `index.html` |
| **You configure** | `package.json`, `vite.config.js`, `.oxlintrc.json`, `.gitignore` |
| **Generated, never edit by hand** | `node_modules/`, `package-lock.json`, `dist/` |

---

## Part 3: Every file explained

### `index.html`: the only HTML page

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>my-react-app</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

| Line | Purpose |
|---|---|
| `<!doctype html>` | Use modern HTML mode |
| `<meta charset="UTF-8">` | Supports all characters (emoji, Telugu, Hindi, ...) |
| `<link rel="icon" href="/favicon.svg">` | Tab icon, served from `public/` |
| `<meta name="viewport" ...>` | Makes the page fit phone screens properly |
| `<title>` | Text on the browser tab (change it!) |
| `<div id="root">` | **Empty box that React fills** with your whole UI |
| `<script type="module" src="/src/main.jsx">` | Loads your code. `type="module"` allows `import`/`export` |

- **Why only one HTML page?** React apps are **Single Page Applications (SPA)**: one page whose content JavaScript changes.
- **Why at the root, not in `public/`?** Vite uses `index.html` as the **entry point**. It processes it and follows the `<script>` to find all your code.

### `src/main.jsx`: the entry point

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

| Line | Purpose |
|---|---|
| `import { StrictMode } from 'react'` | Dev-only helper that finds bugs |
| `import { createRoot } from 'react-dom/client'` | Function that connects React to the browser page |
| `import './index.css'` | Loads **global** styles. Vite adds them to the page |
| `import App from './App.jsx'` | Brings in the root component |
| `document.getElementById('root')` | Finds the empty `<div id="root">` |
| `createRoot(...).render(...)` | "React, you own this div. Draw this inside it." |

- **`react` vs `react-dom`:** `react` = the core (components, hooks). `react-dom` = draws it in the **browser**. React Native uses the same `react` with a mobile renderer.
- **`<StrictMode>`:**
  - Works **only in development**, so production is unaffected.
  - It deliberately **renders components twice** and runs effects twice, to expose bugs such as missing cleanup.
  - That's why a `console.log` in a component prints **two times** in dev. This is normal.
- **Importing CSS in JS:** browsers can't do this, but Vite can. It converts the import into a `<style>` tag in dev, and into one `.css` file in the build.

### `src/App.jsx`: the root component (starter page)

Shortened to the important parts:

```jsx
import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>Edit <code>src/App.jsx</code> and save to test <code>HMR</code></p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <section id="next-steps">
        {/* "Documentation" and "Connect with us" link cards */}
        <svg className="icon" role="presentation" aria-hidden="true">
          <use href="/icons.svg#documentation-icon"></use>
        </svg>
        <a href="https://vite.dev/" target="_blank">Explore Vite</a>
        {/* ... GitHub, Discord, X.com, Bluesky links ... */}
      </section>
    </>
  )
}

export default App
```

This one file shows most React basics:

| Concept | Where | Meaning |
|---|---|---|
| **Component** | `function App() { return (...) }` | A function that returns UI (JSX) |
| **State** | `const [count, setCount] = useState(0)` | A value React remembers. `count` = current value, `setCount` = updates it and re-renders |
| **Event** | `onClick={() => ...}` | Runs code on click (camelCase, given a **function**) |
| **Updater function** | `setCount((count) => count + 1)` | Computes the new value from the **latest** value. Safer than `setCount(count + 1)` |
| **Expressions** | `Count is {count}` | `{ }` puts JavaScript inside JSX |
| **Importing images** | `import heroImg from './assets/hero.png'` | `heroImg` becomes a URL string. Vite optimizes it and adds a hash |
| **Attributes** | `src={heroImg}` | `{ }` passes a JS value, `"..."` passes plain text |
| **`className`** | `className="hero"` | JSX uses `className` because `class` is a JS keyword |
| **Fragment** | `<>...</>` | Groups the sections without adding an extra `<div>` |
| **Component CSS** | `import './App.css'` | Styles for this component (note: still global, not scoped) |
| **SVG sprite** | `<use href="/icons.svg#github-icon">` | Shows one icon from `public/icons.svg` by its id |
| **Accessibility** | `alt="React logo"`, `aria-hidden="true"` | Screen readers skip decorative icons and read the alt text |
| **Export** | `export default App` | Lets `main.jsx` import it |

**HMR test:** change `Get started` to something else and save. The page updates **without a reload**, and the counter keeps its number. That's Fast Refresh.

### `src/index.css`: global styles

- **Use:** styles for the **whole page**, imported once in `main.jsx`.
- **CSS variables** in `:root`, like `--text`, `--bg`, `--accent`, define colors and fonts once and are used everywhere as `var(--accent)`.
- **Dark mode:** `@media (prefers-color-scheme: dark)` swaps the variables when the computer is in dark mode.
- **`#root` styles:** center the app (`width: 1126px; margin: 0 auto`).
- Basic styles for `h1`, `h2`, `p`, `code`.

### `src/App.css`: styles for App

- **Use:** styles for the starter page: `.counter` button, `.hero` image stack, `#next-steps` cards, `.ticks` decorations.
- Uses modern **CSS nesting** (`&:hover { ... }` inside `.counter { ... }`).
- `@media (max-width: 1024px)` → **responsive**: different layout on smaller screens.
- ⚠️ Even though it's "App.css", it applies to the **whole page** once loaded. For truly scoped styles use **CSS Modules** (`App.module.css`).

### `src/assets/`: images used in code

- `hero.png`, `react.svg`, `vite.svg` are **imported** in `App.jsx`.
- **Why import instead of a plain path?** Vite:
  - checks the file exists (a typo = build error, not a broken image),
  - optimizes it (small files may be inlined into the code),
  - adds a **hash** to the name (`hero-CLDdwZDr.png`) so browsers never show an old cached version.

### `public/`: static files with fixed URLs

- Files are **copied unchanged** and served from `/`. For example, `public/favicon.svg` is available at `/favicon.svg`.
- `favicon.svg` → tab icon (used in `index.html`).
- `icons.svg` → a **sprite**: one file with many `<symbol id="github-icon">` etc. You show one with `<use href="/icons.svg#github-icon">`. One download covers all icons.
- **Use `public/` for:** favicon, `robots.txt`, files needing an exact name/URL.

### `package.json`: the project's ID card

```json
{
  "name": "my-react-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "oxlint",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.8",
    "react-dom": "^19.2.8"
  },
  "devDependencies": {
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.7",
    "@vitejs/plugin-react": "^6.1.1",
    "oxlint": "^1.81.0",
    "vite": "^8.3.0"
  }
}
```

| Field | Meaning |
|---|---|
| `private: true` | Stops you accidentally publishing to the npm registry |
| `type: "module"` | Use `import`/`export` in config files like `vite.config.js` |
| `scripts` | Shortcuts. `npm run dev` runs `vite` |
| `dependencies` | Needed by the **running app** (React) |
| `devDependencies` | Needed only to **develop/build** (Vite, linter, types) |

| Script | Does |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serves `dist/` locally to test the build |
| `npm run lint` | Checks code for mistakes |

- **`^19.2.8`** = "19.2.8 or newer, but still **19.x.x**". Minor and patch updates are allowed, 20.0.0 is not.
- **`@types/react`**: type definitions. Even in JavaScript, VS Code uses them for **autocomplete and hints**.
- **`@vitejs/plugin-react`**: lets Vite understand React (used in `vite.config.js`).

### `package-lock.json` (after `npm install`)

- Records the **exact** version of every package, including the packages your packages depend on.
- **Why:** `^19.2.8` could install different versions on different days. The lock file gives **everyone the identical setup**.
- **Commit it. Never edit by hand.**

### `vite.config.js`: Vite settings

```js
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

- `plugins: [react()]` → teaches Vite to convert **JSX** and enables **Fast Refresh**.
- `defineConfig` → only gives autocomplete in the editor.
- Common later additions: `server: { port: 3000 }`, path aliases (`@` → `src`), proxying API calls.

### `.oxlintrc.json`: linter rules

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "oxc"],
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

- **oxlint** = a very fast linter (written in Rust) that finds mistakes **without running the code**. Run with `npm run lint`.
- `$schema` → gives autocomplete for this file in VS Code.
- `rules-of-hooks` → **error** if hooks are used wrongly (for example `useState` inside an `if` or a loop).
- `only-export-components` → **warning** if a component file also exports non-components, which would break Fast Refresh.
- Older Vite templates used **ESLint** (`eslint.config.js`) for the same job.

### `.gitignore`: what git skips

| Entry | Why ignored |
|---|---|
| `node_modules` | Huge, recreated by `npm install` |
| `dist`, `dist-ssr` | Recreated by `npm run build` |
| `*.log` | Debug logs |
| `*.local` | Local secrets like `.env.local` |
| `.vscode/*` (except `extensions.json`), `.idea`, `.DS_Store` | Personal editor/OS files |

### `README.md`

- Template info: the two official React plugins, `@vitejs/plugin-react` (uses **Oxc**) and `@vitejs/plugin-react-swc` (uses **SWC**), how to add the **React Compiler**, and a TypeScript recommendation.
- In a real project, **replace it** with how to install, run and use *your* app.

### `node_modules/` and `dist/`

- `node_modules/` → never edit or commit it. If something breaks: delete it and run `npm install` again.
- `dist/` → **what you deploy** (Vercel, Netlify, GitHub Pages). Only updated by `npm run build`, so don't edit it by hand.

---

## Part 4: How it all connects

```
npm run dev  →  Vite starts at http://localhost:5173
        │
        ▼
index.html ── <div id="root"></div>  (empty)
        │     <script type="module" src="/src/main.jsx">
        ▼
main.jsx ──── import './index.css'          → global styles applied
        │     import App from './App.jsx'
        │     createRoot(#root).render(<StrictMode><App /></StrictMode>)
        ▼
App.jsx ───── import './App.css'            → component styles applied
        │     import heroImg, reactLogo, viteLogo from './assets/...'
        │     useState(0)                   → counter state
        │     <use href="/icons.svg#...">   → icons from public/
        ▼
Browser shows: hero image, "Get started", "Count is 0" button, link cards
        │
        ▼
Click button → setCount → React re-renders → "Count is 1"
```

**Behind the scenes:** when the browser asks for `main.jsx`, Vite's React plugin converts JSX → plain JS on the fly, and the browser runs it.

---

## Part 5: Why `.jsx` instead of `.js`?

### What JSX is

**JSX = JavaScript XML.** HTML-like syntax inside JavaScript:

```jsx
<button className="counter" onClick={handleClick}>Count is {count}</button>
```

Browsers **can't run it**. The build tool converts it into plain JavaScript:

```js
import { jsx as _jsx } from "react/jsx-runtime";
_jsx("button", { className: "counter", onClick: handleClick, children: ["Count is ", count] });
```

### Why use JSX?

| Plain JS | JSX |
|---|---|
| `_jsx("section", { children: [_jsx("h1", { children: "Get started" }), _jsx("button", {...})] })` | `<section><h1>Get started</h1><button>...</button></section>` |
| Hard to read and nest | Looks like HTML, easy to read |

JSX is **optional**, but almost every React project uses it.

### Why the `.jsx` extension?

1. **Vite expects it.** By default, JSX is converted only in `.jsx`/`.tsx` files. JSX inside `.js` gives an error.
2. **It makes the file's job clear.** `.jsx` = UI component, `.js` = plain logic (helpers, API calls, constants).
3. **Editor support.** VS Code picks the right highlighting, autocomplete and formatting.

**Rule:** returns JSX → `.jsx`. Pure logic → `.js`. (TypeScript: `.tsx` / `.ts`.)

### JSX rules

| Rule | Example |
|---|---|
| Return **one** parent element | Wrap in `<div>` or `<>...</>` |
| Close **every** tag | `<img />`, `<br />` |
| `class` → **`className`** | `<div className="hero">` |
| `for` → **`htmlFor`** | `<label htmlFor="email">` |
| Attributes in **camelCase** | `onClick`, `tabIndex` (but `aria-*` and `data-*` stay dashed) |
| JavaScript inside **`{ }`** | `{count}`, `src={heroImg}` |
| Comments | `{/* comment */}` |
| Components start with a **capital** | `<App />`, not `<app />` |
| Inline style is an **object** | `style={{ color: 'red', fontSize: 20 }}` |

---

## Part 6: Real-world setup habits

1. **Check Node first:** `node -v` (use an LTS version).
2. **On Windows/PowerShell** use `npx create-vite@latest name --template react` or the interactive menu (see Part 1).
3. **First thing after creating:** change `<title>` in `index.html`, clear out the starter content in `App.jsx`/`App.css`, replace `README.md`.
4. **Never commit** `node_modules/` or `dist/`. **Always commit** `package-lock.json`.
5. **Cloned a project?** Run `npm install`, then `npm run dev`.
6. **Weird errors?** Delete `node_modules` (and maybe `package-lock.json`), then run `npm install`.
7. **One component per file**, capitalized, file name = component name.
8. **Organize as it grows:** `src/components/`, `src/pages/`, `src/hooks/`, `src/utils/`.
9. **Keep `<StrictMode>`.** It catches bugs early.
10. **Run `npm run lint` and `npm run build`** before deploying.
11. **Secrets go in `.env.local`.** Only `VITE_`-prefixed variables reach the browser, and anything in front-end code is public, so never put real secret keys there.

---

## Part 7: Question bank 🧠

Try to answer each question before opening the answer.

### A. Setup

<details><summary><b>1. What does <code>npm create vite@latest</code> do? Does it install React?</b></summary>

It runs Vite's generator and **creates the template files**. It does **not** install anything: there's no `node_modules` until you run `npm install`.
</details>

<details><summary><b>2. Which files appear only after <code>npm install</code>?</b></summary>

`node_modules/` and `package-lock.json`.
</details>

<details><summary><b>3. On Windows PowerShell, <code>npm create vite@latest app -- --template react</code> gave a vanilla TypeScript project. Why?</b></summary>

PowerShell/npm swallowed the `--`, so npm treated `--template` as its own option and ignored it, and create-vite used its default. Use `npx create-vite@latest app --template react` or the interactive menu.
</details>

<details><summary><b>4. What's the default dev server URL?</b></summary>

`http://localhost:5173`. If the port is busy, Vite picks the next free one (5174, ...).
</details>

### B. File purpose

<details><summary><b>5. Which runs first: <code>index.html</code>, <code>main.jsx</code> or <code>App.jsx</code>?</b></summary>

**index.html → main.jsx → App.jsx.** The HTML's `<script>` loads `main.jsx`, which renders `App`.
</details>

<details><summary><b>6. Why is <code>index.html</code> in the root and not in <code>public/</code>?</b></summary>

Vite uses it as the app's **entry point**: it processes it and follows its `<script>`. `public/` files are only copied, never processed.
</details>

<details><summary><b>7. What's the difference between <code>index.css</code> and <code>App.css</code>?</b></summary>

`index.css` = global page styles (variables, dark mode, fonts), imported in `main.jsx`. `App.css` = styles for the App component, imported in `App.jsx`. Note: both end up **global**. Use CSS Modules for scoped styles.
</details>

<details><summary><b>8. Why is <code>hero.png</code> in <code>src/assets</code> but <code>favicon.svg</code> in <code>public/</code>?</b></summary>

`hero.png` is **imported in code**, so Vite checks it, optimizes it and adds a hash. `favicon.svg` is referenced by a **fixed URL** in `index.html` (`/favicon.svg`), so it must keep its exact name.
</details>

<details><summary><b>9. What is <code>icons.svg</code> and how is it used?</b></summary>

An **SVG sprite**: one file containing many icons as `<symbol id="...">`. `App.jsx` shows one with `<use href="/icons.svg#github-icon">`. One download serves all icons.
</details>

<details><summary><b>10. <code>dependencies</code> vs <code>devDependencies</code>?</b></summary>

`dependencies` = needed by the running app (`react`, `react-dom`). `devDependencies` = only for developing/building (`vite`, `oxlint`, `@vitejs/plugin-react`, `@types/*`).
</details>

<details><summary><b>11. Why keep <code>package-lock.json</code> if <code>package.json</code> already lists packages?</b></summary>

`package.json` has **ranges** (`^19.2.8`). The lock file stores **exact** versions so every machine installs the identical set.
</details>

<details><summary><b>12. What does <code>plugins: [react()]</code> do?</b></summary>

Lets Vite convert JSX and enables **Fast Refresh** (instant updates that keep component state).
</details>

<details><summary><b>13. What's <code>.oxlintrc.json</code> for?</b></summary>

Config for **oxlint**, which finds code mistakes without running the code, for example breaking the Rules of Hooks. Run it with `npm run lint`.
</details>

### C. Code in the template

<details><summary><b>14. What does <code>&lt;StrictMode&gt;</code> do, and why does my console.log print twice?</b></summary>

It's a **development-only** checker. It renders components (and runs effects) **twice on purpose** to expose bugs. Production renders once.
</details>

<details><summary><b>15. Explain <code>const [count, setCount] = useState(0)</code>.</b></summary>

Creates state with initial value `0`. `count` = current value, `setCount` = function to change it. Calling it makes React **re-render** the component with the new value.
</details>

<details><summary><b>16. Why <code>setCount((count) => count + 1)</code> instead of <code>setCount(count + 1)</code>?</b></summary>

The updater form always uses the **latest** value. If you call it several times in a row, each call builds on the previous one, so you avoid using an old value by mistake.
</details>

<details><summary><b>17. What does <code>heroImg</code> contain after <code>import heroImg from './assets/hero.png'</code>?</b></summary>

A **URL string** pointing to the image (like `/assets/hero-CLDdwZDr.png` after build), which is then used as `src={heroImg}`.
</details>

<details><summary><b>18. Why <code>onClick={() => setCount(...)}</code> and not <code>onClick={setCount(...)}</code>?</b></summary>

The second **calls** `setCount` immediately during render, which causes an infinite re-render loop. `onClick` needs a **function** that React calls later, on click.
</details>

<details><summary><b>19. What is <code>&lt;&gt;...&lt;/&gt;</code>?</b></summary>

A **Fragment**. It groups multiple elements so the component returns one parent, without adding an extra `<div>` to the page.
</details>

### D. JSX

<details><summary><b>20. Why does JSX need converting?</b></summary>

It's not valid JavaScript. Vite's React plugin turns `<h1>Hi</h1>` into `_jsx("h1", { children: "Hi" })`.
</details>

<details><summary><b>21. Why <code>.jsx</code> instead of <code>.js</code>?</b></summary>

(1) Vite only converts JSX in `.jsx`/`.tsx` by default. (2) It shows the file contains UI. (3) Better editor support.
</details>

<details><summary><b>22. Why <code>className</code> and not <code>class</code>?</b></summary>

JSX is JavaScript, and `class` is a reserved JS keyword.
</details>

<details><summary><b>23. Why must components start with a capital letter?</b></summary>

React treats `<app>` as an **HTML tag** and `<App>` as a **component**.
</details>

### E. "What happens if...?"

<details><summary><b>24. ...you delete <code>&lt;div id="root"&gt;</code>?</b></summary>

`getElementById('root')` returns `null`, so `createRoot` throws "Target container is not a DOM element" and the page is blank.
</details>

<details><summary><b>25. ...you remove <code>import './index.css'</code> from main.jsx?</b></summary>

The page loses global styles: no CSS variables, no dark mode, no centered layout. `App.css` still loads, but its `var(--accent)` etc. have no values.
</details>

<details><summary><b>26. ...you delete <code>src/assets/react.svg</code>?</b></summary>

Vite shows an **error** (failed to resolve import) because `App.jsx` imports it. This is the benefit of importing: you find out immediately instead of seeing a silent broken image.
</details>

<details><summary><b>27. ...you delete <code>public/icons.svg</code>?</b></summary>

**No error.** The icons just don't show, because it's only a URL and Vite doesn't check it.
</details>

<details><summary><b>28. ...you remove the Fragment and return two <code>&lt;section&gt;</code>s?</b></summary>

Syntax error: *"Adjacent JSX elements must be wrapped in an enclosing tag."*
</details>

<details><summary><b>29. ...you rename <code>App.jsx</code> to <code>App.js</code>?</b></summary>

Error: JSX isn't converted in `.js` files by default (and the import in `main.jsx` would also need updating).
</details>

<details><summary><b>30. ...you edit files inside <code>dist/</code>?</b></summary>

They get **overwritten** on the next `npm run build`. Always edit `src/`.
</details>

### F. Debugging

<details><summary><b>31. Cloned project: <code>npm run dev</code> says "'vite' is not recognized".</b></summary>

`node_modules` isn't in git. Run `npm install` first.
</details>

<details><summary><b>32. Blank page. Where do you look?</b></summary>

1. Terminal running `npm run dev`. 2. Browser DevTools Console (F12). 3. Check `<div id="root">` and the `<script src="/src/main.jsx">` path.
</details>

<details><summary><b>33. You changed code but <code>dist/</code> shows the old version.</b></summary>

`dist/` only updates with `npm run build`. The dev server serves `src/` directly and never writes to `dist/`.
</details>

### G. Interview-style

<details><summary><b>34. Walk through what happens from <code>npm run dev</code> to seeing the counter.</b></summary>

npm runs `vite` → dev server starts → browser loads `index.html` → it requests `/src/main.jsx` → Vite converts JSX on the fly → `main.jsx` loads `index.css` and calls `createRoot(#root).render(<StrictMode><App/></StrictMode>)` → `App` loads `App.css` and its images, sets up `useState(0)`, and returns JSX → React puts it in the DOM.
</details>

<details><summary><b>35. What does <code>npm run build</code> produce, and why are file names hashed?</b></summary>

`dist/` with bundled, minified JS and CSS plus optimized assets. Hashes change when content changes, so browsers fetch new files instead of old cached ones (cache busting).
</details>

<details><summary><b>36. Why did React move from create-react-app to Vite?</b></summary>

CRA (Webpack) bundled everything before starting, so it got slow as projects grew, and it's no longer maintained. Vite starts instantly by serving native ES modules and converting files only when requested.
</details>

<details><summary><b>37. What's the difference between <code>@vitejs/plugin-react</code> and <code>@vitejs/plugin-react-swc</code>?</b></summary>

Both let Vite handle React. They use different fast compilers: **Oxc** (default in this template) vs **SWC**. Either works for most projects.
</details>

### H. True or false

<details><summary><b>38. <code>npm create vite</code> creates <code>node_modules</code>.</b></summary>

**False.** Only `npm install` does.
</details>

<details><summary><b>39. StrictMode slows down your production site.</b></summary>

**False.** It does nothing in production.
</details>

<details><summary><b>40. Styles in <code>App.css</code> only affect the App component.</b></summary>

**False.** Plain CSS imports are global. Use CSS Modules (`*.module.css`) for scoping.
</details>

<details><summary><b>41. <code>public/favicon.svg</code> gets a hashed name after build.</b></summary>

**False.** `public/` files are copied unchanged.
</details>

<details><summary><b>42. <code>vite</code> belongs in <code>dependencies</code>.</b></summary>

**False.** It's a dev tool, so it belongs in `devDependencies`.
</details>

### I. Hands-on challenges 🛠️

1. Create a fresh project, run it, and change the `<title>` in `index.html`.
2. Change "Get started" and save: watch HMR keep the counter value.
3. Add `console.log('render')` in `App` and see it print twice (StrictMode). Then check `npm run build` + `npm run preview` prints once.
4. Add a **Reset** button that sets `count` back to `0`.
5. Delete `src/assets/vite.svg` and read the error. Then delete an icon id from `icons.svg` and notice there's **no** error.
6. Turn on dark mode in Windows and watch the colors change (from `index.css`).
7. Run `npm run build` and match each file in `dist/` to its source.
8. Create `src/components/Header.jsx` and use it in `App.jsx`.
