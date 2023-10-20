import React from "react";

export default function ChatItem({ data }) {
  return data.system === true ? (
    <>
      <div className="chat-system fade-in">
        <img src="https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Amazon-512.png" />
        <div className="message">{data.message}</div>
      </div>
    </>
  ) : (
    <>
      <div className="chat-not-system fade-in">
        <img src="https://static.thenounproject.com/png/363633-200.png" />
        <div className="message">{data.message}</div>
      </div>
    </>
  );
}
