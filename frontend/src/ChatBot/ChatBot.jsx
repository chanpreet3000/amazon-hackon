import "./styles.css";
import React, { useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import { axiosInstance } from "../axios";

export default function ChatBot({ apiUrl, initialMessages }) {
  const [div1Visible, setDiv1Visible] = useState(true);
  const [allChats, setAllChats] = useState(initialMessages);
  const [searchInput, setSearchInput] = useState([]);

  const toggleDivVisibility = () => {
    setDiv1Visible(!div1Visible);
  };

  useEffect(() => {
    console.log(allChats);
    scrollSmoothlyToBottom("chat-wrapper");
  }, [allChats]);

  const scrollSmoothlyToBottom = (id) => {
    const element = document.getElementById(id);
    element.scrollTop = element.scrollHeight;
  };

  const userEnteredQuery = async () => {
    if (searchInput === "") return;
    const updatedChats = [...allChats, { role: "user", message: searchInput }];
    setAllChats(updatedChats);
    setSearchInput("");

    const tempChats = structuredClone(updatedChats);

    updatedChats.push({ role: "assistant", message: "..." });
    setAllChats(updatedChats);

    const response = await axiosInstance.post(apiUrl, { query: tempChats });
    const content = response.data.content;
    const result = response.data.result;
    updatedChats.pop();

    setAllChats([...updatedChats, { role: "assistant", message: content, result: result }]);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      userEnteredQuery();
    }
  };
  return (
    <>
      <div className="chatbox">
        <div className="wrapper">
          <div className={`div1 ${div1Visible ? "" : "hidden"}`}>
            <div>
              <h2>Try Amazon's New ChatBot</h2>
            </div>

            <button
              className="btn"
              onClick={(e) => {
                toggleDivVisibility();
              }}
            >
              Try Now
            </button>
          </div>
          <div className={`div2 ${div1Visible ? "hidden" : ""}`}>
            <div>
              <div className="wrapper">
                <img src="https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Amazon-512.png" />
                <h2>Amazon's Chat Bot</h2>
              </div>
            </div>
            <div>
              <div className="chat-wrapper" id="chat-wrapper">
                {allChats.map((chat, ind) => {
                  return <ChatItem data={chat} key={ind} />;
                })}
              </div>
              <div className="chat-input">
                <input
                  placeholder="Type your text here"
                  onKeyDown={handleKeyDown}
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                  }}
                />
                <div className="send-btn" onClick={userEnteredQuery}>
                  <img src="https://cdn-icons-png.flaticon.com/512/3106/3106794.png" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
