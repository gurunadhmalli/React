# 03 - Next.js and `npx create-next-app@latest`

`npx create-next-app@latest` creates a new project using **Next.js**, a **framework built on top of React**.

## Breaking down the command

| Part | Meaning |
|---|---|
| `npx` | Downloads and runs a package **once**, without installing it permanently (comes with npm) |
| `create-next-app` | Official project generator for Next.js |
| `@latest` | Use the newest version |

It asks setup questions (TypeScript? ESLint? Tailwind? `src/` folder? App Router? Turbopack? import alias?), then:

```powershell
cd my-app
npm run dev      # opens at http://localhost:3000
```

## What is Next.js?

**React** alone only handles the **UI** (components, state, rendering). Everything else you set up yourself.

**Next.js = React + the extras most real websites need**, already configured:

| Feature | React + Vite | Next.js |
|---|---|---|
| Components and state | ✅ | ✅ |
| **Routing** (multiple pages) | ❌ Add `react-router` | ✅ Built in, based on folders |
| **Server-side rendering** | ❌ | ✅ |
| **SEO** | ⚠️ Weaker | ✅ Strong |
| **Backend API routes** | ❌ Separate server | ✅ Same project |
| Image and font optimization | ❌ | ✅ |
| Learning difficulty | 🟢 Simpler | 🟡 More concepts |

## Folder-based routing

```
app/
├── page.jsx              →  /
├── about/
│   └── page.jsx          →  /about
└── blog/
    └── [id]/
        └── page.jsx      →  /blog/1, /blog/2, ...
```

## Client vs. server rendering

- **Vite + React (client-side):** the browser gets an empty HTML page, downloads JS, then React builds the page. Slower first view, harder for search engines.
- **Next.js (server-side):** the server sends **fully built HTML**, so the page shows faster and is SEO-friendly. React then makes it interactive ("hydration").

## Which to use?

- **Learning React → Vite.** Pure React, fewer concepts at once.
- **Real websites with pages/SEO/backend → Next.js.**

```
JavaScript basics → React (with Vite) → React Router → Next.js
```

## Summary

- `npx` = run a package once without installing
- `create-next-app@latest` = scaffold a Next.js project
- **Next.js** = React + routing, server rendering, API routes, optimizations
- **Vite + React** = simpler, best for learning
