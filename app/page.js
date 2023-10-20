"use client"

import Avvvatars from 'avvvatars-react';
import { useState, useEffect, useRef } from "react";

import "./globals.css";

const ChatMessage = ({ message }) => (
  <div className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"} gap-x-5 p-4 m-4 items-center`}>
    {message.role === "assistant" ? 
    <div className='align-middle'>
        <Avvvatars value={message.role} className="rounded-full" size={50}/>
        <p className="font-bold m-1">{message.role === "assistant" ? "Marcus" : "User"}</p>
    </div> 
    : null}
    <div
      className={`${
        message.role === "assistant"
          ? "text-left bg-white bg-opacity-75 backdropblur-xl shadow-sm rounded-lg p-4 w-fit"
          : "text-right bg-white bg-opacity-75 backdropblur-xl shadow-sm rounded-lg p-4 w-fit"
      }`}
    >
      <p className='text-xs'>{message.content}</p>
    </div>
    {message.role === "user" ? 
    <div className='align-middle'>
        <Avvvatars value={message.role} className="rounded-full" size={50}/>
        <p className="font-bold m-1 ml-3">{message.role === "assistant" ? "Marcus" : "User"}</p>
    </div> 
    : null}
  </div>
);

const ChatInput = ({ newMessageText, onChange, onKeyDown, onSubmit, loadingStatus }) => (
  <div className="z-20 w-full max-w-full sm:max-w-3xl">
    <form className="flex items-end" onSubmit={onSubmit}>
      <textarea
        className="mr-2 text-xs grow resize-none rounded-md font-medium h-10 p-2 bg-gray-100  shadow-sm focus:border-blue-600 focus:outline-none"
        value={newMessageText}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Please enter your response"
      />
      <button
        className={`h-10 rounded-md ${
          loadingStatus
            ? "bg-slate-900 bg-transparent-90 shadow-sm"
            : "bg-sky-800 bg-opacity-75 shadow-sm hover:bg-sky-700"
        } px-1 py-1`}
        type="submit"
        disabled={loadingStatus}
      >
        <p className="font-medium text-white mx-3">Enter</p>
      </button>
    </form>
  </div>
);

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are an intelligent system acting as a virtual agent screening users for depression following the PHQ-9 guidelines. When the user prompts the start of the screening process with the word 'start', you will go through each question on the PHQ-9 one at a time, wait for the users response before starting the next question. For your questions, eliminate the need of multiple choice answers and allow your users to enter in responses for each question along the screen guidelines." },
    { role: "assistant", content: "Hello! I'm here to assist you today in running through the PHQ-9, a standard set of guidelines for depression screening. I'll run you through a series of questions related to your mood and daily activities and for each one please provide a response with how often you have experienced the specific symptom in the last. Please enter 'Start' when you're ready. " }
  ]);
  const [newMessageText, setNewMessageText] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);

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
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
        });
        const responseBody = await response.json();
        const reply = response.status === 200 ? responseBody.reply : responseBody.error.reply;
        setMessages([...messages, reply]);
      } catch {
        const reply = { role: "assistant", content: "An error has occured." };
        setMessages([...messages, reply]);
      }
      setLoadingStatus(false);
    };

    if (loadingStatus === true) {
      fetchReply();
    }
  }, [loadingStatus]);

  return (
    <div className="bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-neutral-500 via-gray-300 to-gray-100">
    <div className="mx-auto h-screen max-w-full sm:max-w-3xl">
      <div className="py-8">
        <h1 className="text-center text-6xl font-medium text-slate-800">Marcus</h1>
      </div>
      <div className="h-[80%] w-full flex flex-col bg-black bg-opacity-5 rounded-xl">
        <div className="flex-grow overflow-auto text-xs font-medium">
          {messages.slice(1).map((message, index) => (
            <ChatMessage key={index.toString()} message={message} />
          ))}
          {loadingStatus && (
            <div className="mx-2 mt-4">
              <p className="font-bold">Marcus is replying...</p>
            </div>
          )}
        </div>
        <div className="m-3">
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
</div>
  );
}