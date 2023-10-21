import React, { useEffect, useState } from "react";
import "./styles.css";
import ChatItem from "./ChatItem";
import { axiosInstance } from "../axios";

export default function ChatBot() {
  const [div1Visible, setDiv1Visible] = useState(true);
  const [allChats, setAllChats] = useState([]);
  const [searchInput, setSearchInput] = useState([]);

  useEffect(() => {
    setAllChats([
      { role: "assistant", message: "Hi! I'm Amazon's new interactive chat bot." },
      { role: "assistant", message: "How can I help you today?" },
    ]);
  }, []);

  const toggleDivVisibility = () => {
    setDiv1Visible(!div1Visible);
  };

  useEffect(() => {
    console.log(allChats);
  }, [allChats]);

  
  const userEnteredQuery = async () => {
    if (searchInput === "") return;
    const updatedChats = [...allChats, { role: "user", message: searchInput }];
    setAllChats(updatedChats);
    setSearchInput("");

    const tempChats = structuredClone(updatedChats);

    updatedChats.push({ role: "assistant", message: "..." });
    setAllChats(updatedChats);

    const response = await axiosInstance.post("/api/query/", { query: tempChats });
    const content = response.data.content;
    const result = response.data.result;
    updatedChats.pop();

    if (result.length === 0) {
      setAllChats([...updatedChats, { role: "assistant", message: content }]);
    } else {
      setAllChats([
        ...updatedChats,
        { role: "assistant", message: content },
        { role: "products-list", message: result },
      ]);
    }
    console.log(result);
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
              <div className="chat-wrapper">
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
