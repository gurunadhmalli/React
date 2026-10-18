import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import React from "react";

const reactElemet = {
  type: "a",
  prop: {
    href: "https://google.com",
    target: "_blank",
  },
  childen: "click me to visite google",
};

function MyApp() {
  return (
    <div>
      <h1>My App</h1>
    </div>
  );
}

const Name = "gurunadh";

const AreactElemet = React.createElement(
  "a",
  { href: "https://google.com", target: "__blank" },
  "click me the google",
);

createRoot(document.getElementById("root")).render(AreactElemet);
