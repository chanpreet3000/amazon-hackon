import "./styles.css";
import React, { useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import { axiosInstance } from "../axios";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate } from "react-router-dom";

export default function ChatBot({ tryName, name, apiUrl, initialMessages }) {
  const [div1Visible, setDiv1Visible] = useState(true);
  const [allChats, setAllChats] = useState(initialMessages);
  const [searchInput, setSearchInput] = useState([]);
  const [isSettingsTabOpened, setIsSettingsTabOpened] = useState(false);
  const [tonePreference, setTonePreference] = useState("Balanced");
  const [lengthPreference, setLengthPreference] = useState("Balanced");
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleDivVisibility = () => {
    setDiv1Visible(!div1Visible);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/customer/dashboard");
        setUserData(response.data.user_data);
      } catch (err) {
        setUserData(null);
      }
    };

    fetchData();
  }, [location]);

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
          buttons: [
            {
              text: "Yes",
              onClick: async () => {
                const response = await axiosInstance.post("/api/customer/feedback", {
                  feedback: "SEARCH_ASSISTANT_YES",
                  conversations: JSON.stringify(allChats),
                });
                console.log(response);
                addAChat({ role: "assistant", message: "Thanks for the feedback" });
              },
            },
            {
              text: "No",
              onClick: async () => {
                const response = await axiosInstance.post("/api/customer/feedback", {
                  feedback: "SEARCH_ASSISTANT_NO",
                  conversations: JSON.stringify(allChats),
                });
                console.log(response);
                addAChat({ role: "assistant", message: "Thanks for the feedback" });
              },
            },
            {
              text: "Later",
              onClick: async () => {
                const response = await axiosInstance.post("/api/customer/feedback", {
                  feedback: "SEARCH_ASSISTANT_LATER",
                  conversations: JSON.stringify(allChats),
                });
                console.log(response);
              },
            },
          ],
        },
      ]);
    }, 3 * 1000);
  };

  const userEnteredQuery = async () => {
    if (searchInput === "") return;
    const updatedChats = [...allChats, { role: "user", message: searchInput }];
    setAllChats(updatedChats);
    setSearchInput("");

    const tempChats = [...updatedChats];

    updatedChats.push({ role: "assistant", message: "..." });
    setAllChats(updatedChats);

    const response = await axiosInstance.post(apiUrl, { query: tempChats, tonePreference, lengthPreference });
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
          buttons: [
            {
              text: "Call An Agent",
              onClick: async () => {
                const response = await axiosInstance.post("/api/customer/feedback", {
                  feedback: "SERVICE_ASSISTANT_CALL_AN_AGENT",
                  conversations: JSON.stringify(allChats),
                });
                console.log(response);
                addAChat({ role: "assistant", message: "An Agent will be calling you soon." });
              },
            },
            {
              text: "Chat With Agent",
              onClick: async () => {
                const response = await axiosInstance.post("/api/customer/feedback", {
                  feedback: "SERVICE_ASSISTANT_CHAT_WITH_AGENT",
                  conversations: JSON.stringify(allChats),
                });
                console.log(response);
                addAChat({ role: "assistant", message: "An Agent will be chatting with you soon." });
              },
            },
            {
              text: "Later",
              onClick: async () => {
                const response = await axiosInstance.post("/api/customer/feedback", {
                  feedback: "SERVICE_ASSISTANT_LATER",
                  conversations: JSON.stringify(allChats),
                });
                console.log(response);
              },
            },
          ],
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

  const handleOptionChange = (event) => {
    setTonePreference(event.target.value);
  };
  const handleOptionChange2 = (event) => {
    setLengthPreference(event.target.value);
  };

  return (
    <>
      {isSettingsTabOpened && (
        <>
          <div className="settings-tab">
            <div className="wrapper">
              <CloseIcon
                style={{ position: "absolute", top: "30px", right: "30px", fontSize: "30px", cursor: "pointer" }}
                onClick={() => {
                  setIsSettingsTabOpened(false);
                }}
              />
              <div style={{ textAlign: "center" }}>
                <h1>User's Preference</h1>
                <div style={{ display: "flex", margin: "0rem 4rem", alignItems: "center" }}>
                  <div class="label-container">
                    <h2>Conversation Style</h2>
                    <div>
                      <label class="container">
                        Creative
                        <input
                          type="radio"
                          name="tone_preference"
                          checked={tonePreference === "Creative"}
                          value={"Creative"}
                          onChange={handleOptionChange}
                        />
                        <span class="checkmark"></span>
                      </label>
                      <label class="container">
                        Balanced
                        <input
                          type="radio"
                          name="tone_preference"
                          checked={tonePreference === "Balanced"}
                          value={"Balanced"}
                          onChange={handleOptionChange}
                        />
                        <span class="checkmark"></span>
                      </label>
                      <label class="container">
                        Precise
                        <input
                          type="radio"
                          name="tone_preference"
                          checked={tonePreference === "Precise"}
                          value={"Precise"}
                          onChange={handleOptionChange}
                        />
                        <span class="checkmark"></span>
                      </label>
                    </div>
                  </div>
                  <div class="label-container">
                    <h2>Response Type</h2>
                    <div>
                      <label class="container">
                        Descriptive
                        <input
                          type="radio"
                          name="length_preference"
                          checked={lengthPreference === "Descriptive"}
                          value={"Descriptive"}
                          onChange={handleOptionChange2}
                        />
                        <span class="checkmark"></span>
                      </label>
                      <label class="container">
                        Balanced
                        <input
                          type="radio"
                          name="length_preference"
                          checked={lengthPreference === "Balanced"}
                          value={"Balanced"}
                          onChange={handleOptionChange2}
                        />
                        <span class="checkmark"></span>
                      </label>
                      <label class="container">
                        Short
                        <input
                          type="radio"
                          name="length_preference"
                          checked={lengthPreference === "Short"}
                          value={"Short"}
                          onChange={handleOptionChange2}
                        />
                        <span class="checkmark"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="chatbox">
        <div className="wrapper">
          <div className={`div1 ${div1Visible ? "" : "hidden"}`}>
            <div>
              <h2>{tryName}</h2>
              {userData === null && <p style={{ color: "red" }}>Please sign in to use chat-bot</p>}
            </div>

            <button
              className="btn"
              onClick={(e) => {
                if (userData === null) {
                  navigate("/login");
                } else {
                  toggleDivVisibility();
                }
              }}
            >
              {userData === null && "Sign In"}
              {userData !== null && "Try Now"}
            </button>
          </div>
          <div className={`div2 ${div1Visible ? "hidden" : ""}`}>
            <div>
              <div className="wrapper">
                <div className="wrapper1">
                  <img src="https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Amazon-512.png" />
                  <h2>{name}</h2>
                </div>
                <SettingsIcon
                  style={{ color: "black", fontSize: "40px", cursor: "pointer" }}
                  onClick={() => {
                    setIsSettingsTabOpened(true);
                  }}
                />
                <CloseIcon
                  style={{ color: "black", fontSize: "40px", cursor: "pointer" }}
                  onClick={() => {
                    setDiv1Visible(true);
                  }}
                />
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
                <div
                  className="end-session-btn"
                  onClick={() => {
                    setAllChats([...initialMessages]);
                  }}
                >
                  Clear Conversation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
