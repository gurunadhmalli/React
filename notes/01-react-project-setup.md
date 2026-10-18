# 01 - Setting Up a React Project (with Vite)

> `create-react-app` is deprecated. Vite is the modern standard for starting React projects.

## Step 1: Install Node.js

Download the **LTS** version from https://nodejs.org, then check it in a **new** terminal:

```powershell
node -v
npm -v
```

**Why:** the browser runs the final app, but Node is needed to install libraries, run the dev server, and build the app.

## Step 2: Create the project

```powershell
npm create vite@latest my-react-app -- --template react
```

- `npm create vite@latest` → runs Vite's project generator
- `my-react-app` → folder name (use `.` for the current folder)
- `-- --template react` → plain JavaScript React (use `react-ts` for TypeScript)

> ⚠️ **Windows PowerShell:** npm can swallow the `--`, so the template flag is ignored and you get the wrong template. Use `npx create-vite@latest my-react-app --template react` instead, or run `npm create vite@latest` with no flags and pick React → JavaScript from the menu.

## Step 3: Install dependencies

```powershell
cd my-react-app
npm install
```

**Why:** the generator only writes the list of libraries needed (`package.json`). This step downloads them into `node_modules/`.

## Step 4: Start the dev server

```powershell
npm run dev
```

Open `http://localhost:5173`. Save a file and the browser updates instantly (Hot Module Replacement). Stop with `Ctrl + C`.

## Step 5: Folder structure

```
my-react-app/
├── index.html          ← Single HTML page; React mounts into <div id="root">
├── package.json        ← Project name, scripts, dependency list
├── vite.config.js      ← Vite settings
├── public/             ← Static files served as-is
├── node_modules/       ← Installed libraries (never edit, never commit)
└── src/
    ├── main.jsx        ← Entry point: renders <App /> into #root
    ├── App.jsx         ← Main component, where you start coding
    ├── App.css         ← Styles for App
    └── index.css       ← Global styles
```

**Flow:** `index.html` → `main.jsx` → `<App />` → your UI

## Step 6: First component

```jsx
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Fun to learn React 🚀</h1>
      <button onClick={() => setCount(count + 1)}>
        Clicked {count} times
      </button>
    </div>
  )
}

export default App
```

- **Component** → a function that returns JSX (HTML-like syntax in JS)
- **State** → `useState(0)` creates a value React remembers between renders
- **Re-render** → calling `setCount` makes React redraw with the new value

## Step 7: Build for production

```powershell
npm run build     # creates an optimized dist/ folder
npm run preview   # serves that build locally to test it
```

Deploy `dist/` to Vercel, Netlify, GitHub Pages, etc.

## Quick reference

| Command | What it does |
|---|---|
| `npm create vite@latest <name> -- --template react` | Create the project |
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
