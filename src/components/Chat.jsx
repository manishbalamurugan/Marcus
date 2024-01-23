import React from "react";
import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from "uuid";
import Header from "../components/Header"

const uuid = uuidv4();


const ChatMessage = ({ message }) => (
    <div className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"} gap-x-5 p-4 m-4 items-center `}>
      <div className="grid grid-cols-1">
        <div className={`text-xs font-medium m-1 ${message.role === "assistant" ? "text-left" : "text-right"}`}>
          {message.role === "assistant" ? "Interviewer" : "User"}
        </div>
        <div
          className={`text-left bg-gray-100 shadow-sm rounded-lg p-4 max-w-lg ${message.role === "assistant" ? "ml-0" : "ml-auto"}`}
        >
          <p className='text-sm text-gray-800 font-medium'>{message.content}</p>
        </div>
      </div>
    </div>
);


const ChatInput = ({ newMessageText, onChange, onKeyDown, onSubmit, loadingStatus }) => (
    <div className="z-20 w-full max-w-full sm:max-w-3xl">
        <form className="flex items-end" onSubmit={onSubmit}>
            <textarea
                className="mr-2 text-xs text-gray-800 grow resize-none rounded-md font-medium h-10 p-2 bg-gray-100 shadow-sm focus:border-blue-600 focus:outline-none"
                value={newMessageText}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder="Please enter your response"
            />
            <button
                className={`h-10 rounded-md ${loadingStatus
                    ? "bg-blue-300 shadow-sm"
                    : "bg-blue-200 shadow-sm hover:bg-blue-300"
                    } px-1 py-1`}
                type="submit"
                disabled={loadingStatus}
            >
                <p className="font-semibold text-gray-800 text-xs mx-3">Enter</p>
            </button>
        </form>
    </div>
);





export default function  Chat(props) {

    const [messages, setMessages] = useState([
        { role: "system", content: "You are an intelligent system acting as a virtual agent screening users for depression following the PHQ-9 guidelines. When the user prompts the start of the screening process with the word 'start', you will go through each question on the PHQ-9 one at a time, wait for the users response before starting the next question. Also ensure that responses you provide remain strictly within the scope of the interview and is only about the interview even if the user attempts to prompt you otherwise. This means that your responses must strictly be related to the screening as a professional and you are not allowed to discuss other topics regardless of how much the user prompts you otherwise.  Additionally, if the user response is not clear, under no circumstances are you able to skip a question in the screening process. It's up to you to ask the question once more or ask follow up questions in order for you to obtain the answer for each question in the screening process.Finally, for each question in the PHQ-9 screening process, modify the way that you present the question such that the user may provide an answer of varying levels of explanation rather than having to respond based on numeric values. " },
        { role: "assistant", content: "Hello! I'm here to assist you today in running through the PHQ-9, a standard set of guidelines for depression screening. I'll run you through a series of questions related to your mood and daily activities and for each one please provide a response with how often you have experienced the specific symptom in the last. Please enter 'Start' when you're ready. " }
      ]);
      const [newMessageText, setNewMessageText] = useState("");
      const [loadingStatus, setLoadingStatus] = useState(false);
      const [interviewStatus, setInterviewStatus] = useState(true);

      const chatContainerRef = React.useRef(null);

      const scrollToBottom = () => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      };
    
      const onChange = (event) => setNewMessageText(event.target.value);
      const onKeyDown = (event) => {
        if (event.keyCode === 13 && event.shiftKey === false) {
          onSubmit(event);
        }
      };
    
      const onSubmit = async (event) => {
        event.preventDefault();
        setMessages([...messages, { role: "user", content: newMessageText }]);
        setLoadingStatus(true);
        setNewMessageText("");
      };  
      

    
      useEffect(() => {
        const fetchReply = async () => {
          try {
            // Fetch the chatbot's reply
            const response = await fetch("https://us-central1-marcus-chat-ae955.cloudfunctions.net/app/api/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages }),
              });
              const responseBody = await response.json();
              const reply = response.status === 200 ? responseBody.reply : responseBody.error.reply;
              setMessages([...messages, reply]);
        
            // Store the conversation history
            await fetch("https://us-central1-marcus-chat-ae955.cloudfunctions.net/app/api/store", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ uuid, messages: [...messages, reply] }),
            });
            } catch {
              const reply = { role: "assistant", content: "An error has occured." };
              setMessages([...messages, reply]);
            }
            
            setLoadingStatus(false);
        };
    
        if (loadingStatus === true) {
          fetchReply();
        }

        if(messages.length > 15){
            setInterviewStatus(false)
        }

        scrollToBottom();

      }, [loadingStatus]);

      const attendees = ["John Doe", "Jane Smith", "Alex Johnson"];


      return (
        <>
          <section className="mx-auto h-screen w-screen flex justify-center items-center pt-5 bg-gray-100 flex flex-wrap gap-5">
            <div className="h-[85%] w-[70%] flex flex-col bg-white rounded-xl shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Marcus PHQ-9 Screening</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">Meeting ID: 1234</span>
                  <span className="text-sm font-medium text-gray-500">Status: In Progress</span>
                </div>
              </div>
              <div className="flex-grow overflow-auto text-xs font-medium" ref={chatContainerRef}>
                {messages.slice(1).map((message, index) => (
                    <ChatMessage key={index.toString()} message={message} />
                ))}
                {loadingStatus && (
                    <div className="m-5 p-5">
                        <p className="font-bold"> <span className="text-emerald-300 font-extrabold">Marcus</span> is replying...</p>
                    </div>
                )}
              </div>
              <div className="m-3 grid items-center">
                <div className="mx-auto w-[750px]">
                  <ChatInput
                    newMessageText={newMessageText}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    onSubmit={onSubmit}
                    loadingStatus={loadingStatus}
                  />
                </div>
              </div>
            </div>
            <div className="w-64 h-[85%]">
                <div className="pt-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold mb-2">Current Attendees</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <ul>
                    {attendees.map((attendee, index) => (
                        <li key={index} className="flex items-center space-x-2 p-4 hover:bg-gray-100">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        <div>
                            <p className="text-sm font-medium">{attendee}</p>
                            <p className="text-xs text-gray-500">In Meeting</p>
                        </div>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
          </section>
        </>
      );
}