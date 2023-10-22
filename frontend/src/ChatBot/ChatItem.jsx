import React from "react";
import ChatProduct from "./ChatProduct";

export default function ChatItem({ data }) {
  return (
    <>
      {data.role === "user" && (
        <>
          <div className="chat-not-system fade-in">
            <img src="https://static.thenounproject.com/png/363633-200.png" />
            <div className="message">
              <div>{data.message}</div>
            </div>
          </div>
        </>
      )}
      {data.role === "assistant" && (
        <>
          <div className="chat-system fade-in">
            <img src="https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Amazon-512.png" />
            <div className={`message ${data.result?.length > 0 ? "result" : ""}`}>
              <div>{data.message}</div>
              {data.result?.length > 0 && (
                <div className="chat-products-list">
                  {data.result?.map((product, ind) => {
                    return <ChatProduct data={product} key={ind} />;
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
