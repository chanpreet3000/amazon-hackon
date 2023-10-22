import React, { useState } from "react";
import ChatProduct from "./ChatProduct";

export default function ChatItem({ data, addAChat }) {
  const [feedbackGiven, setFeedbackGive] = useState(false);
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
              {!feedbackGiven && data.buttons?.length > 0 && (
                <div className="chat-button-list">
                  {data.buttons?.map((element, ind) => {
                    return (
                      <div
                        className="chat-button"
                        key={ind}
                        onClick={() => {
                          addAChat({ role: "assistant", message: "Thanks for the feedback" });
                          setFeedbackGive(true);
                        }}
                      >
                        <div>{element}</div>
                      </div>
                    );
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
