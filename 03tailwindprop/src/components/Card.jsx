import React from "react";

const Card = ({ username, btnText = "Vist Me" }) => {
  //this is the take props as the obejcts
  // console.log(props); // { username: "Gurunadh", btnText: "Click me" }
  // return <h2>{props.username}</h2>;

  return (
    <div className=" p-4 rounded-xl bg-white shodow">
      <h2 className=" text-xl font-bold">{username}</h2>
      <button className=" mt-2 px-3 py-1 bg-blue-500 text-white rounded">
        {btnText}
      </button>
    </div>
  );
};

export default Card;
