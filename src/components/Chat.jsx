import React from "react";
import { useState, useEffect, useRef } from 'react'

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
        { 
        
        role: "system", content: `
        
        You are an AI assistant that administers the PHQ-9 depression screening questionnaire. Your task is to conduct an interview asking each of the 9 questions on the PHQ-9.
      
        Be direct but compassionate in your communication. If at any point the patient expresses thoughts of self-harm or suicide, calmly express your concern, provide crisis 
        resources, and encourage them to seek help immediately.
        
        PHQ-9 Questions:
  
        1. Little interest or pleasure in doing things
        2. Feeling down, depressed, or hopeless
        3. Trouble falling or staying asleep, or sleeping too much
        4. Feeling tired or having little energy
        5. Poor appetite or overeating
        6. Feeling bad about yourself - or that you are a failure or have let yourself or your family down
        7. Trouble concentrating on things, such as reading the newspaper or watching television
        8. Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual
        9. Thoughts that you would be better off dead or of hurting yourself. 
  

        Answer Choices:

        1. Not at all
        2. Several days
        3. More than half the days 
        4. Nearly every day

  
        The questions should be asked in the format of:
  
        Over the last two weeks have often have you experienced *curr_question* + *answer_choices*

        *note when listing out questions and answer choices, make it as conversational as possible (but remember you need to provide all answer choices and ensure the user responds with one of them). 


        Example:

        Good Question: Great! Let's start with the first question: Over the last two weeks, how often have you experienced little interest or pleasure in doing things? Not at all, several days, more than half the days, or nearly every day?

        Bad Question: Great! Let's start with the first question: Over the last two weeks, how often have you experienced little interest or pleasure in doing things? 1. Not at all 2. Several days 3. More than half the days 4. Nearly every day Please respond with the number that best reflects your experience.
        
        When deciding on whether to ask for an answer clarification or to proceed with the questionnaire, here is a rough system of how you will be expected to score user answers to each question
        at the end of the interview by the following rough key:
  
        For each question, here are associated answers/clusters and point values:
  
        - Not at all = 0 
        - Several days = 1
        - More than half the days = 2 
        - Nearly every day = 3

        If the user does not respond with an answer containing a valid option from above anywhere within the response (especially for users responding with only one word), gently re-issue the question and ask them to answer with a valid answer choice. 
  
        At the end of the survey when scoring, be ready to categorize each of the users' answers into the following categories above when calculating their scores. 
        Remember, you are not allowed to ask the user directly to provide a quantitative score such as 'on a scale of 0-3', instead, the way the questions asked must be fully in natural language.

        ` 
        },
        { role: "assistant", content: "Hello! I'm here to assist you today in running through the PHQ-9, a standard set of guidelines for depression screening. I'll run you through a series of questions related to your mood and daily activities and for each one please provide a response with how often you have experienced the specific symptom in the last. Please enter 'Start' when you're ready. " }
      ]);
      const [attendees, setAttendees] = useState([]);
      const [newMessageText, setNewMessageText] = useState("");
      const [loadingStatus, setLoadingStatus] = useState(false);
      const [interviewStatus, setInterviewStatus] = useState(true);
      const [fetchReplyTrigger, setFetchReplyTrigger] = useState(false);

      const chatContainerRef = React.useRef(null);

      const uuid = props.uuid;

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
        setNewMessageText("");
        setLoadingStatus(true);
        setFetchReplyTrigger(true);
      };  

      useEffect(() => {
        const fetchReply = async () => {
          if (!fetchReplyTrigger) return; // Only proceed if triggered
    
          try {
            const response = await fetch("https://us-central1-marcus-chat-ae955.cloudfunctions.net/app/api/ask", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ messages }),
            });
            const responseBody = await response.json();
            const reply = response.status === 200 ? responseBody.reply : responseBody.error.reply;
            setMessages(currentMessages => [...currentMessages, reply]);
    
            // Store the conversation history
            await fetch("https://us-central1-marcus-chat-ae955.cloudfunctions.net/app/api/store", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ uuid, messages: [...messages, reply] }),
            });
          } catch {
            const reply = { role: "assistant", content: "An error has occured." };
            setMessages(currentMessages => [...currentMessages, reply]);
          }
    
          setLoadingStatus(false);
          setFetchReplyTrigger(false); // Reset the trigger
        };
    
        if (fetchReplyTrigger) {
          fetchReply();
        }
      }, [fetchReplyTrigger]);

      useEffect(() => {
        const fetchUser = async () => {
          try {
            console.log(uuid);
            const response = await fetch(`https://us-central1-marcus-chat-ae955.cloudfunctions.net/app/api/user/${uuid}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data && data.user) {
              setAttendees([data.user.name, "Marcus"]);
            } else {
              throw new Error('User not found in response');
            }
          } catch (error) {
            console.error("Failed to fetch user:", error);
          }
        };
        fetchUser();
      }, [uuid]);

      useEffect(() => {
        console.log("chat messages:", messages.map(msg => `${msg.role}: ${msg.content}`).join(''));
      }, [messages]);


      return (
        <>
          <section className="mx-auto h-screen w-screen flex justify-center items-center pt-5 bg-gray-100 flex flex-wrap gap-5">
            <div className="h-[85%] w-[70%] flex flex-col bg-white rounded-xl shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Marcus PHQ-9 Screening</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">Meeting ID: {uuid}</span>
                  <span className="text-sm font-medium text-gray-500">Status: <span className="text-emerald-400 font-bold">In Progress</span></span>
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
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
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