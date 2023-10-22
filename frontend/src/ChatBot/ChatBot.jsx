import "./styles.css";
import React, { useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import { axiosInstance } from "../axios";

export default function ChatBot({ tryName, name, apiUrl, initialMessages }) {
  const [div1Visible, setDiv1Visible] = useState(true);
  const [allChats, setAllChats] = useState(initialMessages);
  const [searchInput, setSearchInput] = useState([]);

  const toggleDivVisibility = () => {
    setDiv1Visible(!div1Visible);
  };

  useEffect(() => {
    console.log(allChats);
    scrollSmoothlyToBottom("chat-wrapper");
    if (allChats[allChats.length - 1].result?.length > 0) {
      askUserForFeedBack();
    }
  }, [allChats]);

  const scrollSmoothlyToBottom = (id) => {
    const element = document.getElementById(id);
    element.scrollTop = element.scrollHeight;
  };

  const askUserForFeedBack = async () => {
    setTimeout(() => {
      setAllChats([
        ...allChats,
        {
          role: "assistant",
          message: "Did you find the chatbot helpful? Share your feedback!",
          buttons: ["Yes", "No", "Later"],
        },
      ]);
    }, 3 * 1000);
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
    var content = response.data.content;
    var result = response.data.result;
    updatedChats.pop();

    if (content.includes("[!]")) {
      var list = content.split("[!]");
      content = list[0].trim();
      if (list[1].trim() == "CUSTOMER_NOT_SATISFIED") {
        //TODO request to backend to store feedback
        addAChat({
          role: "assistant",
          message: "",
          buttons: ["Call An Agent", "Chat with Agent", "Maybe Later"],
        });
      } else if (list[1].trim() == "CUSTOMER_SATISFIED") {
        askUserForFeedBack();
      }
    }
    setAllChats([...updatedChats, { role: "assistant", message: content, result: result }]);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      userEnteredQuery();
    }
  };

  const addAChat = (obj) => {
    setTimeout(() => {
      setAllChats([...allChats, obj]);
    }, 2 * 1000);
  };
  return (
    <>
      <div className="chatbox">
        <div className="wrapper">
          <div className={`div1 ${div1Visible ? "" : "hidden"}`}>
            <div>
              <h2>{tryName}</h2>
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
                <h2>{name}</h2>
              </div>
            </div>
            <div>
              <div className="chat-wrapper" id="chat-wrapper">
                {allChats.map((chat, ind) => {
                  return <ChatItem data={chat} key={ind} addAChat={addAChat} />;
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
