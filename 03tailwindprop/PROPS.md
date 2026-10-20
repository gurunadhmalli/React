# Props in React

## What are props?

**Props** ("properties") are how a **parent** component passes data to a **child** component.
They work like function arguments:

| Plain JavaScript   | React                           |
| ------------------ | ------------------------------- |
| `greet("Ravi")`    | `<Card username="Ravi" />`      |

A React component is just a function. React collects every attribute written on the JSX tag
into **one object** and passes it as the function's first argument.

```js
<Card username="Gurunadh" btnText="Click me" />
// React calls:
Card({ username: "Gurunadh", btnText: "Click me" })
```

## Sending props (parent: `src/App.jsx`)

```jsx
import Card from "./components/Card";

function App() {
  return (
    <>
      <Card username="Gurunadh" btnText="Click me" />
      <Card username="Ravi" />
    </>
  );
}
```

## Receiving props (child: `src/components/Card.jsx`)

**Option A: the whole `props` object**

```jsx
const Card = (props) => {
  console.log(props); // { username: "Gurunadh", btnText: "Click me" }
  return <h2>{props.username}</h2>;
};
```

**Option B: destructuring (most common)**

```jsx
const Card = ({ username, btnText = "Visit me" }) => {
  return (
    <div>
      <h2>{username}</h2>
      <button>{btnText}</button>
    </div>
  );
};
```

`btnText = "Visit me"` is a **default value**. It's used when the parent doesn't pass `btnText`.

## Passing values other than strings

Strings can use quotes. Everything else goes inside `{ }`:

```jsx
<Card
  username="Gurunadh"          // string
  age={22}                     // number
  isActive={true}              // boolean
  skills={["React", "JS"]}     // array
  user={{ city: "Hyderabad" }} // object (outer {} = JS, inner {} = object)
  onClick={() => alert("hi")}  // function
/>
```

## The special `children` prop

Anything placed between the opening and closing tags arrives as `children`:

```jsx
<Card>
  <p>Hello inside card</p>
</Card>

const Card = ({ children }) => <div>{children}</div>;
```

## Rules to remember

1. **Props are read-only.** A child must never change its props (`props.username = "x"` is wrong).
   To change data, keep it in `useState` in the parent and pass the new value down.
2. **Data flows one way, from parent to child.** A child can only send information back up
   if the parent passes it a function as a prop, which the child then calls.
3. **Same component, different props, different output.** This is what makes components reusable.

## Summary

Props are the attributes you write on a component tag. React packs them into one object and
passes that object to the component function, which reads them (usually by destructuring)
to render different content.

## Try it

The working example is in `src/App.jsx` and `src/components/Card.jsx`. Run:

```bash
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).
