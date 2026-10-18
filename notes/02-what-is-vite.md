# 02 - What is Vite?

**Vite** (French for "fast", pronounced *"veet"*) is a **build tool and dev server**. It turns the code you write into something the browser can run.

## Why React needs a build tool

Browsers can't run React code as written:

- **JSX** (`<h1>Hello</h1>` inside JS) isn't valid JavaScript
- `import React from 'react'` points into `node_modules`, which browsers can't find
- Real projects have hundreds of files that should be **combined and compressed** before going live

A build tool **translates, connects, and optimizes** your code.

## What Vite does

### Dev server (`npm run dev`)
- Runs the app locally at `http://localhost:5173`
- **Hot Module Replacement (HMR):** on save, only the changed part updates, with no full reload and state kept
- Starts almost instantly, even in large projects

### Production build (`npm run build`)
- Bundles files into a few optimized files in `dist/`
- **Minifies** code (removes spaces, shortens names)
- **Tree-shaking:** removes code you never use

## Why it's fast

```
Old way (Webpack):   [bundle ALL files] ──► start server ──► browser
                       (slow, seconds to minutes)

Vite way:            start server instantly ──► browser asks for a file
                                               ──► Vite translates just that file
```

- In development, Vite uses the browser's built-in ES module support (`import`/`export`) and translates files only when requested
- Uses **esbuild** (written in Go) to handle JSX very fast
- For production it still bundles everything for best load speed

## Analogy

| Role | Analogy |
|---|---|
| **React** | Ingredients and recipe (your UI code) |
| **Vite** | Kitchen and chef: prepares, cooks, serves |
| **Browser** | Customer who eats the final dish |

React = the **library** you write with. Vite = the **tool** that runs and packages it.

## Summary

- Vite = fast build tool + dev server
- Translates JSX, connects imports, reloads instantly while coding
- Produces an optimized `dist/` folder for deployment
- Has replaced `create-react-app` as the standard React starter
