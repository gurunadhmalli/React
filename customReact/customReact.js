function customRender(reactElemet, container) {
  //   const docElment = document.createElement(reactElemet.type);
  //   docElment.innnerHTML = reactElemet.childen;
  //   docElment.setAttribute("href", reactElemet.prop.href);
  //   docElment.setAttribute("target", reactElemet.prop.target);
  //   container.appendChild(docElment);

  const domElement = document.createElement(reactElemet.type);

  domElement.innerHTML = reactElemet.childen;
  for (const prop in reactElemet.prop) {
    if (prop == "childen") continue;
    domElement.setAttribute(prop, reactElemet.prop[prop]);
  }
  container.appendChild(domElement);
}

const reactElemet = {
  type: "a",
  prop: {
    href: "https://google.com",
    target: "_blank",
  },
  childen: "click me to visite google",
};

const mainContainer = document.querySelector("#root");

customRender(reactElemet, mainContainer);
